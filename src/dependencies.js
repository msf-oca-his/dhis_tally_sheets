require("script!../dependencies/bower_components/angular/angular.min.js")
require("script!../dependencies/bower_components/angular-translate/angular-translate.min.js")
require("script!../dependencies/bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js")
require("script!../dependencies/bower_components/angular-route/angular-route.min.js")
require("script!../dependencies/bower_components/angular-cookies/angular-cookies.min.js")
require("script!../dependencies/bower_components/angular-resource/angular-resource.min.js")
require("script!../dependencies/bower_components/jquery/dist/jquery.min.js")
require("script!../dependencies/bower_components/jquery-ui/jquery-ui.min.js")
require("script!../dependencies/bower_components/bootstrap/dist/js/bootstrap.min.js")
require("script!../dependencies/bower_components/bootstrap-select/dist/js/bootstrap-select.min.js")
require("script!../dependencies/bower_components/lodash/dist/lodash.min.js")
window.d2Lib = require("../node_modules/d2/lib/d2.js")
require("../../custom_app_commons/js/angular-commons/dhis-commons/dhis-model.js")
require("../../custom_app_commons/js/angular-commons/dhis-commons/dhis-services.js")
require("../../custom_app_commons/js/utils/utils.js")
window.React = require('react');
window.ReactDOM = require('react-dom');
window.MuiThemeProvider = require('material-ui/styles/MuiThemeProvider').default;
window.HeaderBarComponent = require('d2-ui-dist/lib/app-header/HeaderBar').default;
window.headerBarStore$ = require('d2-ui-dist/lib/app-header/headerBar.store').default;
window.withStateFrom = require('d2-ui-dist/lib/component-helpers/withStateFrom').default;