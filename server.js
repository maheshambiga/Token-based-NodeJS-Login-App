"use strict";

var express = require("express");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var mongoose = require("mongoose");

var RouteHandler = require("./routes/handlers");


function webServer(config){
  var _self = this;

  _self.config = config;

  _self.env = process.env.NODE_ENV || "development";

  _self.app = express();

  _self.app.set("supersecret", _self.config.secretkey);

  _self.app.use(bodyParser.urlencoded({ extended: true }));//for reading urlencoded params

  _self.app.use(bodyParser.json());

  _self.app.use(morgan("dev"));//activity logger

  //_self.app.use(express.compress());// New call to compress content

  var oneDay = 86400000;

  _self.app.use( express.static(__dirname + '/static', { maxAge: oneDay }));

  _self.app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });

  _self.connectMongoose();

}


webServer.prototype.setCORS = function(req, res, next){
  res.header('Access-Control-Allow-Origin',   '*');
  res.header("access-control-allow-methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", 'Content-Type, api_key, Authorization');
  res.header("content-type", "application/json");
  next();
}




webServer.prototype.connectMongoose = function(){
    var _self = this;

  mongoose.connect(_self.config.DATABASE_CONNECTION);

  mongoose.connection.on('connected', function () {
	  console.log('Mongoose default connection open to ' + _self.config.DATABASE_CONNECTION);
 });

	// If the connection throws an error
	mongoose.connection.on('error',function (err) {
	  console.log('Mongoose default connection error: ' + err);
	});

	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
	  console.log('Mongoose default connection disconnected');
	});

	// If the Node process ends, close the Mongoose connection
	process.on('SIGINT', function() {
	  mongoose.connection.close(function () {
	    console.log('Mongoose default connection disconnected through app termination');
	    process.exit(0);
	  });
	});


}

webServer.prototype.setRoutes = function(routeHandler){
  var _self = this;

    _self.app.use(_self.setCORS);

  var apiRoutes = express.Router();

  _self.app.use('/api', apiRoutes);
  apiRoutes.use(routeHandler.rootCallhandler);
  apiRoutes.post("/register", routeHandler.registerUser);
  apiRoutes.post("/authenticate", routeHandler.authenticateUser);
  apiRoutes.post("/updateSession", routeHandler.updateSessionHandler);
  apiRoutes.post("/changeProfileInfo", routeHandler.changeProfileInfo);
  apiRoutes.post("/changePassword", routeHandler.resetPasswordhandler);
  apiRoutes.post("/logout", routeHandler.logoutUserHandler);
  apiRoutes.post("/logoutAll", routeHandler.logoutAllDevicesHandler);

}

webServer.prototype.start = function(){
  var _self = this;

  _self.setRoutes(new RouteHandler());

  _self.app.listen(_self.config.PORT, function(){
      console.log("Listening on port >> "+_self.config.PORT);

  });

}

module.exports = webServer;
