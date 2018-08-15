sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/UIComponent",
], function(Controller, MessageToast, UIComponent) {
    'use strict';
    return Controller.extend('sap.ui.demo.basicTemplate.controller.HelloPanel',{

        onShowHello: function(){
			//var _data = oModel.oData;
			var oBundle = this.getView().getModel("i18n").getResourceBundle();
			var sRecipient = this.getView().getModel().getProperty("/recipient/name");
			var sMsg = oBundle.getText("helloMsg", [sRecipient]);
			MessageToast.show(sMsg);
        },

        onOpenDialog: function(){

            this.getOwnerComponent().helloDialog.open(this.getView());
           

            // var oView = this.getView();
            // var oDialog = oView.byId("helloDialog");

            // if(!oDialog){
            //     oDialog = sap.ui.xmlfragment(oView.getId(),"sap.ui.demo.basicTemplate.view.HelloDialog", this);
            //     oView.addDependent(oDialog);
            // }

            // oDialog.open();
        },
       

        // onCloseDialog : function(){
        //     console.log("qfqfqfqfqfq");
        //     this.getView().byId("helloDialog").close();
        // }
        
    });
    
});