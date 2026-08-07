import React, { useState } from "react";
import { Button } from "../ui/Button";
import {
  CreditCard,
  DollarSign,
  Pencil,
  Save,
  Tag,
  Wallet,
  X,
} from "lucide-react";
import { Modal } from "../ui/Modal";
import { Formik } from "formik";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Spinner } from "../ui/Spinner";
import {
  CREDIT_CARDS,
  DEBIT_CARDS,
  SALE_CONDITIONS,
} from "../../constants/const";
import { NumericFormat } from "react-number-format";
import {
  IUpdateSalePaymentMethod,
  updateSalePaymentMethodSchema,
} from "../../utils/validationSchemas";
import { TAX_CONFIG, TaxTable } from "../../constants/card_tax";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { formatPrice } from "../../utils/utils";
import useSales from "../../hooks/useSales";
import { validateAuthorizeSale } from "../../utils/validationFunctions";

interface FormValues {
  total: number;
  method: string;
  creditCard: string;
  debitCard: string;
  paymentsQuantity: string;
}

interface Props {
  sale: FullSaleWithPayments;
}

const UpdateSalePaymentMethods: React.FC<Props> = ({ sale }) => {
  const { handleUpdatePaymentMethod, loadingAuthorize } = useSales();

  const [paymentMethods, setPaymentMethods] = useState(() => {
    const paymentsArray = (sale?.payments || "")
      .split("-")
      .map((item) => item.trim());
    const [method = "", secondParam = "", thirdParam = ""] = paymentsArray;

    const result = {
      method,
      creditCard: method === "Crédito" ? secondParam : "",
      debitCard: method === "Débito" ? secondParam : "",
      paymentsQuantity:
        method === "Crédito" ? thirdParam.split(" ")[0] || "1" : "1",
    };

    return result;
  });
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (values: IUpdateSalePaymentMethod) => {
    const errors = validateAuthorizeSale(values, values.total);

    if (errors) {
      toast.error(errors);
      return;
    }

    let interest: number | null = null;
    let taxTable: TaxTable | null = null;

    let totalWithInterest = values.total;

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

      totalWithInterest += totalWithInterest * interest;
    }

    Swal.fire({
      title:
        "¿Estás seguro de modificar el método de pago de este presupuesto?",
      text: `Interés: ${(interest ?? 0) * 100}% - Valor total: $${formatPrice(totalWithInterest)}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, guardar cambios",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdatePaymentMethod(sale._id, {
          ...values,
          paymentsQuantity: values.paymentsQuantity.toUpperCase(),
          totalWithInterest,
        }).then(() => {
          handleClose();
          setPaymentMethods({
            method: values.method,
            creditCard: values.creditCard || "",
            debitCard: values.debitCard || "",
            paymentsQuantity: values.paymentsQuantity || "1",
          });
        });
      }
    });
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        <Pencil className="h-4 w-4" />
        <span>Editar métodos de pago</span>
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <div>
            <Modal.Title>Editar métodos de pago</Modal.Title>
            <small className="text-slate-400">
              Nota: esto no modificará los métodos de pago en el PDF ya
              generado. Sin embargo, si cambiará los datos a la hora de exportar
              las ventas a Excel.
            </small>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Formik<FormValues>
            validationSchema={updateSalePaymentMethodSchema}
            initialValues={{
              total: sale.total,
              method: paymentMethods.method,
              creditCard: paymentMethods.creditCard,
              debitCard: paymentMethods.debitCard,
              paymentsQuantity: paymentMethods.paymentsQuantity,
            }}
            onSubmit={(values) => handleSubmit(values)}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => {
              return (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Label htmlFor="saleTotalId">Valor total de la venta</Label>
                    <div className="relative mt-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <NumericFormat
                        id="saleTotalId"
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        prefix="$"
                        name="total"
                        placeholder="10.000"
                        value={values.total}
                        onValueChange={({ value }) =>
                          setFieldValue("total", Number(value))
                        }
                        className={`flex h-10 w-full rounded-lg border bg-background pl-10 pr-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          touched.total && errors.total
                            ? "border-destructive"
                            : "border-input"
                        }`}
                      />
                    </div>
                    {errors.total && touched.total && (
                      <span className="text-sm text-destructive">
                        {errors.total}
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="salePaymentMethod">Método de pago</Label>
                    <div className="relative mt-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                        <Tag className="h-4 w-4" />
                      </div>
                      <Select
                        id="salePaymentMethod"
                        onChange={handleChange}
                        value={values.method}
                        name="method"
                        error={touched.method && !!errors.method}
                        className="pl-10"
                      >
                        {SALE_CONDITIONS.filter((_, index) => index <= 4).map(
                          (option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ),
                        )}
                      </Select>
                    </div>
                    {errors.method && touched.method && (
                      <span className="text-sm text-destructive">
                        {errors.method}
                      </span>
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
                            <option value="">
                              Tarjeta de crédito no seleccionada
                            </option>
                            {CREDIT_CARDS.map((card) => (
                              <option key={card} value={card}>
                                {card}
                              </option>
                            ))}
                          </Select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="paymentsQuantityId">
                          Cantidad de cuotas
                        </Label>
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
                            error={
                              touched.paymentsQuantity &&
                              !!errors.paymentsQuantity
                            }
                            className="pl-10"
                          />
                        </div>
                        {errors.paymentsQuantity &&
                          touched.paymentsQuantity && (
                            <span className="text-sm text-destructive">
                              {errors.paymentsQuantity}
                            </span>
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
                          <option value="">
                            Tarjeta de débito no seleccionada
                          </option>
                          {DEBIT_CARDS.map((card) => (
                            <option key={card} value={card}>
                              {card}
                            </option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  )}
                  <hr className="border-border my-4" />
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={handleClose}>
                      <X className="h-4 w-4" />
                      <span>Cancelar</span>
                    </Button>
                    <Button
                      variant="default"
                      type="submit"
                      disabled={loadingAuthorize}
                    >
                      {loadingAuthorize ? (
                        <>
                          <Spinner size="sm" variant="dark" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Guardar cambios</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UpdateSalePaymentMethods;
