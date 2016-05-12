define(["jquery", "jqValidator"], function($, jqValidator) {
    $.validator.addMethod("phoneUS", function(phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 9 && phone_number.match(/^(\+?1-?)?(\([2-9]([02-9]\d|1[02-9])\)|[2-9]([02-9]\d|1[02-9]))-?[2-9]([02-9]\d|1[02-9])-?\d{4}$/);
    }, "Please specify a valid phone number.");

    var zipCodeValidator = function(value, element) {
            var parsedVal = 0;
            try {
                parsedVal = parseInt(value, 10);
            } catch (exjs) {}
            return this.optional(element) || (parsedVal != 0 && /^\d{5}-\d{4}$|^\d{5}$/.test(value));
        };
    $.validator.addMethod("zipcodeUS", zipCodeValidator, "Please enter your 5-digit zip code");

    var ssnValidator = function(value, element) {
            return this.optional(element) || /^(\d{3})[\-]?(\d{2})[\-]?(\d{4})$/.test(value);
        }
    $.validator.addMethod("usSocial", ssnValidator, "Please enter a valid SSN.");

    $.validator.addMethod("alphaOnly", function(value, element) {
        return this.optional(element) || value == value.match(/^[a-zA-Z\- ',\s]+$/);
    });
    $.validator.addMethod("alphaNumericOnly", function(value, element) {
        return this.optional(element) || value == value.match(/^[a-zA-Z0-9\-\. ',#&;/\s]+$/);
    });
    $.validator.addMethod("usPhone", function(value, element) {
        var regex = new RegExp("^(\\(\\d{3}\\)|\\d{3})[\\-\\s]?(\\d{3})[\\-\\s]?(\\d{4})$");
        return this.optional(element) || regex.test(value);
    });

    $.validator.addMethod("cardNumber", function(val, elem) {

        var regex = new RegExp("^4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12}$");
        val = val.replace(/-/g, '');
        return this.optional(elem) || regex.test(val);

    });
    
    $.validator.addMethod('validateExpDate', function(v, e) {
        return /^(1[0-2]|0[1-9]|\d)\/([2-9]\d[1-9]\d|[1-9]\d)$/.test(v);
    }, 'Card expiration date is not correct');
});