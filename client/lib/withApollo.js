// connecting to my graphql server

import withApollo from 'next-with-apollo';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';


const dev = process.env.NODE_ENV === 'development';

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: dev ? "http://localhost:3000/api/graphql" : process.env.MY_GRAPHQL_URL,
      cache: new InMemoryCache().restore(initialState || {})
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    }
  }
);