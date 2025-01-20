import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('O nome é obrigatório'),
      email: Yup.string()
        .email('Digite um e-mail válido')
        .required('O e-mail é obrigatório'),
      password: Yup.string()
        .min(6, 'A senha deve ter pelo menos 6 caracteres')
        .required('A senha é obrigatória'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'As senhas devem coincidir')
        .required('Confirme sua senha'),
    }),
    onSubmit: async (values) => {
      try {
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        setSuccessMessage('Cadastro realizado com sucesso!');
        setErrorMessage('');
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error) {
        setErrorMessage(error.message || 'Ocorreu um erro.');
        setSuccessMessage('');
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Cadastre-se
      </Typography>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Nome"
          name="name"
          variant="outlined"
          margin="normal"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          fullWidth
          label="E-mail"
          name="email"
          variant="outlined"
          margin="normal"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          type="password"
          label="Senha"
          name="password"
          variant="outlined"
          margin="normal"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <TextField
          fullWidth
          type="password"
          label="Confirme sua senha"
          name="confirmPassword"
          variant="outlined"
          margin="normal"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Cadastrar
        </Button>
      </form>
    </Container>
  );
};

export default SignUp;
