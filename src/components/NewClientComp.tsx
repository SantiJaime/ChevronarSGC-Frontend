import { Formik } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import { createClientSchema } from "../utils/validationSchemas";
import { createClient } from "../helpers/clientsQueries";
import { toast } from "sonner";
import useClients from "../hooks/useClients";
import useCities from "../hooks/useCities";

const NewClientComp = () => {
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
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Token inexistente");
      return;
    }

    const promise = createClient(values, token)
      .then((res) => {
        setClients((prevClients) => [...prevClients, res.client]);
        return res;
      })
      .catch((err) => {

        if (err.error.includes("E11000")) {
          err.error = "El documento ingresado ya se encuentra asociado a un cliente";
          throw err;
        }
        throw err;
      });

    toast.promise(promise, {
      loading: "Creando cliente...",
      success: (data) => `${data.msg}`,
      error: (err) => `${err.error}`,
    });
  };

  return (
    <Formik
      validationSchema={createClientSchema}
      onSubmit={(values) => newClient(values)}
      initialValues={{
        documentType: "",
        document: "",
        name: "",
        address: "",
        city: "",
        ivaCond: "",
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <h4>Crear nuevo cliente</h4>
          <Row className="mb-3">
            <Form.Group as={Col} md="3" controlId="documentTypeId">
              <Form.Label>Tipo de documento</Form.Label>
              <Form.Select
                onChange={handleChange}
                value={values.documentType}
                name="documentType"
                isInvalid={touched.documentType && !!errors.documentType}
              >
                <option value={""}>Tipo de documento no seleccionado</option>
                {DOCUMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {values.documentType ? (
              <Form.Group as={Col} md="3" controlId="documentId">
                <Form.Label>
                  {values.documentType} (sin guiones ni puntos)
                </Form.Label>
                <Form.Control
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
                  isInvalid={touched.document && !!errors.document}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.document && touched.document ? errors.document : ""}
                </Form.Control.Feedback>
              </Form.Group>
            ) : (
              ""
            )}
            <Form.Group as={Col} md="3" controlId="nameId">
              <Form.Label>Nombre completo | Razón social</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Juan Martinez"
                value={values.name}
                onChange={handleChange}
                name="name"
                isInvalid={touched.name && !!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name && touched.name ? errors.name : ""}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="adressId">
              <Form.Label>Domicilio</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Av. Siempreviva 742"
                value={values.address}
                onChange={handleChange}
                name="address"
                isInvalid={touched.address && !!errors.address}
              />
              <Form.Control.Feedback type="invalid">
                {errors.address && touched.address ? errors.address : ""}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="cityId">
              <Form.Label>Localidad</Form.Label>
              <Form.Select
                onChange={handleChange}
                value={values.city}
                name="city"
                isInvalid={touched.city && !!errors.city}
              >
                <option value={""}>Localidad no seleccionada</option>
                {cities.map((city) => (
                  <option
                    key={city._id}
                    value={`${city.city} - ${city.province}`}
                  >
                    {`${city.city} - ${city.province}`}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.city && touched.city ? errors.city : ""}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3" controlId="ivaConditionId">
              <Form.Label>Condición IVA</Form.Label>
              <Form.Select
                onChange={handleChange}
                value={values.ivaCond}
                name="ivaCond"
                isInvalid={touched.ivaCond && !!errors.ivaCond}
              >
                <option value={""}>
                  Condición frente al IVA no seleccionada
                </option>
                {IVA_CONDITIONS.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.ivaCond && touched.ivaCond ? errors.ivaCond : ""}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <div className="d-flex justify-content-end">
            <Button variant="success" type="submit">
              Crear cliente
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewClientComp;
