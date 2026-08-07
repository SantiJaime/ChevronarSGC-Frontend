import useProducts from "../../hooks/useProducts";
import { formatPrice } from "../../utils/utils";
import { useEffect, useState } from "react";
import EditProductInDbComp from "./EditProductInDbComp";
import Swal from "sweetalert2";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Spinner } from "../ui/Spinner";
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from "../ui/Table";
import { Search, Trash2 } from "lucide-react";

const ProductsTableComp = () => {
  const { handleSearchProducts, loadingProducts, handleDeleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<ProductInDb[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

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
      title: `Estas seguro de eliminar el producto "${product.productName}"?`,
      text: "Esta accion no se puede deshacer",
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
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-4">Productos cargados en la base de datos</h2>
      
      <div className="flex justify-between mt-4">
        <form className="w-1/2" onSubmit={(ev) => ev.preventDefault()}>
          <div className="relative">
            <Input
              type="search"
              placeholder="Buscar por código de barras o nombre"
              value={searchTerm}
              onChange={(ev) => setSearchTerm(ev.target.value)}
              autoComplete="off"
              autoFocus
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
          </div>
        </form>
      </div>
      
      <hr className="border-border my-4" />
      
      {loadingProducts || isSearching ? (
        <div className="flex justify-center items-center gap-2 py-8">
          <Spinner size="lg" />
          <h4 className="text-lg font-medium">Buscando productos...</h4>
        </div>
      ) : !hasSufficientTerm ? (
        <h5 className="text-center text-muted-foreground py-8">
          Escribe al menos tres caracteres para buscar productos
        </h5>
      ) : products.length === 0 ? (
        <h4 className="text-center text-muted-foreground py-8">
          No se encontraron productos con el termino "{searchTerm}"
        </h4>
      ) : (
        <Table responsive>
          <TableHead>
            <TableRow>
              <TableHeaderCell>ID (identificador)</TableHeaderCell>
              <TableHeaderCell>Nombre del producto</TableHeaderCell>
              <TableHeaderCell>Precio unitario</TableHeaderCell>
              <TableHeaderCell>Stock</TableHeaderCell>
              <TableHeaderCell>Acciones</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody striped hover>
            {products.map((prod) => {
              const isThisRowDeleting = deletingProductId === prod._id;
              return (
                <TableRow key={prod._id}>
                  <TableCell>{prod.productId}</TableCell>
                  <TableCell>{prod.productName}</TableCell>
                  <TableCell>${formatPrice(prod.price)}</TableCell>
                  <TableCell>{prod.stock} unidades</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
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
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDeleteProduct(prod)}
                        disabled={deleteInProgress}
                      >
                        {isThisRowDeleting ? (
                          <>
                            <Spinner size="sm" variant="light" />
                            <span>Eliminando...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            <span>Eliminar</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ProductsTableComp;
