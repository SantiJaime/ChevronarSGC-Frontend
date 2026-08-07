import { useState } from "react";
import { Formik } from "formik";
import { addPaymentMethodSchema } from "../../utils/validationSchemas";
import { CREDIT_CARDS, DEBIT_CARDS, SALE_CONDITIONS } from "../../constants/const";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { NumericFormat } from "react-number-format";
import { TAX_CONFIG, TaxTable } from "../../constants/card_tax";
import { formatPrice } from "../../utils/utils";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

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
      toast.error("No se pueden agregar mas métodos de pago", {
        description: "El valor total de la factura ya se ha alcanzado",
      });
      return;
    }

    if (values.method !== "Crédito") {
      values.paymentsQuantity = "1";
    }

    let valueWithInterest = Number(values.valueToPay);
    let interest: number | null = null;
    let taxTable: TaxTable | null = null;

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

      valueWithInterest += valueWithInterest * interest;
    }
    setPaymentMethods((prevPaymentMethods) => [
      ...prevPaymentMethods,
      { ...values, valueWithInterest },
    ]);
    setPaymentsLeftValue(remainingAfterPayment);
    handleClose();
  };

  return (
    <>
      <Button onClick={handleShow}>
        Agregar método de pago
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Agregar un método de pago (valor restante: ${formatPrice(paymentsLeftValue)})
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
              handleAddPayment({...newValues, valueWithInterest: Number(newValues.valueToPay)});
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <div className="flex flex-col">
                <div className="mb-4">
                  <Label htmlFor="methodId">Método de pago</Label>
                  <Select
                    id="methodId"
                    onChange={handleChange}
                    name="method"
                    value={values.method}
                    error={touched.method && !!errors.method}
                    className="mt-1"
                  >
                    <option value="">Sin seleccionar método de pago</option>
                    {SALE_CONDITIONS.slice(0, 5).map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </Select>
                  {errors.method && touched.method && (
                    <span className="text-sm text-destructive">{errors.method}</span>
                  )}
                </div>
                
                {values.method === "Crédito" && (
                  <>
                    <div className="mb-4">
                      <Label htmlFor="creditCardId">Tarjeta de crédito</Label>
                      <Select
                        id="creditCardId"
                        name="creditCard"
                        value={values.creditCard}
                        onChange={handleChange}
                        error={touched.creditCard && !!errors.creditCard}
                        className="mt-1"
                      >
                        <option value="">Sin seleccionar tarjeta de crédito</option>
                        {CREDIT_CARDS.map((card) => (
                          <option key={card} value={card}>{card}</option>
                        ))}
                      </Select>
                      {errors.creditCard && touched.creditCard && (
                        <span className="text-sm text-destructive">{errors.creditCard}</span>
                      )}
                    </div>
                    <div className="mb-4">
                      <Label htmlFor="paymentsQuantityId">Cantidad de cuotas</Label>
                      <Input
                        id="paymentsQuantityId"
                        placeholder="Ej: 3"
                        type="text"
                        name="paymentsQuantity"
                        value={values.paymentsQuantity}
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            void handleSubmit();
                          }
                        }}
                        error={touched.paymentsQuantity && !!errors.paymentsQuantity}
                        className="mt-1"
                      />
                      {errors.paymentsQuantity && touched.paymentsQuantity && (
                        <span className="text-sm text-destructive">{errors.paymentsQuantity}</span>
                      )}
                    </div>
                  </>
                )}
                
                {values.method === "Tarjeta de débito" && (
                  <div className="mb-4">
                    <Label htmlFor="debitCardId">Tarjeta de débito</Label>
                    <Select
                      id="debitCardId"
                      name="debitCard"
                      value={values.debitCard}
                      onChange={handleChange}
                      error={touched.debitCard && !!errors.debitCard}
                      className="mt-1"
                    >
                      <option value="">Sin seleccionar tarjeta de débito</option>
                      {DEBIT_CARDS.map((card) => (
                        <option key={card} value={card}>{card}</option>
                      ))}
                    </Select>
                    {errors.debitCard && touched.debitCard && (
                      <span className="text-sm text-destructive">{errors.debitCard}</span>
                    )}
                  </div>
                )}
                
                <div className="mb-4">
                  <Label htmlFor="valueToPayId">Valor a pagar</Label>
                  <NumericFormat
                    id="valueToPayId"
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    prefix="$"
                    name="price"
                    placeholder="10.000"
                    value={values.valueToPay}
                    onValueChange={({ value }) => setFieldValue("valueToPay", value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void handleSubmit();
                      }
                    }}
                    className={`flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring mt-1 ${
                      touched.valueToPay && errors.valueToPay ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.valueToPay && touched.valueToPay && (
                    <span className="text-sm text-destructive">{errors.valueToPay}</span>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="dark"
                    type="button"
                    onClick={() => {
                      void handleSubmit();
                    }}
                  >
                    Agregar método de pago
                  </Button>
                </div>
              </div>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddPaymentMethod;
