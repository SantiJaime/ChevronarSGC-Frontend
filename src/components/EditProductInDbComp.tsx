import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  PencilFill,
  Tag,
  CurrencyDollar,
  Cart2,
  FloppyFill,
  UpcScan,
  X,
} from "react-bootstrap-icons";
import { NumericFormat } from "react-number-format";
import BootstrapInputAdapter from "../utils/numericFormatHelper";
import { editProductSchema } from "../utils/validationSchemas";
import useProducts from "../hooks/useProducts";

interface Props {
  product: ProductInDb;
}

const EditProductInDbComp: React.FC<Props> = ({ product }) => {
  const { handleEditProduct, loading } = useProducts();
  const [show, setShow] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");

  const handleClose = () => {
    setShow(false);
    setBarcodeInput("");
    resetForm();
  };
  const handleShow = () => setShow(true);

  const formik = useFormik({
    initialValues: {
      productName: product.productName,
      price: product.price,
      stock: product.stock,
      barcodes: product.barcodes || [],
    },
    validationSchema: editProductSchema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      handleEditProduct({ ...product, ...values }, resetForm, handleClose);
    },
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    resetForm,
  } = formik;

  const addCurrentBarcode = () => {
    const newCode = barcodeInput.trim();
    if (newCode && !values.barcodes.includes(newCode)) {
      setFieldValue("barcodes", [...values.barcodes, newCode]);
      setBarcodeInput("");
    }
  };

  const handleBarcodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCurrentBarcode();
    }
  };

  const removeBarcode = (codeToRemove: string) => {
    setFieldValue(
      "barcodes",
      values.barcodes.filter((code: string) => code !== codeToRemove),
    );
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
          <Modal.Title>Editar producto {product.productId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
                    ? (errors.productName as string)
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
                  className={`form-control ${touched.price && errors.price ? "is-invalid" : ""}`}
                  customInput={BootstrapInputAdapter}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.price && touched.price
                    ? (errors.price as string)
                    : ""}
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
                    ? (errors.stock as string)
                    : ""}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-4" controlId="editBarcodeId">
              <Form.Label>Códigos de barras</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <UpcScan />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Escanea para agregar o presiona Enter..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyDown={handleBarcodeKeyDown}
                  autoComplete="off"
                  autoFocus
                />
                <Button variant="secondary" onClick={addCurrentBarcode}>
                  Agregar
                </Button>
              </InputGroup>
              {values.barcodes.length > 0 && (
                <div className="mt-2 d-flex flex-wrap gap-2">
                  {values.barcodes.map((code: string, index: number) => (
                    <Badge
                      key={index}
                      bg="dark"
                      className="d-flex align-items-center p-2"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {code}
                      <X
                        style={{ cursor: "pointer", marginLeft: "5px" }}
                        size={18}
                        onClick={() => removeBarcode(code)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                className="d-flex align-items-center gap-2"
                variant="dark"
                type="submit"
                disabled={loading}
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
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditProductInDbComp;
