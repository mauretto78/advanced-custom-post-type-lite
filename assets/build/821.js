(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[821],{

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

/***/ 43:
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

var _reactSelect = __webpack_require__(6653);

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactSelect = function ReactSelect(_ref) {
    var id = _ref.id,
        validate = _ref.validate,
        control = _ref.control,
        values = _ref.values,
        defaultValue = _ref.defaultValue,
        description = _ref.description,
        disabled = _ref.disabled,
        _ref$isMulti = _ref.isMulti,
        isMulti = _ref$isMulti === undefined ? false : _ref$isMulti,
        placeholder = _ref.placeholder,
        externalOnChange = _ref.onChange;


    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(_reactHookForm.Controller, {
            id: id,
            control: control,
            name: id,
            rules: validate,
            defaultValue: defaultValue,
            render: function render(_ref2) {
                var _ref2$field = _ref2.field,
                    _onChange = _ref2$field.onChange,
                    onBlur = _ref2$field.onBlur,
                    value = _ref2$field.value,
                    name = _ref2$field.name,
                    ref = _ref2$field.ref,
                    _ref2$fieldState = _ref2.fieldState,
                    invalid = _ref2$fieldState.invalid,
                    isTouched = _ref2$fieldState.isTouched,
                    isDirty = _ref2$fieldState.isDirty,
                    error = _ref2$fieldState.error,
                    formState = _ref2.formState;
                return wp.element.createElement(
                    'div',
                    null,
                    wp.element.createElement(_reactSelect2.default, {
                        placeholder: placeholder ? placeholder : (0, _useTranslation2.default)("Select"),
                        isDisabled: disabled,
                        isMulti: isMulti,
                        defaultValue: defaultValue,
                        styles: _styles.reactSelectStyles,
                        classNamePrefix: 'addl-class',
                        onBlur: onBlur,
                        onChange: function onChange(value) {
                            _onChange(value);
                            if (externalOnChange) {
                                externalOnChange(value);
                            }
                        },
                        checked: value,
                        inputRef: ref,
                        options: values
                    }),
                    error && wp.element.createElement(
                        'div',
                        { className: 'invalid-feedback' },
                        error.message
                    )
                );
            }
        }),
        description && wp.element.createElement(
            'div',
            { className: 'form-description' },
            description
        )
    );
};

ReactSelect.propTypes = {
    id: _propTypes2.default.string.isRequired,
    isMulti: _propTypes2.default.bool,
    description: _propTypes2.default.string,
    placeholder: _propTypes2.default.string,
    defaultValue: _propTypes2.default.string,
    disabled: _propTypes2.default.bool,
    values: _propTypes2.default.arrayOf(_propTypes2.default.object).isRequired,
    validate: _propTypes2.default.func,
    onChange: _propTypes2.default.func,
    control: _propTypes2.default.func.isRequired
};

exports.default = ReactSelect;

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

/***/ 3402:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var fontList = exports.fontList = [{ label: "Default", value: "Default" }, { label: "Inter", value: "Inter" }, { label: "Lato", value: "Lato" }, { label: "Open Sans", value: "Open Sans" }, { label: "Poppins", value: "Poppins" }, { label: "Roboto", value: "Roboto" }, { label: "Ubuntu", value: "Ubuntu" }];

/***/ }),

/***/ 5821:
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

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _reactHookForm = __webpack_require__(930);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _ReactSelect = __webpack_require__(43);

var _ReactSelect2 = _interopRequireDefault(_ReactSelect);

var _objects = __webpack_require__(4040);

var _misc = __webpack_require__(3154);

var _reactRedux = __webpack_require__(6706);

var _saveSettingsSlice = __webpack_require__(3243);

var _reactHotToast = __webpack_require__(4500);

var _Toggle = __webpack_require__(8040);

var _Toggle2 = _interopRequireDefault(_Toggle);

var _validation = __webpack_require__(9593);

var _ajax = __webpack_require__(7569);

var _Select = __webpack_require__(4003);

var _Select2 = _interopRequireDefault(_Select);

var _fonts = __webpack_require__(3402);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Settings = function Settings() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.saveSettings;
    }),
        saveError = _useSelector.error,
        saveSuccess = _useSelector.success,
        saveLoading = _useSelector.loading;

    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isFormSubmitted = _useState2[0],
        setFormSubmitted = _useState2[1];

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _useTranslation2.default)("Settings page"));
        (0, _misc.changeCurrentAdminMenuLink)('#/settings');
    }, []);

    var settings = document.globals;
    var fetched = settings.settings;

    var enableCacheDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'enable_cache') !== 'undefined' ? parseInt((0, _objects.filterByLabel)(fetched, 'key', 'enable_cache').value) : 1;
    var deletePostsDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'delete_posts') !== 'undefined' ? parseInt((0, _objects.filterByLabel)(fetched, 'key', 'delete_posts').value) : 0;
    var deleteMetadataDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'delete_metadata') !== 'undefined' ? parseInt((0, _objects.filterByLabel)(fetched, 'key', 'delete_metadata').value) : 0;
    var deleteDefinitionsDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'delete_tables_when_deactivate') !== 'undefined' ? parseInt((0, _objects.filterByLabel)(fetched, 'key', 'delete_tables_when_deactivate').value) : 0;
    var perPageDefaultValue = fetched.length > 0 && (0, _objects.filterByLabel)(fetched, 'key', 'records_per_page') !== '' ? (0, _objects.filterByLabel)(fetched, 'key', 'records_per_page').value : 20;
    var languageDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'language').value !== 'undefined' ? (0, _objects.filterByValue)(settings.globals.available_languages, (0, _objects.filterByLabel)(fetched, 'key', 'language').value).value : 'en_US';
    var fontDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'font').value !== 'undefined' ? (0, _objects.filterByValue)(_fonts.fontList, (0, _objects.filterByLabel)(fetched, 'key', 'font').value).value : 'Inter';

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all',
        defaultValues: {
            enable_cache: enableCacheDefaultValue,
            delete_metadata: deleteMetadataDefaultValue,
            delete_posts: deletePostsDefaultValue,
            delete_tables_when_deactivate: deleteDefinitionsDefaultValue,
            records_per_page: perPageDefaultValue,
            language: languageDefaultValue,
            font: fontDefaultValue
        }
    }),
        register = _useForm.register,
        handleSubmit = _useForm.handleSubmit,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid;

    var onSubmit = function onSubmit(data) {
        dispatch((0, _saveSettingsSlice.saveSettings)({
            records_per_page: data.records_per_page,
            enable_cache: data.enable_cache ? 1 : 0,
            delete_tables_when_deactivate: data.delete_tables_when_deactivate ? 1 : 0,
            delete_posts: data.delete_posts ? 1 : 0,
            delete_metadata: data.delete_metadata ? 1 : 0,
            language: data.language ? data.language : null,
            font: data.font ? data.font : null
        }));
        setFormSubmitted(true);
    };

    (0, _react.useEffect)(function () {
        if (isFormSubmitted && saveSuccess) {
            _reactHotToast.toast.success((0, _useTranslation2.default)("Settings saved. The browser will refresh after 5 seconds."));
            (0, _misc.refreshPage)(5000);
        }

        if (isFormSubmitted && saveError !== null) {
            _reactHotToast.toast.error(saveError);
        }

        if (isFormSubmitted) {
            setFormSubmitted(false);
        }
    }, [saveLoading]);

    var handleFlushCache = function handleFlushCache() {
        (0, _ajax.wpAjaxRequest)("flushCacheAction", {}).then(function (res) {
            if (res.success === true) {
                _reactHotToast.toast.success((0, _useTranslation2.default)("Cache was successfully flushed"));
            } else {
                _reactHotToast.toast.error(res.error);
            }
        }).catch(function (err) {
            return console.error(err);
        });
    };

    var buttons = [wp.element.createElement(
        _Button2.default,
        {
            testId: "save-settings",
            style: _styles.styleVariants.PRIMARY,
            disabled: !!(!isValid || saveLoading)
        },
        saveLoading ? (0, _useTranslation2.default)('Loading...') : (0, _useTranslation2.default)('Save')
    )];

    return wp.element.createElement(
        "form",
        { onSubmit: handleSubmit(onSubmit) },
        wp.element.createElement(
            _Layout2.default,
            {
                crumbs: [{
                    label: (0, _useTranslation2.default)("Settings")
                }],
                title: (0, _useTranslation2.default)("Settings"),
                actions: buttons
            },
            wp.element.createElement(
                "div",
                { className: "flex-column s-24" },
                wp.element.createElement(
                    _Card2.default,
                    { title: (0, _useTranslation2.default)("General settings") },
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("Language"),
                        value: wp.element.createElement(_Select2.default, {
                            id: "language",
                            label: (0, _useTranslation2.default)("Language"),
                            placeholder: (0, _useTranslation2.default)("Set the language of the plug-in"),
                            description: (0, _useTranslation2.default)("Set the language of the plug-in"),
                            register: register,
                            defaultValue: languageDefaultValue,
                            values: settings.globals.available_languages,
                            isRequired: true,
                            errors: errors,
                            validate: {
                                required: "This field is mandatory"
                            }
                        })
                    }),
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("Font"),
                        value: wp.element.createElement(_Select2.default, {
                            id: "font",
                            label: (0, _useTranslation2.default)("Font"),
                            placeholder: (0, _useTranslation2.default)("Set the font of the plug-in"),
                            description: (0, _useTranslation2.default)("Set the font of the plug-in"),
                            register: register,
                            defaultValue: languageDefaultValue,
                            values: _fonts.fontList,
                            isRequired: true,
                            errors: errors,
                            validate: {
                                required: "This field is mandatory"
                            }
                        })
                    }),
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("Records per page"),
                        value: wp.element.createElement(_Input2.default, {
                            type: "number",
                            id: "records_per_page",
                            description: (0, _useTranslation2.default)("Set the number of records per page in your ACPT dashboards."),
                            register: register,
                            errors: errors,
                            isRequired: true,
                            min: 1,
                            max: 200,
                            validate: {
                                required: "This field is mandatory"
                            }
                        })
                    })
                ),
                wp.element.createElement(
                    _Card2.default,
                    { title: (0, _useTranslation2.default)("Performances") },
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("Enable ACPT cache"),
                        value: wp.element.createElement(_Toggle2.default, {
                            id: "enable_cache",
                            description: (0, _useTranslation2.default)("Enable the ACPT cache. The cache stores the MySQL results in simple textual files to avoid useless DB calls."),
                            register: register,
                            errors: errors,
                            defaultValue: enableCacheDefaultValue
                        })
                    }),
                    enableCacheDefaultValue ? wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("Flush the ACPT cache"),
                        value: wp.element.createElement(
                            _Button2.default,
                            {
                                style: _styles.styleVariants.SECONDARY,
                                onClick: function onClick(e) {
                                    e.preventDefault();
                                    handleFlushCache();
                                }
                            },
                            (0, _useTranslation2.default)("Flush cache")
                        )
                    }) : null
                ),
                wp.element.createElement(
                    _Card2.default,
                    { title: (0, _useTranslation2.default)("Danger zone") },
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("Delete ACPT definitions when deactivate the plug-in"),
                        value: wp.element.createElement(_Toggle2.default, {
                            id: "delete_tables_when_deactivate",
                            description: (0, _useTranslation2.default)("Delete all saved ACPT definitions when you deactivate the plug-in. This means that if you select NO when you deactivate and then reactivate the plug-in you will find all the previously saved ACPT definitions (meta fields, options etc.)"),
                            register: register,
                            errors: errors,
                            defaultValue: deleteDefinitionsDefaultValue
                        })
                    }),
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("Delete posts when delete an ACPT post definition"),
                        value: wp.element.createElement(_Toggle2.default, {
                            id: "delete_posts",
                            description: (0, _useTranslation2.default)("   Delete posts when delete an ACPT post type definition. This means that if you select YES, when you delete an ACPT post type definition all the saved posts will be deleted"),
                            register: register,
                            errors: errors,
                            defaultValue: deletePostsDefaultValue
                        })
                    }),
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("Delete metadata when delete an ACPT field"),
                        value: wp.element.createElement(_Toggle2.default, {
                            id: "delete_metadata",
                            description: (0, _useTranslation2.default)("Delete post metadata when deleting an ACPT field. This means that if you select YES, when you delete an ACPT meta field all the saved metadata will be deleted"),
                            register: register,
                            errors: errors,
                            defaultValue: deleteMetadataDefaultValue
                        })
                    })
                )
            )
        )
    );
};

exports.default = Settings;

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
//# sourceMappingURL=821.js.map