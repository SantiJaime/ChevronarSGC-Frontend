import { useFormik } from "formik";
import { SELLERS, SELLERS_MAP } from "../../constants/const";
import { useEffect, useRef, useState } from "react";
import useProducts from "../../hooks/useProducts";
import useBarcodeScanner from "../../hooks/useBarcodeScanner";
import {
  getProductSalesSchema,
  type IGetProductSales,
} from "../../utils/validationSchemas";
import { toast } from "sonner";
import useSales from "../../hooks/useSales";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";
import { Spinner } from "../ui/Spinner";
import { Dropdown } from "../ui/Dropdown";
import { Search, Barcode } from "lucide-react";

const NAME_SEARCH_DEBOUNCE_MS = 500;

interface ProductFormValues {
  fromDate: string;
  toDate: string;
  sellerId: number;
}

const ProductsLogs = () => {
  const { handleSearchProducts, handleFindByBarcode, loadingProducts } = useProducts();
  const { handleGetProductSales, loading } = useSales();

  const [searchTerm, setSearchTerm] = useState("");
  const [product, setProduct] = useState<ProductInDb | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<ProductInDb[]>([]);
  const [result, setResult] = useState("");
  const isSelectingProduct = useRef(false);
  // Identifica la última búsqueda: las respuestas de búsquedas anteriores se descartan
  const searchIdRef = useRef(0);
  const nameSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scanInFlightRef = useRef(false);

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

    const timer = setTimeout(async () => {
      const searchId = ++searchIdRef.current;
      const products = await handleSearchProducts(term);
      // Si mientras tanto hubo otra búsqueda (otro texto o un escaneo), se descarta
      if (searchId !== searchIdRef.current) return;

      setFilteredProducts(products);
      if (products.length === 0) {
        toast.info("No se encontraron productos para la busqueda ingresada");
      }
    }, NAME_SEARCH_DEBOUNCE_MS);
    nameSearchTimerRef.current = timer;

    return () => clearTimeout(timer);
  }, [searchTerm, handleSearchProducts]);

  // Cambia el texto del buscador sin disparar la búsqueda por nombre
  const setSearchTermSilently = (value: string) => {
    if (value === searchTerm) return;
    isSelectingProduct.current = true;
    setSearchTerm(value);
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    setProduct(null);
  };

  const handleSelect = (selectedProduct: ProductInDb) => {
    setProduct({ ...selectedProduct });
    setSearchTermSilently(selectedProduct.productName);
    setFilteredProducts([]);
  };

  const handleBarcodeScan = async (code: string) => {
    // Algunos lectores envían dos "Enter" seguidos: se ignora el segundo
    if (scanInFlightRef.current) return;

    // El escaneo reemplaza a cualquier búsqueda por nombre pendiente o en curso
    if (nameSearchTimerRef.current) clearTimeout(nameSearchTimerRef.current);
    const searchId = ++searchIdRef.current;

    scanInFlightRef.current = true;
    try {
      const matches = await handleFindByBarcode(code);
      if (matches === null || searchId !== searchIdRef.current) return;

      if (matches.length === 1) {
        handleSelect(matches[0]);
        return;
      }

      if (matches.length > 1) {
        setProduct(null);
        setSearchTermSilently(code);
        setFilteredProducts(matches);
        toast.info(
          `Hay ${matches.length} productos con el código ${code}. Elegí el correcto de la lista`,
        );
        return;
      }

      // Código desconocido: nunca se elige un producto "parecido"
      setProduct(null);
      setFilteredProducts([]);
      setSearchTermSilently("");
      toast.warning(`No hay ningún producto con el código ${code}. Buscalo por nombre.`);
    } finally {
      scanInFlightRef.current = false;
    }
  };

  const handleKeyDown = useBarcodeScanner({
    onScan: (code) => void handleBarcodeScan(code),
    // Enter escrito a mano: elige el primer resultado de la lista visible
    onManualEnter: () => {
      if (!product && !loadingProducts && filteredProducts.length > 0) {
        handleSelect(filteredProducts[0]);
      }
    },
  });

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
          <Button type="submit" variant="default" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" variant="dark" />
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
