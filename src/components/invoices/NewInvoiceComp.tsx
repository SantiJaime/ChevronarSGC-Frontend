import { Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { createInvoiceSchema } from "../../utils/validationSchemas";
import { createInvoice } from "../../helpers/invoicesQueries";
import { toast } from "sonner";
import AddProductComp from "../products/AddProductComp";
import useClients from "../../hooks/useClients";
import {
  CREDIT_CARDS,
  CUIT_MAP,
  DEBIT_CARDS,
  normalizeText,
  SALE_CONDITIONS,
  SALE_POINTS,
} from "../../constants/const";
import { validateInvoice } from "../../utils/validationFunctions";
import AddPaymentMethod from "../payments/AddPaymentMethod";
import Swal from "sweetalert2";
import { formatPrice } from "../../utils/utils";
import useInvoiceProducts from "../../hooks/useInvoiceProducts";
import NewProductComp from "../products/NewProductComp";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";
import { Spinner } from "../ui/Spinner";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from "../ui/Table";
import { Dropdown } from "../ui/Dropdown";
import { Check, Trash2 } from "lucide-react";
import MultiplePaymentsTable from "../payments/MultiplePaymentsTable";

const NewInvoiceComp = () => {
  const { clients } = useClients();
  const { products, setProducts } = useInvoiceProducts();

  const [loading, setLoading] = useState(false);
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
    const query = searchTerm.trim();
    if (query.length < 3) return [];
    const normalizedSearch = normalizeText(query);

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
    setSearchTerm(value);
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

  const handleDelete = (productId: number) => {
    Swal.fire({
      title: "Estas seguro de eliminar este producto?",
      text: "Esta accion no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const newProducts = products.filter(
          (product) => product.productId !== productId,
        );
        setProducts(newProducts);
      }
    });
  };

  return (
    <>
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
          <form noValidate onSubmit={handleSubmit}>
            <h4 className="text-lg font-semibold mb-4">Datos del cliente</h4>

            <div className="mb-4 relative">
              <Label htmlFor="clientSearchId">Buscar cliente</Label>
              <Input
                id="clientSearchId"
                type="text"
                placeholder="Escriba el CUIT o nombre del cliente (al menos 3 caracteres)"
                value={searchTerm}
                autoComplete="off"
                onChange={(ev) => handleInputChange(ev.target.value)}
                className="mt-1"
              />

              <Dropdown.Menu
                show={isDropdownOpen && filteredClients.length > 0}
                className="mt-1"
              >
                {filteredClients.map((client) => (
                  <Dropdown.Item
                    key={client.document}
                    onClick={() => handleSelect(client)}
                  >
                    {client.name} - {client.document}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="cuitOptionId">CUIT de facturacion</Label>
                <Select
                  id="cuitOptionId"
                  onChange={handleChange}
                  value={values.cuitOption}
                  name="cuitOption"
                  error={touched.cuitOption && !!errors.cuitOption}
                  className="mt-1"
                >
                  <option value="">CUIT no seleccionado</option>
                  {CUIT_MAP.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                {errors.cuitOption && touched.cuitOption && (
                  <span className="text-sm text-destructive">
                    {errors.cuitOption}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="saleConditionId">Condición de venta</Label>
                <Select
                  id="saleConditionId"
                  onChange={handleChange}
                  value={values.saleCond}
                  name="saleCond"
                  error={touched.saleCond && !!errors.saleCond}
                  className="mt-1"
                >
                  <option value="">Condición de venta no seleccionada</option>
                  {SALE_CONDITIONS.map((cond) => (
                    <option key={cond} value={cond}>
                      {cond}
                    </option>
                  ))}
                </Select>
                {errors.saleCond && touched.saleCond && (
                  <span className="text-sm text-destructive">
                    {errors.saleCond}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="salePointId">Punto de venta</Label>
                <Select
                  id="salePointId"
                  onChange={handleChange}
                  value={values.salePoint}
                  name="salePoint"
                  error={touched.salePoint && !!errors.salePoint}
                  className="mt-1"
                >
                  <option value="">Punto de venta no seleccionado</option>
                  {SALE_POINTS.map((point) => (
                    <option key={point.name} value={point.value}>
                      {point.name}
                    </option>
                  ))}
                </Select>
                {errors.salePoint && touched.salePoint && (
                  <span className="text-sm text-destructive">
                    {errors.salePoint}
                  </span>
                )}
              </div>

              <div>
                <Label htmlFor="invoiceTypeId">Tipo de factura</Label>
                <Select
                  id="invoiceTypeId"
                  onChange={handleChange}
                  value={values.invoiceType}
                  name="invoiceType"
                  error={touched.invoiceType && !!errors.invoiceType}
                  className="mt-1"
                >
                  <option value="">Tipo de factura no seleccionado</option>
                  <option value="FACTURA_A">Factura A</option>
                  <option value="FACTURA_B">Factura B</option>
                </Select>
                {errors.invoiceType && touched.invoiceType && (
                  <span className="text-sm text-destructive">
                    {errors.invoiceType}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {values.saleCond === "Crédito" && (
                <div>
                  <Label htmlFor="creditCardId">Tarjeta de crédito</Label>
                  <Select
                    id="creditCardId"
                    onChange={handleChange}
                    value={values.creditCard}
                    name="creditCard"
                    className="mt-1"
                  >
                    <option value="">Tarjeta no seleccionada</option>
                    {CREDIT_CARDS.map((card) => (
                      <option key={card} value={card}>
                        {card}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {values.saleCond === "Débito" && (
                <div>
                  <Label htmlFor="debitCardId">Tarjeta de débito</Label>
                  <Select
                    id="debitCardId"
                    onChange={handleChange}
                    value={values.debitCard}
                    name="debitCard"
                    className="mt-1"
                  >
                    <option value="">Tarjeta no seleccionada</option>
                    {DEBIT_CARDS.map((card) => (
                      <option key={card} value={card}>
                        {card}
                      </option>
                    ))}
                  </Select>
                </div>
              )}

              {(values.saleCond === "Crédito" ||
                values.saleCond === "Débito") && (
                <div>
                  <Label htmlFor="paymentsQuantityId">Cantidad de cuotas</Label>
                  <Input
                    id="paymentsQuantityId"
                    type="text"
                    placeholder="Ej: 6"
                    value={values.paymentsQuantity}
                    onChange={handleChange}
                    name="paymentsQuantity"
                    className="mt-1"
                  />
                </div>
              )}
            </div>

            {values.saleCond === "Múltiples métodos de pago" &&
              products.length > 0 && (
                <div className="mb-4 flex justify-between">
                  <h4 className="text-lg font-semibold">
                    {paymentMethods.length > 0 && "Métodos de pago"}
                  </h4>
                  <AddPaymentMethod
                    setPaymentMethods={setPaymentMethods}
                    setPaymentsLeftValue={setPaymentsLeftValue}
                    paymentsLeftValue={paymentsLeftValue}
                  />
                </div>
              )}

            <MultiplePaymentsTable
              paymentMethods={paymentMethods}
              handleDeletePaymentMethod={handleDeletePaymentMethod}
            />

            <hr className="my-6 border-border" />

            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Productos</h4>
              <AddProductComp />
            </div>

            {products.length === 0 ? (
              <p className="text-muted-foreground">
                No hay productos agregados
              </p>
            ) : (
              <>
                <Table responsive className="mt-4">
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Producto</TableHeaderCell>
                      <TableHeaderCell>Precio unitario</TableHeaderCell>
                      <TableHeaderCell>Cantidad</TableHeaderCell>
                      <TableHeaderCell>Subtotal</TableHeaderCell>
                      <TableHeaderCell>Acciones</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody striped hover>
                    {products.map((product) => (
                      <TableRow key={product.productId}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>${formatPrice(product.price)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>
                          ${formatPrice(product.price * product.quantity)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.productId)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex flex-col items-end mt-4 gap-1">
                  <p className="text-lg">
                    IVA:{" "}
                    <span className="font-semibold">
                      ${formatPrice(productsTotal.iva)}
                    </span>
                  </p>
                  <p className="text-lg">
                    Precio s/ IVA:{" "}
                    <span className="font-semibold">
                      ${formatPrice(productsTotal.precioSinIva)}
                    </span>
                  </p>
                  <p className="text-xl font-bold">
                    Total: ${formatPrice(productsTotal.total)}
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-end mt-6 mb-4">
              <Button type="submit" disabled={loading} variant="default">
                {loading ? (
                  <>
                    <Spinner size="sm" variant="dark" />
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Generar factura</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </Formik>
      <NewProductComp />
    </>
  );
};

export default NewInvoiceComp;
