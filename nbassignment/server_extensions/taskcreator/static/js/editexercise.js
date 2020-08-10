export function generateExercise(exercise, assignment) {
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
        let data = JSON.stringify({
            'template': template,
            'tasks': tasks,
            'exercise': exercise,
            'assignment': assignment
        });
        console.log(data);
        alert('Template: ' + template + '\nTasks: ' + tasks);
        $.ajax({
            url: "/taskcreator/api/generate_exercise",
            type: "get",
            dataType: 'json',
            'data': {
                'resources': data
            },
            success: function(response) {
                window.open('/notebooks/source/' + assignment + '/' + exercise + '.ipynb', '_self');
                //window.open('/taskcreator/assignments/' + assignment, '_self');
            },
            error: function(xhr) {
                console.log('Oh no!')
                console.log(xhr)
            }
        });
    })

    $('#generate').append(generate_button);
}

export function addTaskSelector(pools) {
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
                url: "/taskcreator/api/tasks",
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