import { Formik } from "formik";
import { useEffect, useState } from "react";
import { CREDIT_CARDS, DEBIT_CARDS, SALE_CONDITIONS } from "../../constants/const";
import {
  authorizeSaleSchema,
  IAuthorizeSale,
} from "../../utils/validationSchemas";
import { TAX_CONFIG, TaxTable } from "../../constants/card_tax";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { validateAuthorizeSale } from "../../utils/validationFunctions";
import { formatPrice } from "../../utils/utils";
import AddPaymentMethod from "../payments/AddPaymentMethod";
import MultiplePaymentsTable from "../payments/MultiplePaymentsTable";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";
import { Spinner } from "../ui/Spinner";
import { BadgeCheck, DollarSign, CreditCard, Wallet } from "lucide-react";

interface FullPaymentsInfo extends IAuthorizeSale {
  totalValue: number;
  payments?: PaymentMethods[];
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
  const [paymentsLeftValue, setPaymentsLeftValue] = useState(sale.total);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([]);
  const [multiplePaymentsTotal, setMultiplePaymentsTotal] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (values: IAuthorizeSale, resetForm: () => void) => {
    const errors = validateAuthorizeSale(
      values,
      sale.total,
      multiplePaymentsTotal,
    );

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
    
    if (values.method === "Múltiples métodos de pago") {
      Swal.fire({
        title: "¿Estás seguro de autorizar?",
        text: `Subtotal: $${formatPrice(sale.total)} - Total con interés: $${formatPrice(multiplePaymentsTotal)}`,
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
            totalValue: multiplePaymentsTotal,
            payments: paymentMethods,
          })
            .then(() => {
              handleClose();
              resetForm();
            })
            .finally(() => setLoading(false));
        }
      });
      return;
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

  const handleDeletePaymentMethod = (id: string) => {
    const newPaymentMethods = paymentMethods.filter(
      (paymentMethod) => paymentMethod.id !== id,
    );
    const updatedTotal = newPaymentMethods.reduce(
      (total, paymentMethod) => total + Number(paymentMethod.valueToPay),
      0,
    );
    setPaymentsLeftValue(multiplePaymentsTotal - updatedTotal);
    setPaymentMethods(newPaymentMethods);
  };

  useEffect(() => {
    const multiplePaymentsTotal = paymentMethods.reduce(
      (total, paymentMethod) => total + Number(paymentMethod.valueToPay),
      0,
    );
    const multiplePaymentsTotalWithInterest = paymentMethods.reduce(
      (total, paymentMethod) => total + Number(paymentMethod.valueWithInterest),
      0,
    );

    const total = sale.total - multiplePaymentsTotal;
    setPaymentsLeftValue(total);
    setMultiplePaymentsTotal(multiplePaymentsTotalWithInterest);
  }, [paymentMethods, sale.total]);

  return (
    <>
      <Button variant="info" size="sm" onClick={handleShow}>
        <BadgeCheck className="h-4 w-4" />
        <span>Autorizar</span>
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
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
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="methodId">Método de pago</Label>
                  <div className="relative mt-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <Select
                      id="methodId"
                      name="method"
                      value={values.method}
                      onChange={handleChange}
                      error={touched.method && !!errors.method}
                      className="pl-10"
                    >
                      <option value="">Método de pago no seleccionado</option>
                      {SALE_CONDITIONS.map((cond) => (
                        <option key={cond} value={cond}>{cond}</option>
                      ))}
                    </Select>
                  </div>
                  {errors.method && touched.method && (
                    <span className="text-sm text-destructive">{errors.method}</span>
                  )}
                </div>
                
                {values.method === "Crédito" && (
                  <>
                    <div className="mb-4">
                      <Label htmlFor="creditCardId">Tarjeta de crédito</Label>
                      <div className="relative mt-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <Select
                          id="creditCardId"
                          name="creditCard"
                          value={values.creditCard}
                          onChange={(ev) => {
                            setFieldValue("creditCard", ev.target.value);
                          }}
                          className="pl-10"
                        >
                          <option value="">Tarjeta de crédito no seleccionada</option>
                          {CREDIT_CARDS.map((card) => (
                            <option key={card} value={card}>{card}</option>
                          ))}
                        </Select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="paymentsQuantityId">Cantidad de cuotas</Label>
                      <div className="relative mt-1">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          <Wallet className="h-4 w-4" />
                        </div>
                        <Input
                          id="paymentsQuantityId"
                          type="text"
                          name="paymentsQuantity"
                          value={values.paymentsQuantity}
                          onChange={handleChange}
                          error={touched.paymentsQuantity && !!errors.paymentsQuantity}
                          className="pl-10"
                        />
                      </div>
                      {errors.paymentsQuantity && touched.paymentsQuantity && (
                        <span className="text-sm text-destructive">{errors.paymentsQuantity}</span>
                      )}
                    </div>
                  </>
                )}
                
                {values.method === "Débito" && (
                  <div className="mb-4">
                    <Label htmlFor="debitCardId">Tarjeta de débito</Label>
                    <div className="relative mt-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <Select
                        id="debitCardId"
                        name="debitCard"
                        value={values.debitCard}
                        onChange={handleChange}
                        className="pl-10"
                      >
                        <option value="">Tarjeta de débito no seleccionada</option>
                        {DEBIT_CARDS.map((card) => (
                          <option key={card} value={card}>{card}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                )}
                
                {values.method === "Múltiples métodos de pago" && (
                  <>
                    <div className="flex justify-end mb-4">
                      <AddPaymentMethod
                        setPaymentMethods={setPaymentMethods}
                        setPaymentsLeftValue={setPaymentsLeftValue}
                        paymentsLeftValue={paymentsLeftValue}
                      />
                    </div>
                    <MultiplePaymentsTable
                      paymentMethods={paymentMethods}
                      handleDeletePaymentMethod={handleDeletePaymentMethod}
                    />
                  </>
                )}
                
                <hr className="border-border my-4" />
                
                <div className="flex justify-between items-center">
                  <h6 className="font-medium">Subtotal a pagar: ${formatPrice(sale.total)}</h6>
                  <Button variant="dark" type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner size="sm" variant="light" />
                        <span>Cargando...</span>
                      </>
                    ) : (
                      <>
                        <BadgeCheck className="h-4 w-4" />
                        <span>Autorizar</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthorizeSaleComp;
