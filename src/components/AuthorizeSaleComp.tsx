import { Formik } from "formik";
import { useState } from "react";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import {
  CashCoin,
  CreditCard,
  CreditCard2Back,
  PatchCheck,
  Wallet,
} from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CREDIT_CARDS, DEBIT_CARDS, SALE_CONDITIONS } from "../constants/const";
import {
  authorizeSaleSchema,
  IAuthorizeSale,
} from "../utils/validationSchemas";
import { TAX_CONFIG, TaxTable } from "../constants/card_tax";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { validateAuthorizeSale } from "../utils/validationFunctions";
import { formatPrice } from '../utils/utils';

interface FullPaymentsInfo extends IAuthorizeSale {
  totalValue: number;
}

interface Props {
  sale: FullSale;
  handleAuthorizeSale: (
    id: string,
    paymentsInfo: FullPaymentsInfo,
  ) => Promise<void>;
}

const AuthorizeSaleComp: React.FC<Props> = ({ sale, handleAuthorizeSale }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (values: IAuthorizeSale, resetForm: () => void) => {
    const errors = validateAuthorizeSale(values);

    if (errors) {
      toast.error(errors);
      return;
    }

    let interest: number | null = null;
    let taxTable: TaxTable | null = null;
    let totalValue = sale.total;

    if (values.method === "Crédito") {
      const payments = isNaN(Number(values.paymentsQuantity))
        ? values.paymentsQuantity.toUpperCase()
        : Number(values.paymentsQuantity);

      taxTable = TAX_CONFIG[values.creditCard as string];
      interest = taxTable[payments];

      if (interest === undefined) {
        toast.error(
          `No existen ${values.paymentsQuantity} cuotas para la tarjeta ${values.creditCard}`,
        );
        return;
      }

      totalValue += totalValue * interest;
    }
    Swal.fire({
      title: "¿Estás seguro de autorizar?",
      text: `Interés: ${(interest ?? 0) * 100}% - Valor total: $${formatPrice(totalValue)}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, autorizar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        handleAuthorizeSale(sale._id, {
          ...values,
          paymentsQuantity: values.paymentsQuantity.toUpperCase(),
          totalValue,
        })
          .then(() => {
            handleClose();
            resetForm();
          })
          .finally(() => setLoading(false));
      }
    });
  };

  return (
    <>
      <Button
        variant="info"
        className="d-flex align-items-center gap-1"
        // onClick={() => handleAuthorizeSale(sale._id)}
        onClick={handleShow}
      >
        <PatchCheck />
        <span>Autorizar</span>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar método de pago para autorizar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={authorizeSaleSchema}
            onSubmit={(values, { resetForm }) =>
              handleSubmit(values, resetForm)
            }
            initialValues={{
              method: "",
              creditCard: "",
              debitCard: "",
              paymentsQuantity: "1",
            }}
          >
            {({
              values,
              handleChange,
              handleSubmit,
              errors,
              touched,
              setFieldValue,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="methodId">
                  <Form.Label>Método de pago</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <CashCoin />
                    </InputGroup.Text>
                    <Form.Select
                      name="method"
                      value={values.method}
                      onChange={handleChange}
                      isInvalid={touched.method && !!errors.method}
                    >
                      <option value={""}>Método de pago no seleccionado</option>
                      {SALE_CONDITIONS.map((cond) => (
                        <option key={cond} value={cond}>
                          {cond}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.method && touched.method ? errors.method : ""}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                {values.method === "Crédito" && (
                  <>
                    <Form.Group className="mb-3" controlId="creditCardId">
                      <Form.Label>Tarjeta de crédito</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <CreditCard />
                        </InputGroup.Text>
                        <Form.Select
                          name="creditCard"
                          value={values.creditCard}
                          onChange={(ev) => {
                            setFieldValue("creditCard", ev.target.value);
                          }}
                        >
                          <option value={""}>
                            Tarjeta de crédito no seleccionada
                          </option>
                          {CREDIT_CARDS.map((card) => (
                            <option key={card} value={card}>
                              {card}
                            </option>
                          ))}
                        </Form.Select>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="paymentsQuantityId">
                      <Form.Label>Cantidad de cuotas</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <Wallet />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          name="paymentsQuantity"
                          value={values.paymentsQuantity}
                          onChange={handleChange}
                          isInvalid={
                            touched.paymentsQuantity &&
                            !!errors.paymentsQuantity
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.paymentsQuantity && touched.paymentsQuantity
                            ? errors.paymentsQuantity
                            : ""}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </>
                )}
                {values.method === "Débito" && (
                  <Form.Group className="mb-3" controlId="debitCardId">
                    <Form.Label>Tarjeta de débito</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <CreditCard2Back />
                      </InputGroup.Text>
                      <Form.Select
                        name="debitCard"
                        value={values.debitCard}
                        onChange={handleChange}
                      >
                        <option value={""}>
                          Tarjeta de débito no seleccionada
                        </option>
                        {DEBIT_CARDS.map((card) => (
                          <option key={card} value={card}>
                            {card}
                          </option>
                        ))}
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                )}
                <div className="d-flex justify-content-end">
                  <Button
                    variant="dark"
                    type="submit"
                    className="d-flex align-items-center gap-1"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" variant="light" size="sm" />
                        <span>Cargando...</span>
                      </>
                    ) : (
                      <>
                        <PatchCheck />
                        <span>Autorizar</span>
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthorizeSaleComp;
