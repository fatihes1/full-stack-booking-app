const Event = require("../../models/event");
const User = require("../../models/user");
const bcrypt = require("bcryptjs");

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
            return {
                ...event._doc,
                _id: event._doc._id.toString(), // or event.id
                date: new Date(event._doc.date).toISOString(),
                creator: user.bind(this, event.creator)
            };
        });
    }catch (e) {
        throw e;
    }
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
                    return {...event._doc,
                        _id: event._doc._id.toString(),
                        date: new Date(event._doc.date).toISOString(),
                        creator: user.bind(this, event._doc.creator)
                    };
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
            date: new Date(eventInput.date),
            creator: '65a80ea2a2716f2bf7e402f6'
        });
        let createdEvent;
        return event
            .save()
            .then((event) => {
                createdEvent = {...event._doc,
                    _id: event._doc._id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event.creator)};
                return User.findById('65a80ea2a2716f2bf7e402f6');
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
    createUser: args => {
        const { userInput } = args;
        // Check if user exists with the same email
        return User.findOne({email: userInput.email}).then((user) => {
            if (user) {
                throw new Error('User exists already.');
            }
            return bcrypt.hash(userInput.password, 12)
        }).then((hashedPassword) => {
            const user = new User({
                email: userInput.email,
                password: hashedPassword
            });
            return user.save()
        }).then((user) => {
            // String casting is not necessary anymore - I guess it's because of the new version of mongoose
            return {...user._doc, password: null, _id: user.id};
        })
            .catch((err) => {
                throw err;
            })


    }
}