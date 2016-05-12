define([
	'jquery',                                                  
    'underscore', 
    'backbone',
	'constants',
	'models/headerModel',
	'router/app_router',
	'text!templates/timeoutModalTemplate.html'
	], 
	function(
	$,
	_,
	Backbone, 
	constants, 
	HeaderModel, 
	AppRouter, 
	timeoutModalTemplate
	){
	
	var TimeoutModalView = Backbone.View.extend({
		tagName:"div",
		className:"timeout-modal",
		contanerEl: ".c-pageBody",
		template: _.template(timeoutModalTemplate),
		initialize: function(){
			this.model = new Backbone.Model();
			
			this.timer = null;
			
			this.notifyBefore = constants.show_session_timeout;
			
			this.render();
		},
		events: {

			 "click .c-continue": "executeReasonHandler",
			 "hidden.bs.modal #timeoutModal" : "onHideModal"
		},
		sessionInvalidateTime: function(createAt, expireAt){
			var expiryDate = new Date(expireAt);
			var createDate = new Date(createAt);
			var minsDiff = expiryDate.getMinutes() - createDate.getMinutes();//server timeout
			var notifyDate =  new Date(expireAt);
			notifyDate.setTime(notifyDate.getTime() - 1000*60*(minsDiff-this.notifyBefore));
			
			return (expiryDate.getTime() - notifyDate.getTime());
		},
		getNativeDateFormat: function(date){
			return new Date(date);
		},
		executeReasonHandler: function(evt){
			this.model.set("extendSession", true);
			this.closeModal();
		},
		onHideModal: function(){
			
			if ( this.model.get("extendSession")) {
				this.extendSession();
			}else{
				window.clearInterval(this.timer);
				HeaderModel.clearSessionInfo();
				AppRouter.navigate("/login",{trigger:true});
			}
		},
		extendSession: function(){
			var _self = this;
			
			HeaderModel.checkAuth({
				success: function(mod, res){
					if(res.success === true){
						_self.showWarning({
							createdAt: res.createdAt,
							expireAt: res.expireAt
						});
						 
					}else{
						HeaderModel.clearSessionInfo();
						AppRouter.navigate("/login",{trigger:true});
					}		
					
				},
				error: function(mod, res){
					HeaderModel.clearSessionInfo();
					AppRouter.navigate("/login",{trigger:true});
					 
				}
			});
		},
		closeModal: function(){
			this.$el.find('#timeoutModal').modal('hide');
		},
		showWarning: function(tokenData){
			var _self = this;
			
			var createAt = this.getNativeDateFormat(tokenData.createdAt);
			var expireAt = this.getNativeDateFormat(tokenData.expireAt);
			var timeoutIn = this.sessionInvalidateTime(createAt, expireAt);
			
			$(this.contanerEl).find("."+this.className).remove();
			$(this.contanerEl).append(this.$el);
			
			this.undelegateEvents();
			this.delegateEvents();
			
			_self.timer = setTimeout(function(){
				
				$(_self.contanerEl).find('#timeoutModal').modal('show');
				_self.model.set("extendSession", false);
			}, timeoutIn);
		},
		render: function(){
			var _self = this;
			this.$el.html(_self.template());
			
			return this;
		}
	});
	
	return new TimeoutModalView();
	
})