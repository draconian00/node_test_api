var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt-nodejs'); // 암호화 모듈

const users = [
  {
    user_id: 'draconian',
    user_nickname: 'draco',
    user_pwd: '123'
  }
];

const findUser = (user_id) => {
  return users.find(v => (v.user_id === user_id));
}
const findUserIndex = (user_id, user_pwd) => {
  return users.findIndex(v => (v.user_id === user_id && bcrypt.compareSync(user_pwd, v.user_pwd)));
}
const signIn = (user_id, user_pwd) => {
  return users.find(v => (v.user_id === user_id && bcrypt.compareSync(user_pwd, v.user_pwd)));
}

/* GET home page. */
router.get('/', (req, res, next) => {
  const sess = req.session;
  res.render('index', { 
    nickname: sess.user_uid+1 ? users[sess.user_uid]['user_nickname'] : ''
  });
});

router.get('/login', (req, res) => {
  res.render('login');
});
router.post('/login', (req, res) => {
  const body = req.body; // body-parser 사용

  if (findUser(body.user_id)) {
    if (signIn(body.user_id, body.user_pwd)) {
      req.session.user_uid = findUserIndex(body.user_id, body.user_pwd);
      res.redirect('/');
    } else {
      res.send('Check PW');
    }
  } else {
    res.send('User not exists with ID : ' + body.user_id);
  }
});

router.get('/logout', (req, res) => {
  delete req.session.user_uid;
  res.redirect('/');
});

router.get('/join', (req, res) => {
  res.render('join');
});
router.post('/join', (req, res) => {
  const body = req.body;
  if (!findUser(body.user_id)) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(body.user_pwd, salt);
    console.log(hash);

    users.push({
      user_id: body.user_id,
      user_pwd: hash,
      user_nickname: body.user_nickname
    });
    res.redirect('/login');
  } else {
    res.send('already exists');
  }
});

module.exports = router;
