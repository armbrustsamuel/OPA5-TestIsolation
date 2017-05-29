sap.ui.require(
	["sap/ui/test/opaQunit"],
	function (opaTest) {
		"use strict";

		QUnit.module("Posts");

		opaTest("Should see the table with all Posts", function (Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			// Actions
			When.onTheWorklistPage.iLookAtTheScreen();

			// Assertions
			Then.onTheWorklistPage.theTitleShouldDisplayTheTotalAmountOfItems();
		});

		opaTest("Should be able to load more items", function (Given, When, Then) {
			// Actions
			When.onTheWorklistPage.iPressOnMoreData();

			// Assertions
			Then.onTheWorklistPage.theTableShouldHaveAllEntries();
		});
		
		opaTest("Should be able to access NotFound page", function(Given, When, Then) {
			// Actions
			When.onTheWorklistPage.iPressNotFoundPageButton();
			// Assertions
			Then.onTheWorklistPage.thePageNotFoundMustBeTriggered().
				and.iTeardownMyAppFrame();
		});
		
		
		
		
		QUnit.module("Filter and Sort");
		
		opaTest("Should open Dialog view when sort/Filter button is pressed.", function(Given, When, Then){
			// Arrangements
			Given.iStartMyApp();
			// Actions
			When.onTheWorklistPage.iPressSortFilterButton();
			// Assertions
			Then.onTheWorklistPage.theViewSettingsDialogMustBeOpened();
		});
		
		opaTest("Should sort data from main screen", function(Given, When, Then) {
			// Actions
			When.onTheDialogView.iPressCancelButton();
			
			When.onTheWorklistPage.iPressSortFilterButton();
			When.onTheDialogView.iPressOKButton();
			// Assertions
			Then.onTheWorklistPage.theWorklistMustBeSorted();
		});
		
		opaTest("Should filter data from main screen", function(Given, When, Then) {
			// Actions
			When.onTheWorklistPage.iPressSortFilterButton();
			When.onTheDialogView.iPressOKButton();
			// Assertions
			Then.onTheWorklistPage.theWorklistMustBeFiltered().
				and.iTeardownMyAppFrame();
		});
		
		QUnit.module("Quick Filter");
		
		opaTest("Should filter data by Quickfilter(buy) ", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();
			
			// Actions
			When.onTheWorklistPage.iPressBuyFilterButton();

			// Assertions
			Then.onTheWorklistPage.theWorklistMustBeFilteredBuy();
		});
		
		opaTest("Should filter data by Quickfilter(sell) ", function(Given, When, Then) {
			
			// Actions
			When.onTheWorklistPage.iPressAllProductsFilterButton();
			When.onTheWorklistPage.iPressSellFilterButton();

			// Assertions
			Then.onTheWorklistPage.theWorklistMustBeFilteredSell();
		});
		
		opaTest("Should filter data by Quickfilter(rent) ", function(Given, When, Then) {
			
			// Actions
			When.onTheWorklistPage.iPressAllProductsFilterButton();
			When.onTheWorklistPage.iPressRentFilterButton();

			// Assertions
			Then.onTheWorklistPage.theWorklistMustBeFilteredRent().
				and.iTeardownMyAppFrame();
		});
		
		// opaTest("Should return error view when posting does not exist", function(Given, When, Then){
		// 	// Actions
		// 	When.onTheWorklistPage.iChangeURI();
		// 	// Assertions
		// 	Then.onTheWorklistPage.thePageNotFoundMustBeTriggered().
		// 		and.iTeardownMyAppFrame();
		// });
	}
);