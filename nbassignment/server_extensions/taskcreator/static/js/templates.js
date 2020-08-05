import Modal from "./modal.js";

function addTemplate() {

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
                window.open("/taskcreator/new_template/" + $('#template-name').val());
                location = location;
            },
            id: 'add-template-btn'
        },
        'Cancel': {}
    };

    let title = 'Add Template';

    new Modal(title, body, buttons).open();
}

function deleteTemplate(name) {

    let body = $('<div/>');
    body.append($('<span/>').text('Do you want to delete the template ' + name + '?'))
    

    let buttons = {
        'Delete Template': {
            click: function () {
                window.open("/taskcreator/delete_template/" + name, '_self');
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

export default function addTemplateTable(templates) {
    let table = $('<table/>')
        .addClass('e2xtable')
        .attr('id', 'templatetable');
    let head = $('<thead/>');
    let header = $('<tr/>');
    const columns = ['Name', 'Edit', 'Delete'];
    columns.forEach(function (column) {
        header.append($('<th/>').text(column));
    })
    table.append(head.append(header));
    let body = $('<tbody/>');
    templates.forEach(function (template) {
        let row = $('<tr/>');
        row.append($('<td/>').text(template.name));
        row.append($('<td/>').append(
            make_fa_button('fa fa-edit', () => window.open('/' + template.link, '_blank'))
        ));
        row.append($('<td/>').append(
            make_fa_button('fa fa-trash-alt', () => deleteTemplate(template.name))
        ));
        body.append(row);
    });
    table.append(body);

    let add_template = $('<button/>')
        .addClass('e2xbutton')
        .attr('id', 'add-template')
        .text('Add Template')
        .click(addTemplate);

    let div = $('<div/>').attr('id', 'templatediv');
    div.append(table);
    div.append(add_template);

    $('.body').append(div);
}