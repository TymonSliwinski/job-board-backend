import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import authenticate from './authenticate.js';
import authRouter from './routes/auth.route.js';
import offersRouter from './routes/offers.route.js';
import companiesRouter from './routes/companies.route.js';
import applicationsRouter from './routes/applications.route.js';

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// middlewares
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(
    session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true },
    })
);

app.use(passport.initialize());
app.use(passport.session());
authenticate(passport);

// routers
app.use('/api/auth', authRouter);

app.use('/api/offers', offersRouter);

app.use('/api/companies', companiesRouter);

app.use('/api/applications', applicationsRouter)

app.get('/', (req, res) => {
    res.send({ message: 'root' });
});

app.get(
    '/oauth2/redirect/google',
    passport.authenticate('google', {
        successRedirect: '/',
        failureRedirect: '/login',
    }),
    (req, res) => {
        console.log('req: ', req);
        res.redirect('http://localhost:5000/');
    }
);

app.get('/*', (req, res) => {
    res.status(404).json({ message: 'Not found' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
