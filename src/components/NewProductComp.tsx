import { Formik } from "formik";
import useProducts from "../hooks/useProducts";
import { Button, Col, Form, InputGroup, Row, Spinner } from "react-bootstrap";
import { BagPlusFill, CurrencyDollar, Tag } from "react-bootstrap-icons";
import { NumericFormat } from "react-number-format";
import BootstrapInputAdapter from "../utils/numericFormatHelper";
import { createNewProduct } from "../utils/validationSchemas";

const NewProductComp = () => {
  const { handleCreateProduct, loading } = useProducts();

  return (
    <Formik
      validationSchema={createNewProduct}
      onSubmit={(values, { resetForm }) =>
        handleCreateProduct(
          {
            productName: values.productName.trim(),
            price: Number(values.price),
          },
          resetForm,
        )
      }
      initialValues={{
        productName: "",
        price: "",
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
        <Form noValidate onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="productNameId">
              <Form.Label>Nombre del producto</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <Tag />
                </InputGroup.Text>
                <Form.Control
                  value={values.productName}
                  placeholder="Ej: Kit de distribución GM"
                  type="text"
                  name="productName"
                  onChange={handleChange}
                  isInvalid={touched.productName && !!errors.productName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.productName && touched.productName
                    ? errors.productName
                    : ""}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3" as={Col} md="6" controlId="priceId">
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
                  onValueChange={({ value }) => setFieldValue("price", value)}
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
          </Row>
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="dark"
              className="d-flex align-items-center gap-2"
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" color="light" />
                  <span>Cargando...</span>
                </>
              ) : (
                <>
                  <BagPlusFill />
                  <span>Crear producto</span>
                </>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewProductComp;
