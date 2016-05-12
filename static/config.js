var articles = {
	views: {}
}

require.config({
	baseUrl: "http://localhost:3000",
    text: {
        useXhr: function() { // Forces 'Text' plugin to not append the .js extension for cross-domain originated template files
            return true;
        }
    },
    paths: {
        jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.3/jquery.min',
        underscore: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min',
        backbone: 'https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.2.1/backbone-min',
		bootstrap: 'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap',
		jqValidator: 'https://cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.11.1/jquery.validate.min',
		validatorRules: 'helpers/validator-rules',
        text: 'https://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text'
       
    },
    shim: {
        
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
		bootstrap:{
			deps:['jquery'],
			exports: 'Bootstrap'
		},
		jqValidator: {
            deps: ['jquery'],
            exports: 'jqValidator'
        },
		validatorRules: {
            deps: ['jquery', 'jqValidator'],
            exports: 'validatorRules'
        }
        
    } 
});
