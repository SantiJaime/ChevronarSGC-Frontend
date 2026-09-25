import { Formik } from "formik";
import { createClientSchema } from "../../utils/validationSchemas";
import { createClient } from "../../helpers/clientsQueries";
import { toast } from "sonner";
import useClients from "../../hooks/useClients";
import useCities from "../../hooks/useCities";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select } from "../ui/Select";
import CitySearch from "./CitySearch";

const NewClient = () => {
  const { setClients } = useClients();
  const { cities } = useCities();
  const IVA_CONDITIONS = [
    "IVA Sujeto exento",
    "IVA Responsable inscripto",
    "Iva No alcanzado",
    "Monotributista",
    "Consumidor Final",
  ];

  const DOCUMENT_TYPES = ["DNI", "CUIT", "CUIL"];

  const newClient = (values: Client) => {
    const promise = createClient(values).then(
      (res) => {
        setClients((prevClients) => [...prevClients, res.client]);
        return res;
      },
    );

    toast.promise(promise, {
      loading: "Creando cliente...",
      success: (data) => `${data.msg}`,
      error: (err) => `${err.error}`,
    });
  };

  return (
    <Formik
      validationSchema={createClientSchema}
      onSubmit={(values) =>
        newClient({
          ...values,
          name: values.name.trim(),
          address: values.address.trim(),
        })
      }
      initialValues={{
        documentType: "",
        document: "",
        name: "",
        address: "",
        city: "",
        ivaCond: "",
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
          <h4 className="text-lg font-semibold mb-4">Crear nuevo cliente</h4>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="documentTypeId">Tipo de documento</Label>
              <Select
                id="documentTypeId"
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
            </div>

            {values.documentType && (
              <div>
                <Label htmlFor="documentId">
                  {values.documentType} (sin guiones ni puntos)
                </Label>
                <Input
                  id="documentId"
                  type="text"
                  placeholder="12345678912"
                  value={values.document}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 11) {
                      handleChange(e);
                      return;
                    }
                    e.target.value = value.slice(0, 11);
                  }}
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
            )}

            <div>
              <Label htmlFor="nameId">Nombre completo | Razón social</Label>
              <Input
                id="nameId"
                type="text"
                placeholder="Ej: Juan Martinez"
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
              <Label htmlFor="adressId">Domicilio</Label>
              <Input
                id="adressId"
                type="text"
                placeholder="Ej: Av. Siempreviva 742"
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
              <Label htmlFor="cityId">Localidad</Label>
              <CitySearch
                id="cityId"
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
              <Label htmlFor="ivaConditionId">Condición IVA</Label>
              <Select
                id="ivaConditionId"
                onChange={handleChange}
                value={values.ivaCond}
                name="ivaCond"
                error={touched.ivaCond && !!errors.ivaCond}
                className="mt-1"
              >
                <option value="">
                  Condición frente al IVA no seleccionada
                </option>
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
              Crear cliente
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default NewClient;
