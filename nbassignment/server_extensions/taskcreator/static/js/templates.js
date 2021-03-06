import {EditableTable} from "./table.js";
import Modal from "./modal.js";

function addTemplate(base_url) {

    let body = $('<div/>');
    let table = $('<table/>').addClass('e2xtable');
    let row = $('<tr/>');
    row.append($('<td/>').text('Name'));
    let name_input = $('<input/>')
                        .attr('type', 'text')
                        .attr('id', 'template-name');
    row.append($('<td/>').append(name_input));
    table.append(row);
    body.append(table);

    let buttons = {
        'Add Template': {
            click: function () {
                window.open(base_url + "/taskcreator/templates/new/" + $('#template-name').val());
                location.reload();
            },
            id: 'add-template-btn'
        },
        'Cancel': {}
    };

    let title = 'Add Template';

    new Modal(title, body, buttons).open();
}

function deleteTemplate(name, base_url) {

    let body = $('<div/>');
    body.append($('<span/>').text('Do you want to delete the template ' + name + '?'))
    

    let buttons = {
        'Delete Template': {
            click: function () {
                window.open(base_url + "/taskcreator/templates/remove/" + name, '_self');
            },
            id: 'delete-template-btn'
        },
        'Cancel': {}
    };

    let title = 'Delete Template';

    new Modal(title, body, buttons).open();
}

function make_fa_button(cls, click) {
    let btn = $('<div/>').click(click);
    btn.append($('<i/>').addClass(cls));
    return btn;
}

export default function addTemplateTable(templates, base_url) {
    let table_data = {
        "id": "templatetable",
        "columns": [
            ["Name", "name"],
            ["Edit", "link"],
            ["Delete", ""]
        ],
        "entries": templates,
        "deleteEntry": function (template) {
            deleteTemplate(template.name, base_url);
        }
    }
    let table = new EditableTable(table_data, '_blank', base_url).make_table();

    let add_template = $('<button/>')
        .addClass('e2xbutton')
        .attr('id', 'add-template')
        .text('Add Template')
        .click(() => addTemplate(base_url));

    let div = $('<div/>').attr('id', 'templatediv');
    div.append(table);
    div.append(add_template);

    $('.body').append(div);
}