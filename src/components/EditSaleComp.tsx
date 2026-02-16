import { Formik } from "formik";
import { useState } from "react";
import { Button, Form, InputGroup, Modal, Table } from "react-bootstrap";
import {
  FloppyFill,
  PencilFill,
  PersonCircle,
  PersonFillGear,
  Trash3Fill,
  XCircleFill,
} from "react-bootstrap-icons";
import { SELLERS } from "../constants/const";
import AddProductComp from "./AddProductComp";
import { formatPrice } from "../utils/utils";
import { newSaleSchema } from "../utils/validationSchemas";
import Swal from "sweetalert2";
import useSales from "../hooks/useSales";
import { toast } from "sonner";

interface FormValues {
  clientName: string;
  sellerId: number;
  products: Product[];
}

interface Props {
  sale: FullSale;
}

const EditSaleComp: React.FC<Props> = ({ sale }) => {
  const { handleEdit } = useSales();
  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmitForm = async (
    values: FormValues,
  ) => {
    if (values.products.length === 0) {
      toast.error("Debe existir al menos un producto en el presupuesto");
      return;
    }

    const newTotal = values.products.reduce(
      (acc: number, product: Product) => acc + product.productSubtotal,
      0
    );

    const editedSale: FullSale = {
      ...sale,
      ...values,
      total: newTotal,
    };

    await handleEdit(editedSale, newTotal);
    handleClose();
  };

  return (
    <>
      <Button
        variant="primary"
        className="d-flex justify-content-center align-items-center gap-1"
        onClick={handleShow}
      >
        <PencilFill />
        <span>Editar</span>
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Editar presupuesto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik<FormValues>
            validationSchema={newSaleSchema}
            initialValues={{
              clientName: sale.clientName,
              sellerId: sale.sellerId,
              products: sale.products,
            }}
            onSubmit={handleSubmitForm}
            enableReinitialize={true}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => {
              const handleProductsUpdate = (
                action: React.SetStateAction<Product[]>
              ) => {
                let newProducts: Product[];

                if (typeof action === "function") {
                  newProducts = action(values.products);
                } else {
                  newProducts = action;
                }
                
                setFieldValue("products", newProducts);
              };

              const handleDeleteProduct = (productId: number) => {
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
                    const filtered = values.products.filter(
                      (p) => p.productId !== productId
                    );
                    setFieldValue("products", filtered);
                  }
                });
              };

              return (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="editSaleClientNameId">
                    <Form.Label>Nombre del cliente o vehículo</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <PersonCircle />
                      </InputGroup.Text>
                      <Form.Control
                        placeholder="Ej: Juan Pérez | Corsa 1.6"
                        type="text"
                        name="clientName"
                        value={values.clientName}
                        onChange={handleChange}
                        isInvalid={touched.clientName && !!errors.clientName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.clientName &&
                          touched.clientName &&
                          errors.clientName}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="editSaleSellerId">
                    <Form.Label>Vendedor</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <PersonFillGear />
                      </InputGroup.Text>
                      <Form.Select
                        onChange={(ev) => {
                          setFieldValue("sellerId", Number(ev.target.value));
                        }}
                        value={values.sellerId}
                        name="sellerId"
                        isInvalid={touched.sellerId && !!errors.sellerId}
                      >
                        {SELLERS.map((seller) => (
                          <option key={seller.value} value={seller.value}>
                            {seller.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.sellerId && touched.sellerId && errors.sellerId}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                  <hr />
                  <div className="d-flex justify-content-end">
                    <AddProductComp setEditProducts={handleProductsUpdate} />
                  </div>
                  {values.products.length === 0 ? (
                    <h5 className="text-center">No se agregaron productos</h5>
                  ) : (
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
                        {values.products.map((product) => (
                          <tr key={product.productId}>
                            <td>{product.productName}</td>
                            <td>${formatPrice(product.price)}</td>
                            <td>{product.quantity}</td>
                            <td>
                              ${formatPrice(product.price * product.quantity)}
                            </td>
                            <td className="d-flex justify-content-center gap-2">
                              <Button
                                className="d-flex align-items-center gap-1"
                                variant="danger"
                                onClick={() =>
                                  handleDeleteProduct(product.productId)
                                }
                              >
                                <Trash3Fill />
                                <span>Eliminar</span>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}

                  <hr />
                  <div className="d-flex justify-content-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleClose}
                      className="d-flex align-items-center gap-2"
                    >
                      <XCircleFill />
                      <span>Cancelar</span>
                    </Button>
                    <Button
                      variant="dark"
                      type="submit"
                      className="d-flex align-items-center gap-2"
                    >
                      <FloppyFill />
                      <span>Guardar cambios</span>
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EditSaleComp;