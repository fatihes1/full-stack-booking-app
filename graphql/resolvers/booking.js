const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { dateToString } = require("../../helpers/date");
const { singleEvent, user } = require("./common");


const transformEvent = (event) => {
    return {
        ...event._doc,
        _id: event._doc._id.toString(), // or event.id
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    };
}

const transformBooking = (booking) => {
    return {
        ...booking._doc,
        _id: booking._doc._id.toString(), // Also, we do not need to convert it to a string anymore, we can use result.id instead
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt),
    }
}

module.exports = {
    bookings: async () => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (e) {
            throw e;
        }
    },
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        const { eventId } = args;
        const fetchedEvent = await Event.findOne({_id: eventId});
        const booking = new Booking({
            user: '65a80ea2a2716f2bf7e402f6',
            event: fetchedEvent
        });
        const result = await booking.save();
        return transformBooking(result);
    },
    cancelBooking: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        const {bookingId} = args;
        try {
            const booking = await Booking.findById(bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({_id: bookingId});
            return event;
        } catch (e) {
            throw e;
        }
    }
}