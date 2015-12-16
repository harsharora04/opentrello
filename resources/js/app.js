/*** Work in Progress
	dragging status and task
	if possible - height of the li
***/

var classItems = {
	wrapper: '.wrapper',
	addLane: '.button-add-lane',
	addTaskInput: '.add-task input',
	addTaskButton: '.add-task button',
	deleteStatusTaskButton: '.task-action button',
	deleteStatusButton: '.status-action',
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

	$(document).on('click',classItems.addLane, function(){
		var text = prompt("Add New Lane", "");
		if (text != null) {
			var lane = new Status(text);
			lane.createNew();
		}
	})

	$(document).on('keypress', classItems.addTaskInput, function(event){
		if(event.keyCode == 13) $(window).trigger("saveTask", $(this));
	});

	$(document).on('click', classItems.addTaskButton, function(){
		$(this).closest("div.add-task").find("input");
		var newEle = $(this).closest("div.add-task").find("input");
		console.log(newEle);
		var e = jQuery.Event("keypress");
		e.which = 13;
		e.keyCode = 13;
		newEle.trigger(e);
	})

	$(document).on('click', classItems.deleteStatusButton, function(){
		var statusid = $(this).data("statusid");
		var items = JSON.parse(localStorage.getItem("items"));
		for (var i = 0; i < items.length; i++) {
			if (items[i].id == statusid) {
				items.splice(i, 1);
				break;
			}
		}
		$("#"+statusid).remove();
		localStorage.setItem("items", JSON.stringify(items));
	})

	$(document).on('click', classItems.deleteStatusTaskButton, function(){
		var id = $(this).data("id");
		var statusid = $(this).data("statusid");
		var items = JSON.parse(localStorage.getItem('items'));
		for (var i = 0; i < items.length; i++) {
			if(items[i].id == statusid) {
				for(var j = 0; j < items[i].tasks.length; j++) {
					if(items[i].tasks[j].id == id) {
						items[i].tasks.splice(j, 1);
						break;
					}
				}
			}
		}
		$("#task-"+id).remove();
		localStorage.setItem("items", JSON.stringify(items));
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

$(window).on("deleteTask", function(event, element){

});

function getMaxStatus() {
	var max = 0;
	var array = JSON.parse(localStorage.getItem("items"));
	for(var i = 0; i < array.length; i++) {
		if (max < array[i].id) {
			max = array[i].id;
		}
	}
	++max;
	return max;
}

function getMaxTask() {
	var max = 0;
	var array = JSON.parse(localStorage.getItem("items"));
	for (var i = 0; i < array.length; i++) {
		var newArray = array[i].tasks;
		for (var j = 0; j < newArray.length; j++) {
			if (max < newArray[j].id) {
				max = newArray[j].id;
			}
		}
	}
	++max;
	return max;
}

$(window).on("saveTask", function(event, element){
	var newId = getMaxTask();
	if (element.value.trim() == "") return false;
	var id = $(element).data("id");
	var data = {
		"id": newId,
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
	var newHTML = '<li id="task-'+newId+'" class="task" draggable="true"><span>'+element.value+'</span><span class="task-action"><button class="fa fa-times" data-statusid='+id+' data-id='+newId+'></button></span></li>';
	$('#'+id+' div.tasks ul.tasks-ul').append(newHTML);
	localStorage.setItem('items', JSON.stringify(items));
	element.value = '';
});

$(window).on("createNewStatus", function(event, name) {
	var id = getMaxStatus();
	var newHtml = '<section draggable=true id='+id+'><header><span class="status-action" data-statusid='+id+'><i class="fa fa-times"></i></span><span>'+name+'</span></header>';
	newHtml = newHtml + '<div class="tasks"><ul class="tasks-ul" ondragover="return false">';
	newHtml = newHtml + '</ul></div>';
	newHtml = newHtml + '<div class="add-task"><input data-id='+id+' type="text" /><span><button data-id='+id+'>add task</button></span></div></section>';
	$(classItems.wrapper).prepend(newHtml);
	var a = [];
	var data = {
		"id": id,
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
	
}

function handleDragLeave(ev) {

}

function handleDragEnd(ev) {
	this.style.opacity = '1';
	// document.body.style.cursor = "auto"; Didn't work
}

function handleDragDrop(ev, id) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData('text');
	console.log(data);
}

function dropDelete(ev) {
	ev.preventDefault();
	var data = ev.dataTransfer.getData('text');
	console.log(data);
}
function createItems() {
	var items = JSON.parse(localStorage.getItem('items'));
	//Sorting According to the array
	items.forEach(function(elements){
		var newHtml = '<section draggable=true id='+elements.id+'><header><span class="status-action" data-statusid='+elements.id+'><i class="fa fa-times"></i></span><span>'+elements.name+'</span></header>';
		newHtml = newHtml + '<div class="tasks"><ul class="tasks-ul" ondragover="return false">';
		elements.tasks.forEach(function(element){
			newHtml = newHtml + '<li id="task-'+element.id+'" class="task" draggable="true"><span>'+element.name+'</span><span class="task-action"><button class="fa fa-times" data-statusid='+elements.id+' data-id='+element.id+'></button></span></li>';
		});
		newHtml = newHtml + '</ul></div>';
		newHtml = newHtml + '<div class="add-task"><input data-id='+elements.id+' type="text" /><span><button data-id='+elements.id+'>add task</button></span></div></section>';
		$(classItems.wrapper).prepend(newHtml);
	});
}
