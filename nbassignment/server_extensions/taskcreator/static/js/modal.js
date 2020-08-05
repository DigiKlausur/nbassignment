"use strict";

export default class Modal {

    constructor(title, body, buttons) {
        this.title = title;
        this.body = body;
        this.buttons = buttons;
    }

    make_footer(content) {
        let that = this;
        let footer = $('<div/>').addClass('modal-footer');
        for (let label in this.buttons) {
            let btn_opts = this.buttons[label];
            let button = $('<button/>')
                .addClass('modal-button')
                .text(label);
            if (btn_opts.click) {
                let click = function () {
                    btn_opts.click();
                    that.close();
                }
                //button.click($.proxy(btn_opts.click, content));
                button.click($.proxy(click, content));
            } else {
                button.click(function () {
                    that.close()
                });
            }
            footer.append(button);
        }
        return footer;
    }

    open() {
        let that = this;
        let modal = $('<div/>').addClass('modal');
        let content = $('<div/>').addClass('modal-content');
        modal.append(content);

        let header = $('<div/>').addClass('modal-header');
        header.append($('<h3/>').addClass('modal-title').append(this.title));

        let close_btn = $('<div/>').addClass('modal-close')
            .append($('<i/>').addClass('fa fa-times'))
            .click( function () {
                that.close();
        });


        header.append(close_btn);
        content.append(header);

        let body = $('<div/>').addClass('modal-body').append(this.body);
        content.append(body);

        content.append(this.make_footer(content));
        
        $('body').append(modal);

    }

    close() {
        $('.modal').remove();
    }

}