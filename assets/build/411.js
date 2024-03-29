(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[411],{

/***/ 1005:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CardRow = function CardRow(_ref) {
    var label = _ref.label,
        value = _ref.value,
        wizard = _ref.wizard;


    return wp.element.createElement(
        'div',
        { className: 'acpt-card-row' },
        wp.element.createElement(
            'span',
            { className: 'label' },
            wp.element.createElement(
                'span',
                null,
                label
            ),
            wizard && wp.element.createElement('div', {
                className: 'wizard',
                dangerouslySetInnerHTML: { __html: wizard }
            })
        ),
        wp.element.createElement(
            'span',
            { className: 'value' },
            value
        )
    );
};

CardRow.propTypes = {
    label: _propTypes2.default.string.isRequired,
    value: _propTypes2.default.element.isRequired,
    wizard: _propTypes2.default.string
};

exports.default = CardRow;

/***/ }),

/***/ 1959:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Card = function Card(_ref) {
    var title = _ref.title,
        _ref$style = _ref.style,
        style = _ref$style === undefined ? 'with-shadow' : _ref$style,
        actions = _ref.actions,
        children = _ref.children;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    return wp.element.createElement(
        'div',
        { className: 'acpt-card ' + (globals.is_rtl === true ? 'rtl' : '') + ' ' + style },
        title && wp.element.createElement(
            'div',
            { className: 'acpt-card-header' },
            wp.element.createElement(
                'h3',
                null,
                title
            ),
            actions && wp.element.createElement(
                'div',
                { className: 'actions' },
                actions
            )
        ),
        wp.element.createElement(
            'div',
            { className: 'acpt-card-body' },
            wp.element.createElement(
                'div',
                { className: 'responsive' },
                children
            )
        )
    );
};

Card.propTypes = {
    title: _propTypes2.default.string,
    style: _propTypes2.default.string,
    actions: _propTypes2.default.element
};

exports.default = Card;

/***/ }),

/***/ 4575:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHookForm = __webpack_require__(930);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Checkbox = function Checkbox(_ref) {
    var id = _ref.id,
        values = _ref.values,
        description = _ref.description,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors;


    var error = (0, _reactHookForm.get)(errors, id);

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            'div',
            { className: 'flex-column s-8' },
            Object.keys(values).map(function (keyName, index) {
                return wp.element.createElement(
                    'label',
                    { className: 'checkbox', htmlFor: id + '_' + index },
                    wp.element.createElement('input', _extends({
                        name: id,
                        value: values[keyName]['value'],
                        defaultChecked: values[keyName]['checked'],
                        'aria-invalid': error ? "true" : "false",
                        type: 'checkbox',
                        id: id + '_' + index
                    }, register(id + '_' + index, _extends({}, validate)))),
                    wp.element.createElement(
                        'span',
                        null,
                        (0, _useTranslation2.default)(keyName)
                    )
                );
            }),
            error && wp.element.createElement(
                'div',
                { className: 'invalid-feedback' },
                error.message
            )
        ),
        description && wp.element.createElement(
            'div',
            { className: 'form-description' },
            description
        ),
        error && wp.element.createElement(
            'div',
            { className: 'invalid-feedback' },
            error.message
        )
    );
};

Checkbox.propTypes = {
    id: _propTypes2.default.string.isRequired,
    description: _propTypes2.default.string,
    values: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
    validate: _propTypes2.default.func,
    register: _propTypes2.default.func.isRequired,
    errors: _propTypes2.default.array.isRequired
};

exports.default = Checkbox;

/***/ }),

/***/ 9053:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHookForm = __webpack_require__(930);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Input = function Input(_ref) {
    var innerRef = _ref.innerRef,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? 'text' : _ref$type,
        _ref$size = _ref.size,
        size = _ref$size === undefined ? 'default' : _ref$size,
        placeholder = _ref.placeholder,
        id = _ref.id,
        defaultValue = _ref.defaultValue,
        description = _ref.description,
        step = _ref.step,
        min = _ref.min,
        max = _ref.max,
        readOnly = _ref.readOnly,
        onClick = _ref.onClick,
        onChangeCapture = _ref.onChangeCapture,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors,
        _ref$disabled = _ref.disabled,
        disabled = _ref$disabled === undefined ? false : _ref$disabled;


    var error = (0, _reactHookForm.get)(errors, id);

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement('input', _extends({
            ref: innerRef,
            id: id,
            'data-cy': 'input-' + id,
            name: id,
            type: type,
            disabled: disabled,
            min: min ? min : 0,
            max: max,
            step: step ? min : 1,
            defaultValue: defaultValue,
            placeholder: placeholder,
            onChangeCapture: onChangeCapture,
            onClick: onClick,
            readOnly: readOnly,
            'aria-invalid': error ? "true" : "false",
            className: 'form-control ' + size + ' ' + (error ? 'has-errors' : '')
        }, register(id, validate))),
        error && wp.element.createElement(
            'div',
            { 'data-cy': 'input-error-' + id, className: 'invalid-feedback' },
            error.message
        ),
        description && wp.element.createElement(
            'div',
            { className: 'form-description' },
            description
        )
    );
};

Input.propTypes = {
    id: _propTypes2.default.string.isRequired,
    size: _propTypes2.default.oneOf(['default', 'sm']),
    innerRef: _propTypes2.default.func,
    placeholder: _propTypes2.default.string,
    defaultValue: _propTypes2.default.string,
    description: _propTypes2.default.string,
    readOnly: _propTypes2.default.bool,
    min: _propTypes2.default.number,
    max: _propTypes2.default.number,
    step: _propTypes2.default.number,
    onChangeCapture: _propTypes2.default.func,
    validate: _propTypes2.default.func,
    register: _propTypes2.default.func.isRequired,
    errors: _propTypes2.default.array.isRequired,
    disabled: _propTypes2.default.bool,
    type: _propTypes2.default.oneOf(['text', 'email', 'number', 'tel', 'url', 'date', 'time'])

};

exports.default = Input;

/***/ }),

/***/ 5978:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputHidden = function InputHidden(_ref) {
    var id = _ref.id,
        value = _ref.value,
        register = _ref.register;


    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement('input', _extends({
            id: id,
            name: id,
            type: 'hidden',
            value: value ? value : ''
        }, register(id)))
    );
};

InputHidden.propTypes = {
    id: _propTypes2.default.string.isRequired,
    value: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]).isRequired,
    register: _propTypes2.default.func.isRequired
};

exports.default = InputHidden;

/***/ }),

/***/ 1301:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHookForm = __webpack_require__(930);

var _objects = __webpack_require__(4040);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _strings = __webpack_require__(8029);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var SelectMulti = function SelectMulti(_ref) {
    var placeholder = _ref.placeholder,
        id = _ref.id,
        _ref$disabled = _ref.disabled,
        disabled = _ref$disabled === undefined ? false : _ref$disabled,
        defaultValue = _ref.defaultValue,
        description = _ref.description,
        values = _ref.values,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors,
        setValue = _ref.setValue,
        clearErrors = _ref.clearErrors,
        maxItems = _ref.maxItems;


    var error = (0, _reactHookForm.get)(errors, id);

    var _useState = (0, _react.useState)(defaultValue && (0, _objects.isIterable)(defaultValue) ? defaultValue : []),
        _useState2 = _slicedToArray(_useState, 2),
        currentValues = _useState2[0],
        setCurrentValues = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = _slicedToArray(_useState3, 2),
        dropdownOpen = _useState4[0],
        setDropdownOpen = _useState4[1];

    var _useState5 = (0, _react.useState)(''),
        _useState6 = _slicedToArray(_useState5, 2),
        searchTerm = _useState6[0],
        setSearchTerm = _useState6[1];

    /**
     *
     * @return {*}
     */


    var renderItems = function renderItems() {
        if (currentValues.length > 0) {
            return wp.element.createElement(
                _react2.default.Fragment,
                null,
                currentValues.map(function (value) {

                    /**
                     *
                     * @return {*}
                     */
                    var renderLabel = function renderLabel() {

                        var filterValue = values.filter(function (v) {

                            if (v.options) {
                                var filterOptValue = v.options.filter(function (o) {
                                    return o.value.toString() === value.toString();
                                });

                                return filterOptValue.length === 1;
                            }

                            return v.value === value;
                        });

                        if (filterValue.length === 1) {
                            if (filterValue[0].options) {
                                var filterOptValue = filterValue[0].options.filter(function (o) {
                                    return o.value.toString() === value.toString();
                                });

                                if (filterOptValue.length === 1) {
                                    return filterOptValue[0].label;
                                }
                            }

                            return filterValue[0].label;
                        }

                        return value;
                    };

                    return wp.element.createElement(
                        'span',
                        { className: 'item' },
                        wp.element.createElement(
                            'span',
                            { className: 'label' },
                            renderLabel()
                        ),
                        wp.element.createElement(
                            'a',
                            {
                                href: '#',
                                className: 'close-item',
                                onClick: function onClick(e) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    if (!disabled) {
                                        setCurrentValues(function (val) {
                                            var newArray = val.filter(function (v) {
                                                return v !== value;
                                            });

                                            setValue(id, newArray);
                                            setDropdownOpen(false);

                                            if (error) {
                                                clearErrors(id);
                                            }

                                            return newArray;
                                        });
                                    }
                                }
                            },
                            '\xD7'
                        )
                    );
                })
            );
        }

        return wp.element.createElement(
            'span',
            null,
            placeholder ? placeholder : (0, _useTranslation2.default)('Select items')
        );
    };

    /**
     *
     * @return {*}
     */
    var renderClearAll = function renderClearAll() {
        return wp.element.createElement(
            'a',
            {
                href: '#',
                className: 'close',
                onClick: function onClick(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!disabled) {
                        setCurrentValues(function (val) {
                            setValue(id, []);
                            clearErrors(id);
                            setDropdownOpen(false);

                            return [];
                        });
                    }
                }
            },
            '\xD7'
        );
    };

    /**
     *
     * @return {*}
     */
    var renderDropdown = function renderDropdown() {

        if (maxItems && currentValues.length >= maxItems) {
            return null;
        }

        return wp.element.createElement(
            'div',
            { className: 'select-items' },
            wp.element.createElement(
                'div',
                { className: 'search-box' },
                wp.element.createElement('input', {
                    type: 'text',
                    className: 'form-control',
                    placeholder: (0, _useTranslation2.default)("Filter items"),
                    defaultValue: searchTerm,
                    onChange: function onChange(e) {
                        setSearchTerm(e.target.value);
                    }
                })
            ),
            wp.element.createElement(
                'ul',
                {
                    tabIndex: 0,
                    className: 'select-items-list'
                },
                renderListElements(values)
            )
        );
    };

    /**
     *
     * @param elements
     */
    var renderListElements = function renderListElements(elements) {
        return elements.filter(function (element) {
            if (searchTerm !== '' && element.value && element.label) {
                return (0, _strings.likeThat)(element.value, searchTerm) || (0, _strings.likeThat)(element.label, searchTerm);
            }

            return true;
        }).filter(function (element) {
            if (element.value) {
                return currentValues.findIndex(function (v) {
                    return v === element.value;
                }) === -1;
            }

            return true;
        }).map(function (element, index) {

            if (element.options) {
                return wp.element.createElement(
                    _react2.default.Fragment,
                    null,
                    wp.element.createElement(
                        'li',
                        { className: 'optgroup' },
                        element.label
                    ),
                    renderListElements(element.options)
                );
            }

            return wp.element.createElement(
                'li',
                {
                    key: index,
                    tabIndex: index + 1,
                    className: 'select-item',
                    onClick: function onClick() {
                        setCurrentValues(function (val) {
                            var newArray = [].concat(_toConsumableArray(val), [element.value]);
                            setValue(id, newArray);
                            setDropdownOpen(!dropdownOpen);

                            if (error) {
                                clearErrors(id);
                            }

                            return newArray;
                        });
                    }
                },
                element.label
            );
        });
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            'div',
            { className: 'acpt-select-multi' },
            wp.element.createElement('input', _extends({
                id: id,
                name: id,
                type: 'hidden',
                defaultValue: currentValues
            }, register(id, validate))),
            wp.element.createElement(
                'div',
                {
                    className: 'placeholder ' + (error ? 'has-errors' : '') + ' ' + (disabled ? 'disabled' : ''),
                    onClick: function onClick() {
                        if (!disabled) {
                            setDropdownOpen(!dropdownOpen);
                        }
                    }
                },
                wp.element.createElement(
                    'div',
                    { className: 'items' },
                    renderItems()
                ),
                !dropdownOpen && currentValues.length > 0 && renderClearAll(),
                wp.element.createElement('div', { className: 'divider' }),
                wp.element.createElement('div', { className: 'caret' })
            ),
            dropdownOpen && renderDropdown()
        ),
        error && wp.element.createElement(
            'div',
            { className: 'invalid-feedback' },
            error.message
        ),
        description && wp.element.createElement(
            'div',
            { className: 'form-description' },
            description
        )
    );
};

SelectMulti.propTypes = {
    id: _propTypes2.default.string.isRequired,
    placeholder: _propTypes2.default.string,
    defaultValue: _propTypes2.default.array,
    description: _propTypes2.default.string,
    disabled: _propTypes2.default.bool,
    values: _propTypes2.default.array.isRequired,
    validate: _propTypes2.default.func,
    register: _propTypes2.default.func.isRequired,
    setValue: _propTypes2.default.func.isRequired,
    clearErrors: _propTypes2.default.func.isRequired,
    errors: _propTypes2.default.array.isRequired,
    maxItems: _propTypes2.default.number
};

exports.default = SelectMulti;

/***/ }),

/***/ 8040:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHookForm = __webpack_require__(930);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Toggle = function Toggle(_ref) {
    var id = _ref.id,
        _ref$defaultValue = _ref.defaultValue,
        defaultValue = _ref$defaultValue === undefined ? 0 : _ref$defaultValue,
        description = _ref.description,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors;


    var error = (0, _reactHookForm.get)(errors, id);

    return wp.element.createElement(
        'div',
        { className: 'toggle-group' },
        wp.element.createElement(
            'label',
            {
                'data-cy': 'toggle-' + id,
                className: 'toggle'
            },
            wp.element.createElement('input', _extends({
                id: id,
                name: id,
                type: 'checkbox',
                'data-cy': 'toggle-checkbox-' + id,
                defaultChecked: defaultValue
            }, register(id, validate))),
            wp.element.createElement('span', { className: 'slider round' })
        ),
        description && wp.element.createElement(
            'span',
            { className: 'form-description' },
            description
        ),
        error && wp.element.createElement(
            'div',
            { className: 'invalid-feedback' },
            error.message
        )
    );
};

Toggle.propTypes = {
    id: _propTypes2.default.string.isRequired,
    defaultValue: _propTypes2.default.bool,
    description: _propTypes2.default.string,
    validate: _propTypes2.default.func,
    register: _propTypes2.default.func.isRequired,
    errors: _propTypes2.default.array.isRequired
};

exports.default = Toggle;

/***/ }),

/***/ 2517:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(2107);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WooCommerceListElement = function WooCommerceListElement(_ref) {
    var icon = _ref.icon,
        label = _ref.label;

    return wp.element.createElement(
        'div',
        { className: 'i-flex-center s-4' },
        wp.element.createElement('span', { className: 'wcicon-' + icon }),
        wp.element.createElement(
            'span',
            null,
            label
        )
    );
};

exports.default = WooCommerceListElement;

/***/ }),

/***/ 9132:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.woocommerceIconsList = exports.woocommerceIconsMap = undefined;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _WooCommerceListElement = __webpack_require__(2517);

var _WooCommerceListElement2 = _interopRequireDefault(_WooCommerceListElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var woocommerceIconsMap = exports.woocommerceIconsMap = {
    "\\e900": "storefront",
    "\\e604": "ccv",
    "\\e000": "virtual",
    "\\e022": "down",
    "\\e023": "reports",
    "\\e031": "refresh",
    "\\e032": "navigation",
    "\\e03c": "status-fill",
    "\\e004": "contract",
    "\\e001": "downloadable",
    "\\e007": "plus",
    "\\e006": "simple",
    "\\e033": "on-hold",
    "\\e034": "external",
    "\\e036": "contract-2",
    "\\e035": "expand-2",
    "\\e037": "phone",
    "\\e038": "user",
    "\\e039": "status",
    "\\e012": "status-pending",
    "\\e013": "status-cancelled",
    "\\e02f": "west",
    "\\e02e": "south",
    "\\e02d": "mail",
    "\\e02c": "inventory",
    "\\e02b": "attributes",
    "\\e02a": "north",
    "\\e029": "east",
    "\\e028": "note",
    "\\e027": "windows",
    "\\e026": "user2",
    "\\e025": "search-2",
    "\\e024": "search",
    "\\e021": "star-empty",
    "\\e030": "share",
    "\\e03b": "phone-fill",
    "\\e03d": "woo",
    "\\e03a": "user-fill",
    "\\e002": "grouped",
    "\\e014": "status-refunded",
    "\\e015": "status-completed",
    "\\e003": "variable",
    "\\e005": "expand",
    "\\e016": "status-failed",
    "\\e017": "check",
    "\\e008": "right",
    "\\e009": "up",
    "\\e018": "query",
    "\\e00a": "down",
    "\\e019": "truck-1",
    "\\e00b": "left",
    "\\e01a": "truck-2",
    "\\e00c": "image",
    "\\e01b": "globe",
    "\\e00d": "link",
    "\\e01c": "gear",
    "\\e00e": "calendar",
    "\\e01d": "cart",
    "\\e00f": "processing",
    "\\e01e": "card",
    "\\e010": "view",
    "\\e01f": "stats",
    "\\e011": "status-processing",
    "\\e020": "star-full",
    "\\e600": "coupon",
    "\\e601": "limit",
    "\\e602": "restricted",
    "\\e603": "edit"
};

var woocommerceIconsList = exports.woocommerceIconsList = [{ value: "\\e900", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "storefront", label: "Store front" }) }, { value: "\\e604", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "ccv", label: "CCV" }) }, { value: "\\e000", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "virtual", label: "Virtual" }) }, { value: "\\e022", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "down", label: "Down" }) }, { value: "\\e023", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "reports", label: "Reports" }) }, { value: "\\e031", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "refresh", label: "Refersh" }) }, { value: "\\e032", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "navigation", label: "Navigation" }) }, { value: "\\e03c", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-fill", label: "Status-fill" }) }, { value: "\\e004", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "contract", label: "Contract" }) }, { value: "\\e001", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "downloadable", label: "Downloadable" }) }, { value: "\\e007", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "plus", label: "Plus" }) }, { value: "\\e006", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "simple", label: "Simple" }) }, { value: "\\e033", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "on-hold", label: "On hold" }) }, { value: "\\e034", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "external", label: "External" }) }, { value: "\\e036", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "contract-2", label: "Contract" }) }, { value: "\\e035", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "expand-2", label: "Expand" }) }, { value: "\\e037", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "phone", label: "Phone" }) }, { value: "\\e038", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "user", label: "User" }) }, { value: "\\e039", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status", label: "Status" }) }, { value: "\\e012", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-pending", label: "Status pending" }) }, { value: "\\e013", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-cancelled", label: "Status cancelled" }) }, { value: "\\e02f", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "west", label: "West" }) }, { value: "\\e02e", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "south", label: "South" }) }, { value: "\\e02d", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "mail", label: "Mail" }) }, { value: "\\e02c", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "inventory", label: "Inventory" }) }, { value: "\\e02b", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "attributes", label: "Attributes" }) }, { value: "\\e02a", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "north", label: "North" }) }, { value: "\\e029", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "east", label: "East" }) }, { value: "\\e028", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "note", label: "Note" }) }, { value: "\\e027", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "windows", label: "Windows" }) }, { value: "\\e026", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "user2", label: "User 2" }) }, { value: "\\e025", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "search-2", label: "Search 2" }) }, { value: "\\e024", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "search", label: "Search" }) }, { value: "\\e021", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "star-empty", label: "Star empty" }) }, { value: "\\e030", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "share", label: "Share" }) }, { value: "\\e03b", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "phone-fill", label: "Store front" }) }, { value: "\\e03d", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "woo", label: "Woo" }) }, { value: "\\e03a", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "user-fill", label: "User fill" }) }, { value: "\\e002", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "grouped", label: "Grouped" }) }, { value: "\\e014", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-refunded", label: "Status refunded" }) }, { value: "\\e015", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-completed", label: "Status completed" }) }, { value: "\\e003", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "variable", label: "Variable" }) }, { value: "\\e005", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "expand", label: "Expand" }) }, { value: "\\e016", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-failed", label: "Status failed" }) }, { value: "\\e017", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "check", label: "Check" }) }, { value: "\\e008", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "right", label: "Right" }) }, { value: "\\e009", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "up", label: "Up" }) }, { value: "\\e018", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "query", label: "Query" }) }, { value: "\\e00a", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "down", label: "Down" }) }, { value: "\\e019", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "truck-1", label: "Truck 1" }) }, { value: "\\e00b", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "left", label: "Left" }) }, { value: "\\e01a", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "truck-2", label: "Truck 2" }) }, { value: "\\e00c", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "image", label: "Image" }) }, { value: "\\e01b", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "globe", label: "Globe" }) }, { value: "\\e00d", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "link", label: "Link" }) }, { value: "\\e01c", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "gear", label: "Gear" }) }, { value: "\\e00e", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "calendar", label: "Calendar" }) }, { value: "\\e01d", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "cart", label: "Cart" }) }, { value: "\\e00f", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "processing", label: "Processing" }) }, { value: "\\e01e", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "card", label: "Card" }) }, { value: "\\e010", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "view", label: "View" }) }, { value: "\\e01f", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "stats", label: "Stats" }) }, { value: "\\e011", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-processing", label: "Status processing" }) }, { value: "\\e020", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "star-full", label: "Star full" }) }, { value: "\\e600", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "coupon", label: "Coupon" }) }, { value: "\\e601", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "limit", label: "Limit" }) }, { value: "\\e602", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "restricted", label: "Restricted" }) }, { value: "\\e603", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "edit", label: "Edit" }) }];

/***/ }),

/***/ 2411:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _woocommerce_icons = __webpack_require__(9132);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _reactRouterDom = __webpack_require__(4022);

var _reactRedux = __webpack_require__(6706);

var _misc = __webpack_require__(3154);

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _Toggle = __webpack_require__(8040);

var _Toggle2 = _interopRequireDefault(_Toggle);

var _Checkbox = __webpack_require__(4575);

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _SelectMulti = __webpack_require__(1301);

var _SelectMulti2 = _interopRequireDefault(_SelectMulti);

var _InputHidden = __webpack_require__(5978);

var _InputHidden2 = _interopRequireDefault(_InputHidden);

var _uuid = __webpack_require__(1614);

var _reactHotToast = __webpack_require__(4500);

var _saveWooCommerceProductDataSlice = __webpack_require__(4525);

var _fetchWooCommerceProductDataSlice = __webpack_require__(574);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var SaveProductData = function SaveProductData(_ref) {
    _objectDestructuringEmpty(_ref);

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchWooCommerceProductData;
    }),
        data = _useSelector.data;

    // manage redirect


    var navigate = (0, _reactRouterDom.useNavigate)();

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var title = id ? "Edit WooCommerce product data" : "Create new WooCommerce product data";

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isReady = _useState2[0],
        setIsReady = _useState2[1];

    // manage form state


    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all'
    }),
        register = _useForm.register,
        submit = _useForm.handleSubmit,
        setValue = _useForm.setValue,
        errors = _useForm.formState.errors,
        clearErrors = _useForm.clearErrors;

    /**
     *
     * @return {[*]|null|[*]}
     */


    var defaultIcon = function defaultIcon() {

        if (data) {
            if (typeof data.icon === 'undefined') {
                return null;
            }

            if (_typeof(data.icon) === 'object') {
                return [data.icon.icon];
            }

            return [data.icon];
        }

        return null;
    };

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _useTranslation2.default)(title));

        if (id) {
            dispatch((0, _fetchWooCommerceProductDataSlice.fetchWooCommerceProductData)({ id: id })).then(function (res) {
                var record = res.payload;

                setValue("product_data_name", record.name);
                setValue("icon", record.icon);
                setValue("show_ui", record.showInUI);
                setIsReady(true);
            });
        } else {
            setIsReady(true);
        }
    }, []);

    var onSubmit = function onSubmit(data) {
        dispatch((0, _saveWooCommerceProductDataSlice.saveWooCommerceProductData)(data)).then(function (res) {
            var payload = res.payload;

            if (payload.success) {
                navigate('/product-data/product');
                _reactHotToast.toast.success((0, _useTranslation2.default)("Product data successfully saved"));
            } else {
                _reactHotToast.toast.error(payload.error);
            }
        }).catch(function (err) {
            _reactHotToast.toast.error(err);
        });
    };

    var actions = [wp.element.createElement(
        _Button2.default,
        {
            type: "submit",
            style: _styles.styleVariants.PRIMARY
        },
        (0, _useTranslation2.default)("Save")
    )];

    if (!isReady) {
        return wp.element.createElement(_Loader2.default, null);
    }

    return wp.element.createElement(
        "form",
        { onSubmit: submit(onSubmit) },
        wp.element.createElement(
            _Layout2.default,
            {
                crumbs: [{
                    label: (0, _useTranslation2.default)("Registered Custom Post Types"),
                    link: "/"
                }, {
                    label: (0, _useTranslation2.default)("WooCommerce product data"),
                    link: "/product-data/product"
                }, {
                    label: id ? (0, _useTranslation2.default)("Edit WooCommerce product data") : (0, _useTranslation2.default)("Create new WooCommerce product data")
                }],
                title: title,
                actions: actions
            },
            wp.element.createElement(
                _Card2.default,
                { style: "with-shadow" },
                wp.element.createElement(_InputHidden2.default, { register: register, id: "id", value: id ? id : (0, _uuid.v4)() }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Product data name"),
                    value: wp.element.createElement(_Input2.default, {
                        id: "product_data_name",
                        placeholder: (0, _useTranslation2.default)("Product data name"),
                        description: (0, _useTranslation2.default)("The product data name."),
                        register: register,
                        errors: errors,
                        isRequired: true,
                        validate: {
                            maxLength: {
                                value: 20,
                                message: (0, _useTranslation2.default)("max length is 20")
                            },
                            required: (0, _useTranslation2.default)("This field is mandatory")
                        }
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Icon"),
                    value: wp.element.createElement(_SelectMulti2.default, {
                        id: "icon",
                        register: register,
                        setValue: setValue,
                        defaultValue: defaultIcon(),
                        values: _woocommerce_icons.woocommerceIconsList,
                        clearErrors: clearErrors,
                        errors: errors,
                        maxItems: 1
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("visibility"),
                    value: wp.element.createElement(_Checkbox2.default, {
                        register: register,
                        errors: errors,
                        id: "visibility",
                        values: {
                            "Show in simple products": {
                                "value": "show_if_simple",
                                "checked": data && data.visibility ? data.visibility.includes("show_if_simple") : true
                            },
                            "Show in variable products": {
                                "value": "show_if_variable",
                                "checked": data && data.visibility ? data.visibility.includes("show_if_variable") : true
                            },
                            "Show in grouped products": {
                                "value": "show_if_grouped",
                                "checked": data && data.visibility ? data.visibility.includes("show_if_grouped") : true
                            },
                            "Show in external products": {
                                "value": "show_if_external",
                                "checked": data && data.visibility ? data.visibility.includes("show_if_external") : true
                            },
                            "Hide in virtual products": {
                                "value": "hide_if_virtual",
                                "checked": data && data.visibility ? data.visibility.includes("hide_if_virtual") : false
                            },
                            "Hide in external products": {
                                "value": "hide_if_external",
                                "checked": data && data.visibility ? data.visibility.includes("hide_if_external") : false
                            }
                        }
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in UI"),
                    value: wp.element.createElement(_Toggle2.default, {
                        register: register,
                        errors: errors,
                        id: "show_ui",
                        description: (0, _useTranslation2.default)("Show the product data on the front store page."),
                        defaultValue: null
                    })
                })
            )
        )
    );
};

exports.default = SaveProductData;

/***/ }),

/***/ 2107:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=411.js.map