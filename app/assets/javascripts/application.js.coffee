#= require jquery
#= require jquery_ujs
#= require bootstrap
#= require moment-2.14.1
#= require select2
#= require lodash
#= require react_ujs
#= require_self
#= require_tree .

global.React    = require('react')
global.ReactDOM = require('react-dom')
global.Router   = require('react-router').Router
global.Route    = require('react-router').Route
global.Link     = require('react-router').Link

global.ContactsIndex = require('./contacts/index.js.jsx')
