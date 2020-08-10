define([
    'jquery',
    'base/js/namespace',
    'base/js/dialog',
    './../tasks/tasks'
], function ($, Jupyter, dialog, tasks) {

    "use strict";

    function randomString(len) {
        var result = '';
        var chars = 'abcdef0123456789';
        for (var i=0; i < len; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    };

    var insert_template_cell = function (name, type) {
        var body = $('<div/>');
        var table = $('<table/>').addClass('e2xtable');

        var id = 'task_' + randomString(6);
        if (type === 'student_info') {
            id = 'student_info';
        } else if (type === 'group_info') {
            id = 'group_info';
        }

        var row1 = $('<tr/>');
        row1.append($('<td/>').append($('<span/>').text('Name:')));
        row1.append($('<td/>').addClass('column2').append($('<input/>')
            .attr('type', 'text')
            .attr('id', 'templatename')
            .val(id)));
        table.append(row1);

        var row3 = $('<tr/>');
        row3.append($('<td/>').append($('<span/>').text('Insert at:')));
        var insert_select = $('<select/>').attr('id', 'insert_point');
        var insert_options = ['bottom of notebook', 'below current cell', 'above current cell'];
        insert_options.forEach(function(option) {
            var opt = $('<option/>').append(option);
            insert_select.append(opt);
        });
        row3.append($('<td/>').addClass('column2').append(insert_select));
        table.append(row3);

        body.append(table);

        dialog.modal({
            keyboard_manager: Jupyter.keyboard_manager,
            title: 'Insert Template - ' + name,
            body: body,
            buttons: {
                OK: {
                    click: function () {
                        tasks.insert_template(type, $('#templatename').val(), $('#insert_point').val());
                    }
                },
                Cancel: {}
            }
        });

    }

    var insert_task = function (name, type) {
        var body = $('<div/>');
        var table = $('<table/>').addClass('e2xtable');

        var row1 = $('<tr/>');
        row1.append($('<td/>').append($('<span/>').text('Name:')));
        row1.append($('<td/>').addClass('column2').append($('<input/>')
            .attr('type', 'text')
            .attr('id', 'taskname')
            .val('task_' + randomString(6))));
        table.append(row1);

        var row2 = $('<tr/>');
        row2.append($('<td/>').append($('<span/>').text('Points:')));
        row2.append($('<td/>').addClass('column2').append($('<input/>')
            .attr('type', 'number')
            .attr('id', 'points')
            .attr('min', '0')
            .val(0)));
        table.append(row2);

        var row3 = $('<tr/>');
        row3.append($('<td/>').append($('<span/>').text('Insert at:')));
        var insert_select = $('<select/>').attr('id', 'insert_point');
        var insert_options = ['bottom of notebook', 'below current task', 'above current task'];
        insert_options.forEach(function(option) {
            var opt = $('<option/>').append(option);
            insert_select.append(opt);
        });
        row3.append($('<td/>').addClass('column2').append(insert_select));
        table.append(row3);

        body.append(table);

        dialog.modal({
            keyboard_manager: Jupyter.keyboard_manager,
            title: 'Insert Task - ' + name,
            body: body,
            buttons: {
                OK: {
                    click: function () {
                        tasks.insert_task(type, $('#taskname').val(), $('#points').val(), $('#insert_point').val());
                    }
                },
                Cancel: {}
            }
        });
    }

    var edit_task_dialog = function (cell, celltoolbar) {
        var taskname = 'task_' + randomString(6);
        if (cell.metadata.hasOwnProperty('nbassignment') && cell.metadata.nbassignment.hasOwnProperty('task')) {
            taskname = cell.metadata.nbassignment.task;
        }
        var body = $('<div/>');
        var table = $('<table/>');

        var name = $('<tr/>');
        name.append($('<td/>').append($('<span/>').text('Task name:')));
        name.append($('<td/>')
                .append($('<input/>')
                        .attr('type', 'text')
                        .attr('id', 'task_name')
                        .attr('value', taskname)));

        table.append(name);
        body.append(table);

        dialog.modal({
            keyboard_manager: Jupyter.keyboard_manager,
            title: 'Edit task',
            body: body,
            buttons: {
                OK: {
                    click: function () {
                        var name = $('#task_name').val();
                        cell.metadata.nbassignment['task'] = name;
                        celltoolbar.rebuild();
                    }

                },
                Cancel: {}
            }
        });

    };

    function get_tags() {
        var metadata = Jupyter.notebook.metadata;
        if (metadata.hasOwnProperty('nbassignment') && metadata.nbassignment.hasOwnProperty('tags')) {
            return metadata.nbassignment.tags.join(', ');
        }
        return [];
    }

    function add_tags(tags) {
        var tag_array = [];
        if (tags.trim().length > 0) {
            tag_array = tags.split(',');
            for (var i = 0; i < tag_array.length; i++) {
                tag_array[i] = tag_array[i].trim();
            }
        }
        var metadata = Jupyter.notebook.metadata;
        if (!metadata.hasOwnProperty('nbassignment')) {
            metadata['nbassignment'] = {
                'tags': tag_array
            }
        } else {
            metadata.nbassignment['tags'] = tag_array;
        }
    }

    var manage_tags = function () {
        var body = $('<div/>').addClass('e2xdialog');
        var table = $('<table/>');

        var name = $('<tr/>');
        name.append($('<td/>').append($('<span/>').text('Tags: (separate by comma)')));
        
        table.append(name);

        var tags = $('<span/>');
        tags.append($('<textarea/>').attr('id', 'tags').append(get_tags()));

        
        body.append(table);
        body.append(tags);

        dialog.modal({
            keyboard_manager: Jupyter.keyboard_manager,
            title: 'Manage Tags',
            body: body,
            buttons: {
                OK: {
                    click: function () {
                        add_tags($('#tags').val());                        
                    }
                },
                Cancel: {}
            }
        });

    }

    return {
        edit_task_dialog: edit_task_dialog,
        manage_tags: manage_tags,
        insert_task: insert_task,
        insert_template_cell: insert_template_cell
    };

});