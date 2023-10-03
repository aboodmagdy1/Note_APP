const express = require("express");
const passport = require("passport");
const User = require("../models/user");
const router = express.Router();

const GoogleStrategy = require("passport-google-oauth20").Strategy;

 
//1- The user clicks on the "Sign in with Google" button.
//1- Passport redirects the user to Google's authentication page.
//3- The user authenticates with Google and grants your app permission to access their profile information.
//4- Google redirects the user back to your app's callback URL.
//5- Passport receives the user's profile information from Google and checks if the user's Google ID exists in the database.
//6- If the user's Google ID exists in the database, then the user is logged in.
//7- If the user's Google ID does not exist in the database, then a new user account is created with the user's profile information from Google.
// 8-The user is logged in and redirected to the dashboard.
//configure passport with google strategy to make the user signup with email
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    }, //cb is a callback function excuted when authentication process is completed
    async function (accessToken, refreshToken, profile, done) {
      // authenticated user's profile data. || auth logic
      // 1)create user
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        fristName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };
      try {
        // 2) ckeck if user exist make him login
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          done(null, user);
        } else {
          // 3) create new user
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  )
);

// redirects the user to Google's authentication page. The scope option specifies which Google APIs the user should be authorized to access.
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//This route handles the callback from Google's authentication page. If the authentication was successful, the user is redirected to the /dashboard route. Otherwise, the user is redirected to the /login-failure route.
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

//route for login failure
router.get("/login-failure", (req, res) => {
  res.send(`<h2> some thing went wrong ....!</h2>`);
});



//destroy user session to logout 
router.get('/logout',(req,res) => {
  req.session.destroy(error=>{
    if(error){
      console.log(error);
      res.send('Error logging out')
    }else{
      res.redirect('/')
    }
  })
})




//two functions allow Passport to store and retrieve user data from the session.

//is used to format the user data before it is stored in the session
// s typically used to convert user data to a JSON object. This JSON object can then be stored in the session or sent over a network.
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//used to retrieve the user data from the session and return it to Passport.
//s typically used to convert user data from a JSON object to a user object. The user object can then be used to access the user's data in the database
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = router;
