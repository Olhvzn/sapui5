// sap.ui.define([
// 	"sap/ui/core/UIComponent",
// 	"sap/ui/Device",
// 	"sap/ui/demo/basicTemplate/model/models",
// 	"sap/ui/model/json/JSONModel",
// 	"sap/ui/model/resource/ResourceModel",
// 	"sap/ui/demo/basicTemplate/controller/HelloDialog"
// ], function(UIComponent, JSONModel, ResourceModel, HelloDialog) {
// 	"use strict";
// 	return UIComponent.extend("sap.ui.demo.basicTemplate.Component",{

// 		metadata:{
// 			manifest : "json"
// 		},
		
// 		init : function (){
// 		UIComponent.prototype.init.apply(this, arguments);
// 			var oData = {
// 				recipient:{
// 					name:"WORLD"
// 				}
// 			};

// 			var oModel = new sap.ui.model.json.JSONModel(oData);
// 			this.setModel(oModel);

// 			this._helloDialog = new HelloDialog();


// 			// var i18nModel = new sap.ui.model.resource.ResourceModel({
// 			// 	bundleName: "sap.ui.demo.basicTemplate.i18n.i18n"
// 			// });
// 			// this.setModel(i18nModel, "i18n");
// 		},

// 		exit: function(){
// 			this._helloDialog.destroy();
// 			delete this._helloDialog;
// 		},

// 		openHelloDialog : function(){
// 			this._helloDialog.open();
// 		}


// 	});
// });

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/demo/basicTemplate/controller/HelloDialog"
], function (UIComponent, JSONModel, HelloDialog) {
	"use strict";
	return UIComponent.extend("sap.ui.demo.basicTemplate.Component", {
		metadata : {
			manifest : "json"	
		},
		init : function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			// set data model
			var oData = {
				recipient : {
					name : "World"
				}
			};
			var oModel = new JSONModel(oData);
			this.setModel(oModel);
			// set dialog
			this.helloDialog = new HelloDialog();
		}
	});
});
	