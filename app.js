const express = require('express'); 
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const spotRoutes = require('./routes/spots');
const reviewRoutes = require('./routes/reviews');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/date-spot');//mongodb://127.0.0.1:27017/

const db = mongoose.connection;
db.on('error', (err) => {
    console.log(`Database error: ${err}`);
});
db.once('open', () => {
    console.log('Connected to the MongoDB database.')
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: '81a84CDB72cd4ebea390cd4cc03d0dcc',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60* 24 * 14
    }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/spots', spotRoutes);
app.use('/spots/:id/reviews', reviewRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3003, (err)=>{ 
  if (err) console.log(err);
  console.log("Server listening on PORT 3003");
});