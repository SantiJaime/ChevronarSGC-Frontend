import { useFormik } from "formik";
import {
  type IAuthorizeSale,
  searchSalesValidatorSchema,
} from "../../utils/validationSchemas";
import { Role, SELLERS, SELLERS_MAP } from "../../constants/const";
import Swal from "sweetalert2";
import { formatPrice } from "../../utils/utils";
import useSales from "../../hooks/useSales";
import { useState } from "react";
import { validateSearchSale } from "../../utils/validationFunctions";
import { toast } from "sonner";
import { deleteSale, printSale } from "../../helpers/salesQueries";
import EditSaleComp from "./EditSaleComp";
import AuthorizeSaleComp from "./AuthorizeSaleComp";
import SalesAmountsComp from "./SalesAmountsComp";
import useSession from "../../hooks/useSession";
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
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Printer,
  Trash2,
  Pencil,
  BadgeCheck,
} from "lucide-react";
import UpdateSalePaymentMethods from "./UpdateSalePaymentMethods";

interface FullPaymentsInfo extends IAuthorizeSale {
  totalValue: number;
}

const Sales = () => {
  const { user } = useSession();
  const formik = useFormik({
    initialValues: {
      authorized: "",
      fromDate: "",
      toDate: "",
      sellerId: 0,
      saleNumber: "",
    },
    validationSchema: searchSalesValidatorSchema,
    onSubmit: () => handleSearch(),
  });
  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } =
    formik;

  const { sales, loading, handleGetSales, setSales, handleAuthorize } =
    useSales();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingSaleId, setDeletingSaleId] = useState<string | null>(null);
  const [selectedEditSale, setSelectedEditSale] = useState<FullSale | null>(
    null,
  );
  const [selectedAuthSale, setSelectedAuthSale] = useState<FullSale | null>(
    null,
  );
  const [selectedPaymentSale, setSelectedPaymentSale] =
    useState<FullSaleWithPayments | null>(null);

  const handleSearch = async (paramPage?: number) => {
    const error = validateSearchSale({
      ...values,
      saleNumber: values.saleNumber ? Number(values.saleNumber) : undefined,
    });
    if (error) {
      toast.error(error);
      return;
    }
    const pageToFetch = paramPage || 1;
    setPage(pageToFetch);

    const res = await handleGetSales(
      {
        ...values,
        authorized: JSON.parse(values.authorized),
        saleNumber: Number(values.saleNumber ?? 0),
      },
      pageToFetch,
    );
    if (!res) return;

    setTotalPages(res.totalPages);
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

  const handlePrint = (id: string) => {
    const promise = printSale(id);

    toast.promise(promise, {
      loading: "Generando PDF...",
      success: (res) => {
        open(res.result, "_blank");
        return res.msg;
      },
      error: (err) => {
        const error = err as { error: string };
        return error.error;
      },
    });
  };

  const handleDelete = (sale: FullSale) => {
    Swal.fire({
      title: "Estas seguro de eliminar este presupuesto de venta?",
      text: "Esta accion no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingSaleId(sale._id);
        const promise = deleteSale(sale._id).finally(() =>
          setDeletingSaleId(null),
        );

        toast.promise(promise, {
          loading: "Eliminando presupuesto de venta...",
          success: (res) => {
            setSales((prevSales) =>
              prevSales.filter((s) => s._id !== sale._id),
            );
            return res.msg;
          },
          error: (err) => {
            const error = err as { error: string };
            return error.error;
          },
        });
      }
    });
  };

  const handleAuthorizeSale = async (
    id: string,
    paymentsInfo: FullPaymentsInfo,
  ) => {
    const res = await handleAuthorize(id, paymentsInfo);
    if (res) {
      open(res.result, "_blank");
      toast.success(res.msg, {
        description: (
          <div style={{ marginTop: "8px" }}>
            En caso de que el presupuesto no se abra, podés visualizarlo aquí:
            <br />
            <a
              href={res?.result}
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
              Ver presupuesto de venta
            </a>
          </div>
        ),
        duration: 5000,
        closeButton: true,
      });
    }
  };

  const deleteInProgress = deletingSaleId !== null;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Historial de presupuestos de ventas
        </h2>
        {user && user.role !== Role.VENDEDOR && <SalesAmountsComp />}
      </div>
      <hr className="border-border mb-4" />

      <form noValidate onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="isSaleAuthId">Estado *</Label>
            <Select
              id="isSaleAuthId"
              name="authorized"
              value={values.authorized}
              onChange={handleChange}
              error={touched.authorized && !!errors.authorized}
              className="mt-1"
            >
              <option value="">Estado no seleccionado</option>
              <option value="true">Autorizado</option>
              <option value="false">Pendiente de autorización</option>
            </Select>
            {errors.authorized && touched.authorized && (
              <span className="text-sm text-destructive">
                {errors.authorized}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="saleSellerId">Vendedor</Label>
            <Select
              id="saleSellerId"
              name="sellerId"
              value={values.sellerId}
              onChange={handleChange}
              className="mt-1"
            >
              <option value={0}>Vendedor no seleccionado</option>
              {SELLERS.map(({ label, value }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="saleFromDateId">Desde</Label>
            <Input
              id="saleFromDateId"
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
              error={touched.fromDate && !!errors.fromDate}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="saleToDateId">Hasta</Label>
            <Input
              id="saleToDateId"
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
              error={touched.toDate && !!errors.toDate}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="saleNumberId">Número de presupuesto</Label>
            <Input
              id="saleNumberId"
              type="text"
              name="saleNumber"
              value={values.saleNumber}
              onChange={handleChange}
              placeholder="Ej: 20"
              autoComplete="off"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="default">
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
      ) : sales.length === 0 ? (
        <h4 className="text-center text-lg text-muted-foreground py-8">
          No se encontraron presupuestos de ventas
        </h4>
      ) : (
        <>
          <Table responsive>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Cliente</TableHeaderCell>
                <TableHeaderCell>Vendedor</TableHeaderCell>
                <TableHeaderCell>Nro. de presupuesto</TableHeaderCell>
                <TableHeaderCell>Fecha de emisión</TableHeaderCell>
                <TableHeaderCell>Método de pago</TableHeaderCell>
                <TableHeaderCell>Importes</TableHeaderCell>
                <TableHeaderCell>Estado</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody striped hover>
              {sales.map((sale) => {
                const isThisRowDeleting = deletingSaleId === sale._id;
                return (
                  <TableRow key={sale._id}>
                    <TableCell>{sale.clientName}</TableCell>
                    <TableCell>{SELLERS_MAP[sale.sellerId]}</TableCell>
                    <TableCell>Presupuesto Nro. {sale.saleNumber}</TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>{sale.payments}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <strong>Subtotal:</strong> ${formatPrice(sale.total)}
                        </div>
                        <div className="text-sm">
                          <strong>Total:</strong> $
                          {formatPrice(sale.totalWithInterest)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          sale.authorized
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {sale.authorized ? "Autorizado" : "Pendiente"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 flex-wrap">
                        {!sale.authorized ? (
                          <>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => setSelectedEditSale(sale)}
                            >
                              <Pencil className="h-4 w-4" />
                              <span>Editar</span>
                            </Button>
                            <Button
                              variant="info"
                              size="sm"
                              onClick={() => setSelectedAuthSale(sale)}
                            >
                              <BadgeCheck className="h-4 w-4" />
                              <span>Autorizar</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handlePrint(sale._id)}
                            >
                              <Printer className="h-4 w-4" />
                              <span>Imprimir</span>
                            </Button>
                            {user && user.role === Role.MARTIN && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() =>
                                  setSelectedPaymentSale(
                                    sale as FullSaleWithPayments,
                                  )
                                }
                              >
                                <Pencil className="h-4 w-4" />
                                <span>Editar métodos de pago</span>
                              </Button>
                            )}
                          </>
                        )}
                        {user && user.role !== Role.VENDEDOR && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(sale)}
                            disabled={deleteInProgress}
                          >
                            {isThisRowDeleting ? (
                              <>
                                <Spinner size="sm" variant="light" />
                                <span>Eliminando...</span>
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4" />
                                <span>Eliminar</span>
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex justify-center items-center gap-4 mt-4 mb-4">
            <Button
              onClick={goToPreviousPage}
              disabled={page === 1}
              variant="dark"
              size="sm"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Anterior</span>
            </Button>
            <span className="text-sm">
              Pagina <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>
            <Button
              onClick={goToNextPage}
              disabled={page === totalPages}
              variant="dark"
              size="sm"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {selectedEditSale && (
        <EditSaleComp
          sale={selectedEditSale}
          show={!!selectedEditSale}
          onHide={() => setSelectedEditSale(null)}
        />
      )}
      {selectedAuthSale && (
        <AuthorizeSaleComp
          sale={selectedAuthSale}
          handleAuthorizeSale={handleAuthorizeSale}
          show={!!selectedAuthSale}
          onHide={() => setSelectedAuthSale(null)}
        />
      )}
      {selectedPaymentSale && (
        <UpdateSalePaymentMethods
          sale={selectedPaymentSale}
          show={!!selectedPaymentSale}
          onHide={() => setSelectedPaymentSale(null)}
        />
      )}
    </div>
  );
};

export default Sales;
