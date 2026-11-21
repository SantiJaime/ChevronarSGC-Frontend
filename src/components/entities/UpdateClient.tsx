import { useState } from "react";
import { Formik } from "formik";
import { toast } from "sonner";
import { createClientSchema } from "../../validators/client.validators";
import { updateClient } from "../../helpers/clientsQueries";
import { DOCUMENT_TYPES, IVA_CONDITIONS, Role } from "../../constants/const";
import useClients from "../../hooks/useClients";
import useCities from "../../hooks/useCities";
import useSession from "../../hooks/useSession";
import ClientSearch from "./ClientSearch";
import CitySearch from "./CitySearch";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";

const UpdateClient = () => {
  const { user } = useSession();
  const { setClients } = useClients();
  const { cities } = useCities();
  const [client, setClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Editar clientes es exclusivo del dueño. el back también lo restringe a martin en PUT /clients/:id
  if (!user || user.role !== Role.MARTIN) return null;

  const save = (values: Omit<Client, "_id">) => {
    if (!client?._id) return;
    const id = client._id;

    const promise = updateClient(id, values).then((res) => {
      setClients((prev) => prev.map((c) => (c._id === id ? res.client : c)));
      setClient({ ...res.client, document: res.client.document.toString() });
      setSearchTerm(`${res.client.name} - ${res.client.document}`);
      return res;
    });

    toast.promise(promise, {
      loading: "Editando cliente...",
      success: (data) => `${data.msg}`,
      error: (err) => `${err.error}`,
    });
  };

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h4 className="text-lg font-semibold mb-4">Editar cliente</h4>

      <ClientSearch
        value={searchTerm}
        onValueChange={setSearchTerm}
        onSelect={setClient}
      />

      {client && (
        <Formik
          enableReinitialize
          validationSchema={createClientSchema}
          onSubmit={(values) =>
            save({
              ...values,
              name: values.name.trim().toUpperCase(),
              address: values.address.trim().toUpperCase(),
            })
          }
          initialValues={{
            documentType: client.documentType,
            document: client.document,
            name: client.name,
            address: client.address,
            city: client.city,
            ivaCond: client.ivaCond,
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label htmlFor="updDocumentTypeId">Tipo de documento</Label>
                  <Select
                    id="updDocumentTypeId"
                    onChange={handleChange}
                    value={values.documentType}
                    name="documentType"
                    error={touched.documentType && !!errors.documentType}
                    className="mt-1"
                  >
                    <option value="">Tipo de documento no seleccionado</option>
                    {DOCUMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Select>
                  {errors.documentType && touched.documentType && (
                    <span className="text-sm text-destructive">
                      {errors.documentType}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="updDocumentId">
                    Documento (sin guiones ni puntos)
                  </Label>
                  <Input
                    id="updDocumentId"
                    type="text"
                    maxLength={11}
                    value={values.document}
                    onChange={handleChange}
                    name="document"
                    error={touched.document && !!errors.document}
                    className="mt-1"
                  />
                  {errors.document && touched.document && (
                    <span className="text-sm text-destructive">
                      {errors.document}
                    </span>
                  )}
                </div>

                <div>
                  <Label htmlFor="updNameId">Nombre completo | Razón social</Label>
                  <Input
                    id="updNameId"
                    type="text"
                    value={values.name}
                    onChange={handleChange}
                    name="name"
                    error={touched.name && !!errors.name}
                    className="mt-1"
                  />
                  {errors.name && touched.name && (
                    <span className="text-sm text-destructive">{errors.name}</span>
                  )}
                </div>

                <div>
                  <Label htmlFor="updAddressId">Domicilio</Label>
                  <Input
                    id="updAddressId"
                    type="text"
                    value={values.address}
                    onChange={handleChange}
                    name="address"
                    error={touched.address && !!errors.address}
                    className="mt-1"
                  />
                  {errors.address && touched.address && (
                    <span className="text-sm text-destructive">
                      {errors.address}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="updCityId">Localidad</Label>
                  <CitySearch
                    id="updCityId"
                    cities={cities}
                    value={values.city}
                    onChange={(city) => setFieldValue("city", city)}
                    onBlur={() => setFieldTouched("city", true)}
                    error={touched.city && !!errors.city}
                    className="mt-1"
                  />
                  {errors.city && touched.city && (
                    <span className="text-sm text-destructive">{errors.city}</span>
                  )}
                </div>

                <div>
                  <Label htmlFor="updIvaConditionId">Condición IVA</Label>
                  <Select
                    id="updIvaConditionId"
                    onChange={handleChange}
                    value={values.ivaCond}
                    name="ivaCond"
                    error={touched.ivaCond && !!errors.ivaCond}
                    className="mt-1"
                  >
                    <option value="">Condición frente al IVA no seleccionada</option>
                    {IVA_CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition}
                      </option>
                    ))}
                  </Select>
                  {errors.ivaCond && touched.ivaCond && (
                    <span className="text-sm text-destructive">
                      {errors.ivaCond}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="success" type="submit">
                  Guardar cambios
                </Button>
              </div>
            </form>
          )}
        </Formik>
      )}
    </div>
  );
};

export default UpdateClient;
