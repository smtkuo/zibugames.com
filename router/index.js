const express = require('express')
const Router = express.Router()
const indexController = require('../controllers/index')


Router.get('/update', indexController.update)

Router.get('/search', indexController.index)

Router.get('/', indexController.index)


Router.get('/search/:search', indexController.index)
Router.get('/search/:search/:page', indexController.index)


Router.get('/cat/:category', indexController.index)
Router.get('/cat/:category/:page', indexController.index)

Router.get('/tag/:tag', indexController.index)
Router.get('/tag/:tag/:page', indexController.index)

Router.get('/play-game/:gid', indexController.playgame)

Router.get('/:q', indexController.index)

module.exports = Router