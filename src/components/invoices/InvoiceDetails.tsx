import { useState } from "react";
import { formatDateISO } from "../../utils/utils";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "../ui/Table";
import { FileText } from "lucide-react";

interface Props {
  invoice: FullInvoice;
}

const InvoiceDetails: React.FC<Props> = ({ invoice }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  return (
    <>
      <Button size="sm" onClick={handleShow}>
        <FileText className="h-4 w-4" />
        <span>Ver detalles</span>
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Factura No {invoice.invoiceNumber}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4 p-4 border border-border rounded-lg">
            <h5 className="font-semibold mb-2">Detalles de la factura</h5>
            <hr className="border-border mb-3" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Número de comprobante", value: invoice.invoiceNumber, id: 1 },
                { label: "Tipo de factura", value: invoice.invoiceType, id: 2 },
                { label: "Fecha", value: formatDateISO(invoice.date), id: 3 },
                { label: "CAE", value: invoice.cae, id: 4 },
                { label: "Fecha de vencimiento", value: invoice.caeExpiringDate, id: 5 },
                { label: "Punto de venta", value: invoice.salePoint, id: 6 },
                { label: "Anulada?", value: invoice.cancelled && !invoice.assocInvoiceNumber ? "Si" : "No", id: 7 },
              ].map((item) => (
                <p key={item.id} className="text-sm">
                  <strong>{item.label}:</strong> {item.value}
                </p>
              ))}
            </div>
          </div>
          
          <div className="mb-4 p-4 border border-border rounded-lg">
            <h5 className="font-semibold mb-2">Detalles del cliente</h5>
            <hr className="border-border mb-3" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Nombre completo", value: invoice.client.name, id: 1 },
                { label: "Documento", value: `${invoice.client.documentType} - ${invoice.client.document}`, id: 2 },
                { label: "Direccion", value: invoice.client.address, id: 3 },
                { label: "Localidad", value: invoice.client.city, id: 4 },
                { label: "Condición frente al IVA", value: invoice.client.ivaCond, id: 5 },
              ].map((item) => (
                <p key={item.id} className="text-sm">
                  <strong>{item.label}:</strong> {item.value}
                </p>
              ))}
            </div>
          </div>
          
          <div className="mb-4 p-4 border border-border rounded-lg">
            <h5 className="font-semibold mb-2">Detalles de los productos</h5>
            <hr className="border-border mb-3" />
            <Table responsive>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Producto</TableHeaderCell>
                  <TableHeaderCell>Cantidad</TableHeaderCell>
                  <TableHeaderCell>Precio</TableHeaderCell>
                  <TableHeaderCell>Total</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody striped>
                {invoice.products.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell>{product.productName}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 border border-border rounded-lg">
            <h5 className="font-semibold mb-2">Detalles del pago</h5>
            <hr className="border-border mb-3" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Método de pago", value: invoice.saleCond, id: 1 },
                { label: "Cantidad de cuotas", value: invoice.paymentsQuantity, id: 2 },
                invoice.saleCond === "Crédito"
                  ? { label: "Tarjeta", value: invoice.creditCard, id: 3 }
                  : null,
                invoice.saleCond === "Débito"
                  ? { label: "Tarjeta", value: invoice.debitCard, id: 4 }
                  : null,
                { label: "Total", value: `$${invoice.amounts.total.toFixed(2)}`, id: 5 },
                { label: "Precio s/ IVA", value: `$${invoice.amounts.precioSinIva.toFixed(2)}`, id: 6 },
                { label: "IVA", value: `$${invoice.amounts.iva.toFixed(2)}`, id: 7 },
              ]
                .filter((item): item is { label: string; value: string | undefined; id: number } => Boolean(item))
                .map((item) => (
                  <p key={item.id} className="text-sm">
                    <strong>{item.label}:</strong> {item.value}
                  </p>
                ))}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default InvoiceDetails;
