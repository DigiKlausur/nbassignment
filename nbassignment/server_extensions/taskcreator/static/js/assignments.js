import {Table} from "./table.js";
import Modal from "./modal.js";

export default function addAssignmentTable(assignments) {
    let table_data = {
        "id": "tasktable",
        "columns": [
            ["Name", "name"],
            ["# of Exercises", "exercises"],
        ],
        "entries": assignments
    }

    let div = $('<div/>').attr('id', 'assignmentdiv');
    div.append(new Table(table_data).make_table());

    $('.body').append(div);
}