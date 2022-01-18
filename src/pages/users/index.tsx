import React from 'react';
import Link from 'next/link';
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
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

import { DELETE_USER, GET_USERS } from 'src/client/graphql/users';
import type { User } from 'src/client/interfaces/user.interface';
import { AuthProvider } from 'src/client/components/Layout';

const ButtonBar = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'end',
}));

const UserIndex = () => {
  const [getUsers, { loading, error, data }] = useLazyQuery(GET_USERS);
  const [deleteUser, deletedResponse] = useMutation(DELETE_USER, {
    onCompleted: () => {
      if (deletedResponse.data && deletedResponse.data.deleteUser)
        setUsers(deletedResponse.data.deleteUser);
    },
  });
  const [users, setUsers] = React.useState<User[]>([]);
  const currentUser = React.useContext(AuthProvider);

  React.useEffect(() => {
    getUsers();
  }, []);
  React.useEffect(() => {
    if (data && data.getUsers) setUsers(data.getUsers);
  }, [error, data]);

  function handleUserDelete(id: number) {
    deleteUser({ variables: { id: Number(id) } });
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
          User List
        </Typography>
        <Link href="/user/add">
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
        <Table sx={{ minWidth: 650 }} aria-label="table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Gender</TableCell>
              <TableCell align="center">Role</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length ? (
              <>
                {users.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell align="center">{item.name}</TableCell>
                    <TableCell align="center">
                      {item.gender ? 'Male' : 'Female'}
                    </TableCell>
                    <TableCell align="center">{item.role}</TableCell>
                    <TableCell align="center">
                      {currentUser.id !== item.id && (
                        <IconButton
                          aria-label="delete"
                          size="large"
                          onClick={() => handleUserDelete(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
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
    </>
  );
};

export default UserIndex;
