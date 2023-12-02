const mongoose = require('mongoose');
const request = require("request");
const { apiOptions, formatDistance, renderHomepage } = require("../../app_server/controllers/locations");

const openingTimeSchema = new mongoose.Schema({
    days: {
        type: String,
        required: true
    },

    opening: String,
    closing: String,
    closed: {
        type: Boolean,
        required: true
    }
});

const reviewSchema = new mongoose.Schema({
    author : {
        type: String,
        required : true
    },
    rating: {
        type : Number,
        required: true,
        min: 0,
        max: 5
    },
    reviewText: {
        type: String,
        required:  true
    },
    createdOn: {
        type : Date,
        'default':Date.now
    }
});

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: String,
    rating: {
        type: Number,
        'default': 0,
        min: 0,
        max: 5
    },
    facilities: [String],
    coords: {
        type: {type: String},
        coordinates: [Number]
    },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});

locationSchema.index({ coords: '2dsphere' });

mongoose.model('Location', locationSchema);
const homelist = (req, res) => {
    const path = '/api/locations';
    const requestOptions = {
        url: `${apiOptions.server}${path}`,
        method: 'GET',
        json: {},
        qs: {
            lng: 127.2651868551812,
            lat: 37.01131682481555,
            maxDistance: 200000
        }
    };
    request(
        requestOptions,
        (err, { statusCode }, body) => {
            let data = [];
            if (statusCode === 200 & body.length) {
                data = body.map((item) => {
                    item.distance = formatDistance(item.distance);
                    return item;
                });
            };
            renderHomepage(req, res, body);
        }
    );

    /*
    res.render('locations-list',
        {
            title: 'Loc8r - find a place to work with wifi',
            pageHeader: {
                title: 'Loc8r',
                strapLine: 'Find places to work with wifi near you!'
            },
            sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
            locations: [
                {
                    name: 'Starcups',
                    address: '125 High Street, Reading, RG6 1PS',
                    rating: 3,
                    facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                    distance: '100m'
                },
                {
                    name: 'Cafe Hero',
                    address: '125 High Street, Reading, RG6 1PS',
                    rating: 4,
                    facilities: ['Hot drinks', 'Food', 'Premium wifi'],
                    distance: '200m'
                },
                {
                    name: 'Burger Queen',
                    address: '125 High Street, Reading, RG6 1PS',
                    rating: 2,
                    facilities: ['Food', 'Premium wifi'],
                    distance: '250m'
                }
            ]
        }
    );
    */
};

