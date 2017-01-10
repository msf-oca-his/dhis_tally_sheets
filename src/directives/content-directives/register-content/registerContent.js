TallySheets.directive('registerContent', ['Config', function(config) {
	return {
		restrict: 'E',
		template: require('./registerContentView.html'),
		scope: {
			content: '='
		},
		link: function($scope) {
			var pageType = 'A4';
			$scope.rowHeight = config.Register.dataEntryRowHeight + config.Metrics.mm;
			$scope.rows = new Array(Math.floor((config.PageTypes[pageType].LandScape.availableHeight - config.Register.pageHeaderHeight - config.Register.tableHeaderHeight) / config.Register.dataEntryRowHeight));

			$scope.getWidthOfRegisterColumn = function(registerColumn) {
				if(registerColumn.renderType) {
					return registerColumn.renderType.width + config.Metrics.mm;
				}
				return config.Register.defaultColumnWidth + config.Metrics.mm
			}
		}
	};
}]);
