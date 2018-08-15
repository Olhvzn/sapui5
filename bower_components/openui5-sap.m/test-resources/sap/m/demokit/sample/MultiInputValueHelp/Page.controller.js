sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/Fragment',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel'
], function(jQuery, Fragment, Controller, Filter, JSONModel) {
	"use strict";

	var CController = Controller.extend("sap.m.sample.MultiInputValueHelp.Page", {
		inputId: '',

		onInit: function () {
			// set explored app's demo model on this sample
			var oModel = new JSONModel(jQuery.sap.getModulePath("sap.ui.demo.mock", "/products.json"));
			// the default limit of the model is set to 100. We want to show all the entries.
			oModel.setSizeLimit(1000000);
			this.getView().setModel(oModel);
		},

		handleValueHelp : function (oEvent) {
			var sInputValue = oEvent.getSource().getValue();

			this.inputId = oEvent.getSource().getId();
			// create value help dialog
			if (!this._valueHelpDialog) {
				this._valueHelpDialog = sap.ui.xmlfragment(
					"sap.m.sample.MultiInputValueHelp.Dialog",
					this
				);
				this.getView().addDependent(this._valueHelpDialog);
			}

			// create a filter for the binding
			this._valueHelpDialog.getBinding("items").filter([new Filter(
				"Name",
				sap.ui.model.FilterOperator.Contains, sInputValue
			)]);

			// open value help dialog filtered by the input value
			this._valueHelpDialog.open(sInputValue);
		},

		_handleValueHelpSearch : function (evt) {
			var sValue = evt.getParameter("value");
			var oFilter = new Filter(
				"Name",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			evt.getSource().getBinding("items").filter([oFilter]);
		},

		_handleValueHelpClose : function (evt) {
			var aSelectedItems = evt.getParameter("selectedItems"),
				oMultiInput = this.byId("multiInput");

			if (aSelectedItems.length > 0) {
				aSelectedItems.forEach(function(oItem) {
					oMultiInput.addToken(new sap.m.Token({
						text: oItem.getTitle()
					}));
				});
			}
		}
	});


	return CController;

});
