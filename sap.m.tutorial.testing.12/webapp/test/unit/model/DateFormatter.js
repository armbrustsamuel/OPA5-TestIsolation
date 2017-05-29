sap.ui.require([
	"sap/ui/demo/bulletinboard/model/DateFormatter",
	"sap/ui/core/Locale"
],function(DateFormatter,Locale){
	var oFormatter = null;
	
	QUnit.module("DateFormatter", {
		beforeEach: function() {
			oFormatter = new DateFormatter({
				now : function() {
					return new Date(2015, 9, 14, 14, 0, 0, 0).getTime();
				},
				locale : new Locale("en-US")	
			});
		}
	});
	
	QUnit.test("Should return null string if no date is given", function(assert) {
		// var oFormatter = new DateFormatter({
		// 	locale : new Locale("en-US")
		// });	
		var sFormattedDate = oFormatter.format(null);
		assert.strictEqual(sFormattedDate, "");
	});
	
	QUnit.test("Should return time if date from today", function(assert){
		// var oFormatter = new DateFormatter({
		// 	locale : new Locale("en-US")
		// });	
		var oDate = new Date(2015,9,14,12,5,0,0);
		var sFormattedDate = oFormatter.format(oDate);
		
		assert.strictEqual(sFormattedDate, "12:05 PM");
	});
	
	QUnit.test("Should return 'yesterday' if date is yesterday", function(assert){
		var oDate = new Date(2015,9,13);
		var sFormattedDate = oFormatter.format(oDate);
		
		assert.strictEqual(sFormattedDate, "yesterday");
	});
	
	QUnit.test("Should return weekday if date < 7 days ago", function(assert) {
		var oDate = new Date(2015, 9, 11);
		var sFormattedDate = oFormatter.format(oDate);
		assert.strictEqual(sFormattedDate, "Sunday");	
	});
	
	QUnit.test("Should return date w/o time if date > 7 days ago", function(assert) {
		var oDate = new Date(2015, 9, 7);
		var sFormattedDate = oFormatter.format(oDate);
		assert.strictEqual(sFormattedDate, "Oct 7, 2015");
	});
});