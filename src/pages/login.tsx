import * as React from 'react';
import { useRouter } from 'next/dist/client/router';
import { toast } from 'react-toastify';
import { Box, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';

import { LOGIN } from 'src/client/graphql/auth';

const LoginWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  password: yup.string().required('Password is required'),
});

const Login = () => {
  const router = useRouter();
  const [login, { loading, error, client }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      location.href = '/';
      localStorage.setItem('todo_token', data.login.token);
    },
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      login({
        variables: {
          name: values.name,
          password: values.password,
        },
      });
    },
  });

  React.useEffect(() => {
    if (error && error.message) toast.error(error.message);
  }, [error]);

  return (
    <LoginWrapper>
      <Box
        component="form"
        sx={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          width: 500,
          maxWidth: '100%',
          '& .MuiTextField-root': { m: 1 },
          '& .MuiButton-root': { m: 1 },
        }}
        noValidate
        autoComplete="off"
        onSubmit={formik.handleSubmit}
      >
        <TextField
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          fullWidth
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="off"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          fullWidth
        />
        <div>
          <LoadingButton
            color="primary"
            variant="contained"
            type="submit"
            sx={{ width: '100%' }}
            loading={loading}
          >
            Login
          </LoadingButton>
        </div>
      </Box>
    </LoginWrapper>
  );
};

export default Login;
