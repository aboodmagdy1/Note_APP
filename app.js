//3rd party modules
const express = require("express");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const connectDB = require("./server/config/database");
const methodOverride = require('method-override')


//3rd party modules for authentication
const session = require('express-session')
const passport = require('passport')
const MongoStore = require('connect-mongo')


//custom modules
const indexRouter = require("./server/routes/index");
const dashboardRouter = require("./server/routes/dashboard");
const authRouter = require("./server/routes/auth");

const app = express();
const port = process.env.PORT || 3000;

//is used to parse incoming requests with URL-encoded payloads. and make the data available on the req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'))

//static files
app.use(express.static("public"));

//template engine
app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");



//config a session to be used by passportjs
app.use(session({
  secret:'aboodmagdy123',
  resave:false,
  saveUninitialized:true,
  store:MongoStore.create({
    mongoUrl:process.env.DB_URI
  }),
  cookie:{maxAge :new Date(Date.now() +(6300000))}
}))


//auth init
app.use(passport.initialize()) // alternative of auth middleware
app.use(passport.session())

//Db 
connectDB();
//Routes
app.use('/',authRouter)
app.use("/", indexRouter);
app.use("/", dashboardRouter);

//404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
