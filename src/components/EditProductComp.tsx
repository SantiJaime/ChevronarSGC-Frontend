import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";
import { Cart2, CurrencyDollar, PencilFill, Tag } from "react-bootstrap-icons";
import { addProductSchema } from "../utils/validationSchemas";
import { NumericFormat } from 'react-number-format';
import BootstrapInputAdapter from '../utils/numericFormatHelper';

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
      <Button
        variant="info"
        onClick={handleShow}
        className="d-flex align-items-center gap-1"
      >
        <PencilFill />
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
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="productNameId">
                  <Form.Label>Nombre</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <Tag />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Ej: Kit de distribución"
                      type="text"
                      name="productName"
                      value={values.productName}
                      onChange={handleChange}
                      isInvalid={touched.productName && !!errors.productName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.productName &&
                        touched.productName &&
                        errors.productName}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
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
                        setFieldValue("price", value)
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
                    Guardar cambios
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProductComp;
