var User = require('../models/user');
var jwt  = require('jsonwebtoken');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var secret = 'babbelnweb';

module.exports = function(router){


  var options = {
    auth: {
      api_user: 'conrphil',
      api_key: '170198pC'
    }
  }

  var mailer = nodemailer.createTransport(sgTransport(options));

  //User Registration
  router.post('/users', function(req, res){
    var user = new User();

        user.username         = req.body.username;
        user.password         = req.body.password;
        user.email            = req.body.email;
        user.profile.name     = req.body.name;
        user.profile.city     = "Wetzlar"
        user.temporarytoken   = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn : '24h'});

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
              var email = {
                from: 'Babbeln Support, support@babbeln.me',
                to: user.email,
                subject: 'Babbeln Accountaktivierung',
                text: 'Hallo ' + user.name + ', Vielen Dank für deine Registrierung auf Babbeln. Bitte klicke auf den Aktivierungs-Link um deinen Account zu aktivieren: http://localhost:8000/activate/' + user.temporarytoken,
                html: 'Hallo <strong>' + user.name + '</strong>, <br><br> Vielen Dank für deine Registrierung auf Babbeln. Bitte klicke auf den Aktivierungs-Link um deinen Account zu aktivieren: <br><br><a href="http://localhost:8000/activate/' + user.temporarytoken + '">Hier klicken</a>'
              }

              mailer.sendMail(email, function(err, info){
                if(err){
                  console.log(err);
                } else {
                  console.log(user._id + ':' + user.username + ' - Activation-Link sent. Info: ' + info.response);
                }
              });

              res.json({success: true, message:'Account erfolgreich erstellt. Es wurde eine Email mit einem Aktivierungs-Link an deine Email-Adresse gesendet. '});
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
    User.findOne({ username: req.body.username}).select('email username password active').exec(function(err, user){
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
        } else if(!user.active){
          res.json({sucess: false, message: 'Account ist noch nicht aktiviert.', expired: true});
        } else {
          var token = jwt.sign({ username: user.username, email: user.email}, secret, { expiresIn : '24h'});
          res.json({success: true, message: 'Login erfolgreich', token: token})
        }
      }
    })
  });

  //Resend activation token
  router.post('/resend', function(req, res){
    User.findOne({ username: req.body.username}).select('username password active').exec(function(err, user){
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
        } else if(user.active){
          res.json({sucess: false, message: 'Account ist bereits aktiviert.', expired: true});
        } else {
          res.json({success: true, user: user})
        }
      }
    })
  });

  router.put('/resend', function(req, res){
    User.findOne({username: req.body.username}).select('username email name temporarytoken').exec(function(err, user){
      if(err) throw err;
      user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn : '24h'});
      user.save(function(err){
        if(err){

        } else {
          var email = {
            from: 'Babbeln Support, support@babbeln.me',
            to: user.email,
            subject: 'Babbeln Accountaktivierung',
            text: 'Hallo ' + user.name + ', du hast kürzlich einen neuen Aktivierungslink für deinen Account angefordert. Bitte klicke auf den Aktivierungs-Link um deinen Account zu aktivieren: http://localhost:8000/activate/' + user.temporarytoken,
            html: 'Hallo <strong>' + user.name + '</strong>, <br><br> du hast kürzlich einen neuen Aktivierungslink für deinen Account angefordert. Bitte klicke auf den Aktivierungs-Link um deinen Account zu aktivieren: <br><br><a href="http://localhost:8000/activate/' + user.temporarytoken + '">Hier klicken</a>'
          }

          mailer.sendMail(email, function(err, info){
            if(err){
              console.log(err);
            } else {
              console.log(user._id + ':' + user.username + ' - Activation-Link sent. Info: ' + info.response);
            }
          });

          res.json({success: true, message:'Aktivierungslink erstellt. Es wurde eine Email mit einem Aktivierungs-Link an '+  user.email +' gesendet. '});
        }
      })
    })
  });

  router.put('/activate/:token', function(req, res){
    User.findOne({temporarytoken: req.params.token}, function(err, user){
      if(err) throw err;
      var token = req.params.token;

      jwt.verify(token, secret, function(err, decoded){
        if(err) {
          res.json({success: false, message:'Schlüssel abgelaufen.'});
        } else if(!user){
          res.json({success: false, message:'Ungültiger Schlüssel.'});
        } else {
          user.temporarytoken = false;
          user.active = true;
          user.save(function(err){
            if(err){
              console.log(err);
            } else {
              var email = {
                from: 'Babbeln Support, support@babbeln.me',
                to: user.email,
                subject: 'Babbeln Accountaktivierung',
                text: 'Hallo ' + user.name + ', dein Account wurde erfolgreich aktiviert.',
                html: 'Hallo <strong>' + user.name + '</strong>, <br><br> dein Account wurde erfolgreich aktiviert.'
              }

              mailer.sendMail(email, function(err, info){
                if(err){
                  console.log(err);
                } else {
                  console.log(user._id + ':' + user.username + ' - Account is now active. Info: ' + info.response);
                }
              });
            }
          })
          res.json({success: true, message:'Account wurde erfolgreich aktiviert.'});
        }

      })

    })
  });

  router.post('/profile', function(req, res){
    console.log(req);
  })

  router.put('/resetusername', function(req, res){
    User.findOne({email: req.params.email}).select('email profile username').exec(function(err, user){
      if(err){
        res.json({success: false, message: err});
      } else {
        if(!req.params.email){
          res.json({success: false, message: 'Bitte gebe eine Email an.'})
        } else {
          if(!user){
            res.json({success: false, message: 'Kein Account mit dieser Email gefunden.'})
          } else {
            var email = {
              from: 'Babbeln Support, support@babbeln.me',
              to: user.email,
              subject: 'Babbeln - Dein Benutzername',
              text: 'Hallo ' + user.profile.name + ', du hast deinen Benutzernamen vergessen? <br>Wir helfen dir auf die Sprünge. Bitte bewahre ihn sicher auf. Benutzername: ' + user.username,
              html: 'Hallo <strong>' + user.profile.name + '</strong>, <br><br> du hast deinen Benutzernamen vergessen? Wir helfen dir auf die Sprünge. Bitte bewahre ihn sicher auf.<br>Benutzername: ' + user.username
            }

            mailer.sendMail(email, function(err, info){
              if(err){
                console.log(err);
              } else {
                console.log(user._id + ':' + user.username + ' - requested username. Info: ' + info.response);
              }
            });
            res.json({success: true, message: 'Es wurde eine Email mit deinem Benutzername an deine Email gesendet.'})
          }
        }
      }
    })
  });

  router.put('/resetpassword', function(req, res){
    user.findOne({username: req.body.username}).select().exec(function(err, user){
      if(err) throw err;
      if(!user){
        res.json({success: false, message: 'Benutzername wurde nicht gefunden.'});
      } else if(!user.active){
        res.json({success: false, message: 'Account ist noh nicht aktiviert.'})
      } else {
        user.resettoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn : '24h'});
        user.save(function(err){
          if(err){
            res.json({success: false, message: err});
          } else {

            var email = {
              from: 'Babbeln Support, support@babbeln.me',
              to: user.email,
              subject: 'Babbeln Passwort zurücksetzen',
              text: 'Hallo ' + user.name + ', du hast kürzlich einen neuen Link zum zurücksetzen deines Passwortes für deinen Account angefordert. Bitte klicke auf den Link um dein Passwort zu ändern: http://localhost:8000/reset/' + user.resettoken,
              html: 'Hallo <strong>' + user.name + '</strong>, <br><br> du hast kürzlich einen neuen Link zum zurücksetzen deines Passwortes für deinen Account angefordert. Bitte klicke auf den Link um dein Passwort zu ändern: <br><br><a href="http://localhost:8000/reset/' + user.resettoken + '">Hier klicken</a>'
            }

            mailer.sendMail(email, function(err, info){
              if(err){
                console.log(err);
              } else {
                console.log(user._id + ':' + user.username + ' - requested username. Info: ' + info.response);
              }
            });

            res.json({success: true, message:'Passwort zurücksetzen - Link erstellt. Es wurde eine Email mit einem Passwort zurücksetzen-Link an '+  user.email +' gesendet. '});
          }

        })
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
    if(req.decoded.username){
      User.findOne({username: req.decoded.username}).select('username email profile').exec(function(err, user){
        if(err) throw err;
        res.send(user);
      })
    }

  });

  return router;
}
