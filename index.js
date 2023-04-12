const express = require('express')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const exphbs = require('express-handlebars');
const path = require('path');
const todoRoutes = require('./routes/users');
const flash = require('connect-flash');
const bodyparser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

const Turn = require('./models/Turns');

//Passport config
require('./config/passport')(passport);

const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


const PORT = process.env.PORT || 8010;


const app = express();

const http = require('http').Server(app);
const client = require('socket.io')(http);

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars) //   important!!! см. https://handlebarsjs.com/api-reference/runtime-options.html#options-to-control-prototype-access
})


app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');
//app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // includes stylesheet
app.use(todoRoutes);

// Express Session
app.use(session({
  secret: 's',
  resave: true,
  saveUninitialized: true
}));

//Passport middleware

app.use(flash());

app.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user.toObject();
  }
});

async function start(){
  try {
    await mongoose.connect('mongodb+srv://Casper:carver2017@cluster0-yboyt.mongodb.net/users', {
      useNewUrlParser: true,
      useFindAndModify: false
    })

    var server = http.listen(PORT, () => {
      console.log('server is running on port', server.address().port);
    });

    client.on('connection', function(socket){
        
      socket.on('turn', function(data){
        
        const turn = new Turn({
          gameId: 1,
          player: 2,
          turn: data.turn,
        });
        console.log(turn);
        turn.save();
        socket.broadcast.emit('addturn', data);
        }
    );
    });
    
  } catch (e) {
    console.log('error to connect');
    console.log(e);
  }
}

start();
