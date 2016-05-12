define([], function(){
	
	var config = {
		"registerUserAPI":"api/register",
		"loginAPI": "api/authenticate",
		"logoutAPI": "api/logout",
		"refreshToken" : "api/updateSession",
		"changeProfileInfo": "api/changeProfileInfo",
		"changePassword": "api/changePassword",
		"logoutAllDevices": "api/logoutAll",
		"show_session_timeout" : 2//time-out modal will pop-up before 2 mins of server time-out.
	}
	
	return config;
});