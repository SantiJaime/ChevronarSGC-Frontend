import { useState } from "react";
import { Col, Row, Table } from "react-bootstrap";
import { FileText } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

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
          <Modal.Title>Detalles de la factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Datos del Cliente */}
          <Row className="mb-3 p-3 border rounded">
            <h5 className="mb-2">Detalles de la factura</h5>
            <hr />
            {[
              { label: "Número de comprobante", value: invoice.invoiceNumber },
              { label: "Tipo de factura", value: invoice.invoiceType },
              { label: "Fecha", value: invoice.date },
              { label: "CAE", value: invoice.cae },
              { label: "Fecha de vencimiento", value: invoice.caeExpiringDate },
              { label: "Punto de venta", value: invoice.salePoint },
              {
                label: "¿Anulada?",
                value:
                  invoice.cancelled && !invoice.assocInvoiceNumber
                    ? "Sí"
                    : "No",
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
            <h5 className="mb-2">Detalles del cliente</h5>
            <hr />
            {[
              { label: "Nombre completo", value: invoice.client.name },
              {
                label: "Documento",
                value: `${invoice.client.documentType} - ${invoice.client.document}`,
              },
              { label: "Dirección", value: invoice.client.address },
              { label: "Localidad", value: invoice.client.city },
              {
                label: "Condición frente al IVA",
                value: invoice.client.ivaCond,
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
                {invoice.products.map((product, index) => (
                  <tr key={index}>
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
              { label: "Método de pago", value: invoice.saleCond },
              { label: "Cantidad de cuotas", value: invoice.paymentsQuantity },
              invoice.saleCond === "Crédito"
                ? { label: "Tarjeta", value: invoice.creditCard }
                : null,
              invoice.saleCond === "Débito"
                ? { label: "Tarjeta", value: invoice.debitCard }
                : null,
              { label: "Total", value: `$${invoice.amounts.total.toFixed(2)}` },
              {
                label: "Precio s/ IVA",
                value: `$${invoice.amounts.precioSinIva.toFixed(2)}`,
              },
              { label: "IVA", value: `$${invoice.amounts.iva.toFixed(2)}` },
            ]
              .filter(
                (item): item is { label: string; value: string | undefined } =>
                  Boolean(item)
              )
              .map((item, index) => (
                <Col sm={6} key={index}>
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
