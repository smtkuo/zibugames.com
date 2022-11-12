const config = require('../config')
const async = require('async')
const request = require('request')
const fs = require('fs')
const Object = require('../helpers/object')
const File = require('../helpers/file')
const bilgisam = require('bilgisam-projects')
const Games = (new bilgisam()).get({
	project: "./Projects/GamePlatform/services/games"
})
const indexController = (new bilgisam()).get({
	project: "./Projects/GamePlatform/controllers/index"
})

const Cache = {};

exports.home = (req, res, next) => {
	return indexController.index(req, res, next, async function (err, results, data, query) {

		// Tag
		data['gameTagsHtml'] = new require('../lib/components/gametag.js')(data, query);

		// CATEGORIES
		var gameCategories = new require('../lib/components/gamecategories.js')(data, query)
		data['gameCategoriesLinks'] = gameCategories['gameCategoriesLinks'];
		data['gameCategoriesHtml'] = gameCategories['gameCategoriesHtml'];

		// GAME
		var getGameHtml = new require('../lib/components/gamehtml.js')(data, query)
		data['gameHtml'] = getGameHtml['gameHtml']
		data['gameSuggestionHtml'] = getGameHtml['gameSuggestionHtml']
		data['isGameFound'] = getGameHtml['isGameFound']

		// String replace
		if (query.categorysearch != null) query.categorysearch = query.categorysearch.replace(" ", "-")

		if (query.notfound == 1) {
			res.render("./pages/notfound", { theme: config.theme, query: query, data: data })
		}

		// Breadcrumbs
		data['insertBreadcrumbs'] = new require('../lib/components/insertbreadcrumbs.js')(data, query)["insertBreadcrumbs"];


		res.render("./pages/index", { theme: config.theme, query: query, data: data })
	})
}


exports.playgame = (req, res, next) => {
	return indexController.playgame(req, res, next, async function (err, results, data, query) {
		data['playGameHTML'] = `<div class="py-2">`;
		if (data['viewGame'] != null) {
			var GameDetail = data['viewGame']
			data['meta'] = {
				title: GameDetail['Title'].slice(0, 150),
				description: (GameDetail['Title'] + ": " + GameDetail['Description']).slice(0, 150) + "...",
				url: process.env.PROJECT_Main + "/play-game/" + req.params.gid
			}
			data["breadcrumbs"].push(data['meta'])

			var GameImage = Object.index.tryParseJSONObject(GameDetail['Asset'])
			var GameImageView = GameImage[0]
			if (GameImage[1] != null) {
				GameImageView = GameImage[1]
			}


			// slug check
			var slugs = query.parameter.slice()
			slugs.shift()
			if (slugs.join("-") != Object.index.convertToSlug(GameDetail["Title"])) {
				return res.redirect('/play-game/' + query.parameter[0] + "-" + Object.index.convertToSlug(GameDetail["Title"]));
			}
			//${Object.index.convertToSlug(value["Title"])}
			// IMAGES
			var GameImageView = ""
			var imageFileName = './public/images/' + Object.index.convertToSlug(GameDetail['id'] + "-" + GameDetail['Title']) + ".jpeg"
			var imageFileNameOptimized = './public/images/cp/' + Object.index.convertToSlug(GameDetail['id'] + "-" + GameDetail['Title']) + ".jpeg"
			if (fs.existsSync(imageFileNameOptimized)) {
				// Optimized Image
				GameImageView = '/images/cp/' + Object.index.convertToSlug(GameDetail['id'] + "-" + GameDetail['Title']) + ".jpeg"
			} else if (fs.existsSync(imageFileName)) {
				// Standart Image
				GameImageView = '/images/' + Object.index.convertToSlug(GameDetail['id'] + "-" + GameDetail['Title']) + ".jpeg"
			} else {
				// Remote Image
				if (GameDetail['Asset'] != null) {
					var GameImage = Object.index.tryParseJSONObject(GameDetail['Asset'])
					GameImageView = GameImage[0]
					for (var keyb in GameImage) {
						var valb = GameImage[keyb]
						if (Object.index.strstr(valb, "512x340.jpeg")) {
							GameImageView = valb;
							break;
						}
					}
					// IMAGE SAVE
					File.index.downloadImage(GameImageView, imageFileName, imageFileNameOptimized)
				}
			}

			// IMAGES END
			data['playGameHTML'] += `
			<div id="gamebuttons" class="p-2 py-6 gamebuttons" style="display:none;">
			<div class="alert glass">
			<button class="btn btn-active btn-primary" onclick="openFullscreen()"><i class="fa fa-arrows-alt m-1" aria-hidden="true"></i> Fullscreen</button>
			</div>
			</div>

			<div class="p-2 py-6">
			<div id="gameLoad" class="alert glass gameLoad" style="height: 100%; display: flex; justify-content: center; align-items: center; overflow: hidden;">
			<div id="gameplay"></div>
			</div>
			</div>

			<div class="p-2 py-6">
			<div class="alert glass">
			<div class="text-primary-content md:w-80 flex-col"><p style="display:block;"><img src="${GameImageView}" style="max-width:150px;height:auto;" /></p><p style="display:block;">${GameDetail['Title']}</p></div>
			<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${GameDetail['Description']}</p>
			<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${GameDetail['Instructions']}</p>
			</div>
			</div>
			</div>
			`;

			data['gamePlayScripts'] = `
			var gameCod = '<iframe id="gameScreenSource" src="${GameDetail['Url']}" title="Game" style="width:100%;height:${GameDetail['Height']}px;"></iframe>'
			
			function openFullscreen() {
			var elem = document.getElementById("gameScreenSource");
			if(elem == null){
				alert("Loading...");
				return;
			}
			if (elem.requestFullscreen) {
				elem.requestFullscreen();
			} else if (elem.webkitRequestFullscreen) { /* Safari */
				elem.webkitRequestFullscreen();
			} else if (elem.msRequestFullscreen) { /* IE11 */
				elem.msRequestFullscreen();
			}
			}
			`;

			// GAME
			data['GameDetail'] = GameDetail
			var getGameHtml = new require('../lib/components/gamehtml.js')(data, query)
			data['gameHtml'] = getGameHtml['gameHtml']
			data['gameSuggestionHtml'] = getGameHtml['gameSuggestionHtml']
			data['isGameFound'] = getGameHtml['isGameFound']
			data['playGameHTML'] += data['gameHtml']
			data['playGameHTML'] += data['gameSuggestionHtml']

			// Tag
			data['gameTagsHtml'] = new require('../lib/components/gametag.js')(data, query);

			// CATEGORIES
			var gameCategories = new require('../lib/components/gamecategories.js')(data, query)
			data['gameCategoriesLinks'] = gameCategories['gameCategoriesLinks'];
			data['gameCategoriesHtml'] = gameCategories['gameCategoriesHtml'];

			// String replace
			if (query.categorysearch != null) query.categorysearch = query.categorysearch.replace(" ", "-")

			if (query.notfound == 1) {
				res.render("./pages/notfound", { theme: config.theme, query: query, data: data })
			}

			data['insertBreadcrumbs'] = new require('../lib/components/insertbreadcrumbs.js')(data, query)["insertBreadcrumbs"];
			res.render("./pages/playgame", { theme: config.theme, query: query, data: data })
		}
	})
};

exports.update = indexController.update
