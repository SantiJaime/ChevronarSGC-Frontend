import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import { Button, Container, Image, InputGroup, Spinner } from "react-bootstrap";
import { Key, PersonCircle } from "react-bootstrap-icons";
import { loginSchema } from "../utils/validationSchemas";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import useSession from "../hooks/useSession";
import { Role } from "../constants/const";
const Login = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { handleLogin } = useSession();
  const login = (values: UserLogin) => {
    setLoading(true);
    const promise = handleLogin(values)
      .then((res) => res)
      .catch((err) => {
        throw err;
      });

    toast.promise(promise, {
      loading: "Iniciando sesión...",
      success: (data) => {
        if (!data) return;
        const redirect =
          data.user.role === Role.ADMIN ? "/facturas" : "/ventas";
        navigate(redirect);
        return data.msg;
      },
      error: (err) => `${err.error}`,
      finally: () => setLoading(false),
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
                <Button variant="light" type="submit" disabled={loading}>
                  {loading ? (
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <Spinner size="sm" />
                      <span>Cargando...</span>
                    </div>
                  ) : (
                    <span>Iniciar sesión</span>
                  )}
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
