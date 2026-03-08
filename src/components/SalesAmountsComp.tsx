import { useFormik } from "formik";
import { useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { CalculatorFill, Coin, Table } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { salesAmountsSchema } from "../utils/validationSchemas";
import { formatPrice } from "../utils/utils";
import useSales from "../hooks/useSales";
import { NUMBER_STRING_PAYMENTS } from "../constants/const";
import { toast } from "sonner";

interface FormValues {
  date: string;
}

const SalesAmountsComp = () => {
  const { handleGetSalesAmounts, loading, handleExportToSheets } = useSales();
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

  return (
    <>
      <Button
        variant="dark"
        className="d-flex align-items-center gap-2"
        onClick={handleShow}
      >
        <Coin />
        <span>Planillas de ventas</span>
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Planilla de ventas</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha del día a exportar y/o calcular las ventas</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={values.date}
                onChange={handleChange}
                isInvalid={touched.date && !!errors.date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date && touched.date ? errors.date : ""}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="success"
                className="d-flex align-items-center gap-2"
                disabled={loading}
                onClick={handleClickSheets}
              >
                <Table />
                <span>Exportar a Excel</span>
              </Button>
              <Button
                variant="dark"
                type="submit"
                className="d-flex align-items-center gap-2"
                disabled={loading}
              >
                <CalculatorFill />
                <span>Calcular montos de ventas</span>
              </Button>
            </div>
          </Form>
          {loading && (
            <div className="d-flex justify-content-center align-items-center gap-2 mt-3">
              <Spinner animation="border" variant="dark" />
              <h5>Cargando...</h5>
            </div>
          )}
          {overall && !loading && (
            <>
              <hr />
              <h5>Resumen general del día {date}</h5>
              <p>
                <strong>Total recaudado: </strong> $
                {formatPrice(overall.totalCollected)}
              </p>
              <p>
                <strong>Cantidad de ventas: </strong> {overall.salesQuantity}
              </p>
              <h5>Resumen por método de pago</h5>
              <ul>
                {byPaymentMethodId.map((paymentMethod) => (
                  <li key={paymentMethod.paymentMethodId}>
                    <strong>
                      {NUMBER_STRING_PAYMENTS[paymentMethod.paymentMethodId]}:
                    </strong>{" "}
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
