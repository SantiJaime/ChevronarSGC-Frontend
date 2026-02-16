import { Formik } from "formik";
import { useState } from "react";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import {
  Cart2,
  CurrencyDollar,
  FloppyFill,
  PencilFill,
  Tag,
} from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { NumericFormat } from "react-number-format";
import BootstrapInputAdapter from "../utils/numericFormatHelper";
import useProducts from "../hooks/useProducts";
import { editProductSchema } from "../utils/validationSchemas";

interface Props {
  product: ProductInDb;
}

const EditProductInDbComp: React.FC<Props> = ({ product }) => {
  const { handleEditProduct, loading } = useProducts();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button
        variant="info"
        onClick={handleShow}
        className="d-flex align-items-center gap-2"
      >
        <PencilFill />
        <span>Editar</span>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Editar producto {product.productId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={editProductSchema}
            initialValues={{
              productName: product.productName,
              price: product.price,
              stock: product.stock,
            }}
            onSubmit={(values, { resetForm }) =>
              handleEditProduct(
                { ...product, ...values },
                resetForm,
                handleClose,
              )
            }
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="editProductNameId">
                  <Form.Label>Nombre</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <Tag />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      name="productName"
                      onChange={handleChange}
                      value={values.productName}
                      isInvalid={touched.productName && !!errors.productName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.productName && touched.productName
                        ? errors.productName
                        : ""}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="editProductPriceId">
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
                      {errors.price && touched.price ? errors.price : ""}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="editProductStockId">
                  <Form.Label>Stock</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <Cart2 />
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="stock"
                      onChange={handleChange}
                      value={values.stock}
                      isInvalid={touched.stock && !!errors.stock}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.stock && touched.stock
                        ? errors.stock
                        : ""}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
                <div className="d-flex justify-content-end">
                  <Button
                    className="d-flex align-items-center gap-2"
                    variant="dark"
                    type="submit"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" variant="light" size="sm" />
                        <span>Guardando...</span>
                      </>
                    ) : (
                      <>
                        <FloppyFill />
                        <span>Guardar cambios</span>
                      </>
                    )}
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

export default EditProductInDbComp;
