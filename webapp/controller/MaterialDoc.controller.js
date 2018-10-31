sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/m/Dialog",
	"sap/m/Label",
	"sap/m/TextArea",
	"sap/m/Button",
	"sap/m/MessageToast",
	"sap/m/Input",
	"sap/m/MessagePopover",
	"sap/m/MessagePopoverItem",
	"sap/m/Link",
	"sap/m/MessageToast",
	"sap/ndc/BarcodeScanner",
	"sap/ui/core/ValueState",
	"sap/m/MessageBox"

], function(Controller, Filter, Dialog, Label, TextArea, Button, MessageToast, Input, MessagePopover,
	MessagePopoverItem, Link, ValueState, MessageBox) {
	"use strict";

	var oLink = new Link({
		text: "Show more information",
		// href: "http://sap.com",
		target: "_blank"
	});

	var oMessageTemplate = new MessagePopoverItem({
		type: '{type}',
		title: '{title}',
		description: '{description}',
		subtitle: '{subtitle}',
		counter: '{counter}',
		link: oLink
	});

	var oMessagePopover = new MessagePopover({
		items: {
			path: '/',
			template: oMessageTemplate,
			modal: false
		}
	});

	var oIcon = "sap-icon://accept";
	var MatDoc;
	var selCat;
	var cntTmp = [];
	
	// var 		asnUserSearched = [];
	// asnUserSearched: [],
	return Controller.extend("com.commscope.grbypo.controller.MaterialDoc", {

		onInputChange: function(oEvent) {

			//How to get the data of the current row of the table, based on the source
			//of the event
			var myPath = oEvent.getSource().getParent().getBindingContextPath();
			var oModel = this.getView().getModel("poItemData");
			var currentPoItem = oModel.getObject(myPath);

			//How to get the value of what changed in the input
			var newValue = oEvent.getParameter("value");

			//This is the check - how you compare stuff
			if (newValue > currentPoItem.PoOpenQuantity) {
				console.log("on no! it's wrong");
			}
		},
		onMenuAction: function(oEvent) {
			var oscanMode = this.getOwnerComponent().getModel("scanMode");
			//var obgData = oscanMode.getData();
			var obgData = {};
			var oItem = oEvent.getParameter("item");
			if (oItem.getText() === "ASN number") {
				selCat = "A";
				obgData.PO = "";
				obgData.ASN = oIcon;
				obgData.MATID = "";
				obgData.PLCHOLDER = "Scan or Type a ASN Number";
				this.byId("asnSearchField").setProperty("value", null);
				oscanMode.setData(obgData);
				this.byId("asnSearchField").focus();
				this.asnUserSearched = [];
			} else if (oItem.getText() === "PO number") {
				selCat = "P";
				obgData.PO = oIcon;
				obgData.ASN = "";
				obgData.MATID = "";
				obgData.PLCHOLDER = "Scan or Type a PO Number";
				this.byId("asnSearchField").setProperty("value", null);
				oscanMode.setData(obgData);
				this.byId("asnSearchField").focus();
				this.asnUserSearched = [];
			} else if (oItem.getText() === "Material number") {
				selCat = "M";
				obgData.PO = "";
				obgData.ASN = "";
				obgData.MATID = oIcon;
				obgData.PLCHOLDER = "Scan or Type a Material Number";
				this.byId("asnSearchField").setProperty("value", null);
				oscanMode.setData(obgData);
				this.byId("asnSearchField").focus();
				this.asnUserSearched = [];
			}
			//oItem.setProperty("icon",oIcon);
			//  sItemPath = "";
			// while (oItem instanceof sap.m.MenuItem) {
			// 	sItemPath = oItem.getText() + " > " + sItemPath;
			// 	oItem = oItem.getParent();
			// }
			// sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));

			// sap.m.MessageToast.show("Action triggered on item: " + sItemPath);
		},
		refreshData: function(oEvent) {
			this.getView().byId('pullToRefresh').hide();
			this.getView().byId("vendorInfo").setProperty("visible", true);

		},
		hideVendor: function(oEvent) {
			this.getView().byId("vendorInfo").setProperty("visible", false);
		},
		handelCamera: function(oEvent) {

			// var oThisObj = this;
			var oBinid = this.getView().byId("asnSearchField");
			sap.ndc.BarcodeScanner.scan(
				function(mResult) {
					// alert("got barcode: " + mResult.text);
					oBinid.setValue(mResult.text);

					sap.ndc.BarcodeScanner.closeScanDialog();
					// oThisObj.onSearch();
				},
				function(Error) {
					alert("Scanning failed: " + Error);
				},
				function(liveUpdate) {
					// Function to be called when value of the dialog's input is changed
				}

			);
			// sap.ndc.BarcodeScanner.destroy();

		},
		onInit: function() {
			// var paulsSecretData = new sap.ui.model.json.JSONModel();
			// this.setModel(paulsSecretData, "paulsSecretData");   
			// var otherOdataModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZGW_DEMO_GRFORPO_SRV/");
			// otherOdataModel.read("/OtherEntitySet");
			// var initMode ={};
			// var oInitMode = this.getOwnerComponent().getModel("scanMode");
			// initMode.PO = oIcon;
			// initMode.ASN = "";
			// initMode.MATID = "";
			// oInitMode.setData(initMode);
			selCat = "P";
			this.getView().byId("vendorInfo").setProperty("visible", false);
			this._setInitialFocus(this.getView().byId("asnSearchField"));
			var cnt = new sap.ui.model.json.JSONModel();
			this.getView().setModel(cnt, "cnt");
			this.asnUserSearched = [];
			cntTmp.poSelected = 0;
			cntTmp.poItemTotal = 0;
			cnt.setData(cntTmp);

			// this.getView().byId("poItemTable").addEventDelegate({
			// 	selectionChange: function(oEvent){
			// 			MessageToast.show("zzzzzzzz");

			// 	}
			// });
			//debugger;
			// this.getView().byId("actQty").addEventDelegate({
			// 	onclick: function(oEvent) {
			// 		var clickItem;
			// 		var thatView = this.getView();
			// 		clickItem = oEvent.currentTarget.dataset.sapUi.split("-").pop();
			// 		var dialog = new Dialog({
			// 			title: "Scan or type actural receipt quantity",
			// 			type: "Message",
			// 			content: [
			// 				new TextArea("submitDialogTextarea", {
			// 					liveChange: function(oEvent) {
			// 						var sText = oEvent.getParameter("value");
			// 						var parent = oEvent.getSource().getParent();
			// 						parent.getBeginButton().setEnabled(sText.length > 0);
			// 					},
			// 					width: "100%",
			// 					placeholder: "Packing slip number (required)"
			// 				})
			// 				//}).addStyleClass("example")
			// 			],
			// 			beginButton: new Button({
			// 				text: "Confirm",
			// 				enabled: false,
			// 				type: "Accept",
			// 				press: function() {
			// 					var sText = sap.ui.getCore().byId("submitDialogTextarea").getValue();

			// 					dialog.close();
			// 				}
			// 			}),
			// 			endButton: new Button({
			// 				text: "Cancel",
			// 				press: function() {
			// 					dialog.close();
			// 				}
			// 			}),
			// 			afterClose: function() {
			// 				dialog.destroy();
			// 			}
			// 		});

			// 		dialog.open();

			// 	}
			// });
			this.byId("pullToRefresh").hide();
			var pageId = this.getView().getId();
			touch.on("#" + pageId, 'dragend', function(oEvent) {
				// currentScale = ev.scale - 1;
				// currentScale = initialScale + currentScale;
				// currentScale = currentScale > 5 ? 5 : currentScale;
				// currentScale = currentScale < 0.1 ? 0.1 : currentScale;
				// scale = currentScale;
				// that.displayPdf(blob_url, currentScale);
				MessageToast.show('zzzzzzzz');
			});

		},
		onChange: function(oEvent) {

			//debugger;

		},
		onSelectedChg: function(oEvent) {

			cntTmp.poSelected = this.getView().byId("poItemTable").getSelectedItems().length;;
			// cntTmp.poItemTotal = newPoItems.length;
			this.getView().getModel("cnt").setData(cntTmp);

		},
		handleRefresh: function(oEvent) {
			// this.byId("pullToRefresh").setDescription("Release to Display Vendor info");
			// MessageToast.show('zzzzzzzz');
			// if (this.getView().byId("nameText").getProperty("text") !== null) {
			// 	this.getView().byId("vendorInfo").setProperty("visible", true);
			// }
			// this.byId("pullToRefresh").showIcon=false;
			// this.byId("pullToRefresh").hide();
		},
		onPress: function(oEvent) {
			this._showObject(oEvent.getSource());
		},
		_setInitialFocus: function(control) {
			this.getView().addEventDelegate({
				onAfterShow: function() {
					control.focus();
				}
			}, this);
		},

		createMaterialDocument: function(packingSlip) {
			var oModel = this.getOwnerComponent().getModel();
			var newMaterialDocument = {};
			newMaterialDocument.MaterialDocumentNumber = "";
			newMaterialDocument.PackingSlip = packingSlip;

			var oItemModel = this.getOwnerComponent().getModel("poItemData");
			var oBindData = this.getView().byId("poItemTable").getBinding("items").getModel().getData();

			// var poItemData = oItemModel.getData();
			var poItemData = [];
			for (var i = 0; i < this.getView().byId("poItemTable").getSelectedContextPaths().length; i++) {
				// this.getView().byId("poItemTable").getSelectedItem(i).setType("Navigation");
				poItemData.push(oItemModel.getObject(this.getView().byId("poItemTable").getSelectedContextPaths()[i]));

			}

			// this.getView().byId("poItemTable").getSelectedItems().setProperty("type","Navigation");

			newMaterialDocument.MaterialDocToItems = poItemData;

			var submitButton = this.getView().byId("postGRButton");
			submitButton.setBusy(true);
			this.getView().setBusy(true);
			var that = this;
			oModel.create("/MaterialDocumentSet", newMaterialDocument, {
				success: function(oData) {
					// Renew PO Data - Update odatamodel:poItemData {
					
					
					
					// } Renew PO Data
					
					
					MatDoc = oData.MaterialDocumentNumber;
					submitButton.setBusy(false);
					that.getView().setBusy(false);
					var newPoItems = [];
					var oItemModel = that.getOwnerComponent().getModel("poItemData");
					newPoItems = oItemModel.getData();
					submitButton.setBusy(false);
					//				non-editable for qty and add navigation
					for (var itemNum = 0; itemNum < oBindData.length; itemNum++) {
						if (that.getView().byId("poItemTable").getItems()[itemNum].getSelected() === true) {
							that.getView().byId("poItemTable").getItems()[itemNum].setType("Navigation");
							// that.getView().byId("poItemTable").getItems()[itemNum].addStyleClass("greenBackground");
							that.getView().byId("poItemTable").getItems()[itemNum].setHighlight("Success");
							newPoItems[itemNum].StatusText = "Post Successfully!";
							newPoItems[itemNum].PoOpenQuantity = newPoItems[itemNum].PoOpenQuantity - newPoItems[itemNum].ActualRecQty;
							newPoItems[itemNum].StatusState = "Success";
						} else {
							that.getView().byId("poItemTable").getItems()[itemNum].setHighlight("None");
							newPoItems[itemNum].StatusText = "Not Post";
							newPoItems[itemNum].StatusState = "Warning";
						}
						that.getView().byId("poItemTable").getItems()[itemNum].getCells()[5].setEditable(false);
					}

					// }
					that.getView().byId("poItemTable").setMode("None");
					that.getView().byId("postGRButton").setProperty("visible", false);
					that.getView().byId("clearButton").setProperty("visible", true);
					oItemModel.setData(newPoItems);
					var messages = [];
					var newMessage = {};
					var oMessageModel = new sap.ui.model.json.JSONModel();
					newMessage.type = "Success";
					newMessage.title = "Material Document  " + MatDoc + "  was created!";
					// newMessage.description = "GR post ";
					messages.push(newMessage);
					oMessageModel.setData(messages);

					oMessagePopover.setModel(oMessageModel);
					// var popoverButton = that.getView().byId("messagePopover");
					// oMessagePopover.toggle(popoverButton);

				},
				error: function(oError) {
					//debugger;
					var errorDetails = JSON.parse(oError.responseText);
					var allErrors = errorDetails.error.innererror.errordetails;
					var messages = [];
					var newPoItems = [];
					var oItemModel = that.getOwnerComponent().getModel("poItemData");
					newPoItems = oItemModel.getData();
					submitButton.setBusy(false);
					that.getView().setBusy(false);
					for (var i = 0; i < allErrors.length; i++) {
						var newMessage = {};
						if (allErrors[i].severity === "error") {
							newMessage.type = "Error";
						}
						newMessage.title = allErrors[i].code;
						newMessage.description = allErrors[i].message;
						messages.push(newMessage);
					}

					for (var itemNum = 0; itemNum <  oBindData.length; itemNum++) {
						if (that.getView().byId("poItemTable").getItems()[itemNum].getSelected() === true) {
							that.getView().byId("poItemTable").getItems()[itemNum].setHighlight("Error");
							newPoItems[itemNum].StatusText = "Error";
							newPoItems[itemNum].StatusState = "Error";
						} else {
							that.getView().byId("poItemTable").getItems()[itemNum].setHighlight("None");
							newPoItems[itemNum].StatusText = "Not Post";
							newPoItems[itemNum].StatusState = "Warning";
						}
						that.getView().byId("poItemTable").getItems()[itemNum].getCells()[5].setEditable(false);
					}
					that.getView().byId("poItemTable").setMode("None");
					that.getView().byId("postGRButton").setProperty("visible", false);
					that.getView().byId("clearButton").setProperty("visible", true);
					oItemModel.setData(newPoItems);

					// var bCompact = !!that.getView().$().closest(".sapUiSizeCompact").length;
					// MessageBox.error(
					// 	"GR Posting faied,Please check error message for details!", {
					// 		styleClass: bCompact ? "sapUiSizeCompact" : ""
					// 	}
					// );

					var oMessageModel = new sap.ui.model.json.JSONModel();
					oMessageModel.setData(messages);

					oMessagePopover.setModel(oMessageModel);
					var popoverButton = that.getView().byId("messagePopover");
					oMessagePopover.toggle(popoverButton);

					submitButton.setBusy(false);

				}
			});
		},

		handleMessagePopoverPress: function(oEvent) {
			oMessagePopover.toggle(oEvent.getSource());
		},
		_showObject: function(oItem) {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("matdoc", {
				PONumber: oItem.getCells()[0].getText().split("/")[0],
				POItem: oItem.getCells()[0].getText().split("/")[1],
				MaterialDoc: MatDoc
			});

		},
		onAfterRendering: function() {
			this.byId("asnSearchField").focus();

		},
		onClear: function(oEvent) {
			var newPoItems = [];
			var newVendor = [];
			var oItemModel = this.getOwnerComponent().getModel("poItemData");
			var oVdorModel = this.getOwnerComponent().getModel("vendorMode");
			oItemModel.setData(newPoItems);
			oVdorModel.setData(newVendor);
			this.asnUserSearched = [];
			this.getView().byId("vendorInfo").setProperty("visible", false);
			this.getView().byId("postGRButton").setProperty("visible", true);
			this.getView().byId("poItemTable").setMode("MultiSelect");
			cntTmp.poSelected = 0;
			cntTmp.poItemTotal = 0;
			this.getView().getModel("cnt").setData(cntTmp);
		},
		onPostGR: function(oEvent) {
			//console.log(oEvent);
			var searchField = this.getView().byId("asnSearchField");
			var searchFieldValue = searchField.getValue();

			var that = this;
			var dialog = new Dialog({
				title: "Packing Slip",
				type: "Message",
				content: [
					new Label({
						text: "Scan your packing slip " + searchFieldValue + ":",
						labelFor: "submitDialogTextarea"
					}),
					new TextArea("submitDialogTextarea", {
						liveChange: function(oEvent) {
							var sText = oEvent.getParameter("value");
							var parent = oEvent.getSource().getParent();
							parent.getBeginButton().setEnabled(sText.length > 0);
						},
						width: "100%",
						placeholder: "Packing slip number (required)"
					})
					//}).addStyleClass("example")
				],
				beginButton: new Button({
					text: "Submit",
					enabled: false,
					type: "Accept",
					press: function() {
						var sText = sap.ui.getCore().byId("submitDialogTextarea").getValue();
						that.createMaterialDocument(sText);
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});

			dialog.open();
		},
		onNav: function(oEvent) {
			this._showObject(oEvent.getSource());
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(oEvent.getSource());
			// oRouter.navTo("matdoc");
			// // this.getRouter().navTo("matdoc");
			// this.getRouter().getTargets()
		},
		// _showObject: function(oItem) {
		// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 	oRouter.navTo("matdoc");
		// },
		onSuggest: function(event) {
			// if (selCat === "M") {
			var value = event.getParameter("suggestValue");
			var filters = [];
			if (value) {
				filters = [
					new sap.ui.model.Filter([
						new sap.ui.model.Filter("MaterialNumber", function(sText) {
							return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						}),

						new sap.ui.model.Filter("MaterialDescription", function(sText) {
							return (sText || "").toUpperCase().indexOf(value.toUpperCase()) > -1;
						})
					], false)
				];
			}
			this.getView().byId("asnSearchField").getBinding("suggestionItems").filter(filters);
			this.getView().byId("asnSearchField").suggest();
			// }
			// this.oSF.getBinding("suggestionItems").filter(filters);
			// this.oSF.suggest();
		},
		asnUserSearched: [],
		onSearch: function(oEvent) {
			//	//debugger;
			this.byId("asnSearchField").setProperty("value", null);
			var query = oEvent.getParameter("query");
			if (this.asnUserSearched.indexOf(query) > -1) {
				return;
			}
			// switch(selCat){
			var asnFilter = new Filter({
				path: "AsnNumber",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: query
			});

			var poFilter = new Filter({
				path: "PoNumber",
				operator: sap.ui.model.FilterOperator.EQ,
				value1: query
			});

			var filters = [];

			var oModel = this.getOwnerComponent().getModel();
			var oTable = this.getView().byId("poItemTable");
			var that = this;

			switch (true) {

				case (selCat === "P" || selCat === "A"):
					if (selCat === "P") {
						filters.push(poFilter);
					} else {
						filters.push(asnFilter);
					}

					oTable.setBusy(true);
					oModel.read("/PoItemSet", {
						filters: filters,
						success: function(oData) {
							that.asnUserSearched.push(query);
							var oItemModel = that.getOwnerComponent().getModel("poItemData");
							var newPoItems = [];
							if (Array.isArray(oItemModel.getData())) {
								newPoItems = oItemModel.getData().concat(oData.results);
							} else {
								newPoItems = oData.results;
							}

							for (var np = 0; np < newPoItems.length; np++) {
								newPoItems[np].StatusText = "Validate Successfully";
								// newPoItems[np].Status = 0;
								// newPoItems[np].StatusSate = ValueState.Success;
								newPoItems[np].StatusState = "Success";
							}
							cntTmp.poSelected = 0;
							cntTmp.poItemTotal = newPoItems.length;
							that.getView().getModel("cnt").setData(cntTmp);

							//oItemModel.setData(oData.results);
							oItemModel.setData(newPoItems);
							oTable.setBusy(false);
							oTable.setBusy(false);
							that.byId("pullToRefresh").hide();
						},
						error: function(oError) {
							oTable.setBusy(false);
							that.byId("pullToRefresh").hide();
						}
					});
					// if(this.getView().getModel("poItemData").oData.length > 0)
					// {

					oModel.read("/VendorSet('" + query + "')", {

						success: function(oData) {
							var oVdorModel = that.getOwnerComponent().getModel("vendorMode");
							oTable.setBusy(false);
							oData.VendorScore = parseFloat(oData.VendorScore);
							oVdorModel.setData(oData);
							that.getView().byId("vendorInfo").setProperty("visible", true);
						},
						error: function(oError) {
							var oData;
							var oVdorModel = that.getOwnerComponent().getModel("vendorMode");
							oVdorModel.setData(oData);
							oTable.setBusy(false);
							that.getView().byId("vendorInfo").setProperty("visible", false);
						}
					});
					break;
				case (selCat === "M"):

					var oItemModel = that.getOwnerComponent().getModel("poItemData");
					// if (this.asnUserSearched.indexOf(query) > -1) {
					// 	return;
					// }
					var itemModel = that.getView().byId("poItemTable").getItems();
					for (var i = 0; i < itemModel.length; i++) {
						if (oItemModel.getObject(itemModel[i].getBindingContextPath()).MaterialNumber === query) {
							// if (itemModel.getData()[i].MaterialNumber === query) {
							// var aIndices = this.byId("poItemTable").getSelectedContextPaths();
							// that.byId("poItemTable").setSelectedIndex(i);
							if (oTable.getItems()[i].getSelected() === false) {
								oTable.setSelectedItem(oTable.getItems()[i]);
								oTable.getItems()[i].focus();
							} else {
								// oTable.delSelectedItem(oTable.getItems()[i]);
								// oTable.getItems()[i].removeSelections(true);
								oTable.getItems()[i].setSelected(false);
							}

						}

					}
					cntTmp.poSelected = that.getView().byId("poItemTable").getSelectedItems().length;;
					// cntTmp.poItemTotal = newPoItems.length;
					that.getView().getModel("cnt").setData(cntTmp);
					// break;
			}

			// }

		}
	});
});