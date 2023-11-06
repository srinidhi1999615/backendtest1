const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const csv = require('csv-parser');
const fs = require('fs');
const { MongoClient } = require('mongodb');



app.use(express.urlencoded());
app.use(cookieParser());
// use express router
app.use(express.static('./assets'));
app.use(expressLayouts);

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



//setting up the view engine
app.set('view engine','ejs');
app.set('views','./views');

//Using mongostore to store the session data in mongodb
const mongoStore = new MongoStore({
    mongooseConnection: db,
    autoRemove: 'disabled'
}, function (err) {
    console.log(err || 'Connect mongo setup ok');
});

app.use(session({
    name: 'backendtest1',
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: mongoStore // Use the mongoStore instance here
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
//routes
app.use('/', require('./routes'));
// route for exporting student data
app.get('/export-students', async (req, res) => {
    try {
      const client = new MongoClient('mongodb://0.0.0.0:27017/srinidhibackendtest1dev', { useUnifiedTopology: true });
      await client.connect();
  
      const db = client.db('srinidhibackendtest1dev'); // Replace with your database name
      const collection = db.collection('students'); // Replace with your collection name
  
      const students = await collection.find().toArray();
  
      const csvData = students.map((student) => {
        return `${student.name},${student.email},${student.course},${student.city}\n`;
      }).join('');
  
      res.setHeader('Content-Disposition', 'attachment; filename=students.csv');
      res.setHeader('Content-Type', 'text/csv');
  
      res.status(200).send(csvData);
  
      await client.close();
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  //Used to run server on the port
app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
