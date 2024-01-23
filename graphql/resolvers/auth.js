const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");


module.exports = {
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
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({email: email});
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) {
            throw new Error('Password is incorrect!');
        }
        const token = await JWT.sign({
            userId: user.id,
            email: user.email
        }, 'somesupersecretkey', {
            expiresIn: '1h'
        });

        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        }
    }
}