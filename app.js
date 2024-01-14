const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]!
        }
        
        type RootMutation {
        
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: null,
}));

app.listen(3000);

