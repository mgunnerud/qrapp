function AddNewView(createNewCallback, cardWidth)
{
	var me = this;
	
	var goToCreateViewFn = function()
	{
		me._goToCreateView();
	};
	me.view = document.createElement("div");
	me.view.classList.add("card");
	me.view.style.width = cardWidth;
	
	me.showView = document.createElement("div");
	me.showView.classList.add("frontSideCard");
	var button = new Button("add new qr code", goToCreateViewFn);
	var addNewButtonContainer = document.createElement("div");
	addNewButtonContainer.classList.add("addNewButtonContainer");
	addNewButtonContainer.appendChild(button);
	
	me.showView.appendChild(addNewButtonContainer);
	me.view.appendChild(me.showView);
	me._addCreateView(createNewCallback);
};

AddNewView.prototype._addCreateView = function(createNewCallback)
{
	var me = this;
	var okCallback = function()
	{
		createNewCallback(me.createView.getQrJSON());
		me.view.classList.remove("backSideVisible");
	};
	var cancelCallback = function()
	{
		me.view.classList.remove("backSideVisible");
	};
	me.createView = new CreateView(okCallback, cancelCallback);
	me.view.appendChild(me.createView.view);
};

AddNewView.prototype._goToCreateView = function()
{
	var me = this;
	me.view.classList.add("backSideVisible");
};