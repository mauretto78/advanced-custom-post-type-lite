(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[376],{

/***/ 6523:
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

var _misc = __webpack_require__(3154);

var _reactHotToast = __webpack_require__(4500);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CopyElement = function CopyElement(_ref) {
    var text = _ref.text,
        testId = _ref.testId;


    return wp.element.createElement(
        'div',
        { className: 'acpt-copy-element' },
        wp.element.createElement('input', {
            'data-cy': testId ? "copy-element-" + testId : null,
            className: 'form-control',
            type: 'text',
            readOnly: true,
            value: text
        }),
        wp.element.createElement(
            'a',
            {
                href: '#',
                className: 'copy-element-link',
                onClick: function onClick(e) {
                    e.preventDefault();
                    (0, _misc.copyToTheClipboard)(text);
                    _reactHotToast.toast.success((0, _useTranslation2.default)("Copied to clipboard"));
                }
            },
            wp.element.createElement(_react3.Icon, { icon: 'bx:copy', width: 18 })
        )
    );
};

CopyElement.propTypes = {
    testId: _propTypes2.default.string,
    text: _propTypes2.default.string.isRequired
};

exports.default = CopyElement;

/***/ }),

/***/ 9879:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Select = __webpack_require__(4003);

var _Select2 = _interopRequireDefault(_Select);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _InputHidden = __webpack_require__(5978);

var _InputHidden2 = _interopRequireDefault(_InputHidden);

var _react3 = __webpack_require__(4226);

var _metaTypes = __webpack_require__(1895);

var _reactHookForm = __webpack_require__(930);

var _reactRedux = __webpack_require__(6706);

var _SelectMulti = __webpack_require__(1301);

var _SelectMulti2 = _interopRequireDefault(_SelectMulti);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BelongCondition = function BelongCondition(_ref) {
    var id = _ref.id,
        control = _ref.control,
        register = _ref.register,
        errors = _ref.errors,
        belong = _ref.belong,
        handleDeleteBelong = _ref.handleDeleteBelong,
        values = _ref.values,
        isLast = _ref.isLast,
        index = _ref.index,
        resetField = _ref.resetField,
        setValue = _ref.setValue,
        clearErrors = _ref.clearErrors,
        _ref$format = _ref.format,
        format = _ref$format === undefined ? 'all' : _ref$format;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchMeta;
    }),
        group = _useSelector.data;

    var formId = function formId(value) {
        return id + "." + index + "." + value;
    };

    var watchedBelongsTo = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("belongsTo")
    });

    var watchedOperator = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("operator")
    });

    var watchedFind = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("find")
    });

    (0, _react.useEffect)(function () {
        if (isLast) {
            resetField(formId("logic"));
        }
    }, [isLast]);

    (0, _react.useEffect)(function () {
        if (watchedBelongsTo !== belong.belongsTo) {
            resetField(formId("find"));
        }
    }, [watchedBelongsTo]);

    (0, _react.useEffect)(function () {
        if (!watchedOperator) {
            setValue(formId("operator"), "=");
        }
    }, [watchedOperator]);

    /**
     *
     * @return {*[]|*}
     */
    var findValues = function findValues() {

        if (watchedBelongsTo) {
            return values[watchedBelongsTo] ? values[watchedBelongsTo] : [];
        }

        if (group.belongs && group.belongs[index]) {
            return values[group.belongs[index].belongsTo] ? values[group.belongs[index].belongsTo] : [];
        }

        return [];
    };

    /**
     *
     * @return {string|array}
     */
    var findDefaultValues = function findDefaultValues() {

        if (watchedFind) {
            if (typeof watchedFind === 'string') {
                return watchedFind.split(",");
            }

            return watchedFind;
        }

        return [];
    };

    /**
     *
     * @return {[{label: *, value: null}, {options: [{label: *, value: string}, {label: *, value: string}, {label: *, value: string}, {label: *, value: string}, {label: *, value: string}], label: *}, {options: [{label: *, value: string}, {label: *, value: string}], label: *}, {options: [{label: *, value: string}], label: *}, {options: [{label: *, value: string}, {label: *, value: string}], label: *}]|[{label: *, value: null}, {options: [{label: *, value: string}, {label: *, value: string}], label: *}, {options: [{label: *, value: string}, {label: *, value: string}], label: *}]}
     */
    var belongsTo = function belongsTo() {

        if (format === 'reduced') {
            return [{ value: null, label: (0, _useTranslation2.default)("Select") }, {
                label: (0, _useTranslation2.default)("Posts"),
                options: [{ value: _metaTypes.metaTypes.CUSTOM_POST_TYPE, label: (0, _useTranslation2.default)("Post type") }, { value: "POST_ID", label: (0, _useTranslation2.default)("Post") }]
            }, {
                label: (0, _useTranslation2.default)("Taxonomies"),
                options: [{ value: _metaTypes.metaTypes.TAXONOMY, label: (0, _useTranslation2.default)("Taxonomy") }, { value: "TERM_ID", label: (0, _useTranslation2.default)("Term") }]
            }];
        }

        return [{ value: null, label: (0, _useTranslation2.default)("Select") }, {
            label: (0, _useTranslation2.default)("Posts"),
            options: [{ value: _metaTypes.metaTypes.CUSTOM_POST_TYPE, label: (0, _useTranslation2.default)("Post type") }, { value: "POST_ID", label: (0, _useTranslation2.default)("Post") }, { value: "POST_CAT", label: (0, _useTranslation2.default)("Post category") }, { value: "POST_TAX", label: (0, _useTranslation2.default)("Post taxonomy") }, { value: "POST_TEMPLATE", label: (0, _useTranslation2.default)("Post template") }]
        }, {
            label: (0, _useTranslation2.default)("Taxonomies"),
            options: [{ value: _metaTypes.metaTypes.TAXONOMY, label: (0, _useTranslation2.default)("Taxonomy") }, { value: "TERM_ID", label: (0, _useTranslation2.default)("Term") }]
        }, {
            label: (0, _useTranslation2.default)("Option pages"),
            options: [{ value: _metaTypes.metaTypes.OPTION_PAGE, label: (0, _useTranslation2.default)("Option page") }]
        }, {
            label: (0, _useTranslation2.default)("Users"),
            options: [{ value: _metaTypes.metaTypes.USER, label: (0, _useTranslation2.default)("All users") }, { value: "USER_ID", label: (0, _useTranslation2.default)("User") }]
        }];
    };

    var operators = [{ value: null, label: (0, _useTranslation2.default)("Select") }, { value: "=", label: (0, _useTranslation2.default)('is equal to') }, { value: "!=", label: (0, _useTranslation2.default)('is not equal to') }, { value: "IN", label: (0, _useTranslation2.default)("is included in") }, { value: "NOT_IN", label: (0, _useTranslation2.default)("is not included in") }];

    var logics = [{ value: null, label: (0, _useTranslation2.default)("Select") }, { label: (0, _useTranslation2.default)("AND"), value: "AND" }, { label: (0, _useTranslation2.default)("OR"), value: "OR" }];

    /**
     *
     * @return {boolean}
     */
    var isDisabled = function isDisabled() {

        if (watchedBelongsTo === _metaTypes.metaTypes.USER) {
            return true;
        }

        return !watchedBelongsTo;
    };

    /**
     *
     * @return {{required: *}}
     */
    var validate = function validate() {
        if (watchedBelongsTo === _metaTypes.metaTypes.USER) {
            return {
                required: false
            };
        }

        return {
            required: (0, _useTranslation2.default)("This field is mandatory")
        };
    };

    return wp.element.createElement(
        "div",
        { id: belong.id, className: "i-flex-center s-8" },
        wp.element.createElement(_InputHidden2.default, {
            register: register,
            id: formId("id"),
            value: belong.id
        }),
        wp.element.createElement(
            "div",
            { className: "w-100" },
            wp.element.createElement(_Select2.default, {
                register: register,
                id: formId("belongsTo"),
                values: belongsTo(),
                errors: errors,
                onChangeCapture: function onChangeCapture() {
                    resetField(formId("find"));
                    setValue(formId("find"), []);
                },
                validate: {
                    required: (0, _useTranslation2.default)("This field is mandatory")
                }
            })
        ),
        wp.element.createElement(
            "div",
            { className: "w-40" },
            wp.element.createElement(_Select2.default, {
                muted: true,
                register: register,
                id: formId("operator"),
                values: operators,
                defaultValue: "=",
                errors: errors,
                disabled: isDisabled(),
                validate: validate()
            })
        ),
        wp.element.createElement(
            "div",
            { className: "w-100" },
            watchedOperator === 'IN' || watchedOperator === 'NOT_IN' ? wp.element.createElement(_SelectMulti2.default, {
                register: register,
                id: formId("find"),
                values: findValues(),
                errors: errors,
                disabled: isDisabled(),
                validate: validate(),
                setValue: setValue,
                clearErrors: clearErrors,
                defaultValue: findDefaultValues()
            }) : wp.element.createElement(_Select2.default, {
                register: register,
                id: formId("find"),
                values: findValues(),
                errors: errors,
                disabled: isDisabled(),
                validate: validate()
            })
        ),
        wp.element.createElement(
            "div",
            { className: "w-40" },
            !isLast && wp.element.createElement(_Select2.default, {
                muted: true,
                register: register,
                id: formId("logic"),
                values: logics,
                errors: errors,
                validate: {
                    required: (0, _useTranslation2.default)("This field is mandatory")
                }
            })
        ),
        wp.element.createElement(
            "div",
            null,
            wp.element.createElement(
                "a",
                {
                    href: "#",
                    onClick: function onClick(e) {
                        e.preventDefault();
                        handleDeleteBelong(index, belong.id);
                    }
                },
                wp.element.createElement(_Tooltip2.default, {
                    icon: false,
                    tip: (0, _useTranslation2.default)("Delete"),
                    label: wp.element.createElement(_react3.Icon, { icon: "bx-minus" })
                })
            )
        )
    );
};

BelongCondition.propTypes = {
    id: _propTypes2.default.string.isRequired,
    index: _propTypes2.default.number.isRequired,
    belong: _propTypes2.default.object.isRequired,
    register: _propTypes2.default.func.isRequired,
    errors: _propTypes2.default.object.isRequired,
    isLast: _propTypes2.default.bool.isRequired,
    handleDeleteBelong: _propTypes2.default.func.isRequired,
    resetField: _propTypes2.default.func.isRequired,
    setValue: _propTypes2.default.func.isRequired,
    clearErrors: _propTypes2.default.func.isRequired,
    format: _propTypes2.default.oneOf(['all', 'reduced'])
};

exports.default = BelongCondition;

/***/ }),

/***/ 3473:
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

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _BelongCondition = __webpack_require__(9879);

var _BelongCondition2 = _interopRequireDefault(_BelongCondition);

var _objects = __webpack_require__(4040);

var _react3 = __webpack_require__(8839);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BelongConditions = function BelongConditions(_ref) {
    var id = _ref.id,
        control = _ref.control,
        register = _ref.register,
        handleAddBelong = _ref.handleAddBelong,
        handleDeleteBelong = _ref.handleDeleteBelong,
        conditions = _ref.conditions,
        values = _ref.values,
        errors = _ref.errors,
        resetField = _ref.resetField,
        setValue = _ref.setValue,
        clearErrors = _ref.clearErrors,
        _ref$format = _ref.format,
        format = _ref$format === undefined ? 'all' : _ref$format;

    // auto-animate
    var _useAutoAnimate = (0, _react3.useAutoAnimate)(),
        _useAutoAnimate2 = _slicedToArray(_useAutoAnimate, 1),
        parent = _useAutoAnimate2[0];

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            {
                className: "mb-12 " + (!(0, _objects.isEmpty)(values) && conditions && conditions.length > 0 ? "flex-column s-12" : ""),
                ref: parent
            },
            !(0, _objects.isEmpty)(values) && conditions && conditions.length > 0 ? wp.element.createElement(
                _react2.default.Fragment,
                null,
                conditions.map(function (belong, belongIndex) {
                    return wp.element.createElement(_BelongCondition2.default, {
                        id: id,
                        format: format,
                        register: register,
                        errors: errors,
                        control: control,
                        belong: belong,
                        index: belongIndex,
                        handleDeleteBelong: handleDeleteBelong,
                        values: values,
                        isLast: belongIndex === conditions.length - 1,
                        resetField: resetField,
                        setValue: setValue,
                        clearErrors: clearErrors
                    });
                })
            ) : wp.element.createElement(
                _Alert2.default,
                { style: _styles.styleVariants.WARNING },
                (0, _useTranslation2.default)("No conditions are present, click on \"Add condition\" button to add the first one.")
            )
        ),
        wp.element.createElement(
            _Button2.default,
            {
                type: "button",
                style: _styles.styleVariants.SECONDARY,
                onClick: function onClick() {
                    handleAddBelong();
                }
            },
            (0, _useTranslation2.default)("Add condition")
        )
    );
};

BelongConditions.propTypes = {
    id: _propTypes2.default.string.isRequired,
    values: _propTypes2.default.array.isRequired,
    append: _propTypes2.default.func.isRequired,
    register: _propTypes2.default.func.isRequired,
    unregister: _propTypes2.default.func.isRequired,
    resetField: _propTypes2.default.func.isRequired,
    conditions: _propTypes2.default.array.isRequired,
    errors: _propTypes2.default.array.isRequired,
    handleDeleteBelong: _propTypes2.default.func.isRequired,
    handleAddBelong: _propTypes2.default.func.isRequired,
    setValue: _propTypes2.default.func.isRequired,
    clearErrors: _propTypes2.default.func.isRequired,
    format: _propTypes2.default.oneOf(['all', 'reduced'])
};

exports.default = BelongConditions;

/***/ }),

/***/ 2838:
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

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _debounce = __webpack_require__(9546);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputDebounced = function InputDebounced(_ref) {
    var _ref$type = _ref.type,
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
        control = _ref.control,
        _ref$disabled = _ref.disabled,
        disabled = _ref$disabled === undefined ? false : _ref$disabled,
        _ref$debounceTime = _ref.debounceTime,
        debounceTime = _ref$debounceTime === undefined ? 1000 : _ref$debounceTime;


    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(_reactHookForm.Controller, {
            render: function render(_ref2) {
                var _ref2$field = _ref2.field,
                    onChange = _ref2$field.onChange,
                    onBlur = _ref2$field.onBlur,
                    value = _ref2$field.value,
                    name = _ref2$field.name,
                    ref = _ref2$field.ref,
                    _ref2$fieldState = _ref2.fieldState,
                    invalid = _ref2$fieldState.invalid,
                    isTouched = _ref2$fieldState.isTouched,
                    isDirty = _ref2$fieldState.isDirty,
                    error = _ref2$fieldState.error;
                return wp.element.createElement(
                    _react2.default.Fragment,
                    null,
                    wp.element.createElement('input', {
                        type: type,
                        disabled: disabled,
                        min: min ? min : 0,
                        max: max,
                        step: step ? min : 1,
                        readOnly: readOnly,
                        'aria-invalid': error ? "true" : "false",
                        id: name,
                        name: name,
                        ref: ref,
                        placeholder: (0, _useTranslation2.default)("The field label, non latin characters are allowed"),
                        className: 'form-control ' + (error ? 'has-errors' : ''),
                        onChange: (0, _debounce.debounce)(function (e) {
                            onChangeCapture(e.target.value);
                            onChange(e.target.value);
                        }, debounceTime),
                        onBlur: onBlur,
                        defaultValue: value,
                        onClick: onClick
                    }),
                    error && wp.element.createElement(
                        'div',
                        { className: 'invalid-feedback' },
                        error.message
                    )
                );
            },
            control: control,
            id: id,
            name: id,
            defaultValue: defaultValue,
            rules: validate
        })
    );
};

InputDebounced.propTypes = {
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
    control: _propTypes2.default.func.isRequired,
    disabled: _propTypes2.default.bool,
    type: _propTypes2.default.oneOf(['text', 'email', 'number', 'tel', 'url', 'date', 'time'])

};

exports.default = InputDebounced;

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

/***/ 8360:
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

var Tab = function Tab(_ref) {
    var title = _ref.title,
        children = _ref.children;

    return wp.element.createElement(
        "div",
        null,
        children
    );
};

Tab.propTypes = {
    title: _propTypes2.default.string.isRequired
};

exports.default = Tab;

/***/ }),

/***/ 7222:
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

var _Tab = __webpack_require__(8360);

var _Tab2 = _interopRequireDefault(_Tab);

var _strings = __webpack_require__(8029);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tabs = function Tabs(_ref) {
    var handleClick = _ref.handleClick,
        _ref$defaultActiveTab = _ref.defaultActiveTab,
        defaultActiveTab = _ref$defaultActiveTab === undefined ? 0 : _ref$defaultActiveTab,
        children = _ref.children;

    // manage local state
    var _useState = (0, _react.useState)(defaultActiveTab),
        _useState2 = _slicedToArray(_useState, 2),
        activeTab = _useState2[0],
        setActiveTab = _useState2[1];

    var id = (0, _strings.randomAlphabeticString)();

    var handleSetActiveTable = function handleSetActiveTable(index) {
        setActiveTab(index);

        if (handleClick) {
            handleClick(index);
        }
    };

    (0, _react.useEffect)(function () {
        setActiveTab(defaultActiveTab);
    }, [defaultActiveTab]);

    return wp.element.createElement(
        "div",
        { className: "acpt-tabs", id: "tabs-" + id },
        children && children.length > 0 && wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(
                "ul",
                {
                    role: "tablist",
                    className: "tablist"
                },
                children.map(function (child, index) {

                    if (!child) {
                        return null;
                    }

                    return wp.element.createElement(
                        "li",
                        {
                            "data-cy": "tab-" + id + "-" + (index + 1),
                            id: "tab-" + id + "-" + (index + 1),
                            "aria-selected": activeTab === index,
                            "aria-controls": "tabpanel-" + id + "-" + (index + 1),
                            tabIndex: index + 1,
                            role: "tab",
                            className: "acpt-accordion-tab " + (activeTab === index ? 'active' : ''),
                            key: index,
                            onClick: function onClick(e) {
                                return handleSetActiveTable(index);
                            }
                        },
                        child.props && child.props.title ? child.props.title : "Tab " + (index + 1)
                    );
                })
            ),
            wp.element.createElement(
                "div",
                {
                    "data-cy": "tabpanel-" + id + "-" + (activeTab + 1),
                    id: "tabpanel-" + id + "-" + (activeTab + 1),
                    className: "tab-panel",
                    role: "tabpanel",
                    tabIndex: activeTab + 1,
                    "aria-labelledby": "tab-" + id + "-" + (activeTab + 1)
                },
                children[activeTab]
            )
        )
    );
};

Tabs.propTypes = {
    handleClick: _propTypes2.default.func,
    defaultActiveTab: _propTypes2.default.number,
    children: _propTypes2.default.arrayOf(_Tab2.default)
};

exports.default = Tabs;

/***/ }),

/***/ 1895:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var metaTypes = exports.metaTypes = {
    CUSTOM_POST_TYPE: "customPostType",
    META: "meta",
    OPTION_PAGE: "optionPage",
    TAXONOMY: "taxonomy",
    USER: "user"
};

/***/ }),

/***/ 1972:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.useConfirmTabClose = undefined;

var _react = __webpack_require__(7294);

var useConfirmTabClose = exports.useConfirmTabClose = function useConfirmTabClose(isUnsafeTabClose) {

    var confirmationMessage = 'You have unsaved changes. Continue?';

    (0, _react.useEffect)(function () {
        var handleBeforeUnload = function handleBeforeUnload(event) {
            if (isUnsafeTabClose) {
                event.returnValue = confirmationMessage;
                return confirmationMessage;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return function () {
            return window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isUnsafeTabClose]);
};

/***/ }),

/***/ 7643:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(6706);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _metaStateSlice = __webpack_require__(6836);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ElementSelector = function ElementSelector(_ref) {
    var element = _ref.element,
        elementType = _ref.elementType;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        selectedElements = _useSelector.selectedElements;
    /**
     *
     * @return {boolean}
     */


    var isSelected = function isSelected() {
        var filter = selectedElements.filter(function (el) {
            return el.id === element.id;
        });

        return filter.length > 0;
    };

    return wp.element.createElement(_Tooltip2.default, {
        label: wp.element.createElement(
            "label",
            { className: "checkbox", htmlFor: "select-" + element.id, style: { top: "3px" } },
            wp.element.createElement("input", {
                id: "select-" + element.id,
                type: "checkbox",
                checked: isSelected(),
                onChange: function onChange(e) {
                    dispatch((0, _metaStateSlice.selectElement)({
                        element: element,
                        selected: e.target.checked,
                        type: elementType
                    }));
                }
            }),
            wp.element.createElement("span", null)
        ),
        icon: false,
        tip: (0, _useTranslation2.default)(isSelected() ? "Deselect this element" : "Select this element")
    });
};

ElementSelector.propTypes = {
    element: _propTypes2.default.object.isRequired,
    elementType: _propTypes2.default.oneOf(["box", "block", "field"]).isRequired
};

exports.default = ElementSelector;

/***/ }),

/***/ 6278:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(6706);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _styles = __webpack_require__(624);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _cloners = __webpack_require__(6118);

var _metaStateSlice = __webpack_require__(6836);

var _reactHookForm = __webpack_require__(930);

var _fields = __webpack_require__(5216);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _CopyMetaBoxesModal = __webpack_require__(8478);

var _CopyMetaBoxesModal2 = _interopRequireDefault(_CopyMetaBoxesModal);

var _CopyMetaFieldsModal = __webpack_require__(2417);

var _CopyMetaFieldsModal2 = _interopRequireDefault(_CopyMetaFieldsModal);

var _CopyMetaBlocksModal = __webpack_require__(6738);

var _CopyMetaBlocksModal2 = _interopRequireDefault(_CopyMetaBlocksModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BulkActions = function BulkActions(_ref) {
    var view = _ref.view,
        setFieldTab = _ref.setFieldTab,
        setBoxTab = _ref.setBoxTab,
        setBlockTab = _ref.setBlockTab;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        selectedElements = _useSelector.selectedElements,
        selectedElementsType = _useSelector.selectedElementsType;

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control,
        setValue = _useFormContext.setValue,
        getValues = _useFormContext.getValues;

    var watchedBoxes = (0, _reactHookForm.useWatch)({
        control: control,
        name: "boxes"
    });

    // manage local state
    var ref = (0, _react.useRef)(null);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        action = _useState2[0],
        setAction = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = _slicedToArray(_useState3, 2),
        copyBoxesModalVisible = _useState4[0],
        setCopyBoxesModalVisible = _useState4[1];

    var _useState5 = (0, _react.useState)(false),
        _useState6 = _slicedToArray(_useState5, 2),
        copyFieldsModalVisible = _useState6[0],
        setCopyFieldsModalVisible = _useState6[1];

    var _useState7 = (0, _react.useState)(false),
        _useState8 = _slicedToArray(_useState7, 2),
        copyBlocksModalVisible = _useState8[0],
        setCopyBlocksModalVisible = _useState8[1];

    var executeAction = function executeAction() {
        selectedElements.map(function (element) {
            switch (action) {

                // copy
                case "copy":
                    if (selectedElementsType === 'box') {
                        setCopyBoxesModalVisible(!copyBoxesModalVisible);
                    } else if (selectedElementsType === 'block') {
                        setCopyBlocksModalVisible(!copyBlocksModalVisible);
                    } else {
                        setCopyFieldsModalVisible(!copyFieldsModalVisible);
                    }
                    break;

                // duplicate
                case "duplicate":
                    if (selectedElementsType === 'box') {
                        var boxIndex = watchedBoxes.findIndex(function (b) {
                            return b.id === element.id;
                        });
                        var watchedBox = watchedBoxes[boxIndex];
                        var duplicatedBox = (0, _cloners.cloneBox)(watchedBox);

                        watchedBoxes.push(duplicatedBox);
                        setValue("boxes", watchedBoxes);
                        dispatch((0, _metaStateSlice.addBox)(duplicatedBox));
                    } else if (selectedElementsType === 'block') {
                        var block = (0, _fields.hydrateElement)(watchedBoxes, element.boxId, element.id);
                        var duplicatedBlock = (0, _cloners.cloneBlock)(element.boxId, element.parentFieldId, block);
                        var formId = (0, _fields.getFormId)(watchedBoxes, element.boxId, element.id, false);
                        var savedValues = getValues(formId);

                        savedValues.push(duplicatedBlock);
                        setValue(formId, savedValues);

                        dispatch((0, _metaStateSlice.addBlock)({
                            boxId: element.boxId,
                            parentFieldId: element.parentFieldId,
                            block: duplicatedBlock
                        }));
                    } else {
                        var field = (0, _fields.hydrateElement)(watchedBoxes, element.boxId, element.id);
                        var duplicatedField = (0, _cloners.cloneField)(element.boxId, field);
                        var _formId = (0, _fields.getFormId)(watchedBoxes, element.boxId, element.id, false);
                        var _savedValues = getValues(_formId);

                        _savedValues.push(duplicatedField);
                        setValue(_formId, _savedValues);

                        dispatch((0, _metaStateSlice.addField)({
                            boxId: element.boxId,
                            field: duplicatedField,
                            parentFieldId: element.parentFieldId,
                            parentBlockId: element.parentBlockId
                        }));
                    }

                    break;

                // delete
                case "delete":
                    if (selectedElementsType === 'box') {
                        setValue("boxes", watchedBoxes.filter(function (b) {
                            return b.id !== element.id;
                        }));

                        if (setBoxTab) {
                            setBoxTab(0);
                        }

                        dispatch((0, _metaStateSlice.deleteBox)(element.id));
                    } else if (selectedElementsType === 'block') {
                        var _formId2 = (0, _fields.getFormId)(watchedBoxes, element.boxId, element.id, false);
                        var blocks = getValues(_formId2).filter(function (f) {
                            return f.id !== element.id;
                        });

                        setValue(_formId2, blocks);

                        if (setBlockTab) {
                            setBlockTab(0);
                        }

                        dispatch((0, _metaStateSlice.deleteBlock)({
                            boxId: element.boxId,
                            parentFieldId: element.parentFieldId,
                            blockId: element.id
                        }));
                    } else {
                        var _formId3 = (0, _fields.getFormId)(watchedBoxes, element.boxId, element.id, false);
                        var fields = getValues(_formId3).filter(function (f) {
                            return f.id !== element.id;
                        });

                        setValue(_formId3, fields);

                        if (setFieldTab) {
                            setFieldTab(0);
                        }

                        dispatch((0, _metaStateSlice.deleteField)({
                            boxId: element.boxId,
                            fieldId: element.id,
                            parentFieldId: element.parentFieldId,
                            parentBlockId: element.parentBlockId
                        }));
                    }

                    break;
            }
        });

        if (action === 'delete' || action === 'duplicate') {
            dispatch((0, _metaStateSlice.deselectAllElements)());
        }

        ref.current.value = "";
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(_CopyMetaBoxesModal2.default, {
            boxIds: selectedElements,
            modalOpen: copyBoxesModalVisible,
            setModalOpen: setCopyBoxesModalVisible
        }),
        wp.element.createElement(_CopyMetaFieldsModal2.default, {
            fieldIds: selectedElements,
            modalOpen: copyFieldsModalVisible,
            setModalOpen: setCopyFieldsModalVisible
        }),
        wp.element.createElement(_CopyMetaBlocksModal2.default, {
            blockIds: selectedElements,
            modalOpen: copyBlocksModalVisible,
            setModalOpen: setCopyBlocksModalVisible
        }),
        selectedElements.length > 0 && wp.element.createElement(
            "div",
            { className: "flex-between " + (view === 'tab' ? 'mb-24' : '') },
            wp.element.createElement(
                "div",
                null,
                selectedElements.length,
                " ",
                (0, _useTranslation2.default)("Selected items")
            ),
            wp.element.createElement(
                "div",
                { className: "i-flex-center s-8" },
                wp.element.createElement(
                    "select",
                    {
                        ref: ref,
                        className: "form-control sm",
                        onChange: function onChange(e) {
                            setAction(e.target.value !== "" ? e.target.value : null);
                        }
                    },
                    wp.element.createElement(
                        "option",
                        { value: "" },
                        (0, _useTranslation2.default)("Select")
                    ),
                    wp.element.createElement(
                        "option",
                        { value: "copy" },
                        (0, _useTranslation2.default)("Copy")
                    ),
                    wp.element.createElement(
                        "option",
                        { value: "duplicate" },
                        (0, _useTranslation2.default)("Duplicate")
                    ),
                    wp.element.createElement(
                        "option",
                        { value: "delete" },
                        (0, _useTranslation2.default)("Delete")
                    )
                ),
                wp.element.createElement(
                    _Button2.default,
                    {
                        style: _styles.styleVariants.WHITE,
                        size: "sm",
                        disabled: action === null,
                        onClick: function onClick(e) {
                            e.preventDefault();
                            executeAction();
                        }
                    },
                    (0, _useTranslation2.default)("Execute")
                )
            )
        )
    );
};

BulkActions.propTypes = {
    view: _propTypes2.default.oneOf(["tab", "list"]).isRequired,
    setBoxTab: _propTypes2.default.func,
    setFieldTab: _propTypes2.default.func,
    setBlockTab: _propTypes2.default.func
};

exports.default = BulkActions;

/***/ }),

/***/ 6362:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Badge = __webpack_require__(3136);

var _Badge2 = _interopRequireDefault(_Badge);

var _styles = __webpack_require__(624);

var _reactHookForm = __webpack_require__(930);

var _scroll = __webpack_require__(2727);

var _fields = __webpack_require__(5216);

var _reactRedux = __webpack_require__(6706);

var _QuickNavigationField = __webpack_require__(9415);

var _QuickNavigationField2 = _interopRequireDefault(_QuickNavigationField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuickNavigationBlock = function QuickNavigationBlock(_ref) {
    var level = _ref.level,
        boxIndex = _ref.boxIndex,
        fieldIndex = _ref.fieldIndex,
        blockIndex = _ref.blockIndex,
        boxId = _ref.boxId,
        parentField = _ref.parentField,
        block = _ref.block;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var watchedBlockName = (0, _reactHookForm.useWatch)({
        control: control,
        name: (0, _fields.getFormId)(group.boxes, boxId, parentField.id) + ".blocks." + blockIndex + ".name"
    });

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            { key: block.id, className: "tree-el flex-between s-8", style: { "--level": level } },
            wp.element.createElement(
                "span",
                {
                    className: "cursor-pointer text-ellipsis",
                    onClick: function onClick(e) {
                        e.preventDefault();
                        (0, _scroll.scrollToId)(block.id);
                    }
                },
                watchedBlockName ? watchedBlockName : block.name
            ),
            wp.element.createElement(
                _Badge2.default,
                { style: _styles.styleVariants.DANGER },
                "B"
            )
        ),
        block.fields && block.fields.length > 0 && block.fields.map(function (child, childIndex) {
            return wp.element.createElement(_QuickNavigationField2.default, {
                level: level + 1,
                boxIndex: boxIndex,
                fieldIndex: childIndex,
                boxId: boxId,
                parentField: parentField,
                field: child
            });
        })
    );
};

QuickNavigationBlock.propTypes = {
    level: _propTypes2.default.number.isRequired,
    boxIndex: _propTypes2.default.number.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    blockIndex: _propTypes2.default.number.isRequired,
    boxId: _propTypes2.default.string.isRequired,
    block: _propTypes2.default.object.isRequired,
    parentField: _propTypes2.default.object.isRequired
};

exports.default = QuickNavigationBlock;

/***/ }),

/***/ 9473:
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

var _QuickNavigationField = __webpack_require__(9415);

var _QuickNavigationField2 = _interopRequireDefault(_QuickNavigationField);

var _react3 = __webpack_require__(4226);

var _reactHookForm = __webpack_require__(930);

var _scroll = __webpack_require__(2727);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuickNavigationBox = function QuickNavigationBox(_ref) {
    var index = _ref.index,
        box = _ref.box;

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var watchedBoxName = (0, _reactHookForm.useWatch)({
        control: control,
        name: "boxes." + index + ".name"
    });

    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isClosed = _useState2[0],
        setIsClosed = _useState2[1];

    return wp.element.createElement(
        "div",
        { key: box.id, className: "b-rounded with-shadow bg-white p-24" },
        wp.element.createElement(
            "h3",
            { className: (!isClosed && box.fields.length > 0 ? 'mb-24' : '') + " flex-between s-8" },
            wp.element.createElement(
                "span",
                { className: "cursor-pointer top-2", onClick: function onClick() {
                        return setIsClosed(!isClosed);
                    } },
                wp.element.createElement(_react3.Icon, { width: 18, icon: !isClosed ? 'bx:chevron-down' : 'bx:chevron-up', color: "#777" })
            ),
            wp.element.createElement(
                "span",
                {
                    className: "text-ellipsis cursor-pointer",
                    onClick: function onClick(e) {
                        e.preventDefault();
                        (0, _scroll.scrollToId)(box.id);
                    }
                },
                watchedBoxName ? watchedBoxName : box.name
            )
        ),
        !isClosed && box.fields && box.fields.length > 0 && wp.element.createElement(
            "div",
            { className: "tree " + (globals.is_rtl === true ? "rtl" : "") },
            box.fields.map(function (field, fieldIndex) {
                return wp.element.createElement(
                    _react2.default.Fragment,
                    null,
                    wp.element.createElement(_QuickNavigationField2.default, {
                        level: 0,
                        boxIndex: index,
                        fieldIndex: fieldIndex,
                        boxId: box.id,
                        field: field
                    })
                );
            })
        )
    );
};

QuickNavigationBox.propTypes = {
    index: _propTypes2.default.number.isRequired,
    box: _propTypes2.default.object.isRequired
};

exports.default = QuickNavigationBox;

/***/ }),

/***/ 9415:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Badge = __webpack_require__(3136);

var _Badge2 = _interopRequireDefault(_Badge);

var _styles = __webpack_require__(624);

var _reactHookForm = __webpack_require__(930);

var _scroll = __webpack_require__(2727);

var _fields = __webpack_require__(5216);

var _reactRedux = __webpack_require__(6706);

var _QuickNavigationBlock = __webpack_require__(6362);

var _QuickNavigationBlock2 = _interopRequireDefault(_QuickNavigationBlock);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuickNavigationField = function QuickNavigationField(_ref) {
    var level = _ref.level,
        boxIndex = _ref.boxIndex,
        fieldIndex = _ref.fieldIndex,
        boxId = _ref.boxId,
        parentField = _ref.parentField,
        field = _ref.field;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var watchedFieldName = (0, _reactHookForm.useWatch)({
        control: control,
        name: (0, _fields.getFormId)(group.boxes, boxId, field.id) + ".name"
    });

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            { key: field.id, className: "tree-el flex-between s-8", style: { "--level": level } },
            wp.element.createElement(
                "span",
                {
                    className: "cursor-pointer text-ellipsis",
                    onClick: function onClick(e) {
                        e.preventDefault();
                        (0, _scroll.scrollToId)("lazy-" + field.id);
                    }
                },
                watchedFieldName ? watchedFieldName : field.name
            ),
            wp.element.createElement(
                _Badge2.default,
                { style: parentField ? _styles.styleVariants.WARNING : _styles.styleVariants.SECONDARY },
                parentField ? "C" : "F"
            )
        ),
        field.children && field.children.length > 0 && field.children.map(function (child, childIndex) {
            return wp.element.createElement(QuickNavigationField, {
                level: level + 1,
                boxIndex: boxIndex,
                fieldIndex: childIndex,
                boxId: boxId,
                parentField: field,
                field: child
            });
        }),
        field.blocks && field.blocks.map(function (block, blockIndex) {
            return wp.element.createElement(_QuickNavigationBlock2.default, {
                boxIndex: boxIndex,
                block: block,
                blockIndex: blockIndex,
                boxId: boxId,
                level: level + 1,
                parentField: field,
                fieldIndex: fieldIndex
            });
        })
    );
};

QuickNavigationField.propTypes = {
    level: _propTypes2.default.number.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    boxIndex: _propTypes2.default.number.isRequired,
    boxId: _propTypes2.default.string.isRequired,
    field: _propTypes2.default.object.isRequired,
    parentField: _propTypes2.default.object
};

exports.default = QuickNavigationField;

/***/ }),

/***/ 1369:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _QuickNavigationBox = __webpack_require__(9473);

var _QuickNavigationBox2 = _interopRequireDefault(_QuickNavigationBox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuickNavigation = function QuickNavigation(_ref) {
    var boxes = _ref.boxes;


    if (typeof boxes === 'undefined' || boxes.length === 0) {
        return null;
    }

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        boxes && boxes.map(function (box, index) {
            return wp.element.createElement(_QuickNavigationBox2.default, {
                index: index,
                box: box
            });
        })
    );
};

QuickNavigation.propTypes = {
    boxes: _propTypes2.default.array.isRequired
};

exports.default = QuickNavigation;

/***/ }),

/***/ 3364:
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

var _QuickNavigation = __webpack_require__(1369);

var _QuickNavigation2 = _interopRequireDefault(_QuickNavigation);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _MetaBox = __webpack_require__(7998);

var _MetaBox2 = _interopRequireDefault(_MetaBox);

var _metaStateSlice = __webpack_require__(6836);

var _sortable = __webpack_require__(9125);

var _reactRedux = __webpack_require__(6706);

var _SortableList = __webpack_require__(5557);

var _SortableList2 = _interopRequireDefault(_SortableList);

var _reactHookForm = __webpack_require__(930);

var _MetaGroupHeader = __webpack_require__(4177);

var _MetaGroupHeader2 = _interopRequireDefault(_MetaGroupHeader);

var _objects = __webpack_require__(4040);

var _uuid = __webpack_require__(1614);

var _SwitchView = __webpack_require__(6973);

var _SwitchView2 = _interopRequireDefault(_SwitchView);

var _fields = __webpack_require__(5216);

var _localStorage = __webpack_require__(1500);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _react3 = __webpack_require__(4226);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _MetaGroupSettings = __webpack_require__(9190);

var _MetaGroupSettings2 = _interopRequireDefault(_MetaGroupSettings);

var _reactRouterDom = __webpack_require__(4022);

var _react4 = __webpack_require__(8839);

var _BulkActions = __webpack_require__(6278);

var _BulkActions2 = _interopRequireDefault(_BulkActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListView = function ListView(_ref) {
    var boxes = _ref.boxes,
        view = _ref.view,
        setView = _ref.setView;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group,
        closedElements = _useSelector.closedElements;

    // manage local state


    var newGroupId = (0, _uuid.v4)();

    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var _useState = (0, _react.useState)(typeof id !== 'string'),
        _useState2 = _slicedToArray(_useState, 2),
        settingsVisible = _useState2[0],
        setSettingsVisible = _useState2[1];

    // auto-animate


    var _useAutoAnimate = (0, _react4.useAutoAnimate)(),
        _useAutoAnimate2 = _slicedToArray(_useAutoAnimate, 1),
        parent = _useAutoAnimate2[0];

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: "boxes"
    }),
        move = _useFieldArray.move;

    var handleDragEnd = function handleDragEnd(event) {
        var active = event.active,
            over = event.over;


        if (active.id === over.id) {
            return;
        }

        var oldIndex = boxes.findIndex(function (box) {
            return box.id === active.id;
        });
        var newIndex = boxes.findIndex(function (box) {
            return box.id === over.id;
        });
        var sortedBoxes = (0, _sortable.arrayMove)(boxes, oldIndex, newIndex);
        move(oldIndex, newIndex);

        dispatch((0, _metaStateSlice.setBoxes)(sortedBoxes));
    };

    // show hide all fields handlers
    var showHideAllFields = function showHideAllFields() {
        var ids = (0, _fields.getElementIds)(group.boxes);
        var isClosed = closedElements.length > 0;

        if (isClosed) {
            (0, _localStorage.saveShowAll)(ids);
            dispatch((0, _metaStateSlice.showAll)());
        } else {
            (0, _localStorage.saveCloseAll)(ids);
            dispatch((0, _metaStateSlice.hideAll)());
        }
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            { className: "flex-between mb-24 s-8 for-xs" },
            wp.element.createElement(_MetaGroupHeader2.default, {
                groupId: !(0, _objects.isEmpty)(group) ? group.id : newGroupId,
                settingsVisible: settingsVisible,
                setSettingsVisible: setSettingsVisible
            }),
            wp.element.createElement(
                "div",
                { className: "i-flex-center s-8" },
                wp.element.createElement(_Tooltip2.default, {
                    label: wp.element.createElement(
                        _Button2.default,
                        {
                            css: {
                                height: "40px"
                            },
                            style: _styles.styleVariants.WHITE,
                            size: "xs",
                            onClick: function onClick(e) {
                                e.preventDefault();
                                showHideAllFields();
                            }
                        },
                        wp.element.createElement(_react3.Icon, { icon: closedElements.length > 0 ? 'ant-design:eye-outlined' : 'ant-design:eye-invisible-outlined', width: 18 })
                    ),
                    tip: (0, _useTranslation2.default)("Show/hide all fields"),
                    icon: false
                }),
                wp.element.createElement(_SwitchView2.default, {
                    localStorageKey: !(0, _objects.isEmpty)(group) ? group.id : newGroupId,
                    setView: setView,
                    view: view
                })
            )
        ),
        wp.element.createElement(
            "div",
            { className: !settingsVisible ? 'hidden' : '' },
            wp.element.createElement(_MetaGroupSettings2.default, { groupId: !(0, _objects.isEmpty)(group) ? group.id : newGroupId })
        ),
        wp.element.createElement(
            "div",
            { className: "container" },
            wp.element.createElement(
                "div",
                { className: "col-3 flex-column s-24 hidden-xs sticky", style: {
                        top: "200px"
                    } },
                wp.element.createElement(_QuickNavigation2.default, { boxes: boxes })
            ),
            wp.element.createElement(
                "div",
                { className: "col-9" },
                wp.element.createElement(
                    "div",
                    {
                        className: "flex-column s-24",
                        ref: parent
                    },
                    wp.element.createElement(_BulkActions2.default, {
                        view: "list"
                    }),
                    boxes && boxes.length > 0 ? wp.element.createElement(
                        _SortableList2.default,
                        {
                            onDragEnd: handleDragEnd,
                            items: boxes
                        },
                        wp.element.createElement(
                            _react2.default.Fragment,
                            null,
                            boxes.map(function (box, index) {
                                return wp.element.createElement(_MetaBox2.default, {
                                    index: index,
                                    key: box.id,
                                    view: "list",
                                    box: box
                                });
                            })
                        )
                    ) : wp.element.createElement(
                        _Alert2.default,
                        { style: _styles.styleVariants.WARNING },
                        (0, _useTranslation2.default)('No meta box already created. Create the first one now by clicking the button "Add meta box"!')
                    )
                )
            )
        )
    );
};

ListView.propTypes = {
    view: _propTypes2.default.string.isRequired,
    setView: _propTypes2.default.func.isRequired,
    boxes: _propTypes2.default.array.isRequired
};

exports.default = ListView;

/***/ }),

/***/ 8376:
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

var _MetaFieldType = __webpack_require__(1436);

var _MetaFieldType2 = _interopRequireDefault(_MetaFieldType);

var _react3 = __webpack_require__(4226);

var _reactHookForm = __webpack_require__(930);

var _sortable = __webpack_require__(9125);

var _utilities = __webpack_require__(4285);

var _fields = __webpack_require__(5216);

var _reactRedux = __webpack_require__(6706);

var _ElementSelector = __webpack_require__(7643);

var _ElementSelector2 = _interopRequireDefault(_ElementSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HorizontalSortableMetaFieldTab = function HorizontalSortableMetaFieldTab(_ref) {
    var isActive = _ref.isActive,
        _onClick = _ref.onClick,
        boxIndex = _ref.boxIndex,
        fieldIndex = _ref.fieldIndex,
        boxId = _ref.boxId,
        field = _ref.field,
        parentFieldIndex = _ref.parentFieldIndex,
        parentFieldId = _ref.parentFieldId,
        parentBlockId = _ref.parentBlockId;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group,
        selectedElementsType = _useSelector.selectedElementsType;

    /**
     *
     * @param value
     * @return {string}
     */


    var formId = function formId(value) {
        return (0, _fields.getFormId)(group.boxes, boxId, field.id) + "." + value;
    };

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var watchedFieldName = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("name")
    });
    var watchedFieldType = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("type")
    });

    // DND-kit

    var _useSortable = (0, _sortable.useSortable)({ id: field.id }),
        attributes = _useSortable.attributes,
        listeners = _useSortable.listeners,
        setNodeRef = _useSortable.setNodeRef,
        transform = _useSortable.transform;

    var style = {
        transform: _utilities.CSS.Translate.toString(transform)
    };

    /**
     *
     * @return {boolean}
     */
    var canCopyTheField = function canCopyTheField() {

        if (typeof field.isSaved !== 'undefined' && field.isSaved === false) {
            return false;
        }

        return true;
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            {
                className: "acpt-btn-switch " + (isActive ? 'active' : ''),
                ref: setNodeRef,
                style: style,
                onClick: function onClick() {
                    _onClick(fieldIndex);
                }
            },
            wp.element.createElement(
                "div",
                { className: "i-flex-center s-8" },
                wp.element.createElement(
                    "span",
                    _extends({ className: "cursor-move top-2 handle" }, attributes, listeners),
                    wp.element.createElement(_react3.Icon, { icon: "bx:dots-vertical-rounded", color: "#777", width: 18 })
                ),
                selectedElementsType !== 'box' && selectedElementsType !== 'block' && canCopyTheField() && wp.element.createElement(_ElementSelector2.default, {
                    elementType: "field",
                    element: {
                        id: field.id,
                        boxId: boxId,
                        parentFieldId: parentFieldId,
                        parentBlockId: parentBlockId
                    }
                }),
                wp.element.createElement(
                    "span",
                    {
                        className: "text-ellipsis",
                        style: {
                            maxWidth: "200px"
                        }
                    },
                    watchedFieldName ? watchedFieldName : field.name
                ),
                wp.element.createElement(_MetaFieldType2.default, { fieldType: watchedFieldType ? watchedFieldType : field.type, css: "top-2" })
            )
        )
    );
};

HorizontalSortableMetaFieldTab.propTypes = {
    boxIndex: _propTypes2.default.number.isRequired,
    boxId: _propTypes2.default.string.isRequired,
    fieldIndex: _propTypes2.default.string.isRequired,
    field: _propTypes2.default.object.isRequired,
    parentFieldIndex: _propTypes2.default.string,
    parentFieldId: _propTypes2.default.string,
    parentBlockId: _propTypes2.default.string,
    isActive: _propTypes2.default.bool.isRequired,
    onClick: _propTypes2.default.func.isRequired
};

exports.default = HorizontalSortableMetaFieldTab;

/***/ }),

/***/ 4891:
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

var _HorizontalSortableMetaFieldTab = __webpack_require__(8376);

var _HorizontalSortableMetaFieldTab2 = _interopRequireDefault(_HorizontalSortableMetaFieldTab);

var _SortableList = __webpack_require__(5557);

var _SortableList2 = _interopRequireDefault(_SortableList);

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _MetaField = __webpack_require__(8084);

var _MetaField2 = _interopRequireDefault(_MetaField);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _uuid = __webpack_require__(1614);

var _fields = __webpack_require__(857);

var _metaStateSlice = __webpack_require__(6836);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _sortable = __webpack_require__(9125);

var _fields2 = __webpack_require__(5216);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HorizontalSortableMetaFields = function HorizontalSortableMetaFields(_ref) {
    var boxIndex = _ref.boxIndex,
        boxId = _ref.boxId,
        fields = _ref.fields,
        parentFieldIndex = _ref.parentFieldIndex,
        parentFieldId = _ref.parentFieldId,
        parentBlockId = _ref.parentBlockId,
        _ref$addFieldEnabled = _ref.addFieldEnabled,
        addFieldEnabled = _ref$addFieldEnabled === undefined ? true : _ref$addFieldEnabled;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    var formId = function formId() {

        if (parentBlockId) {
            return (0, _fields2.getFormId)(group.boxes, boxId, parentBlockId) + ".fields";
        }

        if (parentFieldId) {
            return (0, _fields2.getFormId)(group.boxes, boxId, parentFieldId) + ".children";
        }

        return "boxes." + boxIndex + ".fields";
    };

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control,
        getValues = _useFormContext.getValues;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: formId()
    }),
        move = _useFieldArray.move;

    // manage local state


    var _useState = (0, _react.useState)(0),
        _useState2 = _slicedToArray(_useState, 2),
        activeTab = _useState2[0],
        setActiveTab = _useState2[1];

    (0, _react.useEffect)(function () {
        if (!fields[activeTab]) {
            setActiveTab(0);
        }
    }, [fields]);

    var handleOnClick = function handleOnClick(index) {
        setActiveTab(index);
    };

    var onDragEnd = function onDragEnd(event) {
        var active = event.active,
            over = event.over;


        if (active.id === over.id) {
            return;
        }

        var oldIndex = fields.findIndex(function (field) {
            return field.id === active.id;
        });
        var newIndex = fields.findIndex(function (field) {
            return field.id === over.id;
        });
        var sortedFields = (0, _sortable.arrayMove)(fields, oldIndex, newIndex);
        move(oldIndex, newIndex);

        setActiveTab(newIndex);
        dispatch((0, _metaStateSlice.setFields)({ boxId: boxId, parentFieldId: parentFieldId, parentBlockId: parentBlockId, sortedFields: sortedFields }));
    };

    var handleAddField = function handleAddField() {

        var field = {
            id: (0, _uuid.v4)(),
            boxId: boxId,
            name: 'meta_box_field',
            label: 'meta box field',
            type: _fields.fieldTypes.TEXT,
            defaultValue: "",
            description: "",
            isRequired: false,
            showInArchive: false,
            quickEdit: false,
            filterableInAdmin: false,
            sort: 1,
            advancedOptions: [],
            options: [],
            blocks: [],
            blockId: parentBlockId ? parentBlockId : null,
            validationRules: [],
            visibilityConditions: [],
            hasManyRelation: [],
            children: [],
            parentId: parentFieldId ? parentFieldId : null,
            isATextualField: true,
            isFilterable: true,
            isSaved: false
        };

        dispatch((0, _metaStateSlice.addField)({ boxId: boxId, parentFieldId: parentFieldId, parentBlockId: parentBlockId, field: field }));
        setActiveTab(fields ? fields.length : 0);
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        fields && fields.length > 0 ? wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(
                "div",
                { className: "flex-wrap i-flex-center s-8 mb-12" },
                wp.element.createElement(
                    _SortableList2.default,
                    {
                        items: fields,
                        onDragEnd: onDragEnd,
                        mode: "horizontal"
                    },
                    fields && fields.map(function (field, fieldIndex) {
                        return wp.element.createElement(_HorizontalSortableMetaFieldTab2.default, {
                            isActive: activeTab === fieldIndex,
                            onClick: handleOnClick,
                            boxIndex: boxIndex,
                            boxId: boxId,
                            fieldIndex: fieldIndex,
                            field: field,
                            parentFieldIndex: parentFieldIndex,
                            parentFieldId: parentFieldId,
                            parentBlockId: parentBlockId,
                            key: field.id
                        });
                    })
                ),
                wp.element.createElement(
                    _Button2.default,
                    {
                        type: "button",
                        style: _styles.styleVariants.SECONDARY,
                        size: "sm",
                        onClick: function onClick(e) {
                            e.preventDefault();
                            handleAddField();
                        }
                    },
                    "+"
                )
            ),
            wp.element.createElement(
                "div",
                null,
                fields && fields.map(function (field, fieldIndex) {
                    return wp.element.createElement(
                        _react2.default.Fragment,
                        null,
                        fieldIndex === activeTab && wp.element.createElement(
                            "div",
                            { className: "with-border b-rounded" },
                            wp.element.createElement(_MetaField2.default, {
                                setActiveTab: setActiveTab,
                                fieldIndex: fieldIndex,
                                field: field,
                                view: "tabular",
                                boxIndex: boxIndex,
                                boxId: boxId,
                                parentFieldIndex: parentFieldIndex,
                                parentFieldId: parentFieldId,
                                parentBlockId: parentBlockId
                            })
                        )
                    );
                })
            )
        ) : wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(
                _Alert2.default,
                { style: _styles.styleVariants.WARNING },
                (0, _useTranslation2.default)('No field box already created. Create the first one now by clicking the button "Add field box"!')
            ),
            addFieldEnabled && wp.element.createElement(
                "a",
                {
                    className: "acpt-btn acpt-btn-secondary acpt-btn-sm mt-24",
                    href: "#",
                    onClick: function onClick(e) {
                        e.preventDefault();
                        handleAddField();
                    }
                },
                (0, _useTranslation2.default)("Add field box")
            )
        )
    );
};

HorizontalSortableMetaFields.propTypes = {
    boxIndex: _propTypes2.default.number.isRequired,
    boxId: _propTypes2.default.string.isRequired,
    fields: _propTypes2.default.array.isRequired,
    parentFieldIndex: _propTypes2.default.string,
    parentFieldId: _propTypes2.default.string,
    parentBlockId: _propTypes2.default.string,
    addFieldEnabled: _propTypes2.default.bool
};

exports.default = HorizontalSortableMetaFields;

/***/ }),

/***/ 8529:
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

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _react3 = __webpack_require__(4226);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _DeleteMetaBoxModal = __webpack_require__(2127);

var _DeleteMetaBoxModal2 = _interopRequireDefault(_DeleteMetaBoxModal);

var _CopyMetaBoxModal = __webpack_require__(5587);

var _CopyMetaBoxModal2 = _interopRequireDefault(_CopyMetaBoxModal);

var _reactRedux = __webpack_require__(6706);

var _metaStateSlice = __webpack_require__(6836);

var _validation = __webpack_require__(9593);

var _localStorage = __webpack_require__(1500);

var _reactHookForm = __webpack_require__(930);

var _InputHidden = __webpack_require__(5978);

var _InputHidden2 = _interopRequireDefault(_InputHidden);

var _cloners = __webpack_require__(6118);

var _scroll = __webpack_require__(2727);

var _misc = __webpack_require__(3154);

var _transliteration = __webpack_require__(3659);

var _ajax = __webpack_require__(7569);

var _InputDebounced = __webpack_require__(2838);

var _InputDebounced2 = _interopRequireDefault(_InputDebounced);

var _ElementSelector = __webpack_require__(7643);

var _ElementSelector2 = _interopRequireDefault(_ElementSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var MetaBoxHeader = function MetaBoxHeader(_ref) {
    var index = _ref.index,
        box = _ref.box,
        view = _ref.view,
        listeners = _ref.listeners,
        attributes = _ref.attributes,
        setActiveTab = _ref.setActiveTab;


    // manage form state
    var formId = function formId(value) {
        return "boxes." + index + "." + value;
    };

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register,
        errors = _useFormContext.formState.errors,
        control = _useFormContext.control,
        setValue = _useFormContext.setValue,
        resetField = _useFormContext.resetField,
        clearErrors = _useFormContext.clearErrors;

    var watchedName = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("name")
    });
    var watchedLabel = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("label")
    });
    var watchedBox = (0, _reactHookForm.useWatch)({
        control: control,
        name: "boxes." + index
    });
    var watchedBoxes = (0, _reactHookForm.useWatch)({
        control: control,
        name: 'boxes'
    });

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: "boxes"
    }),
        append = _useFieldArray.append;

    // manage global state


    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        closedElements = _useSelector.closedElements,
        selectedElements = _useSelector.selectedElements,
        selectedElementsType = _useSelector.selectedElementsType;

    /**
     *
     * @return {boolean}
     */


    var isClosed = function isClosed() {
        var filter = closedElements.filter(function (e) {
            return e === box.id;
        });

        return filter.length === 1;
    };

    // manage local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        formVisible = _useState2[0],
        setFormVisible = _useState2[1];

    var _useState3 = (0, _react.useState)(true),
        _useState4 = _slicedToArray(_useState3, 2),
        autoSlug = _useState4[0],
        setAutoSlug = _useState4[1];

    /**
     *
     * @return {string|*}
     */


    var name = function name() {

        var id = formId("name");
        var error = (0, _reactHookForm.get)(errors, id);

        if (error) {
            return wp.element.createElement(
                "span",
                { className: "invalid-feedback" },
                (0, _useTranslation2.default)(error.message)
            );
        }

        return watchedName ? watchedName : box.name;
    };

    /**
     *
     * @return {null|*}
     */
    var label = function label() {
        return typeof watchedLabel === 'string' ? watchedLabel : box.label;
    };

    /**
     * This function avoid any box name collision
     * @param name
     * @return {string}
     */
    var checkIfNameIsValid = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name) {
            var slugified, otherBoxNames, res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            slugified = (0, _transliteration.slugify)((0, _transliteration.transliterate)(name));

                            // check for other box names

                            otherBoxNames = [];


                            watchedBoxes.map(function (box, i) {
                                if (i !== index) {
                                    otherBoxNames.push(box.name);
                                }
                            });

                            if (!otherBoxNames.includes(slugified)) {
                                _context.next = 5;
                                break;
                            }

                            return _context.abrupt("return", (0, _useTranslation2.default)("Name is already taken"));

                        case 5:
                            if (!(box.name !== slugified)) {
                                _context.next = 11;
                                break;
                            }

                            _context.next = 8;
                            return (0, _ajax.wpAjaxRequest)("checkMetaBoxNameAction", { boxName: slugified });

                        case 8:
                            res = _context.sent;

                            if (!(res.exists === true)) {
                                _context.next = 11;
                                break;
                            }

                            return _context.abrupt("return", (0, _useTranslation2.default)("Name is already taken"));

                        case 11:
                            return _context.abrupt("return", true);

                        case 12:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function checkIfNameIsValid(_x) {
            return _ref2.apply(this, arguments);
        };
    }();

    /**
     * Toggle close box
     */
    var handleToggleClose = function handleToggleClose() {
        (0, _localStorage.saveIsClosed)(box.id);

        if (isClosed()) {
            dispatch((0, _metaStateSlice.showElement)({ id: box.id }));
        } else {
            dispatch((0, _metaStateSlice.hideElement)({ id: box.id }));
        }
    };

    /**
     *
     * @return {boolean}
     */
    var canCopyTheBox = function canCopyTheBox() {

        if (typeof box.isSaved !== 'undefined' && box.isSaved === false) {
            return false;
        }

        return true;
    };

    var onChangeLabel = function onChangeLabel(value) {
        if (autoSlug) {
            var slugified = (0, _transliteration.slugify)((0, _transliteration.transliterate)(value));

            if (checkIfNameIsValid(slugified)) {
                clearErrors(formId("name"));
                setValue(formId("name"), slugified);
            }
        }
    };

    /**
     *
     * @return {boolean}
     */
    var isSelected = function isSelected() {
        var filter = selectedElements.filter(function (el) {
            return el.id === box.id;
        });

        return filter.length > 0;
    };

    return wp.element.createElement(
        "div",
        { className: "flex-between s-8 for-xs" },
        wp.element.createElement(_InputHidden2.default, {
            id: formId("id"),
            value: box.id,
            register: register
        }),
        wp.element.createElement(
            "span",
            { className: "i-flex-center s-8" },
            view === 'list' && wp.element.createElement(
                "span",
                _extends({ className: "cursor-move top-2 handle" }, attributes, listeners),
                wp.element.createElement(_react3.Icon, { icon: "bx:dots-vertical-rounded", color: "#777", width: 18 })
            ),
            selectedElementsType !== 'field' && selectedElementsType !== 'block' && canCopyTheBox() && wp.element.createElement(_ElementSelector2.default, {
                elementType: "box",
                element: {
                    id: box.id
                }
            }),
            wp.element.createElement(
                "h3",
                { className: "" + (!formVisible ? '' : 'hidden') },
                name()
            ),
            wp.element.createElement(
                "span",
                { className: "top-1 color-gray " + (!formVisible ? '' : 'hidden') },
                label()
            ),
            wp.element.createElement(
                "div",
                { className: "i-flex-center s-8 " + (formVisible ? '' : 'hidden') },
                wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(_InputDebounced2.default, {
                        size: "sm",
                        control: control,
                        id: formId("label"),
                        placeholder: (0, _useTranslation2.default)("Box label, non latin chars allowed."),
                        onChangeCapture: onChangeLabel,
                        defaultValue: box.label,
                        validate: {
                            validate: checkIfNameIsValid,
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }

                    })
                ),
                wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(_Input2.default, {
                        size: "sm",
                        id: formId("name"),
                        placeholder: (0, _useTranslation2.default)("Box name. Allowed chars: [a-z0-9_-]"),
                        defaultValue: box.name,
                        register: register,
                        errors: errors,
                        required: true,
                        onClick: function onClick(e) {
                            if (e.target.value === 'meta_box_field') {
                                resetField(formId("name"));
                            }
                        },
                        validate: {
                            validate: {
                                alphanumericallyValid: _validation.alphanumericallyValid,
                                checkIfNameIsValid: checkIfNameIsValid
                            },
                            required: (0, _useTranslation2.default)("This field is mandatory"),
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }
                    })
                ),
                wp.element.createElement(_Tooltip2.default, {
                    label: wp.element.createElement(
                        "span",
                        {
                            className: "acpt-btn-switch " + (autoSlug === true ? 'active' : ''),
                            onClick: function onClick(e) {
                                e.preventDefault();
                                setAutoSlug(!autoSlug);
                            }
                        },
                        wp.element.createElement(_react3.Icon, { icon: "bx-link", width: 18 })
                    ),
                    tip: (0, _useTranslation2.default)("" + (autoSlug ? 'Auto slug ON' : 'Auto slug OFF')),
                    icon: false
                })
            ),
            wp.element.createElement(
                _Button2.default,
                { style: _styles.styleVariants.SECONDARY, size: "sm", onClick: function onClick(e) {
                        e.preventDefault();
                        setFormVisible(!formVisible);
                    } },
                (0, _useTranslation2.default)("" + (formVisible ? 'Close' : 'Edit'))
            )
        ),
        wp.element.createElement(
            "span",
            { className: "i-flex-center s-8" },
            wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(
                    "a",
                    {
                        href: "#",
                        onClick: function onClick(e) {
                            e.preventDefault();
                            var duplicatedBox = (0, _cloners.cloneBox)(watchedBox);
                            dispatch((0, _metaStateSlice.addBox)(duplicatedBox));
                            append(duplicatedBox);

                            (0, _misc.delay)(1).then(function () {
                                (0, _scroll.scrollToId)(duplicatedBox.id);
                            });
                        }
                    },
                    wp.element.createElement(_react3.Icon, { icon: "bx:duplicate", width: 18 })
                ),
                tip: (0, _useTranslation2.default)("Duplicate this meta box"),
                icon: false
            }),
            canCopyTheBox() && wp.element.createElement(
                _react2.default.Fragment,
                null,
                wp.element.createElement(_Tooltip2.default, {
                    label: wp.element.createElement(_CopyMetaBoxModal2.default, {
                        box: box
                    }),
                    tip: (0, _useTranslation2.default)("Copy this meta box"),
                    icon: false
                })
            ),
            wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(_DeleteMetaBoxModal2.default, {
                    index: index,
                    setActiveTab: setActiveTab,
                    boxId: box.id
                }),
                tip: (0, _useTranslation2.default)("Delete this meta box"),
                icon: false
            }),
            view === 'list' && wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(
                    "a",
                    {
                        href: "#",
                        onClick: function onClick(e) {
                            e.preventDefault();
                            handleToggleClose();
                        }
                    },
                    wp.element.createElement(_react3.Icon, { icon: "bx:expand-alt", width: 18 })
                ),
                tip: (0, _useTranslation2.default)("Hide/show this meta box"),
                icon: false
            })
        )
    );
};

MetaBoxHeader.propTypes = {
    box: _propTypes2.default.object.isRequired,
    view: _propTypes2.default.oneOf(["list", "tabular"]).isRequired,
    setActiveTab: _propTypes2.default.func,
    attributes: _propTypes2.default.object,
    listeners: _propTypes2.default.object
};

exports.default = MetaBoxHeader;

/***/ }),

/***/ 1433:
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

var _sortable = __webpack_require__(9125);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _styles = __webpack_require__(624);

var _reactRedux = __webpack_require__(6706);

var _metaStateSlice = __webpack_require__(6836);

var _MetaField = __webpack_require__(8084);

var _MetaField2 = _interopRequireDefault(_MetaField);

var _uuid = __webpack_require__(1614);

var _fields = __webpack_require__(857);

var _SortableList = __webpack_require__(5557);

var _SortableList2 = _interopRequireDefault(_SortableList);

var _reactHookForm = __webpack_require__(930);

var _fields2 = __webpack_require__(5216);

var _react3 = __webpack_require__(8839);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VerticalSortableMetaFields = function VerticalSortableMetaFields(_ref) {
    var boxIndex = _ref.boxIndex,
        boxId = _ref.boxId,
        parentFieldIndex = _ref.parentFieldIndex,
        parentFieldId = _ref.parentFieldId,
        parentBlockId = _ref.parentBlockId,
        fields = _ref.fields,
        _ref$addFieldEnabled = _ref.addFieldEnabled,
        addFieldEnabled = _ref$addFieldEnabled === undefined ? true : _ref$addFieldEnabled;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    // auto-animate


    var _useAutoAnimate = (0, _react3.useAutoAnimate)(),
        _useAutoAnimate2 = _slicedToArray(_useAutoAnimate, 1),
        parent = _useAutoAnimate2[0];

    var formId = function formId() {

        if (parentBlockId) {
            return (0, _fields2.getFormId)(group.boxes, boxId, parentBlockId) + ".fields";
        }

        if (parentFieldId) {
            return (0, _fields2.getFormId)(group.boxes, boxId, parentFieldId) + ".children";
        }

        return "boxes." + boxIndex + ".fields";
    };

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: formId()
    }),
        move = _useFieldArray.move;

    var handleDragEnd = function handleDragEnd(event) {
        var active = event.active,
            over = event.over;


        if (active.id === over.id) {
            return;
        }

        var oldIndex = fields.findIndex(function (field) {
            return field.id === active.id;
        });
        var newIndex = fields.findIndex(function (field) {
            return field.id === over.id;
        });
        var sortedFields = (0, _sortable.arrayMove)(fields, oldIndex, newIndex);
        move(oldIndex, newIndex);

        dispatch((0, _metaStateSlice.setFields)({ boxId: boxId, parentFieldId: parentFieldId, parentBlockId: parentBlockId, sortedFields: sortedFields }));
    };

    var handleAddField = function handleAddField() {

        var field = {
            id: (0, _uuid.v4)(),
            boxId: boxId,
            name: 'meta_box_field',
            label: 'meta box field',
            type: _fields.fieldTypes.TEXT,
            defaultValue: "",
            description: "",
            isRequired: false,
            showInArchive: false,
            quickEdit: false,
            filterableInAdmin: false,
            sort: 1,
            advancedOptions: [],
            options: [],
            blocks: [],
            blockId: parentBlockId ? parentBlockId : null,
            validationRules: [],
            visibilityConditions: [],
            hasManyRelation: [],
            children: [],
            parentId: parentFieldId ? parentFieldId : null,
            isATextualField: true,
            isFilterable: true,
            isSaved: false
        };

        dispatch((0, _metaStateSlice.addField)({ boxId: boxId, parentFieldId: parentFieldId, parentBlockId: parentBlockId, field: field }));
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            {
                className: fields.length > 0 ? "bg-pale-gray b-rounded p-24 flex-column s-24" : "",
                ref: parent
            },
            fields.length > 0 ? wp.element.createElement(
                _SortableList2.default,
                {
                    onDragEnd: handleDragEnd,
                    items: fields
                },
                fields.map(function (field, fieldIndex) {
                    return wp.element.createElement(_MetaField2.default, {
                        boxIndex: boxIndex,
                        fieldIndex: fieldIndex,
                        boxId: boxId,
                        field: field,
                        parentFieldIndex: parentFieldIndex,
                        parentFieldId: parentFieldId,
                        parentBlockId: parentBlockId,
                        view: "list"
                    });
                })
            ) : wp.element.createElement(
                _Alert2.default,
                { style: _styles.styleVariants.WARNING },
                (0, _useTranslation2.default)('No field box already created. Create the first one now by clicking the button "Add field box"!')
            )
        ),
        addFieldEnabled && wp.element.createElement(
            "a",
            {
                className: "acpt-btn acpt-btn-secondary acpt-btn-sm mt-24",
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    handleAddField();
                }
            },
            (0, _useTranslation2.default)("Add field box")
        )
    );
};

VerticalSortableMetaFields.propTypes = {
    boxIndex: _propTypes2.default.number.isRequired,
    boxId: _propTypes2.default.string.isRequired,
    fields: _propTypes2.default.array.isRequired,
    parentFieldIndex: _propTypes2.default.string,
    parentFieldId: _propTypes2.default.string,
    parentBlockId: _propTypes2.default.string,
    addFieldEnabled: _propTypes2.default.bool
};

exports.default = VerticalSortableMetaFields;

/***/ }),

/***/ 7998:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _MetaBoxHeader = __webpack_require__(8529);

var _MetaBoxHeader2 = _interopRequireDefault(_MetaBoxHeader);

var _sortable = __webpack_require__(9125);

var _utilities = __webpack_require__(4285);

var _VerticalSortableMetaFields = __webpack_require__(1433);

var _VerticalSortableMetaFields2 = _interopRequireDefault(_VerticalSortableMetaFields);

var _HorizontalSortableMetaFields = __webpack_require__(4891);

var _HorizontalSortableMetaFields2 = _interopRequireDefault(_HorizontalSortableMetaFields);

var _reactRedux = __webpack_require__(6706);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaBox = function MetaBox(_ref) {
    var index = _ref.index,
        box = _ref.box,
        view = _ref.view,
        setActiveTab = _ref.setActiveTab;

    // DND-kit
    var _useSortable = (0, _sortable.useSortable)({ id: box.id }),
        attributes = _useSortable.attributes,
        listeners = _useSortable.listeners,
        setNodeRef = _useSortable.setNodeRef,
        transform = _useSortable.transform;

    var style = {
        transform: _utilities.CSS.Translate.toString(transform)
    };

    // manage global state

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        closedElements = _useSelector.closedElements;

    /**
     *
     * @return {boolean}
     */


    var isClosed = function isClosed() {
        var filter = closedElements.filter(function (e) {
            return e === box.id;
        });

        return filter.length === 1;
    };

    return wp.element.createElement(
        "div",
        { id: box.id, className: view === 'list' ? 'bg-white b-rounded with-shadow p-24' : '', ref: view === 'list' ? setNodeRef : null, style: view === 'list' ? style : null },
        wp.element.createElement(
            "div",
            { className: view === 'tabular' || !isClosed() && view === 'list' ? 'mb-24' : '' },
            wp.element.createElement(_MetaBoxHeader2.default, {
                index: index,
                setActiveTab: setActiveTab,
                attributes: view === 'list' ? attributes : null,
                listeners: view === 'list' ? listeners : null,
                box: box,
                view: view
            })
        ),
        view === 'list' ? wp.element.createElement(
            "div",
            { className: "" + (isClosed() ? 'hidden' : '') },
            wp.element.createElement(_VerticalSortableMetaFields2.default, {
                boxIndex: index,
                boxId: box.id,
                fields: box.fields
            })
        ) : wp.element.createElement(
            "div",
            null,
            wp.element.createElement(_HorizontalSortableMetaFields2.default, {
                boxIndex: index,
                boxId: box.id,
                fields: box.fields
            })
        )
    );
};

MetaBox.propTypes = {
    index: _propTypes2.default.number.isRequired,
    box: _propTypes2.default.object.isRequired,
    setActiveTab: _propTypes2.default.func,
    view: _propTypes2.default.oneOf(["list", "tabular"]).isRequired
};

exports.default = MetaBox;

/***/ }),

/***/ 8705:
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

var _react3 = __webpack_require__(4226);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _reactHookForm = __webpack_require__(930);

var _MetaFieldType = __webpack_require__(1436);

var _MetaFieldType2 = _interopRequireDefault(_MetaFieldType);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _localStorage = __webpack_require__(1500);

var _DeleteMetaFieldModal = __webpack_require__(4317);

var _DeleteMetaFieldModal2 = _interopRequireDefault(_DeleteMetaFieldModal);

var _metaStateSlice = __webpack_require__(6836);

var _reactRedux = __webpack_require__(6706);

var _ButtonSwitch = __webpack_require__(9804);

var _ButtonSwitch2 = _interopRequireDefault(_ButtonSwitch);

var _cloners = __webpack_require__(6118);

var _misc = __webpack_require__(3154);

var _scroll = __webpack_require__(2727);

var _MetaFieldShortCodeModal = __webpack_require__(1111);

var _MetaFieldShortCodeModal2 = _interopRequireDefault(_MetaFieldShortCodeModal);

var _fields = __webpack_require__(857);

var _CopyMetaFieldModal = __webpack_require__(889);

var _CopyMetaFieldModal2 = _interopRequireDefault(_CopyMetaFieldModal);

var _fields2 = __webpack_require__(5216);

var _ElementSelector = __webpack_require__(7643);

var _ElementSelector2 = _interopRequireDefault(_ElementSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaFieldHeader = (0, _react.memo)(function (_ref) {
    var boxId = _ref.boxId,
        field = _ref.field,
        view = _ref.view,
        listeners = _ref.listeners,
        attributes = _ref.attributes,
        formId = _ref.formId,
        boxIndex = _ref.boxIndex,
        fieldIndex = _ref.fieldIndex,
        parentFieldId = _ref.parentFieldId,
        parentBlockId = _ref.parentBlockId,
        setActiveTab = _ref.setActiveTab;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group,
        closedElements = _useSelector.closedElements,
        selectedElementsType = _useSelector.selectedElementsType;

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        errors = _useFormContext.formState.errors,
        control = _useFormContext.control;

    var watchedName = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("name")
    });
    var watchedType = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("type")
    });
    var watchedField = (0, _reactHookForm.useWatch)({
        control: control,
        name: "boxes." + boxIndex + ".fields." + fieldIndex
    });
    var watchedShowInArchive = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("showInArchive")
    });
    var watchedFilterableInAdmin = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("filterableInAdmin")
    });
    var watchedQuickEdit = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("quickEdit")
    });
    var watchedIsRequired = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("isRequired")
    });

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: (0, _fields2.getFormId)(group.boxes, boxId, field.id, false)
    }),
        append = _useFieldArray.append;

    /**
     *
     * @return {boolean}
     */


    var isClosed = function isClosed() {
        var filter = closedElements.filter(function (e) {
            return e === field.id;
        });

        return filter.length === 1;
    };

    /**
     *
     * @return {string|*}
     */
    var name = function name() {
        var id = formId("name");
        var error = (0, _reactHookForm.get)(errors, id);

        if (error) {
            return wp.element.createElement(
                "span",
                { className: "invalid-feedback" },
                (0, _useTranslation2.default)(error.message)
            );
        }

        return watchedName ? watchedName : field.name;
    };

    /**
     *
     * @return {*}
     */
    var fieldType = function fieldType() {
        return watchedType ? watchedType : field.type;
    };

    /**
     *
     * @return {boolean|boolean}
     */
    var showTheShortcode = function showTheShortcode() {
        return fieldType() !== _fields.fieldTypes.REPEATER && fieldType() !== _fields.fieldTypes.FLEXIBLE;
    };

    /**
     * Toggle close box
     */
    var handleToggleClose = function handleToggleClose() {
        (0, _localStorage.saveIsClosed)(field.id);

        if (isClosed()) {
            dispatch((0, _metaStateSlice.showElement)({ id: field.id }));
        } else {
            dispatch((0, _metaStateSlice.hideElement)({ id: field.id }));
        }
    };

    /**
     *
     * @return {boolean}
     */
    var canCopyTheField = function canCopyTheField() {

        if (typeof field.isSaved !== 'undefined' && field.isSaved === false) {
            return false;
        }

        return true;
    };

    return wp.element.createElement(
        "div",
        { className: "flex-between s-8 for-xs" },
        wp.element.createElement(
            "span",
            { className: "i-flex-center s-8" },
            view === 'list' && wp.element.createElement(
                "span",
                _extends({ className: "cursor-move top-2 handle" }, attributes, listeners),
                wp.element.createElement(_react3.Icon, { icon: "bx:dots-vertical-rounded", color: "#777", width: 18 })
            ),
            selectedElementsType !== 'box' && selectedElementsType !== 'block' && canCopyTheField() && wp.element.createElement(_ElementSelector2.default, {
                elementType: "field",
                element: {
                    id: field.id,
                    boxId: boxId,
                    parentFieldId: parentFieldId,
                    parentBlockId: parentBlockId
                }
            }),
            wp.element.createElement(
                "h3",
                null,
                name()
            ),
            wp.element.createElement(
                "span",
                { className: "color-gray" },
                wp.element.createElement(_MetaFieldType2.default, { fieldType: fieldType(), css: "top-2" })
            ),
            wp.element.createElement(
                "span",
                { className: "i-flex-center s-8" },
                wp.element.createElement(_Tooltip2.default, {
                    label: wp.element.createElement(_ButtonSwitch2.default, {
                        id: formId("showInArchive"),
                        control: control,
                        defaultValue: typeof watchedShowInArchive === "boolean" ? watchedShowInArchive : field.showInArchive,
                        errors: errors,
                        icon: "bxl:wordpress"
                    }),
                    tip: (0, _useTranslation2.default)("Show in Wordpress admin post lists page"),
                    icon: false
                }),
                wp.element.createElement(_Tooltip2.default, {
                    label: wp.element.createElement(_ButtonSwitch2.default, {
                        control: control,
                        defaultValue: typeof watchedFilterableInAdmin === "boolean" ? watchedFilterableInAdmin : field.filterableInAdmin,
                        errors: errors,
                        icon: "bx:filter",
                        id: formId("filterableInAdmin")
                    }),
                    tip: (0, _useTranslation2.default)("Filterable in Wordpress admin post lists page"),
                    icon: false
                }),
                wp.element.createElement(_Tooltip2.default, {
                    label: wp.element.createElement(_ButtonSwitch2.default, {
                        control: control,
                        defaultValue: typeof watchedQuickEdit === "boolean" ? watchedQuickEdit : field.quickEdit,
                        errors: errors,
                        icon: "bx:pencil",
                        id: formId("quickEdit")
                    }),
                    tip: (0, _useTranslation2.default)("Quick edit in Wordpress admin post lists page"),
                    icon: false
                }),
                wp.element.createElement(_Tooltip2.default, {
                    label: wp.element.createElement(
                        _react2.default.Fragment,
                        null,
                        wp.element.createElement(_ButtonSwitch2.default, {
                            control: control,
                            defaultValue: typeof watchedIsRequired === "boolean" ? watchedIsRequired : field.isRequired,
                            errors: errors,
                            icon: "foundation:asterisk",
                            id: formId("isRequired")
                        })
                    ),
                    tip: (0, _useTranslation2.default)("Field required"),
                    icon: false
                })
            )
        ),
        wp.element.createElement(
            "span",
            { className: "i-flex-center s-8" },
            showTheShortcode() && wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(_MetaFieldShortCodeModal2.default, {
                    boxId: boxId,
                    field: field,
                    parentFieldId: parentFieldId,
                    parentBlockId: parentBlockId
                }),
                tip: (0, _useTranslation2.default)("Show the shortcode"),
                icon: false
            }),
            wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(
                    "a",
                    {
                        href: "#",
                        onClick: function onClick(e) {
                            e.preventDefault();
                            var duplicatedField = (0, _cloners.cloneField)(boxId, watchedField);
                            dispatch((0, _metaStateSlice.addField)({ boxId: boxId, field: duplicatedField }));
                            append(duplicatedField);

                            (0, _misc.delay)(1).then(function () {
                                (0, _scroll.scrollToId)(duplicatedField.id);
                            });
                        }
                    },
                    wp.element.createElement(_react3.Icon, { icon: "bx:duplicate", width: 18 })
                ),
                tip: (0, _useTranslation2.default)("Duplicate this meta field"),
                icon: false
            }),
            canCopyTheField() && wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(_CopyMetaFieldModal2.default, { field: field }),
                tip: (0, _useTranslation2.default)("Copy this meta field"),
                icon: false
            }),
            wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(_DeleteMetaFieldModal2.default, {
                    setActiveTab: setActiveTab,
                    boxId: boxId,
                    fieldId: field.id,
                    fieldIndex: fieldIndex,
                    parentFieldId: parentFieldId,
                    parentBlockId: parentBlockId
                }),
                tip: (0, _useTranslation2.default)("Delete this meta field"),
                icon: false
            }),
            view === 'list' && wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(
                    "a",
                    {
                        href: "#",
                        onClick: function onClick(e) {
                            e.preventDefault();
                            handleToggleClose();
                        }
                    },
                    wp.element.createElement(_react3.Icon, { icon: "bx:expand-alt", width: 18 })
                ),
                tip: (0, _useTranslation2.default)("Hide/show this meta field"),
                icon: false
            })
        )
    );
});

MetaFieldHeader.propTypes = {
    boxIndex: _propTypes2.default.number.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    formId: _propTypes2.default.func.isRequired,
    boxId: _propTypes2.default.string.isRequired,
    parentFieldId: _propTypes2.default.string,
    parentBlockId: _propTypes2.default.string,
    field: _propTypes2.default.object.isRequired,
    view: _propTypes2.default.oneOf(["list", "tabular"]).isRequired,
    attributes: _propTypes2.default.object,
    listeners: _propTypes2.default.object,
    setActiveTab: _propTypes2.default.func
};

exports.default = MetaFieldHeader;

/***/ }),

/***/ 2978:
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

var _sortable = __webpack_require__(9125);

var _utilities = __webpack_require__(4285);

var _react3 = __webpack_require__(4226);

var _InputHidden = __webpack_require__(5978);

var _InputHidden2 = _interopRequireDefault(_InputHidden);

var _reactHookForm = __webpack_require__(930);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _reactRedux = __webpack_require__(6706);

var _DeleteMetaOptionModal = __webpack_require__(6365);

var _DeleteMetaOptionModal2 = _interopRequireDefault(_DeleteMetaOptionModal);

var _fields = __webpack_require__(5216);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _ButtonSwitch = __webpack_require__(9804);

var _ButtonSwitch2 = _interopRequireDefault(_ButtonSwitch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaOption = function MetaOption(_ref) {
    var index = _ref.index,
        boxIndex = _ref.boxIndex,
        fieldIndex = _ref.fieldIndex,
        boxId = _ref.boxId,
        fieldId = _ref.fieldId,
        parentFieldId = _ref.parentFieldId,
        option = _ref.option,
        handleIsDefault = _ref.handleIsDefault;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    // manage form state


    var formId = function formId(value) {

        if (parentFieldId) {
            return (0, _fields.getFormId)(group.boxes, boxId, fieldId) + ".options." + index + "." + value;
        }

        return "boxes." + boxIndex + ".fields." + fieldIndex + ".options." + index + "." + value;
    };

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register,
        errors = _useFormContext.formState.errors,
        control = _useFormContext.control,
        setValue = _useFormContext.setValue,
        resetField = _useFormContext.resetField;

    var watchedValue = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("value")
    });
    var watchedLabel = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("label")
    });
    var watchedIsDefault = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("isDefault")
    });

    // DND-kit

    var _useSortable = (0, _sortable.useSortable)({ id: option.id }),
        attributes = _useSortable.attributes,
        listeners = _useSortable.listeners,
        setNodeRef = _useSortable.setNodeRef,
        transform = _useSortable.transform;

    var style = {
        transform: _utilities.CSS.Translate.toString(transform)
    };

    // manage local state

    var _useState = (0, _react.useState)(option.label === option.value),
        _useState2 = _slicedToArray(_useState, 2),
        linkedOption = _useState2[0],
        setLinkedOption = _useState2[1];

    /**
     *
     * @return {string|*}
     */


    var value = function value() {
        if (watchedValue) {
            return watchedValue;
        }

        if (option.value) {
            return option.value;
        }

        return null;
    };

    /**
     *
     * @return {null|*}
     */
    var label = function label() {
        if (watchedLabel) {
            return watchedLabel;
        }

        if (option.label) {
            return option.label;
        }

        return null;
    };

    return wp.element.createElement(
        "div",
        { className: "i-flex-center s-8", style: style, ref: setNodeRef },
        wp.element.createElement(_InputHidden2.default, {
            id: formId("id"),
            value: option.id,
            register: register
        }),
        wp.element.createElement(
            "span",
            _extends({ className: "cursor-move top-2 handle" }, attributes, listeners),
            wp.element.createElement(_react3.Icon, { icon: "bx:dots-vertical-rounded", color: "#777", width: 18 })
        ),
        wp.element.createElement(
            "span",
            { className: "w-100" },
            wp.element.createElement(_Input2.default, {
                id: formId("label"),
                register: register,
                errors: errors,
                defaultValue: label(),
                onChangeCapture: function onChangeCapture(e) {
                    if (linkedOption) {
                        setValue(formId("value"), e.target.value);
                    }
                },
                onClick: function onClick(e) {
                    if (option.label && e.target.value === 'option') {
                        resetField(formId("label"));
                    }
                },
                validate: {
                    required: (0, _useTranslation2.default)("This field is mandatory"),
                    maxLength: {
                        value: 255,
                        message: "max length is 255"
                    }
                }
            })
        ),
        wp.element.createElement(
            "span",
            { className: "w-100" },
            wp.element.createElement(_Input2.default, {
                id: formId("value"),
                register: register,
                errors: errors,
                defaultValue: value(),
                onChangeCapture: function onChangeCapture(e) {
                    if (linkedOption) {
                        setValue(formId("label"), e.target.value);
                    }
                },
                onClick: function onClick(e) {
                    if (option.value && e.target.value === 'option') {
                        resetField(formId("option"));
                    }
                },
                validate: {
                    required: (0, _useTranslation2.default)("This field is mandatory"),
                    maxLength: {
                        value: 255,
                        message: "max length is 255"
                    }
                }
            })
        ),
        wp.element.createElement(
            "span",
            { className: "i-flex-center s-8" },
            wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(
                    "button",
                    {
                        type: "button",
                        className: "acpt-btn-switch " + (linkedOption ? 'active' : ''),
                        onClick: function onClick(e) {
                            e.preventDefault();
                            setLinkedOption(!linkedOption);
                        }
                    },
                    wp.element.createElement(_react3.Icon, { icon: "bx:bx-link", width: "18px" })
                ),
                tip: (0, _useTranslation2.default)(linkedOption ? "Label and value are linked" : "Label and value are unlinked"),
                icon: false
            }),
            wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(_ButtonSwitch2.default, {
                    control: control,
                    defaultValue: typeof watchedIsDefault === "boolean" ? watchedIsDefault : option.isDefault,
                    errors: errors,
                    icon: "bx:check",
                    id: formId("isDefault"),
                    externalOnChange: handleIsDefault
                }),
                tip: (0, _useTranslation2.default)("Default value"),
                icon: false
            })
        ),
        wp.element.createElement(_DeleteMetaOptionModal2.default, {
            boxId: boxId,
            fieldId: fieldId,
            optionId: option.id,
            parentFieldId: parentFieldId,
            optionIndex: index
        })
    );
};

MetaOption.propTypes = {
    index: _propTypes2.default.number.isRequired,
    boxIndex: _propTypes2.default.number.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    boxId: _propTypes2.default.string.isRequired,
    fieldId: _propTypes2.default.string.isRequired,
    parentFieldId: _propTypes2.default.string,
    option: _propTypes2.default.object.isRequired,
    handleIsDefault: _propTypes2.default.func
};

exports.default = MetaOption;

/***/ }),

/***/ 7082:
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

var _SortableList = __webpack_require__(5557);

var _SortableList2 = _interopRequireDefault(_SortableList);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _styles = __webpack_require__(624);

var _MetaOption = __webpack_require__(2978);

var _MetaOption2 = _interopRequireDefault(_MetaOption);

var _uuid = __webpack_require__(1614);

var _metaStateSlice = __webpack_require__(6836);

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _fields = __webpack_require__(5216);

var _react3 = __webpack_require__(8839);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaOptionList = function MetaOptionList(_ref) {
    var boxId = _ref.boxId,
        boxIndex = _ref.boxIndex,
        fieldIndex = _ref.fieldIndex,
        fieldId = _ref.fieldId,
        parentFieldId = _ref.parentFieldId,
        options = _ref.options,
        isMulti = _ref.isMulti;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    // auto-animate


    var _useAutoAnimate = (0, _react3.useAutoAnimate)(),
        _useAutoAnimate2 = _slicedToArray(_useAutoAnimate, 1),
        parent = _useAutoAnimate2[0];

    // manage form state


    var formId = function formId() {
        return (0, _fields.getFormId)(group.boxes, boxId, fieldId) + ".options";
    };

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control,
        setValue = _useFormContext.setValue,
        resetField = _useFormContext.resetField;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: formId()
    }),
        move = _useFieldArray.move;

    var handleDragEnd = function handleDragEnd(event) {
        var active = event.active,
            over = event.over;


        if (active.id === over.id) {
            return;
        }

        var oldIndex = options.findIndex(function (field) {
            return field.id === active.id;
        });
        var newIndex = options.findIndex(function (field) {
            return field.id === over.id;
        });
        move(oldIndex, newIndex);
    };

    /**
     * Add new option
     */
    var handleAddOption = function handleAddOption() {

        var option = {
            id: (0, _uuid.v4)(),
            boxId: boxId,
            fieldId: fieldId,
            label: 'option',
            value: 'option',
            isDefault: false
        };

        dispatch((0, _metaStateSlice.addOption)({ boxId: boxId, fieldId: fieldId, parentFieldId: parentFieldId, option: option }));
    };

    var handleIsDefault = function handleIsDefault(_ref2) {
        var id = _ref2.id,
            checked = _ref2.checked;

        if (isMulti) {
            return;
        }

        for (var i = 0; i < options.length; i++) {
            var optionId = formId() + "." + i + ".isDefault";
            if (optionId !== id) {
                setValue(optionId, false);
            } else {
                setValue(optionId, checked);
            }
        }
    };

    return wp.element.createElement(
        "div",
        { className: "mt-24" },
        wp.element.createElement(
            "fieldset",
            { className: "acpt-fieldset" },
            wp.element.createElement(
                "legend",
                null,
                (0, _useTranslation2.default)("Option list")
            ),
            wp.element.createElement(
                "div",
                {
                    ref: parent,
                    className: "flex-column s-24"
                },
                options && options.length > 0 ? wp.element.createElement(
                    _SortableList2.default,
                    {
                        onDragEnd: handleDragEnd,
                        items: options
                    },
                    options && options.map(function (option, index) {
                        return wp.element.createElement(_MetaOption2.default, {
                            index: index,
                            boxIndex: boxIndex,
                            fieldIndex: fieldIndex,
                            boxId: boxId,
                            fieldId: fieldId,
                            parentFieldId: parentFieldId,
                            option: option,
                            handleIsDefault: handleIsDefault
                        });
                    })
                ) : wp.element.createElement(
                    _Alert2.default,
                    { style: _styles.styleVariants.WARNING },
                    (0, _useTranslation2.default)('No options already created. Create the first one now by clicking the button "Add option"!')
                )
            ),
            wp.element.createElement(
                "a",
                {
                    href: "#",
                    className: "mt-24",
                    onClick: function onClick(e) {
                        e.preventDefault();
                        handleAddOption();
                    }
                },
                (0, _useTranslation2.default)("Add option")
            )
        )
    );
};

MetaOptionList.propTypes = {
    boxId: _propTypes2.default.string.isRequired,
    fieldId: _propTypes2.default.string.isRequired,
    parentFieldId: _propTypes2.default.string,
    boxIndex: _propTypes2.default.number.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    options: _propTypes2.default.array.isRequired,
    isMulti: _propTypes2.default.bool.isRequired
};

exports.default = MetaOptionList;

/***/ }),

/***/ 2429:
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

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _Label = __webpack_require__(7115);

var _Label2 = _interopRequireDefault(_Label);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _validation = __webpack_require__(9593);

var _fields = __webpack_require__(857);

var _reactHookForm = __webpack_require__(930);

var _MetaOptionList = __webpack_require__(7082);

var _MetaOptionList2 = _interopRequireDefault(_MetaOptionList);

var _Select = __webpack_require__(4003);

var _Select2 = _interopRequireDefault(_Select);

var _fields2 = __webpack_require__(5216);

var _reactRedux = __webpack_require__(6706);

var _metaStateSlice = __webpack_require__(6836);

var _transliteration = __webpack_require__(3659);

var _ajax = __webpack_require__(7569);

var _InputDebounced = __webpack_require__(2838);

var _InputDebounced2 = _interopRequireDefault(_InputDebounced);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var BasicTab = function BasicTab(_ref) {
    var view = _ref.view,
        formId = _ref.formId,
        boxIndex = _ref.boxIndex,
        fieldIndex = _ref.fieldIndex,
        boxId = _ref.boxId,
        field = _ref.field;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    var dispatch = (0, _reactRedux.useDispatch)();

    // mange local state

    var _useState = (0, _react.useState)(true),
        _useState2 = _slicedToArray(_useState, 2),
        autoSlug = _useState2[0],
        setAutoSlug = _useState2[1];

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register,
        unregister = _useFormContext.unregister,
        control = _useFormContext.control,
        errors = _useFormContext.formState.errors,
        resetField = _useFormContext.resetField,
        reset = _useFormContext.reset,
        setValue = _useFormContext.setValue,
        clearErrors = _useFormContext.clearErrors;

    var watchedType = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("type")
    });
    var watchedName = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("name")
    });
    var watchedFields = (0, _reactHookForm.useWatch)({
        control: control,
        name: "boxes." + boxIndex + ".fields"
    });
    var watchedBoxName = (0, _reactHookForm.useWatch)({
        control: control,
        name: "boxes." + boxIndex + ".name"
    });

    // calculate nesting levels
    var nestingLevel = (0, _fields2.fieldNestingLevel)(group.boxes, boxId, field.id);

    /**
     *
     * @return {*}
     */
    var fieldType = function fieldType() {
        return watchedType ? watchedType : field.type;
    };

    // handle field type change (update redux state)
    var handleFieldTypeChange = function handleFieldTypeChange(type) {
        if (fieldType() !== type) {
            var updatedField = _extends({}, field);
            updatedField.type = type;

            if (type !== _fields.fieldTypes.REPEATER) {
                updatedField.children = [];
            }

            if (type !== _fields.fieldTypes.FLEXIBLE) {
                updatedField.blocks = [];
            }

            if (type !== _fields.fieldTypes.POST) {
                updatedField.relations = [];
            }

            if (!(0, _fields2.canFieldHaveValidationAndLogicRules)(type)) {
                unregister(formId("relations"));
                unregister(formId("visibilityConditions"));
                unregister(formId("validationRules"));
                updatedField.visibilityConditions = [];
                updatedField.validationRules = [];
                updatedField.relations = [];
            }

            unregister(formId("relations"));
            unregister(formId("blocks"));
            unregister(formId("children"));

            dispatch((0, _metaStateSlice.updateField)({ field: updatedField, boxId: boxId }));
        }
    };

    /**
     * This function avoid any box name collision
     * @param name
     * @return {string}
     */
    var checkIfNameIsValid = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name) {
            var slugified, otherFieldNames, res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            slugified = (0, _transliteration.slugify)((0, _transliteration.transliterate)(name));

                            // check for other box names

                            otherFieldNames = [];


                            watchedFields.map(function (field, i) {
                                if (i !== fieldIndex) {
                                    otherFieldNames.push(field.name);
                                }
                            });

                            if (!otherFieldNames.includes(slugified)) {
                                _context.next = 5;
                                break;
                            }

                            return _context.abrupt("return", (0, _useTranslation2.default)("Name is already taken"));

                        case 5:
                            if (!(field.name !== slugified)) {
                                _context.next = 11;
                                break;
                            }

                            _context.next = 8;
                            return (0, _ajax.wpAjaxRequest)("checkMetaBoxFieldNameAction", {
                                boxName: watchedBoxName ? watchedBoxName : field.boxName,
                                fieldName: slugified
                            });

                        case 8:
                            res = _context.sent;

                            if (!(res.exists === true)) {
                                _context.next = 11;
                                break;
                            }

                            return _context.abrupt("return", (0, _useTranslation2.default)("Name is already taken"));

                        case 11:
                            return _context.abrupt("return", true);

                        case 12:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function checkIfNameIsValid(_x) {
            return _ref2.apply(this, arguments);
        };
    }();

    var onChangeLabel = function onChangeLabel(value) {
        if (autoSlug) {
            var slugified = (0, _transliteration.slugify)((0, _transliteration.transliterate)(value));

            if (checkIfNameIsValid(slugified)) {
                clearErrors(formId("name"));
                setValue(formId("name"), slugified);
            }
        }
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            { className: "flex-column s-24" },
            wp.element.createElement(
                "div",
                { className: "container align-end" },
                wp.element.createElement(
                    "div",
                    { className: "col-4" },
                    wp.element.createElement(_Label2.default, {
                        isRequired: false,
                        id: formId("label"),
                        label: wp.element.createElement(
                            "div",
                            { className: "flex-between" },
                            wp.element.createElement(
                                "span",
                                null,
                                (0, _useTranslation2.default)("Field label")
                            ),
                            wp.element.createElement(
                                "a",
                                {
                                    href: "#",
                                    onClick: function onClick(e) {
                                        e.preventDefault();
                                        setAutoSlug(!autoSlug);
                                    }
                                },
                                (0, _useTranslation2.default)("" + (autoSlug ? 'Auto slug ON' : 'Auto slug OFF'))
                            )
                        )
                    }),
                    wp.element.createElement(_InputDebounced2.default, {
                        control: control,
                        id: formId("label"),
                        placeholder: (0, _useTranslation2.default)("The field label, non latin characters are allowed"),
                        onChangeCapture: onChangeLabel,
                        defaultValue: field.label,
                        validate: {
                            validate: checkIfNameIsValid,
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }

                    })
                ),
                wp.element.createElement(
                    "div",
                    { className: "col-4" },
                    wp.element.createElement(_Label2.default, {
                        isRequired: true,
                        id: formId("name"),
                        label: (0, _useTranslation2.default)("Field slug")
                    }),
                    wp.element.createElement(_Input2.default, {
                        id: formId("name"),
                        register: register,
                        errors: errors,
                        placeholder: (0, _useTranslation2.default)("Field slug (Ex. gallery or text_1)"),
                        defaultValue: field.name,
                        onClick: function onClick(e) {
                            if (e.target.value === 'meta_box_field') {
                                resetField(formId("name"));
                            }
                        },
                        validate: {
                            validate: {
                                alphanumericallyValid: _validation.alphanumericallyValid,
                                checkIfNameIsValid: checkIfNameIsValid
                            },
                            required: (0, _useTranslation2.default)("This field is mandatory"),
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }
                    })
                ),
                wp.element.createElement(
                    "div",
                    { className: "col-4" },
                    wp.element.createElement(_Label2.default, {
                        isRequired: true,
                        id: formId("type"),
                        label: (0, _useTranslation2.default)("Choose the field type")
                    }),
                    wp.element.createElement(_Select2.default, {
                        register: register,
                        id: formId("type"),
                        errors: errors,
                        defaultValue: field.type,
                        values: (0, _fields.fieldsList)(nestingLevel),
                        onChangeCapture: function onChangeCapture(e) {
                            handleFieldTypeChange(e.target.value);
                        }
                    })
                )
            ),
            wp.element.createElement(
                "div",
                { className: "container align-end" },
                wp.element.createElement(
                    "div",
                    { className: "col-6" },
                    wp.element.createElement(_Label2.default, {
                        id: formId("defaultValue"),
                        label: (0, _useTranslation2.default)("The default value for this field")
                    }),
                    wp.element.createElement(_Input2.default, {
                        id: formId("defaultValue"),
                        register: register,
                        errors: errors,
                        placeholder: (0, _useTranslation2.default)("Default value"),
                        defaultValue: field.defaultValue,
                        validate: {
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }
                    })
                ),
                wp.element.createElement(
                    "div",
                    { className: "col-6" },
                    wp.element.createElement(_Label2.default, {
                        id: formId("description"),
                        label: (0, _useTranslation2.default)("The description of this field (showed only on admin panel)")
                    }),
                    wp.element.createElement(_Input2.default, {
                        id: formId("description"),
                        register: register,
                        errors: errors,
                        placeholder: (0, _useTranslation2.default)("A brief description"),
                        defaultValue: field.description,
                        validate: {
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }
                    })
                )
            )
        ),
        (0, _fields.fieldHasOptions)(fieldType()) && wp.element.createElement(_MetaOptionList2.default, {
            boxId: boxId,
            fieldId: field.id,
            boxIndex: boxIndex,
            fieldIndex: fieldIndex,
            parentFieldId: field.parentId ? field.parentId : null,
            options: field.options ? field.options : [],
            isMulti: field.type === _fields.fieldTypes.SELECT_MULTI || field.type === _fields.fieldTypes.CHECKBOX
        })
    );
};

BasicTab.propTypes = {
    view: _propTypes2.default.oneOf(["list", "tabular"]).isRequired,
    formId: _propTypes2.default.func.isRequired,
    boxIndex: _propTypes2.default.number.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    boxId: _propTypes2.default.string.isRequired,
    field: _propTypes2.default.object.isRequired
};

exports.default = BasicTab;

/***/ }),

/***/ 8084:
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

var _sortable = __webpack_require__(9125);

var _utilities = __webpack_require__(4285);

var _InputHidden = __webpack_require__(5978);

var _InputHidden2 = _interopRequireDefault(_InputHidden);

var _MetaFieldHeader = __webpack_require__(8705);

var _MetaFieldHeader2 = _interopRequireDefault(_MetaFieldHeader);

var _Tabs = __webpack_require__(7222);

var _Tabs2 = _interopRequireDefault(_Tabs);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Tab = __webpack_require__(8360);

var _Tab2 = _interopRequireDefault(_Tab);

var _BasicTab = __webpack_require__(2429);

var _BasicTab2 = _interopRequireDefault(_BasicTab);

var _reactHookForm = __webpack_require__(930);

var _fields = __webpack_require__(5216);

var _reactRedux = __webpack_require__(6706);

var _react3 = __webpack_require__(4226);

var _react4 = __webpack_require__(8839);

var _LazyElement = __webpack_require__(5221);

var _LazyElement2 = _interopRequireDefault(_LazyElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaField = function MetaField(_ref) {
    var boxIndex = _ref.boxIndex,
        fieldIndex = _ref.fieldIndex,
        view = _ref.view,
        boxId = _ref.boxId,
        field = _ref.field,
        parentFieldIndex = _ref.parentFieldIndex,
        parentFieldId = _ref.parentFieldId,
        parentBlockId = _ref.parentBlockId,
        setActiveTab = _ref.setActiveTab;

    // DND-kit
    var _useSortable = (0, _sortable.useSortable)({ id: field.id }),
        attributes = _useSortable.attributes,
        listeners = _useSortable.listeners,
        setNodeRef = _useSortable.setNodeRef,
        transform = _useSortable.transform;

    var style = {
        transform: _utilities.CSS.Translate.toString(transform)
    };

    // auto-animate

    var _useAutoAnimate = (0, _react4.useAutoAnimate)(),
        _useAutoAnimate2 = _slicedToArray(_useAutoAnimate, 1),
        parent = _useAutoAnimate2[0];

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register,
        control = _useFormContext.control;

    // manage global state


    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group,
        closedElements = _useSelector.closedElements;

    /**
     *
     * @return {boolean}
     */


    var isClosed = function isClosed() {
        var filter = closedElements.filter(function (e) {
            return e === field.id;
        });

        return filter.length === 1;
    };

    /**
     *
     * @param value
     * @return {string}
     */
    var formId = function formId(value) {
        return (0, _fields.getFormId)(group.boxes, boxId, field.id) + "." + value;
    };

    var watchedFieldType = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("type")
    });

    return wp.element.createElement(_LazyElement2.default, {
        id: field.id,
        element: wp.element.createElement(
            "div",
            {
                id: field.id,
                className: "bg-white b-rounded p-24 " + (view === 'list' ? 'with-shadow' : ''),
                ref: view === 'list' ? setNodeRef : null,
                style: view === 'list' ? style : null
            },
            wp.element.createElement(_InputHidden2.default, {
                id: formId("id"),
                value: field.id,
                register: register
            }),
            wp.element.createElement(_InputHidden2.default, {
                id: formId("parentId"),
                value: parentFieldId ? parentFieldId : '',
                register: register
            }),
            wp.element.createElement(_InputHidden2.default, {
                id: formId("blockId"),
                value: parentBlockId ? parentBlockId : '',
                register: register
            }),
            wp.element.createElement(
                "div",
                { className: view === 'tabular' || !isClosed() && view === 'list' ? 'mb-24' : '' },
                wp.element.createElement(_MetaFieldHeader2.default, {
                    setActiveTab: setActiveTab,
                    boxIndex: boxIndex,
                    fieldIndex: fieldIndex,
                    parentFieldId: parentFieldId,
                    parentBlockId: parentBlockId,
                    formId: formId,
                    attributes: view === 'list' ? attributes : null,
                    listeners: view === 'list' ? listeners : null,
                    boxId: boxId,
                    field: field,
                    view: view
                })
            ),
            wp.element.createElement(
                "div",
                { ref: parent },
                wp.element.createElement(
                    "div",
                    { className: "" + (view === 'list' && isClosed() ? 'hidden' : '') },
                    wp.element.createElement(_BasicTab2.default, {
                        view: view,
                        boxIndex: boxIndex,
                        fieldIndex: fieldIndex,
                        formId: formId,
                        boxId: boxId,
                        field: field
                    })
                )
            )
        )
    });
};

MetaField.propTypes = {
    boxIndex: _propTypes2.default.number.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    view: _propTypes2.default.oneOf(["list", "tabular"]).isRequired,
    boxId: _propTypes2.default.string.isRequired,
    field: _propTypes2.default.object.isRequired,
    parentFieldIndex: _propTypes2.default.string,
    parentFieldId: _propTypes2.default.string,
    parentBlockId: _propTypes2.default.string,
    setActiveTab: _propTypes2.default.func
};

exports.default = MetaField;

/***/ }),

/***/ 4177:
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

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _objects = __webpack_require__(4040);

var _InputHidden = __webpack_require__(5978);

var _InputHidden2 = _interopRequireDefault(_InputHidden);

var _reactRedux = __webpack_require__(6706);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaGroupHeader = function MetaGroupHeader(_ref) {
    var groupId = _ref.groupId,
        settingsVisible = _ref.settingsVisible,
        setSettingsVisible = _ref.setSettingsVisible;

    // manage form state
    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register,
        errors = _useFormContext.formState.errors,
        control = _useFormContext.control;

    var watchedName = (0, _reactHookForm.useWatch)({
        control: control,
        name: "name"
    });
    var watchedLabel = (0, _reactHookForm.useWatch)({
        control: control,
        name: "label"
    });

    // manage global state

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    /**
     *
     * @return {string|*}
     */


    var name = function name() {

        if (errors && errors['name']) {
            return wp.element.createElement(
                'span',
                { className: 'invalid-feedback' },
                (0, _useTranslation2.default)("Group name error(s). Please fix it.")
            );
        }

        if (errors && errors['belongs']) {
            return wp.element.createElement(
                'span',
                { className: 'invalid-feedback' },
                (0, _useTranslation2.default)("Location rules error(s). Please fix it.")
            );
        }

        if (watchedName) {
            return wp.element.createElement(
                'span',
                null,
                watchedName
            );
        }

        return wp.element.createElement(
            'span',
            null,
            !(0, _objects.isEmpty)(group) ? group.name : "group_name"
        );
    };

    /**
     *
     * @return {null|*}
     */
    var label = function label() {

        if (watchedLabel) {
            return wp.element.createElement(
                'span',
                { className: 'color-gray' },
                watchedLabel
            );
        }

        if (!(0, _objects.isEmpty)(group) && group.label) {
            return wp.element.createElement(
                'span',
                { className: 'color-gray' },
                group.label
            );
        }

        return (0, _useTranslation2.default)("Group name");
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(_InputHidden2.default, {
            id: 'id',
            value: groupId,
            register: register
        }),
        wp.element.createElement(
            'div',
            { className: 'i-flex-center s-8' },
            wp.element.createElement(
                'h3',
                null,
                name()
            ),
            label() && wp.element.createElement(
                'span',
                { className: 'top-1' },
                label()
            ),
            wp.element.createElement(
                'a',
                {
                    href: '#',
                    onClick: function onClick(e) {
                        e.preventDefault();
                        setSettingsVisible(!settingsVisible);
                    }
                },
                (0, _useTranslation2.default)(settingsVisible ? "Close settings" : "Open settings")
            )
        )
    );
};

MetaGroupHeader.propTypes = {
    groupId: _propTypes2.default.string.isRequired,
    settingsVisible: _propTypes2.default.bool.isRequired,
    setSettingsVisible: _propTypes2.default.func.isRequired
};

exports.default = MetaGroupHeader;

/***/ }),

/***/ 9190:
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

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _Label = __webpack_require__(7115);

var _Label2 = _interopRequireDefault(_Label);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _objects = __webpack_require__(4040);

var _validation = __webpack_require__(9593);

var _transliteration = __webpack_require__(3659);

var _BelongConditions = __webpack_require__(3473);

var _BelongConditions2 = _interopRequireDefault(_BelongConditions);

var _uuid = __webpack_require__(1614);

var _metaStateSlice = __webpack_require__(6836);

var _Select = __webpack_require__(4003);

var _Select2 = _interopRequireDefault(_Select);

var _fields = __webpack_require__(857);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaGroupSettings = function MetaGroupSettings(_ref) {
    var groupId = _ref.groupId;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    var findBelongsValues = globals.find;

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control,
        register = _useFormContext.register,
        unregister = _useFormContext.unregister,
        errors = _useFormContext.formState.errors,
        setValue = _useFormContext.setValue,
        resetField = _useFormContext.resetField,
        clearErrors = _useFormContext.clearErrors;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: "belongs"
    }),
        append = _useFieldArray.append,
        remove = _useFieldArray.remove;

    var handleAddBelong = function handleAddBelong() {
        var newBelong = {
            id: (0, _uuid.v4)(),
            belongsTo: null,
            operator: "=",
            find: null,
            logic: null
        };

        dispatch((0, _metaStateSlice.addBelong)({ belong: newBelong }));
    };

    var handleDeleteBelong = function handleDeleteBelong(index, id) {
        dispatch((0, _metaStateSlice.deleteBelong)({ belongId: id }));
        remove(index);
    };

    // mange local state

    var _useState = (0, _react.useState)(true),
        _useState2 = _slicedToArray(_useState, 2),
        autoSlug = _useState2[0],
        setAutoSlug = _useState2[1];

    /**
     *
     * @return {*}
     */


    var groupLabel = function groupLabel() {
        return wp.element.createElement(
            'div',
            { className: 'flex-between s-8' },
            wp.element.createElement(
                'span',
                null,
                (0, _useTranslation2.default)("Group label")
            ),
            wp.element.createElement(
                'a',
                {
                    href: '#',
                    onClick: function onClick(e) {
                        e.preventDefault();
                        setAutoSlug(!autoSlug);
                    }
                },
                (0, _useTranslation2.default)('' + (autoSlug ? 'Auto slug ON' : 'Auto slug OFF'))
            )
        );
    };

    /**
     *
     * @return {[{label: *, value: string}, {label: *, value: string}, {label: *, value: string}, {label: *, value: string}]}
     */
    var displayOptions = function displayOptions() {
        return [{
            label: (0, _useTranslation2.default)("Standard view"),
            value: _fields.fieldGroupsDisplay.STANDARD
        }, {
            label: (0, _useTranslation2.default)("Accordion"),
            value: _fields.fieldGroupsDisplay.ACCORDION
        }, {
            label: (0, _useTranslation2.default)("Horizontal tabs"),
            value: _fields.fieldGroupsDisplay.HORIZONTAL_TABS
        }, {
            label: (0, _useTranslation2.default)("Vertical tabs"),
            value: _fields.fieldGroupsDisplay.VERTICAL_TABS
        }];
    };

    return wp.element.createElement(
        'div',
        { className: 'mb-24 bg-white with-shadow p-24' },
        wp.element.createElement(
            'div',
            { className: 'flex-column s-24' },
            wp.element.createElement(
                'div',
                { className: 'container' },
                wp.element.createElement(
                    'div',
                    { className: 'col-4' },
                    wp.element.createElement(_Label2.default, { id: 'label', label: groupLabel() }),
                    wp.element.createElement(_Input2.default, {
                        id: 'label',
                        register: register,
                        placeholder: (0, _useTranslation2.default)("Group label"),
                        defaultValue: !(0, _objects.isEmpty)(group) ? group.label : null,
                        errors: errors,
                        onChangeCapture: function onChangeCapture(e) {
                            if (autoSlug) {
                                setValue("name", (0, _transliteration.slugify)((0, _transliteration.transliterate)(e.target.value)));
                            }
                        },
                        onClick: function onClick(e) {
                            if (e.target.value === 'group name') {
                                resetField("label");
                            }
                        },
                        validate: {
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }
                    })
                ),
                wp.element.createElement(
                    'div',
                    { className: 'col-4' },
                    wp.element.createElement(_Label2.default, {
                        id: 'name',
                        label: (0, _useTranslation2.default)("Group name")
                    }),
                    wp.element.createElement(_Input2.default, {
                        id: 'name',
                        register: register,
                        placeholder: (0, _useTranslation2.default)("Group name"),
                        defaultValue: !(0, _objects.isEmpty)(group) ? group.name : "group_name",
                        errors: errors,
                        isRequired: true,
                        validate: {
                            validate: _validation.alphanumericallyValid,
                            required: (0, _useTranslation2.default)("This field is mandatory"),
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        }
                    })
                ),
                wp.element.createElement(
                    'div',
                    { className: 'col-4' },
                    wp.element.createElement(_Label2.default, {
                        id: 'display',
                        label: (0, _useTranslation2.default)("Display as")
                    }),
                    wp.element.createElement(_Select2.default, {
                        id: 'display',
                        register: register,
                        errors: errors,
                        values: displayOptions(),
                        defaultValue: !(0, _objects.isEmpty)(group) && group.display ? group.display : _fields.fieldGroupsDisplay.STANDARD
                    })
                )
            ),
            wp.element.createElement(
                'fieldset',
                { className: 'acpt-fieldset' },
                wp.element.createElement(
                    'legend',
                    null,
                    (0, _useTranslation2.default)("Location")
                ),
                wp.element.createElement(_BelongConditions2.default, {
                    id: 'belongs',
                    values: findBelongsValues,
                    conditions: group.belongs ? group.belongs : [],
                    append: append,
                    register: register,
                    unregister: unregister,
                    remove: remove,
                    errors: errors,
                    control: control,
                    handleAddBelong: handleAddBelong,
                    handleDeleteBelong: handleDeleteBelong,
                    resetField: resetField,
                    setValue: setValue,
                    clearErrors: clearErrors
                })
            )
        )
    );
};

MetaGroupSettings.propTypes = {
    groupId: _propTypes2.default.string.isRequired
};

exports.default = MetaGroupSettings;

/***/ }),

/***/ 6738:
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

var _ajax = __webpack_require__(7569);

var _reactHotToast = __webpack_require__(4500);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _misc = __webpack_require__(3154);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CopyMetaBlocksModal = function CopyMetaBlocksModal(_ref) {
    var blockIds = _ref.blockIds,
        modalOpen = _ref.modalOpen,
        setModalOpen = _ref.setModalOpen;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    // mange local state

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        group = _useState2[0],
        setGroup = _useState2[1];

    var _useState3 = (0, _react.useState)([]),
        _useState4 = _slicedToArray(_useState3, 2),
        boxes = _useState4[0],
        setBoxes = _useState4[1];

    var _useState5 = (0, _react.useState)([]),
        _useState6 = _slicedToArray(_useState5, 2),
        fields = _useState6[0],
        setFields = _useState6[1];

    var _useState7 = (0, _react.useState)(null),
        _useState8 = _slicedToArray(_useState7, 2),
        targetFieldId = _useState8[0],
        setTargetFieldId = _useState8[1];

    var _useState9 = (0, _react.useState)(false),
        _useState10 = _slicedToArray(_useState9, 2),
        deleteBlocks = _useState10[0],
        setDeleteBlocks = _useState10[1];

    // reset state on open modal


    (0, _react.useEffect)(function () {
        setGroup(null);
        setBoxes([]);
        setFields([]);
        setTargetFieldId(null);
        setDeleteBlocks(false);
    }, [modalOpen]);

    var handleGroupChange = function handleGroupChange(groupId) {
        setGroup(groupId);
        setBoxes([]);
        setFields([]);
        setTargetFieldId(null);
        setDeleteBlocks(false);

        (0, _ajax.wpAjaxRequest)('fetchMetaAction', {
            id: groupId
        }).then(function (res) {
            setBoxes(res.boxes);
        }).catch(function (err) {
            return console.err(err);
        });
    };

    var handleBoxChange = function handleBoxChange(boxId) {
        setFields([]);
        var filteredFields = boxes.filter(function (b) {
            return b.id === boxId;
        })[0].fields;
        setFields(filteredFields);
    };

    var handleFieldChange = function handleFieldChange(fieldId) {
        setTargetFieldId(fieldId);
    };

    var handleSubmit = function handleSubmit() {

        var blockIdsArray = [];
        blockIds.map(function (b) {
            blockIdsArray.push(b.id);
        });

        (0, _ajax.wpAjaxRequest)('copyMetaBlocksAction', {
            blockIds: blockIdsArray,
            targetFieldId: targetFieldId,
            delete: deleteBlocks
        }).then(function (res) {
            if (res.success) {
                _reactHotToast.toast.success((0, _useTranslation2.default)("Meta block was successfully copied") + "." + (0, _useTranslation2.default)("The browser will refresh after 5 seconds."));
                setModalOpen(!modalOpen);
                (0, _misc.refreshPage)(5000);
            } else {
                _reactHotToast.toast.error(res.error);
            }
        }).catch(function (err) {
            return console.err(err);
        });
    };

    return wp.element.createElement(
        _Modal2.default,
        {
            title: (0, _useTranslation2.default)('Copy selected meta blocks'),
            visible: modalOpen,
            buttons: []
        },
        wp.element.createElement(
            "div",
            { className: "flex-column s-24" },
            wp.element.createElement(
                "div",
                null,
                wp.element.createElement(
                    "label",
                    {
                        className: "form-label i-flex-center s-4",
                        htmlFor: "group"
                    },
                    (0, _useTranslation2.default)("Meta group")
                ),
                wp.element.createElement(
                    "div",
                    { className: "acpt-select" },
                    wp.element.createElement(
                        "select",
                        {
                            id: "group",
                            className: "form-control default",
                            onChangeCapture: function onChangeCapture(e) {
                                return handleGroupChange(e.target.value);
                            }
                        },
                        globals.find.meta.map(function (g) {
                            return wp.element.createElement(
                                "option",
                                { value: g.value },
                                g.label
                            );
                        })
                    )
                )
            ),
            boxes && boxes.length > 0 && wp.element.createElement(
                "div",
                null,
                wp.element.createElement(
                    "label",
                    {
                        className: "form-label i-flex-center s-4",
                        htmlFor: "box"
                    },
                    (0, _useTranslation2.default)("Meta box")
                ),
                wp.element.createElement(
                    "div",
                    { className: "acpt-select" },
                    wp.element.createElement(
                        "select",
                        {
                            id: "box",
                            className: "form-control default",
                            onChangeCapture: function onChangeCapture(e) {
                                return handleBoxChange(e.target.value);
                            }
                        },
                        wp.element.createElement(
                            "option",
                            { value: null },
                            (0, _useTranslation2.default)("Select")
                        ),
                        boxes.map(function (b) {
                            return wp.element.createElement(
                                "option",
                                { value: b.id },
                                b.name
                            );
                        })
                    )
                )
            ),
            fields.length > 0 && wp.element.createElement(
                "div",
                null,
                wp.element.createElement(
                    "label",
                    {
                        className: "form-label i-flex-center s-4",
                        htmlFor: "field"
                    },
                    (0, _useTranslation2.default)("Meta field")
                ),
                wp.element.createElement(
                    "div",
                    { className: "acpt-select" },
                    wp.element.createElement(
                        "select",
                        {
                            id: "field",
                            className: "form-control default",
                            onChangeCapture: function onChangeCapture(e) {
                                return handleFieldChange(e.target.value);
                            }
                        },
                        wp.element.createElement(
                            "option",
                            { value: null },
                            (0, _useTranslation2.default)("Select")
                        ),
                        fields.map(function (f) {
                            return wp.element.createElement(
                                "option",
                                { value: f.id },
                                f.name
                            );
                        })
                    )
                )
            ),
            targetFieldId && wp.element.createElement(
                "div",
                null,
                wp.element.createElement(
                    "div",
                    { className: "w-100 i-flex-center s-4 mb-8" },
                    wp.element.createElement("input", { type: "checkbox", defaultValue: deleteBlocks, onClick: function onClick() {
                            return setDeleteBlocks(!deleteBlocks);
                        }, id: "deleteBlocks" }),
                    wp.element.createElement(
                        "label",
                        { htmlFor: "deleteBlocks" },
                        (0, _useTranslation2.default)("Delete the meta block after copying")
                    )
                ),
                wp.element.createElement(
                    _Button2.default,
                    {
                        onClick: function onClick() {
                            return handleSubmit();
                        },
                        style: _styles.styleVariants.PRIMARY
                    },
                    (0, _useTranslation2.default)("Copy")
                )
            )
        )
    );
};

CopyMetaBlocksModal.propTypes = {
    blockIds: _propTypes2.default.array.isRequired,
    modalOpen: _propTypes2.default.bool.isRequired,
    setModalOpen: _propTypes2.default.func.isRequired
};

exports.default = CopyMetaBlocksModal;

/***/ }),

/***/ 5587:
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

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _react3 = __webpack_require__(4226);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _ajax = __webpack_require__(7569);

var _reactHotToast = __webpack_require__(4500);

var _misc = __webpack_require__(3154);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CopyMetaBoxModal = function CopyMetaBoxModal(_ref) {
    var box = _ref.box;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    // manage local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    var _useState3 = (0, _react.useState)(null),
        _useState4 = _slicedToArray(_useState3, 2),
        group = _useState4[0],
        setGroup = _useState4[1];

    var _useState5 = (0, _react.useState)(false),
        _useState6 = _slicedToArray(_useState5, 2),
        deleteBox = _useState6[0],
        setDeleteBox = _useState6[1];

    // reset state on open modal


    (0, _react.useEffect)(function () {
        setGroup(null);
        setDeleteBox(false);
    }, [modalOpen]);

    var handleSubmit = function handleSubmit() {
        (0, _ajax.wpAjaxRequest)('copyMetaBoxAction', {
            boxId: box.id,
            targetGroupId: group,
            delete: deleteBox
        }).then(function (res) {
            if (res.success) {
                _reactHotToast.toast.success((0, _useTranslation2.default)("Meta box was successfully copied") + "." + (0, _useTranslation2.default)("The browser will refresh after 5 seconds."));
                setModalOpen(!modalOpen);
                (0, _misc.refreshPage)(5000);
            } else {
                _reactHotToast.toast.error(res.error);
            }
        }).catch(function (err) {
            return console.err(err);
        });
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)('Copy this meta box'),
                visible: modalOpen,
                buttons: []
            },
            wp.element.createElement(
                "div",
                { className: "flex-column s-24" },
                wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "label",
                        {
                            className: "form-label i-flex-center s-4",
                            htmlFor: "group"
                        },
                        (0, _useTranslation2.default)("Meta group")
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-select" },
                        wp.element.createElement(
                            "select",
                            {
                                id: "group",
                                className: "form-control default",
                                onChangeCapture: function onChangeCapture(e) {
                                    return setGroup(e.target.value);
                                }
                            },
                            globals.find.meta.map(function (g) {
                                return wp.element.createElement(
                                    "option",
                                    { value: g.value },
                                    g.label
                                );
                            })
                        )
                    )
                ),
                group && group !== 'Select' && wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "div",
                        { className: "w-100 i-flex-center s-4 mb-8" },
                        wp.element.createElement("input", { type: "checkbox", defaultValue: deleteBox, onClick: function onClick() {
                                return setDeleteBox(!deleteBox);
                            }, id: "deleteBox" }),
                        wp.element.createElement(
                            "label",
                            { htmlFor: "deleteBox" },
                            (0, _useTranslation2.default)("Delete the meta box after copying")
                        )
                    ),
                    wp.element.createElement(
                        _Button2.default,
                        {
                            onClick: function onClick() {
                                return handleSubmit();
                            },
                            style: _styles.styleVariants.PRIMARY
                        },
                        (0, _useTranslation2.default)("Copy")
                    )
                )
            )
        ),
        wp.element.createElement(
            "a",
            {
                href: "",
                onClick: function onClick(e) {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }
            },
            wp.element.createElement(_react3.Icon, { icon: "bx:copy", width: 18 })
        )
    );
};

CopyMetaBoxModal.propTypes = {
    box: _propTypes2.default.object.isRequired
};

exports.default = CopyMetaBoxModal;

/***/ }),

/***/ 8478:
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

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _reactRedux = __webpack_require__(6706);

var _metaStateSlice = __webpack_require__(6836);

var _ajax = __webpack_require__(7569);

var _reactHotToast = __webpack_require__(4500);

var _misc = __webpack_require__(3154);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CopyMetaBoxesModal = function CopyMetaBoxesModal(_ref) {
    var boxIds = _ref.boxIds,
        modalOpen = _ref.modalOpen,
        setModalOpen = _ref.setModalOpen;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        group = _useState2[0],
        setGroup = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = _slicedToArray(_useState3, 2),
        deleteBoxes = _useState4[0],
        setDeleteBoxes = _useState4[1];

    var handleSubmit = function handleSubmit() {

        var boxIdsArray = [];
        boxIds.map(function (b) {
            boxIdsArray.push(b.id);
        });

        (0, _ajax.wpAjaxRequest)('copyMetaBoxesAction', {
            boxIds: boxIdsArray,
            targetGroupId: group,
            delete: deleteBoxes
        }).then(function (res) {
            if (res.success) {
                _reactHotToast.toast.success((0, _useTranslation2.default)("Meta box was successfully copied") + "." + (0, _useTranslation2.default)("The browser will refresh after 5 seconds."));
                setModalOpen(!modalOpen);
                dispatch((0, _metaStateSlice.deselectAllElements)());
                (0, _misc.refreshPage)(5000);
            } else {
                _reactHotToast.toast.error(res.error);
            }
        }).catch(function (err) {
            return console.err(err);
        });
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)('Copy selected meta boxes'),
                visible: modalOpen,
                buttons: []
            },
            wp.element.createElement(
                "div",
                { className: "flex-column s-24" },
                wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "label",
                        {
                            className: "form-label i-flex-center s-4",
                            htmlFor: "group"
                        },
                        (0, _useTranslation2.default)("Meta group")
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-select" },
                        wp.element.createElement(
                            "select",
                            {
                                id: "group",
                                className: "form-control default",
                                onChangeCapture: function onChangeCapture(e) {
                                    return setGroup(e.target.value);
                                }
                            },
                            globals.find.meta.map(function (g) {
                                return wp.element.createElement(
                                    "option",
                                    { value: g.value },
                                    g.label
                                );
                            })
                        )
                    )
                ),
                group && group !== 'Select' && wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "div",
                        { className: "w-100 i-flex-center s-4 mb-8" },
                        wp.element.createElement("input", { type: "checkbox", defaultValue: deleteBoxes, onClick: function onClick() {
                                return setDeleteBoxes(!deleteBoxes);
                            }, id: "deleteBoxes" }),
                        wp.element.createElement(
                            "label",
                            { htmlFor: "deleteBoxes" },
                            (0, _useTranslation2.default)("Delete after copying")
                        )
                    ),
                    wp.element.createElement(
                        _Button2.default,
                        {
                            onClick: function onClick() {
                                return handleSubmit();
                            },
                            style: _styles.styleVariants.PRIMARY
                        },
                        (0, _useTranslation2.default)("Copy")
                    )
                )
            )
        )
    );
};

CopyMetaBoxesModal.propTypes = {
    boxIds: _propTypes2.default.array.isRequired,
    modalOpen: _propTypes2.default.bool.isRequired,
    setModalOpen: _propTypes2.default.func.isRequired
};

exports.default = CopyMetaBoxesModal;

/***/ }),

/***/ 889:
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

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _react3 = __webpack_require__(4226);

var _ajax = __webpack_require__(7569);

var _reactHotToast = __webpack_require__(4500);

var _misc = __webpack_require__(3154);

var _styles = __webpack_require__(624);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _fields = __webpack_require__(857);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CopyMetaFieldModal = function CopyMetaFieldModal(_ref) {
    var field = _ref.field;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    // mange local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    var _useState3 = (0, _react.useState)(null),
        _useState4 = _slicedToArray(_useState3, 2),
        group = _useState4[0],
        setGroup = _useState4[1];

    var _useState5 = (0, _react.useState)([]),
        _useState6 = _slicedToArray(_useState5, 2),
        boxes = _useState6[0],
        setBoxes = _useState6[1];

    var _useState7 = (0, _react.useState)([]),
        _useState8 = _slicedToArray(_useState7, 2),
        fields = _useState8[0],
        setFields = _useState8[1];

    var _useState9 = (0, _react.useState)(null),
        _useState10 = _slicedToArray(_useState9, 2),
        targetEntityType = _useState10[0],
        setTargetEntityType = _useState10[1];

    var _useState11 = (0, _react.useState)(null),
        _useState12 = _slicedToArray(_useState11, 2),
        targetEntityId = _useState12[0],
        setTargetEntityId = _useState12[1];

    var _useState13 = (0, _react.useState)(false),
        _useState14 = _slicedToArray(_useState13, 2),
        deleteField = _useState14[0],
        setDeleteField = _useState14[1];

    // reset state on open modal


    (0, _react.useEffect)(function () {
        setGroup(null);
        setBoxes([]);
        setFields([]);
        setTargetEntityType(null);
        setTargetEntityId(null);
        setDeleteField(false);
    }, [modalOpen]);

    var handleGroupChange = function handleGroupChange(groupId) {
        setGroup(groupId);
        setBoxes([]);
        setFields([]);
        setTargetEntityType(null);
        setTargetEntityId(null);
        setDeleteField(false);

        (0, _ajax.wpAjaxRequest)('fetchMetaAction', {
            id: groupId
        }).then(function (res) {
            setBoxes(res.boxes);
        }).catch(function (err) {
            return console.err(err);
        });
    };

    var handleBoxChange = function handleBoxChange(boxId) {

        setFields([]);
        setTargetEntityType("box");
        setTargetEntityId(boxId);

        var filteredFields = boxes.filter(function (b) {
            return b.id === boxId;
        })[0].fields;

        if (filteredFields.length > 0) {
            var nestableFields = filteredFields.filter(function (f) {
                return f.type === _fields.fieldTypes.REPEATER || f.type === _fields.fieldTypes.FLEXIBLE;
            });

            if (nestableFields.length > 0) {
                setFields(nestableFields);
            }
        }
    };

    var handleFieldChange = function handleFieldChange(fieldId) {
        setTargetEntityType("field");
        setTargetEntityId(fieldId);
    };

    var handleSubmit = function handleSubmit() {
        (0, _ajax.wpAjaxRequest)('copyMetaFieldAction', {
            fieldId: field.id,
            targetEntityType: targetEntityType,
            targetEntityId: targetEntityId,
            delete: deleteField
        }).then(function (res) {
            if (res.success) {
                _reactHotToast.toast.success((0, _useTranslation2.default)("Meta field was successfully copied") + "." + (0, _useTranslation2.default)("The browser will refresh after 5 seconds."));
                setModalOpen(!modalOpen);
                (0, _misc.refreshPage)(5000);
            } else {
                _reactHotToast.toast.error(res.error);
            }
        }).catch(function (err) {
            return console.err(err);
        });
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)('Copy this meta field'),
                visible: modalOpen,
                buttons: []
            },
            wp.element.createElement(
                "div",
                { className: "flex-column s-24" },
                wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "label",
                        {
                            className: "form-label i-flex-center s-4",
                            htmlFor: "group"
                        },
                        (0, _useTranslation2.default)("Meta group")
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-select" },
                        wp.element.createElement(
                            "select",
                            {
                                id: "group",
                                className: "form-control default",
                                onChangeCapture: function onChangeCapture(e) {
                                    return handleGroupChange(e.target.value);
                                }
                            },
                            globals.find.meta.map(function (g) {
                                return wp.element.createElement(
                                    "option",
                                    { value: g.value },
                                    g.label
                                );
                            })
                        )
                    )
                ),
                boxes && boxes.length > 0 && wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "label",
                        {
                            className: "form-label i-flex-center s-4",
                            htmlFor: "box"
                        },
                        (0, _useTranslation2.default)("Meta box")
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-select" },
                        wp.element.createElement(
                            "select",
                            {
                                id: "box",
                                className: "form-control default",
                                onChangeCapture: function onChangeCapture(e) {
                                    return handleBoxChange(e.target.value);
                                }
                            },
                            wp.element.createElement(
                                "option",
                                { value: null },
                                (0, _useTranslation2.default)("Select")
                            ),
                            boxes.map(function (b) {
                                return wp.element.createElement(
                                    "option",
                                    { value: b.id },
                                    b.name
                                );
                            })
                        )
                    )
                ),
                fields.length > 0 && wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "label",
                        {
                            className: "form-label i-flex-center s-4",
                            htmlFor: "field"
                        },
                        (0, _useTranslation2.default)("Meta field")
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-select" },
                        wp.element.createElement(
                            "select",
                            {
                                id: "field",
                                className: "form-control default",
                                onChangeCapture: function onChangeCapture(e) {
                                    return handleFieldChange(e.target.value);
                                }
                            },
                            wp.element.createElement(
                                "option",
                                { value: null },
                                (0, _useTranslation2.default)("Select")
                            ),
                            fields.map(function (f) {
                                return wp.element.createElement(
                                    "option",
                                    { value: f.id },
                                    f.name
                                );
                            })
                        )
                    )
                ),
                targetEntityType && targetEntityId && wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "div",
                        { className: "w-100 i-flex-center s-4 mb-8" },
                        wp.element.createElement("input", { type: "checkbox", defaultValue: deleteField, onClick: function onClick() {
                                return setDeleteField(!deleteField);
                            }, id: "deleteField" }),
                        wp.element.createElement(
                            "label",
                            { htmlFor: "deleteField" },
                            (0, _useTranslation2.default)("Delete the meta field after copying")
                        )
                    ),
                    wp.element.createElement(
                        _Button2.default,
                        {
                            onClick: function onClick() {
                                return handleSubmit();
                            },
                            style: _styles.styleVariants.PRIMARY
                        },
                        (0, _useTranslation2.default)("Copy")
                    )
                )
            )
        ),
        wp.element.createElement(
            "a",
            {
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }
            },
            wp.element.createElement(_react3.Icon, { icon: "bx:copy", width: 18 })
        )
    );
};

CopyMetaFieldModal.propTypes = {
    field: _propTypes2.default.object.isRequired
};

exports.default = CopyMetaFieldModal;

/***/ }),

/***/ 2417:
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

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _reactRedux = __webpack_require__(6706);

var _ajax = __webpack_require__(7569);

var _fields = __webpack_require__(857);

var _reactHotToast = __webpack_require__(4500);

var _misc = __webpack_require__(3154);

var _metaStateSlice = __webpack_require__(6836);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CopyMetaFieldsModal = function CopyMetaFieldsModal(_ref) {
    var fieldIds = _ref.fieldIds,
        modalOpen = _ref.modalOpen,
        setModalOpen = _ref.setModalOpen;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // mange local state

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        group = _useState2[0],
        setGroup = _useState2[1];

    var _useState3 = (0, _react.useState)([]),
        _useState4 = _slicedToArray(_useState3, 2),
        boxes = _useState4[0],
        setBoxes = _useState4[1];

    var _useState5 = (0, _react.useState)([]),
        _useState6 = _slicedToArray(_useState5, 2),
        fields = _useState6[0],
        setFields = _useState6[1];

    var _useState7 = (0, _react.useState)(null),
        _useState8 = _slicedToArray(_useState7, 2),
        targetEntityType = _useState8[0],
        setTargetEntityType = _useState8[1];

    var _useState9 = (0, _react.useState)(null),
        _useState10 = _slicedToArray(_useState9, 2),
        targetEntityId = _useState10[0],
        setTargetEntityId = _useState10[1];

    var _useState11 = (0, _react.useState)(false),
        _useState12 = _slicedToArray(_useState11, 2),
        deleteFields = _useState12[0],
        setDeleteFields = _useState12[1];

    // reset state on open modal


    (0, _react.useEffect)(function () {
        setGroup(null);
        setBoxes([]);
        setFields([]);
        setTargetEntityType(null);
        setTargetEntityId(null);
        setDeleteFields(false);
    }, [modalOpen]);

    var handleGroupChange = function handleGroupChange(groupId) {
        setGroup(groupId);
        setBoxes([]);
        setFields([]);
        setTargetEntityType(null);
        setTargetEntityId(null);
        setDeleteFields(false);

        (0, _ajax.wpAjaxRequest)('fetchMetaAction', {
            id: groupId
        }).then(function (res) {
            setBoxes(res.boxes);
        }).catch(function (err) {
            return console.err(err);
        });
    };

    var handleBoxChange = function handleBoxChange(boxId) {

        setFields([]);
        setTargetEntityType("box");
        setTargetEntityId(boxId);

        var filteredFields = boxes.filter(function (b) {
            return b.id === boxId;
        })[0].fields;

        if (filteredFields.length > 0) {
            var nestableFields = filteredFields.filter(function (f) {
                return f.type === _fields.fieldTypes.REPEATER || f.type === _fields.fieldTypes.FLEXIBLE;
            });

            if (nestableFields.length > 0) {
                setFields(nestableFields);
            }
        }
    };

    var handleFieldChange = function handleFieldChange(fieldId) {
        setTargetEntityType("field");
        setTargetEntityId(fieldId);
    };

    var handleSubmit = function handleSubmit() {

        var fieldIdsArray = [];
        fieldIds.map(function (f) {
            fieldIdsArray.push(f.id);
        });

        (0, _ajax.wpAjaxRequest)('copyMetaFieldsAction', {
            fieldIds: fieldIdsArray,
            targetEntityType: targetEntityType,
            targetEntityId: targetEntityId,
            delete: deleteFields
        }).then(function (res) {
            if (res.success) {
                _reactHotToast.toast.success((0, _useTranslation2.default)("Meta field was successfully copied") + "." + (0, _useTranslation2.default)("The browser will refresh after 5 seconds."));
                setModalOpen(!modalOpen);
                dispatch((0, _metaStateSlice.deselectAllElements)());
                (0, _misc.refreshPage)(5000);
            } else {
                _reactHotToast.toast.error(res.error);
            }
        }).catch(function (err) {
            return console.err(err);
        });
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)('Copy selected meta fields'),
                visible: modalOpen,
                buttons: []
            },
            wp.element.createElement(
                "div",
                { className: "flex-column s-24" },
                wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "label",
                        {
                            className: "form-label i-flex-center s-4",
                            htmlFor: "group"
                        },
                        (0, _useTranslation2.default)("Meta group")
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-select" },
                        wp.element.createElement(
                            "select",
                            {
                                id: "group",
                                className: "form-control default",
                                onChangeCapture: function onChangeCapture(e) {
                                    return handleGroupChange(e.target.value);
                                }
                            },
                            globals.find.meta.map(function (g) {
                                return wp.element.createElement(
                                    "option",
                                    { value: g.value },
                                    g.label
                                );
                            })
                        )
                    )
                ),
                boxes.length > 0 && wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "label",
                        {
                            className: "form-label i-flex-center s-4",
                            htmlFor: "box"
                        },
                        (0, _useTranslation2.default)("Meta box")
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-select" },
                        wp.element.createElement(
                            "select",
                            {
                                id: "box",
                                className: "form-control default",
                                onChangeCapture: function onChangeCapture(e) {
                                    return handleBoxChange(e.target.value);
                                }
                            },
                            wp.element.createElement(
                                "option",
                                { value: null },
                                (0, _useTranslation2.default)("Select")
                            ),
                            boxes.map(function (b) {
                                return wp.element.createElement(
                                    "option",
                                    { value: b.id },
                                    b.name
                                );
                            })
                        )
                    )
                ),
                fields.length > 0 && wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "label",
                        {
                            className: "form-label i-flex-center s-4",
                            htmlFor: "field"
                        },
                        (0, _useTranslation2.default)("Meta field")
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-select" },
                        wp.element.createElement(
                            "select",
                            {
                                id: "field",
                                className: "form-control default",
                                onChangeCapture: function onChangeCapture(e) {
                                    return handleFieldChange(e.target.value);
                                }
                            },
                            wp.element.createElement(
                                "option",
                                { value: null },
                                (0, _useTranslation2.default)("Select")
                            ),
                            fields.map(function (f) {
                                return wp.element.createElement(
                                    "option",
                                    { value: f.id },
                                    f.name
                                );
                            })
                        )
                    )
                ),
                targetEntityType && targetEntityId && wp.element.createElement(
                    "div",
                    null,
                    wp.element.createElement(
                        "div",
                        { className: "w-100 i-flex-center s-4 mb-8" },
                        wp.element.createElement("input", { type: "checkbox", defaultValue: deleteFields, onClick: function onClick() {
                                return setDeleteFields(!deleteFields);
                            }, id: "deleteFields" }),
                        wp.element.createElement(
                            "label",
                            { htmlFor: "deleteFields" },
                            (0, _useTranslation2.default)("Delete the meta field after copying")
                        )
                    ),
                    wp.element.createElement(
                        _Button2.default,
                        {
                            onClick: function onClick() {
                                return handleSubmit();
                            },
                            style: _styles.styleVariants.PRIMARY
                        },
                        (0, _useTranslation2.default)("Copy")
                    )
                )
            )
        )
    );
};

CopyMetaFieldsModal.propTypes = {
    fieldIds: _propTypes2.default.array.isRequired,
    modalOpen: _propTypes2.default.bool.isRequired,
    setModalOpen: _propTypes2.default.func.isRequired
};

exports.default = CopyMetaFieldsModal;

/***/ }),

/***/ 4422:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _reactRedux = __webpack_require__(6706);

var _metaStateSlice = __webpack_require__(6836);

var _reactHookForm = __webpack_require__(930);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteAllMetaBoxesModal = function DeleteAllMetaBoxesModal() {

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        unregister = _useFormContext.unregister;

    var buttons = [wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.SUCCESS, onClick: function onClick(e) {
                e.preventDefault();
                dispatch((0, _metaStateSlice.deleteAllBoxes)());
                unregister("boxes");
                setModalOpen(!modalOpen);
            } },
        (0, _useTranslation2.default)("Yes")
    ), wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.DANGER, onClick: function onClick(e) {
                e.preventDefault();
                setModalOpen(!modalOpen);
            } },
        (0, _useTranslation2.default)("No")
    )];

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)('Confirm deleting all'),
                visible: modalOpen,
                buttons: buttons
            },
            (0, _useTranslation2.default)("Are you sure?")
        ),
        wp.element.createElement(
            _Button2.default,
            {
                type: "button",
                style: _styles.styleVariants.DANGER,
                onClick: function onClick(e) {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }
            },
            (0, _useTranslation2.default)("Delete all")
        )
    );
};

exports.default = DeleteAllMetaBoxesModal;

/***/ }),

/***/ 2127:
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

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _reactRedux = __webpack_require__(6706);

var _metaStateSlice = __webpack_require__(6836);

var _reactHookForm = __webpack_require__(930);

var _react3 = __webpack_require__(4226);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteMetaBoxModal = function DeleteMetaBoxModal(_ref) {
    var index = _ref.index,
        boxId = _ref.boxId,
        setActiveTab = _ref.setActiveTab;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: "boxes"
    }),
        remove = _useFieldArray.remove;

    // manage local state


    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    var buttons = [wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.SUCCESS, onClick: function onClick(e) {
                e.preventDefault();
                dispatch((0, _metaStateSlice.deleteBox)(boxId));
                remove(index);
                setModalOpen(!modalOpen);

                if (setActiveTab) {
                    setActiveTab(0);
                }
            } },
        (0, _useTranslation2.default)("Yes")
    ), wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.DANGER, onClick: function onClick(e) {
                e.preventDefault();
                setModalOpen(!modalOpen);
            } },
        (0, _useTranslation2.default)("No")
    )];

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)('Confirm deleting meta box'),
                visible: modalOpen,
                buttons: buttons
            },
            (0, _useTranslation2.default)("Are you sure?")
        ),
        wp.element.createElement(
            "a",
            {
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }
            },
            wp.element.createElement(_react3.Icon, { icon: "bx-trash", width: 18 })
        )
    );
};

DeleteMetaBoxModal.propTypes = {
    setActiveTab: _propTypes2.default.func,
    index: _propTypes2.default.number.isRequired,
    boxId: _propTypes2.default.string.isRequired
};

exports.default = DeleteMetaBoxModal;

/***/ }),

/***/ 4317:
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

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _reactRedux = __webpack_require__(6706);

var _metaStateSlice = __webpack_require__(6836);

var _reactHookForm = __webpack_require__(930);

var _fields = __webpack_require__(5216);

var _react3 = __webpack_require__(4226);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteMetaFieldModal = function DeleteMetaFieldModal(_ref) {
    var boxId = _ref.boxId,
        fieldId = _ref.fieldId,
        fieldIndex = _ref.fieldIndex,
        parentFieldId = _ref.parentFieldId,
        parentBlockId = _ref.parentBlockId,
        setActiveTab = _ref.setActiveTab;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    var formId = function formId() {
        return (0, _fields.getFormId)(group.boxes, boxId, fieldId, false);
    };

    // mange local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: formId()
    }),
        remove = _useFieldArray.remove;

    var buttons = [wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.SUCCESS, onClick: function onClick(e) {
                e.preventDefault();
                dispatch((0, _metaStateSlice.deleteField)({ boxId: boxId, parentFieldId: parentFieldId, parentBlockId: parentBlockId, fieldId: fieldId }));
                remove(fieldIndex);
                setModalOpen(!modalOpen);

                if (setActiveTab) {
                    setActiveTab(0);
                }
            } },
        (0, _useTranslation2.default)("Yes")
    ), wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.DANGER, onClick: function onClick(e) {
                e.preventDefault();
                setModalOpen(!modalOpen);
            } },
        (0, _useTranslation2.default)("No")
    )];

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)('Confirm deleting meta field'),
                visible: modalOpen,
                buttons: buttons
            },
            (0, _useTranslation2.default)("Are you sure?")
        ),
        wp.element.createElement(
            "a",
            {
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }
            },
            wp.element.createElement(_react3.Icon, { icon: "bx-trash", width: 18 })
        )
    );
};

DeleteMetaFieldModal.propTypes = {
    setActiveTab: _propTypes2.default.func,
    boxId: _propTypes2.default.string.isRequired,
    fieldId: _propTypes2.default.string.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    parentFieldId: _propTypes2.default.string,
    parentBlockId: _propTypes2.default.string
};

exports.default = DeleteMetaFieldModal;

/***/ }),

/***/ 6365:
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

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _reactRedux = __webpack_require__(6706);

var _metaStateSlice = __webpack_require__(6836);

var _reactHookForm = __webpack_require__(930);

var _fields = __webpack_require__(5216);

var _react3 = __webpack_require__(4226);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteMetaOptionModal = function DeleteMetaOptionModal(_ref) {
    var boxId = _ref.boxId,
        fieldId = _ref.fieldId,
        optionId = _ref.optionId,
        parentFieldId = _ref.parentFieldId,
        optionIndex = _ref.optionIndex;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    var formId = function formId() {
        return (0, _fields.getFormId)(group.boxes, boxId, fieldId) + ".options";
    };

    // mange local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: formId()
    }),
        remove = _useFieldArray.remove;

    var buttons = [wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.SUCCESS, onClick: function onClick(e) {
                e.preventDefault();
                dispatch((0, _metaStateSlice.deleteOption)({ boxId: boxId, fieldId: fieldId, parentFieldId: parentFieldId, optionId: optionId }));
                remove(optionIndex);
                setModalOpen(!modalOpen);
            } },
        (0, _useTranslation2.default)("Yes")
    ), wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.DANGER, onClick: function onClick(e) {
                e.preventDefault();
                setModalOpen(!modalOpen);
            } },
        (0, _useTranslation2.default)("No")
    )];

    return wp.element.createElement(
        "span",
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)('Confirm deleting option'),
                visible: modalOpen,
                buttons: buttons
            },
            (0, _useTranslation2.default)("Are you sure?")
        ),
        wp.element.createElement(
            "a",
            {
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }
            },
            wp.element.createElement(_Tooltip2.default, {
                icon: false,
                tip: (0, _useTranslation2.default)("Delete"),
                label: wp.element.createElement(_react3.Icon, { icon: "bx-minus" })
            })
        )
    );
};

DeleteMetaOptionModal.propTypes = {
    boxId: _propTypes2.default.string.isRequired,
    fieldId: _propTypes2.default.string.isRequired,
    parentFieldId: _propTypes2.default.string,
    optionId: _propTypes2.default.string.isRequired,
    optionIndex: _propTypes2.default.number.isRequired
};

exports.default = DeleteMetaOptionModal;

/***/ }),

/***/ 1111:
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

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _CopyElement = __webpack_require__(6523);

var _CopyElement2 = _interopRequireDefault(_CopyElement);

var _reactHookForm = __webpack_require__(930);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _reactRedux = __webpack_require__(6706);

var _fields = __webpack_require__(5216);

var _ajax = __webpack_require__(7569);

var _react3 = __webpack_require__(4226);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaFieldShortCodeModal = function MetaFieldShortCodeModal(_ref) {
    var boxId = _ref.boxId,
        field = _ref.field,
        parentFieldId = _ref.parentFieldId,
        parentBlockId = _ref.parentBlockId;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    var boxIndex = group.boxes.findIndex(function (b) {
        return b.id === boxId;
    });
    var formId = (0, _fields.getFormId)(group.boxes, boxId, field.id);
    var formIdArray = formId.split('.');

    // mange local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        loading = _useState2[0],
        isLoading = _useState2[1];

    var _useState3 = (0, _react.useState)([]),
        _useState4 = _slicedToArray(_useState3, 2),
        shortCodes = _useState4[0],
        setShortCodes = _useState4[1];

    var _useState5 = (0, _react.useState)(null),
        _useState6 = _slicedToArray(_useState5, 2),
        metaKey = _useState6[0],
        setMetaKey = _useState6[1];

    var _useState7 = (0, _react.useState)(false),
        _useState8 = _slicedToArray(_useState7, 2),
        modalOpen = _useState8[0],
        setModalOpen = _useState8[1];

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var watchedBelongs = (0, _reactHookForm.useWatch)({
        control: control,
        name: "belongs"
    });
    var watchedBoxName = (0, _reactHookForm.useWatch)({
        control: control,
        name: "boxes." + boxIndex + ".name"
    });
    var watchedField = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId
    });
    var watchedFieldRootName = (0, _reactHookForm.useWatch)({
        control: control,
        name: "boxes." + boxIndex + ".fields." + formIdArray[3] + ".name"
    });

    var watchedParentBlock = null;
    var watchedParentField = null;
    var indexInfo = formIdArray[formIdArray.length - 1];
    var blockIndexInfo = parentBlockId ? formIdArray[formIdArray.length - 3] : null;

    if (parentBlockId) {
        watchedParentBlock = (0, _reactHookForm.useWatch)({
            control: control,
            name: (0, _fields.getFormId)(group.boxes, boxId, parentBlockId)
        });
    }

    if (parentFieldId) {
        watchedParentField = (0, _reactHookForm.useWatch)({
            control: control,
            name: (0, _fields.getFormId)(group.boxes, boxId, parentFieldId)
        });
    }

    (0, _react.useEffect)(function () {
        if (modalOpen) {
            isLoading(true);

            (0, _ajax.wpAjaxRequest)("calculateShortCodeAction", {
                belongsTo: watchedBelongs,
                boxName: watchedBoxName,
                fieldId: field.id,
                fieldName: watchedField ? watchedField.name : field.name,
                fieldRootName: watchedFieldRootName,
                parentBlockName: watchedParentBlock ? watchedParentBlock.name : null,
                parentFieldName: watchedParentField ? watchedParentField.name : null,
                index: indexInfo,
                blockIndexInfo: blockIndexInfo
            }).then(function (res) {
                setMetaKey(res.metaKey);
                setShortCodes(res.shortcodes);
                isLoading(false);
            }).catch(function (err) {
                console.error(err.message);
                isLoading(false);
            });
        }
    }, [modalOpen]);

    var buttons = [wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.DANGER, onClick: function onClick(e) {
                e.preventDefault();
                setModalOpen(!modalOpen);
            } },
        (0, _useTranslation2.default)("Close")
    )];

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)('Shortcode preview'),
                visible: modalOpen,
                padding: 0,
                buttons: buttons
            },
            loading ? wp.element.createElement(
                "div",
                { className: "b-bottom-1 p-24" },
                (0, _useTranslation2.default)("Loading...")
            ) : wp.element.createElement(
                _react2.default.Fragment,
                null,
                metaKey && wp.element.createElement(
                    "div",
                    { className: "b-bottom-1 p-24" },
                    wp.element.createElement(
                        "div",
                        { className: "mb-8 color-black" },
                        wp.element.createElement(_Tooltip2.default, {
                            label: (0, _useTranslation2.default)("Meta-key"),
                            tip: wp.element.createElement(
                                "div",
                                { className: "flex-column s-8 color-gray" },
                                wp.element.createElement(
                                    "div",
                                    null,
                                    (0, _useTranslation2.default)("This is the meta-key of this field.")
                                ),
                                wp.element.createElement(
                                    "div",
                                    null,
                                    (0, _useTranslation2.default)("Use it in functions like get_post_meta() to retrieve saved meta field data.")
                                )
                            )
                        })
                    ),
                    wp.element.createElement(_CopyElement2.default, { text: metaKey })
                ),
                shortCodes && shortCodes.length > 0 && wp.element.createElement(
                    "div",
                    { className: "p-24" },
                    wp.element.createElement(
                        "div",
                        { className: "mb-8 color-black" },
                        wp.element.createElement(_Tooltip2.default, {
                            label: shortCodes.length > 1 ? (0, _useTranslation2.default)("Shortcodes") : (0, _useTranslation2.default)("Shortcode"),
                            tip: wp.element.createElement(
                                "div",
                                { className: "flex-column s-8 color-gray" },
                                wp.element.createElement(
                                    "div",
                                    null,
                                    (0, _useTranslation2.default)("Use this shortcode to display the meta field on your frontend.")
                                )
                            )
                        })
                    ),
                    shortCodes && wp.element.createElement(
                        "div",
                        { className: "flex-column s-8" },
                        shortCodes.map(function (shortCode) {
                            return wp.element.createElement(_CopyElement2.default, { text: shortCode });
                        })
                    )
                )
            )
        ),
        wp.element.createElement(
            "a",
            {
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }
            },
            wp.element.createElement(_react3.Icon, { icon: "bx:code-alt", width: 18 })
        )
    );
};

MetaFieldShortCodeModal.propTypes = {
    boxId: _propTypes2.default.string.isRequired,
    field: _propTypes2.default.object.isRequired,
    parentFieldId: _propTypes2.default.string,
    parentBlockId: _propTypes2.default.string
};

exports.default = MetaFieldShortCodeModal;

/***/ }),

/***/ 6704:
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

var _sortable = __webpack_require__(9125);

var _utilities = __webpack_require__(4285);

var _react3 = __webpack_require__(4226);

var _Badge = __webpack_require__(3136);

var _Badge2 = _interopRequireDefault(_Badge);

var _styles = __webpack_require__(624);

var _reactHookForm = __webpack_require__(930);

var _ElementSelector = __webpack_require__(7643);

var _ElementSelector2 = _interopRequireDefault(_ElementSelector);

var _reactRedux = __webpack_require__(6706);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BoxSortableTab = function BoxSortableTab(_ref) {
    var index = _ref.index,
        box = _ref.box,
        _ref$activeTab = _ref.activeTab,
        activeTab = _ref$activeTab === undefined ? 0 : _ref$activeTab,
        _onClick = _ref.onClick;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        selectedElementsType = _useSelector.selectedElementsType;

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var watchedBoxName = (0, _reactHookForm.useWatch)({
        control: control,
        name: "boxes." + index + ".name"
    });

    // DND-kit

    var _useSortable = (0, _sortable.useSortable)({ id: box.id }),
        attributes = _useSortable.attributes,
        listeners = _useSortable.listeners,
        setNodeRef = _useSortable.setNodeRef,
        transform = _useSortable.transform;

    var style = {
        transform: _utilities.CSS.Translate.toString(transform)
    };

    /**
     *
     * @return {boolean}
     */
    var canCopyTheBox = function canCopyTheBox() {

        if (typeof box.isSaved !== 'undefined' && box.isSaved === false) {
            return false;
        }

        return true;
    };

    return wp.element.createElement(
        "div",
        {
            id: box.id,
            className: "flex-between s-8 tab " + (activeTab === index ? 'active' : ''),
            ref: setNodeRef,
            style: style,
            onClick: function onClick() {
                if (_onClick) {
                    _onClick(index);
                }
            }
        },
        wp.element.createElement(
            "span",
            _extends({ className: "cursor-move top-2 handle" }, attributes, listeners),
            wp.element.createElement(_react3.Icon, { icon: "bx:dots-vertical-rounded", color: "#777", width: 18 })
        ),
        selectedElementsType !== 'field' && selectedElementsType !== 'block' && canCopyTheBox() && wp.element.createElement(_ElementSelector2.default, {
            elementType: "box",
            element: {
                id: box.id
            }
        }),
        wp.element.createElement(
            "span",
            { className: "text-ellipsis" },
            watchedBoxName ? watchedBoxName : box.name
        ),
        wp.element.createElement(
            _Badge2.default,
            { style: index === activeTab ? _styles.styleVariants.SECONDARY : _styles.styleVariants.DISABLED },
            box.fields ? box.fields.length : 0
        )
    );
};

BoxSortableTab.propTypes = {
    index: _propTypes2.default.number.isRequired,
    box: _propTypes2.default.object.isRequired,
    activeTab: _propTypes2.default.number
};

exports.default = BoxSortableTab;

/***/ }),

/***/ 3324:
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

var _objects = __webpack_require__(4040);

var _SwitchView = __webpack_require__(6973);

var _SwitchView2 = _interopRequireDefault(_SwitchView);

var _reactRedux = __webpack_require__(6706);

var _uuid = __webpack_require__(1614);

var _MetaGroupHeader = __webpack_require__(4177);

var _MetaGroupHeader2 = _interopRequireDefault(_MetaGroupHeader);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _BoxSortableTab = __webpack_require__(6704);

var _BoxSortableTab2 = _interopRequireDefault(_BoxSortableTab);

var _sortable = __webpack_require__(9125);

var _metaStateSlice = __webpack_require__(6836);

var _SortableList = __webpack_require__(5557);

var _SortableList2 = _interopRequireDefault(_SortableList);

var _reactHookForm = __webpack_require__(930);

var _MetaBox = __webpack_require__(7998);

var _MetaBox2 = _interopRequireDefault(_MetaBox);

var _MetaGroupSettings = __webpack_require__(9190);

var _MetaGroupSettings2 = _interopRequireDefault(_MetaGroupSettings);

var _reactRouterDom = __webpack_require__(4022);

var _react3 = __webpack_require__(8839);

var _BulkActions = __webpack_require__(6278);

var _BulkActions2 = _interopRequireDefault(_BulkActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TabularView = function TabularView(_ref) {
    var boxes = _ref.boxes,
        view = _ref.view,
        setView = _ref.setView,
        activeBoxTab = _ref.activeBoxTab,
        setActiveBoxTab = _ref.setActiveBoxTab;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector.group;

    // auto-animate


    var _useAutoAnimate = (0, _react3.useAutoAnimate)(),
        _useAutoAnimate2 = _slicedToArray(_useAutoAnimate, 1),
        parent = _useAutoAnimate2[0];

    // manage local state


    var newGroupId = (0, _uuid.v4)();

    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var _useState = (0, _react.useState)(typeof id !== 'string'),
        _useState2 = _slicedToArray(_useState, 2),
        settingsVisible = _useState2[0],
        setSettingsVisible = _useState2[1];

    var handleTabChange = function handleTabChange(index) {
        setActiveBoxTab(index);
    };

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: "boxes"
    }),
        move = _useFieldArray.move;

    var handleDragEnd = function handleDragEnd(event) {
        var active = event.active,
            over = event.over;


        if (active.id === over.id) {
            return;
        }

        var oldIndex = boxes.findIndex(function (box) {
            return box.id === active.id;
        });
        var newIndex = boxes.findIndex(function (box) {
            return box.id === over.id;
        });
        var sortedBoxes = (0, _sortable.arrayMove)(boxes, oldIndex, newIndex);
        move(oldIndex, newIndex);
        setActiveBoxTab(newIndex);

        dispatch((0, _metaStateSlice.setBoxes)(sortedBoxes));
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            { className: "flex-between mb-24" },
            wp.element.createElement(_MetaGroupHeader2.default, {
                groupId: !(0, _objects.isEmpty)(group) ? group.id : newGroupId,
                settingsVisible: settingsVisible,
                setSettingsVisible: setSettingsVisible
            }),
            wp.element.createElement(_SwitchView2.default, {
                localStorageKey: !(0, _objects.isEmpty)(group) ? group.id : newGroupId,
                setView: setView,
                view: view
            })
        ),
        wp.element.createElement(
            "div",
            { className: !settingsVisible ? 'hidden' : '' },
            wp.element.createElement(_MetaGroupSettings2.default, {
                groupId: !(0, _objects.isEmpty)(group) ? group.id : newGroupId
            })
        ),
        wp.element.createElement(
            "div",
            { ref: parent },
            wp.element.createElement(_BulkActions2.default, {
                view: "tab",
                setBoxTab: setActiveBoxTab
            }),
            boxes && boxes.length > 0 ? wp.element.createElement(
                "div",
                { className: "acpt-horizontal-tabs" },
                wp.element.createElement(
                    "div",
                    { className: "tablist" },
                    wp.element.createElement(
                        _SortableList2.default,
                        {
                            onDragEnd: handleDragEnd,
                            items: boxes
                        },
                        boxes.map(function (box, index) {
                            return wp.element.createElement(_BoxSortableTab2.default, {
                                index: index,
                                box: box,
                                activeTab: activeBoxTab,
                                onClick: handleTabChange
                            });
                        })
                    )
                ),
                boxes.map(function (box, index) {
                    return wp.element.createElement(
                        _react2.default.Fragment,
                        null,
                        index === activeBoxTab && wp.element.createElement(
                            "div",
                            { className: "tab-panel" },
                            wp.element.createElement(_MetaBox2.default, {
                                index: index,
                                key: box.id,
                                view: "tabular",
                                box: box,
                                setActiveTab: setActiveBoxTab
                            })
                        )
                    );
                })
            ) : wp.element.createElement(
                _Alert2.default,
                { style: _styles.styleVariants.WARNING },
                (0, _useTranslation2.default)('No meta box already created. Create the first one now by clicking the button "Add meta box"!')
            )
        )
    );
};

TabularView.propTypes = {
    view: _propTypes2.default.string.isRequired,
    setView: _propTypes2.default.func.isRequired,
    boxes: _propTypes2.default.array.isRequired,
    activeBoxTab: _propTypes2.default.number.isRequired,
    setActiveBoxTab: _propTypes2.default.func.isRequired
};

exports.default = TabularView;

/***/ }),

/***/ 8836:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _reactHookForm = __webpack_require__(930);

var _misc = __webpack_require__(3154);

var _reactRouterDom = __webpack_require__(4022);

var _reactRedux = __webpack_require__(6706);

var _fetchMetaSlice = __webpack_require__(9731);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _uuid = __webpack_require__(1614);

var _objects = __webpack_require__(4040);

var _ListView = __webpack_require__(3364);

var _ListView2 = _interopRequireDefault(_ListView);

var _TabularView = __webpack_require__(3324);

var _TabularView2 = _interopRequireDefault(_TabularView);

var _ = __webpack_require__(9167);

var _2 = _interopRequireDefault(_);

var _metaStateSlice = __webpack_require__(6836);

var _DeleteAllMetaBoxesModal = __webpack_require__(4422);

var _DeleteAllMetaBoxesModal2 = _interopRequireDefault(_DeleteAllMetaBoxesModal);

var _localStorage = __webpack_require__(1500);

var _scroll = __webpack_require__(2727);

var _saveMetaSlice = __webpack_require__(2297);

var _reactHotToast = __webpack_require__(4500);

var _useConfirmTabClose = __webpack_require__(1972);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Meta = function Meta() {

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.saveMeta;
    }),
        saveError = _useSelector.error,
        saveSuccess = _useSelector.success,
        saveLoading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchMeta;
    }),
        loading = _useSelector2.loading;

    var _useSelector3 = (0, _reactRedux.useSelector)(function (state) {
        return state.metaState;
    }),
        group = _useSelector3.group;

    // manage local state


    var newGroupId = (0, _uuid.v4)();

    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var _useSearchParams = (0, _reactRouterDom.useSearchParams)(),
        _useSearchParams2 = _slicedToArray(_useSearchParams, 2),
        searchParams = _useSearchParams2[0],
        setSearchParams = _useSearchParams2[1];

    var groupId = id ? id : newGroupId;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isSubmitting = _useState2[0],
        setIsSubmitted = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = _slicedToArray(_useState3, 2),
        hasUnsavedChanges = _useState4[0],
        setHasUnsavedChanges = _useState4[1];

    var _useState5 = (0, _react.useState)(false),
        _useState6 = _slicedToArray(_useState5, 2),
        fetchError = _useState6[0],
        setFetchError = _useState6[1];

    var _useState7 = (0, _react.useState)((0, _localStorage.savedView)(groupId)),
        _useState8 = _slicedToArray(_useState7, 2),
        view = _useState8[0],
        setView = _useState8[1];

    var _useState9 = (0, _react.useState)(0),
        _useState10 = _slicedToArray(_useState9, 2),
        activeBoxTab = _useState10[0],
        setActiveBoxTab = _useState10[1];

    // manage redirect


    var navigate = (0, _reactRouterDom.useNavigate)();

    // form init
    var methods = (0, _reactHookForm.useForm)({
        mode: 'onChange'
    });

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)("" + (0, _useTranslation2.default)("Manage meta fields") + (hasUnsavedChanges ? '*' : ''));
    }, [hasUnsavedChanges]);

    (0, _useConfirmTabClose.useConfirmTabClose)(hasUnsavedChanges);

    /**
     * Add box
     */
    var handleAddBox = function handleAddBox() {

        var newBoxId = (0, _uuid.v4)();
        var newBox = {
            id: newBoxId,
            name: (0, _useTranslation2.default)("meta_box_title"),
            UIName: (0, _useTranslation2.default)("meta_box_title"),
            label: "meta box title",
            fields: [],
            isSaved: false,
            sort: group.boxes ? group.boxes.length : 1
        };

        dispatch((0, _metaStateSlice.addBox)(newBox));
        setActiveBoxTab(group.boxes ? group.boxes.length : 0);

        (0, _misc.delay)(1).then(function () {
            (0, _scroll.scrollToId)("lazy-" + newBoxId);
        });
    };

    // manage local state
    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _useTranslation2.default)("Manage meta fields"));
        (0, _misc.changeCurrentAdminMenuLink)('#/meta');

        if (id) {
            dispatch((0, _fetchMetaSlice.fetchMeta)({
                id: id
            })).then(function (res) {
                dispatch((0, _metaStateSlice.hydrateState)(res.payload));

                // Set initial values
                methods.setValue('id', id);
                methods.setValue('name', res.payload.name);
                methods.setValue('label', res.payload.label);
                methods.setValue('display', res.payload.display);
                res.payload.belongs && res.payload.belongs.map(function (belong, index) {
                    methods.setValue("belongs." + index + ".id", belong.id);
                    methods.setValue("belongs." + index + ".belongsTo", belong.belongsTo);
                    methods.setValue("belongs." + index + ".operator", belong.operator);
                    methods.setValue("belongs." + index + ".find", belong.find);
                    methods.setValue("belongs." + index + ".logic", belong.logic);
                });
                res.payload.boxes && res.payload.boxes.map(function (box, index) {
                    methods.setValue("boxes." + index, box);
                });
            }).catch(function (err) {
                console.error(err);
                setFetchError(true);
            });
        } else {
            // Set initial name
            var find = searchParams.get('find');
            var belongsTo = searchParams.get('belongsTo');

            var newGroupName = (find ? find + '_' : '') + "group_name";
            var newGroupLabel = (find ? find + ' ' : '') + "group name";

            var state = {
                name: newGroupName,
                label: newGroupLabel
            };

            methods.reset();
            methods.setValue('name', newGroupName);
            methods.setValue('label', newGroupLabel);

            if (find && belongsTo) {
                var newUuid = (0, _uuid.v4)();

                methods.setValue("belongs.0.id", newUuid);
                methods.setValue("belongs.0.belongsTo", belongsTo);
                methods.setValue("belongs.0.operator", "=");
                methods.setValue("belongs.0.find", find);

                state.belongs = [];
                state.belongs.push({
                    id: newUuid,
                    belongsTo: belongsTo,
                    operator: "=",
                    find: find
                });
            }

            dispatch((0, _metaStateSlice.hydrateState)(state));
        }
    }, [id]);

    /**
     *
     * @return {boolean}
     */
    var isSaveButtonEnabled = function isSaveButtonEnabled() {

        if (isSubmitting) {
            return false;
        }

        if (saveLoading) {
            return false;
        }

        if (!(0, _objects.isEmpty)(methods.formState.errors)) {
            return false;
        }

        return true;
    };

    /**
     * Handle data submission
     *
     * @param data
     */
    var onSubmit = function onSubmit(data) {

        setIsSubmitted(true);

        dispatch((0, _saveMetaSlice.saveMeta)(data)).then(function (res) {
            var payload = res.payload;

            if (payload.success) {
                if (!id) {
                    navigate('/meta');
                }

                methods.reset({}, { keepValues: true, keepIsSubmitted: true });
                setHasUnsavedChanges(false);
                _reactHotToast.toast.success((0, _useTranslation2.default)("Meta group settings successfully saved"));
                dispatch((0, _metaStateSlice.hydrateState)(data));
                (0, _scroll.scrollToTop)();
            } else {
                _reactHotToast.toast.error(payload.error);
            }

            setIsSubmitted(false);
        }).catch(function (err) {
            _reactHotToast.toast.error(err);
            setIsSubmitted(false);
        });
    };

    var actions = [wp.element.createElement(
        _Button2.default,
        {
            type: "button",
            style: _styles.styleVariants.SECONDARY,
            onClick: function onClick(e) {
                e.preventDefault();
                handleAddBox();
            }
        },
        (0, _useTranslation2.default)("Add meta box")
    ), wp.element.createElement(
        _Button2.default,
        {
            disabled: !isSaveButtonEnabled(),
            style: _styles.styleVariants.PRIMARY
        },
        (0, _useTranslation2.default)("Save")
    ), wp.element.createElement(_DeleteAllMetaBoxesModal2.default, null)];

    if (id && loading) {
        return wp.element.createElement(_Loader2.default, null);
    }

    if (fetchError) {
        return wp.element.createElement(_2.default, null);
    }

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _reactHookForm.FormProvider,
            methods,
            wp.element.createElement(
                "form",
                {
                    onSubmit: methods.handleSubmit(onSubmit),
                    onChange: function onChange() {
                        setHasUnsavedChanges(true);
                    }
                },
                wp.element.createElement(
                    _Layout2.default,
                    {
                        title: (0, _useTranslation2.default)("Manage meta fields"),
                        actions: actions,
                        crumbs: [{
                            label: (0, _useTranslation2.default)("Field groups"),
                            link: "/meta"
                        }, {
                            label: (0, _useTranslation2.default)("Manage meta fields")
                        }]
                    },
                    view === 'list' ? wp.element.createElement(_ListView2.default, {
                        view: view,
                        setView: setView,
                        boxes: !(0, _objects.isEmpty)(group) ? group.boxes : []
                    }) : wp.element.createElement(_TabularView2.default, {
                        activeBoxTab: activeBoxTab,
                        setActiveBoxTab: setActiveBoxTab,
                        view: view,
                        setView: setView,
                        boxes: !(0, _objects.isEmpty)(group) ? group.boxes : []
                    })
                )
            )
        )
    );
};

exports.default = Meta;

/***/ }),

/***/ 9546:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.debounce = debounce;
function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function later() {
        var passed = now() - previous;
        if (wait > passed) {
            timeout = setTimeout(later, wait - passed);
        } else {
            timeout = null;
            if (!immediate) result = func.apply(context, args);
            if (!timeout) args = context = null;
        }
    };

    var debounced = restArguments(function (_args) {
        context = this;
        args = _args;
        previous = now();
        if (!timeout) {
            timeout = setTimeout(later, wait);
            if (immediate) result = func.apply(context, args);
        }
        return result;
    });

    debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = args = context = null;
    };

    return debounced;
}

function now() {
    return new Date().getTime();
}

function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function () {
        var length = Math.max(arguments.length - startIndex, 0),
            rest = Array(length),
            index = 0;
        for (; index < length; index++) {
            rest[index] = arguments[index + startIndex];
        }
        switch (startIndex) {
            case 0:
                return func.call(this, rest);
            case 1:
                return func.call(this, arguments[0], rest);
            case 2:
                return func.call(this, arguments[0], arguments[1], rest);
        }
        var args = Array(startIndex + 1);
        for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
        }
        args[startIndex] = rest;
        return func.apply(this, args);
    };
}

/***/ }),

/***/ 9593:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.validateGoogleMapsApiKey = exports.validWPGraphQLName = exports.validSelect = exports.validToggle = exports.validDate = exports.validColor = exports.validPhone = exports.validNumber = exports.validCurrency = exports.validURL = exports.validEmail = exports.isAValidValueForThisType = exports.asyncIsTaxonomySlugValid = exports.isTaxonomySlugValid = exports.asyncIsPostTypeNameValid = exports.isPostTypeNameValid = exports.alphanumericallyValid = undefined;

var _fields = __webpack_require__(857);

var _ajax = __webpack_require__(7569);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * validate a value for a given field type
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @param type
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @param value
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            * @return {boolean}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                            */


var alphanumericallyValid = exports.alphanumericallyValid = function alphanumericallyValid(string) {

    var matches = string.match(/^[0-9a-zA-Z_-]+$/g);

    if (matches === null) {
        return 'Only alphanumeric characters allowed';
    }

    return true;
};

/**
 * Keys are used as internal identifiers. Lowercase alphanumeric characters, dashes, and underscores are allowed.
 * https://developer.wordpress.org/reference/functions/sanitize_key/
 *
 * @param post_name
 * @returns {boolean}
 */
var isPostTypeNameValid = exports.isPostTypeNameValid = function isPostTypeNameValid(post_name) {

    var size = post_name.length;

    if (size > 20) {
        return 'Max post type name lenght is 20';
    }

    var matches = post_name.match(/[a-z0-9_-]/g);

    if (matches === null || size !== matches.length) {
        return 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]';
    }

    return true;
};

var asyncIsPostTypeNameValid = exports.asyncIsPostTypeNameValid = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(post_name) {
        var size, matches, res;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        size = post_name.length;

                        if (!(size > 20)) {
                            _context.next = 3;
                            break;
                        }

                        return _context.abrupt("return", 'Max post type name lenght is 20');

                    case 3:
                        matches = post_name.match(/[a-z0-9_-]/g);

                        if (!(matches === null || size !== matches.length)) {
                            _context.next = 6;
                            break;
                        }

                        return _context.abrupt("return", 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]');

                    case 6:
                        _context.next = 8;
                        return (0, _ajax.wpAjaxRequest)("checkPostTypeNameAction", { postType: post_name });

                    case 8:
                        res = _context.sent;

                        if (!(res.exists === true)) {
                            _context.next = 11;
                            break;
                        }

                        return _context.abrupt("return", post_name + ' post type already exists.');

                    case 11:
                        return _context.abrupt("return", true);

                    case 12:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function asyncIsPostTypeNameValid(_x) {
        return _ref.apply(this, arguments);
    };
}();

var isTaxonomySlugValid = exports.isTaxonomySlugValid = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(slug) {
        var size, matches;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        size = slug.length;

                        if (!(size > 32)) {
                            _context2.next = 3;
                            break;
                        }

                        return _context2.abrupt("return", 'Max post type name lenght is 32');

                    case 3:
                        matches = slug.match(/[a-z0-9_-]/g);

                        if (!(matches === null || size !== matches.length)) {
                            _context2.next = 6;
                            break;
                        }

                        return _context2.abrupt("return", 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]');

                    case 6:
                        return _context2.abrupt("return", true);

                    case 7:
                    case "end":
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function isTaxonomySlugValid(_x2) {
        return _ref2.apply(this, arguments);
    };
}();

var asyncIsTaxonomySlugValid = exports.asyncIsTaxonomySlugValid = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(slug) {
        var size, matches, res;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        size = slug.length;

                        if (!(size > 32)) {
                            _context3.next = 3;
                            break;
                        }

                        return _context3.abrupt("return", 'Max post type name lenght is 32');

                    case 3:
                        matches = slug.match(/[a-z0-9_-]/g);

                        if (!(matches === null || size !== matches.length)) {
                            _context3.next = 6;
                            break;
                        }

                        return _context3.abrupt("return", 'Allowed characters: [Lowercase alphanumeric characters, dashes, and underscores]');

                    case 6:
                        _context3.next = 8;
                        return (0, _ajax.wpAjaxRequest)("checkTaxonomySlugAction", { slug: slug });

                    case 8:
                        res = _context3.sent;

                        if (!(res.exists === true)) {
                            _context3.next = 11;
                            break;
                        }

                        return _context3.abrupt("return", slug + ' taxonomy already exists.');

                    case 11:
                        return _context3.abrupt("return", true);

                    case 12:
                    case "end":
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function asyncIsTaxonomySlugValid(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

var isAValidValueForThisType = exports.isAValidValueForThisType = function isAValidValueForThisType(type, value, options) {

    if (typeof value === 'undefined' || value === null || value === '') {
        return true;
    }

    if (value.length > 50) {
        return false;
    }

    switch (type) {
        case _fields.fieldTypes.COLOR:
            return validColor(value);

        case _fields.fieldTypes.CURRENCY:
            return validCurrency(value);

        case _fields.fieldTypes.DATE:
            return validDate(value);

        case _fields.fieldTypes.EMAIL:
            return validEmail(value);

        case _fields.fieldTypes.WEIGHT:
        case _fields.fieldTypes.LENGTH:
        case _fields.fieldTypes.NUMBER:
            return validNumber(value);

        case _fields.fieldTypes.PHONE:
            return validPhone(value);

        case _fields.fieldTypes.CHECKBOX:
        case _fields.fieldTypes.RADIO:
        case _fields.fieldTypes.SELECT:
        case _fields.fieldTypes.SELECT_MULTI:
            return validSelect(value, options);

        case _fields.fieldTypes.TOGGLE:
            return validToggle(value);

        case _fields.fieldTypes.URL:
            return validURL(value);

        default:
            return true;
    }
};

/**
 *
 * @param str
 * @return {boolean}
 */
var validEmail = exports.validEmail = function validEmail(str) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
var validURL = exports.validURL = function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator

    return !!pattern.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
var validCurrency = exports.validCurrency = function validCurrency(str) {

    var re = /^[0-9]{1,}.[0-9]{2}$/i;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
var validNumber = exports.validNumber = function validNumber(str) {
    var re = /^[0-9]{1,}$/i;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
var validPhone = exports.validPhone = function validPhone(str) {
    var re = /^\+?([0-9]{2,3})\)?[-. ]?([0-9-. ]{6,15})$/;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
var validColor = exports.validColor = function validColor(str) {
    var re = /^#[a-f0-9]{6}$/i;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
var validDate = exports.validDate = function validDate(str) {
    var re = /(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})/gi;

    return re.test(str);
};

/**
 *
 * @param str
 * @return {boolean}
 */
var validToggle = exports.validToggle = function validToggle(str) {
    var re = /^[0-1]{1}$/i;

    return re.test(str);
};

/**
 *
 * @param value
 * @param options
 * @return {boolean}
 */
var validSelect = exports.validSelect = function validSelect(value, options) {

    if (value === null || value === '') {
        return true;
    }

    if (options == null || options.length === 0) {
        return false;
    }

    var matches = 0;

    options.forEach(function (o) {
        if (o.value === value) {
            matches++;
        }
    });

    return matches > 0;
};

var validWPGraphQLName = exports.validWPGraphQLName = function validWPGraphQLName(name) {

    if (null === name.match(/^[a-z]/)) {
        return "The string needs to start with a letter.";
    }

    if (null === name.match(/^[0-9a-zA-Z]+$/)) {
        return "The string needs to be alphanumeric (camelcase).";
    }
};

/**
 *
 * @param key
 * @return {string|boolean}
 */
var validateGoogleMapsApiKey = exports.validateGoogleMapsApiKey = function validateGoogleMapsApiKey(key) {

    if (typeof key === 'undefined' || key === null || key === '' || key.length === 0) {
        return true;
    }

    if (key.length !== 39) {
        return (0, _useTranslation2.default)('Key length must be 39.');
    }

    var regx = new RegExp("^[A-Za-z0-9-_]+$");

    if (!regx.test(key)) {
        return (0, _useTranslation2.default)('Not valid format.');
    }

    return true;
};

/***/ })

}]);
//# sourceMappingURL=376.js.map