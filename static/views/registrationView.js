define(['jquery',                                                  
    'underscore', 
    'backbone',
	'constants',
	'jqValidator',
	'validatorRules',
	'text!templates/registrationPage.html'
	], 
	function($,_,Backbone, constants, jqValidator, validatorRules, registrationPageTemplate){
	
	var MasterView = Backbone.View.extend({
		el:".c-pageBody",
		template: _.template(registrationPageTemplate),
		initialize: function(){
		
			this.model =  new Backbone.Model(
				{formMsg: ''}
			);
			
			this.listenTo(this.model, "change", this.render);
			this.render();
		},
		validationOptions: function() {
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
						 
					},
					
					email: {
						required: true,
						email:true
					},
					password : {
						required: true,
						minlength : 5
					},
					confirmPassword : {
						required: true,
						minlength : 5,
						equalTo : "#password"
					}
                },
                messages: {
                    firstName: {
						required: "First name required",
						alphaOnly: "No special characters are allowed",
						minlength: "Must have more than 1 letter"
					},
					lastName: {
						required: "Last name required",
						alphaOnly: "No special characters are allowed",
						minlength: "Must have more than 1 letter"
					},
					email: {
						required: "Email address required",
						email: "Please enter a valid email address."
					},
					password : {
						required: "Password required",
						minlength : "Please enter minimum 5 characters."
					},
					confirmPassword : {
						required: "Re-enter password required",
						minlength : "Please enter minimum 5 characters.",
						equalTo : "Please enter a matching password."
					}
                },
				errorClass : "text-danger",
                //focusCleanup : true,
                submitHandler: function(form) {
                    self.onSubmitRegistrationForm(self);
					return false;
                }
            };
        },
		preventSubmission: function(evt){
			evt.preventDefault();
		},
		onSubmitRegistrationForm: function(self){
			
			 
			var _self = self;
			$.ajax({
			   url:constants.registerUserAPI,
			   method : "POST",
			   data:_self.$el.find("#user-registration").serializeObject()
			   
			}).done(function(data, textStatus, jqXHR){

				_self.model.set("formMsg", data.message);
				_self.render();
				
				window.setTimeout(function(){
					_self.model.set("formMsg", '');
					_self.render();
				},2000);
				
			}).fail(function(jqXHR, textStatus, errorThrown){
				_self.model.set("formMsg", data.message);
				 
			});
		},
		render: function(){
			var _self = this;
			this.$el.html(_self.template(_self.model.toJSON()));
			
			this.$el.find("#user-registration").validate(_self.validationOptions());
			
			return this;
		}
	});
	
	return MasterView;
	
})