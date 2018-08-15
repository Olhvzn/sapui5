sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.m.sample.TextMaxLines.Component", {

		metadata : {
			rootView : {
				"viewName": "sap.m.sample.TextMaxLines.V",
				"type": "XML",
				"async": true
			},
			includes : [ "style.css" ],
			dependencies : {
				libs : [
					"sap.m"
				]
			},
			config : {
				sample : {
					files : [
						"V.view.xml",
						"style.css"
					]
				}
			}
		}
	});

	return Component;

});
