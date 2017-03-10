var express     = require('express');
var morgan      = require('morgan');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var path        = require('path');
var passport    = require('passport');

var app         = express();
var port        = process.env.PORT || 8000;
var router      = express.Router();
var appRoutes   = require('./app/routes/api')(router);
var social      = require('./app/passport/passport')(app, passport);

//app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'))
app.use('/api', appRoutes);

mongoose.connect('mongodb://localhost/babbeln_dev', function(err){
  if(err){
    console.log('Connection to database failed: ' + err);
  } else {
    console.log('Succesfully connected to database.');
  }
});

app.get('*', function(req, res){
  res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

app.listen(port, function(){
  console.log('Running Babbeln-Web on port ' + port)
});
