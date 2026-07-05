import { useFormik } from "formik";
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
  CUIT_MAP,
  DEBIT_CARDS,
  SALE_CONDITIONS,
  SALE_POINTS,
} from "../constants/const";
import InvoiceDetails from "./InvoiceDetails";
import { validateSearchInvoice } from "../utils/validationFunctions";
import { formatPrice } from "../utils/utils";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select } from "./ui/Select";
import { Spinner } from "./ui/Spinner";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "./ui/Table";
import { Search, ChevronLeft, ChevronRight, Printer, FileX } from "lucide-react";

const Invoices = () => {
  const INVOICES_TYPES = [
    { name: "Factura A", value: 1 },
    { name: "Factura B", value: 6 },
    { name: "Nota de crédito A", value: 3 },
    { name: "Nota de crédito B", value: 8 },
  ];
  
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      cuitOption: "",
      clientName: "",
      clientDocument: "",
      cbteTipo: undefined,
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

  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } = formik;

  const [invoices, setInvoices] = useState<FullInvoice[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const handleSearch = (paramPage?: number) => {
    validateSearchInvoice(values);
    setLoading(true);

    const pageToFetch = paramPage || 1;
    setPage(pageToFetch);
    
    getInvoices(values, pageToFetch)
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
      handleSearch(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      handleSearch(page - 1);
    }
  };

  const handleCancelInvoice = (id: string) => {
    Swal.fire({
      title: "Estas seguro de anular esta factura?",
      text: "Esta accion no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, anular",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoadingCancel(true);
        const promise = cancelInvoice(values.cuitOption, id)
          .then((res) => {
            open(res.result, "_blank");

            setInvoices((prevState) => {
              const updatedInvoices = prevState.map((invoice) =>
                invoice._id === id
                  ? { ...invoice, cancelled: true }
                  : invoice,
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
          success: (data) => (
            <span>
              <b>{data.msg}</b>
              <br />
              En caso de que la nota de crédito no se abra, podés visualizarla en el siguiente enlace:
              <br />
              <a
                href={data.result}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: "bold", textDecoration: "underline" }}
              >
                Ver nota de crédito
              </a>
            </span>
          ),
          error: (err) => `${err.error}`,
          finally: () => setLoadingCancel(false),
        });
      }
    });
  };

  const handlePrint = (id: string) => {
    const promise = printInvoice(id)
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
      <h2 className="text-xl font-bold mb-4">Historial de facturas</h2>
      <hr className="border-border mb-4" />
      
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="fromDateId">Desde *</Label>
            <Input
              id="fromDateId"
              type="text"
              name="fromDate"
              value={values.fromDate}
              onChange={(ev) => {
                let value = ev.target.value.replace(/[^0-9]/g, "");
                if (value.length > 4) value = `${value.slice(0, 4)}-${value.slice(4)}`;
                if (value.length > 7) value = `${value.slice(0, 7)}-${value.slice(7, 9)}`;
                setFieldValue("fromDate", value);
              }}
              placeholder="YYYY-MM-DD"
              error={touched.fromDate && !!errors.fromDate}
              className="mt-1"
            />
            {errors.fromDate && touched.fromDate && (
              <span className="text-sm text-destructive">{errors.fromDate}</span>
            )}
          </div>
          
          <div>
            <Label htmlFor="toDateId">Hasta *</Label>
            <Input
              id="toDateId"
              type="text"
              name="toDate"
              value={values.toDate}
              onChange={(ev) => {
                let value = ev.target.value.replace(/[^0-9]/g, "");
                if (value.length > 4) value = `${value.slice(0, 4)}-${value.slice(4)}`;
                if (value.length > 7) value = `${value.slice(0, 7)}-${value.slice(7, 9)}`;
                setFieldValue("toDate", value);
              }}
              placeholder="YYYY-MM-DD"
              error={touched.toDate && !!errors.toDate}
              className="mt-1"
            />
            {errors.toDate && touched.toDate && (
              <span className="text-sm text-destructive">{errors.toDate}</span>
            )}
          </div>
          
          <div>
            <Label htmlFor="cuitOptionId">CUIT de facturacion *</Label>
            <Select
              id="cuitOptionId"
              name="cuitOption"
              value={values.cuitOption}
              onChange={handleChange}
              error={touched.cuitOption && !!errors.cuitOption}
              className="mt-1"
            >
              <option value="">CUIT no seleccionado</option>
              {CUIT_MAP.map(({ value, label }) => (
                <option value={value} key={value}>{label}</option>
              ))}
            </Select>
            {errors.cuitOption && touched.cuitOption && (
              <span className="text-sm text-destructive">{errors.cuitOption}</span>
            )}
          </div>
          
          <div>
            <Label htmlFor="salePointId">Punto de venta *</Label>
            <Select
              id="salePointId"
              name="salePoint"
              value={values.salePoint}
              onChange={handleChange}
              error={touched.salePoint && !!errors.salePoint}
              className="mt-1"
            >
              <option value="">Punto de venta no seleccionado</option>
              {SALE_POINTS.map((point) => (
                <option value={point.value} key={point.name}>{point.name}</option>
              ))}
            </Select>
            {errors.salePoint && touched.salePoint && (
              <span className="text-sm text-destructive">{errors.salePoint}</span>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="clientDocumentId">Documento del cliente</Label>
            <Input
              id="clientDocumentId"
              type="text"
              name="clientDocument"
              value={values.clientDocument}
              onChange={handleChange}
              placeholder="Ej: 12345678912"
              autoComplete="off"
              error={touched.clientDocument && !!errors.clientDocument}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="clientNameId">Nombre del cliente</Label>
            <Input
              id="clientNameId"
              type="text"
              name="clientName"
              value={values.clientName}
              onChange={handleChange}
              placeholder="Ej: Juan Perez"
              autoComplete="off"
              error={touched.clientName && !!errors.clientName}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="invoiceNumberId">Número de factura</Label>
            <Input
              id="invoiceNumberId"
              type="text"
              name="invoiceNumber"
              value={values.invoiceNumber}
              onChange={handleChange}
              placeholder="Ej: 20"
              autoComplete="off"
              error={touched.invoiceNumber && !!errors.invoiceNumber}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="invoiceTypeId">Tipo de factura</Label>
            <Select
              id="invoiceTypeId"
              name="cbteTipo"
              value={values.cbteTipo}
              onChange={(ev) => {
                if (isNaN(Number(ev.target.value))) {
                  setFieldValue("cbteTipo", undefined);
                  return;
                }
                setFieldValue("cbteTipo", Number(ev.target.value));
              }}
              error={touched.cbteTipo && !!errors.cbteTipo}
              className="mt-1"
            >
              <option value={undefined}>Todas</option>
              {INVOICES_TYPES.map((type) => (
                <option value={type.value} key={type.name}>{type.name}</option>
              ))}
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="saleConditionId">Condición de venta</Label>
            <Select
              id="saleConditionId"
              name="saleCond"
              value={values.saleCond}
              onChange={handleChange}
              className="mt-1"
            >
              <option value="">Condición de venta no seleccionada</option>
              {SALE_CONDITIONS.map((cond) => (
                <option value={cond} key={cond}>{cond}</option>
              ))}
            </Select>
          </div>
          
          {values.saleCond === "Crédito" && (
            <>
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
                    <option key={card} value={card}>{card}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentsQuantityId">Cantidad de cuotas</Label>
                <Input
                  id="paymentsQuantityId"
                  type="text"
                  name="paymentsQuantity"
                  value={values.paymentsQuantity}
                  onChange={handleChange}
                  placeholder="Ej: 3"
                  autoComplete="off"
                  className="mt-1"
                />
              </div>
            </>
          )}
          
          {values.saleCond === "Débito" && (
            <>
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
                    <option key={card} value={card}>{card}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="paymentsQuantityId">Cantidad de cuotas</Label>
                <Input
                  id="paymentsQuantityId"
                  type="text"
                  name="paymentsQuantity"
                  value={values.paymentsQuantity}
                  onChange={handleChange}
                  placeholder="Ej: 3"
                  autoComplete="off"
                  className="mt-1"
                />
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" variant="dark">
            <Search className="h-4 w-4" />
            <span>Buscar</span>
          </Button>
        </div>
      </form>
      
      <hr className="border-border my-4" />
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <Spinner size="lg" />
          <h4 className="mt-4 text-lg font-medium">Cargando...</h4>
        </div>
      ) : invoices.length === 0 ? (
        <h4 className="text-center text-lg text-muted-foreground py-8">No se encontraron facturas</h4>
      ) : (
        <>
          <Table responsive>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Cliente</TableHeaderCell>
                <TableHeaderCell>Nro. de factura | Tipo</TableHeaderCell>
                <TableHeaderCell>Importes | Condición de venta</TableHeaderCell>
                <TableHeaderCell>Punto de venta</TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody striped hover>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id}>
                  <TableCell>{invoice.client.name} | {invoice.client.document}</TableCell>
                  <TableCell>Factura No {invoice.invoiceNumber} | {invoice.invoiceType}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        <strong>Total:</strong> ${formatPrice(invoice.amounts.total)} |
                        <strong> IVA:</strong> ${formatPrice(invoice.amounts.iva)} |
                        <strong> Precio sin IVA:</strong> ${formatPrice(invoice.amounts.precioSinIva)}
                      </div>
                      <div className="text-sm">
                        <strong>{invoice.saleCond}</strong>
                        {(invoice.debitCard || invoice.creditCard) && ` - ${invoice.debitCard || invoice.creditCard}`}
                        {" "}- {invoice.paymentsQuantity} pago(s)
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {invoice.salePoint === "00011" ? "Av. San Martin 112" : "Av. Colon 315"}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      invoice.cancelled 
                        ? "bg-destructive/10 text-destructive" 
                        : "bg-success/10 text-success"
                    }`}>
                      {invoice.cancelled ? "Anulada" : "Autorizada"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <InvoiceDetails invoice={invoice} />
                      <Button variant="success" size="sm" onClick={() => handlePrint(invoice._id)}>
                        <Printer className="h-4 w-4" />
                        <span>Imprimir</span>
                      </Button>
                      {!invoice.cancelled && !invoice.assocInvoiceNumber && (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={loadingCancel}
                          onClick={() => handleCancelInvoice(invoice._id)}
                        >
                          {loadingCancel ? (
                            <>
                              <Spinner size="sm" variant="light" />
                              <span>Anulando...</span>
                            </>
                          ) : (
                            <>
                              <FileX className="h-4 w-4" />
                              <span>Anular</span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="flex justify-center items-center gap-4 mt-4 mb-4">
            <Button onClick={goToPreviousPage} disabled={page === 1} variant="dark" size="sm">
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>
            <span className="text-sm">
              Pagina <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>
            <Button onClick={goToNextPage} disabled={page === totalPages} variant="dark" size="sm">
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Invoices;
