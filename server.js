const graphql = require('graphql');
const graphqlHTTP = require('express-graphql');
const express = require('express');
const schema = require('./schema');

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(3003, () => console.log('Listening on 3003 port'));