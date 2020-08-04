define([
    'require',
    'jquery',
    'base/js/namespace',
    'notebook/js/celltoolbar',
    'base/js/events',
    './models/basemodel'
], function (require, $, Jupyter, celltoolbar, events, model) {

    "use strict";

    var preset_name = 'Create Template';
    var CellToolbar = celltoolbar.CellToolbar;

    CellToolbar.prototype.old_rebuild = CellToolbar.prototype.rebuild;
    CellToolbar.prototype.rebuild = function () {
        events.trigger('toolbar_rebuild.CellToolbar', this.cell);
        this.old_rebuild();
    }

    function load_css(file) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = require.toUrl('./' + file);
        document.getElementsByTagName("head")[0].appendChild(link);
    }

    function change_cell_type(cell, type) {
        // Find all selected cells and unselect them
        Jupyter.notebook.get_selected_cells().forEach(function(selected_cell, item) {
            selected_cell.unselect();
        });
        cell.select();
        // Turn them to markdown
        if (type === 'markdown') {
            Jupyter.notebook.to_markdown();
        } else if (type === 'code') {
            Jupyter.notebook.to_code();
        }
    };

    var create_role_select = function(div, cell, celltoolbar) {

        if (cell.cell_type === null) {
            setTimeout(function () {
                create_role_select(div, cell, celltoolbar);
            }, 100);
        } else {

            var options_list = [];
            options_list.push(["Choose role", ""]);
            options_list.push(["Header", "header"]);
            options_list.push(["Footer", "footer"]);
            options_list.push(["Student Info", "student_info"]);
            options_list.push(["Group Info", "group_info"]);

            var setter = function (cell, val) {
                if (val === "") {
                    model.remove_metadata(cell);
                } else if (val === "header") {
                    model.to_header(cell);
                    change_cell_type(cell, 'markdown');
                } else if (val === "footer") {
                    model.to_footer(cell);
                    change_cell_type(cell, 'markdown');                    
                } else if (val === "student_info") {
                    model.to_student_info(cell);
                } else if (val === "group_info") {
                    model.to_group_info(cell);
                }
            };

            var select = $('<select/>');
            for (var i=0; i < options_list.length; i++) {
                var opt = $('<option/>')
                    .attr('value', options_list[i][1])
                    .text(options_list[i][0]);
                select.append(opt);
            };

            select.val(model.get_role(cell));
            select.change(function () {
                setter(cell, select.val());
                celltoolbar.rebuild();
            });

            $(div).append($('<span/>').append(select));
        }

    };

    var load_extension = function () {

        load_css("templatebar.css");

        CellToolbar.register_callback('templatecreator.role', create_role_select);

        var preset = [
            'templatecreator.role',
        ];

        CellToolbar.register_preset(preset_name, preset, Jupyter.notebook);

    };

    return {
        'load_ipython_extension': load_extension
    };
});