sap.ui.define([
	"sap/ui/demo/bulletinboard/controller/BaseController"
], function(BaseController){
	"use strict";
	return BaseController.extend("sap.ui.demo.bulletinboard.controller.NotFound",{
		
		onInit: function() {
			var oRouter = this.getRouter();
			var oTarget = oRouter.getTarget("notFound");
			oTarget.attachDisplay(function(oEvent) {
				this._oData = oEvent.getParameter("data");
			}, this);
		},
		
		onNavBack: function() {
			if (this._oData && this._oData.fromTarget) {
				this.getRouter().getTargets().display(this._oData.fromTarget);
				delete this._oData.fromTarget;
				return;
			}
			BaseController.prototype.onNavBack.apply(this, arguments);
		}
	});
});