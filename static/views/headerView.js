define(['jquery',                                                  
    'underscore', 
    'backbone',
	'bootstrap',
	'text!templates/headerTemplate.html'
	], 
	function($,_,Backbone, Bootstrap, headerTemplate){
	
	var HeaderView = Backbone.View.extend({
		el:".c-headerView",
		template: _.template(headerTemplate),
		initialize: function(){
			
			this.listenTo(this.model, "change", this.render);
			this.render();
		},
		getJSON: function(){
			var _self = this;
			var json = _.clone(_self.model.toJSON());
				for(var attr in json) {
					if(json[attr] instanceof Backbone.Model) {
						json[attr] = json[attr].toJSON();   
					}
			}
			return json;
		},
		render: function(){
			var _self = this;
			var json = _self.getJSON(_self.model.toJSON());
			this.$el.html(_self.template(json));
			return this;
		}
	});
	
	return HeaderView;
	
})