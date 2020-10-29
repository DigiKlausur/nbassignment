import {EditableTable} from "./table.js";
import Modal from "./modal.js";

function addExercise(assignment, base_url) {

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
                window.open(base_url + "/taskcreator/assignments/" + assignment + "/" + $('#exercise-name').val());
                location.reload();
            },
            id: 'add-exercise-btn'
        },
        'Cancel': {}
    };

    let title = 'Add Exercise';

    new Modal(title, body, buttons).open();
}

function deleteExercise(exercise, assignment, base_url) {
    let name = exercise.name;

    let body = $('<div/>');
    body.append($('<span/>').text('Do you want to delete the exercise ' + name + '?'))    

    let buttons = {
        'Delete Exercise': {
            click: function () {
                window.open(base_url + "/taskcreator/assignments/" + assignment + "/remove/" + name, '_self');
            },
            id: 'delete-exercise-btn'
        },
        'Cancel': {}
    };

    let title = 'Delete Exercise';

    new Modal(title, body, buttons).open();
}

export default function addExerciseTable(exercises, assignment, base_url) {
    let table_data = {
        "id": "exercisetable",
        "columns": [
            ["Name", "name"],
            ["Delete", ""]
        ],
        "entries": exercises,
        "deleteEntry": function (exercise) {
            deleteExercise(exercise, assignment, base_url);
        }
    };
    let table = new EditableTable(table_data, '_blank', base_url).make_table();

    let add_exercise = $('<button/>')
        .addClass('e2xbutton')
        .attr('id', 'add-exercise')
        .text('Add Exercise')
        .click(() => addExercise(assignment, base_url));

    let div = $('<div/>').attr('id', 'exercisediv');
    div.append(table);
    div.append(add_exercise);

    $('.body').append(div);
}