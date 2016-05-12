define(['underscore', 
    'backbone'], 
	function(_, Backbone){
	
	var UserModel = Backbone.Model.extend({
		defaults: {
            user_id: 0,
            firstName: '',
			lastName: '',
            email: ''
        },
		initialize : function(){
			
		}
	});
	
	return UserModel;
	
})