
define(['jquery',
		'underscore',
		'backbone'
		
    ], 
	function($,_, Backbone){
		
		var AppRouter = Backbone.Router.extend({
		   initialize: function(options) {

		   },
		   routes: {

			   'register': 'onRegisterUser',
			   'login': 'onLoginUser',
			   'logout' : 'onUserLogout',
			   'account-settings' : 'accountSettings',
			   '': 'initializePage',
			   '*default': 'defaultRoute'
		   }
	   });
	
		return new AppRouter();
});

