import { useFormik } from "formik";
import { searchBudgetSchema } from "../../utils/validationSchemas";
import { useState } from "react";
import {
  deleteBudget,
  getBudgets,
  printBudget,
} from "../../helpers/invoicesQueries";
import { toast } from "sonner";
import {
  BUDGET_SALE_POINTS,
  CREDIT_CARDS,
  DEBIT_CARDS,
  SALE_CONDITIONS,
} from "../../constants/const";
import { validateSearchInvoice } from "../../utils/validationFunctions";
import Swal from "sweetalert2";
import { formatPrice } from "../../utils/utils";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";
import { Spinner } from "../ui/Spinner";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "../ui/Table";
import { Search, ChevronLeft, ChevronRight, Printer, Trash2 } from "lucide-react";

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

  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } = formik;

  const [budgets, setBudgets] = useState<FullBudget[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);

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

  const handlePrint = (id: string) => {
    const promise = printBudget(id)
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
      title: "Estas seguro de eliminar este presupuesto?",
      text: "Esta accion no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        setDeletingBudgetId(id);
        const promise = deleteBudget(id)
          .then((res) => {
            setBudgets((prevBudgets) =>
              prevBudgets.filter((budget) => budget._id !== id)
            );
            return res;
          })
          .catch((err) => {
            throw err;
          })
          .finally(() => setDeletingBudgetId(null));

        toast.promise(promise, {
          loading: "Eliminando presupuesto...",
          success: (res) => `${res.msg}`,
          error: (err) => `${err.error}`,
        });
      }
    });
  };

  const deleteInProgress = deletingBudgetId !== null;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Historial de presupuestos</h2>
      <hr className="border-border mb-4" />

      <form noValidate onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label htmlFor="budgetFromDateId">Desde *</Label>
            <Input
              id="budgetFromDateId"
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
            <Label htmlFor="budgetToDateId">Hasta *</Label>
            <Input
              id="budgetToDateId"
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
            <Label htmlFor="budgetSalePointId">Punto de venta *</Label>
            <Select
              id="budgetSalePointId"
              name="salePoint"
              value={values.salePoint}
              onChange={handleChange}
              error={touched.salePoint && !!errors.salePoint}
              className="mt-1"
            >
              <option value="">Punto de venta no seleccionado</option>
              {BUDGET_SALE_POINTS.map((point) => (
                <option value={point.value} key={point.name}>{point.name}</option>
              ))}
            </Select>
            {errors.salePoint && touched.salePoint && (
              <span className="text-sm text-destructive">{errors.salePoint}</span>
            )}
          </div>
          
          <div>
            <Label htmlFor="budgetClientDocumentId">Documento del cliente</Label>
            <Input
              id="budgetClientDocumentId"
              type="text"
              name="clientDocument"
              value={values.clientDocument}
              onChange={handleChange}
              placeholder="Ej: 12345678912"
              autoComplete="off"
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="budgetClientNameId">Nombre del cliente</Label>
            <Input
              id="budgetClientNameId"
              type="text"
              name="clientName"
              value={values.clientName}
              onChange={handleChange}
              placeholder="Ej: Juan Perez"
              autoComplete="off"
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="budgetNumberId">Número de presupuesto</Label>
            <Input
              id="budgetNumberId"
              type="text"
              name="budgetNumber"
              value={values.budgetNumber}
              onChange={handleChange}
              placeholder="Ej: 20"
              autoComplete="off"
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="budgetSaleConditionId">Condición de venta</Label>
            <Select
              id="budgetSaleConditionId"
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
                <Label htmlFor="budgetCreditCardId">Tarjeta de crédito</Label>
                <Select
                  id="budgetCreditCardId"
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
                <Label htmlFor="budgetCreditPaymentsQuantityId">Cantidad de cuotas</Label>
                <Input
                  id="budgetCreditPaymentsQuantityId"
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
                <Label htmlFor="budgetDebitCardId">Tarjeta de débito</Label>
                <Select
                  id="budgetDebitCardId"
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
                <Label htmlFor="budgetDebitPaymentsQuantityId">Cantidad de cuotas</Label>
                <Input
                  id="budgetDebitPaymentsQuantityId"
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
      ) : budgets.length === 0 ? (
        <h4 className="text-center text-lg text-muted-foreground py-8">No se encontraron presupuestos</h4>
      ) : (
        <>
          <Table responsive>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Cliente</TableHeaderCell>
                <TableHeaderCell>Nro. de presupuesto</TableHeaderCell>
                <TableHeaderCell>Importes | Condición de venta</TableHeaderCell>
                <TableHeaderCell>Punto de venta</TableHeaderCell>
                <TableHeaderCell>Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody striped hover>
              {budgets.map((budget) => {
                const isThisRowDeleting = deletingBudgetId === budget._id;
                return (
                  <TableRow key={budget._id}>
                    <TableCell>{budget.client.name} | {budget.client.document}</TableCell>
                    <TableCell>Presupuesto No {budget.budgetNumber}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          <strong>Total:</strong> ${formatPrice(budget.amounts.total)} |
                          <strong> IVA:</strong> ${formatPrice(budget.amounts.iva)} |
                          <strong> Precio sin IVA:</strong> ${formatPrice(budget.amounts.precioSinIva)}
                        </div>
                        <div className="text-sm">
                          <strong>{budget.saleCond}</strong>
                          {(budget.debitCard || budget.creditCard) && ` - ${budget.debitCard || budget.creditCard}`}
                          {" "}- {budget.paymentsQuantity} pago(s)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {budget.salePoint === "00002" ? "Av. San Martin 112" : "Av. Colon 315"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="success" size="sm" onClick={() => handlePrint(budget._id)}>
                          <Printer className="h-4 w-4" />
                          <span>Imprimir</span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(budget._id)}
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
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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

export default Budgets;
