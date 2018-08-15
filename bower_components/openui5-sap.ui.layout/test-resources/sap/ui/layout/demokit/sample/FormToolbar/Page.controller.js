sap.ui.define([
		'jquery.sap.global',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	], function(jQuery, Controller, JSONModel) {
	"use strict";

	var PageController = Controller.extend("sap.ui.layout.sample.FormToolbar.Page", {

		onInit: function (oEvent) {

			// set explored app's demo model on this sample
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/supplier.json"));
			this.getView().setModel(oModel);

			this.getView().bindElement("/SupplierCollection/0");

		}

	});


	return PageController;

});
