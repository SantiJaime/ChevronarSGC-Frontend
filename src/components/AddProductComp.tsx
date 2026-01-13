import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import { InputGroup } from "react-bootstrap";
import { Cart2, CurrencyDollar, Tag } from "react-bootstrap-icons";
import { addProductSchema } from "../utils/validationSchemas";
import { NumericFormat } from "react-number-format";
import BootstrapInputAdapter from "../utils/numericFormatHelper";

interface Props {
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const AddProductComp: React.FC<Props> = ({ setProducts }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addProduct = (product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
    handleClose();
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Agregar producto
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Agregar un producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={addProductSchema}
            initialValues={{
              productName: "",
              price: "",
              quantity: "",
            }}
            onSubmit={(values) => {
              const submitValues = {
                ...values,
                quantity: Number(values.quantity),
                price: Number(values.price),
                productSubtotal: Number(values.quantity) * Number(values.price),
              };
              addProduct(submitValues);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
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
                    Agregar producto
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

export default AddProductComp;
