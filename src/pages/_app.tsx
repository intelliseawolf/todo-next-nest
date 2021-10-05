import NextApp, { AppProps } from 'next/app';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ToastContainer } from 'react-toastify';

import Layout from '../client/components/Layout';
import { AppDataContext } from 'src/client/ssr/appData';
import { AppData } from 'src/shared/types/app-data';
import { initializeFetch } from 'src/shared/utils/fetch';

import 'react-toastify/dist/ReactToastify.css';
import '../client/css/styles.css';

class App extends NextApp<AppProps> {
  appData: AppData;
  client;
  authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('todo_token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  });
  httpLink = createHttpLink({
    uri: 'http://localhost:3000/graphql',
  });

  constructor(props: AppProps) {
    super(props);

    this.appData = props.pageProps.appData || {};
    this.client = new ApolloClient({
      link: this.authLink.concat(this.httpLink),
      cache: new InMemoryCache(),
    });

    initializeFetch(this.appData.basePath);
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <ApolloProvider client={this.client}>
        <AppDataContext.Provider value={this.appData}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </AppDataContext.Provider>
      </ApolloProvider>
    );
  }
}

export default App;
