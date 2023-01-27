const {validationResult} = require('express-validator')
const model = require('../models/user');
const Trade = require('../models/trade')

exports.new = (req, res) => {
    return res.render('./user/new');
};

exports.create = (req, res, next) => {
    //res.send('Created a new trade');
    let user = new model(req.body);//create a new trade document
    user.save()//insert the document to the database
        .then(user => res.redirect('/users/login'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email has been used');
                return res.redirect('/users/new');
            }

            next(err);
        });

};

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
        .then(user => {
            if (!user) {
                console.log('wrong email address');
                req.flash('error', 'wrong email address');
                res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/users/profile');
                        } else {
                            req.flash('error', 'wrong password');
                            res.redirect('/users/login');
                        }
                    });
            }
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Trade.find({ author: id })])
        .then(results => {
            const [user, trades] = results

            Trade.find().then(alldocs => {
                res.render('./user/profile', { user, trades, alldocs })
            }).catch(err => next(err))
        })
        .catch(err => next(err));
};

// adds an item to the user's watchlist
exports.watchlist = (req, res, next) => {
    let itemid = req.body.id;
    let user = req.session.user;

    model.findById(user).then(userobject => {
        userslist = userobject.watching
        userslist = userslist.concat(itemid, ";")
        console.log("id" + itemid)
        newbody = {
            'firstName': userobject.firstName,
            'lastName': userobject.lastName,
            'email': userobject.email,
            'password': userobject.password,
            'watching': userslist
        }
        model.findByIdAndUpdate(user, newbody, { useFindAndModify: false, runValidators: true }).then(dudg => {
            return res.redirect('/users/profile')
        }).catch(err => next(err))
    }).catch(err => next(err))
}


exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    });

};


