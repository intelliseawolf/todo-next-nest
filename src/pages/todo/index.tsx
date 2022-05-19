import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/dist/client/router';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Checkbox,
  Typography,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import {
  DELETE_TODO,
  GET_TODOS,
  TOGGLE_TODO_COMPLETION,
} from 'src/client/graphql/todo';
import { Todo } from 'src/client/interfaces/todo.interface';

interface PaginationState {
  perPage: number;
  page: number;
}

const ButtonBar = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'end',
}));

const TodosIndex = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [paginationState, setPaginationState] = React.useState<PaginationState>(
    {
      perPage: 5,
      page: 0,
    },
  );
  const [totalCount, setTotalCount] = React.useState<number>(0);
  const [getTodos, { loading, error, data }] = useLazyQuery(GET_TODOS, {
    fetchPolicy: 'cache-and-network',
  });
  const [deleteTodo, deletedResponse] = useMutation(DELETE_TODO, {
    onCompleted: () => {
      getTodosByPagination(0, paginationState.perPage);
    },
  });
  const [toggleTodoCompletion, toggleTodoCompletionResponse] = useMutation(
    TOGGLE_TODO_COMPLETION,
    {
      onCompleted: () => {
        getTodos({
          variables: {
            perPage: paginationState.perPage,
            page: paginationState.page,
          },
        });
      },
    },
  );
  const router = useRouter();

  React.useEffect(() => {
    const state = {
      ...paginationState,
      ...router.query,
    };

    if (state.page != 0) {
      setTotalCount(Number(state.perPage) * Number(state.page) + 1);
    }
    setPaginationState({
      perPage: Number(state.perPage),
      page: Number(state.page),
    });
    getTodos({
      variables: {
        perPage: Number(state.perPage),
        page: Number(state.page),
      },
    });
  }, []);
  React.useEffect(() => {
    if (data && data.getTodos) {
      setTodos(data.getTodos.todos);
      setTotalCount(Number(data.getTodos.count));
    }
  }, [error, data]);

  function handleDeleteTodo(id: number) {
    deleteTodo({ variables: { id: Number(id) } });
  }

  function completeTodo(todo: Todo) {
    toggleTodoCompletion({
      variables: { id: Number(todo.id) },
    });
  }

  function handleChangePage(event: unknown, newPage: number) {
    setPaginationState({
      ...paginationState,
      page: newPage,
    });
    getTodosByPagination(newPage, paginationState.perPage);
  }

  function handleChangePerPage(event: React.ChangeEvent<HTMLInputElement>) {
    setPaginationState({
      page: 0,
      perPage: parseInt(event.target.value, 10),
    });
    getTodosByPagination(0, parseInt(event.target.value, 10));
  }

  function getTodosByPagination(page: number, perPage: number) {
    router.push({
      pathname: '/todo',
      query: {
        perPage: perPage,
        page: page,
      },
    });
    getTodos({
      variables: {
        perPage: perPage,
        page: page,
      },
    });
  }

  return (
    <>
      <ButtonBar>
        <Typography
          sx={{ flex: '1 1 100%', marginTop: '14px' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Todo List
        </Typography>
        <Link href="/todo/add">
          <Button
            variant="outlined"
            endIcon={<AddIcon />}
            sx={{ margin: '10px' }}
          >
            Add
          </Button>
        </Link>
      </ButtonBar>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="table" size="small">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Completed</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {todos.length ? (
              <>
                {todos.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center">{item.title}</TableCell>
                    <TableCell align="center">{item.description}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={item.completed}
                        onChange={() => completeTodo(item)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Link href={`/todo/${item.id}`}>
                        <IconButton aria-label="edit" size="large">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton
                        aria-label="delete"
                        size="large"
                        onClick={() => handleDeleteTodo(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No planned todos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={paginationState.perPage}
        page={paginationState.page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangePerPage}
      />
    </>
  );
};

export default TodosIndex;
