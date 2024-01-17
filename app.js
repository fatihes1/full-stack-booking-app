const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const PORT = 3000;
const mongoose = require('mongoose');
const Event = require('./models/event');

const app = express();
const DUMMY_EVENTS = [];
app.use(bodyParser.json());
app.use('/graphql', graphqlHttp({
    schema: buildSchema(`
        # ... ! means required
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        } 
    
        type RootQuery {
            events: [Event!]!
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find().then((events) => {
                return events.map(event => {
                    // String casting is not necessary anymore - I guess it's because of the new version of mongoose
                    return {...event._doc, _id: event._doc._id.toString()};
                })
            }).catch((err) => {
                throw err;
            })
        },
        createEvent: args => {
            const { eventInput } = args;
            const event = new Event({
                title: eventInput.title,
                description: eventInput.description,
                price: +eventInput.price,
                date: new Date(eventInput.date)
            });
            return event
                .save()
                .then((event) => {
                    // String casting is not necessary anymore - I guess it's because of the new version of mongoose
                    return {...event._doc, _id: event.id};
                })
                .catch((err) => {
                console.log(err);
            })
        }
    },
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

