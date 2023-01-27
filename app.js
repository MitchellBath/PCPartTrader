//require our modules
const express = require('express');
const morgan = require('morgan');
const methodOverride  = require('method-override');
const tradeRoutes = require('./routes/tradeRoutes');
const userRoutes = require('./routes/userRoutes')
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

// create app
const app = express();

// config app
let port = 3000;
let host = 'localhost';
app.set('view engine', 'ejs');

// connect to trade database
mongoose.connect('mongodb://localhost:27017/pctradedb', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    app.listen(port, host, ()=> {
        console.log('Server us running in port', port)
    });
})
.catch(err=>console.log(err.message));

// mount middleware
app.use(
    session({
        secret: "adyy6md8zs4edfg984cytvgy8g6",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/pctradedb'}),
        cookie: {maxAge: 60*60*1000}
        })
);
app.use(flash());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.errorMessages = req.flash('error');
    res.locals.successMessages = req.flash('success');
    next();
});

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

// set up routes
app.get('/', (req, res)=>{
    res.render('index')
});

app.use('/trades', tradeRoutes);

app.use('/users', userRoutes);

app.use ((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
})

app.use((err, req, res, next)=> {
    console.log(err);
    if (!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error")
    }

    res.status(err.status);
    res.render('error', {error: err});
});

// start server
// app.listen(port, host, ()=> {
//     console.log('Server us running in port', port)
// })