exports.index = {
	tryParseJSONObject: function (jsonString){
		try {
			var o = JSON.parse(jsonString);

			if (o && typeof o === "object") {
				return o;
			}
		}
		catch (e) { 
			console.log(e.message)
		}
	
		return jsonString;
	},
	strstr(haystack, needle, bool) {
		var pos = 0;
	
		haystack += "";
		pos = haystack.indexOf(needle); if (pos == -1) {
			return false;
		} else {
			if (bool) {
				return haystack.substr(0, pos);
			} else {
				return haystack.slice(pos);
			}
		}
	},
	convertToSlug(Text) {
		return Text.toLowerCase()
				   .replace(/ /g, '-')
				   .replace(/[^\w-]+/g, '');
	}
}