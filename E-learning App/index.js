const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const logger = require('morgan');
const colors = require('colors')
const path = require('path')
const connectDB = require('./config/db');
const app = express();
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require('connect-flash');
//Import custom Middlewhere
const flashConfig = require('./middlewares/flashConfig');
const strategy = require('./middlewares/strategy');
// Import Routes files
const tutorialRoutes = require('./routes/tutorial')
const authRoutes = require('./routes/auth')


// Environment variables 
dotenv.config({path:"./config/config.env"});

// Configure the server PORT 
 const port = process.env.PORT || 5000;

//Connect to DB
    connectDB();

//Template Engine 
app.engine('hbs', handlebars({
  extname: '.hbs', 
  partialsDir: path.join(__dirname, 'views', 'partials'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}))

app.set('view engine', 'hbs')

// setting up the session storage in DB
const store = new MongoDBStore({
	uri: process.env.MONGO_URL,
	collection: "sessions",
	expires: 1000 * 60*60 , //
});



app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
    saveUninitialized: false,
    //store: store
	})
);

app.use(flash())

app.use(flashConfig)
app.use(strategy)


//Middlewears 
app.use(express.static('static'));
app.use(bodyParser.urlencoded({ extended: false }))

//Setup the logger 
if (process.env.NODE_ENV === 'development') { 
  app.use(logger('dev'))
}

// load the routes
app.use(tutorialRoutes)
app.use(authRoutes);

//load page not found
app.use((req, res) => { 
  res.render('404.hbs')
})


 const server = app.listen(port, console.log(`Server running at: `+`http://localhost:${process.env.PORT}`.blue.underline))

//Handle the unhandled promise rejections
process.on('unhandledRejection', (err, promise) => { 
  console.log(`Error:${err.message}`.red);
  server.close(() => { 
    console.log(`Server has been stopped...`.red.underline);
    process.exit(1)
  })
})