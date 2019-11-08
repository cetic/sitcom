/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb


// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)

var componentRequireContext = require.context("src", true)
var ReactRailsUJS = require("react_ujs")
ReactRailsUJS.useContext(componentRequireContext)

global.React       = require('react')
global.ReactDOM    = require('react-dom')
global.Router      = require('react-router').Router
global.Route       = require('react-router').Route
global.Link        = require('react-router').Link
global.hashHistory = require('react-router').hashHistory
global.humps       = require('humps')
global.moment      = require('moment')
global._           = require('lodash')

global.http        = require('../src/shared/http_service.jsx').default

global.Admin                    = {}
global.Admin.CustomFieldsEditor = require('../src/admin/custom_fields/custom_fields_editor.jsx')



