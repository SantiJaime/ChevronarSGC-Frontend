import { Formik } from "formik";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import { Search } from "react-bootstrap-icons";
import { searchInvoiceSchema } from "../utils/validationSchemas";
import { useState } from "react";
import { getInvoices } from "../helpers/invoicesQueries";
import { toast } from "sonner";

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
      value: "Nota de crédito-A",
    },
    {
      name: "Nota de crédito B",
      value: "Nota de crédito-B",
    },
  ];
  const [invoices, setInvoices] = useState<FullInvoice[]>([]);

  const handleSearch = (values: InvoiceSearch) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Token inexistente. Inicia sesión nuevamente");
      return;
    }
    const promise = getInvoices(values, token)
      .then((res) => {
        setInvoices(res.invoices);
        return res;
      })
      .catch((err) => {
        throw err;
      });

    toast.promise(promise, {
      loading: "Buscando facturas...",
      success: (res) => `${res.msg}`,
      error: (err) => `${err.error}`,
    });
  };

  return (
    <Container>
      <h2>Historial de facturas</h2>
      <hr />
      <Formik
        validationSchema={searchInvoiceSchema}
        onSubmit={(values) => handleSearch(values)}
        initialValues={{
          fromDate: "",
          toDate: "",
          clientName: "",
          clientDocument: "",
          type: "",
          invoiceNumber: "",
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
                  {errors.clientName && touched.clientName
                    ? errors.clientName
                    : ""}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mt-3">
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
              <Form.Group as={Col} md={3} controlId="typeId">
                <Form.Label>Tipo de factura (opcional)</Form.Label>
                <Form.Select
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  isInvalid={touched.type && !!errors.type}
                >
                  {INVOICES_TYPES.map((type) => (
                    <option value={type.value} key={type.name}>
                      {type.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.type && touched.type ? errors.type : ""}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <div className="d-flex justify-content-end">
              <Button
                type="submit"
                variant="primary"
                className="d-flex align-items-center gap-2"
              >
                <span>Buscar</span>
                <Search />
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      <hr />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Nro. de factura - Tipo</th>
            <th>Importes</th>
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
                {invoice.invoiceNumber} | {invoice.invoiceType}
              </td>
              <td>
                Total: ${invoice.amounts.total} | IVA: ${invoice.amounts.iva} |
                Precio sin IVA: ${invoice.amounts.precioSinIva}
              </td>
              <td className='d-flex justify-content-between'>
                <Button>Ver detalles</Button>
                <Button variant='danger'>Anular</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Invoices;
