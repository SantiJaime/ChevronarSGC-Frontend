import { useFormik } from "formik";
import { useState } from "react";
import { salesAmountsSchema } from "../../utils/validationSchemas";
import { formatPrice } from "../../utils/utils";
import useSales from "../../hooks/useSales";
import { NUMBER_STRING_PAYMENTS } from "../../constants/const";
import { toast } from "sonner";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Spinner } from "../ui/Spinner";
import { Coins, Calculator, Table } from "lucide-react";

interface FormValues {
  date: string;
}

const SalesAmountsComp = () => {
  const { handleGetSalesAmounts, loading, handleExportToSheets, handleGetGoogleSheet } = useSales();
  const [show, setShow] = useState(false);
  const [overall, setOverall] = useState<{
    totalCollected: number;
    salesQuantity: number;
  } | null>(null);
  const [byPaymentMethodId, setByPaymentMethodId] = useState<
    { paymentMethodId: number; totalCollected: number; salesQuantity: number }[]
  >([]);
  const [date, setDate] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const formik = useFormik<FormValues>({
    onSubmit: async (values) => {
      const res = await handleGetSalesAmounts(values.date);
      if (res) {
        setDate(values.date.split("T")[0].split("-").reverse().join("/"));
        setOverall({
          totalCollected: res.totalCollected,
          salesQuantity: res.salesQuantity,
        });
        setByPaymentMethodId(res.byPaymentMethodId);
      }
    },
    initialValues: {
      date: "",
    },
    validationSchema: salesAmountsSchema,
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  const handleClickSheets = async () => {
    if (!values.date) {
      toast.error("Seleccione una fecha para exportar los datos");
      return;
    }

    const res = await handleExportToSheets(values.date);
    if (res) {
      open(res.sheetUrl, "_blank");
      toast.success(res.msg, {
        description: (
          <div style={{ marginTop: "8px" }}>
            En caso de la planilla no se abra, podés visualizarla aquí:
            <br />
            <a
              href={res.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3b82f6",
                textDecoration: "underline",
                fontWeight: "bold",
                marginTop: "4px",
                display: "inline-block",
              }}
            >
              Ver planilla
            </a>
          </div>
        ),
        duration: 5000,
        closeButton: true,
      });
    }
  };

  const handleClickGetSheets = async () => {
    if (!values.date) {
      toast.error("Seleccione una fecha para ver la hoja de cálculo");
      return;
    }

    const res = await handleGetGoogleSheet(values.date);
    if (res) {
      open(res.sheetUrl, "_blank");
      toast.success(res.msg, {
        description: (
          <div style={{ marginTop: "8px" }}>
            En caso de la planilla no se abra, podés visualizarla aquí:
            <br />
            <a
              href={res.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3b82f6",
                textDecoration: "underline",
                fontWeight: "bold",
                marginTop: "4px",
                display: "inline-block",
              }}
            >
              Ver planilla
            </a>
          </div>
        ),
        duration: 5000,
        closeButton: true,
      });
    }
  };
  return (
    <>
      <Button variant="default" onClick={handleShow}>
        <Coins className="h-4 w-4" />
        <span>Planillas de ventas</span>
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Planilla de ventas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form noValidate onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="dateId">Fecha del dia a exportar y/o calcular las ventas</Label>
              <Input
                id="dateId"
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
                error={touched.date && !!errors.date}
                className="mt-1"
              />
              {errors.date && touched.date && (
                <span className="text-sm text-destructive">{errors.date}</span>
              )}
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="primary"
                disabled={loading}
                onClick={handleClickGetSheets}
              >
                <Table className="h-4 w-4" />
                <span>Ver hoja de cálculo</span>
                
              </Button>
              <Button
                type="button"
                variant="success"
                disabled={loading}
                onClick={handleClickSheets}
              >
                <Table className="h-4 w-4" />
                <span>Exportar a Excel (regenera la hoja)</span>
              </Button>
              <Button variant="default" type="submit" disabled={loading}>
                <Calculator className="h-4 w-4" />
                <span>Calcular montos de ventas</span>
              </Button>
            </div>
          </form>
          
          {loading && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <Spinner size="lg" />
              <h5 className="text-lg font-medium">Cargando...</h5>
            </div>
          )}
          
          {overall && !loading && (
            <>
              <hr className="border-border my-4" />
              <h5 className="font-semibold">Resumen general del dia {date}</h5>
              <p className="mt-2">
                <strong>Total recaudado:</strong> ${formatPrice(overall.totalCollected)}
              </p>
              <p>
                <strong>Cantidad de ventas:</strong> {overall.salesQuantity}
              </p>
              <h5 className="font-semibold mt-4">Resumen por método de pago</h5>
              <ul className="list-disc list-inside mt-2">
                {byPaymentMethodId.map((paymentMethod) => (
                  <li key={paymentMethod.paymentMethodId}>
                    <strong>{NUMBER_STRING_PAYMENTS[paymentMethod.paymentMethodId]}:</strong>{" "}
                    ${formatPrice(paymentMethod.totalCollected)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SalesAmountsComp;
