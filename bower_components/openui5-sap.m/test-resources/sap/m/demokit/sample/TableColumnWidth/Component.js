sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
	"use strict";

	var Component = UIComponent.extend("sap.m.sample.TableColumnWidth.Component", {

		metadata : {
			rootView : {
				"viewName": "sap.m.sample.TableColumnWidth.Table",
				"type": "XML",
				"async": true
			},
			dependencies : {
				libs : [
					"sap.m",
					"sap.ui.layout"
				]
			},
			includes : [ "Table.css" ],
			config : {
				sample : {
					files : [
						"Table.view.xml",
						"Table.controller.js",
						"Table.css"
					]
				}
			}
		}
	});

	return Component;

});
