import Table from "react-bootstrap/Table";
import useProducts from "../hooks/useProducts";
import { formatPrice } from "../utils/utils";
import { Button, Container, Form, InputGroup, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Search, Trash3Fill } from "react-bootstrap-icons";
import EditProductInDbComp from "./EditProductInDbComp";
import Swal from "sweetalert2";

const ProductsTableComp = () => {
  const { handleSearchProducts, loadingProducts, handleDeleteProduct } =
    useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductInDb[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const term = searchTerm.trim();

    if (!term || term.length < 3) {
      setProducts([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const handler = setTimeout(async () => {
      const results = await handleSearchProducts(term);
      setProducts(results);
      setIsSearching(false);
    }, 500);

    return () => {
      clearTimeout(handler);
      setIsSearching(false);
    };
  }, [searchTerm, handleSearchProducts]);

  const confirmDeleteProduct = async (product: ProductInDb) => {
    Swal.fire({
      title: `¿Estás seguro de eliminar el producto "${product.productName}"?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#05b000",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingProductId(product._id);
        try {
          const ok = await handleDeleteProduct(product._id);
          if (ok) {
            setProducts((prev) => prev.filter((p) => p._id !== product._id));
          }
        } finally {
          setDeletingProductId(null);
        }
      }
    });
  };

  const hasSufficientTerm = searchTerm.trim().length >= 3;
  const deleteInProgress = deletingProductId !== null;

  return (
    <Container className="mt-5">
      <h2>Productos cargados en la base de datos</h2>
      <div className="d-flex justify-content-between mt-3">
        <Form className="w-50" onSubmit={(ev) => ev.preventDefault()}>
          <InputGroup>
            <Form.Control
              type="search"
              placeholder="Buscar por código de barras o nombre"
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
              autoComplete="off"
              autoFocus
            />
            <InputGroup.Text>
              <Search />
            </InputGroup.Text>
          </InputGroup>
        </Form>
      </div>
      <hr />
      {loadingProducts || isSearching ? (
        <div className="d-flex justify-content-center gap-2">
          <Spinner animation="border" variant="dark" />
          <h4 className="text-center">Buscando productos...</h4>
        </div>
      ) : !hasSufficientTerm ? (
        <h5 className="text-center">
          Escribe al menos tres caracteres para buscar productos
        </h5>
      ) : products.length === 0 ? (
        <h4 className="text-center">
          No se encontraron productos con el término "{searchTerm}"
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
            {products.map((prod) => {
              const isThisRowDeleting = deletingProductId === prod._id;
              return (
              <tr key={prod._id}>
                <td>{prod.productId}</td>
                <td>{prod.productName}</td>
                <td>${formatPrice(prod.price)}</td>
                <td>{prod.stock} unidades</td>
                <td>
                  <div className="d-flex justify-content-center gap-1">
                    <EditProductInDbComp
                      product={prod}
                      onProductUpdated={(updated) =>
                        setProducts((prev) =>
                          prev.map((p) =>
                            p._id === updated._id ? updated : p,
                          ),
                        )
                      }
                    />
                    <Button
                      variant="danger"
                      className="d-flex align-items-center gap-1"
                      onClick={() => confirmDeleteProduct(prod)}
                      disabled={deleteInProgress}
                    >
                      {isThisRowDeleting ? (
                        <>
                          <Spinner
                            animation="border"
                            variant="light"
                            size="sm"
                          />
                          <span>Eliminando...</span>
                        </>
                      ) : (
                        <>
                          <Trash3Fill />
                          <span>Eliminar</span>
                        </>
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ProductsTableComp;
