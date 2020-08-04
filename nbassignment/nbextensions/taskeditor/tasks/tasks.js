define([
    'base/js/namespace'
], function (Jupyter) {

    "use strict";

    function nbgrader_metadata(type, name, points) {
        var metadata = {
            "schema_version": 3,
            "solution": false,
            "grade": false,
            "locked": false,
            "task": false,
            "grade_id": ''
        }
        if (type === 'question') {
            metadata.locked = true;
            metadata.grade_id = name + '_question';
        } else if (type === 'manual') {
            metadata.solution = true;
            metadata.grade = true;
            metadata['points'] = points;
            metadata.grade_id = name;
        } else if (type === 'auto') {
            metadata.solution = true;
            metadata.grade_id = name;
        } else if (type === 'test') {
            metadata.grade = true;
            metadata.locked = true;
            metadata['points'] = points;
            metadata.grade_id = 'test_' + name;
        }
        return metadata;
    }

    function insert_cells_at(index, cells) {
        var idx = index;
        cells.forEach(function (taskcell) {
            idx += 1;
            var cell = Jupyter.notebook.insert_cell_at_index(taskcell.type, idx);
            cell.set_text(taskcell.text);
            if (taskcell.metadata !== undefined) {
                cell.metadata = taskcell.metadata;
            }
        });   
    };

    function question_cell(name) {
        return {
            "metadata": {
                "nbassignment": {
                    "type": "question",
                    "task": name
                },
                "nbgrader": nbgrader_metadata('question', name, 0)
            },
            "text": "### Question\n\nPlease write your question here!",
            "type": "markdown"
        };
    }

    function insert_singlechoice_task(name, points, index) {

        var cells = [
            {
                "metadata": {
                    "nbassignment": {
                        "type": "question",
                        "task": name
                    },
                    "nbgrader": nbgrader_metadata('manual', name, points),
                    "extended_cell": {
                        "type": "singlechoice"
                    }
                },
                "text": "### Singlechoice Question\n\n- Option 1\n- Option 2\n- Option 3",
                "type": "markdown"
            }
        ];
        insert_cells_at(index, cells);
    }

    function insert_multiplechoice_task(name, points, index) {

        var cells = [
            {
                "metadata": {
                    "nbassignment": {
                        "type": "question",
                        "task": name
                    },
                    "nbgrader": nbgrader_metadata('manual', name, points),
                    "extended_cell": {
                        "type": "multiplechoice"
                    }
                },
                "text": "### Multiplechoice Question\n\n- Option 1\n- Option 2\n- Option 3",
                "type": "markdown"
            }
        ];
        insert_cells_at(index, cells);
    }

    function insert_text_task(name, points, index) {

        var cells = [
            question_cell(name),
            {
                "metadata": {
                    "nbassignment": {
                        "type": "text",
                        "task": name
                    },
                    "nbgrader": nbgrader_metadata('manual', name, points)
                },
                "text": "### Answer\n\nPlease write your answer here!",
                "type": "markdown"
            }
        ];
        insert_cells_at(index, cells);
    }

    function insert_manual_code_task(name, points, index) {
        var cells = [
            question_cell(name),
            {
                "metadata": {
                    "nbassignment": {
                        "type": "code",
                        "task": name
                    },
                    "nbgrader": nbgrader_metadata('manual', name, points)
                },
                "text": "# Answer\n\n# Please write your code answer here!",
                "type": "code"
            }
        ];
        insert_cells_at(index, cells);
    }

    function insert_auto_code_task(name, points, index) {
        var cells = [
            question_cell(name),
            {
                "metadata": {
                    "nbassignment": {
                        "type": "code",
                        "task": name
                    },
                    "nbgrader": nbgrader_metadata('auto', name, points)
                },
                "text": "# Answer\n\n# Please write your code answer here!",
                "type": "code"
            },
            {
                "metadata": {
                    "nbassignment": {
                        "type": "test",
                        "task": name
                    },
                    "nbgrader": nbgrader_metadata('test', name, points)
                },
                "text": "# Test\n\n# Please write your code test here!",
                "type": "code"
            }
        ];
        insert_cells_at(index, cells);
    }

    function insert_task(type, name, points, insert_point) {

        var idx = 0;
        if (insert_point == 'bottom of notebook') {
            idx = Jupyter.notebook.ncells();
        } else if (insert_point == 'below current task') {
            // Get selected index, find last task cell, take as idx
        }
        if (type === 'text') {
            insert_text_task(name, points, idx);
        } else if (type === 'manual_code') {
            insert_manual_code_task(name, points, idx);
        } else if (type === 'autograded_code') {
            insert_auto_code_task(name, points, idx);
        } else if (type === 'single_choice') {
            insert_singlechoice_task(name, points, idx);
        } else if (type === 'multiple_choice') {
            insert_multiplechoice_task(name, points, idx);
        }

    }

    function insert_template(type, name, insert_point)  {
        var idx = 0;
        if (insert_point == 'bottom of notebook') {
            idx = Jupyter.notebook.ncells();
        } else if (insert_point == 'below current task') {
            // Get selected index, find last task cell, take as idx
        }
        var header = {
            "metadata": {
                "nbassignment": {
                    "type": "header"
                },
                "nbgrader": nbgrader_metadata('question', name, 0)
            },
            "text": "### This is a header cell!",
            "type": "markdown"
        };
        var footer = {
            "metadata": {
                "nbassignment": {
                    "type": "footer"
                },
                "nbgrader": nbgrader_metadata('question', name, 0)
            },
            "text": "### This is a footer cell!",
            "type": "markdown"
        };
        var student_info = {
            "metadata": {
                "nbassignment": {
                    "type": "student_info"
                },
            },
            "text": "# Please fill in your matriculation number\nmatrikel = ''",
            "type": "code"
        };
        var group_info = {
            "metadata": {
                "nbassignment": {
                    "type": "group_info"
                },
            },
            "text": "# Please fill in the usernames of all team members!\nstudent1 = ''\nstudent2 = ''",
            "type": "code"
        };
        var cells = [];
        if (type === 'header') {
            cells = [header];
        } else if (type === 'footer') {
            cells = [footer];
        } else if (type === 'student_info') {
            cells = [student_info];
        } else if (type === 'group_info') {
            cells = [group_info];
        }
        insert_cells_at(idx, cells);
    }

    return {
        insert_task: insert_task,
        insert_template: insert_template
    };

});