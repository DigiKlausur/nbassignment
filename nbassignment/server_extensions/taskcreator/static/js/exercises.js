import Modal from "./modal.js";

export default function addExerciseTable(exercises) {
    let table = $('<table/>')
        .addClass('e2xtable')
        .attr('id', 'exercisetable');
    let head = $('<thead/>');
    let header = $('<tr/>');
    const columns = ['Name'];
    columns.forEach(function (column) {
        header.append($('<th/>').text(column));
    })
    table.append(head.append(header));
    let body = $('<tbody/>');
    exercises.forEach(function (exercise) {
        let row = $('<tr/>');
        row.append($('<td/>').append($('<a/>').attr('href', '/' + exercise.link).text(exercise.name)));
        body.append(row);
    });
    table.append(body);

    let div = $('<div/>').attr('id', 'exercisediv');
    div.append(table);

    $('.body').append(div);
}