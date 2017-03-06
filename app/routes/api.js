var User = require('../models/user');
var jwt  = require('jsonwebtoken');
var secret = 'babbelnweb';

module.exports = function(router){
  //User Registration
  router.post('/users', function(req, res){
    var user = new User();

        user.username = req.body.username;
        user.password = req.body.password;
        user.email    = req.body.email;
        user.name     = req.body.name;

        if( req.body.username == null || req.body.username == '' ||
            req.body.password == null || req.body.password == '' ||
            req.body.email == null || req.body.email == '' ||
            req.body.name == null || req.body.name == '')
        {
          res.json({success: false, message: 'Bitte fülle alle Felder aus.'});
        } else {
          user.save(function(err){
            if (err) {
              if (err.errors != null){
                if(err.errors.name){
                  res.json({success: false, message: err.errors.name.message});
                } else if (err.errors.email){
                  res.json({success: false, message: err.errors.email.message});
                } else if (err.errors.username){
                  res.json({success: false, message: err.errors.username.message});
                } else if (err.errors.password){
                  res.json({success: false, message: err.errors.password.message});
                } else {
                  res.json({success: false, message: err});
                }
              } else if(err){
                if(err.code == 11000) res.json({success: false, message: 'Account oder Username bereits registriert.'});
                else res.json({success: false, message: err});
              }
            } else {
              res.json({success: true, message:'Account erfolgreich erstellt.'});
            }
          });
        }
  });

  // Check username/email already exists
  router.post('/checkusername', function(req, res){
    User.findOne({ username: req.body.username}).select('username').exec(function(err, user){
      if (err) throw err;

      if(user){
        res.json({ success: false, message: 'Es existiert bereits ein Account mit diesem Benutzernamen.'})
      } else {
        res.json({ success: true, message: 'Benutzername verfügbar.'})
      }

    })
  });

  router.post('/checkemail', function(req, res){
    User.findOne({ email: req.body.email}).select('email').exec(function(err, email){
      if (err) throw err;

      if(email){
        res.json({ success: false, message: 'Es existiert bereits ein Account mit dieser Email-Adresse.'})
      } else {
        res.json({ success: true, message: 'Email-Adresse verfügbar.'})
      }

    })
  });

  //User Login
  router.post('/authenticate', function(req, res){
    User.findOne({ username: req.body.username}).select('email username password').exec(function(err, user){
      if (err) throw err;

      if (!user) {
        res.json({ success: false, message: 'Login fehlgeschlagen.'});
      } else if (user) {
        if(req.body.password){
          var validPassword = user.comparePassword(req.body.password);
        } else {
          res.json({ success: false, message: 'Bitte gebe ein Passwort ein.'});
        }

        if (!validPassword){
          res.json({sucess: false, message: 'Falsches Passwort.'});
        } else {
          var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn : '24h'});
          res.json({success: true, message: 'Login erfolgreich', token: token})
        }
      }
    })
  });

  router.use(function(req, res, next){
    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if(token){
      //verify token
      jwt.verify(token, secret, function(err, decoded){
        if(err) res.json({success: false, message:'Ungültiger Schlüssel.'});

        req.decoded = decoded;
        next();
      })
    } else {
      res.json({success: false, message: 'Schlüssel wurde nicht gefunden.'});
    }
  });

  router.post('/me', function(req, res){
    res.send(req.decoded);
  });

  return router;
}
