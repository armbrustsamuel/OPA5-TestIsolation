sap.ui.require([
		'sap/ui/test/Opa5',
		'sap/ui/test/matchers/Properties',
		'sap/ui/demo/bulletinboard/test/integration/pages/Common',
		'sap/ui/test/actions/Press'
	], 
	function (Opa5, Properties, Common, Press) {
		"use strict";
		
		var sViewName = "Worklist",
			sViewError = "NotFound",
			sTableId = "table";
		
		Opa5.createPageObjects({
			onNotFoundPage: {
				baseClass: Common,
				actions: {
					iPressBackButton: function (){
						return this.waitFor({
							viewName: sViewError,
							actions: new Press(),
							errorMessage: "Did not find the nav button on object page"
						});
					}
				},
				assertions: {}
			},
			onTheWorklistPage: {
				baseClass: Common,
				actions: {},
				assertions: {
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