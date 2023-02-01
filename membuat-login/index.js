const express = require('express')
const app = express()
const passport = require('passport')
const { Strategy } = require('passport-google-oauth2')
const expresssesion = require('express-session')

app.use(expresssesion({resave: false, saveUninitialized: true, secret: "Rafli"})) 
app.use(passport.initialize())
app.use(passport.session())

passport.use(new Strategy(
    {
        clientID: "83608173625-pv0dki1vks977md5mna3057e6qhgehnc.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8000/api/v1/auth/google"
    },
    (request, accesToken, refreshToken, profile, done) => {
        return done(null, profile)
    },
    passport.serializeUser ((user, done) => {
        done(null, user)
    }),
    passport.deserializeUser((user, done) => {
        done(null, user)
    })
))

app.get("/api/v1/auth/google", passport.authenticate("google", {
    scope: ["email", "profile"],
    successRedirect: "/api/v1/auth/protected",
    failureRedirect: "/api/v1/auth/fail"
}))

app.get("/api/v1/auth/protected", (req, res) => {
    return res.send(`<img src='${req.user.picture}'><h1>${req.user.displayName}</h1>`)
    // console.log(req.user)
})

app.get("/", (req, res) =>  {
    return res.send("<a href='/api/v1/auth/google'>Login</a>")
})

app.listen(8000, () => {
    console.log("server running on port 8000")
})