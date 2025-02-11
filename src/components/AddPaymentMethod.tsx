import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import { addPaymentMethodSchema } from "../utils/validationSchemas";
import { CREDIT_CARDS, DEBIT_CARDS } from "../constants/const";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

interface Props {
  setPaymentMethods: React.Dispatch<React.SetStateAction<PaymentMethods[]>>;
  setPaymentsLeftValue: React.Dispatch<React.SetStateAction<number>>;
  paymentsLeftValue: number;
}

const AddPaymentMethod: React.FC<Props> = ({
  setPaymentMethods,
  setPaymentsLeftValue,
  paymentsLeftValue,
}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddPayment = (values: PaymentMethods) => {
    if (values.valueToPay === "0") {
      toast.error("El valor a pagar no puede ser 0");
      return;
    }
    const remainingAfterPayment = paymentsLeftValue - Number(values.valueToPay);

    if (remainingAfterPayment < 0) {
      toast.error("No se pueden agregar más métodos de pago", {
        description: "El valor total de la factura ya se ha alcanzado",
      });
      return;
    }

    if (
      !(
        values.method === "Tarjeta de crédito" ||
        values.method === "Tarjeta de débito"
      )
    ) {
      values.paymentsQuantity = "1";
    }
    setPaymentMethods((prevPaymentMethods) => [...prevPaymentMethods, values]);
    setPaymentsLeftValue(remainingAfterPayment);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Agregar método de pago
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Agregar un método de pago (valor restante: ${paymentsLeftValue})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={addPaymentMethodSchema}
            initialValues={{
              method: "",
              creditCard: "",
              debitCard: "",
              paymentsQuantity: "1",
              valueToPay: paymentsLeftValue.toString(),
            }}
            onSubmit={(values) => {
              const newValues = { ...values, id: uuidv4() };
              handleAddPayment(newValues);
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="methodId">
                  <Form.Label>Método de pago</Form.Label>
                  <Form.Select
                    onChange={handleChange}
                    name="method"
                    value={values.method}
                    isInvalid={touched.method && !!errors.method}
                  >
                    <option value="">Sin seleccionar método de pago</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Tarjeta de crédito">
                      Tarjeta de crédito
                    </option>
                    <option value="Tarjeta de débito">Tarjeta de débito</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.method && touched.method && errors.method}
                  </Form.Control.Feedback>
                </Form.Group>
                {values.method === "Tarjeta de crédito" ? (
                  <Form.Group className="mb-3" controlId="creditCardId">
                    <Form.Label>Tarjeta de crédito</Form.Label>
                    <Form.Select
                      name="creditCard"
                      value={values.creditCard}
                      onChange={handleChange}
                      isInvalid={touched.creditCard && !!errors.creditCard}
                    >
                      <option value="">
                        Sin seleccionar tarjeta de crédito
                      </option>
                      {CREDIT_CARDS.map((card) => (
                        <option key={card} value={card}>
                          {card}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.creditCard &&
                        touched.creditCard &&
                        errors.creditCard}
                    </Form.Control.Feedback>
                  </Form.Group>
                ) : values.method === "Tarjeta de débito" ? (
                  <Form.Group className="mb-3" controlId="debitCardId">
                    <Form.Label>Tarjeta de débito</Form.Label>
                    <Form.Select
                      name="debitCard"
                      value={values.debitCard}
                      onChange={handleChange}
                      isInvalid={touched.debitCard && !!errors.debitCard}
                    >
                      <option value="">
                        Sin seleccionar tarjeta de débito
                      </option>
                      {DEBIT_CARDS.map((card) => (
                        <option key={card} value={card}>
                          {card}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.debitCard &&
                        touched.debitCard &&
                        errors.debitCard}
                    </Form.Control.Feedback>
                  </Form.Group>
                ) : (
                  ""
                )}
                {values.method === "Tarjeta de crédito" ||
                values.method === "Tarjeta de débito" ? (
                  <Form.Group className="mb-3" controlId="paymentsQuantityId">
                    <Form.Label>Cantidad de cuotas</Form.Label>
                    <Form.Control
                      placeholder="Ej: 3"
                      type="text"
                      name="paymentsQuantity"
                      value={values.paymentsQuantity}
                      onChange={handleChange}
                      isInvalid={
                        touched.paymentsQuantity && !!errors.paymentsQuantity
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.paymentsQuantity &&
                        touched.paymentsQuantity &&
                        errors.paymentsQuantity}
                    </Form.Control.Feedback>
                  </Form.Group>
                ) : (
                  ""
                )}
                <Form.Group className="mb-3" controlId="valueToPayId">
                  <Form.Label>Valor a pagar</Form.Label>
                  <Form.Control
                    placeholder="Ej: $1000"
                    type="texxt"
                    name="valueToPay"
                    value={values.valueToPay}
                    onChange={handleChange}
                    isInvalid={touched.valueToPay && !!errors.valueToPay}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.valueToPay &&
                      touched.valueToPay &&
                      errors.valueToPay}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button variant="dark" type="submit">
                    Agregar método
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

export default AddPaymentMethod;
