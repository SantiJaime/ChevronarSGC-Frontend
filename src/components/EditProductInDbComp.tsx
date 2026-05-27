import React, { useState } from "react";
import { useFormik } from "formik";
import { NumericFormat } from "react-number-format";
import { editProductSchema } from "../utils/validationSchemas";
import useProducts from "../hooks/useProducts";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Spinner } from "./ui/Spinner";
import { Badge } from "./ui/Badge";
import { Pencil, Tag, DollarSign, ShoppingCart, Barcode, Save, X } from "lucide-react";

interface Props {
  product: ProductInDb;
  onProductUpdated?: (product: ProductInDb) => void;
}

const EditProductInDbComp: React.FC<Props> = ({
  product,
  onProductUpdated,
}) => {
  const { handleEditProduct, loading } = useProducts();
  const [show, setShow] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");

  const handleClose = () => {
    setShow(false);
    setBarcodeInput("");
    resetForm();
  };
  const handleShow = () => setShow(true);

  const formik = useFormik({
    initialValues: {
      productName: product.productName,
      price: product.price,
      stock: product.stock,
      barcodes: product.barcodes || [],
    },
    validationSchema: editProductSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      handleEditProduct(
        { ...product, ...values },
        resetForm,
        handleClose,
        onProductUpdated,
      );
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = formik;

  const addCurrentBarcode = () => {
    const newCode = barcodeInput.trim();
    if (newCode && !values.barcodes.includes(newCode)) {
      setFieldValue("barcodes", [...values.barcodes, newCode]);
      setBarcodeInput("");
    }
  };

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCurrentBarcode();
    }
  };

  const removeBarcode = (codeToRemove: string) => {
    setFieldValue(
      "barcodes",
      values.barcodes.filter((code: string) => code !== codeToRemove),
    );
  };

  return (
    <>
      <Button variant="info" size="sm" onClick={handleShow}>
        <Pencil className="h-4 w-4" />
        <span>Editar</span>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar producto {product.productId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form noValidate onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="editProductNameId">Nombre</Label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                </div>
                <Input
                  id="editProductNameId"
                  type="text"
                  name="productName"
                  onChange={handleChange}
                  value={values.productName}
                  error={touched.productName && !!errors.productName}
                  className="pl-10"
                />
              </div>
              {errors.productName && touched.productName && (
                <span className="text-sm text-destructive">{errors.productName as string}</span>
              )}
            </div>
            
            <div className="mb-4">
              <Label htmlFor="editProductPriceId">Precio unitario</Label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                </div>
                <NumericFormat
                  id="editProductPriceId"
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  prefix="$"
                  name="price"
                  placeholder="10.000"
                  value={values.price}
                  onValueChange={({ value }) =>
                    setFieldValue("price", Number(value))
                  }
                  className={`flex h-10 w-full rounded-lg border bg-background pl-10 pr-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    touched.price && errors.price ? "border-destructive" : "border-input"
                  }`}
                />
              </div>
              {errors.price && touched.price && (
                <span className="text-sm text-destructive">{errors.price as string}</span>
              )}
            </div>
            
            <div className="mb-4">
              <Label htmlFor="editProductStockId">Stock</Label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <Input
                  id="editProductStockId"
                  type="number"
                  name="stock"
                  onChange={handleChange}
                  value={values.stock}
                  error={touched.stock && !!errors.stock}
                  className="pl-10"
                />
              </div>
              {errors.stock && touched.stock && (
                <span className="text-sm text-destructive">{errors.stock as string}</span>
              )}
            </div>
            
            <div className="mb-4">
              <Label htmlFor="editBarcodeId">Códigos de barras</Label>
              <div className="flex gap-2 mt-1">
                <div className="relative flex-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Barcode className="h-4 w-4" />
                  </div>
                  <Input
                    id="editBarcodeId"
                    type="text"
                    placeholder="Escanea para agregar o presiona Enter..."
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    onKeyDown={handleBarcodeKeyDown}
                    autoComplete="off"
                    autoFocus
                    className="pl-10"
                  />
                </div>
                <Button type="button" variant="secondary" onClick={addCurrentBarcode}>
                  Agregar
                </Button>
              </div>
              
              {values.barcodes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {values.barcodes.map((code) => (
                    <Badge key={code} variant="default" className="flex items-center gap-1 px-3 py-1.5">
                      {code}
                      <button
                        type="button"
                        onClick={() => removeBarcode(code)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button variant="dark" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" variant="light" />
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProductInDbComp;
