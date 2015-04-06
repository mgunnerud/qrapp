// wrapper for events, scope and such...

function CreateView(okCallback, cancelCallback, deleteCallback, initialCode) 
{
	var me = this;
	me.view = document.createElement("div");
	me.view.classList.add("backSideCard");
	
	me._createCardDropdown();
	
	me._createPlainTextView();
	me._createVCardView();
	me._createDescriptionField();
	
	me.view.appendChild(me.dropdownList.list);
	me.view.appendChild(me.plainTextDiv);
	me.view.appendChild(me.vCardDiv);
	me.view.appendChild(me._descriptionField.getFieldContainer());
	
	var buttonContainer = document.createElement("div");
	buttonContainer.classList.add("buttonContainer");
	
	var okButton = new Button("Save", okCallback);
	buttonContainer.appendChild(okButton);
	
	if(deleteCallback)
	{
		var deleteButton = new Button("Delete", deleteCallback);
		buttonContainer.appendChild(deleteButton);
	}
	
	var cancelButton = new Button("Cancel", cancelCallback);
	buttonContainer.appendChild(cancelButton);
	me.view.appendChild(buttonContainer);
	
	// we are modifying a code; set the values of this code.
	if(initialCode)
	{
		me._setInitialCode(initialCode); // TODO: clear values before opening (especially for addNewView)
	}
};

CreateView.prototype._setInitialCode = function(initialCode)
{
	var me = this;
	me.qrCodeId = initialCode.id;
	me._descriptionField.setValue(initialCode.description);
	if(initialCode.type === "VCARD")
	{
		me._showExistingVCard(initialCode);
	}
	else if(initialCode.type === "PLAIN")
	{
		me._showExistingPlainText(initialCode);
	}
};

CreateView.prototype._createCardDropdown = function()
{
	var me = this;
	me.changeFunc = function() 
	{
		if(me.dropdownList.getValue() === "VCARD") 
		{
			me._changeToVCardView();
		}
		else if(me.dropdownList.getValue() === "PLAIN") 
		{
			me._changeToPlainView();
		}
	}; 
	
	me.dropdownList = new DropdownList();
	me.dropdownList.list.addEventListener("change", function() { me.changeFunc() } );
	me.dropdownList.addOption("PLAIN", "Plain text");
	me.dropdownList.addOption("VCARD", "VCard");
};

CreateView.prototype._showExistingVCard = function(initialCode)
{
	var me = this;
	me.dropdownList.setValue("VCARD");
	me._changeToVCardView();
			
	me.firstNameField.setValue(initialCode.data.firstName);
	me.lastNameField.setValue(initialCode.data.lastName);
	me.fullNameField.setValue(initialCode.data.fullName);
	me.phoneField.setValue(initialCode.data.phone);
	me.emailField.setValue(initialCode.data.email);
};

CreateView.prototype._showExistingPlainText = function(initialCode)
{
	var me = this;
	me.dropdownList.setValue("PLAIN");
	me._changeToPlainView();
			
	me.textField.setValue(initialCode.data.text);
};

CreateView.prototype._changeToVCardView = function()
{
	var me = this;
	me.plainTextDiv.style.display = "none";
	me.vCardDiv.style.display = "";
};

CreateView.prototype._changeToPlainView = function()
{
	var me = this;
	me.plainTextDiv.style.display = "";
	me.vCardDiv.style.display = "none";
};

CreateView.prototype._createVCardView = function()
{
	var me = this;
	me.vCardDiv = document.createElement("div");
	
	me.firstNameField = new InputField("First name");
	me.vCardDiv.appendChild(me.firstNameField.getFieldContainer());
	
	me.lastNameField = new InputField("Last name");
	me.vCardDiv.appendChild(me.lastNameField.getFieldContainer());
	
	me.fullNameField = new InputField("Full name");
	me.vCardDiv.appendChild(me.fullNameField.getFieldContainer());
	
	me.phoneField = new InputField("Phone");
	me.vCardDiv.appendChild(me.phoneField.getFieldContainer());
	
	me.emailField = new InputField("Email");
	me.vCardDiv.appendChild(me.emailField.getFieldContainer());
	
	me.vCardDiv.style.display = "none"; // initially hidden
};

CreateView.prototype._createPlainTextView = function()
{
	var me = this;
	me.plainTextDiv = document.createElement("div");
	
	me.textField = new InputField("Plain text");
	me.plainTextDiv.appendChild(me.textField.getFieldContainer());
};

CreateView.prototype._createDescriptionField = function ()
{
	var me = this;
	me._descriptionField = new InputField("Description", "createDescriptionField");
};

CreateView.prototype.getQrJSON = function()
{
	var me = this;
	if(me.dropdownList.getValue() === "VCARD")
	{
		return {
			id: me.qrCodeId, 
			type: "VCARD",
			description: me._descriptionField.getValue(),
			data: {
				firstName: me.firstNameField.getValue(), 
				lastName: me.lastNameField.getValue(), 
				fullName: me.fullNameField.getValue(), 
				phone: me.phoneField.getValue(), 
				email: me.emailField.getValue() 	
			}
		};
	}
	else if(me.dropdownList.getValue() === "PLAIN")
	{
		return { 
			id: me.qrCodeId,
			type: "PLAIN",
			description: me._descriptionField.getValue(),
			data: { 
				text: me.textField.getValue() 
			} 
		};
	}
};