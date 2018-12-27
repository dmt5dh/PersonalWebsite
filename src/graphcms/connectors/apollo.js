import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const GRAPHCMS_API = 'https://api-useast.graphcms.com/v1/cjns9sf7s0n3701glf3zoi7l0/master';
const client = new ApolloClient({
  link: new HttpLink({uri: GRAPHCMS_API}),
  cache: new InMemoryCache()
})

export default client
