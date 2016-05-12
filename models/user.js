var mongoose = require("mongoose");
var config = require("../config");
var jwt = require("jsonwebtoken");

var Schema = mongoose.Schema;

var TokenSchema = new Schema({
	token: {type: String},
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date},
	expire_at: {type: Date},
	user_id: {type: Schema.Types.ObjectId}
});
// Expire at the time indicated by the expire_at field
TokenSchema.index({ expire_at: 1 }, { expireAfterSeconds : 0 });

TokenSchema.pre('save', function(next) {
	var currentDate = new Date();
	this.updated_at = currentDate;

	var expireAt = new Date();
	expireAt.setMinutes(expireAt.getMinutes() + config.TOKEN_EXPIRY_TIME);
	this.expire_at = expireAt;
	next();
});


var UserSchema = new Schema({
    firstName: { type: String, required: true},
    lastName:{ type: String, required: true},
    password: { type: String, required: true },
    email: { type: String, required: true },
    created_at: Date,
    updated_at: Date
});




UserSchema.statics.encode = function(data) {
	return jwt.sign(data, config.TOKEN_SECRET, { algorithm: 'RS256'});
};

UserSchema.statics.decode = function(token) {
	return jwt.verify(token, config.TOKEN_SECRET);
};


UserSchema.pre('save', function(next) {

  var currentDate = new Date();


  this.updated_at = currentDate;


  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

UserSchema.statics.findUserByEmailId = function(email, callback){
  this.findOne({email:email}, function(err, user){
    if(err || !user){
      callback(err, null);
    }else{
      callback(false, user);
    }
  });
}
UserSchema.statics.register = function(userModel, callback){
  userModel.save(function(err){
    if(err){
      callback(err, null);
    }else{
      callback(false, null);
    }
  });

}

TokenSchema.statics.createToken = function(token, callback) {

	token.save(function(err, token_instance){
		if(err){
      callback(err, null);
    }else{
      callback(false, token_instance);
    }
	});
};


TokenSchema.statics.refreshToken = function(token, callback) {

	token.save(function(err, token_instance){
		if(err){
      callback(err, null);
    }else{
      callback(false, token_instance);
    }
	});
};

module.exports = {
	UserModel: mongoose.model("User", UserSchema, "userdata"),
	UserSchema: UserSchema,
	TokenModel: mongoose.model('Token', TokenSchema, "token_store"),
	TokenSchema: TokenSchema
}
