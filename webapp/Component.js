sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/commscope/grbypo/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.commscope.grbypo.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			this.getRouter().initialize();
			// hold the poItem data
			var poItemData = new sap.ui.model.json.JSONModel();
			this.setModel(poItemData, "poItemData");
			var scanMode = new sap.ui.model.json.JSONModel();
			this.setModel(scanMode, "scanMode");
			var vendorMode = new sap.ui.model.json.JSONModel();
			this.setModel(vendorMode, "vendorMode");
			var initMode = {};
			var oIcon = "sap-icon://accept";
			initMode.PO = oIcon;
			initMode.ASN = "";
			initMode.MATID = "";
			initMode.PLCHOLDER = "Scan or Type a PO Number";
			scanMode.setData(initMode);

		},
		destroy: function() {

			sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);

		}
	});
});