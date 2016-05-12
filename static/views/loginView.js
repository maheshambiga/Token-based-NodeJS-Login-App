define(['jquery',                                                  
    'underscore', 
    'backbone',
	'constants',
	'models/headerModel',
	'views/timeoutModalView',
	'text!templates/loginPage.html',
	'router/app_router'
	], 
	function(
	$,
	_,
	Backbone, 
	constants, 
	HeaderModel, 
	TimeoutModalView,
	loginPageTemplate, 
	AppRouter
	){
	
	var LoginView = Backbone.View.extend({
		el:".c-pageBody",
		template: _.template(loginPageTemplate),
		initialize: function(){
			this.model = new Backbone.Model({
				"authErrMsg":""
			});
			
			this.render();
		},
		events: {
			"submit #loginForm": "onLoginFormSubmit"
		},
		onLoginFormSubmit: function(evt){
			evt.preventDefault();
			this.loginService();
		},
		loginService: function(){
			var _self = this;
			HeaderModel.login({
			   url:constants.loginAPI,
			   method : "POST",
			   data:_self.$el.find("#loginForm").serializeObject()
			   
			}, {success: function(res){
				if(res.success === true){
					window.sessionStorage.user_id = res.user_id;
					window.sessionStorage.token = res.token;
					window.sessionStorage.isLoggedIn = true;
					AppRouter.navigate("/", {trigger: true});
					
					TimeoutModalView.showWarning({
						createdAt: res.createdAt,
						expireAt: res.expireAt
					});
				}else{
					_self.model.set("authErrMsg", res.message);
					
					_self.render();
					
					window.setTimeout(function(){
						_self.model.set("authErrMsg", '');
						_self.render();
					},1000);
				}
				
			}, error: function(errorThrown){
				throw errorThrown;
			}});
			
		},
		render: function(){
			var _self = this;
			this.$el.html(_self.template(_self.model.toJSON()));
			return this;
		}
	});
	
	return LoginView;
	
})