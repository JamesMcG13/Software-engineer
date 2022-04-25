if(process.env.NODE_ENV!== 'production'){
  require('dotenv').config()
}

const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const initializePassport = require('./passport')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id),
)

// user array
const users = []
const currentUser=null

app.use(express.static(__dirname + '/Views'));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';

app.set('view-engine', 'ejs')
app.use(flash())
app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/login',checkNotAuthenticated, (req,res) => {
  res.render('login.ejs')
});

app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', (req,res) => {
  res.render('register.ejs')
});

app.post('/register',checkNotAuthenticated, async (req, res) => {
  try {
    
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    users.push({
      id: Date.now().toString(),
      email: req.body.email,
      fname: req.body.fname,
      lname: req.body.lname,
      dob: req.body.dob,
      password: hashedPassword
    })
    
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  console.log(users)
})

app.get('/',checkAuthenticated, (req,res) => {
      res.render('index.ejs',{name: req.user.fname})
});





//get user array, needs to be in login page
app.get('/users', (req, res) => {
    res.json(users)
})

//add to user array, needs to be in register.js



app.post('/users', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      const user = { email: req.body.email, password: hashedPassword }
      users.push(user)
      res.status(201).send()
    } catch {
      res.status(500).send()
    }
  })

app.post('/users/login', async (req, res) => {
    const user = users[0]//.find(user => user.email === req.body.email)
    if (user == null) {
      return res.status(400).send('Cannot find user')
    }
    console.log(user.email)
    console.log(user.password)
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
        res.send('Success')
        } else {
        res.send('Not Allowed')
        }
    } catch {
      res.status(500).send()
    }
    
  })

  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
  })

  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }


//writes to console to indicate the server is running
app.listen(3000, () => {
    console.log('Server is running on port: ', 3000);
});

//dom favicon
app.use('/favicon.ico', express.static('images/favicon2.ico'));



//Added by felix

//About page route
app.get('/about', (req, res) => {
  res.render('about.ejs');
 });

//Help page route
app.get('/help', (req, res) => {
  res.render('help.ejs');
 });

//social media picture routes
app.use('/facebook.png', express.static('images/facebook.png'));
app.use('/twitter.png', express.static('images/twitter.png'));
app.use('/instagram.png', express.static('images/instagram.png'));

app.get('/calendar', (req, res) => {
  res.render('calendar.ejs');
 });

 app.get('/fileupload', (req, res) => {
  res.render('fileupload.ejs');
 });

 app.get('/uploadedPage', (req, res) => {
  res.render('uploadedpage.ejs');
 });

 //FELIX CALENDAR
 