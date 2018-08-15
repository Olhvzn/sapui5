// sap.ui.define([
//     "sap/ui/base/ManagedObject",
//     "sap/ui/base/Object"
// ], function (Object) {
// 	"use strict";

// 	return Object.extend("sap.ui.demo.basicTemplate.controller.HelloDialog", {

// 		constructor : function (oView) {
// 			this._oView = oView;	
// 		},

// 		exit : function () {
// 			delete this._oView;
// 		},

// 		open : function () {
// 			var oView = this._oView;
// 			var oDialog = oView.byId("helloDialog");
			
// 			// create dialog lazily
// 			if (!oDialog) {
// 				var oFragmentController = {
// 					onCloseDialog : function () {
// 						oDialog.close();
// 					}
// 				};
// 				// create dialog via fragment factory
// 				oDialog = sap.ui.xmlfragment(oView.getId(), "sap.ui.demo.basicTemplate.view.HelloDialog", oFragmentController);
// 				// connect dialog to the root view of this component (models, lifecycle)
// 				oView.addDependent(oDialog);
// 			}
// 			oDialog.open();
// 		}
// 	});

// });

sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";
	return Object.extend("sap.ui.demo.basicTemplate.controller.HelloDialog", {
		_getDialog : function () {
			// create dialog lazily
			if (!this._oDialog) {
				// create dialog via fragment factory
				this._oDialog = sap.ui.xmlfragment("sap.ui.demo.basicTemplate.view.HelloDialog", this);
			}
			return this._oDialog;
		},
		open : function (oView) {
			var oDialog = this._getDialog();
			// connect dialog to view (models, lifecycle)
			oView.addDependent(oDialog);
			// open dialog
			oDialog.open();
		},
		onCloseDialog : function () {
			this._getDialog().close();
		}
		
	});
});