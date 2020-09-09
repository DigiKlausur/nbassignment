export class Table {

    constructor(data, target='_self') {
        this.data = data;
        this.target = target;
    }

    make_header(table) {
        let head = $('<thead/>');
        let header = $('<tr/>');
        let columns = this.data.columns;
        if (this.data.hasOwnProperty('labels')) {
            columns = this.data.labels;
        }
        columns.forEach(function (column) {
            header.append($('<th/>').text(column[0]));
        })
        table.append(head.append(header));
    }

    make_body(table) {
        let that = this;
        let body = $('<tbody/>');
        that.data.entries.forEach(function (entry) {
            let row = $('<tr/>');
            that.data.columns.forEach(function (column) {
                if (column[0] === "Name" && entry.hasOwnProperty('link')) {
                    row.append($('<td/>').append($('<a/>')
                        .attr('href', '/' + entry.link)
                        .attr('target', that.target)
                        .text(entry[column[1]])));
                } else {
                    row.append($('<td/>').text(entry[column[1]]));
                }
            });
            body.append(row);
        });
        table.append(body);
    }

    make_table() {
        let table = $('<table/>')
            .addClass('e2xtable')
            .attr('id', this.data.id);
        this.make_header(table);
        this.make_body(table);
        return table;
    }

}

export class EditableTable extends Table {

    make_fa_button(cls, click) {
        let btn = $('<div/>').click(click);
        btn.append($('<i/>').addClass(cls));
        return btn;
    }

    make_body(table) {
        let that = this;
        let body = $('<tbody/>');
        that.data.entries.forEach(function (entry) {
            let row = $('<tr/>');
            
            that.data.columns.forEach(function (column) {
                let cell = $('<td/>');
                if (column[0] === "Name" && entry.hasOwnProperty('link')) {
                    cell.append($('<a/>')
                        .attr('href', '/' + entry.link)
                        .attr('target', that.target)
                        .text(entry[column[1]]));
                } else if (column[0] === 'Edit') {
                    cell.append(
                        that.make_fa_button('fa fa-edit', 
                            () => window.open('/' + entry[column[1]], '_blank'))
                    );
                } else if (column[0] === 'Delete') {
                    cell.append(
                        that.make_fa_button('fa fa-trash-alt',
                            () => that.data.deleteEntry(entry))
                    );
                } else {
                    cell.text(entry[column[1]]);
                }
                row.append(cell);
            });
            body.append(row);
        });
        table.append(body);
    }

}