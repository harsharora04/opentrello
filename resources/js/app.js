var classItems = {
	wrapper: '.wrapper',
	addLane: '.button-add-lane',
}

var initialObject = [
	{
		"id": "1",
		"name": "Pending", 
		"position": "1", 
		"tasks": [
			{
				"name": "Task 1",
				"position": "1"
			}
		]
	},
	{	
		"id": "2",
		"name": "In Progress", 
		"position": "3",
		"tasks": [
			{
				"name": "Task 1",
				"position": "1"
			}
		]
	},
	{	
		"id": "3",
		"name": "Material List", 
		"position": "4",
		"tasks": [
			{
				"name": "Task 1",
				"position": "1"
			}
		]
	},
	{	
		"id": "4",
		"name": "Done", 
		"position": "2",
		"tasks": [
			{
				"name": "Task",
				"position": "1"
			}
		]
	}
];
$(document).ready(function(){
	if(!localStorage.getItem('intalled')) {
		localStorage.setItem('installed',true);
		localStorage.setItem('items',  JSON.stringify(initialObject));
	}
	createItems();

	var dragTask = document.querySelectorAll(".tasks-ul li");

	[].forEach.call(dragTask, function(dT) {
		dT.addEventListener('dragstart', handleDragStart, false);
		dT.addEventListener('dragenter', handleDragEnter, false);
		dT.addEventListener('dragover', handleDragOver, false);
		dT.addEventListener('dragleave', handleDragLeave, false);
		dT.addEventListener('dragend', handleDragEnd, false);
		dT.addEventListener('drop', handleDragDrop, false);
	})
	
	$(classItems.addLane).click(function(){
		var text = prompt("Add New Lane", "");
		if (text != null) {
			var lane = new Status(text);
			lane.createNew();
		}
	})
});


function Status(name) {
	this.name = name;
	this.createNew = function() {
		$(window).trigger('createNewStatus', this.name);
	}
}

$(window).on("createNewStatus", function(event, name) {
	// var id = Math.max.apply(Math.items.map(function(o){return o.y;}))
	var newHtml = '<section id='+5+'><header><span>'+name+'</span></header>';
	newHtml = newHtml + '<div class="tasks"><ul class="tasks-ul" ondragover="return false">';
	newHtml = newHtml + '</ul></div>';
	newHtml = newHtml + '<div class="add-task"><form><input type="text" /><span><button>add task</button></span></form></div></section>';
	$(classItems.wrapper).prepend(newHtml);
})

function handleDragStart(ev) {
	this.style.opacity = '0.4';
	var height = this.height;
	// document.body.style.cursor = "move"; Didn't work
}

function handleDragEnter(ev) {
	console.log("Drag enter");
	ev.currentTarget.style.background = "yellow";
}

function handleDragOver(ev) {
	if (globalDraggedElement != this) {
		ev.preventDefault();
	}
}

function handleDragLeave(ev) {

}

function handleDragEnd(ev) {
	this.style.opacity = '1';
	// document.body.style.cursor = "auto"; Didn't work
}

function handleDragDrop(ev) {
	var data = ev.dataTransfer.getData("text");
  	ev.target.textContent = data;
  	ev.preventDefault();
}

function createItems() {
	var items = JSON.parse(localStorage.getItem('items'));
	//Sorting According to the array
	items.sort(function(a,b){
    return a.position - b.position;
    	}
	);
	items.forEach(function(elements){
		var newHtml = '<section id='+elements.id+'><header><span>'+elements.name+'</span></header>';
		newHtml = newHtml + '<div class="tasks"><ul class="tasks-ul" ondragover="return false">';
		elements.tasks.sort(function(a,b){
			return a.position - b.position;
		})
		elements.tasks.forEach(function(element){
			newHtml = newHtml + '<li class="task" draggable="true">'+element.name+'</li>';
		});
		newHtml = newHtml + '</ul></div>';
		newHtml = newHtml + '<div class="add-task"><form><input type="text" /><span><button>add task</button></span></form></div></section>';
		$(classItems.wrapper).prepend(newHtml);
	});
}
