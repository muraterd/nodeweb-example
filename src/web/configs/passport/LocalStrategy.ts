import passport from 'passport'

// Local Strategy
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function (username: any, password: any, done: any) {
        return done(null, { id: '234ffdssd', email: 'stormwr@gmail.com' });
    }
));