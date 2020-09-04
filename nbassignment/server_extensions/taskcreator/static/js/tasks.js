import {EditableTable} from "./table.js";
import Modal from "./modal.js";

function addTask(pool) {

    let body = $('<div/>');
    let table = $('<table/>').addClass('e2xtable');
    let row = $('<tr/>');
    row.append($('<td/>').text('Name'));
    let name_input = $('<input/>')
                        .attr('type', 'text')
                        .attr('id', 'task-name');
    row.append($('<td/>').append(name_input));
    table.append(row);
    body.append(table);

    let buttons = {
        'Add Task': {
            click: function () {
                window.open("/taskcreator/pools/" + pool + "/new/" + $('#task-name').val());
                location = location;
            },
            id: 'add-task-btn'
        },
        'Cancel': {}
    };
    new Modal('Add Task', body, buttons).open();
}

function deleteTask(task, pool) {
    let body = $('<div/>');
    let name = task.name;
    body.append($('<span/>').text('Do you want to delete the task ' + name + '?'));    

    let buttons = {
        'Delete Task': {
            click: function () {
                window.open("/taskcreator/pools/" + pool + "/remove/" + name, '_self');
            },
            id: 'delete-task-btn'
        },
        'Cancel': {}
    };
    new Modal('Delete Task', body, buttons).open();
}

export default function addTaskTable(tasks, pool) {
    let table_data = {
        "id": "tasktable",
        "columns": [
            ["Name", "name"],
            ["# of Questions", "questions"],
            ["Points", "points"],
            ["Edit", "link"],
            ["Delete", ""]
        ],
        "entries": tasks,
        "deleteEntry": function (task) {
            deleteTask(task, pool);
        }
    }
    let table = new EditableTable(table_data).make_table();

    let add_task = $('<button/>')
        .addClass('e2xbutton')
        .attr('id', 'add-task')
        .text('Add Task')
        .click(function () {
            addTask(pool);
        });

    let div = $('<div/>').attr('id', 'taskdiv');
    div.append(table);
    div.append(add_task);

    $('.body').append(div);
}