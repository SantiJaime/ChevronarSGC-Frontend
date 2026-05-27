import { formatPrice } from "../utils/utils";
import { Button } from "./ui/Button";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "./ui/Table";
import { Trash2 } from "lucide-react";

interface Props {
  paymentMethods: PaymentMethods[];
  handleDeletePaymentMethod: (id: string) => void;
}

const MultiplePaymentsTable: React.FC<Props> = ({
  paymentMethods,
  handleDeletePaymentMethod
}) => {
  return (
    <>
      {paymentMethods.length > 0 && (
        <Table responsive>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Método de pago</TableHeaderCell>
              <TableHeaderCell>Valor a pagar</TableHeaderCell>
              <TableHeaderCell>Tarjeta de crédito</TableHeaderCell>
              <TableHeaderCell>Tarjeta de débito</TableHeaderCell>
              <TableHeaderCell>Cantidad de cuotas</TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody striped hover>
            {paymentMethods.map((method) => (
              <TableRow key={method.id}>
                <TableCell>{method.method}</TableCell>
                <TableCell>${formatPrice(method.valueWithInterest)}</TableCell>
                <TableCell>{method.creditCard || "-"}</TableCell>
                <TableCell>{method.debitCard || "-"}</TableCell>
                <TableCell>{method.paymentsQuantity}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePaymentMethod(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Eliminar</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default MultiplePaymentsTable;
