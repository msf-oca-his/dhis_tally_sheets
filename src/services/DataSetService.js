TallySheets.service("DataSetService", [ '$http', 'd2', function($http, d2) {
  var cachedDataSets = [];

  var determineValueType = function(data){
    if( data.valueType == 'BOOLEAN' )
      return 'BOOLEAN';
    else if( data.valueType == 'NUMBER' || data.valueType == 'INTEGER' )
      return 'NUMBER';
    else
      return 'TEXT';
  };

  var getDataSetFromD2Model = function(dataSetCollection) {
    var DataSet = require('../dhis-model/DataSet.js');
    if(dataSetCollection.size == 0)
      throw "No DataSet with given id found"; //TODO: i18n
    return new DataSet(dataSetCollection.toArray()[0]);
  };

  var cacheDataSet = function(dataSet){
    if( getCachedDataSet(dataSet.id) )
      cachedDataSets.push(dataSet);
  };

  var handleError = function(err) {
    //TODO: pull this out to i18n
    alert("Fetching dataset failed.....");
    console.log('Error while fetching dataset', err);
    //return {isError: true, status: response.status, statusText: response.statusText}
  };

  function getCachedDataSet(dataSetId) {
    var indexOfDataSet = _.indexOf(_.map(cachedDataSets, "id"), dataSetId);
    if(indexOfDataSet == -1)
      return null;
    return cachedDataSets[ indexOfDataSet ];
  }

  this.getDataSet = function(dataSetId) {

    var cachedDataSet = getCachedDataSet(dataSetId);
    if(cachedDataSet)
      return Promise.resolve(cachedDataSet);
    else
      return d2.then(function(d2) {
        return d2.models.dataSets.list({
            paging: false,
            filter: [ 'id:eq:' + dataSetId ],
            fields: 'id, name, sections[ id, name, dataElements[ id, name, valueType, optionSetValue, optionSet[ name, id, options[ name, id ] ], categoryCombo[ id, name, categories[ id, name ] ] ] ]'
          })
          .then(getDataSetFromD2Model)
          .then(cacheDataSet)
          .then(getCachedDataSet(dataSetId))
          .catch(handleError)
      });
  }

} ]);
