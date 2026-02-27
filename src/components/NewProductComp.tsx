import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Form,
  Row,
  Col,
  InputGroup,
  Button,
  Spinner,
  Badge,
} from "react-bootstrap";
import {
  Tag,
  CurrencyDollar,
  BagPlusFill,
  UpcScan,
  X,
} from "react-bootstrap-icons";
import { NumericFormat } from "react-number-format";
import { createNewProduct } from "../utils/validationSchemas";
import useProducts from "../hooks/useProducts";
import BootstrapInputAdapter from "../utils/numericFormatHelper";

const NewProductComp = () => {
  const { handleCreateProduct, loading } = useProducts();
  const [barcodeInput, setBarcodeInput] = useState("");

  const formik = useFormik({
    initialValues: {
      productName: "",
      price: "",
      barcodes: [] as string[],
    },
    validationSchema: createNewProduct,
    onSubmit: async (values, { resetForm }) => {
      await handleCreateProduct({
        productName: values.productName.trim(),
        price: Number(values.price),
        barcodes: values.barcodes,
      });

      resetForm();
      setBarcodeInput("");
    },
  });

  const { values, errors, touched, handleChange, handleSubmit, setFieldValue } =
    formik;

  const removeBarcode = (codeToRemove: string) => {
    setFieldValue(
      "barcodes",
      values.barcodes.filter((code: string) => code !== codeToRemove),
    );
  };

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

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Form.Group
          as={Col}
          md="6"
          controlId="productNameId"
          className="mb-3 mb-md-0"
        >
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
        <Form.Group as={Col} md="6" controlId="priceId">
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
              className={`form-control ${touched.price && errors.price ? "is-invalid" : ""}`}
              customInput={BootstrapInputAdapter}
            />
            <Form.Control.Feedback type="invalid">
              {errors.price && touched.price ? errors.price : ""}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Group>
      </Row>
      <Row className="mb-4">
        <Form.Group as={Col} md="12" controlId="barcodeId">
          <Form.Label>Códigos de barras (opcional)</Form.Label>
          <InputGroup>
            <InputGroup.Text>
              <UpcScan />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Escanea el código con la pistola o ingresa el código manualmente"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              onKeyDown={handleBarcodeKeyDown}
              autoComplete="off"
            />
            <Button
              variant="secondary"
              onClick={addCurrentBarcode} 
            >
              Agregar
            </Button>
          </InputGroup>
          <Form.Text className="text-muted">
            La pistola agrega los códigos automáticamente. Podés escanear cajas
            diferentes del mismo repuesto.
          </Form.Text>

          {values.barcodes.length > 0 && (
            <div className="mt-2 d-flex flex-wrap gap-2">
              {values.barcodes.map((code) => (
                <Badge
                  key={code}
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
      </Row>

      <div className="d-flex justify-content-end">
        <Button
          type="submit"
          variant="dark"
          className="d-flex align-items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" variant="light" />
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
  );
};

export default NewProductComp;
