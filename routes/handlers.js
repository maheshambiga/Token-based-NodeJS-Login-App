var jwt = require("jsonwebtoken");
var User = require("../models/user").UserModel;
var Token = require("../models/user").TokenModel;
var config = require("./../config");

function RouteHandler(App, apiRoutes){
  var _self = this;
  _self.registerUser = registerUser;
  _self.authenticateUser = authenticateUser;
  _self.updateSessionHandler = updateSessionHandler;
  _self.changeProfileInfo = changeProfileInfo;
  _self.resetPasswordhandler = resetPasswordHandler;
  _self.logoutUserHandler = logoutUserHandler;
  _self.rootCallhandler = rootCallhandler;
  _self.logoutAllDevicesHandler = logoutAllDevicesHandler;

}
function generateToken(user, req){
  var token = jwt.sign({
    user:  user.email,
    user_id:  user.id
    //agent: req.headers['user-agent']
  }, config.TOKEN_SECRET);
  return token;
}
function rootCallhandler(req, res, next){

  if(req.path === "/register" || req.path === "/authenticate"){
    next();
  }else{
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
      jwt.verify(token, config.TOKEN_SECRET, function(err, decoded){

        if(err){
          	return res.status(500).send({'success': false, 'message': err});

        }else{


            if(!decoded) {

            return res.json({success:false, message:'Access token did not match!'});

          }else{

            refreshTokenHandler(decoded.user_id, token, function(err, refresh_token){
              if(err.length) return res.json({success:false, message:err});
              next();
            });

          }

        }
      });
    }else{

      return res.status(200).send({
        success: false,
        message: "No token provided!"
      });
    }
  }

}
function registerUser(req, res, next){
  var firstName = (req.body.firstName) ? req.body.firstName : req.query.firstName;
  var lastName = (req.body.lastName) ? req.body.lastName : req.query.lastName;
  var email = (req.body.email) ? req.body.email : req.query.email;
  var password = (req.body.password) ? req.body.password : req.query.password;

  User.findUserByEmailId(email, function(err, user){
    if(err) {
			res.status(500).send({'success': false, 'message': err});
		}else if(user != null && user.length != 0)	{
			res.json({success: false, message: 'User already exist!'});
		}	else	{
      User.register(new User({
        "firstName":firstName,
        "lastName":lastName,
        "email":email,
        "password": password
      }), function(err){
        if(err){
            res.status(200).send({'success': false, 'message': err});
        }else{

            res.status(200).send({'success': true, 'message': "User has been successfully registered."});
        }

      });
    }
  });


}
function refreshTokenHandler(user_id, token, callback){
  Token.findOne({user_id: user_id, token: token}, function(err, token){
    if(err){
      return res.status(500).send({'success': false, 'message': err});
    }
    if(token === null) return callback("Access token has expired!", null);
    Token.refreshToken(token, function(err, refresh_token){
        if(err){
          callback("Error while refreshing token!", null);
        }else{
          callback(false, refresh_token);
        }
    });
  });
}
function authenticateUser(req, res, next){
  var _self = this;
  var email = (req.body.email) ? req.body.email : req.query.email;
  var password = (req.body.password) ? req.body.password : req.query.password;

  User.findOne({email: email}, function(err, user){
    if(err){
      return res.status(500).send({'success': false, 'message': err});
    }

    if(!user){
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    }else if(user){

      if(user.password !== password){
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      }else{

        //token is generated here
        var signedToken = generateToken(user, req);
        var token = new Token({
          token: signedToken,
          user_id: user.id
        });

      	Token.createToken(token, function(err, token_instance) {
          if (err) {
    				return res.status(500).send({'success': false, 'message': err});
    			} else {

            res.json({
              success:true,
              user_id: user.id,
              email: user.email,
              firstName:user.firstName,
              lastName:user.lastName,
              token: token_instance.token,
              createdAt: token_instance.updated_at,
              expireAt: token_instance.expire_at,
              message:"You are granted a token now."


            });
    			}
        })


      }
    }
  });
};



function updateSessionHandler(req, res, next){
  var user_id = (req.body.user_id) ? req.body.user_id : req.query.user_id;
  var token = (req.body.token) ? req.body.token : req.query.token;

  refreshTokenHandler(user_id, token, function(err, refresh_token){
    if(err.length){
      return res.status(500).send({'success': false, 'message': err});
    }
    //
    if (!(/^[0-9a-fA-F]{24}$/.test(user_id))) {
      return res.json(200, {success:false, message: "Invalid Id!"});
    }
    //
    User.findById(user_id, function(err, user){
      if(err){
        return res.status(500).send({'success': false, 'message': err});
      }

      res.json({
        success:true,
        user_id: user.id,
        email: user.email,
        firstName:user.firstName,
        lastName:user.lastName,
        token: token,
        createdAt: refresh_token.updated_at,
        expireAt: refresh_token.expire_at,
        message:"Session extended!!!"


      });

    });

  });

}

function changeProfileInfo(req, res, next){
  var _id = (req.body.id) ? req.body.id : req.query.id;
  var firstName = (req.body.firstName) ? req.body.firstName : req.query.firstName;
  var lastName = (req.body.lastName) ? req.body.lastName : req.query.lastName;

  if (!(/^[0-9a-fA-F]{24}$/.test(_id))) {
    return res.json(200, {success:false, message: "Invalid Id!"});
  }
  User.findById(_id, function(err, user){
    if(err){
      return res.status(500).send({'success': false, 'message': err});
    }

      if(user){
        user.firstName = firstName;
        user.lastName = lastName;

        user.save(function(err){
          if(err){
            return res.status(500).send({'success': false, 'message': err});
          }
            res.json(200, {success:true, message: "Successfully changed user profile!", user:user});
        });
      }else{
        res.json(200, {success:false, message: "No user found!"});
      }
  });
}


function resetPasswordHandler(req, res, next){
  var _id = (req.body.id) ? req.body.id : req.query.id;
  var currentPassword = (req.body.currentPassword) ? req.body.currentPassword : req.query.currentPassword;
  var newPassword = (req.body.newPassword) ? req.body.newPassword : req.query.newPassword;

  if (!(/^[0-9a-fA-F]{24}$/.test(_id))) {
    return res.json(200, {success:false, message: "Invalid Id!"});
  }
  User.findById(_id, function(err, user){
    if(err){
      return res.status(500).send({'success': false, 'message': err});
    }

      if(user){
          if(currentPassword && currentPassword === user.password){
            user.password = newPassword;
            user.save(function(err){
                res.json(200, {success:true, message: "Successfully changed password!"});
            });
          }else{
            res.json(200, {success:false, message: "Incorrect password entered!"} );
          }

      }else{
        res.json(200, {success:false, message: "No user found!"});
      }

  });
}

function logoutUserHandler(req, res, next){
  var user_id = (req.body.user_id) ? req.body.user_id : req.query.user_id;
  var token = (req.body.token) ? req.body.token : req.query.token;

  Token.findOneAndRemove({user_id: user_id, token: token}, function(err){
    if(err){
      return res.status(500).send({'success': false, 'message': err});
    }
    res.json(200, {success:true, message:"You have been logged out successfully!"});

  });
}

function logoutAllDevicesHandler(req, res, next){
  var user_id = (req.body.user_id) ? req.body.user_id : req.query.user_id;
  Token.remove({user_id: user_id}, function(err){
    if(err){
      return res.status(500).send({'success': false, 'message': err});
    }
    res.json(200, {success:true, message:"You have successfully been logged out from all devices!"});

  });
};


module.exports = RouteHandler;
