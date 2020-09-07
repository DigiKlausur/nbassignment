define([
    'require',
    'jquery',
    'base/js/namespace',
    'base/js/utils',
    './dialogs/dialogs',
    './questionmanager'
], function (require, $, Jupyter, utils, dialogs, questionmanager) {

    'use strict';

    function question_menu() {
        let open_menu = $('<span/>').attr('id', 'insert-question').append($('<a/>').append('Add Question'));
        open_menu.addClass('e2xbutton e2xsubmenu');
        let menu = $('<ul/>').addClass('question_menu');
        open_menu.append(menu);

        new questionmanager.QuestionManager();
        return open_menu;
    }

    function template_menu() {
        var open_menu = $('<span/>').attr('id', 'insert-template-cell').append($('<a/>').append('Add Cell'));
        open_menu.addClass('e2xbutton e2xsubmenu');
        var menu = $('<ul/>').addClass('question_menu');
        var options = [
            ['Header', 'header'],
            ['Footer', 'footer'],
            ['Student Info', 'student_info'],
            ['Group Info', 'group_info']
        ]

        options.forEach(function (option) {
            var li = $('<li/>').addClass('question_item');
            li.append($('<a/>').append(option[0]));
            li.click(function () {
                dialogs.insert_template_cell(option[0], option[1]);
                //tasks.insert_task(option[1]);
            })
            menu.append(li);
        })

        open_menu.append(menu);
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

    function add_toolbar() {
        var div = $('<div/>').attr('id', 'questionbar');
        div.append($('<span/>').text('e²x').addClass('questionbutton'));

        div.append($('#save-notbook'));

        var items = [];
        if (is_taskbook()) {
            items.push(question_menu());
            items.push(file_menu());
            items.push(tag_menu());
            items.push($('#nbgrader-total-points-group'));
            items.push($('#move_up_down'));
            items.push($('#run_int'));
            $('#nbgrader-total-points-group').show();
        } else if (is_templatebook()) {
            items.push(template_menu());
            items.push(file_menu());
            items.push(tag_menu());
            items.push($('#nbgrader-total-points-group'));
            items.push($('#move_up_down'));
            items.push($('#run_int'));
            $('#nbgrader-total-points-group').hide();
        }

        items.forEach(function (item) {
            div.append(item);
        });
        
        div.insertAfter($('#maintoolbar-container'));
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

    function init() {
        if (is_taskbook()) {
            Jupyter.CellToolbar.activate_preset('Create Assignment');
            Jupyter.CellToolbar.global_show();
            load_css('question.css');
            add_toolbar();
            $('#maintoolbar-container').hide();
            var menus = [];//['insert_menu', 'file_menu'];
            menus.forEach(function (menu) {
                $('#' + menu).parent().hide();
            });

            var div = $('<div/>').attr('id', 'e2xheader');
            div.append($('<span/>').text('Task'));
            div.insertAfter($('#ipython_notebook'));            
        } else if (is_templatebook()) {
            Jupyter.CellToolbar.activate_preset('Create Template');
            Jupyter.CellToolbar.global_show();
            load_css('question.css');
            add_toolbar();
            $('#maintoolbar-container').hide();
            var menus = [];//['insert_menu', 'file_menu'];
            menus.forEach(function (menu) {
                $('#' + menu).parent().hide();
            });

            var div = $('<div/>').attr('id', 'e2xheader');
            div.append($('<span/>').text('Template'));
            div.insertAfter($('#ipython_notebook'));   
        }
    }

    function load_extension() {
        console.log(Jupyter.notebook);
        if (Jupyter.notebook) {
            init();
        } else {
            events.on('notebook_loaded.notebook', function () {
                init2();
            })
        }

    }

    return {
        load_ipython_extension: load_extension
    }

});