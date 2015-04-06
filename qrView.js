// TODO: add copy qr code button?

function QrView(qrJSON, deleteCallback, cardWidth) 
{
	var me = this;
	
	var createViewFn = function()
	{
		me._switchToCreateView();
	};
	
	me._qrCodeDiv = document.createElement("div");
	me._qrCodeDiv.classList.add("qrCode");
	
	var changeQrButton = new Button("Edit qr", createViewFn);
	var buttonContainer = document.createElement("div");
	buttonContainer.classList.add("buttonContainer");
	buttonContainer.appendChild(changeQrButton);
	
	me._codeDescription = document.createElement("div");
	me._codeDescription.classList.add("codeDescription");
	me._codeDescription.innerHTML = qrJSON.description;
	
	var showView = document.createElement("div");
	showView.classList.add("frontSideCard");
	
	showView.appendChild(me._qrCodeDiv);
	showView.appendChild(me._codeDescription);
	showView.appendChild(buttonContainer);
	
	me.view = document.createElement("div");
	me.view.classList.add("card");
	me.view.style.width = cardWidth;
	
	me.makeQrCode(qrJSON);
	me.view.appendChild(showView);
	
	me._addCreateView(qrJSON, deleteCallback);
};

QrView.prototype._addCreateView = function(qrJSON, mainDeleteCallback)
{
	var me = this;
	var okCallback = function()
	{
		var qrJSON = me.createView.getQrJSON();
		qrData.modifyCode(qrJSON);
		me._codeDescription.innerHTML = qrJSON.description;
		me.makeQrCode(qrJSON);
		me.view.classList.remove("backSideVisible");
	};
	var cancelCallback = function()
	{
		me.view.classList.remove("backSideVisible");
	};
	var deleteCallback = function()
	{
		mainDeleteCallback(me, qrJSON.id);
	};
	me.createView = new CreateView(okCallback, cancelCallback, deleteCallback, qrJSON);
	me.view.appendChild(me.createView.view);
};

QrView.prototype._switchToCreateView = function () 
{
	var me = this;
	me.view.classList.add("backSideVisible");
};


QrView.prototype.makeQrCode = function(qrJSON) 
{
	var me = this;
	var qrText = "";
	if(qrJSON.type === "VCARD")
	{
		qrText = me._getVCardText(qrJSON.data)
	}
	else if (qrJSON.type === "PLAIN")
	{
		qrText = qrJSON.data.text;
	}
	
	if(!me.qrCodeComponent) {
		me.qrCodeComponent = new QRCode(me._qrCodeDiv, {
			text: qrText,
			width: 300,
			height: 300
		});
	}
	else 
	{
		me._clearQrCode();
		me.qrCodeComponent.makeCode(qrText);
	}
};

QrView.prototype._clearQrCode = function() 
{
	var me = this;
	me.qrCodeComponent.clear();
};

QrView.prototype._getVCardText = function (qrJSON) 
{
	// append the VCard tags here
	var vCardText = "BEGIN:VCARD \n";
	vCardText += "VERSION:2.1 \n";
	vCardText += "N:"+qrJSON.lastName+";"+qrJSON.firstName+" \n";
	vCardText += "FN:"+qrJSON.fullName+" \n";
	vCardText += "TEL;CELL:"+qrJSON.phone+" \n";
	vCardText += "EMAIL:"+qrJSON.email+" \n";
	vCardText += "END:VCARD"; 
				
	return vCardText;
};