const User = require("../../models/user");
const Event = require("../../models/event");
const {dateToString} = require("../../helpers/date");

const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event._doc._id.toString(), // or event.id
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}


// This user function is used to populate the creator property of the event
// The mongoose populate make an infinite loop, so we need to create this function to avoid it
// We can use then/catch or async/await
// I will use async/await for user function
const user = (userId) => {
    return User.findById(userId).then((user) => {
        return {...user._doc, _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents)};
    }).catch((err) => {
        throw err;
    })
}

// We keep both of them for reference

// We can use then/catch or async/await
// I will use async/await for events function
const events = async (eventIds) => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        return events.map(event => {
            return transformEvent(event);
        });
    }catch (e) {
        throw e;
    }
}

const singleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (e) {
        throw e;
    }
}

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;