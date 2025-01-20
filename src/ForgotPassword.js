import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Typography, Container, Alert } from '@mui/material';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "./firebaseConfig";

const ForgotPassword = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Digite um e-mail válido')
        .required('O e-mail é obrigatório'),
    }),
    onSubmit: async (values) => {
      try {
        await sendPasswordResetEmail(auth, values.email);
        setSuccessMessage('E-mail de redefinição enviado com sucesso!');
        setErrorMessage('');
      } catch (error) {
        setErrorMessage(error.message || 'Ocorreu um erro.');
        setSuccessMessage('');
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Esqueceu sua senha?
      </Typography>
      <Typography variant="body1" gutterBottom>
        Insira seu e-mail para receber instruções de redefinição de senha.
      </Typography>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <form onSubmit={formik.handleSubmit}>
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
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Enviar
        </Button>
      </form>
    </Container>
  );
};

export default ForgotPassword;
