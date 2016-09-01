//= require jquery
//= require jquery_ujs
//= require bootstrap
//= require select2
//= require lodash
//= require react_ujs
//= require_self
//= require_tree .

global.React       = require('react')
global.ReactDOM    = require('react-dom')
global.Router      = require('react-router').Router
global.Route       = require('react-router').Route
global.Link        = require('react-router').Link
global.hashHistory = require('react-router').hashHistory
global.humps       = require('humps')
global.moment      = require('moment')

global.http = require('./shared/http_service.es6')

global.Routes = require('./routes.es6')

