define([
	'jquery',                                                  
    'underscore', 
    'backbone',
	'constants',
	'models/headerModel',
	'router/app_router',
	'text!templates/passwordChangeReasonModalTemplate.html'
	], 
	function(
	$,
	_,
	Backbone, 
	constants, 
	HeaderModel, 
	AppRouter, 
	passwordChangeReasonModalTemplate
	){
	
	var ReasonModalView = Backbone.View.extend({
		tagName:"div",
		className:"reason-change-modal",
		template: _.template(passwordChangeReasonModalTemplate),
		initialize: function(){
			this.model = new Backbone.Model();
			this.render();
		},
		events: {
			 "change input[name=reason]":"onReasonChange",
			 "click .c-continue": "executeReasonHandler",
			 "hidden.bs.modal #changeReason" : "onHideModal"
		},
		onReasonChange: function(evt){
			var selectedOpt = $(evt.target).val();
			this.model.set("changeReason", selectedOpt);

		},
		onHideModal: function(){
			if(this.model.get("changeReason")=== "kill_sessions"){
				this.logoutAllDevices();
			}
		},
		executeReasonHandler: function(evt){
			this.closeModal();
		},
		logoutAllDevices: function(){
			var _self = this;
			
			var ajaxData = {
				user_id: window.sessionStorage.user_id,
				token : window.sessionStorage.token
			}
			
			$.ajax({
			   url:constants.logoutAllDevices,
			   method : "POST",
			   data:ajaxData
			   
			}).done(function(data, textStatus, jqXHR){
				if(data.success === true){
					window.sessionStorage.clear();
					HeaderModel.set({logged_in: false});
					
					AppRouter.navigate("/login", {trigger: true});
				}
				
			}).fail(function(jqXHR, textStatus, errorThrown){
				 
				console.log(errorThrown);  
			});
		},
		closeModal: function(){
			this.$el.find('#changeReason').modal('hide');
		},
		render: function(){
			var _self = this;
			this.$el.html(_self.template());
			return this;
		}
	});
	
	return new ReasonModalView();
	
})