var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
// Plugins
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var nameValidator = [
  validate({
    validator: 'matches',
    arguments: /^(([a-zA-Z])+[ ]+([a-zA-Z])+)+$/,
    message: 'Der eingegebene Name darf keine Sonderzeichen beinhalten.'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 25],
    message: 'Name sollte zwischen {ARGS[0]} und {ARGS[1]} Buchstaben beinhalten.'
  })
];
var emailValidator = [
  validate({
    validator: 'isEmail',
    message: 'Die eingegebene Email konnte nicht verifiziert werden.'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 40],
    message: 'Email sollte zwischen {ARGS[0]} und {ARGS[1]} Buchstaben beinhalten.'
  })
];
var usernameValidator = [
  validate({
    validator: 'isLength',
    arguments: [3, 25],
    message: 'Username sollte zwischen {ARGS[0]} und {ARGS[1]} Buchstaben beinhalten'
  }),
  validate({
    validator: 'isAlphanumeric',
    message: 'Username darf nur aus Buchstaben und Zahlen bestehen.'
  })
];

var passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [6, 35],
    message: 'Das eingegebene Passwort ist zu kurz (min. 8 Stellen).'
  }),
  validate({
    validator: 'matches',
    arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\W])(?=.*?[\d]).{6,35}$/, //(?=.*?[A-Z])(?=.*?[\W])
    message: 'Das Passwort muss min. eine Zahl beinhalten.'
  })

];

var UserSchema = new Schema({
  // Profile
  name: {type: String, required: true, validate: nameValidator},
  image: {type: String, required: false},
  birthday: {type: Date, required: false},
  // Authentication
  username: {type: String, lowercase: true, required: true, unique:true, validate: usernameValidator},
  password: {type: String, required: true, validate: passwordValidator, select: false},
  email: {type: String, required: true, lowercase:true, unique: true, validate: emailValidator},
  // Account
  active: {type: Boolean, required: true, default: false},
  temporarytoken: {type: String, required: true}
});

UserSchema.pre('save', function(next){
  var user = this;

  if(!user.isModified('password')) return next();

  bcrypt.hash(user.password, null, null, function(err, hash){
    if(err) return next(err);
    user.password = hash;
    next();
  });
});

UserSchema.plugin( titlize, {
  paths: [ 'name' ],
});

UserSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
