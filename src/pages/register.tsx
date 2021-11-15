import * as React from 'react';
import {
  Box,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useRouter } from 'next/dist/client/router';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';

import { REGISTER } from 'src/client/graphql/auth';

const RegisterWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  password: yup.string().required('Password is required').min(6),
  confirmPassword: yup
    .string()
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value;
    }),
});

const Register = () => {
  const router = useRouter();
  const [register, { loading, error, client }] = useMutation(REGISTER, {
    onCompleted: () => {
      router.push('/login');
      toast.success('Registered successfully');
    },
  });
  const formik = useFormik({
    initialValues: {
      name: '',
      password: '',
      confirmPassword: '',
      gender: 'male',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      register({
        variables: {
          name: values.name,
          password: values.password,
          gender: 'male' === values.gender,
        },
      });
    },
  });

  return (
    <RegisterWrapper>
      <Box
        component="form"
        sx={{
          marginTop: '30px',
          display: 'flex',
          flexDirection: 'column',
          width: 500,
          maxWidth: '100%',
          '& .MuiFormGroup-root': { m: 1 },
          '& .MuiFormControl-root': { m: 1 },
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
        <TextField
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm"
          type="password"
          autoComplete="off"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          fullWidth
        />
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={formik.values.gender}
          onChange={(event) => {
            formik.setFieldValue('gender', event?.currentTarget.value);
          }}
        >
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="female" control={<Radio />} label="Female" />
        </RadioGroup>
        <div>
          <LoadingButton
            color="primary"
            variant="contained"
            type="submit"
            loading={loading}
            sx={{ width: '100%' }}
          >
            Register
          </LoadingButton>
        </div>
      </Box>
    </RegisterWrapper>
  );
};

export default Register;
