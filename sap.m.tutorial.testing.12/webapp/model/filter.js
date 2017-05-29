sap.ui.define([
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator"
	], function( Filter, FilterOperator ) {
	"use strict";
	return {
		filterData: function(oEvent, sQuery) {

			var aFilter = [];
			if (sQuery) {
				aFilter.push(new Filter("ProductName", FilterOperator.Contains, sQuery));
			}
			return aFilter;
		}
	};
});