function Button(buttonText, buttonClickFn) {
	var button = document.createElement('div');
	button.innerHTML = buttonText;
	button.addEventListener("click", buttonClickFn, false);
	button.classList.add("menuButton");
	return button;
};

function DropdownList(changeFunc) 
{
	var me = this;
	me.list = document.createElement('select');
	me.list.onchange = changeFunc;
};

DropdownList.prototype = {
	list: undefined
};

DropdownList.prototype.addOption = function(optionValue, optionText) 
{
	var op = document.createElement('option');
	op.value = optionValue;
	op.text = optionText;
	this.list.options.add(op);
};

DropdownList.prototype.setValue = function(value) 
{
	this.list.value = value;
};

DropdownList.prototype.getValue = function() 
{
	return this.list.value;
};

function InputField(label, optionalClass)
{
	var me = this;
	me.inputFieldContainer = document.createElement("div");
	var fieldLabel = document.createElement("label");
	fieldLabel.innerHTML = label + ":";
	fieldLabel.classList.add("inputLabel");
	me.input = document.createElement("input");
	me.input.classList.add("inputField");
	if(optionalClass)
		me.inputFieldContainer.classList.add(optionalClass);
	me.inputFieldContainer.classList.add("inputFieldContainer");
	me.inputFieldContainer.appendChild(fieldLabel);
	me.inputFieldContainer.appendChild(me.input);
	return me;
};

InputField.prototype.getValue = function()
{
	return this.input.value;
};

InputField.prototype.setValue = function(value)
{
	this.input.value = value;
};

InputField.prototype.getFieldContainer = function()
{
	return this.inputFieldContainer;
};