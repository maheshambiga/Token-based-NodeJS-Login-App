define(['jquery',                                                  
    'underscore', 
    'backbone',
	'constants',
	'jqValidator',
	'validatorRules',
	'models/headerModel',
	'views/passwordChangeReasonModalView',
	'text!templates/accountSettingsTemplate.html'
	], 
	function(
	$,
	_,
	Backbone, 
	constants, 
	jqValidator, 
	validatorRules, 
	HeaderModel, 
	PasswordChangeReasonModalView, 
	accountSettingsTemplate
	){
	
	var MasterView = Backbone.View.extend({
		el:".c-pageBody",
		template: _.template(accountSettingsTemplate),
		initialize: function(){
			this.model =  new Backbone.Model();
			this.model.set({
				user : HeaderModel.get("user").clone(),
				editProfile : false,
				editPassword : false,
				formError: ''
			});
			
			this.listenTo(HeaderModel, "change", this.setModel);
			this.listenTo(this.model, "change", this.render);
			this.render();
		},
		setModel: function(){
			this.model.set("user", HeaderModel.get("user").clone());
		},
		events: {
			"click .c-editProfileName" :"onEditProfileName",
			"click .c-editPassword" :"onEditPassword",
			"click .c-cancelProfileChanges" : "cancelUserProfileForm",
			"click .c-cancelPasswordChange" : "cancelUserPasswordForm"
		},
		onEditProfileName: function(evt){
			evt.preventDefault();
			this.model.set({"editProfile":true});
			this.model.set({"editPassword":!true});
			this.model.set({"formError":''});
			this.render();
		},
		onEditPassword: function(evt){
			evt.preventDefault();
			this.model.set({"editPassword":true});
			this.model.set({"editProfile":!true});
			this.model.set({"formError":''});
			this.render();
		},
		cancelUserProfileForm: function(evt){
			evt.preventDefault();
			this.model.set({"editProfile":false});
			this.render();
		},
		cancelUserPasswordForm: function(evt){
			evt.preventDefault();
			this.model.set({"editPassword":false});
			this.render();
		},
		profileValidationRules: function(){
			var self = this;
			return {
				rules: {
					firstName: {
						required: true,
						minlength: 2
					},
					lastName: {
						required: true,
						minlength: 2
						 
					}
				},
				messages:{
					firstName: {
						required: "First name required",
						alphaOnly: "No special characters are allowed",
						minlength: "Must have more than 1 letter"
					},
					lastName: {
						required: "Last name required",
						alphaOnly: "No special characters are allowed",
						minlength: "Must have more than 1 letter"
					}
				},
				errorClass : "text-danger",
                //focusCleanup : true,
                submitHandler: function(form) {
                    self.submitProfileChanges(self);
					return false;
                }
				
			}
		},
		passwordValidationRules: function(){
			var self = this;
			return {
				rules: {
					currentPassword : {
						required: true
					},
					newPassword : {
						required: true,
						minlength : 5
					},
					reEnterNewPassword : {
						required: true,
						minlength : 5,
						equalTo : "#newPassword"
					}
				},
				messages:{
					currentPassword : {
						required: "Password required"
					},
					newPassword : {
						required: "Enter new password",
						minlength : "Please enter minimum 5 characters."
					},
					reEnterNewPassword:{
						required: "Re-enter new password",
						minlength : "Please enter minimum 5 characters.",
						equalTo : "Please enter a matching password."
					}
				},
				errorClass : "text-danger",
                //focusCleanup : true,
                submitHandler: function(form) {
					self.submitPasswordChanges(self);
                    
					return false;
                }
				
			}
		},
		submitProfileChanges: function(self){
			var _self = self;
			var ajaxData = {
				id: window.sessionStorage.user_id,
			   token : window.sessionStorage.token
			}
			$.extend(ajaxData, _self.$el.find("#user-profile-form").serializeObject());
			 
			$.ajax({
			   url:constants.changeProfileInfo,
			   method : "POST",
			   data:ajaxData
			   
			}).done(function(data, textStatus, jqXHR){
				console.log(data);
				//show user prompt
				_self.model.set("formError", data.message);
				if(data.success === true){
					HeaderModel.get("user").set(data.user);
					HeaderModel.trigger('change', HeaderModel);
					window.setTimeout(function(){
						 
						_self.model.set({"editProfile":false});
						_self.render();
												
					}, 1000);
				}
				
				_self.render();
			}).fail(function(jqXHR, textStatus, errorThrown){
				 
				console.log(errorThrown);  
			});
		},
		submitPasswordChanges: function(self){
			var _self = self;
			var ajaxData = {
				id: window.sessionStorage.user_id,
			   token : window.sessionStorage.token
			}
			$.extend(ajaxData, _self.$el.find("#user-password-form").serializeObject());
			$.ajax({
			   url:constants.changePassword,
			   method : "POST",
			   data:ajaxData
			   
			}).done(function(data, textStatus, jqXHR){
				console.log(data);
				//show user prompt
				_self.model.set("formError", data.message);

				window.setTimeout(function(){
					 
					_self.model.set({"editPassword":false});
					_self.render();
					
					if(data.success === true){
						_self.$el.append(PasswordChangeReasonModalView.render().el);
						PasswordChangeReasonModalView.delegateEvents();
						_self.$el.find("#changeReason").modal();
					}
					
					
				}, 1000);
				_self.render();
			}).fail(function(jqXHR, textStatus, errorThrown){
				 
				console.log(errorThrown);  
			});
		},
		render: function(){
			var _self = this;
			var data = _self.model.toJSON();
			data.user = data.user.toJSON();
			this.$el.html(_self.template(data));
			if(this.model.get("editProfile")){
				this.$el.find("#user-profile-form").validate(_self.profileValidationRules());
			}else if(this.model.get("editPassword")){
				this.$el.find("#user-password-form").validate(_self.passwordValidationRules());
			}
			return this;
		}
	});
	
	return MasterView;
	
})