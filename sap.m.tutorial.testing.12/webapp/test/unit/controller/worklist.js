sap.ui.require([
	"sap/ui/demo/bulletinboard/controller/Worklist.controller"
], function(Controller) {
	
	QUnit.module("Test controller", {
		beforeEach: function (){
			this.aItems = [ 
				{
				"PostID": "PostID_1",
				"Title": "29'er Mountain Bike (red)",
				"Timestamp": "/Date(1428223780000)/",
				"Description": "A great mountainbike, barely used and good as new. Pedals and saddle included",
				"Category": "Bicycles",
				"Contact": "contact.me07@gmail.com",
				"Currency": "USD",
				"Price": 81,
				"Flagged": 0
			  },
			  {
				"PostID": "PostID_2",
				"Title": "Football (rare with signatures)",
				"Timestamp": "/Date(1428504382000)/",
				"Description": "A trophy for collectors, 2014 football with original signatures from the german national soccer team and the spirit of the world cup.",
				"Category": "Sports",
				"Contact": "soccernerd@hotmail.de",
				"Currency": "EUR",
				"Price": 420,
				"Flagged": 0
			}];
			this.controller = new Controller();
			this.sSelectedItem = "Category";
			this.bDescending = true;
			this.aSortedItems = null;
		}
	});
	
	QUnit.test("Should return controller _oDialog object ", function(assert){
	
		assert.strictEqual(this.controller._oDialog, null);
	});
	
	QUnit.test("Should sort data from model descending by Title", function(assert){
		this.bDescending = true;
		this.aSortedItems = this.controller.onSort(this.sSelectedItem,this.aItems,this.bDescending);
		assert.strictEqual(this.aSortedItems[0],this.aItems[0]);
	});
	
	QUnit.test("Should sort data from model ascending by Title", function(assert){
		this.bDescending = false;
		var aItemsToSort = this.aItems;
		this.aSortedItems = this.controller.onSort(this.sSelectedItem,aItemsToSort,this.bDescending);
		assert.strictEqual(this.aSortedItems[0],this.aItems[1]);
	});
	
});