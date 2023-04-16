const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const DateSpot = require('../models/dateSpot');

mongoose.connect('mongodb://localhost:27017/date-spot');

const db = mongoose.connection;
db.on('error', (err) => {
    console.log(`Database error: ${err}`);
});
db.once('open', () => {
    console.log('Connected to the MongoDB database.')
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await DateSpot.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const spot = new DateSpot({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:'https://source.unsplash.com/collection/9822900/',
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            price
        })
        await spot.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})