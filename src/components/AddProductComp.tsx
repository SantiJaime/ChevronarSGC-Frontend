import { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { addProductSchema, IAddProduct } from "../utils/validationSchemas";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import useProducts from "../hooks/useProducts";
import useInvoiceProducts from "../hooks/useInvoiceProducts";
import { formatPrice } from "../utils/utils";
import Swal from "sweetalert2";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Spinner } from "./ui/Spinner";
import { Badge } from "./ui/Badge";
import { Dropdown } from "./ui/Dropdown";
import { Tag, DollarSign, ShoppingCart, Barcode, X } from "lucide-react";

interface Props {
  setEditProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
}

const AddProductComp: React.FC<Props> = ({ setEditProducts }) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState<ProductInDb | null>(null);
  const [unlinkedBarcode, setUnlinkedBarcode] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ProductInDb[]>([]);
  const isSelectingProduct = useRef(false);

  const { handleSearchProducts, loadingProducts, handleAddBarcode } =
    useProducts();
  const { setProducts } = useInvoiceProducts();

  const handleClose = () => {
    setShow(false);
    setSearchTerm("");
    setProduct(null);
    resetForm();
  };
  const handleShow = () => setShow(true);

  const formik = useFormik({
    initialValues: {
      quantity: 1,
      price: product?.price ?? 0,
    },
    validationSchema: addProductSchema,
    onSubmit: (values) => {
      addProduct(values);
    },
  });

  const {
    values,
    handleChange,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
    resetForm,
  } = formik;

  useEffect(() => {
    if (product) {
      setFieldValue("price", product.price);
    }
  }, [product, setFieldValue]);

  useEffect(() => {
    if (isSelectingProduct.current) {
      isSelectingProduct.current = false;
      return;
    }
    const term = searchTerm.trim();

    if (!term || term.length < 3) {
      setFilteredProducts([]);
      return;
    }

    const handler = setTimeout(async () => {
      const products = await handleSearchProducts(term);
      setFilteredProducts(products);

      if (products.length === 0) {
        toast.info("No se encontraron productos para la busqueda ingresada");
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, handleSearchProducts]);

  const addProduct = (values: IAddProduct) => {
    if (product === null) {
      toast.error("Debes seleccionar un producto en el buscador");
      return;
    }

    const finalProduct = {
      ...product,
      quantity: values.quantity,
      price: values.price,
      productSubtotal: values.quantity * values.price,
    };

    if (setEditProducts) {
      setEditProducts((prevProducts) => [...prevProducts, finalProduct]);
    } else {
      setProducts((prevProducts) => [...prevProducts, finalProduct]);
    }
    setProduct(null);
    setSearchTerm("");
    resetForm();
    handleClose();
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setProduct(null);
  };

  const handleSelect = async (selectedProduct: ProductInDb) => {
    if (unlinkedBarcode) {
      Swal.fire({
        title: `¿Deseas vincular el código de barras ${unlinkedBarcode} al producto "${selectedProduct.productName}"?`,
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#05b000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, vincular",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await handleAddBarcode(selectedProduct._id, unlinkedBarcode);
          setUnlinkedBarcode(null);
        }
      });
    }
    isSelectingProduct.current = true;
    setProduct({ ...selectedProduct });
    setSearchTerm(
      `${selectedProduct.productName} - $${formatPrice(selectedProduct.price)}`,
    );
    setFilteredProducts([]);
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const code = searchTerm.trim();
      if (!code) return;

      const products = await handleSearchProducts(code);
      setFilteredProducts(products);
      const foundByBarcode = products.find((p) => p.barcodes?.includes(code));

      if (foundByBarcode) {
        handleSelect(foundByBarcode);
      } else if (filteredProducts.length === 1 && isNaN(Number(code))) {
        handleSelect(products[0]);
      } else {
        setUnlinkedBarcode(code);
        toast.info(
          `Código ${code} detectado. Busque el producto manualmente para vincularlo.`,
        );
        setSearchTerm("");
      }
    }
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Agregar producto
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agregar un producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col">
            <div className="mb-4 relative">
              <Label htmlFor="productSearchId">
                Buscar producto o escanear código
              </Label>
              <div className="relative mt-1">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                </div>
                <Input
                  id="productSearchId"
                  type="text"
                  placeholder="Escriba el nombre del producto (al menos 3 caracteres) o escanee el código de barras..."
                  value={searchTerm}
                  autoComplete="off"
                  autoFocus
                  onChange={(ev) => handleInputChange(ev.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-10"
                />
              </div>
              {loadingProducts && (
                <div className="mt-2 flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm">Buscando productos...</span>
                </div>
              )}

              <Dropdown.Menu
                show={
                  filteredProducts.length > 0 && !loadingProducts && !product
                }
                className="mt-1"
              >
                {filteredProducts.map((prod) => (
                  <Dropdown.Item
                    key={prod.productId}
                    onClick={() => handleSelect(prod)}
                  >
                    {prod.productName} - ${formatPrice(prod.price)}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </div>

            {product && (
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        void handleSubmit();
                      }
                    }}
                    onValueChange={({ value }) => {
                      const numberValue = Number(value);
                      if (
                        (product.productId === 11438 ||
                          product.productId === 11439) &&
                        numberValue > 0
                      ) {
                        setFieldValue("price", numberValue * -1);
                        return;
                      }
                      setFieldValue("price", numberValue);
                    }}
                    className={`flex h-10 w-full rounded-lg border bg-background pl-10 pr-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      touched.price && errors.price
                        ? "border-destructive"
                        : "border-input"
                    }`}
                  />
                </div>
                {errors.price && touched.price && (
                  <span className="text-sm text-destructive">
                    {errors.price}
                  </span>
                )}
              </div>
            )}

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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleSubmit();
                    }
                  }}
                  error={touched.quantity && !!errors.quantity}
                  className="pl-10"
                />
              </div>
              {errors.quantity && touched.quantity && (
                <span className="text-sm text-destructive">
                  {errors.quantity}
                </span>
              )}
            </div>

            <div className="flex justify-end items-center gap-2">
              {unlinkedBarcode && (
                <Badge
                  variant="warning"
                  className="flex items-center gap-2 px-3 py-2"
                >
                  <Barcode className="h-4 w-4" />
                  <span>
                    Código a vincular: <strong>{unlinkedBarcode}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => setUnlinkedBarcode(null)}
                    className="ml-1 hover:text-destructive transition-colors"
                    title="Cancelar vinculacion"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </Badge>
              )}
              <Button
                variant="dark"
                type="button"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Agregar producto
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddProductComp;
