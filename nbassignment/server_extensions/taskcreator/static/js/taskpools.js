import {EditableTable} from "./table.js";
import Modal from "./modal.js";

function addPool() {

    let body = $('<div/>');
    let table = $('<table/>').addClass('e2xtable');
    let row = $('<tr/>');
    row.append($('<td/>').text('Name'));
    let name_input = $('<input/>')
                        .attr('type', 'text')
                        .attr('id', 'pool-name');
    row.append($('<td/>').append(name_input));
    table.append(row);
    body.append(table);

    let buttons = {
        'Add Taskpool': {
            click: function () {
                window.open("/taskcreator/pools/new/" + $('#pool-name').val());
                location = location;
            },
            id: 'add-pool-btn'
        },
        'Cancel': {}
    };

    let title = 'Add Taskpool';

    new Modal(title, body, buttons).open();
}

function deletePool(name) {

    let body = $('<div/>');
    body.append($('<p/>').text('Do you want to delete the taskpool ' + name + '?'));
    body.append($('<p/>').text('This will delete all tasks in this pool!'));
    

    let buttons = {
        'Delete Taskpool': {
            click: function () {
                window.open("/taskcreator/pools/remove/" + name, '_self');
            },
            id: 'delete-pool-btn'
        },
        'Cancel': {}
    };

    let title = 'Delete Taskpool';

    new Modal(title, body, buttons).open();
}

export default function addTaskPoolTable(pools) {
    let table_data = {
        "id": "taskpooltable",
        "columns": [
            ["Name", "name"],
            ["# of Tasks", "tasks"],
            ["Edit", "link"],
            ["Delete", ""]
        ],
        "entries": pools,
        "deleteEntry": function (pool) {
            deletePool(pool.name);
        }
    }
    let table = new EditableTable(table_data).make_table();

    let add_pool = $('<button/>')
        .addClass('e2xbutton')
        .attr('id', 'add-pool')
        .text('Add Taskpool')
        .click(addPool);

    let div = $('<div/>').attr('id', 'taskdiv');
    div.append(table);
    div.append(add_pool);

    $('.body').append(div);
}