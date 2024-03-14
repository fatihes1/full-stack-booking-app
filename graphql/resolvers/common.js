const User = require("../../models/user");
const Event = require("../../models/event");
const {dateToString} = require("../../helpers/date");
const DataLoader = require('dataloader');

const eventLoader = new DataLoader((eventIds) => {
    return events(eventIds);
})

const userLoader = new DataLoader((userIds) => {
    return User.find({_id: {$in: userIds}});
});

const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event._doc._id.toString(), // or events.id
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}


// This user function is used to populate the creator property of the events
// The mongoose populate make an infinite loop, so we need to create this function to avoid it
// We can use then/catch or async/await
// I will use async/await for user function
const userOld = (userId) => {
    return User.findById(userId).then((user) => {
        return {...user._doc, _id: user.id, createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)};
    }).catch((err) => {
        throw err;
    })
}

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString())
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: () => eventLoader.loadMany(user._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    }
};

// We keep both of them for reference

// We can use then/catch or async/await
// I will use async/await for events function
const events = async (eventIds) => {
    try {
        const events = await Event.find({_id: {$in: eventIds}})
        events.sort((a, b) => {
            return eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
        }); // This is to keep the order of the events
        return events.map(event => {
            return transformEvent(event);
        });
    }catch (e) {
        throw e;
    }
}

const singleEvent = async (eventId) => {
    try {
        return await eventLoader.load(eventId.toString());
    } catch (e) {
        throw e;
    }
}

exports.user = user;
exports.events = events;
exports.singleEvent = singleEvent;
exports.eventLoader = eventLoader;