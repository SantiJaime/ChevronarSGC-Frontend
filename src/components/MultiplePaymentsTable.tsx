import { Button, Table } from "react-bootstrap";
import { Trash3Fill } from "react-bootstrap-icons";
import { formatPrice } from "../utils/utils";

interface Props {
  paymentMethods: PaymentMethods[];
  handleDeletePaymentMethod?: (id: string) => void;
}

const MultiplePaymentsTable: React.FC<Props> = ({
  paymentMethods,
}) => {
  return (
    <>
      {paymentMethods.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Método de pago</th>
              <th>Valor a pagar</th>
              <th>Tarjeta de crédito</th>
              <th>Tarjeta de débito</th>
              <th>Cantidad de cuotas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map((method) => (
              <tr key={method.id}>
                <td>{method.method}</td>
                <td>${formatPrice(method.valueWithInterest)}</td>
                <td>{method.creditCard || "-"}</td>
                <td>{method.debitCard || "-"}</td>
                <td>{method.paymentsQuantity}</td>
                <td className="d-flex justify-content-center">
                  <Button
                    className="d-flex align-items-center gap-1"
                    variant="danger"
                    // onClick={() => handleDeletePaymentMethod(method.id)}
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
    </>
  );
};

export default MultiplePaymentsTable;
