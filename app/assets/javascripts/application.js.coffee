#= require jquery
#= require jquery_ujs
#= require bootstrap
#= require moment-2.14.1
#= require select2
#= require lodash
#= require react_ujs
#= require_self
#= require_tree .

React    = window.React    = global.React    = require('react')
ReactDOM = window.ReactDOM = global.ReactDOM = require('react-dom')
Router   = window.Router   = global.Router   = require('react-router').Router
Route    = window.Route    = global.Route    = require('react-router').Route
Link     = window.Link     = global.Link     = require('react-router').Link

ContactsIndex = @ContactsIndex = global.ContactsIndex = require("./contacts/index.js.jsx")
