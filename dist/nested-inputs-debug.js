'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function ($) {
    var NestedInputs = function () {
        function NestedInputs(wrapper, hostControl, settings) {
            _classCallCheck(this, NestedInputs);

            this.wrapper = wrapper;
            this.hostControl = hostControl;
            this.settings = settings;
            this.emptyNode = { value: null };

            if (this.settings.values.length == 0) {
                this.settings.values = [this.emptyNode];
            }
            this._addNode(this.wrapper.find('ul'), this.settings.values);
        }

        _createClass(NestedInputs, [{
            key: '_addNode',
            value: function _addNode(parent) {
                var _this = this;

                var children = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

                var _loop = function _loop(i) {
                    var input = $('<input>', {
                        value: children[i].value,
                        class: 'form-control input-sm'
                    });
                    var wrapper = $('<li>', {
                        html: [input, _this._addSiblingButton(input), _this._addChildButton(input), _this._removeNodeButton(input), $('<ul>') // root for nested nodes
                        ]
                    });
                    input.on('keydown', function (event) {
                        if (event.keyCode === 13) {
                            if (event.metaKey || event.ctrlKey) {
                                _this._addChild(input);
                            } else {
                                _this._addSibling(input);
                            }
                            event.preventDefault();
                        }
                    }).on('change', function () {
                        return _this.onChange();
                    });
                    wrapper.appendTo(parent);
                    input.focus();

                    _this._addNode(wrapper.find('ul'), children[i].children);
                };

                for (var i = 0; i < children.length; i++) {
                    _loop(i);
                }
            }
        }, {
            key: '_addSibling',
            value: function _addSibling(element) {
                this._addNode($(element).closest('ul'), [this.emptyNode]);
            }
        }, {
            key: '_addChild',
            value: function _addChild(element) {
                this._addNode($(element).next().next().next().next(), [this.emptyNode]);
            }
        }, {
            key: '_removeNode',
            value: function _removeNode(element) {
                $(element).closest('li').remove();
                this.onChange();
            }
        }, {
            key: '_addSiblingButton',
            value: function _addSiblingButton(input) {
                var _this2 = this;

                return NestedInputs._addButton('<i class="fa fa-plus-circle"></i>', function () {
                    return _this2._addSibling(input);
                });
            }
        }, {
            key: '_addChildButton',
            value: function _addChildButton(input) {
                var _this3 = this;

                return NestedInputs._addButton('<i class="fa fa-level-down"></i>', function () {
                    return _this3._addChild(input);
                });
            }
        }, {
            key: '_removeNodeButton',
            value: function _removeNodeButton(input) {
                var _this4 = this;

                return NestedInputs._addButton('<i class="fa fa-minus-circle"></i>', function () {
                    return _this4._removeNode(input);
                });
            }
        }, {
            key: 'onChange',
            value: function onChange() {
                var json = this.toJson(this.wrapper);
                var jsonString = JSON.stringify(json);
                this.hostControl.val(jsonString);
            }
        }, {
            key: 'toJson',
            value: function toJson(element) {
                var json = this.traverseNode(element).children;
                // TODO: compact
                return json;
            }
        }, {
            key: 'traverseNode',
            value: function traverseNode(element) {
                var _this5 = this;

                var value = $(element).find('> input').val();
                var children = [].map.call($(element).children('ul').children('li'), function (el) {
                    return _this5.traverseNode(el);
                });
                return {
                    value: value,
                    children: children
                };
            }
        }], [{
            key: '_addButton',
            value: function _addButton(content, callback) {
                return $('<button>', {
                    class: 'btn btn-default btn-xs',
                    type: 'button',
                    html: content,
                    tabIndex: -1
                }).on('click', callback);
            }
        }]);

        return NestedInputs;
    }();

    $.fn.nestedInputs = function (options) {

        var defaults = {};
        var settings = $.extend({}, defaults, options);

        this.each(function (i, hostControl) {
            hostControl = $(hostControl);

            if (hostControl.data('nested-inputs') === '1') return;

            var wrapper = $('\n                <div class="nested-inputs">\n                    <ul class="nested-inputs-root"></ul>\n                </div>');

            hostControl.after(wrapper).hide().data('nested-inputs', '1');

            settings.values = JSON.parse(hostControl.val() || '[]');
            return new NestedInputs(wrapper, hostControl, settings);
        });
    };
})(jQuery);