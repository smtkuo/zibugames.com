const config = require('../config');
const async = require('async');
const request = require('request');
const Object = require('../helpers/object');
const bilgisam = require('bilgisam-projects');
const Cache = {};
const Games = (new bilgisam()).get({
	project: "./Projects/GamePlatform/services/games"
})
const indexController = (new bilgisam()).get({
	project: "./Projects/GamePlatform/controllers/index"
})

exports.index = (req, res, next) => {
	var query = {};
	var data = {
		breadcrumbs: []
	}
	
	// Default Meta
	data['meta'] = {
		title: "All Games",
		description: this.title+": latest games, best games, all games...",
		url: process.env.PROJECT_Main+"/"
	}
	data["breadcrumbs"].push(data['meta'])

	if(req.params.category != null){
		query.categorysearch = req.params.category
		data['meta'] = {
			title: query.categorysearch + " Games - Category",
			description: "Game category: "+query.categorysearch+" latest games, "+query.categorysearch+" best games, "+query.categorysearch+" all games...",
			url: process.env.PROJECT_Main+"/cat/"+query.categorysearch
		}
		data["breadcrumbs"].push(data['meta'])

		if(req.params.page != null && parseInt(req.params.page)){
			query.pageNum = req.params.page
		}
	}

	if(req.params.tag != null){
		query.tagsearch = req.params.tag
		data['meta'] = {
			title: query.tagsearch + " Games - Tag",
			description: "Game Tags: "+query.tagsearch+" games. "+query.tagsearch+" latest games, "+query.tagsearch+" best games, "+query.tagsearch+" all games...",
			url: process.env.PROJECT_Main+"/tag/"+query.tagsearch
		}
		data["breadcrumbs"].push(data['meta'])
		if(req.params.page != null && parseInt(req.params.page)){
			query.pageNum = req.params.page
		}
	}

	if(req.params.q != null){
		query.parameter = req.params.q.split("-")
		query.select = query.parameter[0]
		query.q = query.parameter[1]

		
		if(query.select == "page"){

			data['meta'] = {
				title: query.q + " Games - Page: "+query.q,
				description: "Page: "+query.q+"."+query.q+" games.",
				url: process.env.PROJECT_Main+"/"+req.params.q
			}
			data["breadcrumbs"].push(data['meta'])
			query.pageNum = query.q
		}else{
			query.notfound = 1
		}
	}

	if(req.query.q != null){
		query.keyword = req.query.q
		data['meta'] = {
			title: query.keyword + " Games - Search Games",
			description: "Search games: "+query.keyword+". Latest "+query.keyword+" games.",
			url: process.env.PROJECT_Main+"/search?q="+req.query.q
		}
		data["breadcrumbs"].push(data['meta'])
		if(req.query.page != null){
			query.pageNum = req.query.page
		}
	}

	async.series({
		a: function(callback) {
			Games.getGames(query, (ret) => {
				if (ret) {
					data['gamelist'] = ret
					callback()
				}
			});
		},
		b: function(callback){
			Games.getCategories(query, (ret) => {
				if (ret) {
					data['gameCategories'] = ret
					callback()
				}
			});
		},
		c: function(callback){
			Games.getTag(query, (ret) => {
				if (ret) {
					data['gameTags'] = ret
					callback()
				}
			});
		}
	}, (err, results) => {

		data['gameTagsHtml'] = `<div>`;
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
				data['gameTagsHtml'] += `
				<a href='/tag/${value}' class="btn btn-sm glass m-1"><i class="fa fa-tag m-1" aria-hidden="true"></i> ${value.replace('-',' ')}</a>
				`
			}
		}
		data['gameTagsHtml'] += `</div>`;
		data['gameCategoriesLinks'] = ``;
		data['gameCategoriesHtml'] = `<div class="flex flex-wrap items-stretch self-center content-center place-content-center">`;
		if(data['gameCategories'] != null){
			data['gameCategories'].sort(() => Math.random() - 0.5)
			for(var key in data['gameCategories']){
				if(key>25){
					break;
				}
				var value = data['gameCategories'][key]
				if(query.keyword != null && query.keyword != ""){
					if(!Object.index.strstr(value,query.keyword)){
						continue;
					}
				}
				value = value.replace('#','').replace(' ','-')
				data['gameCategoriesHtml'] += `
				<a href='/cat/${value}' class="btn glass w-full my-2"><i class="fa fa-gamepad m-1" aria-hidden="true"></i> ${value.replace('-',' ')}</a>
				`
				data['gameCategoriesLinks'] += `<button onclick="location.href = '/cat/${value}';" class="btn glass m-1"><i class="fa fa-gamepad m-1" aria-hidden="true"></i> ${value.replace('-',' ')}</button>`;
			}
			
		}
		data['gameCategoriesHtml'] += `</div>`;


		data['gameHtml'] = `
		<div class="flex flex-nowrap overflow-auto block md:hidden">${data['gameCategoriesLinks']}</div>
		<div class="m-2 overflow-auto block md:hidden">
          <div class="alert glass shadow-lg">
            <div>
              <span class="card-title text-primary-content">${data['meta']['title']}</span>
            </div>
          </div>
        </div>
		<div class="flex flex-wrap items-stretch self-center content-center place-content-center">`;
		if(data['gamelist'][0] != null){
		for(var key in data['gamelist'][0]){
			var value = data['gamelist'][0][key]
			if(value['id'] == value["Title"]  == null){ continue; }
			var gameImage = ""
			if(value['Asset'] != null){
				gameImage = Object.index.tryParseJSONObject(value['Asset'])
				gameImage = gameImage[0] ?? ""
			}
			data['gameHtml'] += `
				<div class="w-5/12 md:w-64 card glass m-2 cursor-pointer" onclick='window.location.href = "/play-game/${value['id']}-${Object.index.convertToSlug(value["Title"])}";'>
				<div class="w-full h-24 md:h-48">
				<figure class="w-full h-24 md:h-48"><img class="w-full h-24 md:h-48" src="${gameImage}" alt="${value["Title"] ?? ""}" /></figure>
				</div>
				<div class="text-center w-full p-1">
				<a href="/play-game/${value['id']}-${Object.index.convertToSlug(value["Title"])}" class="text-sm md:text-xl text-primary-content justify-center">${value["Title"]}</a>
				</div>
				</div>
			`; 

			data['isGameFound'] = 1
		}
		}
		data['gameHtml'] += `</div>`;

		// String replace
		if(query.categorysearch!=null) query.categorysearch = query.categorysearch.replace(" ","-")

		if(query.notfound==1){
			res.render("./pages/notfound", { theme: config.theme, query: query, data: data })
		}

		data['insertBreadcrumbs'] = '<div>'
		for(var key in data["breadcrumbs"]){
			var value = data["breadcrumbs"][key]
			data['insertBreadcrumbs'] += '<a href="'+value["url"]+'">'+value["title"]+'</a>'
			if(key<=data["breadcrumbs"].length-2){
				data['insertBreadcrumbs'] += ' > '
			}
		}
		data['insertBreadcrumbs'] += '</div>'
		
		res.render("./pages/index", { theme: config.theme, query: query, data: data })
	});
};

exports.update = indexController.update

exports.playgame = (req, res, next) => {
	const query = {};
	const data = {
		breadcrumbs: []
	}

	// Default Meta
	data['meta'] = {
		title: "All Games",
		description: this.title+": latest games, best games, all games...",
		url: process.env.PROJECT_Main+"/"
	}
	data["breadcrumbs"].push(data['meta'])

	if(req.params.gid != null){
		var gid = req.params.gid
		query.parameter = gid.split("-")
		query.id = query.parameter[0]
	}else{
		res.render("./pages/notfound", { theme: config.theme, query: query, data: data })
	}

	async.series({
		a: function(callback) {
			Games.viewGames(query, (ret) => {
				if (ret) {
					data['viewGame'] = ret
					callback()
				}
			});
		},
		b: function(callback){
			Games.getCategories(query, (ret) => {
				if (ret) {
					data['gameCategories'] = ret
					callback()
				}
			});
		},
		c: function(callback){
			Games.getTag(query, (ret) => {
				if (ret) {
					data['gameTags'] = ret
					callback()
				}
			});
		}
	}, (err, results) => {
		
		
		data['playGameHTML'] = `<div class="my-2">`;
		if(data['viewGame'] != null){
			var GameDetail = data['viewGame']

			data['meta'] = {
				title: GameDetail['Title'].slice(0, 150),
				description: (GameDetail['Title']+": "+GameDetail['Description']).slice(0, 150)+"...",
				url: process.env.PROJECT_Main+"/play-game/"+req.params.gid
			}
			data["breadcrumbs"].push(data['meta'])

			var GameImage = Object.index.tryParseJSONObject(GameDetail['Asset'])

			data['playGameHTML'] += `
			<div class="m-2 my-6">
				<div class="alert glass">
					<iframe src="${GameDetail['Url']}" title="Game" style="width:100%;height:450px;"></iframe>
				</div>
			</div>
			`;
			data['playGameHTML'] += `
			<div class="m-2 my-6">
			<div class="alert glass">
			<div class="text-primary-content md:w-80 flex-col"><p style="display:block;"><img src="${GameImage[0]}" style="max-width:150px;height:auto;" /></p><p style="display:block;">${GameDetail['Title']}</p></div>
			<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${GameDetail['Description']}</p>
			<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${GameDetail['Instructions']}</p>
			</div>
			</div>`;

		}
		data['playGameHTML'] += `</div>`;

		data['gameCategoriesHtml'] = `<div class="flex flex-wrap items-stretch self-center content-center place-content-center">`;
		if(data['gameCategories'] != null){
			data['gameCategories'].sort(() => Math.random() - 0.5)

			for(var key in data['gameCategories']){
				if(key>25){
					break;
				}
				var value = data['gameCategories'][key]
				if(query.keyword != null && query.keyword != ""){
					if(!Object.index.strstr(value,query.keyword)){
						continue;
					}
				}
				value = value.replace('#','').replace(' ','-')
				data['gameCategoriesHtml'] += `
				<a href='/cat/${value}' class="btn glass w-full my-2"><i class="fa fa-gamepad m-1" aria-hidden="true"></i> ${value.replace('-',' ')}</a>
				`
			}
			
		}
		data['gameCategoriesHtml'] += `</div>`;

		data['gameTagsHtml'] = `<div>`;
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
				data['gameTagsHtml'] += `
				<a href='/tag/${value}' class="btn btn-sm glass m-2"><i class="fa fa-tag m-1" aria-hidden="true"></i> ${value.replace('-',' ')}</a>
				`
			}
		}
		data['gameTagsHtml'] += `</div>`;
		// String replace
		if(query.categorysearch!=null) query.categorysearch = query.categorysearch.replace(" ","-")

		if(query.notfound==1){
			res.render("./pages/notfound", { theme: config.theme, query: query, data: data })
		}

		data['insertBreadcrumbs'] = '<div>'
		for(var key in data["breadcrumbs"]){
			var value = data["breadcrumbs"][key]
			data['insertBreadcrumbs'] += '<a href="'+value["url"]+'">'+value["title"]+'</a>'
			if(key<=data["breadcrumbs"].length-2){
				data['insertBreadcrumbs'] += ' > '
			}
		}
		data['insertBreadcrumbs'] += '</div>'

		res.render("./pages/playgame", { theme: config.theme, query: query, data: data })

	});

	
	
};
