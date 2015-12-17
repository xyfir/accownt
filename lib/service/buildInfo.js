/*
	Takes info object and places each field within required or optional sub-objects
	{fname:{optional:bool,required:bool,value:string},lname:{...},...}
							-> Converts to ->
	{required:{fname:"Used for...",...},optional:{lname:"Used for...",...}}
*/
module.exports = function(i) {
	var info = {
		required: {
			
		},
		optional: {
			
		}
	};
	i = JSON.parse(i);
	
	for (var prop in i) {
		if (i.hasOwnProperty(prop)) {
			if (i[prop].required)
				info.required[prop] = i[prop].value;
			else if (i[prop].optional)
				info.optional[prop] = i[prop].value;
		}
	}
	
	return JSON.stringify(info);
};