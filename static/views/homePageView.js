define(['jquery',                                                  
    'underscore', 
    'backbone',
	'text!templates/home_page.html'
	], 
	function($,_,Backbone, homePageTemplate){
	
	var HomePageView = Backbone.View.extend({
		el:".c-pageBody",
		template: _.template(homePageTemplate),
		initialize: function(){
			
			this.render();
		},
		render: function(){
			var _self = this;
			this.$el.html(_self.template());
			return this;
		}
	});
	
	return HomePageView;
	
})