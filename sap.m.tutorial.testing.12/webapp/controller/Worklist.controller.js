/*global history*/

sap.ui.define([
	'sap/ui/demo/bulletinboard/controller/BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/demo/bulletinboard/model/formatter',
	'sap/ui/demo/bulletinboard/model/FlaggedType',
	'sap/ui/model/Sorter',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (BaseController, JSONModel, formatter, FlaggedType, Sorter, Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("sap.ui.demo.bulletinboard.controller.Worklist", {
		
		types : {
			flagged: new FlaggedType()
		},
		formatter: formatter,
		_oDialog: null,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function () {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table"),
				oTagsModel = new JSONModel();
				
			oTagsModel.setData({
				tagsList: []
			});

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			
			oTagsModel.tagsList = new JSONModel(
				jQuery.sap.getModulePath("sap/ui/demo/bulletinboard/localService/mockdata", "/Tags.json"));
			this.getView().setModel(oTagsModel, "tokenList");

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [window.location.href]),
				tableBusyDelay: 0,
				allQuantity: 0,
				buyQuantity: 0,
				sellQuantity: 0,
				rentQuantity: 0
			});
			this.setModel(oViewModel, "worklistView");
			
			this._oTable = oTable;
			
			// Create an object of filters
			this._mFilters = {
			  "toBuy": [new sap.ui.model.Filter("Mode", "EQ", "Buy")],
			  "toSell": [new sap.ui.model.Filter("Mode", "EQ", "Sell")],
			  "toRent": [new sap.ui.model.Filter("Mode", "EQ", "Rent")],
			  "all": []
			};
			
			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function () {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 *
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function (oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("worklistView");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			
			// Get the count for all the products and set the value to 'countAll' property
			this.getModel().read("/Posts/$count", {
			 success: function (oData) {
			    oViewModel.setProperty("/allQuantity", oData);
			 }
			});
			// read the count for the buy filter
			this.getModel().read("/Posts/$count", {
			 success: function (oData) {
			    oViewModel.setProperty("/buyQuantity", oData);
			 },
			 filters: this._mFilters.toBuy
			});
			// read the count for the sell filter
			this.getModel().read("/Posts/$count", {
			 success: function(oData){
			    oViewModel.setProperty("/sellQuantity", oData);
			 },
			 filters: this._mFilters.toSell
			});  
			// read the count for the rent filter
			this.getModel().read("/Posts/$count", { 
			 success: function(oData){
			    oViewModel.setProperty("/rentQuantity", oData);
			 },
			 filters: this._mFilters.toRent
			}); 
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function (oEvent) {
			this.getRouter().navTo("post", {
				// The source is the list item that got pressed
				postId: oEvent.getSource().getBindingContext().getProperty("PostID")
			});

		},
		
		handleViewSettingsDialogButtonPressed: function(oEvent) {
			if(!this._oDialog) {
				this._oDialog = new sap.m.ViewSettingsDialog ({
					id: "viewSettingsDialog",
					sortItems: [
						 new sap.m.ViewSettingsItem({ id: "Title", key: "Title",text: "Title"}),
						 new sap.m.ViewSettingsItem({ id: "Category", key: "Category", text: "Category", selected: true}),
						 new sap.m.ViewSettingsItem({ id: "Contact", key: "Contact", text: "Contact"})
					],
					filterItems :[
						new sap.m.ViewSettingsFilterItem({ 
							id: "Price", 
							key: "Price",
							text: "Price",
							items: [
								new sap.m.ViewSettingsItem({ key: "Price", text: "81.00", selected: true}
								)
							]
						})
					],
					confirm: this.onDialogConfirm.bind(this)
				});
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
			this._oDialog.open();
		},
		
		goToNotFoundPage: function () {
			this.getRouter().getTargets().display("notFound", {
				fromTarget: "worklist"
			});
		},
		
		onExit: function() {
			if (this._oDialog){
				this._oDialog.destroy();
			}
		},
		
		onDialogConfirm: function(oEvent) {
			var mParams = oEvent.getParameters();
			var oView = this.getView();
			var oTable = oView.byId("table");
			var oBinding = oTable.getBinding("items");
			
			var aSorter = [];
			if (mParams.sortItem) {
				var sPath = mParams.sortItem.getKey();
				var bDescending = mParams.sortDescending;
				aSorter.push(new Sorter(sPath, bDescending));
				oBinding.sort(aSorter);
			} 

			var aFilters = [];
			jQuery.each(mParams.filterItems, function (i,oItem){
				var aSplit = oItem.getKey().split("___");
				var sFilterPath = aSplit[0];
				var sOperator = FilterOperator.LE;
				var sValue1 = oItem.getProperty("text");
				var oFilter = new Filter(sFilterPath, sOperator, sValue1);
				aFilters.push(oFilter);
			});
			oBinding.filter(aFilters);
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Sets the item count on the worklist view header
		 * @param {int} iTotalItems the total number of items in the table
		 * @private
		 */
		_updateListItemCount: function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				this.oViewModel.setProperty("/worklistTableTitle", sTitle);
			}
		},

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */
		onShareEmailPress: function () {
			var oViewModel = this.getModel("worklistView");
			sap.m.URLHelper.triggerEmail(
				null,
				oViewModel.getProperty("/shareSendEmailSubject"),
				oViewModel.getProperty("/shareSendEmailMessage")
			);
		},
		
		onSearch : function (oEvent) {

			// build filter array
			var aFilter = [];
			var sQuery = oEvent.getParameter("query");
			if (sQuery) {
				aFilter.push(new Filter("Title", FilterOperator.Contains, sQuery));
			}

			// filter binding
			var oView = this.getView();
			var oTable = oView.byId("table");
			var oBinding = oTable.getBinding("items");
			oBinding.filter(aFilter);
		},
		
		/**
		 * Event handler when a filter tab gets pressed
		 * @param {sap.ui.base.Event} oEvent the filter tab event
		 * @public
		 */
		onQuickFilter: function(oEvent) {
		   var oBinding = this._oTable.getBinding("items"),
		      sKey = oEvent.getParameter("selectedKey");
		   oBinding.filter(this._mFilters[sKey]);
		}
	});

});