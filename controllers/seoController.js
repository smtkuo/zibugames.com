const config = require('../config')
const async = require('async')
const request = require('request')
const fs = require('fs')
const Object = require('../helpers/object')
const File = require('../helpers/file')
const bilgisam = require('bilgisam-projects')
const indexController = (new bilgisam()).get({
	project: "./Projects/GamePlatform/controllers/index"
})

exports.sitemapCategories = indexController.sitemapCategories

exports.sitemapTags = indexController.sitemapTags

exports.sitemapGames = indexController.sitemapGames

exports.sitemap = indexController.sitemap

exports.robotstxt = indexController.robotstxt

