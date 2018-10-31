sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";
	var blob_url;
	var scale = 0.6;
	var zoomint = 0.1;
	return Controller.extend("com.commscope.grbypo.controller.matDoc", {
		onInit: function() {

			var opdf = new sap.ui.model.json.JSONModel();
			this.getView().setModel(opdf, "opdf");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("matdoc").attachPatternMatched(this._onObjectMatched, this);
			// this.getView().byId("MatdocInfo").setVisible(false);
			this.getView().byId("hideBt").setProperty("icon", "sap-icon://navigation-up-arrow");
			var oPdfObject = opdf.getData();
			var sAtr = "PoNum='" + oPdfObject.ponum + "',PoItem='" + oPdfObject.poitem + "',MaterialDoc='" + oPdfObject.materialdoc + "'";
			var surl = window.location.origin + "/sap/opu/odata/sap/ZGW_DEMO_GRFORPO_SRV/PdfFileSet(" + sAtr + ")/$value";
			surl = window.location.origin + "/sap/opu/odata/sap/ZGW_SF2PDF_SRV/PDFSet(\'" + "1\')/$value";
			var xhr = new XMLHttpRequest();
			xhr.open("GET", surl, true);
			xhr.responseType = "blob";
			//var oHtml = this.getView().byId("pdf");
			//var oPanel = this.getView().byId("pdf");
			var that = this;
			xhr.onload = function(oEvent) {
				var blob = xhr.response;
				 blob_url = URL.createObjectURL(blob);
				that.displayPdf(blob_url, scale);

				// var sViewId = that.getView().getId();
				// pdfjsLib.workerSrc = './js/pdf.worker.js'; //
				// pdfjsLib.getDocument(blob_url).then(function getPdfHelloWorld(pdf) {
				// 	pdf.getPage(1).then(function getPageHelloWorld(page) { // 
				// 		var scale = 0.6
				// 		var viewport = page.getViewport(scale);
				// 		// Prepare canvas using PDF page dimensions
				// 		var canvasid = "#" + sViewId + "--the-canvas";

				// 		var context = $(canvasid)[0].getContext('2d');

				// 		$(canvasid)[0].height = viewport.height;
				// 		$(canvasid)[0].width = viewport.width;
				// 		// Render PDF page into canvas context
				// 		var renderContext = {
				// 			canvasContext: context,
				// 			viewport: viewport
				// 		};
				// 		page.render(renderContext);
				// 	});
				// });
				/*				var sPanelId = "#" + sViewId + "--MatdocInfo";
								var sFrameId = "#" + sViewId + "--iframe";
								//$("[id*='iframe']").attr("src",blob_url);
								$(sFrameId).attr("src", blob_url);
								var hPanel = $(sPanelId).height();
								var hPage = $(document.body).height();
								var hFrame = hPage - hPanel   - ($(sPanelId).offset().top - $(window).scrollTop());
								$(sFrameId).attr("height", hFrame + "px");*/

			};
			xhr.send();

		},
		displayPdf: function(url, scale) {
			var sViewId = this.getView().getId();
			pdfjsLib.workerSrc = './js/pdf.worker.js'; 
			pdfjsLib.getDocument(url).then(function getPdfHelloWorld(pdf) {
				pdf.getPage(1).then(function getPageHelloWorld(page) { 

					var viewport = page.getViewport(scale);
					// Prepare canvas using PDF page dimensions
					var canvasid = "#" + sViewId + "--the-canvas";

					var context = $(canvasid)[0].getContext('2d');

					$(canvasid)[0].height = viewport.height;
					$(canvasid)[0].width = viewport.width;
					// Render PDF page into canvas context
					var renderContext = {
						canvasContext: context,
						viewport: viewport
					};
					page.render(renderContext);
				});
			});
		},
		zoomadd: function() {
			scale = scale + zoomint;
			this.displayPdf(blob_url, scale);
		},
		zoomqian: function() {
			scale = scale - zoomint;
			this.displayPdf(blob_url, scale);
		},
		onMenuAction: function(oEvent) {

			var oItem = oEvent.getParameter("item");
			if (oItem.getText() === "Email") {
				// var oEmailDialog = sap.ui.xmlfragment("com.commscope.grbypo.view.SendEmailFragment", this);
				// oEmailDialog.open();
				this._getDialog().open();
			} else {
				var pdfPrint = {};
				var oModel = this.getOwnerComponent().getModel();
				pdfPrint.MaterialDoc = $.trim(this.getView().getModel("opdf").getData().MaterialDoc);
				pdfPrint.PoNum = this.getView().getModel("opdf").getData().PoNum;
				pdfPrint.PoNum = $.trim(pdfPrint.PoNum);
				pdfPrint.PoItem = $.trim(this.getView().getModel("opdf").getData().PoItem);
				pdfPrint.MdItem = "";

				oModel.create("/PdfPrintSet", pdfPrint, {
						success: function(oData) {
							MessageToast.show("GR Slip was sent to Printer:ACI4!");
						},
						error: function(oError) {
							MessageToast.show("error");
						}
					}

				);

			}

		},
		closeDialog: function() {
			this._getDialog().close();

		},

		onSend: function(oEvent) {
			var that = this;
			this._getDialog().setBusy(true);
			// debugger;
			var oModel = this.getOwnerComponent().getModel();
			var oToken = oModel.oHeaders['x-csrf-token'];
			var sFilename = this.getView().byId("fileUploader").getValue();
			var oEmailAdr = this.getView().byId("idPersNo").getProperty("value");
			var file = this.getView().byId("fileUploader").getFocusDomRef().files[0];
			var base64_marker = 'data:' + file.type + ';base64,';
			var reader = new FileReader();
			// reader.onLoad = function(oEvent) {
			// var reader = new FileReader();
			reader.onload = function(e) {
				var base64Index = e.target.result.indexOf(base64_marker) + base64_marker.length;

				var base64 = e.target.result.substring(base64Index);
				// var base64 = e.target.result;
				// var base64 = JSON.stringify(e.target.result.substring(base64Index));
				// var base64 = btoa(base64Index);
				// var base64 = btoa(encodeURI(e.target));
				var surl = window.location.origin + "/sap/opu/odata/sap/ZGW_DEMO_GRFORPO_SRV/SendEmailSet(\'" + oEmailAdr + "\')/$value";
				debugger;
				$.ajax({
					type: "PUT",
					url: surl,
					data: base64,
					dataType: "json",
					beforeSend: function(xhr) {
						xhr.setRequestHeader("X-CSRF-Token", oToken);
						xhr.setRequestHeader("Content-Type", file.type);
						xhr.setRequestHeader("slug", sFilename);
					},
					success: function(data) {
						// debugger;
						that._getDialog().setBusy(false);
						that._getDialog().close();
						MessageToast.show('E-Mail was sent successfully!');
					},
					error: function(data) {
						// debugger;
						that._getDialog().setBusy(false);
						that._getDialog().close();
						MessageToast.show('E-Mail was sent with Error!');
					}
				});

			};
			reader.readAsDataURL(file);
			// reader.readAsBinaryString(file);

			// };

		},

		// },

		_getDialog: function() {
			// create a fragment with dialog, and pass the selected data
			if (!this.dialog) {

				this.dialog = sap.ui.xmlfragment(this.getView().getId(), "com.commscope.grbypo.view.SendEmailFragment", this);

			}

			return this.dialog;
		},
		hideMdc: function(oEvent) {
			if (this.getView().byId("MatdocInfo").getVisible() === false) {

				this.getView().byId("MatdocInfo").setVisible(true);
				this.getView().byId("hideBt").setProperty("icon", "sap-icon://navigation-up-arrow");
			} else {
				this.getView().byId("MatdocInfo").setVisible(false);
				this.getView().byId("hideBt").setProperty("icon", "sap-icon://navigation-down-arrow");
			}

		},
		_onObjectMatched: function(oEvent) {

			var PoNum = oEvent.getParameter("arguments").PONumber;
			var PoItem = oEvent.getParameter("arguments").POItem;
			var MaterialDoc = oEvent.getParameter("arguments").MaterialDoc;

			this.getView().getModel("opdf").setProperty("/PoNum", PoNum);
			this.getView().getModel("opdf").setProperty("/PoItem", PoItem);
			this.getView().getModel("opdf").setProperty("/MaterialDoc", MaterialDoc);

		},
		onBeforeRendering: function() {
			//debugger;
		}

	});

});