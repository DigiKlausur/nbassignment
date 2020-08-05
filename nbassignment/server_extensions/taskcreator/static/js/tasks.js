import Modal from "./modal.js";

function addTask() {

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
                window.open("/taskcreator/new_task/" + $('#task-name').val());
                location = location;
            },
            id: 'add-task-btn'
        },
        'Cancel': {}
    };

    let title = 'Add Task';

    new Modal(title, body, buttons).open();
}

function deleteTask(name) {

    let body = $('<div/>');
    body.append($('<span/>').text('Do you want to delete the task ' + name + '?'))
    

    let buttons = {
        'Delete Task': {
            click: function () {
                window.open("/taskcreator/delete_task/" + name, '_self');
            },
            id: 'delete-task-btn'
        },
        'Cancel': {}
    };

    let title = 'Delete Task';

    new Modal(title, body, buttons).open();
}

function make_fa_button(cls, click) {
    let btn = $('<div/>').click(click);
    btn.append($('<i/>').addClass(cls));
    return btn;
}

export default function addTaskTable(tasks) {
    let table = $('<table/>')
        .addClass('e2xtable')
        .attr('id', 'tasktable');
    let head = $('<thead/>');
    let header = $('<tr/>');
    const columns = ['Name', '# of Questions', 'Points', 'Edit', 'Delete'];
    columns.forEach(function (column) {
        header.append($('<th/>').text(column));
    })
    table.append(head.append(header));
    let body = $('<tbody/>');
    tasks.forEach(function (task) {
        let row = $('<tr/>');
        row.append($('<td/>').text(task.name));
        row.append($('<td/>').text(task.questions));
        row.append($('<td/>').text(task.points));
        row.append($('<td/>').append(
            make_fa_button('fa fa-edit', () => window.open('/' + task.link, '_blank'))
        ));
        row.append($('<td/>').append(
            make_fa_button('fa fa-trash-alt', () => deleteTask(task.name))
        ));
        body.append(row);
    });
    table.append(body);

    let add_task = $('<button/>')
        .addClass('e2xbutton')
        .attr('id', 'add-task')
        .text('Add Task')
        .click(addTask);

    let div = $('<div/>').attr('id', 'taskdiv');
    div.append(table);
    div.append(add_task);

    $('.body').append(div);
}