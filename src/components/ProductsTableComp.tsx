import Table from "react-bootstrap/Table";
import useProducts from "../hooks/useProducts";
import { formatPrice } from "../utils/utils";
import { Container, Form, InputGroup, Spinner } from "react-bootstrap";
import { useMemo, useState } from "react";
import { normalizeText } from "../constants/const";
import { Search } from "react-bootstrap-icons";
import EditProductInDbComp from "./EditProductInDbComp";

const ProductsTableComp = () => {
  const { productsInDb, loadingProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (searchTerm.trim().length < 2) {
      return productsInDb;
    }
    const normalizedSearch = normalizeText(searchTerm);

    return productsInDb.filter((prod) => {
      const normalizedName = normalizeText(prod.productName);

      return normalizedName.includes(normalizedSearch);
    });
  }, [productsInDb, searchTerm]);

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between">
        <h2>Productos cargados en la base de datos</h2>
        <Form>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Buscar producto"
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
            />
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
          </InputGroup>
        </Form>
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
