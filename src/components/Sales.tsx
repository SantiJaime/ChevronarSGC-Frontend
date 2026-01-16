import { useFormik } from "formik";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import {
  ArrowLeftCircleFill,
  ArrowRightCircleFill,
  Printer,
  Search,
  Trash3Fill,
} from "react-bootstrap-icons";
import { searchSalesValidatorSchema } from "../utils/validationSchemas";
import { SELLERS } from "../constants/const";
import Swal from "sweetalert2";
import { formatPrice } from "../utils/utils";
import useSales from "../hooks/useSales";
import { useState } from "react";
import { validateSearchSale } from "../utils/validationFunctions";
import { toast } from "sonner";
import { deleteSale, printSale } from "../helpers/salesQueries";

const Sales = () => {
  const formik = useFormik({
    initialValues: {
      fromDate: "",
      toDate: "",
      sellerId: 0,
      saleNumber: "",
    },
    validationSchema: searchSalesValidatorSchema,
    onSubmit: () => handleSearch(),
  });
  const { values, errors, touched, setFieldValue, handleChange, handleSubmit } =
    formik;

  const { sales, loading, handleGetSales, setSales } = useSales();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async (paramPage?: number) => {
    const error = validateSearchSale({
      ...values,
      saleNumber: values.saleNumber ? Number(values.saleNumber) : undefined,
    });
    if (error) {
      toast.error(error);
      return;
    }
    const res = await handleGetSales(
      { ...values, saleNumber: Number(values.saleNumber ?? 0) },
      paramPage || page
    );
    if (!res) return;

    setTotalPages(res.totalPages);
  };
  const goToNextPage = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
      handleSearch(page + 1);
    }
  };

  const goToPreviousPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
      handleSearch(page - 1);
    }
  };

  const handlePrint = (id: string) => {
    const promise = printSale(id);

    toast.promise(promise, {
      loading: "Generando PDF...",
      success: (res) => {
        open(res.result, "_blank");
        return res.msg;
      },
      error: (err) => {
        const error = err as { error: string };
        return error.error;
      },
    });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "¿Estás seguro de eliminar este presupuesto de venta?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const promise = deleteSale(id);

        toast.promise(promise, {
          loading: "Eliminando presupuesto de venta...",
          success: (res) => {
            setSales((prevSales) =>
              prevSales.filter((sale) => sale._id !== id)
            );
            return res.msg;
          },
          error: (err) => {
            const error = err as { error: string };
            return error.error;
          },
        });
      }
    });
  };

  return (
    <div>
      <h2>Historial de presupuestos de ventas</h2>
      <hr />

      <Form noValidate onSubmit={handleSubmit}>
        <Row>
          <Form.Group as={Col} md={3} controlId="saleSellerId">
            <Form.Label>Vendedor *</Form.Label>
            <Form.Select
              name="sellerId"
              value={values.sellerId}
              onChange={handleChange}
              isInvalid={touched.sellerId && !!errors.sellerId}
            >
              <option value="">Vendedor no seleccionado</option>
              {SELLERS.map(({ label, value }) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.sellerId && touched.sellerId ? errors.sellerId : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="saleFromDateId">
            <Form.Label>Desde</Form.Label>
            <Form.Control
              type="text"
              name="fromDate"
              value={values.fromDate}
              onChange={(ev) => {
                let value = ev.target.value.replace(/[^0-9]/g, "");

                if (value.length > 4)
                  value = `${value.slice(0, 4)}-${value.slice(4)}`;
                if (value.length > 7)
                  value = `${value.slice(0, 7)}-${value.slice(7, 9)}`;

                setFieldValue("fromDate", value);
              }}
              placeholder="YYYY-MM-DD"
              isInvalid={touched.fromDate && !!errors.fromDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.fromDate && touched.fromDate ? errors.fromDate : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="saleToDateId">
            <Form.Label>Hasta</Form.Label>
            <Form.Control
              type="text"
              name="toDate"
              value={values.toDate}
              onChange={(ev) => {
                let value = ev.target.value.replace(/[^0-9]/g, "");

                if (value.length > 4)
                  value = `${value.slice(0, 4)}-${value.slice(4)}`;
                if (value.length > 7)
                  value = `${value.slice(0, 7)}-${value.slice(7, 9)}`;

                setFieldValue("toDate", value);
              }}
              placeholder="YYYY-MM-DD"
              isInvalid={touched.toDate && !!errors.toDate}
            />
            <Form.Control.Feedback type="invalid">
              {errors.toDate && touched.toDate ? errors.toDate : ""}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md={3} controlId="saleNumberId">
            <Form.Label>Número de presupuesto</Form.Label>
            <Form.Control
              type="text"
              name="saleNumber"
              value={values.saleNumber}
              onChange={handleChange}
              placeholder="Ej: 20"
              autoComplete="off"
              isInvalid={touched.saleNumber && !!errors.saleNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.saleNumber && touched.saleNumber ? errors.saleNumber : ""}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <div className="d-flex justify-content-end mt-3">
          <Button
            type="submit"
            variant="dark"
            className="d-flex align-items-center gap-1"
          >
            <Search />
            <span>Buscar</span>
          </Button>
        </div>
      </Form>
      <hr />
      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center">
          <Spinner animation="border" variant="dark" />
          <h4>Cargando...</h4>
        </div>
      ) : sales.length === 0 ? (
        <h4 className="text-center">
          No se encontraron presupuestos de ventas
        </h4>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Nro. de presupuesto</th>
                <th>Fecha de emisión</th>
                <th>Importes</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id}>
                  <td>{sale.clientName}</td>
                  <td>Presupuesto Nº {sale.saleNumber}</td>
                  <td>{sale.date}</td>
                  <td>
                    <div>
                      <div>
                        <strong>Total: </strong>${formatPrice(sale.total)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-1">
                      <Button
                        variant="success"
                        className="d-flex align-items-center gap-1"
                        onClick={() => handlePrint(sale._id)}
                      >
                        <Printer />
                        <span>Imprimir</span>
                      </Button>
                      <Button
                        variant="danger"
                        className="d-flex align-items-center gap-1"
                        onClick={() => handleDelete(sale._id)}
                      >
                        <Trash3Fill />
                        <span>Eliminar</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="d-flex justify-content-center align-items-center gap-2 mb-3">
            <Button
              onClick={goToPreviousPage}
              disabled={page === 1}
              variant="dark"
              className="d-flex align-items-center gap-1"
            >
              <ArrowLeftCircleFill />
              <span>Anterior</span>
            </Button>
            <span>
              Página <strong>{page}</strong> de <strong>{totalPages}</strong>
            </span>
            <Button
              onClick={goToNextPage}
              disabled={page === totalPages}
              variant="dark"
              className="d-flex align-items-center gap-1"
            >
              <span>Siguiente</span>
              <ArrowRightCircleFill />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sales;
