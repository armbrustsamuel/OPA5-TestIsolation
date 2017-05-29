sap.ui.require([
		'sap/ui/test/Opa5',
		'sap/ui/test/matchers/AggregationLengthEquals',
		'sap/ui/test/matchers/PropertyStrictEquals',
		'sap/ui/test/matchers/BindingPath',
		'sap/ui/demo/bulletinboard/test/integration/pages/Common',
		'sap/ui/test/actions/Press',
		'sap/ui/demo/bulletinboard/test/matchers/SortMatcher'
	],
	function (Opa5,
			  AggregationLengthEquals,
			  PropertyStrictEquals,
			  BindingPath,
			  Common,
			  Press,    
			  SortMatcher) {
		"use strict";

		var sViewName = "Worklist",
			sViewError = "NotFound",
			sTableId = "table";

		Opa5.createPageObjects({
			onTheDialogView: {
				baseClass: Common,
				actions: {
					iSortData: function() {
						var oOkButton = null;
						return this.waitFor({
							searchOpenDialogs : true,
                    		controlType : "sap.m.Button",
							check : function (aButtons) {
		                        return aButtons.filter(function (oButton) {
		                            if(oButton.getText() !== "OK") {
		                                return false;
		                            }
		                            oOkButton = oButton;
		                            return true;
		                        });
		                    },
							success: function (){
								oOkButton.$().trigger("tap");
							},
							errorMessage: "No view Setting Dialog has been opened."
						});
					},
					
					iPressCancelButton: function() {
						var oCancelButton = null;
						return this.waitFor({
							searchOpenDialogs : true,
                    		controlType : "sap.m.Button",
							check : function (aButtons) {
		                        return aButtons.filter(function (oButton) {
		                            if(oButton.getText() !== "Cancel") {
		                                return false;
		                            }
		                            oCancelButton = oButton;
		                            return true;
		                        });
		                    },
							success: function (){
								oCancelButton.$().trigger("tap");
							},
							errorMessage: "No view Setting Dialog has been opened."
						});
					},
					
					iPressOKButton: function() {
						var oOkButton = null;
						return this.waitFor({
							searchOpenDialogs : true,
                    		controlType : "sap.m.Button",
							check : function (aButtons) {
		                        return aButtons.filter(function (oButton) {
		                            if(oButton.getText() !== "OK") {
		                                return false;
		                            }
		                            oOkButton = oButton;
		                            return true;
		                        });
		                    },
							success: function (){
								oOkButton.$().trigger("tap");
							},
							errorMessage: "No view Setting Dialog has been opened."
						});
					}
				},
				assertions: {}
			},
			onTheWorklistPage: {
				baseClass: Common,
				actions: {
					iPressOnMoreData: function () {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "The Table does not have a trigger"
						});
					},
					
					iPressBuyFilterButton: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "toBuy",
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "No filter button to Buy products."
						});
					},
					
					iPressAllProductsFilterButton: function() {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "allProducts",
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "No filter button to Buy products."
						});
					},
					
					iPressSellFilterButton: function() {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "toSell",
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "No filter button to Sell products"
						});
					},
					
					iPressRentFilterButton: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "toRent",
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "No filter button to Rent products"
						});
					},

					iPressOnTheItemWithTheID: function (sId) {
						return this.waitFor({
							controlType: "sap.m.ColumnListItem",
							viewName: sViewName,
							matchers:  new BindingPath({
								path: "/Posts('" + sId + "')"
							}),
							actions: new Press(),
							errorMessage: "No list item with the id " + sId + " was found."
						});
					},
					
					iPressNotFoundPageButton: function (sId) {
						return this.waitFor({
							controlType: "sap.m.Button",
							id: "notFoundButton",
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "No list item with the id " + sId + " was found."
						});
					},
					
					iPressSortFilterButton: function() {
						return this.waitFor({
							id: "sortFilterButton",
							viewName: sViewName,
							actions: new Press(),
							errorMessage: "No view Setting Dialog has been opened."
						});
					}
				},
				assertions: {
					theTableShouldHaveAllEntries: function () {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							matchers:  new AggregationLengthEquals({
								name: "items",
								length: 23
							}),
							success: function () {
								Opa5.assert.ok(true, "The table has 23 items");
							},
							errorMessage: "Table does not have all entries."
						});
					},
					
					theViewSettingsDialogMustBeOpened: function () {
						return this.waitFor({
							id: "viewSettingsDialog",
							controlType: "sap.m.ViewSettingsDialog",
							success: function () {
								Opa5.assert.ok(true, "View Settings Dialog has been opened");
							},
							errorMessage: "View Settings Dialog has been not opened."
						});
					},
					
					thePageNotFoundMustBeTriggered: function () {
						return this.waitFor({
							viewName: sViewError,
							success: function () {
								Opa5.assert.ok(true, "Not Found page has been triggered");
							},
							errorMessage: "Not Found page has been not triggered."
						});
					},
					
					theWorklistMustBeSorted: function () {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							matchers:  new SortMatcher({
								name: "items",
								length: 11
							}),
							success: function () {
								Opa5.assert.ok(true, "The table has 11 items sorted");
							},
							errorMessage: "Table does not have all entries sorted."
						});
					},
					
					theWorklistMustBeFiltered: function () {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							matchers:  new AggregationLengthEquals({
								name: "items",
								length: 11
							}),
							success: function () {
								Opa5.assert.ok(true, "The table has 11 items");
							},
							errorMessage: "Table does not have all entries filtered."
						});
					},
					
					theWorklistMustBeFilteredBuy: function() {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							matchers:  new AggregationLengthEquals({
								name: "items",
								length: 7
							}),
							success: function () {
								Opa5.assert.ok(true, "Table filtered by Buy products");
							},
							errorMessage: "Table does not have all entries filtered."
						});
					},
					
					theWorklistMustBeFilteredSell: function () {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							matchers:  new AggregationLengthEquals({
								name: "items",
								length: 7
							}),
							success: function () {
								Opa5.assert.ok(true, "Table filtered by Sell products");
							},
							errorMessage: "Table does not have all entries filtered."
						});
					},
					
					theWorklistMustBeFilteredRent: function () {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							matchers:  new AggregationLengthEquals({
								name: "items",
								length: 6
							}),
							success: function () {
								Opa5.assert.ok(true, "Table filtered by Rent products");
							},
							errorMessage: "Table does not have all entries filtered."
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
					},

					iShouldSeeTheTable: function () {
						return this.waitFor({
							id: sTableId,
							viewName: sViewName,
							success: function () {
								Opa5.assert.ok(true, "The table is visible");
							},
							errorMessage: "Was not able to see the table."
						});
					}
				}
			}
		});

	});