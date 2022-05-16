if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

/* dependencies */
const fs = require("fs");

const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const expressSession = require('express-session');
const expressValidator = require('express-validator');
const { check, validationResult } = require('express-validator')
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const initializePassport = require('./passport');
const { json } = require('express/lib/response');

app.set('view-engine', 'ejs')

/* registering middleware */
app.use(express.static(__dirname + '/Views'));
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
app.use(flash())
app.use(session({
  secret: '1234',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// used to check user details
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id),
)

// user array with test data
const users = [{
  id: '1651073914779',
  email: '1',
  fname: '',
  lname: '',
  dob: '',
  password: '$2b$10$yvfs1CMFPJ.Izs4u/KMgd.2H.2I8bYTsxasm2R7oj03fmL7NB6YNi',
  events: [],
  modules: [[{ "name": "Software Engineering", "code": "5016", "coursework": [{ "name": "Report", "type": "COURSEWORK", "weighting": "45", "start": "2022-05-01", "end": "2022-05-10" }, { "name": "Demo", "weighting": "45", "start": "2022-05-10", "end": "2022-05-24" }, { "name": "Synoptic", "type": "COURSEWORK", "weighting": "10", "start": "2022-05-20", "end": "2022-05-31" }] }, { "name": "Data Science", "code": "5010", "coursework": [{ "name": "Stats", "type": "EXAM", "weighting": "0", "start": "2022-05-02", "end": "2022-05-12" }, { "name": "Machine Learning", "type": "EXAM", "weighting": "45", "start": "2022-05-12", "end": "2022-05-26" }, { "name": "Synoptic", "type": "COURSEWORK", "weighting": "10", "start": "2022-05-20", "end": "2022-05-31" }] }, { "name": "Programming", "code": "5012", "coursework": [{ "name": "Java", "type": "EXAM", "weighting": "30", "start": "2022-05-03", "end": "2022-05-13" }, { "name": "C++", "type": "EXAM", "weighting": "60", "start": "", "end": "2022-05-29" }, { "name": "Synoptic", "type": "COURSEWORK", "weighting": "10", "start": "2022-05-20", "end": "2022-05-31" }] }]],
  activities: [{ name: 'homework', parent: 'Software Engineering', time: '60' },
  { name: 'revision', parent: 'Data Science', time: '120' }],
  milestones: [{
    name: 'homework 1',
    parent: 'Software Engineering - homework',
    time: '20',
    details: 'Finished my software engineering homework - might need to redo the CSS'
  },
  {
    name: 'homework 2',
    parent: 'Software Engineering - homework',
    time: '5',
    details: 'Started, got up to doing the css'
  },
  {
    name: 'revision 1',
    parent: 'Data Science - revision',
    time: '5',
    details: 'Finished topic 5'
  }],
  ganttTasks: []
},
{
  id: 'admin',
  email: 'admin',
  fname: '',
  lname: '',
  dob: '',
  password: '$2b$10$yvfs1CMFPJ.Izs4u/KMgd.2H.2I8bYTsxasm2R7oj03fmL7NB6YNi',
  events: [],
  modules: [],
  activities: [],
  milestones: [],
  ganttTasks: []
}]

// modules array
modules = []
const currentUser = null

// feedback array
const feedback = []

/* login routes */
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

/* register routes */
app.get('/register', (req, res) => {
  res.render('register.ejs')
});

app.post('/register', checkNotAuthenticated, urlencodedParser, [
  check('email', 'Invalid email')
    .exists()
    .isEmail(),
  check('fname', 'Invalid first name')
    .exists()
    .notEmpty(),
  check('lname', 'Invalid last name')
    .exists()
    .notEmpty(),
  check('password', 'Invalid password')
    .exists()
    .notEmpty()
], async (req, res) => {

  //This takes the result of the error checks which is stored as an array and returns the array of errors if it contains something
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // return res.status(422).jsonp(errors.array())
    const alert = errors.array()
    return res.render('register.ejs', {
      alert
    })
  }

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
      modules: [],
      activities: [],
      milestones: [],
      ganttTasks: []

    })

    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
  // test to see if new user has been added
  console.log(users)
})

/* index page routes */
app.get('/', checkAuthenticated, (req, res) => {
  const user = req.user

  if (user.id == "admin") {
    res.redirect('/index_admin');
  } else {

    upcoming_deadlines = []
    past_deadlines = []

    let dataEvent = JSON.stringify(user.events);
    fs.writeFileSync('Views/student-events.json', dataEvent);

    let dataDeadlines = JSON.stringify(upcoming_deadlines);
    fs.writeFileSync('Views/student-deadlines.json', dataDeadlines);

    let dataGanntTasks = JSON.stringify(user.ganttTasks);
    fs.writeFileSync('Views/student-ganttTasks.json', dataGanntTasks);

    modules = user.modules[0]

    for (e in modules) {

      for (c in modules[e].coursework) {


        cw_name = modules[e].coursework[c].name
        cw_end = modules[e].coursework[c].end

        cw_date = new Date(cw_end)

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        current_date = new Date(dateTime)

        //if statement to check date
        if (cw_date > current_date) {
          upcoming_deadlines.push({
            name: cw_name,
            end: cw_end

          })
        } else {
          past_deadlines.push({
            name: cw_name,
            end: cw_end
          })
        }
      }

      let dataDeadlines = JSON.stringify(upcoming_deadlines);
      fs.writeFileSync('Views/student-deadlines.json', dataDeadlines);

    }

    //activities and milestones
    totals = []
    complete = []


    for (a in user.activities) {
      var total = 0

      for (m in user.milestones) {

        if (user.milestones[m].parent.substr(0, user.milestones[m].parent.indexOf(' -')) === user.activities[a].parent) {
          total = total + parseInt(user.milestones[m].time)

        }

      }

      totals[a] = total

    }
    console.log("TOTALS:")
    console.log(totals)

    console.log(user)

    res.render('index.ejs', { deadlines: upcoming_deadlines, past_deadlines: past_deadlines, activities: user.activities, total_times: totals })
  }
});


/* module creator page routes */
app.get('/module_creator', checkAuthenticated, (req, res) => {
  res.render('module_creator.ejs')
});
app.post('/module_creator', checkAuthenticated, async (req, res) => {
  try {
    console.log("1")
    var obj = {
      table: []
    };

    obj.table.push({
      name: req.body.moduleName1,
      code: req.body.moduleCode1,
      year: req.body.moduleStart1,
      semester: req.body.moduleEnd1,
      coursework: [
        {
          name: req.body.coursework1Name1,
          type: req.body.coursework1Type1,
          weighting: req.body.coursework1Weighting1,
          start: req.body.coursework1Start1,
          end: req.body.coursework1End1
        },
        {
          name: req.body.coursework1Name2,
          type: req.body.coursework1Type2,
          weighting: req.body.coursework1Weighting2,
          start: req.body.coursework1Start2,
          end: req.body.coursework1End2
        },
        {
          name: req.body.coursework1Name3,
          type: req.body.coursework1Type3,
          weighting: req.body.coursework1Weighting3,
          start: req.body.coursework1Start3,
          end: req.body.coursework1End3
        }
      ]
    },
      {
        name: req.body.moduleName2,
        code: req.body.moduleCode2,
        year: req.body.moduleStart2,
        semester: req.body.moduleEnd2,
        coursework: [
          {
            name: req.body.coursework2Name1,
            type: req.body.coursework2Type1,
            weighting: req.body.coursework2Weighting1,
            start: req.body.coursework2Start1,
            end: req.body.coursework2End1
          },
          {
            name: req.body.coursework2Name2,
            type: req.body.coursework2Type2,
            weighting: req.body.coursework2Weighting2,
            start: req.body.coursework2Start2,
            end: req.body.coursework2End2
          },
          {
            name: req.body.coursework2Name3,
            type: req.body.coursework2Type3,
            weighting: req.body.coursework2Weighting3,
            start: req.body.coursework2Start3,
            end: req.body.coursework2End3
          }
        ]
      },
      {
        name: req.body.moduleName3,
        code: req.body.moduleCode3,
        year: req.body.moduleStart3,
        semester: req.body.moduleEnd3,
        coursework: [
          {
            name: req.body.coursework3Name1,
            type: req.body.coursework3Type1,
            weighting: req.body.coursework3Weighting1,
            start: req.body.coursework3Start1,
            end: req.body.coursework3End1
          },
          {
            name: req.body.coursework3Name2,
            type: req.body.coursework3Type2,
            weighting: req.body.coursework3Weighting2,
            start: req.body.coursework3Start2,
            end: req.body.coursework3End2
          },
          {
            name: req.body.coursework3Name3,
            type: req.body.coursework3Type3,
            weighting: req.body.coursework3Weighting3,
            start: req.body.coursework3Start3,
            end: req.body.coursework3End3
          }
        ]

      })

    // test to see if data is added to array
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

/* users routes */
//get user array, needs to be in login page
app.get('/users', (req, res) => {
  res.json(users)
})

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
    if (await bcrypt.compare(req.body.password, user.password)) {
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

/* functions */
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

app.use('/favicon.ico', express.static('images/favicon2.ico'));

/* about page routes */
app.get('/about', (req, res) => {
  res.render('about.ejs');
});

// about page feedback form
// kept anonymous by not associating the feedback array with users
app.post('/feedback', checkAuthenticated, async (req, res) => {
  try {
    feedback.push(req.body.feedback);
    console.log(feedback);
  } catch (error) {
    console.log(error);
  }
  res.redirect('/about');
})

/* help page routes */
app.get('/help', (req, res) => {
  res.render('help.ejs');
});

app.get('/activities', checkAuthenticated,  (req, res) => {

  const user = req.user
  modules = user.modules[0]
  console.log(modules)
  res.render('activities.ejs', { modules: modules });
});

app.get('/milestones', checkAuthenticated, (req, res) => {
  const user = req.user
  activities = user.activities
  console.log(activities)
  res.render('milestones.ejs', { activities: activities });
});

app.post('/activities', checkAuthenticated, urlencodedParser, [
  check('activityName', 'Invalid activity name')
    .exists()
    .notEmpty()
], async (req, res) => {

  //This takes the result of the error checks which is stored as an array and returns the array of errors if it contains something
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // return res.status(422).jsonp(errors.array())
    const alert = errors.array()
    
    return res.render('index.ejs', {
      alert, activities
    })
  }

  try {

    const user = req.user

    user.activities.push(
      {
        name: req.body.activityName,
        parent: req.body.activityParent,
        time: req.body.activityTime
      })

  } catch {
    res.redirect('/')
  }
  res.redirect('/')
})

app.post('/milestones', checkAuthenticated, async (req, res) => {
  try {

    const user = req.user

    user.milestones.push({
      name: req.body.milestoneName,
      parent: req.body.milestoneParent,
      time: req.body.milestoneTime,
      details: req.body.additionalNotes
    })


  } catch {
    res.redirect('/')
  }
  res.redirect('/')
})


//social media picture routes
app.use('/facebook.png', express.static('images/facebook.png'));
app.use('/twitter.png', express.static('images/twitter.png'));
app.use('/instagram.png', express.static('images/instagram.png'));

app.get('/calendar', (req, res) => {
  res.render('calendar.ejs');
});

app.get('/fileupload', checkAuthenticated, (req, res) => {
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

  res.render('uploadedpage.ejs', { modules: modules });
});

app.get('/uploadPage', (req, res) => {
  res.render('uploadedpage.ejs', { modules: modules });
})

//saving an event
app.post('/saveEvent', checkAuthenticated, urlencodedParser, [
  check('milestoneTitle', 'Invalid title')
    .exists()
    .notEmpty(),
  check('milestoneDate', 'Invalid date')
    .exists()
    .notEmpty(),
  check('milestoneStart', 'Invalid start time')
    .exists()
    .notEmpty(),
  check('milestoneEnd', 'Invalid end time')
    .exists()
    .notEmpty(),
], async (req, res) => {
  const user = req.user

  //This takes the result of the error checks which is stored as an array and returns the array of errors if it contains something
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // return res.status(422).jsonp(errors.array())
    const alert = errors.array()
    return res.render('calendar.ejs', {
      alert
    })
  }

  try {
    user.events.push({
      eventID: user.events.length + 1,
      eventDate: req.body.milestoneDate,
      Title: req.body.milestoneTitle,
      Start: req.body.milestoneStart,
      End: req.body.milestoneEnd
    })

    //writing out updated array to json file
    let data = JSON.stringify(user.events);
    fs.writeFileSync('Views/student-events.json', data);
    //reload calendar
    let dataDeadlines = JSON.stringify(upcoming_deadlines);
    fs.writeFileSync('Views/student-deadlines.json', dataDeadlines);

    res.redirect('/calendar')
  } catch {
    console.log('Exception')
    res.redirect('/')
  }
  console.log(user.events)
})

app.post('/removeEvent', checkAuthenticated, async (req, res) => {
  const user = req.user
  try {
    remainingArr = user.events.filter(data => data.eventID != req.body.removeID);
    user.events = remainingArr;

    let data = JSON.stringify(user.events);
    fs.writeFileSync('Views/student-events.json', data);
    res.redirect('/calendar');
  } catch (error) {
  }
  console.log(user.events)
})

app.use('/left-arrow.png', express.static('images//left-arrow.png'));
app.use('/right-arrow.png', express.static('images//right-arrow.png'));
app.use('/plus_symbol.png', express.static('images/plus_symbol.png'));

/* admin page routes*/
app.get('/help_admin', (req, res) => {
  res.render('help_admin.ejs');
});

app.get('/module_creator_admin', (req, res) => {
  res.render('module_creator_admin.ejs');
});

app.get('/index_admin', (req, res) => {
  const user = req.user

  upcoming_deadlines = []
  past_deadlines = []

  let dataEvent = JSON.stringify(user.events);
  fs.writeFileSync('Views/student-events.json', dataEvent);

  let dataDeadlines = JSON.stringify(upcoming_deadlines);
  fs.writeFileSync('Views/student-deadlines.json', dataDeadlines);

  modules = user.modules[0]

  for (e in modules) {

    for (c in modules[e].coursework) {


      cw_name = modules[e].coursework[c].name
      cw_end = modules[e].coursework[c].end

      cw_date = new Date(cw_end)

      var today = new Date();
      var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date + ' ' + time;
      current_date = new Date(dateTime)

      //if statement to check date
      if (cw_date > current_date) {
        upcoming_deadlines.push({
          name: cw_name,
          end: cw_end

        })
      } else {
        past_deadlines.push({
          name: cw_name,
          end: cw_end
        })
      }
    }

    let dataDeadlines = JSON.stringify(upcoming_deadlines);
    fs.writeFileSync('Views/student-deadlines.json', dataDeadlines);

  }

  //activities and milestones
  totals = []
  complete = []


  for (a in user.activities) {
    var total = 0

    for (m in user.milestones) {

      if (user.milestones[m].parent.substr(0, user.milestones[m].parent.indexOf(' -')) === user.activities[a].parent) {
        total = total + parseInt(user.milestones[m].time)

      }

    }

    totals[a] = total

  }

  console.log("TOTALS:")
  console.log(totals)
  console.log(user)

  res.render('index_admin.ejs', { deadlines: upcoming_deadlines, past_deadlines: past_deadlines, activities: user.activities, total_times: totals })
});

// saving a gannt task
app.post('/ganttTasks', checkAuthenticated, async (req, res) => {
  const user = req.user

  try {
    user.ganttTasks.push({
      taskName: req.body.taskName,
      taskTimeStart: req.body.taskTimeStart,
      taskTimeEnd: req.body.taskTimeEnd,
    })

    // writing out updated array to json file
    let dataGanntTasks = JSON.stringify(user.ganttTasks);
    fs.writeFileSync('Views/student-ganttTasks.json', dataGanntTasks);

    res.redirect('/')
  } catch (error) {
    console.log('Exception')
    res.redirect('/')
  }
  // test to see if gantt chart data are being made 
  console.log(user.ganttTasks);
})