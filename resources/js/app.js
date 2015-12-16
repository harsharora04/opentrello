/*** Work in Progress
	Getting New Id for task and status
	dragging status and task
	adding task
	deleting status and task
	if possible - height of the li
***/

var classItems = {
	wrapper: '.wrapper',
	addLane: '.button-add-lane',
	addTaskInput: '.add-task input',
	addTaskButton: '.add-task button',
}

var initialObject = [
	{
		"id": "1",
		"name": "Pending", 
		"position": "1", 
		"tasks": [
			{
				"id": "1",
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
				"id": "2",
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
				"id": "3",
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
				"id": "4",
				"name": "Task",
				"position": "1"
			}
		]
	}
];
$(document).ready(function(){
	if(!localStorage.getItem('items')) {
		localStorage.setItem('installed',1);
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

	$(classItems.addTaskInput).keypress(function(event){
		if(event.keyCode == 13) $(window).trigger("saveTask", $(this));
	})
	$(classItems.addTaskButton).click(function(){
		$(window).trigger("saveTask", $(this).data("id"), $(this));
	})
});


function Status(name) {
	this.name = name;
	this.createNew = function() {
		$(window).trigger('createNewStatus', this.name);
	}
	this.deleteStatus = function() {
		$(window).trigger('deleteStatus');
	}
}

$(window).on("saveTask", function(event, element){
	var id = $(element).data("id");
	var data = {
		"id": "6",
		"name": element.value,
		"position": "6"
	}
	var items = JSON.parse(localStorage.getItem('items'));
	for (var i = 0; i < items.length; i++) {
		if(items[i].id == id) {
			items[i].tasks.push(data);
			break;
		}
	}
	var newHTML = '<li id="task-'+element.id+'" class="task" draggable="true"><span>'+element.value+'</span><span class="task-action"><button class="fa fa-times" data-id='+element.id+'></button></span></li>';
	$('#'+id+' div.tasks ul.tasks-ul').append(newHTML);
	localStorage.setItem('items', JSON.stringify(items));
	element.value = '';
});

$(window).on("createNewStatus", function(event, name) {
	// var id = Math.max.apply(Math.items.map(function(o){return o.y;}))
	var newHtml = '<section id='+5+'><header><span>'+name+'</span></header>';
	newHtml = newHtml + '<div class="tasks"><ul class="tasks-ul" ondragover="return false">';
	newHtml = newHtml + '</ul></div>';
	newHtml = newHtml + '<div class="add-task"><input type="text" /><span><button>add task</button></span></div></section>';
	$(classItems.wrapper).prepend(newHtml);
	var a = [];
	var data = {
		"id": "5",
		"name": name,
		"position": "1",
		"tasks": []
	};
    a = JSON.parse(localStorage.getItem('items'));
    a.push(data);
	localStorage.setItem('items',  JSON.stringify(a));
})

function handleDragStart(ev) {
	this.style.opacity = '0.4';
	var height = this.height;
	// document.body.style.cursor = "move"; Didn't work
}

function handleDragEnter(ev) {
	console.log("Drag enter");
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
}

function createItems() {
	var items = JSON.parse(localStorage.getItem('items'));
	//Sorting According to the array
	items.forEach(function(elements){
		var newHtml = '<section draggable=true id='+elements.id+'><header><span>'+elements.name+'</span></header>';
		newHtml = newHtml + '<div class="tasks"><ul class="tasks-ul" ondragover="return false">';
		elements.tasks.sort(function(a,b){
			return a.position - b.position;
		})
		elements.tasks.forEach(function(element){
			newHtml = newHtml + '<li id="task-'+element.id+'" class="task" draggable="true"><span>'+element.name+'</span><span class="task-action"><button class="fa fa-times" data-id='+element.id+'></button></span></li>';
		});
		newHtml = newHtml + '</ul></div>';
		newHtml = newHtml + '<div class="add-task"><input data-id='+elements.id+' type="text" /><span><button data-id='+elements.id+'>add task</button></span></div></section>';
		$(classItems.wrapper).prepend(newHtml);
	});
}
