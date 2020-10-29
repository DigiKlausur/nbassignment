function addOptionsTable(options) {
    
    if (options.length < 1) {
        return;
    }
    let table = $('<table/>')
        .addClass('e2xtable')
        .attr('id', 'templateoptionstable');
    let head = $('<thead/>');
    let header = $('<tr/>');
    const columns = ['Name', 'Value'];
    columns.forEach(function (column) {
        header.append($('<th/>').text(column));
    })
    table.append(head.append(header));
    let body = $('<tbody/>');
    options.forEach(function (option) {
        let row = $('<tr/>');
        row.append($('<td/>').text(option));
        row.append($('<td/>')
            .append($('<input/>')
                .attr('type', 'text')
                .attr('id', option)));
        body.append(row);
    });
    table.append(body);

    $('#template-options').append($('<p/>').text('You can use variables in templates using {{ var }}. Here you can set the values!'));
    $('#template-options').append(table);
}

export function exerciseOptions() {
    let options = $('#exercise-options');
    let table = $('<table/>')
        .addClass('e2xtable')
        .attr('id', 'exerciseoptionstable');
    let head = $('<thead/>');
    let header = $('<tr/>');
    const columns = ['Option', 'Value'];
    columns.forEach(function (column) {
        header.append($('<th/>').text(column));
    })
    table.append(head.append(header));
    let body = $('<tbody/>');

    let row1 = $('<tr/>');
    row1.append($('<td/>').text('Add Task Headers'))
    row1.append($('<td/>').append($('<input/>')
        .attr('type', 'checkbox')
        .attr('id', 'task-headers')
        .attr('checked', true)
    ));
    body.append(row1);
    table.append(body);

    options.append(table);

}

export function templateOptions(base_url) {
    let template = $('#template');
    if (template.length > 0) {
        template.change(function () {
            let choosen = $(this).val();
            $('#template-options').empty();
            if (choosen != '') {
                $.ajax({
                    url: base_url + "/taskcreator/api/templates/variables",
                    type: "get",
                    data: {
                        'template': choosen
                    },
                    success: function(response) {
                        let options = $.parseJSON(response);
                        console.log(options);
                        addOptionsTable(options);
                    },
                    error: function(xhr) {
                        console.log('Oh no!')
                        console.log(xhr)
                    }
                });
            }

        });
    }
}

export function generateExercise(exercise, assignment, base_url) {
    let generate_button = $('<button/>')
        .attr('id', 'generate-exercise')
        .text('Generate Exercise');

    generate_button.click(function () {
        let template = $('#template').val();
        let tasks = [];
        $('#selected-tasks option').each(function () {
            tasks.push($(this).val());
        });
        $(this).prop('disabled', true);
        let template_options = {};
        $('#template-options input').each(function () {
            template_options[$(this).attr('id')] = $(this).val();
        });
        let exercise_options = {};
        $('#exercise-options input').each(function () {
            if ($(this).attr('type') === 'checkbox') {
                exercise_options[$(this).attr('id')] = $(this).prop('checked');
            } else {
                exercise_options[$(this).attr('id')] = $(this).val();
            }
        });
        console.log(template_options);
        let data = JSON.stringify({
            'template': template,
            'template_options': template_options,
            'tasks': tasks,
            'exercise': exercise,
            'assignment': assignment,
            'exercise_options': exercise_options
        });
        $.ajax({
            url: base_url + "/taskcreator/api/generate_exercise",
            type: "get",
            dataType: 'json',
            'data': {
                'resources': data
            },
            success: function(response) {
                window.open(base_url + '/notebooks/source/' + assignment + '/' + exercise + '.ipynb', '_self');
            },
            error: function(xhr) {
                console.log('Oh no!')
                console.log(xhr)
            }
        });
    })

    $('#generate').append(generate_button);
}

export function addTaskSelector(pools, base_url) {
    let table = $('<table/>')
        .attr('id', 'tasks');

    let header = $('<tr/>');
    header.append($('<td/>')
                    .addClass('side-col')
                    .text('Selected Tasks'));
    header.append($('<td/>').addClass('mid-col'));
    

    let pool_select = $('<select/>').attr('name', 'pool');
    pool_select.append($('<option/>').attr('value', '').text('Choose a pool'));
    pools.forEach(function(pool) {
        let option = $('<option/>').attr('value', pool.name).text(pool.name);
        pool_select.append(option);
    });
    pool_select.change(function () {
        let pool = pool_select.val();
        $('#pool-tasks').empty();
        if (pool != '') {
            $.ajax({
                url: base_url + "/taskcreator/api/tasks",
                type: "get",
                data: {
                    'pool': pool
                },
                success: function(response) {
                    let tasks = $.parseJSON(response);
                    tasks.forEach(function(task) {
                        let opt = $('<option/>')
                            .attr('value', pool + '/' + task.name)
                            .text(task.name);
                        $('#pool-tasks').append(opt);
                    });
                },
                error: function(xhr) {
                    console.log('Oh no!')
                    console.log(xhr)
                }
            });
        }
    });

    header.append($('<td/>')
                    .addClass('side-col')
                    .append($('<span/>').text('Task Pool'))
                    .append(pool_select));

    table.append(header);

    let body = $('<tr/>');

    let selected_tasks_col = $('<td/>').addClass('side-col');
    let selected_tasks = $('<select/>')
                            .attr('id', 'selected-tasks')
                            .attr('multiple', 'multiple')
                            .attr('size', '10');
    selected_tasks_col.append(selected_tasks);
    body.append(selected_tasks_col);

    let button_col = $('<td/>').addClass('mid-col');
    button_col.append($('<button/>').text('Add').click(function () {
        let tasks = $('#pool-tasks').val();
        if (tasks != null) {
            tasks.forEach(function (task) {
                let opt = $('<option/>')
                    .attr('value', task)
                    .text(task);
                if ($('#selected-tasks option[value="' + task + '"]').length == 0) {
                    $('#selected-tasks').append(opt);
                }
            });
        }
    }));
    button_col.append($('<button/>').text('Remove').click(function () {
        let tasks = $('#selected-tasks').val();
        if (tasks != null) {
            tasks.forEach(function (task) {
                $('#selected-tasks option[value="' + task + '"]').remove();
            });
        }
    }));
    body.append(button_col);

    let pool_tasks_col = $('<td/>').addClass('side-col');
    let pool_tasks = $('<select/>')
                            .attr('id', 'pool-tasks')
                            .attr('multiple', 'multiple')
                            .attr('size', '10');
    pool_tasks_col.append(pool_tasks);
    body.append(pool_tasks_col);

    table.append(body);



    $('#task-select').append(table);
}