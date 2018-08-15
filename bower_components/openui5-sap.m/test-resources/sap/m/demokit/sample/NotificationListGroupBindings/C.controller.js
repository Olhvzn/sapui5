sap.ui.define([
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/m/MessageToast',
	'sap/ui/model/json/JSONModel'
], function (jQuery, Controller, MessageToast, JSONModel) {
	"use strict";

	var CController = Controller.extend("sap.m.sample.NotificationListGroupBindings.C", {

		onInit : function (evt) {
			var oData = {
				"NotificationGroups": [
					{
						"title": "Orders waiting for approval",
						"creationDate": "1 hour ago",
						"showEmptyGroup": true,
						"showCloseButton": true,
						"groupItems": [
							{
								"title": "New order (#2525)",
								"description": "Aliquam quis varius ligula. In justo lorem, lacinia ac ex at, vulputate dictum turpis.",
								"priority": sap.ui.core.Priority.High,
								"unread": true,
								"authorName": "Michael Muller",
								"authorPicture": "sap-icon://person-placeholder",
								"onItemClose": "onItemClose",
								"onListItemPress": "onListItemPress",
								"itemButtons": [
									{
										"text": 'Accept',
										"type": "Accept",
										"press": "onAcceptPress"
									},
									{
										"text": 'Reject',
										"type": "Reject",
										"press": "onRejectPress"
									}
								]

							},
							{
								"title": "New order (#2526)",
								"description": "Lacinia ac ex at, vulputate dictum turpis.",
								"priority": sap.ui.core.Priority.Low,
								"unread": true,
								"itemButtons": [
									{
										"text": 'Accept',
										"type": "Accept",
										"press": "onAcceptPress"
									},
									{
										"text": 'Reject',
										"type": "Reject",
										"press": "onRejectPress"
									}
								]

							}
						],
						"groupButtons": [
							{
								"text": 'Accept All',
								"type": "Accept",
								"press": "onAcceptPress"
							},
							{
								"text": 'Reject All',
								"type": "Reject",
								"press": "onRejectPress"
							}
						]
					},
					{
						"title": "New order (#2526)",
						"creationDate": "1 hour ago",
						"showEmptyGroup": true,
						"showCloseButton": true,
						"groupItems": [
						],
						"groupButtons": [
							{
								"text": 'Accept All',
								"type": "Accept",
								"press": "onAcceptPress"
							},
							{
								"text": 'Reject All',
								"type": "Reject",
								"press": "onRejectPress"
							}
						]
					}
				]
			};
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
		},

		onListItemPress: function (oEvent) {
			MessageToast.show('Item Pressed: ' + oEvent.getSource().getTitle());
		},

		onRejectPress: function () {
			MessageToast.show('Reject Button Pressed');
		},

		onAcceptPress: function () {
			MessageToast.show('Accept Button Pressed');
		},

		onItemClose: function (oEvent) {
			var oItem = oEvent.getSource(),
				oList = oItem.getParent();

			oList.removeItem(oItem);

			MessageToast.show('Item Closed: ' + oEvent.getSource().getTitle());
		}
	});

	return CController;

});
