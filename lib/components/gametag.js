module.exports = function (data, query) {
	var gameTagHTML = `<div>`;
	if(data['gameTags'] != null){
		data['gameTags'].sort(() => Math.random() - 0.5)
		for(var key in data['gameTags']){
			if(key>25){
				break;
			}
			var value = data['gameTags'][key]
			if(query.keyword != null && query.keyword != ""){
				if(!Object.index.strstr(value,query.keyword)){
					continue;
				}
			}
			value = value.replace('#','').replace(' ','-')
			if(value == ""){
				continue;
			}
			gameTagHTML += `
			<a href='${process.env.PROJECT_Main}/tag/${value}' class="btn btn-sm glass m-1"><i class="fa fa-tag m-1" aria-hidden="true"></i> ${value.replace('-',' ')}</a>
			`
		}
	}
	gameTagHTML += `</div>`;
	return gameTagHTML
}