if(process.env.NODE_ENV!== 'production'){
  require('dotenv').config()
}

const fs = require("fs");

const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const initializePassport = require('./passport');
const { json } = require('express/lib/response');
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id),
)

// user array
const users = [{
  id: '1651073914779',
  email: '1',
  fname: '',
  lname: '',
  dob: '',
  password: '$2b$10$yvfs1CMFPJ.Izs4u/KMgd.2H.2I8bYTsxasm2R7oj03fmL7NB6YNi',
  events: [],
  modules: []
}]
modules = []
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
      password: hashedPassword,
      events: [],
      modules: []
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
app.get('/module_creator',checkAuthenticated, (req,res) => {
  res.render('module_creator.ejs')
});
app.post('/module_creator',checkAuthenticated, async (req, res) => {
  try {
    
   
   
    
    console.log("1")
    var obj = {
      table: []
    };

   obj.table.push({
    name : req.body.moduleName,
    code : req.body.moduleCode,  
    start : req.body.moduleStart,
    end : req.body.moduleEnd,
    coursework : [
      {
        name : req.body.courseworkName1,
        type : req.body.courseworkType1,
        start: req.body.courseworkStart1,
        end : req.body.courseworkEnd1
      }, 
      {
        name : req.body.courseworkName2,
        type : req.body.courseworkType2,
        start: req.body.courseworkStart2,
        end : req.body.courseworkEnd2 
      },
      {
        name : req.body.courseworkName3,
        type : req.body.courseworkType3,
        start: req.body.courseworkStart3,
        end : req.body.courseworkEnd3 
      }
    ]
   })
   

    console.log("2")
    var fs = require('fs');
    console.log("3")
    console.log(JSON.stringify(obj))
    fs.writeFile('module.json', JSON.stringify(obj), error => console.error)
   
    
    


    //res.redirect('/module_creator')
  } catch {
    res.redirect('/')
  }
  res.redirect('download')
})


app.get('/download', (req, res) => {
  res.download('module.json')
})


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

 app.get('/fileupload',checkAuthenticated, (req, res) => {
  res.render('fileupload.ejs');
 });

 app.post('/uploadModule', checkAuthenticated, (req, res) => {
  fileData = req.body.uploadedFile
  
  const jsonString = fs.readFileSync(fileData);
  const parsedFile = JSON.parse(jsonString);
  const module = parsedFile.table[0]
  
  console.log(module)

  const user = req.user
  user.modules.push(module)
  
  res.render('uploadedpage.ejs',{module: module});
 });

 //FELIX CALENDAR



 app.post('/saveEvent',checkAuthenticated, async (req, res) => {
  const user = req.user
  
  try {
    user.events.push({
      eventDate : true,
      Title: req.body.eventTitle,
      Start: req.body.eventStart,
      End: req.body.eventEnd
    })
    
    res.redirect('/calendar')
  } catch {
    console.log('Exception')
    res.redirect('/')
  }
  console.log(user.events)
})



