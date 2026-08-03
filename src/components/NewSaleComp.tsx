import { Formik } from "formik";
import { SELLERS } from "../constants/const";
import AddProductComp from "./AddProductComp";
import { formatPrice } from "../utils/utils";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { type NewSale, newSaleSchema } from "../utils/validationSchemas";
import { toast } from "sonner";
import useSales from "../hooks/useSales";
import useInvoiceProducts from "../hooks/useInvoiceProducts";
import NewProductComp from "./NewProductComp";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select } from "./ui/Select";
import { Spinner } from "./ui/Spinner";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "./ui/Table";
import { Check, Trash2 } from "lucide-react";

const NewSaleComp = () => {
  const [productsTotal, setProductsTotal] = useState(0);
  const { handleCreate, loading } = useSales();
  const { products, setProducts } = useInvoiceProducts();

  useEffect(() => {
    const total = products.reduce(
      (total, product) => total + product.productSubtotal,
      0,
    );

    setProductsTotal(total);
  }, [products]);

  const handleSubmit = async (values: NewSale, resetForm: () => void) => {
    if (products.length === 0) {
      toast.error("El presupuesto para venta debe tener al menos un producto");
      return;
    }

    const res = await handleCreate({ ...values, products });
    if (res) {
      toast.success(res.msg);
      resetForm();
      setProducts([]);
    }
  };

  const handleDelete = (productName: string) => {
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
          (product) => product.productName !== productName,
        );
        setProducts(newProducts);
      }
    });
  };

  return (
    <>
      <Formik
        validationSchema={newSaleSchema}
        onSubmit={(values, { resetForm }) =>
          handleSubmit(
            { ...values, clientName: values.clientName.trim() },
            resetForm,
          )
        }
        initialValues={{
          clientName: "",
          sellerId: 0,
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
          <form noValidate onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="clientNameId">Nombre del cliente o vehiculo</Label>
                <Input
                  id="clientNameId"
                  value={values.clientName}
                  placeholder="Ej: Juan Perez"
                  type="text"
                  name="clientName"
                  onChange={handleChange}
                  error={touched.clientName && !!errors.clientName}
                  className="mt-1"
                />
                {errors.clientName && touched.clientName && (
                  <span className="text-sm text-destructive">{errors.clientName}</span>
                )}
              </div>
              
              <div>
                <Label htmlFor="sellerId">Vendedor</Label>
                <Select
                  id="sellerId"
                  onChange={(ev) => {
                    setFieldValue("sellerId", Number(ev.target.value));
                  }}
                  value={values.sellerId}
                  name="sellerId"
                  error={touched.sellerId && !!errors.sellerId}
                  className="mt-1"
                >
                  <option value={0}>Vendedor no seleccionado</option>
                  {SELLERS.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
                {errors.sellerId && touched.sellerId && (
                  <span className="text-sm text-destructive">{errors.sellerId}</span>
                )}
              </div>
            </div>
            
            <hr className="my-6 border-border" />
            
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">Productos</h4>
              <AddProductComp />
            </div>
            
            {products.length === 0 ? (
              <p className="text-muted-foreground">No hay productos agregados</p>
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
                      <TableRow key={product.productName}>
                        <TableCell>{product.productName}</TableCell>
                        <TableCell>${formatPrice(product.price)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>${formatPrice(product.productSubtotal)}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(product.productName)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="flex flex-col items-end mt-4">
                  <p className="text-xl font-bold">Total: ${formatPrice(productsTotal)}</p>
                </div>
              </>
            )}
            
            <div className="flex justify-end mt-6 mb-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" variant="dark" />
                    <span>Cargando...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Generar presupuesto para venta</span>
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

export default NewSaleComp;
