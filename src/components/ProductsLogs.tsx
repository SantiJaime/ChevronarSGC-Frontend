import { useFormik } from "formik";
import { Button, Col, Dropdown, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { SELLERS, SELLERS_MAP } from "../constants/const";
import { Search, UpcScan } from "react-bootstrap-icons";
import { useEffect, useRef, useState } from "react";
import useProducts from "../hooks/useProducts";
import {
  getProductSalesSchema,
  type IGetProductSales,
} from "../utils/validationSchemas";
import { toast } from "sonner";
import useSales from "../hooks/useSales";

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
        toast.info("No se encontraron productos para la búsqueda ingresada");
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
      <Form noValidate onSubmit={handleSubmit}>
        <Row className="position-relative mb-3">
          <Form.Group as={Col} md="12" controlId="productSearchId">
            <Form.Label>Buscar producto *</Form.Label>
            <InputGroup>
              <InputGroup.Text><UpcScan /></InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Escriba el nombre o escanee el código de barras (mín. 3 caracteres)..."
                value={searchTerm}
                autoComplete="off"
                onChange={(ev) => handleInputChange(ev.target.value)}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
            {loadingProducts && (
              <div className="mt-2 d-flex align-items-center gap-2">
                <Spinner animation="border" size="sm" />
                <span>Buscando productos...</span>
              </div>
            )}
          </Form.Group>

          {filteredProducts.length > 0 && !loadingProducts && !product && (
            <Dropdown.Menu show className="position-absolute w-100 top-100" style={{ zIndex: 1050 }}>
              {filteredProducts.map((prod) => (
                <Dropdown.Item
                  key={prod.productId}
                  onClick={() => handleSelect(prod)}
                >
                  {prod.productName}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          )}
        </Row>
        <Row>
          <Form.Group as={Col} md={4} controlId="saleFromDateId">
            <Form.Label>Desde *</Form.Label>
            <Form.Control
              type="date"
              name="fromDate"
              value={values.fromDate}
              onChange={handleChange}
              isInvalid={touched.fromDate && !!errors.fromDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fromDate && touched.fromDate ? errors.fromDate : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={4} controlId="saleToDateId">
            <Form.Label>Hasta *</Form.Label>
            <Form.Control
              type="date"
              name="toDate"
              value={values.toDate}
              onChange={handleChange}
              isInvalid={touched.toDate && !!errors.toDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.toDate && touched.toDate ? errors.toDate : ""}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md={4} controlId="saleSellerId">
            <Form.Label>Vendedor</Form.Label>
            <Form.Select
              name="sellerId"
              value={values.sellerId}
              onChange={(ev) => setFieldValue("sellerId", Number(ev.target.value))}
              isInvalid={touched.sellerId && !!errors.sellerId}
            >
              <option value={0}>Vendedor no seleccionado</option>
              {SELLERS.map(({ label, value }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.sellerId && touched.sellerId ? errors.sellerId : ""}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <div className="d-flex justify-content-end mt-3">
          <Button
            type="submit"
            variant="dark"
            className="d-flex align-items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" variant="light" size="sm" />
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <Search />
                <span>Buscar ventas</span>
              </>
            )}
          </Button>
        </div>
      </Form>
      {result && (
        <>
          <hr />
          <h4 className="text-center mt-4">{result}</h4>
        </>
      )}
    </>
  );
};

export default ProductsLogs;