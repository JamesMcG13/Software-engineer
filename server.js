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
  modules : []
}]

//
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
  user = req.user
  
  upcoming_deadlines = []
  past_deadlines = []
 

  modules = user.modules[0]

  for(e in modules){
    
    for(c in modules[e].coursework){
      
      
      cw_name = modules[e].coursework[c].name
      cw_end = modules[e].coursework[c].end
      
      cw_date = new Date(cw_end)

      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;
      current_date = new Date(dateTime)
      
      //if statement to check date
      if(cw_date>current_date){
        upcoming_deadlines.push({
        name : cw_name,
        end : cw_end
      })
      }else{
        past_deadlines.push({
          name : cw_name,
          end : cw_end
        })
      }
      
    }
    
  }
  console.log(upcoming_deadlines)
  
  res.render('index.ejs',{deadlines: upcoming_deadlines, past_deadlines: past_deadlines})
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
      name : req.body.moduleName1,
      code : req.body.moduleCode1,  
      year : req.body.moduleStart1,
      semester : req.body.moduleEnd1,
      coursework : [
        {
          name : req.body.coursework1Name1,
          type : req.body.coursework1Type1,
          weighting: req.body.coursework1Weighting1,
          start: req.body.coursework1Start1,
          end : req.body.coursework1End1
        },
        {
          name : req.body.coursework1Name2,
          type : req.body.coursework1Type2,
          weighting: req.body.coursework1Weighting2,
          start: req.body.coursework1Start2,
          end : req.body.coursework1End2
        },
        {
          name : req.body.coursework1Name3,
          type : req.body.coursework1Type3,
          weighting: req.body.coursework1Weighting3,
          start: req.body.coursework1Start3,
          end : req.body.coursework1End3
        }
      ]
    },
    {
      name : req.body.moduleName2,
      code : req.body.moduleCode2,  
      year : req.body.moduleStart2,
      semester : req.body.moduleEnd2,
      coursework : [
        {
          name : req.body.coursework2Name1,
          type : req.body.coursework2Type1,
          weighting: req.body.coursework2Weighting1,
          start: req.body.coursework2Start1,
          end : req.body.coursework2End1
        },
        {
          name : req.body.coursework2Name2,
          type : req.body.coursework2Type2,
          weighting: req.body.coursework2Weighting2,
          start: req.body.coursework2Start2,
          end : req.body.coursework2End2
        },
        {
          name : req.body.coursework2Name3,
          type : req.body.coursework2Type3,
          weighting: req.body.coursework2Weighting3,
          start: req.body.coursework2Start3,
          end : req.body.coursework2End3
        }
    ]
    },
        {
        name : req.body.moduleName3,
        code : req.body.moduleCode3,  
        year : req.body.moduleStart3,
        semester : req.body.moduleEnd3,
          coursework : [
            {
              name : req.body.coursework3Name1,
              type : req.body.coursework3Type1,
              weighting: req.body.coursework3Weighting1,
              start: req.body.coursework3Start1,
              end : req.body.coursework3End1
            },
            {
              name : req.body.coursework3Name2,
              type : req.body.coursework3Type2,
              weighting: req.body.coursework3Weighting2,
              start: req.body.coursework3Start2,
              end : req.body.coursework3End2
            },
            {
              name : req.body.coursework3Name3,
              type : req.body.coursework3Type3,
              weighting: req.body.coursework3Weighting3,
              start: req.body.coursework3Start3,
              end : req.body.coursework3End3
            }
        ]
        
  })
  console.log("---------obj.table[0]: ")
    console.log(obj.table[0])
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
  
  const modules = parsedFile.table
  console.log("-----module-----")
  console.log(modules[0])

  const user = req.user
  user.modules.push(modules) //nested arrays needs fixing
  
  res.render('uploadedpage.ejs',{modules: modules});
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



