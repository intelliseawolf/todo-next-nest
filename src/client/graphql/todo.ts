import { gql } from '@apollo/client';

const CREATE_TODO = gql`
  mutation createTodo($title: String!, $description: String!) {
    createTodo(todo: { title: $title, description: $description }) {
      id
      title
      description
    }
  }
`;

const UPDATE_TODO = gql`
  mutation updateTodo(
    $id: Float!
    $title: String!
    $description: String!
    $completed: Boolean!
  ) {
    updateTodo(
      todo: {
        id: $id
        title: $title
        description: $description
        completed: $completed
      }
    ) {
      id
      title
      description
      completed
    }
  }
`;

const GET_TODOS = gql`
  query getTodos($perPage: Float!, $page: Float!) {
    getTodos(params: { perPage: $perPage, page: $page }) {
      count
      todos {
        id
        title
        description
        completed
      }
    }
  }
`;

const DELETE_TODO = gql`
  mutation deleteTodo($id: Float!) {
    deleteTodo(todo: { id: $id }) {
      id
      title
      description
      completed
    }
  }
`;

const GET_TODO = gql`
  query getTodo($id: Float!) {
    getTodo(todo: { id: $id }) {
      id
      title
      description
      completed
    }
  }
`;

const TOGGLE_TODO_COMPLETION = gql`
  mutation toggleTodoCompletion($id: Float!) {
    toggleTodoCompletion(todo: { id: $id }) {
      id
      title
      description
      completed
    }
  }
`;

export {
  GET_TODOS,
  CREATE_TODO,
  DELETE_TODO,
  GET_TODO,
  UPDATE_TODO,
  TOGGLE_TODO_COMPLETION,
};
