import { gql } from '@apollo/client';

const REGISTER = gql`
  mutation register($name: String!, $password: String!, $gender: Boolean!) {
    register(
      registerData: { name: $name, password: $password, gender: $gender }
    ) {
      id
      name
    }
  }
`;

const LOGIN = gql`
  mutation login($name: String!, $password: String!) {
    login(user: { name: $name, password: $password }) {
      token
    }
  }
`;

const REFRESH_TOKEN = gql`
  query {
    refreshToken {
      id
      name
      role
    }
  }
`;

export { REGISTER, LOGIN, REFRESH_TOKEN };
