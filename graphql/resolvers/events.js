const Event = require("../../models/event");
const User = require("../../models/user");
const {dateToString} = require("../../helpers/date");
const { user } = require("./common");

const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event._doc._id.toString(), // or events.id
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}

module.exports = {
    events: () => {
        return Event.find()
            .then((events) => {
                return events.map(event => {
                    // String casting is not necessary anymore - I guess it's because of the new version of mongoose
                    // Also, the creator property is an object, so we need to convert it to a string - we do not need to do that anymore
                    // Because of the mongoose version
                    // Anyway, I will leave it here for reference
                    return transformEvent(event);
                    // We made a function to transform the events
                })
            }).catch((err) => {
                throw err;
            })
    },
    createEvent: (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        const { eventInput } = args;
        const event = new Event({
            title: eventInput.title,
            description: eventInput.description,
            price: +eventInput.price,
            date: new Date(eventInput.date),
            creator: req.userId
        });
        let createdEvent;
        return event
            .save()
            .then((event) => {
                createdEvent = transformEvent(event);
                return User.findById(req.userId);
                // String casting is not necessary anymore - I guess it's because of the new version of mongoose
            })
            .then((creator) => {
                if (!creator) {
                    throw new Error('User not found.');
                }
                creator.createdEvents.push(event);
                return creator.save();
            }).then((result) => {
                return createdEvent;
            })
            .catch((err) => {
                throw err;
            })
    },
}