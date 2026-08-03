import { Formik } from "formik";
import { useState } from "react";
import { SELLERS } from "../constants/const";
import AddProductComp from "./AddProductComp";
import { formatPrice } from "../utils/utils";
import { newSaleSchema } from "../utils/validationSchemas";
import Swal from "sweetalert2";
import useSales from "../hooks/useSales";
import { toast } from "sonner";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select } from "./ui/Select";
import { Spinner } from "./ui/Spinner";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "./ui/Table";
import { Pencil, User, Users, Trash2, X, Save } from "lucide-react";

interface FormValues {
  clientName: string;
  sellerId: number;
  products: Product[];
}

interface Props {
  sale: FullSale;
}

const EditSaleComp: React.FC<Props> = ({ sale }) => {
  const { handleEdit, loading } = useSales();
  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmitForm = async (values: FormValues) => {
    if (values.products.length === 0) {
      toast.error("Debe existir al menos un producto en el presupuesto");
      return;
    }

    const newTotal = values.products.reduce(
      (acc: number, product: Product) => acc + product.productSubtotal,
      0,
    );

    const editedSale: FullSale = {
      ...sale,
      ...values,
      total: newTotal,
    };

    await handleEdit(editedSale, newTotal);
    handleClose();
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        <Pencil className="h-4 w-4" />
        <span>Editar</span>
      </Button>

      <Modal show={show} onHide={handleClose} size="lg" backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Editar presupuesto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik<FormValues>
            validationSchema={newSaleSchema}
            initialValues={{
              clientName: sale.clientName,
              sellerId: sale.sellerId,
              products: sale.products,
            }}
            onSubmit={handleSubmitForm}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => {
              const handleProductsUpdate = (
                action: React.SetStateAction<Product[]>,
              ) => {
                let newProducts: Product[];

                if (typeof action === "function") {
                  newProducts = action(values.products);
                } else {
                  newProducts = action;
                }

                setFieldValue("products", newProducts);
              };

              const handleDeleteProduct = (productId: number) => {
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
                    const filtered = values.products.filter(
                      (p) => p.productId !== productId,
                    );
                    setFieldValue("products", filtered);
                  }
                });
              };

              return (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <Label htmlFor="editSaleClientNameId">Nombre del cliente o vehiculo</Label>
                    <div className="relative mt-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <User className="h-4 w-4" />
                      </div>
                      <Input
                        id="editSaleClientNameId"
                        placeholder="Ej: Juan Perez | Corsa 1.6"
                        type="text"
                        name="clientName"
                        value={values.clientName}
                        onChange={handleChange}
                        error={touched.clientName && !!errors.clientName}
                        className="pl-10"
                      />
                    </div>
                    {errors.clientName && touched.clientName && (
                      <span className="text-sm text-destructive">{errors.clientName}</span>
                    )}
                  </div>

                  <div className="mb-4">
                    <Label htmlFor="editSaleSellerId">Vendedor</Label>
                    <div className="relative mt-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10">
                        <Users className="h-4 w-4" />
                      </div>
                      <Select
                        id="editSaleSellerId"
                        onChange={(ev) => {
                          setFieldValue("sellerId", Number(ev.target.value));
                        }}
                        value={values.sellerId}
                        name="sellerId"
                        error={touched.sellerId && !!errors.sellerId}
                        className="pl-10"
                      >
                        {SELLERS.map((seller) => (
                          <option key={seller.value} value={seller.value}>
                            {seller.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    {errors.sellerId && touched.sellerId && (
                      <span className="text-sm text-destructive">{errors.sellerId}</span>
                    )}
                  </div>
                  
                  <hr className="border-border my-4" />
                  
                  <div className="flex justify-end mb-4">
                    <AddProductComp setEditProducts={handleProductsUpdate} />
                  </div>
                  
                  {values.products.length === 0 ? (
                    <h5 className="text-center text-muted-foreground">No se agregaron productos</h5>
                  ) : (
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
                        {values.products.map((product) => (
                          <TableRow key={product.productId}>
                            <TableCell>{product.productName}</TableCell>
                            <TableCell>${formatPrice(product.price)}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>${formatPrice(product.price * product.quantity)}</TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.productId)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>Eliminar</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}

                  <hr className="border-border my-4" />
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="secondary" onClick={handleClose}>
                      <X className="h-4 w-4" />
                      <span>Cancelar</span>
                    </Button>
                    <Button variant="default" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner size="sm" variant="dark" />
                          <span>Guardando...</span>
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          <span>Guardar cambios</span>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditSaleComp;
