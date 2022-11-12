const fs = require('fs')
const Object = require('../../helpers/object')
const File = require('../../helpers/file')

module.exports = function (data, query) {
	var object = {}
	object['gameSuggestionHtml'] = ''
	object['gameHtml'] = `
		<div class="flex flex-nowrap overflow-auto block md:hidden">${data['gameCategoriesLinks']}</div>
		<div class="m-2 overflow-auto block md:hidden">
          <div class="alert glass shadow-lg">
            <div>
              <span class="card-title text-primary-content">${data['meta']['title']}</span>
            </div>
          </div>
        </div>
		<div class="flex flex-wrap items-stretch self-center content-center place-content-center">`;
	if (data['gamelist'][0] != null) {
		for (var key in data['gamelist'][0]) {
			var value = data['gamelist'][0][key]
			if (value['id'] == value["Title"] == null) { continue; }
			// IMAGES
			var GameImageView = ""
			var imageFileName = './public/images/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
			var imageFileNameOptimized = './public/images/cp/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
			if (fs.existsSync(imageFileNameOptimized)) {
				// Optimized Image
				GameImageView = process.env.PROJECT_Main + '/images/cp/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
			} else if (fs.existsSync(imageFileName)) {
				// Standart Image
				GameImageView = process.env.PROJECT_Main + '/images/' + Object.index.convertToSlug(value['id'] + "-" + value['Title']) + ".jpeg"
			} else {
				// Remote Image
				if (value['Asset'] != null) {
					var GameImage = Object.index.tryParseJSONObject(value['Asset'])
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

			
			if(data['GameDetail']!= null){
				if(data['GameDetail']["Title"] == value["Title"]){
					continue;
				}
			}

			// IMAGES END
			object['gameHtml'] += `
				<div class="w-5/12 md:w-64 card glass m-2 cursor-pointer" onclick='window.location.href = "${process.env.PROJECT_Main}/play-game/${value['id']}-${Object.index.convertToSlug(value["Title"])}";'>
				<div class="w-full h-24 md:h-48">
				<figure class="w-full h-24 md:h-48"><img class="w-full h-24 md:h-48 lazyload" data-src="${GameImageView}" src="${process.env.PROJECT_Main}/assets/images/loading.gif" alt="${value["Title"] ?? ""}" /></figure>
				</div>
				<div class="text-center w-full p-1">
				<a href="${process.env.PROJECT_Main}/play-game/${value['id']}-${Object.index.convertToSlug(value["Title"])}" class="text-sm md:text-xl text-primary-content justify-center">${value["Title"]}</a>
				</div>
				</div>
			`;
			object['gameSuggestionHtml'] += `
						<div class="m-2 my-6">
						<div class="alert glass">
						<div class="text-primary-content md:w-80 flex-col"><p style="display:block;"><img src="${GameImageView}" style="max-width:150px;height:auto;" /></p><p style="display:block;">${value['Title']}</p><div><button onclick='window.location.href = "${process.env.PROJECT_Main}/play-game/${value['id']}-${Object.index.convertToSlug(value["Title"])}";' class="btn btn-active btn-primary font-bold text-2xl"> <i class="fa fa-gamepad m-1" aria-hidden="true"></i> Play Game !</button></div></div>
						<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${value['Description']}</p>
						<p class="text-primary-content md:w-80 max-h-48 overflow-auto justify-start content-start flex-col">${value['Instructions']}</p>
						</div>
						</div>
					`;
			object['isGameFound'] = 1
		}
	}
	object['gameHtml'] += `</div>`;
	return object
}