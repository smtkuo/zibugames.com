const fs = require('fs');
const client = require('https');
const compress_images = require("compress-images");

// IMAGE OPTIMIZE
exports.index = {
	downloadImage: async function (url, filepath, optimizefilepath){
		try {
			await client.get(url, async (res) => {
				let stream = res.pipe(fs.createWriteStream(filepath));
				stream.on('finish', async () => {
					try{
							INPUT_path_to_your_images = filepath;
							OUTPUT_path = "./public/images/cp/";
							compress_images(INPUT_path_to_your_images, OUTPUT_path, { compress_force: true, statistic: false, autoupdate: false }, false,
								{ jpg: { engine: "mozjpeg", command: false } },
								{ png: { engine: false, command: false } },
								{ svg: { engine: false, command: false } },
								{ gif: { engine: false, command: false } },
							function (error, completed, statistic) {
								if(error != null && completed != null){
									fs.unlink(optimizefilepath, (err => {
										if (err) console.log(err);
										else {
										  console.log("\nDeleted file: "+filepath);
										}
									  }));
								}
							}
							);
						}catch(e){
							console.log(e.message)
						}
				});
			});
		}
		catch (e) { 
			console.log(e.message)
		}
	}
}