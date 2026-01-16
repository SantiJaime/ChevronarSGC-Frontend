import { Formik } from "formik";
import { Button, Col, Form, Row, Spinner, Table } from "react-bootstrap";
import { SELLERS } from "../constants/const";
import AddProductComp from "./AddProductComp";
import { CheckLg, Trash3Fill } from "react-bootstrap-icons";
import { formatPrice } from "../utils/utils";
import EditProductComp from "./EditProductComp";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { type NewSale, newSaleSchema } from "../utils/validationSchemas";
import { toast } from "sonner";
import useSales from "../hooks/useSales";

const NewSaleComp = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productsTotal, setProductsTotal] = useState(0);
  const { handleCreate, loading } = useSales();

  useEffect(() => {
    const total = products.reduce(
      (total, product) => total + product.productSubtotal,
      0
    );

    setProductsTotal(total);
  }, [products]);

  const handleSubmit = async (values: NewSale, resetForm: () => void) => {
    if (products.length === 0) {
      toast.error("El presupuesto para venta debe tener al menos un producto");
      return;
    }
    const res = await handleCreate({...values, products});
    if (res === undefined) return;

    open(res.result, "_blank");

    toast.success(res.msg, {
      description: (
        <div style={{ marginTop: "8px" }}>
          En caso de que el presupuesto no se abra, podés visualizarlo aquí:
          <br />
          <a
            href={res.result}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#3b82f6",
              textDecoration: "underline",
              fontWeight: "bold",
              marginTop: "4px",
              display: "inline-block",
            }}
          >
            Ver presupuesto de venta
          </a>
        </div>
      ),
      duration: 5000,
      closeButton: true,
    });
    resetForm();
    setProducts([]);
  };

  const handleDelete = (productName: string) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const newProducts = products.filter(
          (product) => product.productName !== productName
        );
        setProducts(newProducts);
      }
    });
  };
  return (
    <Formik
      validationSchema={newSaleSchema}
      onSubmit={(values, { resetForm }) => handleSubmit(values, resetForm)}
      initialValues={{
        clientName: "",
        sellerId: 0,
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
            <Form.Group as={Col} md="6" controlId="clientNameId">
              <Form.Label>Nombre del cliente o vehículo</Form.Label>
              <Form.Control
                value={values.clientName}
                placeholder="Ej: Juan Pérez"
                type="text"
                name="clientName"
                onChange={handleChange}
                isInvalid={touched.clientName && !!errors.clientName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.clientName && touched.clientName
                  ? errors.clientName
                  : ""}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="sellerId">
              <Form.Label>Vendedor</Form.Label>
              <Form.Select
                onChange={(ev) => {
                  setFieldValue("sellerId", Number(ev.target.value));
                }}
                value={values.sellerId}
                name="sellerId"
                isInvalid={touched.sellerId && !!errors.sellerId}
              >
                <option value={0}>Vendedor no seleccionado</option>
                {SELLERS.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.sellerId && touched.sellerId ? errors.sellerId : ""}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <hr />
          <div className="d-flex justify-content-between">
            <h4>Productos</h4>
            <AddProductComp setProducts={setProducts} />
          </div>
          {products.length === 0 ? (
            <p>No hay productos agregados</p>
          ) : (
            <>
              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={product.productName}>
                      <td>{product.productName}</td>
                      <td>${formatPrice(product.price)}</td>
                      <td>{product.quantity}</td>
                      <td>${formatPrice(product.price * product.quantity)}</td>
                      <td className="d-flex justify-content-center gap-2">
                        <EditProductComp
                          product={product}
                          setProducts={setProducts}
                          index={index}
                        />
                        <Button
                          className="d-flex align-items-center gap-1"
                          variant="danger"
                          onClick={() => handleDelete(product.productName)}
                        >
                          <Trash3Fill />
                          <span>Eliminar</span>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <div className="d-flex justify-content-end flex-column align-items-end">
                <h4>Total: ${formatPrice(productsTotal)}</h4>
              </div>
            </>
          )}
          <div className="d-flex justify-content-end mb-4">
            <Button
              type="submit"
              disabled={loading}
              className="d-flex justify-content-center align-items-center gap-1"
            >
              {loading ? (
                <div className="d-flex justify-content-center align-items-center gap-2">
                  <Spinner size="sm" />
                  <span>Cargando...</span>
                </div>
              ) : (
                <>
                  <CheckLg />
                  <span>Generar presupuesto para venta</span>
                </>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewSaleComp;
