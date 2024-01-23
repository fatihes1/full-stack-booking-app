const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingResolver = require('./booking');

const RootResolver = {
    ...authResolver,
    ...eventsResolver,
    ...bookingResolver
};

module.exports = RootResolver;