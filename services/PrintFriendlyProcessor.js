TallySheets.service("PrintFriendlyProcessor", [ 'DataElementService', 'DataEntrySectionService', function(DataElementService, DataEntrySectionService){
    var pages = [];
    var currentPageIndex;
    var page;
    var heightOfTableHeader = 15;
    var heightOfDataElementInCatCombTable = 12;
    var heightOfDataElementInGeneralDataElement = 9;
    var heightOfSectionTitle = 7;
    var heightOfDataSetTitle = 10;
    var gapBetweenSections = 5;
    var graceHeight = 15;

    var Page = function () {
        var page = {};
        page.heightLeft = 237;
        page.width = 183;
        page.contents = [];
        return page;
    };

    var processTableHeader = function(section){
        _.map(section.dataElements[0].categoryCombo.categoryOptionCombos, function(categoryOptionCombo){
            categoryOptionCombo.name = categoryOptionCombo.name.replace(/,/g, "<br>");
        })
    };

    var divideOptionSetsIntoNewSection = function(section, index, sections){
        console.log(sections);
        var indexOfDEWithOptions = [];
        var currentIndex = 0;
        var pushIndex = 0;
        var newSection;
        _.map(section.dataElements, function(dataElement, index){
              if(dataElement.type == 'OPTIONSET')
                  indexOfDEWithOptions.push(index)
        });

        if((indexOfDEWithOptions.length == 1)  && (section.dataElements.length == 1)) return;

        var pushSection = function(section){
            console.log(sections);
            if(section.dataElements.length > 0) sections.splice(index + (++pushIndex), 0, section);
            console.log(sections);

        };

        var cloneSection = function (section, dataElements) {
            var newSection = _.cloneDeep(section);
            newSection.isDuplicate = true;
            newSection.dataElements = dataElements;
            return newSection;
        };

        _.map(indexOfDEWithOptions, function(indexOfDE){
            newSection = cloneSection(section, _.slice(section.dataElements, currentIndex, indexOfDE));
            pushSection(newSection);
            newSection = cloneSection(section, [section.dataElements[indexOfDE]]);
            newSection.isOptionSet = true;
            pushSection(newSection);
            currentIndex = indexOfDE + 1;
        });

        if(indexOfDEWithOptions.length > 0){
            newSection = cloneSection(section, _.slice(section.dataElements, currentIndex, section.dataElements.length));
            pushSection(newSection);
            sections.splice(index, 1);
            sections[index].isDuplicate = false;
        }
        console.log(sections);
    };
    var divideCatCombsIfNecessary = function (section, index, sections) {
        var dataElement = section.dataElements[0];
        var numberOfFittingColumns = 5;
        if (numberOfFittingColumns < dataElement.categoryCombo.categoryOptionCombos.length) {
            var newDataElements = [];
            _.map(section.dataElements, function (dataElement) {
                var data = _.cloneDeep(dataElement);
                data.categoryCombo.categoryOptionCombos.splice(0, numberOfFittingColumns);
                newDataElements.push(DataElementService.getDataElementFromData(data));
                dataElement.categoryCombo.categoryOptionCombos.splice(numberOfFittingColumns);
            });
            var sectionData = _.cloneDeep(section)
            sectionData.isDuplicate = true;
            sectionData.dataElements = newDataElements;
            sections.splice(index + 1, 0, DataEntrySectionService.getSectionFromData(sectionData))
        }

    };

    var splitLeftAndRightElements = function (section) {
        section.leftSideElements = _.slice(section.dataElements, 0, Math.ceil(section.dataElements.length / 2));
        section.rightSideElements = _.slice(section.dataElements, Math.ceil(section.dataElements.length / 2));
    };


    var processDataSet = function (dataSet) {

        var processSection = function(section, sectionIndex){

            var getHeightForSection = function (section) {
                var height;
                if (section.isCatComb)
                    height = heightOfDataElementInCatCombTable * (section.dataElements.length ) + heightOfTableHeader + gapBetweenSections;
                else {
                    //#TODO: check if dataElement is of type option combo;
                    height =  heightOfDataElementInGeneralDataElement * (Math.ceil(section.dataElements.length / 2)) + gapBetweenSections;
                }
                return section.isDuplicate ? height : height + heightOfSectionTitle;
            };

            var addSectionToPage = function (section, height) {
                if (sectionIndex == 0 && !section.isDuplicate) page.contents.push({type: 'dataSetName', name: dataSet.name});
                page.contents.push({type: 'section', section: section});
                page.heightLeft = page.heightLeft - height;
            };

            var addSectionToNewPage = function (section, height) {
                page = new Page();
                pages[++currentPageIndex] = page;
                addSectionToPage(section, height);
            };

            var getNumberOfElementsThatCanFit = function (section) {
                var overFlow = sectionHeight - page.heightLeft;
                if (section.isCatComb)
                    return section.dataElements.length - Math.round(overFlow / heightOfDataElementInCatCombTable);
                else
                    return section.dataElements.length - Math.round(overFlow * 2 / (heightOfDataElementInGeneralDataElement));
            };
            var breakAndAddSection = function(section){
                if (section.isCatComb) {
                    var newSection = _.cloneDeep(section);
                    newSection.dataElements = section.dataElements.splice(numberOfElementsThatCanFit);
                    newSection.isDuplicate = true;
                    processTableHeader(newSection);
                    addSectionToPage(section, 1000);
                    addSectionToNewPage(newSection, getHeightForSection(newSection));
                }
                else {
                    var newSection = _.cloneDeep(section);
                    (numberOfElementsThatCanFit % 2 == 0) ? 0 : ++numberOfElementsThatCanFit;
                    newSection.dataElements = section.dataElements.splice(numberOfElementsThatCanFit);
                    splitLeftAndRightElements(section);
                    splitLeftAndRightElements(newSection);
                    newSection.isDuplicate = true;
                    addSectionToPage(section, 1000);
                    addSectionToNewPage(newSection, getHeightForSection(newSection));
                }
            };

            var sectionHeight = (sectionIndex == 0) ? getHeightForSection(section) + heightOfDataSetTitle : getHeightForSection(section);
            var overflow = sectionHeight - page.heightLeft;
            if (overflow < 0)
                addSectionToPage(section, sectionHeight);
            else if (overflow < graceHeight)
                addSectionToPage(section, sectionHeight);
            else {
                var numberOfElementsThatCanFit = getNumberOfElementsThatCanFit(section)

                if (numberOfElementsThatCanFit == section.dataElements.length)
                    addSectionToPage(section, sectionHeight);
                else if(numberOfElementsThatCanFit > 1)
                    breakAndAddSection(section);
                else
                    addSectionToNewPage(section, sectionHeight)
            }
        };

        if (!pages[currentPageIndex]) {
            page = new Page();
            pages[currentPageIndex] = page;
        }
        else {
            page = pages[currentPageIndex];
        }

        _.map(dataSet.sections, processSection);

        dataSet.isPrintFriendlyProcessed = true;
    };

    this.process = function(datasets) {
        pages = [];
        currentPageIndex = 0;
        _.map(datasets, function (dataset) {
            for(var i = 0; i < dataset.sections.length; i++){
                if(dataset.sections[i].isCatComb) {
                    divideCatCombsIfNecessary(dataset.sections[i], i, dataset.sections);
                    processTableHeader(dataset.sections[i]);
                }
                else {
                    divideOptionSetsIntoNewSection(dataset.sections[i], i, dataset.sections);
                    splitLeftAndRightElements(dataset.sections[i]);
                }
            }
            processDataSet(dataset)
        });
        console.log(pages);
        return pages;

    }
}]);