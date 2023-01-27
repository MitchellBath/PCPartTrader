// GET /trades: send all trades to the user
const model = require('../models/trade');
const userModel = require('../models/user');

exports.index = (req, res, next) => {
    //res.send('send all trades');
    //res.send(model.find());
    model.find()
        .then(trades => res.render('./trade/index', { trades }))
        .catch(err => next(err));

};

// GET /trades/new: send html form for creating a new trade
exports.new = (req, res) => {
    //res.send('send the new form');
    res.render('./trade/new');
};

// POST /trades: create a new trade
exports.create = (req, res, next) => {
    //res.send('Created a new trade');
    //console.log(req.body);
    // let trade = req.body;
    // model.save(trade);
    // res.redirect('/trades');
    let trade = new model(req.body);
    trade.author = req.session.user;
    trade.save()
        .then(trade => {
            req.flash('success', "Trade has been created successfully")
            res.redirect('/trades')
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message)
                return res.redirect('/back')
            }
            next(err);
        });
};

// GET /trades/:id: send details of trade identified by id
exports.show = (req, res, next) => {
    let id = req.params.id;
    let user = req.session.user;
    model.findById(id).populate('author', 'firstName lastName')
        .then(trade => {
            if (trade) {
                if (trade.offerFrom) {model.findById(trade.offerFrom).then(displayOffer => {
                    dispname = displayOffer.name
                    return res.render('./trade/show', { trade, user, dispname })
                }).catch(err => next(err))}
                else {
                    return res.render('./trade/show', { trade, user })
                }
            } else {
                let err = new Error('Cannot find a trade with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
};

// GET /trades/:id/edit: send html form for editing existing trade
exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
        .then(trade => {
            if (trade) {
                return res.render('./trade/edit', { trade });
            }
        })
        .catch(err => next(err));
};

// GET /trades/:id/offer: send html form for offering a trade
exports.offer = (req, res, next) => {
    let id = req.session.user;
    let originalid = req.params.id;
    Promise.all([userModel.findById(id), model.find({ author: id }), model.findById(originalid)])
        .then(results => {
            const [user, trades, original] = results
            if (trades) {
                return res.render('./trade/offer', { trades, original });
            } else {
                let err = new Error('Cannot find a trade to offer with id ' + id);
                err.status = 401;
                next(err);
            }
        })
        .catch(err => next(err));
};

// PUT /trades/:id: update the trade identified by id
exports.update = (req, res, next) => {
    let trade = req.body;
    let id = req.params.id;
    let user = req.session.user;

    // takesies backsies
    if (req.body.offerFrom == "Takeback") {
        console.log("Trade takeback")
        model.findById(req.body.offerForItem).then(other => {
            newbody = {
                'name': other.name,
                'category': other.category,
                'description': other.description,
                'status': "Available",
                'offerFrom': null,
                'offerForItem': null
            }
            model.findByIdAndUpdate(other, newbody, { useFindAndModify: false, runValidators: true }).then(trade => {
                // update original now
                newbody = {
                    'name': id.name,
                    'category': id.category,
                    'description': id.description,
                    'status': "Available",
                    'offerFrom': null,
                    'offerForItem': null
                }
                model.findByIdAndUpdate(id, newbody, { useFindAndModify: false, runValidators: true }).then(done=>{
                    if(done) return res.redirect('/trades/' + id)
                    else {
                        let err = new Error('Cannot find a trade with id ' + id);
                        err.status = 404;
                        next(err);
                    }
                }).catch(err => next(err))
            }).catch(err => next(err))
        }).catch(err => next(err))
    }

    // Accepted trade
    if (req.body.offerForItem == "Accept") {
        console.log("Trade Accepted")
        model.findById(req.body.offerFrom).then(other => {
            newbody = {
                'name': other.name,
                'category': other.category,
                'description': other.description,
                'author': user,
                'status': "Available",
                'offerFrom': null,
                'offerForItem': null
            }
            otherauthor = other.author
            console.log(otherauthor)
            model.findByIdAndUpdate(other, newbody, { useFindAndModify: false, runValidators: true }).then(trade => {
                // update original now
                newbody = {
                    'name': id.name,
                    'category': id.category,
                    'description': id.description,
                    'status': "Available",
                    'author': otherauthor,
                    'offerFrom': null,
                    'offerForItem': null
                }
                model.findByIdAndUpdate(id, newbody, { useFindAndModify: false, runValidators: true }).then(done=>{
                    if(done) return res.redirect('/trades/' + id)
                    else {
                        let err = new Error('Cannot find a trade with id ' + id);
                        err.status = 404;
                        next(err);
                    }
                }).catch(err => next(err))
            }).catch(err => next(err))
        }).catch(err => next(err))
    }

    // Declined trade
    if (req.body.offerForItem == "Decline") {
        console.log("Trade declined")
        model.findById(req.body.offerFrom).then(other => {
            newbody = {
                'name': other.name,
                'category': other.category,
                'description': other.description,
                'status': "Available",
                'offerFrom': null,
                'offerForItem': null
            }
            model.findByIdAndUpdate(other, newbody, { useFindAndModify: false, runValidators: true }).then(trade => {
                // update original now
                newbody = {
                    'name': id.name,
                    'category': id.category,
                    'description': id.description,
                    'status': "Available",
                    'offerFrom': null,
                    'offerForItem': null
                }
                model.findByIdAndUpdate(id, newbody, { useFindAndModify: false, runValidators: true }).then(done=>{
                    if(done) return res.redirect('/trades/' + id)
                    else {
                        let err = new Error('Cannot find a trade with id ' + id);
                        err.status = 404;
                        next(err);
                    }
                }).catch(err => next(err))
            }).catch(err => next(err))
        }).catch(err => next(err))
    }

    // if this is an offer update, also update the item offered on to be unavailable
    if (req.body.offerForItem && req.body.offerForItem != "Accept" && req.body.offerForItem != "Decline"  && req.body.offerFrom != "Takeback") {
        console.log("Offer detected")
        // update target item
        model.findById(req.body.offerForItem).then(original => {
            newbody = {
                'name': original.name,
                'category': original.category,
                'description': original.description,
                'status': "Unavailable",
                'offerFrom': id
            };
            model.findByIdAndUpdate(req.body.offerForItem, newbody, { useFindAndModify: false, runValidators: true }).then(updatedoriginal => {
                console.log(updatedoriginal)

                // trade includes unavailable and offerForItem ID from the offer page form, no need to build new body
                model.findByIdAndUpdate(id, trade, { useFindAndModify: false, runValidators: true })
                    .then(trade => {
                        if (trade) {
                            return res.redirect('/trades/' + id);
                        }
                        else {
                            let err = new Error('Cannot find a trade with id ' + id);
                            err.status = 404;
                            next(err);
                        }
                    })
                    //findbyidandupdate1
                    .catch(err => {
                        if (err.name === 'ValidationError')
                            req.flash('error', err.message)
                        return res.redirect('/trades')
                    })
            }
                //findbyidandupdate2
            ).catch(err => {
                if (err.name === 'ValidationError')
                    req.flash('error', err.message)
                return res.redirect('/trades')
            })

            //findbyid
        }).catch(err => {
            if (err.name === 'ValidationError')
                req.flash('error', err.message)
            return res.redirect('/trades')
        })
    // normal update
    } else if (req.body.offerForItem != "Accept"  && req.body.offerForItem != "Decline" && req.body.offerFrom != "Takeback"){
        console.log("Not an offer")
        model.findByIdAndUpdate(id, trade, { useFindAndModify: false, runValidators: true })
            .then(trade => {
                if (trade) {
                    return res.redirect('/trades/' + id);
                }
                else {
                    let err = new Error('Cannot find a trade with id ' + id);
                    err.status = 404;
                    next(err);
                }
            })
            .catch(err => {
                if (err.name === 'ValidationError')
                    req.flash('error', err.message)
                return res.redirect('/trades')
            })
    }



};

// DELETE /trades/:id, delete the trade identified by id
exports.delete = (req, res, next) => {
    let id = req.params.id;

    model.findByIdAndDelete(id, { useFindAndModify: false })
        .then(trade => {
            if (trade) {
                res.redirect('/trades');
            } else {
                let err = new Error('Cannot find a trade with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next(err));
    // //res.send('delete trade with id ' + req.params.id);
    // let id = req.params.id;
    // if (model.deleteById(id)) res.redirect('/trades');
    // else {
    //     let err = new Error('Cannot find a trade with ID ' + id)
    //     err.status = 404;
    //     next(err);
    // }
};