
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/demo/basicTemplate/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/model/resource/ResourceModel",
	"sap/ui/core/UIComponent",

], function(Controller, formatter, JSONModel, MessageToast, ResourceModel) {
	"use strict";
	var oModel;

	return Controller.extend("sap.ui.demo.basicTemplate.controller.App", {
		onOpenDialog : function () {
		  //this.getOwnerComponent().openHelloDialog();
		  this.getOwnerComponent().helloDialog.open(this.getView());
		}
		
		
		// onInit: function () {

		// 	var arr={
		// 		recipient:{
		// 			name:"WORLD"
		// 		}
		// 	};

		// 	var oModel = new JSONModel(arr);
		// 	this.getView().setModel(oModel);

		// 	//oModel = new sap.ui.model.json.JSONModel("../data/data.json");
		// 	//this.getView().setModel(oModel);
        //     var i18nModel = new ResourceModel({
		// 		bundleName: "sap.ui.demo.basicTemplate.i18n.i18n"
		// 	});
		// 	this.getView().setModel(i18nModel, "i18n");

		// },

		
	});
});




		// onPresskey: function(){
		// 	var input = this.getView().byId("key").getValue();
		// 	var odata = oModel.oData;
		// 	Object.defineProperty(odata,input,{value:this.onPressValue(),
		// 		writable: true,
		// 		enumerable: true,
		// 		configurable: true}
		// 	);

		//     console.log(odata);	
			
		// },

		// onPressValue: function(){
		// 	var input = this.getView().byId("value").getValue();
		// 	return input;			
		// }

		