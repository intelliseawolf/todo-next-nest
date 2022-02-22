import { gql } from '@apollo/client';

const GET_USERS = gql`
  query {
    getUsers {
      id
      name
      gender
      role
    }
  }
`;

const ADD_USER = gql`
  mutation createUser($name: String!, $password: String!, $gender: Boolean!) {
    createUser(
      createUserData: { name: $name, password: $password, gender: $gender }
    ) {
      id
      name
    }
  }
`;

const DELETE_USER = gql`
  mutation deleteUser($id: Float!) {
    deleteUser(id: $id) {
      id
      name
      role
      gender
    }
  }
`;

export { GET_USERS, ADD_USER, DELETE_USER };
