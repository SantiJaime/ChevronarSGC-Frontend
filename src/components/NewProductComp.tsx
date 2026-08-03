import React, { useState } from "react";
import { useFormik } from "formik";
import { NumericFormat } from "react-number-format";
import { createNewProduct } from "../utils/validationSchemas";
import useProducts from "../hooks/useProducts";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Spinner } from "./ui/Spinner";
import { Badge } from "./ui/Badge";
import { Tag, DollarSign, Barcode, Plus, X } from "lucide-react";

const NewProductComp = () => {
  const { handleCreateProduct, loading } = useProducts();
  const [barcodeInput, setBarcodeInput] = useState("");

  const formik = useFormik({
    initialValues: {
      productName: "",
      price: "",
      barcodes: [] as string[],
    },
    validationSchema: createNewProduct,
    onSubmit: async (values, { resetForm }) => {
      await handleCreateProduct({
        productName: values.productName.trim(),
        price: Number(values.price),
        barcodes: values.barcodes,
      });

      resetForm();
      setBarcodeInput("");
    },
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    formik;

  const removeBarcode = (codeToRemove: string) => {
    setFieldValue(
      "barcodes",
      values.barcodes.filter((code: string) => code !== codeToRemove),
    );
  };

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

  return (
    <>
      <h3 className="text-lg font-semibold mt-8">
        ¿El producto que estás buscando no se encuentra en la lista? Crealo
        aquí:
      </h3>
      <hr className="my-4 border-border" />
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="productNameId">Nombre del producto</Label>
            <div className="relative mt-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Tag className="h-4 w-4" />
              </div>
              <Input
                id="productNameId"
                value={values.productName}
                placeholder="Ej: Kit de distribución GM"
                type="text"
                name="productName"
                onChange={handleChange}
                error={touched.productName && !!errors.productName}
                className="pl-10"
              />
            </div>
            {errors.productName && touched.productName && (
              <span className="text-sm text-destructive">
                {errors.productName}
              </span>
            )}
          </div>

          <div>
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
                onValueChange={({ value }) => setFieldValue("price", value)}
                className={`flex h-10 w-full rounded-lg border bg-background pl-10 pr-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  touched.price && errors.price
                    ? "border-destructive"
                    : "border-input"
                }`}
              />
            </div>
            {errors.price && touched.price && (
              <span className="text-sm text-destructive">{errors.price}</span>
            )}
          </div>
        </div>
        <div className="mb-4">
          <Label htmlFor="barcodeId">Códigos de barras (opcional)</Label>
          <div className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Barcode className="h-4 w-4" />
              </div>
              <Input
                id="barcodeId"
                type="text"
                placeholder="Escanea el código con la pistola o ingresalo manualmente"
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                onKeyDown={handleBarcodeKeyDown}
                autoComplete="off"
                className="pl-10"
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={addCurrentBarcode}
            >
              Agregar
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            La pistola agrega los códigos automáticamente. En caso de cargarlos con el teclado, recordá darle al botón de "Agregar", caso contrario el código no se guardará.
          </p>

          {values.barcodes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {values.barcodes.map((code) => (
                <Badge
                  key={code}
                  variant="default"
                  className="flex items-center gap-1 px-3 py-1.5"
                >
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
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" variant="dark" />
                <span>Cargando...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Crear producto</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
};

export default NewProductComp;
