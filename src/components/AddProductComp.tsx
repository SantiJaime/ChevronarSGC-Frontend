import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useFormik } from "formik";
import Form from "react-bootstrap/Form";
import { Col, Dropdown, InputGroup, Row } from "react-bootstrap";
import { Cart2, CurrencyDollar, Tag } from "react-bootstrap-icons";
import { addProductSchema, IAddProduct } from "../utils/validationSchemas";
import { normalizeText } from "../constants/const";
import { toast } from "sonner";
import { NumericFormat } from "react-number-format";
import BootstrapInputAdapter from "../utils/numericFormatHelper";
import useProducts from "../hooks/useProducts";
import useInvoiceProducts from "../hooks/useInvoiceProducts";
import { formatPrice } from '../utils/utils';

interface Props {
  setEditProducts?: React.Dispatch<React.SetStateAction<Product[]>>;
}

const AddProductComp: React.FC<Props> = ({ setEditProducts }) => {
  const [show, setShow] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [product, setProduct] = useState<ProductInDb | null>(null);
  const { productsInDb } = useProducts();
  const { setProducts } = useInvoiceProducts();

  const handleClose = () => setShow(false);
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
    if (searchTerm.trim().length < 3) return [];
    const normalizedSearch = normalizeText(searchTerm.trim());

    return productsInDb.filter((product) => {
      const normalizedName = normalizeText(product.productName);

      return normalizedName.includes(normalizedSearch);
    });
  }, [searchTerm, productsInDb]);

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

  const handleSelect = (selectedProduct: ProductInDb) => {
    setProduct({ ...selectedProduct });
    setSearchTerm(`${selectedProduct.productName} - $${formatPrice(selectedProduct.price)}`);
    setIsDropdownOpen(false);
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
                <Form.Label>Buscar producto</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Tag />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Escriba el nombre del producto (al menos 3 caracteres)"
                    value={searchTerm}
                    autoComplete="off"
                    onChange={(ev) => handleInputChange(ev.target.value)}
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
            <div className="d-flex justify-content-end">
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
