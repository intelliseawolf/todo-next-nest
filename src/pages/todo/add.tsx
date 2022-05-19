import * as React from 'react';
import { useRouter } from 'next/dist/client/router';
import { toast } from 'react-toastify';
import { Box, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useMutation } from '@apollo/client';

import { CREATE_TODO } from 'src/client/graphql/todo';

const TodoAddWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
});

const TodoAdd = () => {
  const router = useRouter();
  const [createTodo, { loading, error, client }] = useMutation(CREATE_TODO, {
    onCompleted: () => {
      location.href = '/todo';
    },
  });
  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      createTodo({
        variables: {
          title: values.title,
          description: values.description,
        },
      });
    },
  });

  React.useEffect(() => {
    if (error && error.message) toast.error(error.message);
  }, [error]);

  return (
    <TodoAddWrapper>
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
          id="title"
          name="title"
          label="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
          fullWidth
        />
        <TextField
          id="description"
          name="description"
          label="Description"
          autoComplete="off"
          value={formik.values.description}
          onChange={formik.handleChange}
          error={
            formik.touched.description && Boolean(formik.errors.description)
          }
          helperText={formik.touched.description && formik.errors.description}
          fullWidth
          multiline
          rows={4}
        />
        <div>
          <LoadingButton
            color="primary"
            variant="contained"
            type="submit"
            sx={{ width: '100%' }}
            loading={loading}
          >
            Add
          </LoadingButton>
        </div>
      </Box>
    </TodoAddWrapper>
  );
};

export default TodoAdd;
