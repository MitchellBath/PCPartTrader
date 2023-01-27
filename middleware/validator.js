const {body} = require('express-validator')
const {validationResult} = require('express-validator')

// validate ID
exports.validateId = (req, res, next) => {
    //an objectId is a 24-bit Hex string
    if(!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid trade id');
        err.status = 400;
        return next(err);
    } else {
       return next();
    }
}

exports.validateSignUp = [body('firstName', 'First name cannot be empty.').notEmpty().trim().escape(),
body('lastName', 'Last name can not be empty.').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=> {
            req.flash('error', error.msg)
        })
        return res.redirect('back')
    } else {
        return next()
    }
}

exports.validateTrade = [body('title', 'Title cannot be empty').trim().escape(),
body('description', 'Description must be a minimum of 10 characters').isLength({min: 10}).trim().escape()];