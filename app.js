const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const PORT = 3000;
const mongoose = require('mongoose');
const isAuth = require('./middleware/is-auth');

const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');

const app = express();
app.use(bodyParser.json());
app.use(isAuth)

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue:graphQlResolvers ,
    graphiql: true
    }));

mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: false,
}).then((() => {
    console.log('Connected to MongoDB');
})).catch((err) => {
    console.log('MONGO CONNECTION ERROR:', err);
})
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

