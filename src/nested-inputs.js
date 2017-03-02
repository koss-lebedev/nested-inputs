(function ($) {

    class NestedInputs {

        constructor(wrapper, hostControl, settings) {
            this.wrapper = wrapper;
            this.hostControl = hostControl;
            this.settings = settings;
            this.emptyNode = { value: null };

            if (this.settings.values.length == 0) {
                this.settings.values = [this.emptyNode];
            }
            this._addNode(this.wrapper.find('ul'), this.settings.values);
        }

        _addNode(parent, children = []) {
            for (let i = 0; i < children.length; i++) {
                const input = $('<input>', {
                    value: children[i].value,
                    class: 'form-control input-sm',
                });
                const wrapper = $('<li>', {
                    html: [
                        input,
                        this._addSiblingButton(input),
                        this._addChildButton(input),
                        this._removeNodeButton(input),
                        $('<ul>') // root for nested nodes
                    ]
                });
                input.on('keydown', (event) => {
                    if(event.keyCode === 13) {
                        if ((event.metaKey || event.ctrlKey)) {
                            this._addChild(input);
                        } else {
                            this._addSibling(input);
                        }
                        event.preventDefault();
                    }
                }).on('change', () => this.onChange());
                wrapper.appendTo(parent);
                input.focus();

                this._addNode(wrapper.find('ul'), children[i].children);
            }
        }

        _addSibling(element) {
            this._addNode($(element).closest('ul'), [this.emptyNode]);
        }

        _addChild(element) {
            this._addNode($(element).next().next().next().next(), [this.emptyNode]);
        }

        _removeNode(element) {
            $(element).closest('li').remove();
            this.onChange();
        }

        _addSiblingButton(input)  {
            return NestedInputs._addButton(`<i class="fa fa-plus-circle"></i>`, () => this._addSibling(input));
        }

        _addChildButton(input) {
            return NestedInputs._addButton(`<i class="fa fa-level-down"></i>`, () => this._addChild(input));
        }

        _removeNodeButton(input) {
            return NestedInputs._addButton(`<i class="fa fa-minus-circle"></i>`, () => this._removeNode(input));
        }

        static _addButton(content, callback) {
            return $('<button>', {
                class: 'btn btn-default btn-xs',
                type: 'button',
                html: content,
                tabIndex: -1
            }).on('click', callback);
        }

        onChange() {
            const json = this.toJson(this.wrapper);
            const jsonString = JSON.stringify(json);
            this.hostControl.val(jsonString);
        }

        toJson(element) {
            const json = this.traverseNode(element).children;
            // TODO: compact
            return json;
        }

        traverseNode(element) {
            const value = $(element).find('> input').val();
            const children = [].map.call($(element).children('ul').children('li'), (el) => this.traverseNode(el));
            return {
                value: value,
                children: children
            }
        }
    }

    $.fn.nestedInputs = function (options) {

        const defaults = {
        };
        const settings = $.extend( {}, defaults, options );

        this.each((i, hostControl) => {
            hostControl = $(hostControl);

            if (hostControl.data('nested-inputs') === '1')
                return;

            const wrapper = $(`
                <div class="nested-inputs">
                    <ul class="nested-inputs-root"></ul>
                </div>`
            );

            hostControl.after(wrapper).hide().data('nested-inputs', '1');

            settings.values = JSON.parse(hostControl.val() || '[]');
            return  new NestedInputs(wrapper, hostControl, settings);
        });

    }



}(jQuery));
