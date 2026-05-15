import { Formik } from "formik";
import { loginSchema } from "../utils/validationSchemas";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import useSession from "../hooks/useSession";
import { Role } from "../constants/const";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Spinner } from "../components/ui/Spinner";
import { Card, CardContent, CardHeader } from "../components/ui/Card";
import { User, KeyRound } from "lucide-react";

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
      error: (err) => {
        if (err.error) return err.error;
        if (err instanceof Error) return err.message;
        return "Error desconocido al iniciar sesión";
      },
      finally: () => setLoading(false),
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center gap-8 p-4">
      <div className="flex flex-col items-center gap-4">
        <img 
          src="/logoChevronar.webp" 
          alt="Logo Chevronar" 
          className="w-72 h-auto"
        />
        <h1 className="text-2xl font-bold text-foreground">Sistema de gestión comercial</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <h2 className="text-xl font-semibold text-center">Iniciar sesión</h2>
        </CardHeader>
        <CardContent>
          <Formik
            validationSchema={loginSchema}
            onSubmit={(values) => login(values)}
            initialValues={{
              username: "",
              password: "",
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="usernameId">Nombre de usuario</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <Input
                      id="usernameId"
                      placeholder="Ej: Martin"
                      type="text"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      error={touched.username && !!errors.username}
                      className="pl-10"
                    />
                  </div>
                  {errors.username && touched.username && (
                    <span className="text-sm text-destructive">{errors.username}</span>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <Label htmlFor="passwordId">Contraseña</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <Input
                      id="passwordId"
                      placeholder="**************"
                      type="password"
                      name="password"
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password && !!errors.password}
                      className="pl-10"
                    />
                  </div>
                  {errors.password && touched.password && (
                    <span className="text-sm text-destructive">{errors.password}</span>
                  )}
                </div>
                
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner size="sm" variant="light" />
                        <span>Cargando...</span>
                      </>
                    ) : (
                      <span>Iniciar sesión</span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
