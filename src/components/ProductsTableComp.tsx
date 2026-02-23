import Table from "react-bootstrap/Table";
import useProducts from "../hooks/useProducts";
import { formatPrice } from "../utils/utils";
import { Button, Container, Form, InputGroup, Spinner } from "react-bootstrap";
import { useMemo, useState } from "react";
import { ArrowClockwise, Search } from "react-bootstrap-icons";
import EditProductInDbComp from "./EditProductInDbComp";

const ProductsTableComp = () => {
  const { productsInDb, loadingProducts, searchProducts, handleGetProducts } =
    useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm || searchTerm.trim().length < 3) return productsInDb;
    return searchProducts(searchTerm);
  }, [searchTerm, searchProducts, productsInDb]);

  return (
    <Container className="mt-5">
      <h2>Productos cargados en la base de datos</h2>
      <div className="d-flex justify-content-between mt-3">
        <Form className='w-50' onSubmit={(ev) => ev.preventDefault()}>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Buscar producto por código de barras o nombre"
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
              autoComplete='off'
              autoFocus
            />
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
          </InputGroup>
        </Form>
        <Button
          variant="dark"
          onClick={() => handleGetProducts(true)}
          className="d-flex align-items-center gap-2"
          disabled={loadingProducts}
        >
          {loadingProducts ? (
            <>
              <Spinner animation="border" variant="dark" size="sm" />
              <span>Recargando...</span>
            </>
          ) : (
            <>
              <ArrowClockwise />
              <span>Recargar productos</span>
            </>
          )}
        </Button>
      </div>
      <hr />
      {loadingProducts ? (
        <div className="d-flex justify-content-center gap-2">
          <Spinner animation="border" variant="dark" />
          <h4 className="text-center">Cargando productos...</h4>
        </div>
      ) : filteredItems.length === 0 ? (
        <h4 className="text-center">
          No se encontraron productos con el nombre "{searchTerm}"
        </h4>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID (identificador)</th>
              <th>Nombre del producto</th>
              <th>Precio unitario</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((prod) => (
              <tr key={prod._id}>
                <td>{prod.productId}</td>
                <td>{prod.productName}</td>
                <td>${formatPrice(prod.price)}</td>
                <td>{prod.stock} unidades</td>
                <td>
                  <div className="d-flex justify-content-center gap-1">
                    <EditProductInDbComp product={prod} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProductsTableComp;
