import { useFormik } from "formik";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {
  ArrowLeftCircleFill,
  ArrowRightCircleFill,
  FileEarmarkX,
  Printer,
  Search,
} from "react-bootstrap-icons";
import { searchInvoiceSchema } from "../utils/validationSchemas";
import { useState } from "react";
import {
  cancelInvoice,
  getInvoices,
  printInvoice,
} from "../helpers/invoicesQueries";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  CREDIT_CARDS,
  DEBIT_CARDS,
  SALE_CONDITIONS,
  SALE_POINTS,
} from "../constants/const";
import InvoiceDetails from "./InvoiceDetails";
import { validateSearchInvoice } from '../utils/validationFunctions';

const Invoices = () => {
  const INVOICES_TYPES = [
    {
      name: "Todas",
      value: "",
    },
    {
      name: "Factura A",
      value: "Factura-A",
    },
    {
      name: "Factura B",
      value: "Factura-B",
    },
    {
      name: "Nota de crédito A",
      value: "Nota de Crédito-A",
    },
    {
      name: "Nota de crédito B",
      value: "Nota de Crédito-B",
    },
  ];
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      clientName: "",
      clientDocument: "",
      invoiceType: "",
      invoiceNumber: "",
      salePoint: "",
      total: "",
      saleCond: "",
      paymentsQuantity: "",
      creditCard: "",
      debitCard: "",
    },
    validationSchema: searchInvoiceSchema,
    onSubmit: () => handleSearch(),
  });

  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } =
    formik;

  const [invoices, setInvoices] = useState<FullInvoice[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSearch = (paramPage?: number) => {
    validateSearchInvoice(values);
    setLoading(true);
    
    getInvoices(values, paramPage || page)
      .then((res) => {
        setInvoices(res.invoices);
        setTotalPages(res.infoPagination.totalPages);
      })
      .catch((err) => {
        setInvoices([]);
        toast.error(err.error);
      })
      .finally(() => setLoading(false));
  };

  const goToNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
      handleSearch(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      handleSearch(page - 1);
    }
  };

  const handleCancelInvoice = (values: FullInvoice) => {
    const payload: NewCreditNote = {
      ...values,
      client: {
        ...values.client,
        document: values.client.document.toString(),
      },
      assocInvoiceCaeExpiringDate: values.caeExpiringDate.toString(),
      paymentsQuantity: values.paymentsQuantity.toString(),
      assocInvoiceNumber: values.invoiceNumber.toString(),
      assocInvoiceCae: values.cae.toString(),
      assocInvoiceDate: values.date.toString(),
    };
    Swal.fire({
      title: "¿Estás seguro de anular esta factura?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, anular",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const promise = cancelInvoice(payload)
          .then((res) => {
            open(res.result, "_blank");

            setInvoices((prevState) => {
              const updatedInvoices = prevState.map((invoice) =>
                invoice._id === values._id
                  ? { ...invoice, cancelled: true }
                  : invoice
              );

              return [...updatedInvoices, res.newCreditNote];
            });

            return res;
          })
          .catch((err) => {
            throw err;
          });

        toast.promise(promise, {
          loading: "Generando nota de crédito...",
          success: (res) => `${res.msg}`,
          error: (err) => `${err.error}`,
        });
      }
    });
  };

  const handlePrint = (invoiceData: FullInvoice) => {
    const promise = printInvoice(invoiceData)
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

  return (
    <div>
      <h2>Historial de facturas</h2>
      <hr />

      <Form noValidate onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md={3} controlId="fromDateId">
            <Form.Label>Desde</Form.Label>
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
          <Form.Group as={Col} md={3} controlId="toDateId">
            <Form.Label>Hasta</Form.Label>
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
          <Form.Group as={Col} md={3} controlId="salePointId">
            <Form.Label>Punto de venta</Form.Label>
            <Form.Select
              name="salePoint"
              value={values.salePoint}
              onChange={handleChange}
              isInvalid={touched.salePoint && !!errors.salePoint}
            >
              <option value="">Punto de venta no seleccionado</option>
              {SALE_POINTS.map((point) => (
                <option value={point.value} key={point.name}>
                  {point.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.salePoint && touched.salePoint ? errors.salePoint : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="clientDocumentId">
            <Form.Label>Documento del cliente (opcional)</Form.Label>
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
          <Form.Group as={Col} md={3} controlId="clientNameId">
            <Form.Label>Nombre del cliente (opcional)</Form.Label>
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
          <Form.Group as={Col} md={3} controlId="invoiceNumberId">
            <Form.Label>Número de factura (opcional)</Form.Label>
            <Form.Control
              type="text"
              name="invoiceNumber"
              value={values.invoiceNumber}
              onChange={handleChange}
              placeholder="Ej: 20"
              autoComplete="off"
              isInvalid={touched.invoiceNumber && !!errors.invoiceNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.invoiceNumber && touched.invoiceNumber
                ? errors.invoiceNumber
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="invoiceTypeId">
            <Form.Label>Tipo de factura (opcional)</Form.Label>
            <Form.Select
              name="invoiceType"
              value={values.invoiceType}
              onChange={handleChange}
              isInvalid={touched.invoiceType && !!errors.invoiceType}
            >
              {INVOICES_TYPES.map((type) => (
                <option value={type.value} key={type.name}>
                  {type.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.invoiceType && touched.invoiceType
                ? errors.invoiceType
                : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="invoiceTotalId">
            <Form.Label>Valor total de la factura (opcional)</Form.Label>
            <Form.Control
              type="text"
              name="total"
              value={values.total}
              onChange={handleChange}
              placeholder="Ej: $100"
              autoComplete="off"
              isInvalid={touched.total && !!errors.total}
            />
            <Form.Control.Feedback type="invalid">
              {errors.total && touched.total ? errors.total : ""}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mt-3">
          <Form.Group as={Col} md={4} controlId="saleConditionId">
            <Form.Label>Condición de venta (opcional)</Form.Label>
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
              <Form.Group as={Col} md={4} controlId="creditCardId">
                <Form.Label>Tarjeta de crédito (opcional)</Form.Label>
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
              <Form.Group as={Col} md={4} controlId="paymentsQuantityId">
                <Form.Label>Cantidad de cuotas (opcional)</Form.Label>
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
              <Form.Group as={Col} md={4} controlId="debitCardId">
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
              <Form.Group as={Col} md={4} controlId="paymentsQuantityId">
                <Form.Label>Cantidad de cuotas (opcional)</Form.Label>
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
      ) : invoices.length === 0 ? (
        <h4 className="text-center">No se encontraron facturas</h4>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Nro. de factura | Tipo</th>
                <th>Importes | Condición de venta</th>
                <th>Punto de venta</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td>
                    {invoice.client.name} | {invoice.client.document}
                  </td>
                  <td>
                    Factura Nº {invoice.invoiceNumber} | {invoice.invoiceType}
                  </td>
                  <td>
                    <div>
                      <div>
                        <strong>Total: </strong>${invoice.amounts.total} |
                        <strong> IVA: </strong>${invoice.amounts.iva} |
                        <strong> Precio sin IVA: </strong>$
                        {invoice.amounts.precioSinIva}
                      </div>
                      <strong>{invoice.saleCond}</strong>{" "}
                      {(invoice.debitCard || invoice.creditCard) &&
                        `- ${invoice.debitCard || invoice.creditCard}`}{" "}
                      - {invoice.paymentsQuantity} pago(s)
                    </div>
                  </td>
                  <td>
                    {invoice.salePoint === "00011"
                      ? "Av. San Martín 112"
                      : "Av. Colón 315"}
                  </td>
                  <td>{invoice.cancelled ? "Anulada" : "Autorizada"}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <InvoiceDetails invoice={invoice} />
                      <Button
                        variant="success"
                        className="d-flex align-items-center gap-1"
                        onClick={() => handlePrint(invoice)}
                      >
                        <Printer />
                        <span>Imprimir</span>
                      </Button>
                      {!invoice.cancelled && !invoice.assocInvoiceNumber ? (
                        <Button
                          variant="danger"
                          className="d-flex align-items-center gap-1"
                          onClick={() => handleCancelInvoice(invoice)}
                        >
                          <FileEarmarkX />
                          <span>Anular</span>
                        </Button>
                      ) : (
                        ""
                      )}
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

export default Invoices;
