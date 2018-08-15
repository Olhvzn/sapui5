sap.ui.require([
		'sap/ui/test/Opa5',
		'sap/ui/test/matchers/AggregationLengthEquals',
		'sap/ui/test/matchers/PropertyStrictEquals',
		'sap/ui/demo/bulletinboard/test/integration/pages/Common',
		'sap/ui/test/actions/Press'
	],
	function (Opa5,
			  AggregationLengthEquals,
			  PropertyStrictEquals,
			  Common,
			  Press) {
		"use strict";

		var sViewName = "Worklist",
			sTableId = "table";

		Opa5.createPageObjects({
			onTheWorklistPage: {
				baseClass: Common,
				actions: {
					iPressOnMoreData: function () {
						// Press action hits the "more" trigger on a table
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "The Table does not have a trigger"
						});
					}
				},
				assertions: {
					theTableShouldHavePagination: function () {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							matchers: new AggregationLengthEquals({
								name: "items",
								length: 20
							}),
							success: function () {
								Opa5.assert.ok(true, "The table has 20 items on the first page");
							},
							errorMessage: "Table does not have all entries."
						});
					},

					theTableShouldHaveAllEntries: function () {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							matchers: new AggregationLengthEquals({
								name: "items",
								length: 23
							}),
							success: function () {
								Opa5.assert.ok(true, "The table has 23 items");
							},
							errorMessage: "Table does not have all entries."
						});
					},

					theTitleShouldDisplayTheTotalAmountOfItems: function () {
						return this.waitFor({
							id: "tableHeader",
							viewName: sViewName,
							matchers: function (oPage) {
								var sExpectedText = oPage.getModel("i18n").getResourceBundle().getText("worklistTableTitleCount", [23]);
								return new PropertyStrictEquals({
									name: "text",
									value: sExpectedText
								}).isMatching(oPage);
							},
							success: function () {
								Opa5.assert.ok(true, "The table header has 23 items");
							},
							errorMessage: "The Table's header does not container the number of items: 23"
						});
					}

				}
			}
		});

	});
