const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
    }
}, { versionKey: false, timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);