const express = require('express'); 
const router = express.Router();

const DateSpot = require('../models/dateSpot');

const { spotSchema } = require('../schemas.js');

const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateDateSpot = (req, res, next) => {
    const { error } = spotSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async(req, res)=>{
    const spots = await DateSpot.find({});
    res.render('spots/index',{ spots });
}))

router.get('/new', (req, res)=>{
    res.render('spots/new');
})

router.post('/', validateDateSpot, catchAsync(async(req, res)=>{
    const spot = new DateSpot(req.body.spot);
    await spot.save();
    req.flash('success', 'A new spot is made!');
    res.redirect(`/spots/${spot._id}`);
}))

router.get('/:id', catchAsync(async(req, res)=>{
    const spot = await DateSpot.findById(req.params.id).populate('reviews');
    if(!spot){
        req.flash('error', 'Cannot find this one!');
        return res.redirect('/spots');
    }
    res.render('spots/show', { spot });
}))

router.get(':id/edit', catchAsync(async (req, res) => {
    const spot = await DateSpot.findById(req.params.id);
    if(!spot){
        req.flash('error', 'Cannotfind this one!');
        return res.redirect('/spots');
    }
    res.render('spots/edit', { spot });
}))

router.put('/:id', validateDateSpot, catchAsync(async (req, res) => {
    const { id } = req.params;
    const spot = await DateSpot.findByIdAndUpdate(id, { ...req.body.spot });
    req.flash('success', 'A spot is updated!');
    res.redirect(`/spots/${spot._id}`)
}));

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await DateSpot.findByIdAndDelete(id);
    req.flash('success', 'Spot is deleted!');
    res.redirect('/spots');
})

module.exports = router;