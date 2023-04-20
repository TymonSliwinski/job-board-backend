import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import prisma from "./prismaClient.js";
import dotenv from 'dotenv';

dotenv.config({path: './.env'});

export default (passport) => {
    passport.serializeUser((user, done) => {
        process.nextTick(function() {
            done(null, {
                id: user.id,
                name: user.name,
                email: user.email
            });
        });
    });

    passport.deserializeUser((user, done) => {
        process.nextTick(function() {
            return done(null, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email'
    }, 
        (email, password, done) => {
            prisma.user.findFirst({
                where: {
                    email: email
                }
            }).then(async user => {
                if (!user) {
                    return done(null, false, { message: 'User with given email not found' });
                }
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err;
                    }
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Invalid password' })
                    }
                })
            }).catch(err => {
                console.log(err);
                return done(err);
            })
        }
    ))

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URL,
        scope: [ 'profile' ],
    },
        (accessToken, refreshToken, profile, cb) => {6
            prisma.user.findFirst({
                where: {
                    email: profile.emails[0].value
                }
            }).then(user => {
                if (user) {
                    return cb(null, {
                        id: user.id,
                        email: user.email
                    });
                } else {
                    let firstName, lastName
                    try {
                        firstName = profile.displayName.split(' ')[0];
                        lastName = profile.displayName.split(' ')[1];
                    } catch (err) {
                        firstName = null;
                        lastName = null;
                    }
                    prisma.user.create({
                        data: {
                            email: profile.emails[0].value,
                            origin: 'google',
                            avatar: profile.photos[0].value,
                            firstName: firstName,
                            lastName: lastName
                        }
                    }).then(user => {
                        return cb(null, {
                            id: user.id,
                            email: user.email
                        });
                    }).catch(err => {
                        console.log('err: ', err);
                        return cb(err);
                    });
                }
            }).catch(err => {
                console.log('err: ', err);
                return cb(err);
            });
        }
    ));
};
