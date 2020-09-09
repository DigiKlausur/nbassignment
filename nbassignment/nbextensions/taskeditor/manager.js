define([
    'jquery',
    'base/js/namespace',
    'base/js/utils',
    'base/js/dialog',
    './models/nbgrader'
], function ($, Jupyter, utils, dialog, nbmodel) {

    'use strict';

    class PresetManager {

        constructor(preset_type) {
            this.base_url = utils.url_path_join(Jupyter.notebook.base_url, 'taskcreator/api/presets');
            this.menu_selector = '.question_menu';
            this.option_class = 'question_item';
            this.preset_type = preset_type;
            this.load_list();
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
                    .addClass(that.option_class)
                    .append($('<a/>').append(option));
                li.click(() => that.insert_dialog(option));
                $(that.menu_selector).append(li);
            });
        }

        load_list() {
            let that = this;
            let settings = {
                cache: false,
                type: 'GET',
                dataType: 'json',
                data: {
                    action: 'list',
                    type: this.preset_type
                },
                success: function (data, status, xhr) {
                    that.handle_load_list(data);
                },
                error: function (data, status, xhr) {
                    console.log('Error fetching presets!');
                }
            };
            console.log('Load list!');
            console.log(settings);
            utils.ajax(this.base_url, settings);
        }

        insert_preset(preset, preset_data) {
            let that = this;
            let settings = {
                cache: false,
                type: 'GET',
                dataType: 'json',
                data: {
                    action: 'get',
                    type: this.preset_type,
                    name: preset
                },
                success: function (data, status, xhr) {
                    that.handle_insert_preset(data, preset_data);
                },
                error: function (data, status, xhr) {
                    console.log('Error inserting preset!');
                }
            };
            utils.ajax(this.base_url, settings);
        }

    }

    class QuestionManager extends PresetManager {

        constructor() {
            super('question');
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

        handle_insert_preset(cells, preset_data) {
            let idx = Jupyter.notebook.ncells();
            this.generate_task_ids(cells, preset_data.name, preset_data.points);
            cells.forEach(function (taskcell) {
                let cell = Jupyter.notebook.insert_cell_at_index(taskcell.cell_type, idx);
                cell.set_text(taskcell.source);
                if (taskcell.metadata !== undefined) {
                    cell.metadata = taskcell.metadata;
                }
                idx += 1;
            });
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
                        click: () => that.insert_preset(
                            preset, 
                            {'name': $('#taskname').val(),
                             'points': $('#points').val()}
                        )
                    },
                    Cancel: {}
                }});
        }

    }    

    class TemplateManager extends PresetManager {

        constructor() {
            super('template');
        }

        generate_template_ids(cells, name) {
            const model = new nbmodel.NbgraderModel();
            let counter = 0;
            cells.forEach(function (cell) {
                model.to_description(cell, '${name}_${counter}');
                counter += 1;
            });
        }

        handle_insert_preset(cells, preset_data) {
            let idx = Jupyter.notebook.ncells();
            this.generate_template_ids(cells, preset_data.name);
            cells.forEach(function (taskcell) {
                let cell = Jupyter.notebook.insert_cell_at_index(taskcell.cell_type, idx);
                cell.set_text(taskcell.source);
                if (taskcell.metadata !== undefined) {
                    cell.metadata = taskcell.metadata;
                }
                idx += 1;
            });
        }

        insert_dialog(preset) {
            let that = this;            
            let table = $('<table/>').addClass('e2xtable');

            let nameRow = $('<tr/>')
                .append($('<td/>').append($('<span/>').text('Name:')))
                .append($('<td/>').addClass('column2').append(
                    $('<input/>')
                        .attr('type', 'text')
                        .attr('id', 'templatename')
                        .val('template_' + this.randomString(6))));

            let body = $('<div/>').append(table
                .append(nameRow));

            dialog.modal({
                keyboard_manager: Jupyter.keyboard_manager,
                title: 'Insert Template - ' + preset,
                body: body,
                buttons: {
                    OK: {
                        click: () => that.insert_preset(
                            preset, 
                            {'name': $('#templatename').val()}
                        )
                    },
                    Cancel: {}
                }});
        }
    }

    return {
        QuestionManager: QuestionManager,
        TemplateManager: TemplateManager
    }

});