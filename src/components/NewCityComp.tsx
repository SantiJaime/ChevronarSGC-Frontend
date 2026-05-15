import { Formik } from "formik";
import { createCitySchema } from "../utils/validationSchemas";
import { toast } from "sonner";
import { createCity } from "../helpers/citiesQueries";
import { ARG_PROVINCES } from "../constants/const";
import useCities from "../hooks/useCities";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Select } from "./ui/Select";

const NewCityComp = () => {
  const { setCities } = useCities();

  const newCity = (values: City) => {
    createCity(values)
      .then((res) => {
        toast.success(res.msg);
        setCities((prevCities) => [...prevCities, res.city]);
      })
      .catch((err) => toast.error(err.msg));
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
        <form noValidate onSubmit={handleSubmit}>
          <h4 className="text-lg font-semibold mb-4">Crear nueva localidad</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="provinceId">Provincia</Label>
              <Select
                id="provinceId"
                onChange={handleChange}
                value={values.province}
                name="province"
                error={touched.province && !!errors.province}
                className="mt-1"
              >
                <option value="">Provincia no seleccionada</option>
                {ARG_PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </Select>
              {errors.province && touched.province && (
                <span className="text-sm text-destructive">{errors.province}</span>
              )}
            </div>
            
            {values.province && (
              <div>
                <Label htmlFor="cityId">Localidad</Label>
                <Input
                  id="cityId"
                  type="text"
                  placeholder="Ej: San Miguel de Tucuman"
                  value={values.city}
                  onChange={handleChange}
                  name="city"
                  error={touched.city && !!errors.city}
                  className="mt-1"
                />
                {errors.city && touched.city && (
                  <span className="text-sm text-destructive">{errors.city}</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end">
            <Button type="submit">
              Crear localidad
            </Button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default NewCityComp;
