import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import { Button, Container, Image, InputGroup } from "react-bootstrap";
import { Key, PersonCircle } from "react-bootstrap-icons";
import { loginSchema } from "../utils/validationSchemas";
import { loginUser } from "../helpers/usersQueries";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const Login = () => {
  const navigate = useNavigate();
  const login = (values: UserLogin) => {
    const promise = loginUser(values)
      .then((res) => {
        sessionStorage.setItem("session", JSON.stringify(true));
        navigate("/admin");
        return res;
      })
      .catch((err) => {
        throw err;
      });

    toast.promise(promise, {
      loading: "Iniciando sesión...",
      success: (data) => `${data.msg}`,
      error: (err) => `${err.msg}`,
    });
  };

  return (
    <Container className="mt-5 d-flex flex-column align-items-center gap-5">
      <div className="d-flex justify-content-center flex-column align-items-center">
        <Image src="/logoChevronar.webp" alt="Logo Chevronar" fluid />
        <h1>Sistema de gestión comercial</h1>
      </div>
      <div className="w-75">
        <Formik
          validationSchema={loginSchema}
          onSubmit={(values) => login(values)}
          initialValues={{
            username: "",
            password: "",
          }}
        >
          {({ values, errors, touched, handleChange, handleSubmit }) => (
            <Form
              onSubmit={handleSubmit}
              className="bg-dark p-3 rounded-4 text-light"
            >
              <Form.Group className="mb-3" controlId="usernameId">
                <Form.Label>Nombre de usuario</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <PersonCircle />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Ej: Martin"
                    type="text"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                    isInvalid={touched.username && !!errors.username}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username && touched.username && errors.username}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3" controlId="passwordId">
                <Form.Label>Contraseña</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <Key />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="**************"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    isInvalid={touched.password && !!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password && touched.password && errors.password}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="light" type="submit">
                  Iniciar sesión
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default Login;
