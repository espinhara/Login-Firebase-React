import React, { useState } from "react";
import { Button, TextField, Box, Typography, Grid, Paper, Alert } from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';
// Para v6 // Importação para navegação
import { auth, signInWithEmailAndPassword } from "./firebaseConfig"; // Atualize o caminho conforme necessário

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para navegação

  // Validação de formulário com Yup
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Digite um email válido")
      .required("O email é obrigatório"),
    password: Yup.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres")
      .required("A senha é obrigatória"),
  });

  // Função para tratar o login
  const handleLogin = async (values) => {
    try {
      setError(null); // Reseta erros anteriores
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      console.log("Login bem-sucedido:", userCredential.user);
      // Redirecione para outra página após login
      navigate("/dashboard"); // Atualize o caminho conforme necessário
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <Grid container component="main" sx={{ height: "100vh" }}>
      {/* Lado esquerdo com imagem ou design */}
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        sx={{
          backgroundImage: "url(https://picsum.photos/800/600)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* Formulário de login */}
      <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ errors, touched }) => (
              <Form style={{ width: "100%", marginTop: "16px" }}>
                <Field
                  as={TextField}
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  helperText={touched.email && errors.email}
                  error={touched.email && Boolean(errors.email)}
                />
                <Field
                  as={TextField}
                  fullWidth
                  id="password"
                  name="password"
                  label="Senha"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  helperText={touched.password && errors.password}
                  error={touched.password && Boolean(errors.password)}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Entrar
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Typography
                      variant="body2"
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate("/forgot-password")} // Redirecionar para redefinir senha
                    >
                      Esqueceu a senha?
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      sx={{ cursor: "pointer" }}
                      onClick={() => navigate("/signup")} // Redirecionar para cadastro
                    >
                      {"Não tem uma conta? Cadastre-se"}
                    </Typography>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;
