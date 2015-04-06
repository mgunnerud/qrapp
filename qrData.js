function QrData()
{
	this.codes = [];
	/*
	this.codes = [{ 
		id: 0,
		type: "VCARD", 
		description: "business card",
		data: { 
			firstName: "martin", 
			lastName: "gunnerud", 
			fullName: "m g", 
			phone: "111", 
			email: "mgunnerud@gmail.com" 
		}
	}, { 
		id: 1,
		type: "PLAIN", 
		description: "plain text",
		data: { 
			text: "dette er en test" 
		}
	}];*/
	this._loadData();
};

QrData.prototype._getCodeIndex = function(codeId)
{
	var me = this;
	for(var i = 0; i < me.codes.length; i++)
	{
		if(me.codes[i].id === codeId)
		{
			return i;
		};
	};
};

QrData.prototype._getNextFreeCodeId = function()
{
	var me = this;
	return me.codes.length === 0 ? 0 : me.codes[me.codes.length - 1].id + 1;
};

QrData.prototype.modifyCode = function(newCode)
{
	var me = this;
	var qrCodeIndex = me._getCodeIndex(newCode.id);
	me.codes[qrCodeIndex] = newCode;
	me._saveQrData();
};

QrData.prototype.getCodes = function()
{
	var me = this;
	return me.codes;
};

QrData.prototype.deleteCode = function(codeId)
{
	var me = this;
	var codeIndex = me._getCodeIndex(codeId);
	me.codes.splice(codeIndex, 1);
	me._saveQrData();
};

QrData.prototype.addNewCode = function(qrJSON)
{
	var me = this;
	// give the new code an id:
	qrJSON.id = me._getNextFreeCodeId();
	me.codes.push(qrJSON);
	me._saveQrData();
};

QrData.prototype._saveQrData = function()
{
	if(localStorage)
		localStorage.setItem("qrData", JSON.stringify(qrData.codes));
};

QrData.prototype._loadData = function()
{
	if(localStorage && localStorage.qrData)
	this.codes = JSON.parse(localStorage.getItem("qrData"));
};