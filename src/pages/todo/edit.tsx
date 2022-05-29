import * as React from 'react';
import { useRouter } from 'next/dist/client/router';
import { useMutation, useLazyQuery } from '@apollo/client';
import { useFormik } from 'formik';
import { Box, TextField, FormControlLabel, Switch } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { styled } from '@mui/material/styles';
import * as yup from 'yup';

import { GET_TODO, UPDATE_TODO } from 'src/client/graphql/todo';
import { Todo } from '../../client/interfaces/todo.interface';

const TodoAddWrapper = styled('div')`
  display: flex;
  justify-content: center;
`;

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
});

const TodoEdit = () => {
  const router = useRouter();
  const routerArray = router.asPath.split('/');
  const todoId: number = Number(routerArray[routerArray.length - 1]);
  const [currentTodo, setCurrentTodo] = React.useState<Todo>({
    id: todoId,
    title: '',
    description: '',
    completed: true,
  });
  const [updateTodo, updateTodoResponse] = useMutation(UPDATE_TODO, {
    onCompleted: () => {
      location.href = '/todo';
    },
  });
  const [getTodo, getTodoResponse] = useLazyQuery(GET_TODO);
  const formik = useFormik({
    initialValues: {
      title: currentTodo.title,
      description: currentTodo.description,
      completed: currentTodo.completed,
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateTodo({
        variables: {
          id: currentTodo.id,
          title: values.title,
          description: values.description,
          completed: values.completed,
        },
      });
    },
  });

  React.useEffect(() => {
    getTodo({
      variables: { id: todoId },
    });
  }, []);
  React.useEffect(() => {
    if (getTodoResponse?.data?.getTodo) {
      const data = getTodoResponse.data.getTodo;
      setCurrentTodo({
        ...currentTodo,
        title: data.title,
        description: data.description,
        completed: data.completed,
      });
    }
  }, [getTodoResponse]);

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
          '& .MuiFormControlLabel-root': { m: 1 },
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
        <FormControlLabel
          name="completed"
          label=""
          control={
            <Switch
              checked={formik.values.completed}
              onChange={formik.handleChange}
            />
          }
        />
        <div>
          <LoadingButton
            color="primary"
            variant="contained"
            type="submit"
            sx={{ width: '100%' }}
            loading={updateTodoResponse.loading}
          >
            Update
          </LoadingButton>
        </div>
      </Box>
    </TodoAddWrapper>
  );
};

export default TodoEdit;
