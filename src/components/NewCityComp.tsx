import { Formik } from "formik";
import { Button, Col, Form, Row } from "react-bootstrap";
import { createCitySchema } from "../utils/validationSchemas";
import { toast } from "sonner";
import { createCity } from "../helpers/citiesQueries";
import { ARG_PROVINCES } from '../constants/const';
import useCities from "../hooks/useCities";

const NewCityComp = () => {
  const { setCities } = useCities();

  const newCity = (values: City) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Token inexistente");
      return;
    }
    createCity(values, token)
      .then((res) => {
        toast.success(res.msg);
        setCities((prevCities) => [...prevCities, res.city]);
      })
      .catch((err) => toast.error(err));
  };

  return (
    <Formik
      validationSchema={createCitySchema}
      onSubmit={(values) => newCity(values)}
      initialValues={{
        province: "",
        city: "",
      }}
    >
      {({ values, errors, touched, handleChange, handleSubmit }) => (
        <Form noValidate onSubmit={handleSubmit}>
          <h4>Crear nueva localidad</h4>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="provinceId">
              <Form.Label>Provincia</Form.Label>
              <Form.Select
                onChange={handleChange}
                value={values.province}
                name="province"
                isInvalid={touched.province && !!errors.province}
              >
                <option value={""}>Provincia no seleccionada</option>
                {ARG_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.province && touched.province ? errors.province : ""}
              </Form.Control.Feedback>
            </Form.Group>
            {values.province && (
              <Form.Group as={Col} md="6" controlId="cityId">
                <Form.Label>Localidad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: San Miguel de Tucumán"
                  value={values.city}
                  onChange={handleChange}
                  name="city"
                  isInvalid={touched.city && !!errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.city && touched.city ? errors.city : ""}
                </Form.Control.Feedback>
              </Form.Group>
            )}
          </Row>
          <div className="d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Crear localidad
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default NewCityComp;
