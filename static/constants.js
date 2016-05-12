define([], function(){
	
	var config = {
		"registerUserAPI":"api/register",
		"loginAPI": "api/authenticate",
		"logoutAPI": "api/logout",
		"refreshToken" : "api/updateSession",
		"changeProfileInfo": "api/changeProfileInfo",
		"changePassword": "api/changePassword",
		"logoutAllDevices": "api/logoutAll"
	}
	
	return config;
});