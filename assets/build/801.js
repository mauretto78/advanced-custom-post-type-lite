(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[801],{

/***/ 1316:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Alert = function Alert(_ref) {
    var _ref$style = _ref.style,
        style = _ref$style === undefined ? 'default' : _ref$style,
        children = _ref.children;

    return wp.element.createElement(
        'div',
        { className: 'acpt-alert acpt-alert-' + style },
        children
    );
};

Alert.propTypes = {
    style: _propTypes2.default.oneOf(Object.values(_styles.styleVariants)).isRequired
};

exports.default = Alert;

/***/ }),

/***/ 7124:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ButtonGroup = function ButtonGroup(_ref) {
    var buttons = _ref.buttons,
        _ref$activeBtn = _ref.activeBtn,
        activeBtn = _ref$activeBtn === undefined ? 0 : _ref$activeBtn;

    var _useState = (0, _react.useState)(activeBtn),
        _useState2 = _slicedToArray(_useState, 2),
        activeButton = _useState2[0],
        setActiveButton = _useState2[1];

    return wp.element.createElement(
        'div',
        { className: 'acpt-button-group' },
        buttons && buttons.map(function (button, index) {
            return wp.element.createElement(
                'span',
                {
                    onClick: function onClick() {
                        return setActiveButton(index);
                    },
                    className: 'btn ' + (index === activeButton ? 'active' : '')
                },
                button
            );
        })
    );
};

ButtonGroup.propTypes = {
    buttons: _propTypes2.default.arrayOf(wp.element.createElement('button', null)),
    activeBtn: _propTypes2.default.number
};

exports.default = ButtonGroup;

/***/ }),

/***/ 9804:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHookForm = __webpack_require__(930);

var _react3 = __webpack_require__(4226);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ButtonSwitch = function ButtonSwitch(_ref) {
    var id = _ref.id,
        icon = _ref.icon,
        control = _ref.control,
        _ref$defaultValue = _ref.defaultValue,
        defaultValue = _ref$defaultValue === undefined ? false : _ref$defaultValue,
        errors = _ref.errors,
        _ref$disabled = _ref.disabled,
        disabled = _ref$disabled === undefined ? false : _ref$disabled,
        externalOnChange = _ref.externalOnChange;


    var error = (0, _reactHookForm.get)(errors, id);

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(_reactHookForm.Controller, {
            control: control,
            name: id,
            defaultValue: defaultValue,
            render: function render(_ref2) {
                var _ref2$field = _ref2.field,
                    _onChange = _ref2$field.onChange,
                    onBlur = _ref2$field.onBlur,
                    value = _ref2$field.value,
                    ref = _ref2$field.ref;
                return wp.element.createElement(
                    _react2.default.Fragment,
                    null,
                    wp.element.createElement('input', {
                        className: 'hidden',
                        type: 'checkbox',
                        id: id,
                        disabled: disabled,
                        checked: defaultValue ? defaultValue : false,
                        onBlur: onBlur,
                        onChange: function onChange(e) {
                            _onChange(e.currentTarget.checked);
                            externalOnChange && externalOnChange({
                                id: id,
                                checked: e.currentTarget.checked
                            });
                        }
                    }),
                    wp.element.createElement(
                        'label',
                        { htmlFor: id, className: 'acpt-btn-switch ' + (defaultValue === true ? 'active' : '') + ' ' + (disabled === true ? 'disabled' : '') },
                        wp.element.createElement(_react3.Icon, { icon: icon, width: 18 })
                    ),
                    error && wp.element.createElement(
                        'div',
                        { className: 'invalid-feedback' },
                        error.message
                    )
                );
            }
        })
    );
};

ButtonSwitch.propTypes = {
    id: _propTypes2.default.string.isRequired,
    control: _propTypes2.default.func.isRequired,
    icon: _propTypes2.default.string.isRequired,
    defaultValue: _propTypes2.default.bool,
    errors: _propTypes2.default.array.isRequired,
    disabled: _propTypes2.default.bool,
    externalOnChange: _propTypes2.default.func
};

exports.default = ButtonSwitch;

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

/***/ 7115:
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

var Label = function Label(_ref) {
    var label = _ref.label,
        id = _ref.id,
        _ref$isRequired = _ref.isRequired,
        isRequired = _ref$isRequired === undefined ? false : _ref$isRequired;

    return wp.element.createElement(
        'label',
        { htmlFor: id, className: 'form-label i-flex-center s-4' },
        wp.element.createElement(
            'span',
            null,
            label
        ),
        isRequired && wp.element.createElement(
            'span',
            { className: 'color-danger' },
            '*'
        )
    );
};

Label.propTypes = {
    isRequired: _propTypes2.default.bool,
    id: _propTypes2.default.string.isRequired,
    label: _propTypes2.default.string.isRequired
};

exports.default = Label;

/***/ }),

/***/ 4003:
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

var Select = function Select(_ref) {
    var _ref$size = _ref.size,
        size = _ref$size === undefined ? 'default' : _ref$size,
        placeholder = _ref.placeholder,
        id = _ref.id,
        defaultValue = _ref.defaultValue,
        description = _ref.description,
        values = _ref.values,
        onChangeCapture = _ref.onChangeCapture,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors,
        disabled = _ref.disabled,
        muted = _ref.muted;


    var error = (0, _reactHookForm.get)(errors, id);

    /**
     *
     * @param value
     * @return {*}
     */
    var renderSelectElement = function renderSelectElement() {
        var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        return wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(
                'div',
                { className: '' + (!muted ? 'acpt-select' : '') },
                wp.element.createElement(
                    'select',
                    _extends({
                        id: id,
                        name: id,
                        'data-cy': 'select-' + id,
                        defaultValue: value,
                        placeholder: placeholder,
                        onChangeCapture: onChangeCapture,
                        disabled: disabled,
                        'aria-invalid': error ? "true" : "false",
                        className: muted ? 'muted' : 'form-control ' + size + ' ' + (error ? 'has-errors' : '')
                    }, register(id, validate)),
                    values.map(function (value) {

                        var renderOption = function renderOption(option) {

                            if (option.value === null) {
                                return wp.element.createElement(
                                    'option',
                                    { value: '' },
                                    option.label
                                );
                            }

                            return wp.element.createElement(
                                'option',
                                { value: option.value },
                                option.label
                            );
                        };

                        if (value.options) {
                            return wp.element.createElement(
                                'optgroup',
                                { label: value.label, 'data-original': value.originalLabel ? value.originalLabel : value.label },
                                value.options.map(function (option) {
                                    return renderOption(option);
                                })
                            );
                        } else {
                            return renderOption(value);
                        }
                    })
                )
            ),
            error && wp.element.createElement(
                'div',
                { 'data-cy': 'select-error-' + id, className: 'invalid-feedback' },
                error.message
            ),
            description && wp.element.createElement(
                'div',
                { className: 'form-description' },
                description
            )
        );
    };

    // Force re-rendering when injecting the defaultValue
    if (defaultValue && values.length > 0) {
        return wp.element.createElement(
            'div',
            { className: 'acpt-select-wrapper-with-values', 'data-current-value': defaultValue },
            renderSelectElement(defaultValue)
        );
    }

    return renderSelectElement();
};

Select.propTypes = {
    id: _propTypes2.default.string.isRequired,
    size: _propTypes2.default.oneOf(['default', 'sm']),
    placeholder: _propTypes2.default.string,
    defaultValue: _propTypes2.default.string,
    description: _propTypes2.default.string,
    isMulti: _propTypes2.default.bool,
    disabled: _propTypes2.default.bool,
    muted: _propTypes2.default.bool,
    values: _propTypes2.default.array.isRequired,
    validate: _propTypes2.default.func,
    register: _propTypes2.default.func.isRequired,
    errors: _propTypes2.default.array.isRequired
};

exports.default = Select;

/***/ }),

/***/ 5221:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _useOnScreen = __webpack_require__(7545);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LazyElement = function LazyElement(_ref) {
    var id = _ref.id,
        element = _ref.element;


    var ref = (0, _react.useRef)();
    var isVisible = (0, _useOnScreen.useOnScreen)(ref);

    return wp.element.createElement(
        "div",
        { id: "lazy-" + id, ref: ref },
        isVisible ? element : wp.element.createElement(
            "div",
            null,
            "Loading..."
        )
    );
};

LazyElement.propTypes = {
    element: _propTypes2.default.element.isRequired,
    id: _propTypes2.default.string.isRequired
};

exports.default = LazyElement;

/***/ }),

/***/ 1436:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _react3 = __webpack_require__(4226);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _resolvers = __webpack_require__(3729);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaFieldType = function MetaFieldType(_ref) {
    var fieldType = _ref.fieldType,
        css = _ref.css;

    var _resolveField = (0, _resolvers.resolveField)(fieldType),
        icon = _resolveField.icon,
        label = _resolveField.label;

    return wp.element.createElement(
        'span',
        { className: 'i-flex-center s-4 ' + (css ? css : '') },
        wp.element.createElement(_react3.Icon, { icon: icon, width: 18 }),
        wp.element.createElement(
            'span',
            { className: 'flex-shrink' },
            (0, _useTranslation2.default)(label)
        )
    );
};

MetaFieldType.propTypes = {
    css: _propTypes2.default.string,
    fieldType: _propTypes2.default.object.isRequired
};

exports.default = MetaFieldType;

/***/ }),

/***/ 6103:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(3935);

var _react3 = __webpack_require__(4226);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _useOutsideClick = __webpack_require__(5490);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Modal = function Modal(_ref) {
    var title = _ref.title,
        _ref$size = _ref.size,
        size = _ref$size === undefined ? 'medium' : _ref$size,
        _ref$visible = _ref.visible,
        visible = _ref$visible === undefined ? false : _ref$visible,
        _ref$textAlign = _ref.textAlign,
        textAlign = _ref$textAlign === undefined ? "left" : _ref$textAlign,
        _ref$padding = _ref.padding,
        padding = _ref$padding === undefined ? 24 : _ref$padding,
        _ref$buttons = _ref.buttons,
        buttons = _ref$buttons === undefined ? [] : _ref$buttons,
        testId = _ref.testId,
        children = _ref.children;


    // manage local state
    var didMountRef = (0, _react.useRef)(false);

    var _useState = (0, _react.useState)(!visible),
        _useState2 = _slicedToArray(_useState, 2),
        closed = _useState2[0],
        setClosed = _useState2[1];

    var node = (0, _react.useRef)();

    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            setClosed(!closed);
        } else {
            didMountRef.current = true;
        }
    }, [visible]);

    (0, _useOutsideClick.useOutsideClick)(node, function () {
        setClosed(true);
    });

    if (closed) {
        return null;
    }

    return (0, _reactDom.createPortal)(wp.element.createElement(
        'div',
        { className: 'acpt-overlay' },
        wp.element.createElement(
            'div',
            {
                ref: node,
                className: 'acpt-modal ' + size + ' ' + (closed ? 'modal-hidden' : 'modal-open'),
                'data-cy': testId ? "modal-" + testId : null
            },
            wp.element.createElement(
                'div',
                { className: 'acpt-modal-header flex-between' },
                wp.element.createElement(
                    'h3',
                    null,
                    title
                ),
                wp.element.createElement(
                    'a',
                    {
                        className: 'modal-close-icon',
                        href: '#',
                        onClick: function onClick(e) {
                            e.preventDefault();
                            setClosed(!closed);
                        }
                    },
                    wp.element.createElement(_react3.Icon, { icon: 'bx:bx-x', color: '#777', width: 24 })
                )
            ),
            wp.element.createElement(
                'div',
                { className: 'acpt-modal-body p-' + padding + ' text-' + textAlign },
                children
            ),
            buttons.length > 0 && wp.element.createElement(
                'div',
                { className: 'acpt-modal-footer' },
                wp.element.createElement(
                    'div',
                    { className: 'i-flex-center s-8' },
                    buttons.map(function (button) {
                        return button;
                    })
                )
            )
        )
    ), document.getElementById("acpt-admin-app-wrapper"));
};

Modal.propTypes = {
    title: _propTypes2.default.string.isRequired,
    visible: _propTypes2.default.bool,
    padding: _propTypes2.default.number,
    testId: _propTypes2.default.string,
    buttons: _propTypes2.default.arrayOf(_Button2.default),
    textAlign: _propTypes2.default.oneOf(['center', 'left', 'right']),
    size: _propTypes2.default.oneOf(['small', 'medium', 'large'])
};

exports.default = Modal;

/***/ }),

/***/ 5557:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _core = __webpack_require__(9752);

var _sortable = __webpack_require__(9125);

var _modifiers = __webpack_require__(2339);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SortableList = function SortableList(_ref) {
    var items = _ref.items,
        onDragEnd = _ref.onDragEnd,
        _ref$mode = _ref.mode,
        mode = _ref$mode === undefined ? 'vertical' : _ref$mode,
        children = _ref.children;


    var sensors = (0, _core.useSensors)((0, _core.useSensor)(_core.PointerSensor), (0, _core.useSensor)(_core.MouseSensor), (0, _core.useSensor)(_core.KeyboardSensor, {
        coordinateGetter: _sortable.sortableKeyboardCoordinates
    }));

    return wp.element.createElement(
        _core.DndContext,
        {
            sensors: sensors,
            collisionDetection: _core.closestCenter,
            modifiers: mode === 'vertical' ? [_modifiers.restrictToVerticalAxis] : [],
            onDragEnd: onDragEnd
        },
        wp.element.createElement(
            _sortable.SortableContext,
            {
                items: items,
                strategy: mode === 'vertical' ? _sortable.verticalListSortingStrategy : _sortable.horizontalListSortingStrategy
            },
            children
        )
    );
};

SortableList.propTypes = {
    items: _propTypes2.default.array.isRequired,
    mode: _propTypes2.default.oneOf(['vertical', 'horizontal']),
    onDragEnd: _propTypes2.default.func.isRequired
};

exports.default = SortableList;

/***/ }),

/***/ 6973:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _react3 = __webpack_require__(4226);

var _ButtonGroup = __webpack_require__(7124);

var _ButtonGroup2 = _interopRequireDefault(_ButtonGroup);

var _localStorage = __webpack_require__(8942);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SwitchView = function SwitchView(_ref) {
    var view = _ref.view,
        setView = _ref.setView,
        localStorageKey = _ref.localStorageKey;


    var handleSwitchView = function handleSwitchView(view) {
        setView(view);
        var savedSwitchView = localStorage.getItem(_localStorage.localStorageVars.META_VIEW) ? JSON.parse(localStorage.getItem(_localStorage.localStorageVars.META_VIEW)).filter(function (i) {
            return i.id !== localStorageKey;
        }) : [];
        var newSwitchItem = {
            id: localStorageKey,
            view: view
        };

        savedSwitchView.push(newSwitchItem);

        localStorage.setItem(_localStorage.localStorageVars.META_VIEW, JSON.stringify(savedSwitchView));
    };

    return wp.element.createElement(_ButtonGroup2.default, {
        activeBtn: view === 'list' ? 0 : 1,
        buttons: [wp.element.createElement(
            "button",
            { "data-cy": "list-view", type: "button", onClick: function onClick() {
                    return handleSwitchView('list');
                } },
            wp.element.createElement(_react3.Icon, { icon: "bx:list-ul", width: 18 })
        ), wp.element.createElement(
            "button",
            { "data-cy": "tabular-view", type: "button", onClick: function onClick() {
                    return handleSwitchView('tabular');
                } },
            wp.element.createElement(_react3.Icon, { icon: "bx:table", width: 18 })
        )]
    });
};

SwitchView.propTypes = {
    localStorageKey: _propTypes2.default.string.isRequired,
    setView: _propTypes2.default.func.isRequired,
    view: _propTypes2.default.number.isRequired
};

exports.default = SwitchView;

/***/ }),

/***/ 4877:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react3 = __webpack_require__(4226);

var _reactTooltip = __webpack_require__(461);

__webpack_require__(4595);

var _strings = __webpack_require__(8029);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tooltip = function Tooltip(_ref) {
    var label = _ref.label,
        tip = _ref.tip,
        _ref$icon = _ref.icon,
        icon = _ref$icon === undefined ? true : _ref$icon;


    var id = "tooltip_" + (0, _strings.randomAlphabeticString)();

    return wp.element.createElement(
        'span',
        { className: 'acpt-tooltip' },
        wp.element.createElement(
            'span',
            {
                className: 'i-flex-center s-8 cursor-help',
                'data-tooltip-id': id,
                'data-tooltip-content': tip,
                'data-tooltip-place': 'top'
            },
            wp.element.createElement(
                'div',
                { className: 'acpt-tooltip-label' },
                label
            ),
            icon && wp.element.createElement(
                'div',
                { className: 'acpt-tooltip-help top-2' },
                wp.element.createElement(_react3.Icon, { icon: 'bx:help-circle', color: '#007CBA', width: '18px' })
            )
        ),
        wp.element.createElement(_reactTooltip.Tooltip, {
            id: id,
            style: {
                backgroundColor: "#777",
                color: "#fff"
            }
        })
    );
};

Tooltip.propTypes = {
    label: _propTypes2.default.string.isRequired,
    tip: _propTypes2.default.element.isRequired,
    icon: _propTypes2.default.bool
};

exports.default = Tooltip;

/***/ }),

/***/ 7545:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.useOnScreen = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var useOnScreen = exports.useOnScreen = function useOnScreen(ref) {
    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isIntersecting = _useState2[0],
        setIsIntersecting = _useState2[1];

    var observer = (0, _react.useMemo)(function () {
        return new IntersectionObserver(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 1),
                entry = _ref2[0];

            return setIsIntersecting(entry.isIntersecting);
        });
    }, []);

    (0, _react.useEffect)(function () {
        if (ref.current) {
            observer.observe(ref.current);

            return function () {
                observer.disconnect();
            };
        }
    }, [ref, observer]);

    return isIntersecting;
};

/***/ }),

/***/ 9167:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(4022);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageNotFound = function PageNotFound() {

    return wp.element.createElement(
        _Layout2.default,
        {
            crumbs: [{
                label: (0, _useTranslation2.default)("Registered Custom Post Types"),
                link: "/"
            }, {
                label: (0, _useTranslation2.default)("Page not found")
            }],
            title: (0, _useTranslation2.default)('Page not found')
        },
        wp.element.createElement(
            _Alert2.default,
            { style: _styles.styleVariants.WARNING },
            (0, _useTranslation2.default)('The requested page was not found, was deleted or was moved!')
        ),
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                className: "mt-12",
                to: "/"
            },
            (0, _useTranslation2.default)('Return back to list')
        )
    );
};

exports.default = PageNotFound;

/***/ })

}]);
//# sourceMappingURL=801.js.map