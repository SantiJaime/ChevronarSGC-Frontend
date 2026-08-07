import { useState } from "react";
import { Formik } from "formik";
import { addProductSchema } from "../../utils/validationSchemas";
import { NumericFormat } from "react-number-format";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Pencil, Tag, DollarSign, ShoppingCart } from "lucide-react";

interface Props {
  product: Product;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  index: number;
}

const EditProductComp: React.FC<Props> = ({ product, setProducts, index }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const editProduct = (editedProduct: Product) => {
    setProducts((prevProducts) => {
      const newProducts = [...prevProducts];
      newProducts[index] = editedProduct;
      return newProducts;
    });
    handleClose();
  };

  return (
    <>
      <Button variant="info" size="sm" onClick={handleShow}>
        <Pencil className="h-4 w-4" />
        <span>Editar</span>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar este producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={addProductSchema}
            initialValues={{
              productId: product.productId,
              productName: product.productName,
              price: product.price,
              quantity: product.quantity,
            }}
            onSubmit={(values) => {
              const submitValues = {
                ...values,
                quantity: Number(values.quantity),
                price: Number(values.price),
                productSubtotal: Number(values.quantity) * Number(values.price),
              };
              editProduct(submitValues);
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <Label htmlFor="productNameId">Nombre</Label>
                  <div className="relative mt-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Tag className="h-4 w-4" />
                    </div>
                    <Input
                      id="productNameId"
                      placeholder="Ej: Kit de distribución"
                      type="text"
                      name="productName"
                      value={values.productName}
                      onChange={handleChange}
                      error={touched.productName && !!errors.productName}
                      className="pl-10"
                    />
                  </div>
                  {errors.productName && touched.productName && (
                    <span className="text-sm text-destructive">{errors.productName}</span>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="priceId">Precio unitario</Label>
                  <div className="relative mt-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                    </div>
                    <NumericFormat
                      id="priceId"
                      thousandSeparator="."
                      decimalSeparator=","
                      decimalScale={2}
                      prefix="$"
                      name="price"
                      placeholder="10.000"
                      value={values.price}
                      onValueChange={({ value }) =>
                        setFieldValue("price", value)
                      }
                      className={`flex h-10 w-full rounded-lg border bg-background pl-10 pr-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        touched.price && errors.price ? "border-destructive" : "border-input"
                      }`}
                    />
                  </div>
                  {errors.price && touched.price && (
                    <span className="text-sm text-destructive">{errors.price}</span>
                  )}
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="quantityId">Cantidad</Label>
                  <div className="relative mt-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <ShoppingCart className="h-4 w-4" />
                    </div>
                    <Input
                      id="quantityId"
                      placeholder="Ej: 1"
                      type="number"
                      name="quantity"
                      value={values.quantity}
                      onChange={handleChange}
                      error={touched.quantity && !!errors.quantity}
                      className="pl-10"
                    />
                  </div>
                  {errors.quantity && touched.quantity && (
                    <span className="text-sm text-destructive">{errors.quantity}</span>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <Button variant="dark" type="submit">
                    Guardar cambios
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProductComp;
