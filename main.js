// JSON:
// codes: [{ id: 0, type: "vcard", description: "martins card", data: { name: "martin", phone: "111" }},
//			{ id: 1, type: "plain", description: "just text", data: { text: "some kind of text" }}]
//
// VCARD fields: firstName, lastName, fullName, phone, email

var qrData = new QrData();
var currentScreen = 0;
var touchStartX = 0;
var cardWidth = 0;

function QrMain()
{
	var me = this;
	var addNewView = new AddNewView(me.createNewCallback, cardWidth);
	var scrollPane = me.getScrollPane();
	//me.createPageCounter();y
	me.drawCards();
	scrollPane.appendChild(addNewView.view);
};

QrMain.prototype.updatePageCounter = function()
{	
	var pageCounter = document.getElementById("pageCounter");
	pageCounter.innerHTML = "";
	var pageCounterInnerWrapper = document.createElement("div");
	for(var i = 0; i < qrData.codes.length + 1; i++)
	{
		var pageCounterElement = document.createElement("div");
		pageCounterElement.classList.add("pageCounterElement");
		
		if(i === currentScreen)
			pageCounterElement.classList.add("pageCounterElementSelected");
			
		pageCounterInnerWrapper.appendChild(pageCounterElement);
	}
	
	pageCounter.appendChild(pageCounterInnerWrapper);
	pageCounter.style.right = (cardWidth - pageCounter.clientWidth) / 2;
};

QrMain.prototype.getScrollPane = function()
{
	return document.getElementById("scrollpane");
};

QrMain.prototype.resizeScrollPane = function()
{
	var scrollPane = this.getScrollPane();
	scrollPane.style.width = (qrData.getCodes().length + 1) * cardWidth + "px";
};

QrMain.prototype.mainDeleteCallback = function(qrViewObject, codeId)
{
	var me = qrMain; //hacky
	qrData.deleteCode(codeId);
	me.getScrollPane().removeChild(qrViewObject.view);
	delete qrViewObject;
	me.updatePageCounter();
	me.resizeScrollPane();
};

QrMain.prototype.drawCards = function()
{
	var me = this;
	var scrollPane = me.getScrollPane();
	var qrCodes = qrData.getCodes();
	me.resizeScrollPane();
	for(var i = 0; i < qrCodes.length; i++)
	{
		var qrView = new QrView(qrCodes[i], me.mainDeleteCallback, cardWidth);
		scrollPane.appendChild(qrView.view);	
	}
	me.updatePageCounter();
};

QrMain.prototype.scrollNext = function()
{
	var me = this;
	currentScreen += 1;
	me.doScroll();
};

QrMain.prototype.scrollPrev = function()
{
	var me = this;
	currentScreen -= 1;
	me.doScroll();
};

QrMain.prototype.hasNext = function()
{
	return currentScreen < qrData.codes.length;
};

QrMain.prototype.hasPrev = function()
{
	return currentScreen > 0;
};

QrMain.prototype.doScroll = function()
{
	var me = this;
	// TODO: fix first card flip bug
	qrMain.getScrollPane().style.transition = "0.2s"; // enable animation of card movement.
	me.getScrollPane().style.right = cardWidth * currentScreen;
	me.updatePageCounter();
};

QrMain.prototype.createNewCard = function(qrJSON)
{
	var me = this;
	var qrView = new QrView(qrJSON, me.mainDeleteCallback, cardWidth);
	return qrView.view;
};


QrMain.prototype.addNewCard = function(qrJSON)
{
	var me = this;
	qrData.addNewCode(qrJSON);
	var scrollPane = me.getScrollPane();
	
	// 1. insertBefore addNewView
	// 2. resize scrollbar
	// 3. scroll to created.
	var addNewView = scrollPane.children[scrollPane.children.length - 1];
	var newCard = me.createNewCard(qrJSON);
	scrollPane.insertBefore(newCard, addNewView);
	me.resizeScrollPane();
	me.updatePageCounter();
	newCard.classList.add("backSideVisible"); 
	setTimeout(function() {
		newCard.classList.remove("backSideVisible");
	}, 1);
};

// for testing. Replace by swipe motions
document.addEventListener("keydown", function(e)
{
	e = e || window.event;
	
	if(e.keyCode === 37 && qrMain.hasPrev()) //left
		qrMain.scrollPrev();
	else if(e.keyCode === 39 && qrMain.hasNext()) //right
		qrMain.scrollNext();
}, false);
	
	
document.addEventListener("touchstart", function(e) 
{
	touchStart = e.touches[0].clientX;
}, false);

document.addEventListener("touchmove", function(e) 
{ 
	e.preventDefault(); 
	var touchDiff = touchStart - e.touches[0].clientX;
	qrMain.getScrollPane().style.transition = ""; // remove any animation of scrollPane.
	qrMain.getScrollPane().style.right = cardWidth * currentScreen + touchDiff;
}, false);

document.addEventListener("touchend", function(e) 
{
	var touchDiff = touchStart - e.changedTouches[0].clientX;
	console.log(touchDiff);
	
	if(touchDiff < cardWidth / -3 && qrMain.hasPrev()) // change to lower int to increase scroll sensivity
	{
		qrMain.scrollPrev();
	}
	else if(touchDiff > cardWidth / 3 && qrMain.hasNext()) // change to lower int to increase scroll sensivity
	{
		qrMain.scrollNext();
	}
	else {
		// no significant scroll in either direction. Snap back to current screen:
		qrMain.doScroll();
		//qrMain.getScrollPane().style.right = cardWidth * currentScreen;
	}
}, false);
	

// TODO: disable scroll for create view
QrMain.prototype.createNewCallback = function(qrJSON)
{
	var me = qrMain; //hacky
	me.addNewCard(qrJSON);
};

window.onload = function () 
{
	cardWidth = document.getElementById("mainview").clientWidth;
	qrMain = new QrMain();
};