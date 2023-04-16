const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

router.get('/register', (req, res) => {
    res.render('auth/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try{
        const { email, username, password } = req.body;
        const user = new User({email, username});
        const authUser = await User.register(user, password);
        req.flash('success','Welcome to DateSpot!');
        res.redirect('/spots');
    } catch(err){
        req.flash('error', err.message);
        res.redirect('register');
    }      
}))

router.get('/login', (req, res) => {
    res.render('auth/login');
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true, failureMessage: true }), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/spots');
})

module.exports = router;