const Joi = require("joi");

const listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        price : Joi.number().required().min(1),
        location : Joi.string().required(),
        country : Joi.string().required(),
        image : Joi.object().allow("",{}),
    }).required()
});

module.exports.listingSchema = listingSchema ;

module.exports.reviewSchema = Joi.object({
    review : Joi.object({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required(),
    }).required(),
})