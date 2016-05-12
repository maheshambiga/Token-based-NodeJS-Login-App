define([
	'underscore', 
    'backbone',
	'constants',
	'models/UserModel'
	], 
	function(_, Backbone, constants, UserModel){
	
	var HeaderModel = Backbone.Model.extend({
		defaults: {
            "logged_in": false,
			"token":""
        },
		initialize : function(){
			this.set("user", new UserModel());
		},
		url: function(){
            return constants.refreshToken;
        },
		updateUser: function(userData ){
			this.get("user").set(_.pick(userData, _.keys(this.get("user").defaults)));
		},
		clearSessionInfo: function(){
			window.sessionStorage.clear();
			this.set({logged_in: false});
			this.get("user").clear();
		},
		checkAuth: function(callback){
			var self = this;
            if(window.sessionStorage.isLoggedIn === "true")this.get("user").fetch({
				url: self.url(),
				method:"POST",
				data: {
					"user_id" : window.sessionStorage.user_id,
					"token" : window.sessionStorage.token
				},
				success: function(mod, res){
					if( res.success ){
						//self.updateUser(res);
						self.set({logged_in: true, token: res.token});
					}
					
					if('success' in callback) callback.success(mod, res);    
				},
				error:function(mod, res){
                    self.clearSessionInfo();
                    if('error' in callback) callback.error(mod, res);    
                }
			}).complete( function(){
                if('complete' in callback) callback.complete();
            });
		},
		postAuth: function(action, opts, callback){
			var self = this;
			
			$.ajax({
				url: opts.url,
                method: opts.method,
				data:opts.data
			}).done(function(data, textStatus, jqXHR){
				if( data.success && action === 'login'){
					self.updateUser(data);
					self.set({logged_in: true, token: data.token});
				}else if( data.success && action === 'logout'){
					self.clearSessionInfo();
				}
				
				if(callback && 'success' in callback) callback.success(data);
			}).fail(function(jqXHR, textStatus, errorThrown){
				if(callback && 'error' in callback) callback.error(errorThrown);
			}).complete( function(jqXHR, textStatus){
                if(callback && 'complete' in callback) callback.complete();
            });
		},
		login: function(opts, callback){
			this.postAuth('login', opts, callback);
		},
		logout: function(opts, callback){
			this.postAuth('logout', opts, callback);
		}
	});
	
	return new HeaderModel();
	
})