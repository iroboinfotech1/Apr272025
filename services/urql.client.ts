import {
 
  cacheExchange,
  fetchExchange,
  createClient,

} from "urql";
import { yogaExchange } from "@graphql-yoga/urql-exchange";

const client = createClient({
  url: "https://demo.pixelkube.io/graphql",
  fetchSubscriptions: true,
  exchanges: [
    fetchExchange,
    cacheExchange,
  ],
});

export default client;
