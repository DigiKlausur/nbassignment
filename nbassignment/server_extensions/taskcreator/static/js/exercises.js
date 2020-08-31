import Modal from "./modal.js";

function make_fa_button(cls, click) {
    let btn = $('<div/>').click(click);
    btn.append($('<i/>').addClass(cls));
    return btn;
}

function addExercise(assignment) {

    let body = $('<div/>');
    let table = $('<table/>').addClass('e2xtable');
    let row = $('<tr/>');
    row.append($('<td/>').text('Name'));
    let name_input = $('<input/>')
                        .attr('type', 'text')
                        .attr('id', 'exercise-name');
    row.append($('<td/>').append(name_input));
    table.append(row);
    body.append(table);

    let buttons = {
        'Add Exercise': {
            click: function () {
                window.open("/taskcreator/assignments/" + assignment + "/" + $('#exercise-name').val());
                location = location;
            },
            id: 'add-exercise-btn'
        },
        'Cancel': {}
    };

    let title = 'Add Exercise';

    new Modal(title, body, buttons).open();
}

function deleteExercise(name, assignment) {

    let body = $('<div/>');
    body.append($('<span/>').text('Do you want to delete the exercise ' + name + '?'))    

    let buttons = {
        'Delete Exercise': {
            click: function () {
                window.open("/taskcreator/assignments/" + assignment + "/remove/" + name, '_self');
            },
            id: 'delete-exercise-btn'
        },
        'Cancel': {}
    };

    let title = 'Delete Exercise';

    new Modal(title, body, buttons).open();
}

export default function addExerciseTable(exercises, assignment) {
    let table = $('<table/>')
        .addClass('e2xtable')
        .attr('id', 'exercisetable');
    let head = $('<thead/>');
    let header = $('<tr/>');
    const columns = ['Name', 'Delete'];
    columns.forEach(function (column) {
        header.append($('<th/>').text(column));
    })
    table.append(head.append(header));
    let body = $('<tbody/>');
    exercises.forEach(function (exercise) {
        let row = $('<tr/>');
        row.append($('<td/>').append($('<a/>').attr('href', '/' + exercise.link).text(exercise.name)));
        row.append($('<td/>').append(
            make_fa_button('fa fa-trash-alt', () => deleteExercise(exercise.name, assignment))
        ));
        body.append(row);
    });
    table.append(body);

    let add_exercise = $('<button/>')
        .addClass('e2xbutton')
        .attr('id', 'add-exercise')
        .text('Add Exercise')
        .click(function () {
            addExercise(assignment);
        });

    let div = $('<div/>').attr('id', 'exercisediv');
    div.append(table);
    div.append(add_exercise);

    $('.body').append(div);
}