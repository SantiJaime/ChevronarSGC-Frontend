import { useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { FileText } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { formatDateISO } from "../utils/utils";

interface Props {
  invoice: FullInvoice;
}

const InvoiceDetails: React.FC<Props> = ({ invoice }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      <Button className="d-flex align-items-center gap-1" onClick={handleShow}>
        <FileText />
        <span>Ver detalles</span>
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Factura Nº {invoice.invoiceNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-3 p-3 border rounded">
            <h5 className="mb-2">Detalles de la factura</h5>
            <hr />
            {[
              {
                label: "Número de comprobante",
                value: invoice.invoiceNumber,
                id: 1,
              },
              { label: "Tipo de factura", value: invoice.invoiceType, id: 2 },
              { label: "Fecha", value: formatDateISO(invoice.date), id: 3 },
              { label: "CAE", value: invoice.cae, id: 4 },
              {
                label: "Fecha de vencimiento",
                value: invoice.caeExpiringDate,
                id: 5,
              },
              { label: "Punto de venta", value: invoice.salePoint, id: 6 },
              {
                label: "¿Anulada?",
                value:
                  invoice.cancelled && !invoice.assocInvoiceNumber
                    ? "Sí"
                    : "No",
              },
            ].map((item) => (
              <Col sm={6} key={item.id}>
                <p>
                  <strong>{item.label}:</strong> {item.value}
                </p>
              </Col>
            ))}
          </Row>
          <Row className="mb-3 p-3 border rounded">
            <h5 className="mb-2">Detalles del cliente</h5>
            <hr />
            {[
              { label: "Nombre completo", value: invoice.client.name, id: 1 },
              {
                label: "Documento",
                value: `${invoice.client.documentType} - ${invoice.client.document}`,
                id: 2,
              },
              { label: "Dirección", value: invoice.client.address, id: 3 },
              { label: "Localidad", value: invoice.client.city, id: 4 },
              {
                label: "Condición frente al IVA",
                value: invoice.client.ivaCond,
                id: 5,
              },
            ].map((item, index) => (
              <Col sm={6} key={index}>
                <p>
                  <strong>{item.label}:</strong> {item.value}
                </p>
              </Col>
            ))}
          </Row>
          <Row className="mb-3 p-3 border rounded">
            <h5 className="mb-2">Detalles de los productos</h5>
            <hr />
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.products.map((product) => (
                  <tr key={product.productId}>
                    <td>{product.productName}</td>
                    <td>{product.quantity}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>${(product.price * product.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>

          <Row className="mt-3 p-3 border rounded">
            <h5 className="mb-2">Detalles del pago</h5>
            <hr />
            {[
              { label: "Método de pago", value: invoice.saleCond, id: 1 },
              {
                label: "Cantidad de cuotas",
                value: invoice.paymentsQuantity,
                id: 2,
              },
              invoice.saleCond === "Crédito"
                ? { label: "Tarjeta", value: invoice.creditCard, id: 3 }
                : null,
              invoice.saleCond === "Débito"
                ? { label: "Tarjeta", value: invoice.debitCard, id: 4 }
                : null,
              {
                label: "Total",
                value: `$${invoice.amounts.total.toFixed(2)}`,
                id: 5,
              },
              {
                label: "Precio s/ IVA",
                value: `$${invoice.amounts.precioSinIva.toFixed(2)}`,
                id: 6,
              },
              {
                label: "IVA",
                value: `$${invoice.amounts.iva.toFixed(2)}`,
                id: 7,
              },
            ]
              .filter(
                (
                  item,
                ): item is {
                  label: string;
                  value: string | undefined;
                  id: number;
                } => Boolean(item),
              )
              .map((item) => (
                <Col sm={6} key={item.id}>
                  <p>
                    <strong>{item.label}:</strong> {item.value}
                  </p>
                </Col>
              ))}
          </Row>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InvoiceDetails;
