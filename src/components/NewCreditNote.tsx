import { Formik } from "formik";
import { useState } from "react";
import { Button, Col, Dropdown, Form, Row, Table } from "react-bootstrap";
import { toast } from "sonner";
import { createCreditNoteSchema } from "../utils/validationSchemas";
import { CREDIT_CARDS, SALE_POINTS } from "../constants/const";
import { createCreditNote } from "../helpers/invoicesQueries";
import { validateCreditNote } from "../utils/validationFunctions";
import AddProductComp from "./AddProductComp";
import useClients from "../hooks/useClients";

const NewCreditNote = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredItems, setFilteredItems] = useState<Client[]>([]);
  const { clients } = useClients();

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const value = ev.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setFilteredItems([]);
      setShowDropdown(false);
      return;
    }

    const filtered = clients.filter((client) => {
      const name = client.name.toLowerCase();
      const document = client.document.toString();

      return name.includes(value.toLowerCase()) || document.includes(value);
    });
    setFilteredItems(filtered);
    setShowDropdown(filtered.length > 0);
  };
  const handleSelect = (client: Client) => {
    setSearchTerm(`${client.name} - ${client.document}`);
    setClient({ ...client, document: client.document.toString() });
    setShowDropdown(false);
  };

  const newCreditNote = (values: CreditNoteData) => {
    const error = validateCreditNote(values, client, products);
    if (error) {
      toast.error(error);
      return;
    }

    const payload: CreditNote = {
      ...values,
      client: client as Client,
      products,
    };
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Token inexistente");
      return;
    }

    const promise = createCreditNote(payload, token)
      .then((res) => {
        open(res.result, "_blank");
        return res;
      })
      .catch((err) => {
        throw err;
      });

    toast.promise(promise, {
      loading: "Generando factura...",
      success: (res) => `${res.msg}`,
      error: (err) => `${err.msg}`,
    });
  };
  return (
    <Formik
      validationSchema={createCreditNoteSchema}
      onSubmit={(values) => newCreditNote(values)}
      initialValues={{
        saleCond: "",
        salePoint: "",
        creditNoteType: "",
        creditCard: "",
        assocInvoiceNumber: "",
        date: "",
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
          <h4>Datos del cliente</h4>
          <Row className="mb-3 position-relative">
            <Form.Group as={Col} md="12" controlId="clientSearchId">
              <Form.Label>Buscar cliente</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escriba el CUIT o nombre del cliente"
                value={searchTerm}
                autoComplete="off"
                onChange={handleInputChange}
              />
            </Form.Group>

            {showDropdown && (
              <Dropdown.Menu show className="position-absolute w-100 top-100">
                {filteredItems.map((client) => (
                  <Dropdown.Item
                    key={client.document}
                    onClick={() => handleSelect(client)}
                  >
                    {client.name} - {client.document}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            )}
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="saleConditionId">
              <Form.Label>Condición de venta</Form.Label>
              <Form.Select
                onChange={handleChange}
                value={values.saleCond}
                name="saleCond"
                isInvalid={touched.saleCond && !!errors.saleCond}
              >
                <option value={""}>Condición de venta no seleccionada</option>
                <option value="Contado">Contado</option>
                <option value="Crédito">Crédito</option>
                <option value="Transferencia">Transferencia</option>
                <option value="Cheque">Cheque</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.saleCond && touched.saleCond ? errors.saleCond : ""}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="salePointId">
              <Form.Label>Punto de venta</Form.Label>
              <Form.Select
                onChange={handleChange}
                value={values.salePoint}
                name="salePoint"
                isInvalid={touched.salePoint && !!errors.salePoint}
              >
                <option value={""}>Punto de venta no seleccionado</option>
                {SALE_POINTS.map((point) => (
                  <option key={point.name} value={point.value}>
                    {point.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.salePoint && touched.salePoint ? errors.salePoint : ""}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="creditNoteTypeId">
              <Form.Label>Tipo de nota de crédito</Form.Label>
              <Form.Select
                onChange={handleChange}
                value={values.creditNoteType}
                name="creditNoteType"
                isInvalid={touched.creditNoteType && !!errors.creditNoteType}
              >
                <option value={""}>
                  Tipo de nota de crédito no seleccionado
                </option>
                <option value="Nota de Crédito-A">Nota de Crédito A</option>
                <option value="Nota de Crédito-B">Nota de Crédito B</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.creditNoteType && touched.creditNoteType
                  ? errors.creditNoteType
                  : ""}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            {values.saleCond === "Crédito" && (
              <Form.Group as={Col} md="4" controlId="creditCardId">
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
            )}
            <Form.Group as={Col} md="4" controlId="AssocInvoiceNumberId">
              <Form.Label>Número de comprobante asociado</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: 23"
                value={values.assocInvoiceNumber}
                name="assocInvoiceNumber"
                autoComplete="off"
                onChange={handleChange}
                isInvalid={
                  touched.assocInvoiceNumber && !!errors.assocInvoiceNumber
                }
              />
              <Form.Control.Feedback type="invalid">
                {errors.assocInvoiceNumber && touched.assocInvoiceNumber
                  ? errors.assocInvoiceNumber
                  : ""}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="dateId">
              <Form.Label>Fecha de la factura emitida</Form.Label>
              <Form.Control
                type="text"
                placeholder="YYYY-MM-DD"
                value={values.date}
                name="date"
                autoComplete="off"
                onChange={(ev) => {
                  let value = ev.target.value.replace(/[^0-9]/g, "");

                  if (value.length > 4)
                    value = `${value.slice(0, 4)}-${value.slice(4)}`;
                  if (value.length > 7)
                    value = `${value.slice(0, 7)}-${value.slice(7, 9)}`;

                  setFieldValue("date", value);
                }}
                isInvalid={touched.date && !!errors.date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date && touched.date ? errors.date : ""}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <hr />
          <div className="d-flex justify-content-between">
            <h4>Productos</h4>
            <AddProductComp setProducts={setProducts} />
          </div>
          {products.length === 0 ? (
            <p>No hay productos agregados</p>
          ) : (
            <>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.productName}>
                      <td>{product.productName}</td>
                      <td>${product.price}</td>
                      <td>{product.quantity}</td>
                      <td>${product.price * product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-end flex-column align-items-end">
                <h5>
                  Subtotal: $
                  {products.reduce(
                    (total, product) =>
                      total + product.price * product.quantity,
                    0
                  )}
                </h5>
                <h4>
                  Total: $
                  {products.reduce(
                    (total, product) =>
                      total + product.price * product.quantity,
                    0
                  ) * 1.21}
                </h4>
              </div>
            </>
          )}
          <div className="d-flex justify-content-end">
            <Button type="submit">Generar factura</Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewCreditNote;
