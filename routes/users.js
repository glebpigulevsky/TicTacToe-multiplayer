const {Router} = require('express');
const User = require('../models/Users');
const Game = require('../models/Games');
const router = Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


router.get('/', async (req, res) => {
  const user = await User.find({});
  res.render('index', {
    user,
  });
})

router.get('/game', async (req, res) => {
  const game = await Game.find({});
  res.render('game', {
    game
  });
});

router.get('/register', (req, res) => {
  const exist = req.query.exist;
  res.render('register', {
    exist,
    title: 'Register',
    isRegister: true
  });
})

router.get('/login', (req, res) => {
  const incorrect = req.query.incorrect;
  const blocked = req.query.blocked;
  res.render('login', {
    blocked,
    incorrect,
    title: 'Login',
    isRegister: true
  });
})

router.get('/users', async (req, res) => {
  const games = await Game.find({});
  
  await res.render('users', {
    games
  });
})

router.post('/register', async (req, res) => {
  User.findOne({ email: req.body.email}, async function( error, user) {
  if (user){
    res.redirect('/register?exist=true');
    } else{
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  })
  console.log(user);
  //Hash Password
  
   await bcrypt.genSalt(10, async (err, salt) => {
    
    await bcrypt.hash(user.password, salt, async (err, hash) => {
      if(err) throw err;
      
      user.password = await hash;
      user.save()

      .then(user => {
        res.redirect('/login');
      })
      .catch( err => console.log(err));
    })
  })

  }
  })
})




router.post('/login', async (req, res, next) => {
  const user = await User.find({});
  //const actUser = user.findOne({email: req.body.email });
  console.log(user);
  passport.authenticate('local', {
    successRedirect: '/users?user_id=' + user[0].id,
    failureRedirect: '/login?',
    failureFlash: false
  })(req, res, next);
});

router.post('/delete', async (req, res) => {
  let usersDelete = req.body.id;
  if (usersDelete == undefined ){
    res.redirect('/users');
  } else {
    if (usersDelete[0] == ''){
      usersDelete = usersDelete.slice(1);
    }
    const activeLogin = req.body.actLogin;
    await User.findById(usersDelete).deleteMany();
    if (usersDelete.includes(activeLogin)) {
        res.redirect('/');
      } else {
        res.redirect('/users');
    }
  }
})

router.post('/addgame', async (req, res) => {
  
  const game = await new Game({
    
  });
  
   await game.save();
   console.log(game);
  res.redirect('/game');
})





module.exports = router;

