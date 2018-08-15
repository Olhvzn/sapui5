/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides the Design Time Metadata for the sap.ui.layout.form.Form control
sap.ui.define([],
	function() {
	"use strict";

	return {
		palette: {
			group: "LAYOUT",
			icons: {
				svg: "sap/ui/layout/designtime/form/Form.icon.svg"
			}
		},
		aggregations : {
			title : {
				ignore : true
			},
			toolbar : {
				ignore : function(oForm){
					return !oForm.getToolbar();
				},
				domRef : function(oForm){
					return oForm.getToolbar().getDomRef();
				}
			},
			formContainers : {
				childNames : {
					singular : "GROUP_CONTROL_NAME",
					plural : "GROUP_CONTROL_NAME_PLURAL"
				},
				domRef: ":sap-domref",
				actions: {
					move: "moveControls",
					createContainer :  {
						changeType : "addGroup",
						isEnabled : true,
						getCreatedContainerId : function(sNewControlID) {
							return sNewControlID;
						}
					}
				}

			}
		}
	};

}, /* bExport= */ false);