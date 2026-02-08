import { Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  Form,
  Row,
  Spinner,
  Table,
} from "react-bootstrap";
import { createInvoiceSchema } from "../utils/validationSchemas";
import { createInvoice } from "../helpers/invoicesQueries";
import { toast } from "sonner";
import AddProductComp from "./AddProductComp";
import useClients from "../hooks/useClients";
import {
  CREDIT_CARDS,
  CUIT_MAP,
  DEBIT_CARDS,
  SALE_CONDITIONS,
  SALE_POINTS,
} from "../constants/const";
import { validateInvoice } from "../utils/validationFunctions";
import AddPaymentMethod from "./AddPaymentMethod";
import { CheckLg, Trash3Fill } from "react-bootstrap-icons";
import EditProductComp from "./EditProductComp";
import Swal from "sweetalert2";
import { formatPrice } from "../utils/utils";

const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const NewInvoiceComp = () => {
  const { clients } = useClients();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods[]>([]);
  const [productsTotal, setProductsTotal] = useState({
    total: 0,
    iva: 0,
    precioSinIva: 0,
  });
  const [paymentsLeftValue, setPaymentsLeftValue] = useState(0);
  const [client, setClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredClients = useMemo(() => {
    if (searchTerm.trim().length < 3) return [];
    const normalizedSearch = normalizeText(searchTerm);

    return clients.filter((c) => {
      const normalizedName = normalizeText(c.name);
      const documentString = c.document.toString();

      return (
        normalizedName.includes(normalizedSearch) ||
        documentString.includes(normalizedSearch)
      );
    });
  }, [clients, searchTerm]);

  useEffect(() => {
    const total = products.reduce(
      (acc, product) => acc + product.productSubtotal,
      0,
    );

    const precioSinIva = total / 1.21;
    const iva = total - precioSinIva;

    setProductsTotal({ total, iva, precioSinIva });
    setPaymentsLeftValue(total);
  }, [products]);


  const handleInputChange = (value: string) => {
    setSearchTerm(value.trim());
    setClient(null);
    setIsDropdownOpen(true);
  };

  const handleSelect = (selectedClient: Client) => {
    setClient({
      ...selectedClient,
      document: selectedClient.document.toString(),
    });
    setSearchTerm(`${selectedClient.name} - ${selectedClient.document}`);
    setIsDropdownOpen(false);
  };

  const newInvoice = (values: InvoiceData, resetForm: () => void) => {
    const error = validateInvoice(values, client, products, paymentsLeftValue);
    if (error) {
      toast.error(error);
      return;
    }

    const payload: NewInvoice = {
      ...values,
      client: client as Client,
      products,
      payments: paymentMethods,
    };

    setLoading(true);
    const promise = createInvoice(payload)
      .then((res) => {
        open(res.result, "_blank");
        resetForm();
        setClient(null);
        setSearchTerm("");
        setProducts([]);
        setPaymentsLeftValue(0);
        setPaymentMethods([]);
        return res;
      })
      .catch((err) => {
        throw err;
      });

    toast.promise(promise, {
      loading: "Generando factura...",
      success: (data) => (
        <span>
          <b>{data.msg}</b>
          <br />
          {
            "En caso de que la factura no se abra, podés visualizarla en el siguiente enlace: "
          }
          <br />
          <a
            href={data.result}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: "bold", textDecoration: "underline" }}
          >
            Ver factura
          </a>
        </span>
      ),
      error: (err) => `${err.error}`,
      finally: () => setLoading(false),
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
    setPaymentsLeftValue(productsTotal.total - updatedTotal);
    setPaymentMethods(newPaymentMethods);
  };

  const handleDelete = (productName: string) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const newProducts = products.filter(
          (product) => product.productName !== productName,
        );
        setProducts(newProducts);
      }
    });
  };

  return (
    <Formik
      validationSchema={createInvoiceSchema}
      onSubmit={(values, { resetForm }) => newInvoice(values, resetForm)}
      initialValues={{
        saleCond: "",
        salePoint: "",
        invoiceType: "",
        creditCard: "",
        debitCard: "",
        cuitOption: "",
        paymentsQuantity: "1",
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <h4>Datos del cliente</h4>
          <Row className="mb-3 position-relative">
            <Form.Group as={Col} md="12" controlId="clientSearchId">
              <Form.Label>Buscar cliente</Form.Label>
              <Form.Control
                type="text"
                placeholder="Escriba el CUIT o nombre del cliente (al menos 3 caracteres)"
                value={searchTerm}
                autoComplete="off"
                onChange={(ev) => handleInputChange(ev.target.value)}
              />
            </Form.Group>

            {isDropdownOpen && filteredClients.length > 0 && (
              <Dropdown.Menu show className="position-absolute w-100 top-100">
                {filteredClients.map((client) => (
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
            <Form.Group as={Col} md="4" controlId="cuitOptionId">
              <Form.Label>CUIT de facturación</Form.Label>
              <Form.Select
                onChange={handleChange}
                value={values.cuitOption}
                name="cuitOption"
                isInvalid={touched.cuitOption && !!errors.cuitOption}
              >
                <option value={""}>CUIT no seleccionado</option>
                {CUIT_MAP.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.cuitOption && touched.cuitOption
                  ? errors.cuitOption
                  : ""}
              </Form.Control.Feedback>
            </Form.Group>
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
                {SALE_CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
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
            <Form.Group as={Col} md="4" controlId="invoiceTypeId">
              <Form.Label>Tipo de factura</Form.Label>
              <Form.Select
                onChange={handleChange}
                value={values.invoiceType}
                name="invoiceType"
                isInvalid={touched.invoiceType && !!errors.invoiceType}
              >
                <option value={""}>Tipo de factura no seleccionado</option>
                <option value="Factura-A">Factura A</option>
                <option value="Factura-B">Factura B</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.invoiceType && touched.invoiceType
                  ? errors.invoiceType
                  : ""}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            {values.saleCond === "Crédito" ? (
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
            ) : values.saleCond === "Débito" ? (
              <Form.Group as={Col} md="4" controlId="debitCardId">
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
            ) : (
              ""
            )}
            {values.saleCond === "Crédito" || values.saleCond === "Débito" ? (
              <Form.Group as={Col} md="4" controlId="paymentsQuantityId">
                <Form.Label>Cantidad de cuotas</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: 6"
                  value={values.paymentsQuantity}
                  onChange={handleChange}
                  name="paymentsQuantity"
                />
              </Form.Group>
            ) : (
              ""
            )}
          </Row>
          {values.saleCond === "Múltiples métodos de pago" &&
          products.length > 0 ? (
            <Row>
              <Col md="4">
                <AddPaymentMethod
                  setPaymentMethods={setPaymentMethods}
                  setPaymentsLeftValue={setPaymentsLeftValue}
                  paymentsLeftValue={paymentsLeftValue}
                />
              </Col>
            </Row>
          ) : (
            ""
          )}
          {paymentMethods.length > 0 && (
            <Table striped bordered hover responsive className="mt-3">
              <thead>
                <tr>
                  <th>Método de pago</th>
                  <th>Valor a pagar</th>
                  <th>Tarjeta de crédito</th>
                  <th>Tarjeta de débito</th>
                  <th>Cantidad de cuotas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paymentMethods.map((method) => (
                  <tr key={method.id}>
                    <td>{method.method}</td>
                    <td>${method.valueToPay}</td>
                    <td>{method.creditCard || "-"}</td>
                    <td>{method.debitCard || "-"}</td>
                    <td>{method.paymentsQuantity}</td>
                    <td className="d-flex justify-content-center">
                      <Button
                        className="d-flex align-items-center gap-1"
                        variant="danger"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                      >
                        <Trash3Fill />
                        <span>Eliminar</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.productName}>
                      <td>{product.productName}</td>
                      <td>${formatPrice(product.price)}</td>
                      <td>{product.quantity}</td>
                      <td>${formatPrice(product.price * product.quantity)}</td>
                      <td className="d-flex justify-content-center gap-2">
                        <EditProductComp
                          product={product}
                          setProducts={setProducts}
                          index={index}
                        />
                        <Button
                          className="d-flex align-items-center gap-1"
                          variant="danger"
                          onClick={() => handleDelete(product.productName)}
                        >
                          <Trash3Fill />
                          <span>Eliminar</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-end flex-column align-items-end">
                <h5>IVA: ${formatPrice(productsTotal.iva)}</h5>
                <h5>
                  Precio s/ IVA: ${formatPrice(productsTotal.precioSinIva)}
                </h5>
                <h4>Total: ${formatPrice(productsTotal.total)}</h4>
              </div>
            </>
          )}
          <div className="d-flex justify-content-end mb-4">
            <Button
              type="submit"
              disabled={loading}
              className="d-flex justify-content-center align-items-center gap-1"
            >
              {loading ? (
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <Spinner size="sm" />
                  <span>Cargando...</span>
                </div>
              ) : (
                <>
                  <CheckLg />
                  <span>Generar factura</span>
                </>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewInvoiceComp;
