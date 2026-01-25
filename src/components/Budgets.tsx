import { useFormik } from "formik";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {
  ArrowLeftCircleFill,
  ArrowRightCircleFill,
  Printer,
  Search,
  Trash3Fill,
} from "react-bootstrap-icons";
import { searchBudgetSchema } from "../utils/validationSchemas";
import { useState } from "react";
import {
  deleteBudget,
  getBudgets,
  printBudget,
} from "../helpers/invoicesQueries";
import { toast } from "sonner";
import {
  BUDGET_SALE_POINTS,
  CREDIT_CARDS,
  DEBIT_CARDS,
  SALE_CONDITIONS,
} from "../constants/const";
import { validateSearchInvoice } from "../utils/validationFunctions";
import Swal from "sweetalert2";
import { formatPrice } from '../utils/utils';

const Budgets = () => {
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      clientName: "",
      clientDocument: "",
      budgetNumber: "",
      salePoint: "",
      total: "",
      saleCond: "",
      paymentsQuantity: "",
      creditCard: "",
      debitCard: "",
    },
    validationSchema: searchBudgetSchema,
    onSubmit: () => handleSearch(),
  });

  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } =
    formik;

  const [budgets, setBudgets] = useState<FullBudget[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = (paramPage?: number) => {
    validateSearchInvoice(values);
    setLoading(true);
    
    const pageToFetch = paramPage || 1;
    setPage(pageToFetch);

    getBudgets(values, pageToFetch)
      .then((res) => {
        setBudgets(res.budgets);
        setTotalPages(res.infoPagination.totalPages);
      })
      .catch((err) => {
        setBudgets([]);
        toast.error(err.error);
      })
      .finally(() => setLoading(false));
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      handleSearch(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      handleSearch(page - 1);
    }
  };

  const handlePrint = (budgetData: FullBudget) => {
    const promise = printBudget(budgetData)
      .then((res) => {
        open(res.result, "_blank");
        return res;
      })
      .catch((err) => {
        throw err;
      });

    toast.promise(promise, {
      loading: "Generando PDF...",
      success: (res) => `${res.msg}`,
      error: (err) => `${err.error}`,
    });
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este presupuesto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const promise = deleteBudget(id)
          .then((res) => {
            setBudgets((prevBudgets) =>
              prevBudgets.filter((budget) => budget._id !== id)
            );
            return res;
          })
          .catch((err) => {
            throw err;
          });

        toast.promise(promise, {
          loading: "Eliminando presupuesto...",
          success: (res) => `${res.msg}`,
          error: (err) => `${err.error}`,
        });
      }
    });
  };

  return (
    <div>
      <h2>Historial de presupuestos</h2>
      <hr />

      <Form noValidate onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md={3} controlId="budgetFromDateId">
            <Form.Label>Desde *</Form.Label>
            <Form.Control
              type="text"
              name="fromDate"
              value={values.fromDate}
              onChange={(ev) => {
                let value = ev.target.value.replace(/[^0-9]/g, "");

                if (value.length > 4)
                  value = `${value.slice(0, 4)}-${value.slice(4)}`;
                if (value.length > 7)
                  value = `${value.slice(0, 7)}-${value.slice(7, 9)}`;

                setFieldValue("fromDate", value);
              }}
              placeholder="YYYY-MM-DD"
              isInvalid={touched.fromDate && !!errors.fromDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fromDate && touched.fromDate ? errors.fromDate : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="budgetToDateId">
            <Form.Label>Hasta *</Form.Label>
            <Form.Control
              type="text"
              name="toDate"
              value={values.toDate}
              onChange={(ev) => {
                let value = ev.target.value.replace(/[^0-9]/g, "");

                if (value.length > 4)
                  value = `${value.slice(0, 4)}-${value.slice(4)}`;
                if (value.length > 7)
                  value = `${value.slice(0, 7)}-${value.slice(7, 9)}`;

                setFieldValue("toDate", value);
              }}
              placeholder="YYYY-MM-DD"
              isInvalid={touched.toDate && !!errors.toDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.toDate && touched.toDate ? errors.toDate : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="budgetSalePointId">
            <Form.Label>Punto de venta *</Form.Label>
            <Form.Select
              name="salePoint"
              value={values.salePoint}
              onChange={handleChange}
              isInvalid={touched.salePoint && !!errors.salePoint}
            >
              <option value="">Punto de venta no seleccionado</option>
              {BUDGET_SALE_POINTS.map((point) => (
                <option value={point.value} key={point.name}>
                  {point.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.salePoint && touched.salePoint ? errors.salePoint : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="budgetClientDocumentId">
            <Form.Label>Documento del cliente</Form.Label>
            <Form.Control
              type="text"
              name="clientDocument"
              value={values.clientDocument}
              onChange={handleChange}
              placeholder="Ej: 12345678912"
              autoComplete="off"
              isInvalid={touched.clientDocument && !!errors.clientDocument}
            />
            <Form.Control.Feedback type="invalid">
              {errors.clientDocument && touched.clientDocument
                ? errors.clientDocument
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Form.Group as={Col} md={3} controlId="budgetClientNameId">
            <Form.Label>Nombre del cliente</Form.Label>
            <Form.Control
              type="text"
              name="clientName"
              value={values.clientName}
              onChange={handleChange}
              placeholder="Ej: Juan Pérez"
              autoComplete="off"
              isInvalid={touched.clientName && !!errors.clientName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.clientName && touched.clientName ? errors.clientName : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="budgetNumberId">
            <Form.Label>Número de presupuesto</Form.Label>
            <Form.Control
              type="text"
              name="budgetNumber"
              value={values.budgetNumber}
              onChange={handleChange}
              placeholder="Ej: 20"
              autoComplete="off"
              isInvalid={touched.budgetNumber && !!errors.budgetNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.budgetNumber && touched.budgetNumber
                ? errors.budgetNumber
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Form.Group as={Col} md={4} controlId="budgetSaleConditionId">
            <Form.Label>Condición de venta</Form.Label>
            <Form.Select
              name="saleCond"
              value={values.saleCond}
              onChange={handleChange}
              isInvalid={touched.saleCond && !!errors.saleCond}
            >
              <option value="">Condición de venta no seleccionada</option>
              {SALE_CONDITIONS.map((cond) => (
                <option value={cond} key={cond}>
                  {cond}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.saleCond && touched.saleCond ? errors.saleCond : ""}
            </Form.Control.Feedback>
          </Form.Group>
          {values.saleCond === "Crédito" ? (
            <>
              <Form.Group as={Col} md={4} controlId="budgetCreditCardId">
                <Form.Label>Tarjeta de crédito</Form.Label>
                <Form.Select
                  onChange={handleChange}
                  value={values.creditCard}
                  name="creditCard"
                  isInvalid={touched.creditCard && !!errors.creditCard}
                >
                  <option value={""}>Tarjeta no seleccionada</option>
                  {CREDIT_CARDS.map((card) => (
                    <option key={card} value={card}>
                      {card}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                as={Col}
                md={4}
                controlId="budgetCreditPaymentsQuantityId"
              >
                <Form.Label>Cantidad de cuotas</Form.Label>
                <Form.Control
                  type="text"
                  name="paymentsQuantity"
                  value={values.paymentsQuantity}
                  onChange={handleChange}
                  placeholder="Ej: 3"
                  autoComplete="off"
                  isInvalid={
                    touched.paymentsQuantity && !!errors.paymentsQuantity
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.paymentsQuantity && touched.paymentsQuantity
                    ? errors.paymentsQuantity
                    : ""}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          ) : values.saleCond === "Débito" ? (
            <>
              <Form.Group as={Col} md={4} controlId="budgetDebitCardId">
                <Form.Label>Tarjeta de débito</Form.Label>
                <Form.Select
                  onChange={handleChange}
                  value={values.debitCard}
                  name="debitCard"
                  isInvalid={touched.debitCard && !!errors.debitCard}
                >
                  <option value={""}>Tarjeta no seleccionada</option>
                  {DEBIT_CARDS.map((card) => (
                    <option key={card} value={card}>
                      {card}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group
                as={Col}
                md={4}
                controlId="budgetDebitPaymentsQuantityId"
              >
                <Form.Label>Cantidad de cuotas</Form.Label>
                <Form.Control
                  type="text"
                  name="paymentsQuantity"
                  value={values.paymentsQuantity}
                  onChange={handleChange}
                  placeholder="Ej: 3"
                  autoComplete="off"
                  isInvalid={
                    touched.paymentsQuantity && !!errors.paymentsQuantity
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {errors.paymentsQuantity && touched.paymentsQuantity
                    ? errors.paymentsQuantity
                    : ""}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          ) : (
            ""
          )}
        </Row>
        <div className="d-flex justify-content-end mt-3">
          <Button
            type="submit"
            variant="dark"
            className="d-flex align-items-center gap-1"
          >
            <Search />
            <span>Buscar</span>
          </Button>
        </div>
      </Form>
      <hr />
      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" variant="dark" />
          <h4>Cargando...</h4>
        </div>
      ) : budgets.length === 0 ? (
        <h4 className="text-center">No se encontraron presupuestos</h4>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Nro. de presupuesto</th>
                <th>Importes | Condición de venta</th>
                <th>Punto de venta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget._id}>
                  <td>
                    {budget.client.name} | {budget.client.document}
                  </td>
                  <td>Presupuesto Nº {budget.budgetNumber}</td>
                  <td>
                    <div>
                      <div>
                        <strong>Total: </strong>${formatPrice(budget.amounts.total)} |
                        <strong> IVA: </strong>${formatPrice(budget.amounts.iva)} |
                        <strong> Precio sin IVA: </strong>$
                        {formatPrice(budget.amounts.precioSinIva)}
                      </div>
                      <strong>{budget.saleCond}</strong>{" "}
                      {(budget.debitCard || budget.creditCard) &&
                        `- ${budget.debitCard || budget.creditCard}`}{" "}
                      - {budget.paymentsQuantity} pago(s)
                    </div>
                  </td>
                  <td>
                    {budget.salePoint === "00002"
                      ? "Av. San Martín 112"
                      : "Av. Colón 315"}
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <Button
                        variant="success"
                        className="d-flex align-items-center gap-1"
                        onClick={() => handlePrint(budget)}
                      >
                        <Printer />
                        <span>Imprimir</span>
                      </Button>
                      <Button
                        variant="danger"
                        className="d-flex align-items-center gap-1"
                        onClick={() => handleDelete(budget._id)}
                      >
                        <Trash3Fill />
                        <span>Eliminar</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
            <Button
              onClick={goToPreviousPage}
              disabled={page === 1}
              variant="dark"
              className="d-flex align-items-center gap-1"
            >
              <ArrowLeftCircleFill />
              <span>Anterior</span>
            </Button>
            <span>
              Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>
            <Button
              onClick={goToNextPage}
              disabled={page === totalPages}
              variant="dark"
              className="d-flex align-items-center gap-1"
            >
              <span>Siguiente</span>
              <ArrowRightCircleFill />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Budgets;
