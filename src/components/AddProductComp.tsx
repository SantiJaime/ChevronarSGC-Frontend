import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import {
  Badge,
  Col,
  Dropdown,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import {
  ArrowClockwise,
  Cart2,
  CurrencyDollar,
  Tag,
  UpcScan,
  X,
} from "react-bootstrap-icons";
import { addProductSchema, IAddProduct } from "../utils/validationSchemas";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import BootstrapInputAdapter from "../utils/numericFormatHelper";
import useProducts from "../hooks/useProducts";
import useInvoiceProducts from "../hooks/useInvoiceProducts";
import { formatPrice } from "../utils/utils";
import Swal from "sweetalert2";

interface Props {
  setEditProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
}

const AddProductComp: React.FC<Props> = ({ setEditProducts }) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [product, setProduct] = useState<ProductInDb | null>(null);
  const [unlinkedBarcode, setUnlinkedBarcode] = useState<string | null>(null);

  const {
    searchProducts,
    handleGetProducts,
    loadingProducts,
    productsInDb,
    handleAddBarcode,
  } = useProducts();
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

  const filteredProducts = useMemo(() => {
    return searchProducts(searchTerm);
  }, [searchTerm, searchProducts]);

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
    setIsDropdownOpen(true);
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
    setProduct({ ...selectedProduct });
    setSearchTerm(
      `${selectedProduct.productName} - $${formatPrice(selectedProduct.price)}`,
    );
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const code = searchTerm.trim();
      if (!code) return;

      const foundByBarcode = productsInDb.find((p) =>
        p.barcodes?.includes(code),
      );

      if (foundByBarcode) {
        handleSelect(foundByBarcode);
      } else if (filteredProducts.length === 1 && isNaN(Number(code))) {
        handleSelect(filteredProducts[0]);
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
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3 position-relative">
              <Form.Group as={Col} md="12" controlId="productSearchId">
                <Form.Label>Buscar producto o escanear código</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Tag />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Escriba el nombre o escanee el código de barras..."
                    value={searchTerm}
                    autoComplete="off"
                    autoFocus
                    onChange={(ev) => handleInputChange(ev.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </InputGroup>
              </Form.Group>

              {isDropdownOpen && filteredProducts.length > 0 && (
                <Dropdown.Menu show className="position-absolute w-100 top-100">
                  {filteredProducts.map((prod) => (
                    <Dropdown.Item
                      key={prod.productId}
                      onClick={() => handleSelect(prod)}
                    >
                      {prod.productName} - ${formatPrice(prod.price)}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              )}
            </Row>

            {product && (
              <Form.Group className="mb-3" controlId="priceId">
                <Form.Label>Precio unitario</Form.Label>

                <InputGroup>
                  <InputGroup.Text>
                    <CurrencyDollar />
                  </InputGroup.Text>

                  <NumericFormat
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
                    className={`form-control ${
                      touched.price && errors.price ? "is-invalid" : ""
                    }`}
                    customInput={BootstrapInputAdapter}
                  />

                  <Form.Control.Feedback type="invalid">
                    {errors.price && touched.price && errors.price}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}

            <Form.Group className="mb-3" controlId="quantityId">
              <Form.Label>Cantidad</Form.Label>

              <InputGroup>
                <InputGroup.Text>
                  <Cart2 />
                </InputGroup.Text>

                <Form.Control
                  placeholder="Ej: 1"
                  type="number"
                  name="quantity"
                  value={values.quantity}
                  onChange={handleChange}
                  isInvalid={touched.quantity && !!errors.quantity}
                />

                <Form.Control.Feedback type="invalid">
                  {errors.quantity && touched.quantity && errors.quantity}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                variant="info"
                onClick={() => handleGetProducts(true)}
                className="d-flex align-items-center gap-2"
                disabled={loadingProducts}
              >
                {loadingProducts ? (
                  <>
                    <Spinner animation="border" variant="dark" size="sm" />
                    <span>Recargando...</span>
                  </>
                ) : (
                  <>
                    <ArrowClockwise />
                    <span>Recargar productos</span>
                  </>
                )}
              </Button>
              {unlinkedBarcode && (
                <Badge
                  bg="warning"
                  text="dark"
                  className="d-flex align-items-center p-2"
                  style={{ fontSize: "0.85rem", border: "1px solid #ffc107" }}
                >
                  <UpcScan className="me-2" />
                  <span>
                    Código a vincular: <strong>{unlinkedBarcode}</strong>
                  </span>
                  <X
                    style={{ cursor: "pointer", marginLeft: "8px" }}
                    size={20}
                    onClick={() => setUnlinkedBarcode(null)}
                    title="Cancelar vinculación"
                  />
                </Badge>
              )}
              <Button variant="dark" type="submit">
                Agregar producto
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddProductComp;
