require([
		'jquery',
		'underscore',
		'backbone',
		'helpers/helpers',
		'router/app_router',
		'models/headerModel',
		'constants',
		'views/headerView',
		'views/homePageView',
		'views/loginView',
		'views/timeoutModalView',
		'views/registrationView',
		'views/accountSettingsView'
    ], 
	function(
		$,
		_, 
		Backbone, 
		helpers, 
		AppRouter, 
		HeaderModel, 
		constants,
		HeaderView, 
		HomePageView, 
		LoginView, 
		TimeoutModalView,
		RegistrationView,
		AccountSettingsView
	){
		
		
		//perform auth check before rendering anything or matching routes
		
		
		//check token validity to redirect to 'login' on session expiry
		HeaderModel.checkAuth({
			success: function(mod, res){
				if(res.success !== true){
					HeaderModel.clearSessionInfo();
					AppRouter.navigate("/",{trigger:true});
					 
				}else{
					TimeoutModalView.showWarning({
						createdAt: res.createdAt,
						expireAt: res.expireAt
					});
				}
					
				
			},
			error: function(mod, res){
				HeaderModel.clearSessionInfo();
				AppRouter.navigate("/login",{trigger:true});
				 
			}
		});
		
		/*$( document ).ajaxStart(function( event, xhr, settings ) {
			HeaderModel.checkAuth({
				success: function(mod, res){
					if(res.success !== true){
						AppRouter.navigate("/",{trigger:true});
						xhr.abort();
					}
						
					 
				},
				error: function(mod, res){
					AppRouter.navigate("/login",{trigger:true});
					xhr.abort();
				}
			});
		}); 
		
		$.ajaxSetup({
			beforeSend: function(jqXHR) {
				HeaderModel.checkAuth({
					success: function(mod, res){
						if(res.success !== true){
							AppRouter.navigate("/",{trigger:true});
							jqXHR.abort();
						}
							
						
					},
					error: function(mod, res){
						AppRouter.navigate("/login",{trigger:true});
						jqXHR.abort();
					}
				});
			},
			complete: function(jqXHR) {
				 
			}
		});*/
		
		(articles.views.headerView !== null && articles.views.headerView !== undefined) ? articles.views.headerView.render() : new HeaderView({model: HeaderModel}); 
		
		
		
		AppRouter.on("route:initializePage", function(){

			(articles.views.homeView !== null && articles.views.homeView !== undefined) ? articles.views.homeView.render() : new HomePageView(); 
			
		});
		
		AppRouter.on("route:onRegisterUser", function(){
			 if(articles.views.registrationView !== null && articles.views.registrationView !== undefined){
				articles.views.registrationView.render();
				articles.views.registrationView.undelegateEvents();
				articles.views.registrationView.delegateEvents();
				
			}else{
				articles.views.registrationView = new RegistrationView();
			}
			
		});
		
		AppRouter.on("route:onLoginUser", function(){
			if(articles.views.loginView !== null && articles.views.loginView !== undefined){
				articles.views.loginView.render();
				articles.views.loginView.undelegateEvents();
				articles.views.loginView.delegateEvents();
				
			}else{
				articles.views.loginView = new LoginView();
				
			}
			 
		});
		

		
		AppRouter.on("route:onUserLogout", function(){
			console.log("onUserLogout..");
			HeaderModel.logout({
				url:constants.logoutAPI,
				method : "POST",
				data: {
					"user_id" : window.sessionStorage.user_id,
					"token" : window.sessionStorage.token
				}
			   
			}, {success: function(res){
				window.sessionStorage.clear();
				AppRouter.navigate("/login",{trigger:true});
			}, error: function(errorThrown){
				throw errorThrown;
			}});
			
			
		}); 
		
		AppRouter.on("route:accountSettings", function(){
			console.log("accountSettings..");
			(articles.views.accountSettingsView !== null && articles.views.accountSettingsView !== undefined) ? articles.views.accountSettingsView.render() : new AccountSettingsView(); 
		});
		
		AppRouter.on("route:defaultRoute", function(){
			AppRouter.navigate("/",{trigger:true});
			
			 
		});
		
		Backbone.history.start();
		
		
});