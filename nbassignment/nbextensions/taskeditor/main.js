define([
    'require',
    'jquery',
    'base/js/namespace',
    'base/js/utils',
    './dialogs/dialogs',
    './manager'
], function (require, $, Jupyter, utils, dialogs, manager) {

    'use strict';

    function question_menu() {
        let open_menu = $('<span/>').attr('id', 'insert-question').append($('<a/>').append('Add Question'));
        open_menu.addClass('e2xbutton e2xsubmenu');
        let menu = $('<ul/>').addClass('question_menu');
        open_menu.append(menu);

        new manager.QuestionManager();
        return open_menu;
    }

    function template_menu() {
        let open_menu = $('<span/>').attr('id', 'insert-template-cell').append($('<a/>').append('Add Cell'));
        open_menu.addClass('e2xbutton e2xsubmenu');
        let menu = $('<ul/>').addClass('question_menu');
        open_menu.append(menu);

        new manager.TemplateManager();
        return open_menu;
    }

    function file_menu() {
        var open_menu = $('<span/>').attr('id', 'add-files').append($('<a/>').append('Add Files'));
        open_menu.addClass('e2xbutton e2xsubmenu');
        var menu = $('<ul/>').addClass('files_menu');
        var options = [
            ['Images', 'img'],
            ['Other Files', 'data']
        ]

        options.forEach(function (option) {
            var li = $('<li/>').addClass('question_item');
            li.append($('<a/>').append(option[0]));
            li.click(function () {
                var path = Jupyter.notebook.notebook_path;
                path = '/tree/' + path.replace(Jupyter.notebook.notebook_name, '') + option[1];
                window.open(path);
            })
            menu.append(li);
        })

        open_menu.append(menu);
        return open_menu;
    }

    function tag_menu() {
        var tag_selector = $('<span/>').attr('id', 'manage-tags');
        tag_selector.addClass('e2xbutton e2xsubmenu');
        tag_selector.append($('<a/>').append('Manage Tags'));
        tag_selector.click(function () {
            dialogs.manage_tags();
        });
        return tag_selector;
    }

    function load_css(file) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl('./' + file);
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    function is_taskbook() {
        var metadata = Jupyter.notebook.metadata;
        return (metadata.hasOwnProperty('nbassignment')) 
            && (metadata.nbassignment.hasOwnProperty('type'))
            && (metadata.nbassignment.type === 'task');
    }

    function is_templatebook() {
        var metadata = Jupyter.notebook.metadata;
        return (metadata.hasOwnProperty('nbassignment')) 
            && (metadata.nbassignment.hasOwnProperty('type'))
            && (metadata.nbassignment.type === 'template');
    }

    function replace_run_button() {
        let btn = $('<button/>')
            .addClass('btn btn-default')
            .append($('<i/>').addClass('fa fa-play'))
            .append($('<span/>').addClass('toolbar-btn-label').text('Run'))
            .attr('title', 'run selected cell(s)')
            .click(() => Jupyter.notebook.execute_cell());

        $('#run_int > button').first().replaceWith(btn);
    }

    function remap_key_bindings() {
        let shortcuts = ['alt-enter', 'shift-enter'];

        shortcuts.forEach(function (shortcut) {
            Jupyter.keyboard_manager.command_shortcuts.remove_shortcut(shortcut);
            Jupyter.keyboard_manager.edit_shortcuts.add_shortcut(shortcut, {
                help : 'run cell',
                help_index : 'zz',
                handler : function (event) {
                    IPython.notebook.execute_cell();
                    return false;
                }}
            )
        });
    }

    function init() {
        let preset, name;
        let items = [];

        if (!is_taskbook() && !is_templatebook()) {
            return;
        } else if (is_taskbook()) {
            preset = 'Create Assignment';
            name = 'Task';
            items.push(question_menu());
            $('#nbgrader-total-points-group').show();
        } else {
            preset = 'Create Template';
            name = 'Template';
            items.push(template_menu());
            $('#nbgrader-total-points-group').hide();
        }

        items.push(file_menu());
        items.push(tag_menu());
        items.push($('#nbgrader-total-points-group'));
        items.push($('#move_up_down'));
        items.push($('#run_int')); 

        Jupyter.CellToolbar.activate_preset(preset);
        Jupyter.CellToolbar.global_show();
        load_css('taskeditor.css');

        $('#maintoolbar-container').hide();
        $('<div/>')
            .attr('id', 'e2xheader')
            .append($('<span/>').text(name))
            .insertAfter($('#ipython_notebook'));               
        
        var div = $('<div/>').attr('id', 'questionbar');
        div.append($('<span/>').text('e²x').addClass('questionbutton'));

        if (is_taskbook()) {
            div.append($('#nbgrader-total-points-group'));
        }

        div.append($('#save-notbook'));
        items.forEach(function (item) {
            div.append(item);
        });
        div.insertAfter($('#maintoolbar-container'));
        remap_key_bindings();
        replace_run_button();
    }

    function load_extension() {
        if (Jupyter.notebook) {
            init();
        } else {
            events.on('notebook_loaded.notebook', function () {
                init();
            })
        }
    }

    return {
        load_ipython_extension: load_extension
    }

});