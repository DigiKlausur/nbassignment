import {Table} from "./table.js";

export default function addAssignmentTable(assignments, base_url) {
    let table_data = {
        "id": "tasktable",
        "columns": [
            ["Name", "name"],
            ["# of Exercises", "exercises"],
        ],
        "entries": assignments
    }

    let div = $('<div/>').attr('id', 'assignmentdiv');
    div.append(new Table(table_data, '_self', base_url).make_table());

    $('.body').append(div);
}