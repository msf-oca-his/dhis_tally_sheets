TallySheets.config(['$translateProvider', 'uiLocaleProvider', function($translateProvider, uiLocaleProvider) {
	var languages = ['en', 'es', 'fr', 'pt'];
	$translateProvider.useSanitizeValueStrategy('escape'); //TODO: create a story to select sanitize strategy
	_.map(languages, function(language) {
		$translateProvider.translations(language, require('../i18n/' + language + '.js'));
	});
	$translateProvider.fallbackLanguage(['en']);
	var uiLocale = uiLocaleProvider.$get();
	if(uiLocale == '')
		$translateProvider.determinePreferredLanguage();
	else
		$translateProvider.use(uiLocale);
}]);