import { useFormik } from "formik";
import { SELLERS, SELLERS_MAP } from "../constants/const";
import { useEffect, useRef, useState } from "react";
import useProducts from "../hooks/useProducts";
import {
  getProductSalesSchema,
  type IGetProductSales,
} from "../utils/validationSchemas";
import { toast } from "sonner";
import useSales from "../hooks/useSales";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select } from "./ui/Select";
import { Spinner } from "./ui/Spinner";
import { Dropdown } from "./ui/Dropdown";
import { Search, Barcode } from "lucide-react";

interface ProductFormValues {
  fromDate: string;
  toDate: string;
  sellerId: number;
}

const ProductsLogs = () => {
  const { handleSearchProducts, loadingProducts } = useProducts();
  const { handleGetProductSales, loading } = useSales();

  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState<ProductInDb | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ProductInDb[]>([]);
  const [result, setResult] = useState("");
  const isSelectingProduct = useRef(false);

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      fromDate: "",
      toDate: "",
      sellerId: 0,
    },
    validationSchema: getProductSalesSchema,
    onSubmit: (values) => handleSearch(values),
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } = formik;

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

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setProduct(null);
  };

  const handleSelect = (selectedProduct: ProductInDb) => {
    isSelectingProduct.current = true;
    setProduct({ ...selectedProduct });
    setSearchTerm(selectedProduct.productName);
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
      } else if (products.length === 1 && isNaN(Number(code))) {
        handleSelect(products[0]);
      } else {
        toast.warning("Producto no encontrado. Seleccione manualmente.");
      }
    }
  };

  const handleSearch = async (values: IGetProductSales) => {
    if (product === null) {
      toast.error("Debes seleccionar un producto");
      return;
    }

    const res = await handleGetProductSales(values, product.productId);
    if (res !== undefined) {
      setResult(
        values.sellerId !== 0
          ? `El vendedor ${SELLERS_MAP[values.sellerId]} ha vendido ${res} unidades de ${product.productName}`
          : `Se han vendido ${res} unidades de ${product.productName} entre todos los vendedores`
      );
      return;
    }
    setResult("");
  };

  return (
    <>
      <form noValidate onSubmit={handleSubmit}>
        <div className="mb-4 relative">
          <Label htmlFor="productSearchId">Buscar producto *</Label>
          <div className="relative mt-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Barcode className="h-4 w-4" />
            </div>
            <Input
              id="productSearchId"
              type="text"
              placeholder="Escriba el nombre o escanee el código de barras (min. 3 caracteres)..."
              value={searchTerm}
              autoComplete="off"
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
            show={filteredProducts.length > 0 && !loadingProducts && !product} 
            className="mt-1 z-50"
          >
            {filteredProducts.map((prod) => (
              <Dropdown.Item
                key={prod.productId}
                onClick={() => handleSelect(prod)}
              >
                {prod.productName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="saleFromDateId">Desde *</Label>
            <Input
              id="saleFromDateId"
              type="date"
              name="fromDate"
              value={values.fromDate}
              onChange={handleChange}
              error={touched.fromDate && !!errors.fromDate}
              className="mt-1"
            />
            {errors.fromDate && touched.fromDate && (
              <span className="text-sm text-destructive">{errors.fromDate}</span>
            )}
          </div>
          
          <div>
            <Label htmlFor="saleToDateId">Hasta *</Label>
            <Input
              id="saleToDateId"
              type="date"
              name="toDate"
              value={values.toDate}
              onChange={handleChange}
              error={touched.toDate && !!errors.toDate}
              className="mt-1"
            />
            {errors.toDate && touched.toDate && (
              <span className="text-sm text-destructive">{errors.toDate}</span>
            )}
          </div>
          
          <div>
            <Label htmlFor="saleSellerId">Vendedor</Label>
            <Select
              id="saleSellerId"
              name="sellerId"
              value={values.sellerId}
              onChange={(ev) => setFieldValue("sellerId", Number(ev.target.value))}
              className="mt-1"
            >
              <option value={0}>Vendedor no seleccionado</option>
              {SELLERS.map(({ label, value }) => (
                <option value={value} key={value}>{label}</option>
              ))}
            </Select>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" variant="dark" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" variant="light" />
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Buscar ventas</span>
              </>
            )}
          </Button>
        </div>
      </form>
      
      {result && (
        <>
          <hr className="border-border my-4" />
          <h4 className="text-center text-lg font-medium mt-4">{result}</h4>
        </>
      )}
    </>
  );
};

export default ProductsLogs;
