/*global history */
sap.ui.define([
		"sap/ui/demo/orderbrowser/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Sorter",
		"sap/m/GroupHeaderListItem",
		"sap/ui/Device",
		"sap/ui/demo/orderbrowser/model/formatter",
		"sap/ui/core/format/DateFormat"
	], function (BaseController, JSONModel, Filter, FilterOperator, Sorter, GroupHeaderListItem, Device, formatter, DateFormat) {
		"use strict";

		return BaseController.extend("sap.ui.demo.orderbrowser.controller.Master", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */

			/**
			 * Called when the master list controller is instantiated. It sets up the event handling for the master/detail communication and other lifecycle tasks.
			 * @public
			 */
			onInit : function () {
				// Control state model
				var oList = this.byId("list"),
					oViewModel = this._createViewModel(),
					// Put down master list's original value for busy indicator delay,
					// so it can be restored later on. Busy handling on the master list is
					// taken care of by the master list itself.
					iOriginalBusyDelay = oList.getBusyIndicatorDelay();

				this._oGroupFunctions = {
					CompanyName: function (oContext) {
						var sCompanyName = oContext.getProperty("Customer/CompanyName");
						return {
							key: sCompanyName,
							text: sCompanyName
						};
					},

					OrderDate: function (oContext) {
						var oDate = oContext.getProperty("OrderDate"),
							iYear = oDate.getFullYear(),
							iMonth = oDate.getMonth() + 1,
							sMonthName = this._oMonthNameFormat.format(oDate);

						return {
							key: iYear + "-" + iMonth,
							text: this.getResourceBundle().getText("masterGroupTitleOrderedInPeriod", [sMonthName, iYear])
						};
					}.bind(this),

					ShippedDate: function (oContext) {
						var oDate = oContext.getProperty("ShippedDate");
						// Special handling needed because shipping date may be empty (=> not yet shipped).
						if (oDate != null) {
							var iYear = oDate.getFullYear(),
								iMonth = oDate.getMonth() + 1,
								sMonthName = this._oMonthNameFormat.format(oDate);

							return {
								key: iYear + "-" + iMonth,
								text: this.getResourceBundle().getText("masterGroupTitleShippedInPeriod", [sMonthName, iYear])
							};
						} else {
							return {
								key: 0,
								text: this.getResourceBundle().getText("masterGroupTitleNotShippedYet")
							};
						}
					}.bind(this)
				};
				this._oMonthNameFormat = DateFormat.getInstance({ pattern: "MMMM"});

				this._oList = oList;

				// keeps the filter and search state
				this._oListFilterState = {
					aFilter : [],
					aSearch : []
				};

				this.setModel(oViewModel, "masterView");
				// Make sure, busy indication is showing immediately so there is no
				// break after the busy indication for loading the view's meta data is
				// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
				oList.attachEventOnce("updateFinished", function(){
					// Restore original busy indicator delay for the list
					oViewModel.setProperty("/delay", iOriginalBusyDelay);
				});

				this.getView().addEventDelegate({
					onBeforeFirstShow: function () {
						this.getOwnerComponent().oListSelector.setBoundMasterList(oList);
					}.bind(this)
				});

				this.getRouter().getRoute("master").attachPatternMatched(this._onMasterMatched, this);
				this.getRouter().attachBypassed(this.onBypassed, this);
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * After list data is available, this handler method updates the
			 * master list counter and hides the pull to refresh control, if
			 * necessary.
			 * @param {sap.ui.base.Event} oEvent the update finished event
			 * @public
			 */
			onUpdateFinished : function (oEvent) {
				// update the master list object counter after new data is loaded
				this._updateListItemCount(oEvent.getParameter("total"));
				// hide pull to refresh if necessary
				//this.byId("pullToRefresh").hide();
			},

			/**
			 * Event handler for the master search field. Applies current
			 * filter value and triggers a new search. If the search field's
			 * 'refresh' button has been pressed, no new search is triggered
			 * and the list binding is refresh instead.
			 * @param {sap.ui.base.Event} oEvent the search event
			 * @public
			 */
			onSearch : function (oEvent) {
				if (oEvent.getParameters().refreshButtonPressed) {
					// Search field's 'refresh' button has been pressed.
					// This is visible if you select any master list item.
					// In this case no new search is triggered, we only
					// refresh the list binding.
					this.onRefresh();
					return;
				}

				var sQuery = oEvent.getParameter("query");

				if (sQuery) {
					this._oListFilterState.aSearch = [new Filter("CustomerName", FilterOperator.Contains, sQuery)];
				} else {
					this._oListFilterState.aSearch = [];
				}
				this._applyFilterSearch();

			},

			/**
			 * Event handler for refresh event. Keeps filter, sort
			 * and group settings and refreshes the list binding.
			 * @public
			 */
			onRefresh : function () {
				this._oList.getBinding("items").refresh();
			},

			/**
			 * Event handler for the list selection event
			 * @param {sap.ui.base.Event} oEvent the list selectionChange event
			 * @public
			 */
			onSelectionChange : function (oEvent) {
				// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			},

			/**
			 * Event handler for the bypassed event, which is fired when no routing pattern matched.
			 * If there was an object selected in the master list, that selection is removed.
			 * @public
			 */
			onBypassed : function () {
				this._oList.removeSelections(true);
			},

			/**
			 * Used to create GroupHeaders with non-capitalized caption.
			 * These headers are inserted into the master list to
			 * group the master list's items.
			 * @param {Object} oGroup group whose text is to be displayed
			 * @public
			 * @returns {sap.m.GroupHeaderListItem} group header with non-capitalized caption.
			 */
			createGroupHeader : function (oGroup) {
				return new GroupHeaderListItem({
					title : oGroup.text,
					upperCase : false
				});
			},

			/**
			 * Event handler for navigating back.
			 * We navigate back in the browser history
			 * @public
			 */
			onNavBack : function() {
				history.go(-1);
			},

			/**
			 * Event handler called when ViewSettingsDialog has been confirmed, i.e.
			 * has been closed with 'OK'. In the case, the currently chosen filters or groupers
			 * are applied to the master list, which can also mean that they
			 * are removed from the master list, in case they are
			 * removed in the ViewSettingsDialog.
			 * @param {sap.ui.base.Event} oEvent the confirm event
			 * @public
			 */
			onConfirmViewSettingsDialog : function (oEvent) {
				var aFilterItems = oEvent.getParameter("filterItems"),
					aFilters = [],
					aCaptions = [];
				aFilterItems.forEach(function (oItem) {
					switch (oItem.getKey()) {
						case "Shipped":
							aFilters.push(new Filter("ShippedDate", FilterOperator.NE, null));
							break;
						case "NotShipped":
							aFilters.push(new Filter("ShippedDate", FilterOperator.EQ, null));
							break;
						default:
						break;
					}
					aCaptions.push(oItem.getText());
				});
				this._oListFilterState.aFilter = aFilters;
				this._updateFilterBar(aCaptions.join(", "));
				this._applyFilterSearch();
				this._applyGrouper(oEvent);
			},

			/**
			 * Apply the chosen grouper to the master list
			 * @param {sap.ui.base.Event} oEvent the confirm event
			 * @private
			 */
			_applyGrouper: function (oEvent) {
				var mParams = oEvent.getParameters(),
					sPath,
					bDescending,
					aSorters = [];
				// apply sorter to binding
				if (mParams.groupItem) {
					mParams.groupItem.getKey() === "CompanyName" ?
						sPath = "Customer/" + mParams.groupItem.getKey() : sPath = mParams.groupItem.getKey();
					bDescending = mParams.groupDescending;
					var vGroup = this._oGroupFunctions[mParams.groupItem.getKey()];
					aSorters.push(new Sorter(sPath, bDescending, vGroup));
				}
				this._oList.getBinding("items").sort(aSorters);
			},

			/* =========================================================== */
			/* begin: internal methods                                     */
			/* =========================================================== */


			_createViewModel : function() {
				return new JSONModel({
					isFilterBarVisible: false,
					filterBarLabel: "",
					delay: 0,
					titleCount: 0,
					noDataText: this.getResourceBundle().getText("masterListNoDataText")
				});
			},

			_onMasterMatched :  function() {
				//Set the layout property of the FCL control to 'OneColumn'
				this.getModel("appView").setProperty("/layout", "OneColumn");
			},

			/**
			 * Shows the selected item on the detail page
			 * On phones a additional history entry is created
			 * @param {sap.m.ObjectListItem} oItem selected Item
			 * @private
			 */
			_showDetail : function (oItem) {
				// set the layout property of FCL control to show two columns
				this.getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				var bReplace = !Device.system.phone;
				this.getRouter().navTo("object", {
					objectId : oItem.getBindingContext().getProperty("OrderID")
				}, bReplace);
			},

			/**
			 * Sets the item count on the master list header
			 * @param {int} iTotalItems the total number of items in the list
			 * @private
			 */
			_updateListItemCount : function (iTotalItems) {
				// only update the counter if the length is final
				if (this._oList.getBinding("items").isLengthFinal()) {
					this.getModel("masterView").setProperty("/titleCount", iTotalItems);
				}
			},

			/**
			 * Internal helper method to apply both filter and search state together on the list binding
			 * @private
			 */
			_applyFilterSearch : function () {
				var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter),
					oViewModel = this.getModel("masterView");
				this._oList.getBinding("items").filter(aFilters, "Application");
				// changes the noDataText of the list in case there are no filter results
				if (aFilters.length !== 0) {
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
				} else if (this._oListFilterState.aSearch.length > 0) {
					// only reset the no data text to default when no new search was triggered
					oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
				}
			},

			/**
			 * Internal helper method that sets the filter bar visibility property and the label's caption to be shown
			 * @param {string} sFilterBarText the selected filter value
			 * @private
			 */
			_updateFilterBar : function (sFilterBarText) {
				var oViewModel = this.getModel("masterView");
				oViewModel.setProperty("/isFilterBarVisible", (this._oListFilterState.aFilter.length > 0));
				oViewModel.setProperty("/filterBarLabel", this.getResourceBundle().getText("masterFilterBarText", [sFilterBarText]));
			},

			/**
			 * Event handler for the filter and group buttons to open the ViewSettingsDialog.
			 * @param {sap.ui.base.Event} oEvent the button press event
			 * @public
			 */
			onOpenViewSettings : function (oEvent) {
				if (!this._oViewSettingsDialog) {
					this._oViewSettingsDialog = sap.ui.xmlfragment("sap.ui.demo.orderbrowser.view.ViewSettingsDialog", this);
					this.getView().addDependent(this._oViewSettingsDialog);
					// forward compact/cozy style into Dialog
					this._oViewSettingsDialog.addStyleClass(this.getOwnerComponent().getContentDensityClass());
				}
				var sDialogTab = "filter";
				if (oEvent.getSource() instanceof sap.m.Button) {
					var sButtonId = oEvent.getSource().sId;
					if (sButtonId.match("group")) {
						sDialogTab = "group";
					}
				}
				this._oViewSettingsDialog.open(sDialogTab);
			}

		});

	}
);
