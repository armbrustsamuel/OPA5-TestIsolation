sap.ui.define(['jquery.sap.global', 'sap/ui/test/matchers/Matcher'], function ($, SortMatcher) {
	"use strict";

	return SortMatcher.extend("sap.ui.test.matchers.AggregationLengthEquals", /** @lends sap.ui.test.matchers.AggregationLengthEquals.prototype */ {

		metadata : {
			publicMethods : [ "isMatching" ],
			properties : {
				/**
				 * The name of the aggregation that is used for matching.
				 */
				name : {
					type : "string" 
				},
				/**
				 * The length that aggregation <code>name</code> should have.
				 */
				length : {
					type : "int"
				}
			}
		},

		isMatching : function (oControl) {
			var sAggregationName = this.getName(),
				fnAggregation = oControl["get" + $.sap.charToUpperCase(sAggregationName, 0)];

			if (!fnAggregation) {
				this._oLogger.error("Control '" + oControl + "' does not have an aggregation called '" + sAggregationName + "'");
				return false;
			} 
			//var iAggregationLength = fnAggregation.call(oControl).length;
			//var iExpectedLength = this.getLength();
			var sPath = fnAggregation.call(oControl)[2].getBindingContext().sPath.toString();
			var bIsMatch = sPath.substring("15","17") === "15";
			//if (!bIsMatch) {
			//	this._oLogger.debug("Control '" + oControl + "' has " + iAggregationLength +
			//		" Objects in the aggregation '" + sAggregationName + "' but it should have " + iExpectedLength);
			//}
			return bIsMatch;
		}

	});

}, /* bExport= */ true);