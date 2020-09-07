define([
    'jquery',
    'base/js/namespace',
    'base/js/utils',
    'base/js/dialog',
    './models/nbgrader'
], function ($, Jupyter, utils, dialog, nbmodel) {

    'use strict';

    class QuestionManager {

        constructor() {
            this.base_url = utils.url_path_join(Jupyter.notebook.base_url, 'taskcreator/api/presets');
            this.menu_selector = '.question_menu';
            this.load_list();
        }
        
        generate_task_ids(cells, taskname, points) {
            const model = new nbmodel.NbgraderModel();
            
            let descriptions = 0;
            let tests = 0;
            
            cells.forEach(function (cell) {
                if (model.is_description(cell)) {
                    model.set_id(cell, taskname + '_description' + descriptions);
                    descriptions += 1;
                } else if (model.is_test(cell)) {
                    model.set_id(cell, 'test' + tests + '_' + taskname);
                    model.set_points(cell, points);
                    tests += 1;
                } else if (model.is_solution(cell)) {
                    model.set_id(cell, taskname);
                    model.set_points(cell, points);
                }
            });
        }

        randomString(len) {
            let result = '';
            const chars = 'abcdef0123456789';
            for (let i=0; i < len; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
            return result; 
        }

        handle_load_list(options) {
            let that = this;
            $(this.menu_selector).empty();
            options.forEach(function (option) {
                let li = $('<li/>')
                    .addClass('question_item')
                    .append($('<a/>').append(option));
                li.click(() => that.insert_dialog(option));
                $(that.menu_selector).append(li);
            });
        }

        load_list() {
            let that = this;
            let settings = {
                processData: false,
                cache: false,
                type: 'GET',
                dataType: 'json',
                success: function (data, status, xhr) {
                    that.handle_load_list(data);
                },
                error: function (data, status, xhr) {
                    console.log('Error fetching question presets!');
                }
            };
            utils.ajax(utils.url_path_join(this.base_url, 'list'), settings);
        }

        handle_insert_task(cells, name, points) {
            let idx = Jupyter.notebook.ncells();
            this.generate_task_ids(cells, name, points);
            cells.forEach(function (taskcell) {
                let cell = Jupyter.notebook.insert_cell_at_index(taskcell.cell_type, idx);
                cell.set_text(taskcell.source);
                if (taskcell.metadata !== undefined) {
                    cell.metadata = taskcell.metadata;
                }
                idx += 1;
            });
        }

        insert_task(preset, name, points) {
            let that = this;
            let settings = {
                cache: false,
                type: 'GET',
                dataType: 'json',
                data: {
                    'name': preset
                },
                success: function (data, status, xhr) {
                    that.handle_insert_task(data, name, points);
                },
                error: function (data, status, xhr) {
                    console.log('Error inserting question!');
                }
            };
            utils.ajax(utils.url_path_join(this.base_url, 'get'), settings);
        }

        insert_dialog(preset) {
            let that = this;            
            let table = $('<table/>').addClass('e2xtable');

            let nameRow = $('<tr/>')
                .append($('<td/>').append($('<span/>').text('Name:')))
                .append($('<td/>').addClass('column2').append(
                    $('<input/>')
                        .attr('type', 'text')
                        .attr('id', 'taskname')
                        .val('task_' + this.randomString(6))));

            let pointRow = $('<tr/>')
                .append($('<td/>').append($('<span/>').text('Points:')))
                .append($('<td/>').addClass('column2').append(
                    $('<input/>')
                        .attr('type', 'number')
                        .attr('id', 'points')
                        .attr('min', '0')
                        .val(0)));

            let body = $('<div/>').append(table
                .append(nameRow)
                .append(pointRow));

            dialog.modal({
                keyboard_manager: Jupyter.keyboard_manager,
                title: 'Insert Question - ' + preset,
                body: body,
                buttons: {
                    OK: {
                        click: () => that.insert_task(preset, $('#taskname').val(), $('#points').val())
                    },
                    Cancel: {}
                }});
        }
    }

    return {
        QuestionManager: QuestionManager
    }

});