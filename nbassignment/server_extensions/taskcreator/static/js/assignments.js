import Modal from "./modal.js";

export default function addAssignmentTable(assignments) {
    let table = $('<table/>')
        .addClass('e2xtable')
        .attr('id', 'assignmenttable');
    let head = $('<thead/>');
    let header = $('<tr/>');
    const columns = ['Name', '# of Exercises'];
    columns.forEach(function (column) {
        header.append($('<th/>').text(column));
    })
    table.append(head.append(header));
    let body = $('<tbody/>');
    assignments.forEach(function (assignment) {
        let row = $('<tr/>');
        row.append($('<td/>').append($('<a/>').attr('href', '/' + assignment.link).text(assignment.name)));
        row.append($('<td/>').text(assignment.exercises));
        body.append(row);
    });
    table.append(body);

    let div = $('<div/>').attr('id', 'assignmentdiv');
    div.append(table);

    $('.body').append(div);
}