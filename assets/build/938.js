(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[938],{

/***/ 4938:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _misc = __webpack_require__(3154);

var _Breadcrumbs = __webpack_require__(7993);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _reactRedux = __webpack_require__(4494);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _saveSettings = __webpack_require__(9210);

var _reactHookForm = __webpack_require__(930);

var _lists = __webpack_require__(3021);

var _languages = __webpack_require__(9504);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _ReactSelect = __webpack_require__(2762);

var _ReactSelect2 = _interopRequireDefault(_ReactSelect);

var _InputNumber = __webpack_require__(1759);

var _InputNumber2 = _interopRequireDefault(_InputNumber);

var _objects = __webpack_require__(4040);

var _reactToastify = __webpack_require__(9249);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Settings = function Settings() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.saveSettingsReducer;
    }),
        saveErrors = _useSelector.errors,
        saveSuccess = _useSelector.success,
        saveLoading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchSettingsReducer;
    }),
        loading = _useSelector2.loading,
        fetched = _useSelector2.fetched;

    var dispatch = (0, _reactRedux.useDispatch)();

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isFormSubmitted = _useState2[0],
        setFormSubmitted = _useState2[1];

    // form & handle form functions

    var onSubmit = function onSubmit(data) {
        dispatch((0, _saveSettings.saveSettings)({
            records_per_page: data.records_per_page,
            delete_tables_when_deactivate: data.delete_tables_when_deactivate.value,
            delete_posts: data.delete_posts.value,
            delete_metadata: data.delete_metadata.value,
            language: data.language.value
        }));
        setFormSubmitted(true);
    };

    (0, _react.useEffect)(function () {
        if (isFormSubmitted && saveSuccess) {
            _reactToastify.toast.success("Settings saved.");
        }

        if (isFormSubmitted && saveErrors.length > 0) {
            saveErrors.map(function (error) {
                return _reactToastify.toast.error(error);
            });
        }

        if (isFormSubmitted) {
            setFormSubmitted(false);
        }
    }, [saveLoading]);

    var deletePostsDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'delete_posts') !== 'undefined' ? (0, _objects.filterByValue)(_lists.yesOrNoList, (0, _objects.filterByLabel)(fetched, 'key', 'delete_posts').value) : { label: "Select", value: null };
    var deleteMetadataDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'delete_metadata') !== 'undefined' ? (0, _objects.filterByValue)(_lists.yesOrNoList, (0, _objects.filterByLabel)(fetched, 'key', 'delete_metadata').value) : { label: "Select", value: null };
    var deleteDefinitionsDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'delete_tables_when_deactivate') !== 'undefined' ? (0, _objects.filterByValue)(_lists.yesOrNoList, (0, _objects.filterByLabel)(fetched, 'key', 'delete_tables_when_deactivate').value) : { label: "Select", value: null };
    var perPageDefaultValue = fetched.length > 0 && (0, _objects.filterByLabel)(fetched, 'key', 'records_per_page') !== '' ? (0, _objects.filterByLabel)(fetched, 'key', 'records_per_page').value : 20;
    var languageDefaultValue = fetched.length > 0 && typeof (0, _objects.filterByLabel)(fetched, 'key', 'language').value !== 'undefined' ? (0, _objects.filterByValue)(_languages.lanuagesList, (0, _objects.filterByLabel)(fetched, 'key', 'language').value) : { value: 'en', label: "English" };

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all',
        defaultValues: {
            delete_metadata: deleteMetadataDefaultValue,
            delete_posts: deletePostsDefaultValue,
            delete_tables_when_deactivate: deleteDefinitionsDefaultValue,
            records_per_page: perPageDefaultValue,
            language: languageDefaultValue
        }
    }),
        control = _useForm.control,
        register = _useForm.register,
        handleSubmit = _useForm.handleSubmit,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid;

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)("Settings page");
        (0, _misc.changeCurrentAdminMenuLink)('#/settings');
    }, []);

    if (loading) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    var submitButton = wp.element.createElement(
        "button",
        {
            className: "acpt-btn acpt-btn-primary",
            disabled: !isValid || loading ? 'disabled' : ''
        },
        loading ? 'Loading...' : 'Save'
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(
            "form",
            { onSubmit: handleSubmit(onSubmit) },
            wp.element.createElement(_ActionsBar2.default, {
                title: "Settings",
                actions: submitButton
            }),
            wp.element.createElement(
                "main",
                null,
                wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                        label: "Advanced custom post types",
                        link: "/"
                    }, {
                        label: "Settings"
                    }] }),
                wp.element.createElement(
                    "div",
                    { className: "acpt-card" },
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__header" },
                        wp.element.createElement(
                            "div",
                            { className: "acpt-card__inner" },
                            "Your favourite ACPT Lite settings"
                        )
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        wp.element.createElement(
                            "fieldset",
                            null,
                            wp.element.createElement(
                                "legend",
                                null,
                                "General settings"
                            ),
                            wp.element.createElement(_ReactSelect2.default, {
                                id: "language",
                                label: "Language",
                                placeholder: "Set the language of the plug-in",
                                description: "Set the language of the plug-in",
                                control: control,
                                defaultValue: languageDefaultValue,
                                values: _languages.lanuagesList,
                                isRequired: true,
                                validate: {
                                    required: "This field is mandatory"
                                }
                            }),
                            wp.element.createElement(_InputNumber2.default, {
                                id: "records_per_page",
                                label: "Records per page",
                                placeholder: "Records per page in ACPT dashboards",
                                defaultValue: perPageDefaultValue,
                                description: "Set the number of records per page in your ACPT dashboards.",
                                register: register,
                                errors: errors,
                                isRequired: true,
                                min: 1,
                                max: 200
                            })
                        ),
                        wp.element.createElement(
                            "fieldset",
                            null,
                            wp.element.createElement(
                                "legend",
                                null,
                                "Danger zone"
                            ),
                            wp.element.createElement(_ReactSelect2.default, {
                                id: "delete_tables_when_deactivate",
                                label: "Delete ACPT definitions when deactivate the plug-in",
                                placeholder: "Delete ACPT definitions when deactivate the plug-in",
                                description: "Delete all saved ACPT definitions when you deactivate the plug-in. This means that if you select NO when you deactivate and then reactivate the plug-in you will find all the previously saved ACPT definitions (meta fields, options etc.)",
                                control: control,
                                defaultValue: deleteDefinitionsDefaultValue,
                                values: _lists.yesOrNoList,
                                isRequired: true,
                                validate: {
                                    required: "This field is mandatory"
                                }
                            }),
                            wp.element.createElement(_ReactSelect2.default, {
                                id: "delete_posts",
                                label: "Delete posts when delete an ACPT post definition",
                                placeholder: "Delete posts when delete an ACPT post definition",
                                description: "Delete posts when delete an ACPT post type definition. This means that if you select YES, when you delete an ACPT post type definition all the saved posts will be deleted",
                                control: control,
                                defaultValue: deletePostsDefaultValue,
                                values: _lists.yesOrNoList,
                                isRequired: true,
                                validate: {
                                    required: "This field is mandatory"
                                }
                            }),
                            wp.element.createElement(_ReactSelect2.default, {
                                id: "delete_metadata",
                                label: "Delete metadata when delete an ACPT field",
                                placeholder: "Delete post metadata when deleting ACPT fields",
                                description: "Delete post metadata when deleting an ACPT field. This means that if you select YES, when you delete an ACPT meta field all the saved metadata will be deleted",
                                control: control,
                                defaultValue: deleteMetadataDefaultValue,
                                values: _lists.yesOrNoList,
                                isRequired: true,
                                validate: {
                                    required: "This field is mandatory"
                                }
                            })
                        )
                    )
                )
            )
        )
    );
};

exports.default = Settings;

/***/ }),

/***/ 1759:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputNumber = function InputNumber(_ref) {
    var id = _ref.id,
        label = _ref.label,
        placeholder = _ref.placeholder,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors,
        min = _ref.min,
        max = _ref.max,
        step = _ref.step,
        isRequired = _ref.isRequired,
        description = _ref.description,
        wizard = _ref.wizard;


    var error = errors[id];

    return wp.element.createElement(
        "div",
        { className: "acpt-form-group" },
        wp.element.createElement(
            "div",
            { className: "acpt-form-label-wrapper" },
            wp.element.createElement(
                "label",
                { htmlFor: id },
                label,
                isRequired && wp.element.createElement(
                    "span",
                    { className: "required" },
                    "*"
                )
            ),
            wizard && wp.element.createElement("span", { className: "wizard", dangerouslySetInnerHTML: { __html: wizard } })
        ),
        wp.element.createElement(
            "div",
            { className: "acpt-form-control-wrapper" },
            wp.element.createElement("input", _extends({
                id: id,
                name: id,
                type: "number",
                min: min ? min : 0,
                max: max,
                step: step ? min : 1,
                placeholder: placeholder,
                required: isRequired,
                "aria-invalid": error ? "true" : "false",
                className: "acpt-form-control " + (error ? 'has-errors' : '')
            }, register(id, validate))),
            description && wp.element.createElement(
                "span",
                { className: "description" },
                description
            ),
            error && wp.element.createElement(
                "div",
                { className: "invalid-feedback" },
                error.message
            )
        )
    );
};

exports.default = InputNumber;

/***/ }),

/***/ 2762:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _reactSelect = __webpack_require__(3442);

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactSelect = function ReactSelect(_ref) {
    var id = _ref.id,
        label = _ref.label,
        validate = _ref.validate,
        control = _ref.control,
        values = _ref.values,
        defaultValue = _ref.defaultValue,
        isRequired = _ref.isRequired,
        description = _ref.description,
        wizard = _ref.wizard;


    return wp.element.createElement(
        "div",
        { className: "acpt-form-group" },
        wp.element.createElement(
            "div",
            { className: "acpt-form-label-wrapper" },
            wp.element.createElement(
                "label",
                { htmlFor: id },
                label,
                isRequired && wp.element.createElement(
                    "span",
                    { className: "required" },
                    "*"
                )
            ),
            wizard && wp.element.createElement("span", { className: "wizard", dangerouslySetInnerHTML: { __html: wizard } })
        ),
        wp.element.createElement(
            "div",
            { className: "acpt-form-control-wrapper" },
            wp.element.createElement(_reactHookForm.Controller, {
                id: id,
                control: control,
                name: id,
                rules: validate,
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
                        error = _ref2$fieldState.error,
                        formState = _ref2.formState;
                    return wp.element.createElement(
                        "div",
                        null,
                        wp.element.createElement(_reactSelect2.default, {
                            defaultValue: defaultValue,
                            styles: _styles.reactSelectStyles,
                            classNamePrefix: "addl-class",
                            onBlur: onBlur,
                            onChange: onChange,
                            checked: value,
                            inputRef: ref,
                            options: values
                        }),
                        error && wp.element.createElement(
                            "div",
                            { className: "invalid-feedback" },
                            error.message
                        )
                    );
                }
            }),
            description && wp.element.createElement(
                "span",
                { className: "description" },
                description
            )
        )
    );
};

exports.default = ReactSelect;

/***/ }),

/***/ 9504:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var lanuagesList = exports.lanuagesList = [{ value: 'en', label: "English" }];

/***/ }),

/***/ 3021:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var yesOrNoList = exports.yesOrNoList = [{ label: "Yes", value: "1" }, { label: "No", value: "0" }];

/***/ }),

/***/ 9210:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.saveSettings = undefined;

var _ajax = __webpack_require__(7569);

var _saveSettingsActions = __webpack_require__(42);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var saveSettings = exports.saveSettings = function saveSettings(data) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _saveSettingsActions.saveSettingsInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('saveSettingsAction', data);

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _saveSettingsActions.saveSettingsSuccess)(res.data)) : dispatch((0, _saveSettingsActions.saveSettingsFailure)(res.error));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _saveSettingsActions.saveSettingsFailure)(_context.t0));

                        case 11:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[0, 8]]);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }();
};

/***/ }),

/***/ 3154:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/**
 * Change document's <title>
 * @param title
 */
var metaTitle = exports.metaTitle = function metaTitle(title) {
    var originalDocumentTitle = document.title.split("‹");
    document.title = title + ' \u2039 ' + originalDocumentTitle[1];
};

/**
 * Add current class to admin menu link
 * @param link
 */
var changeCurrentAdminMenuLink = exports.changeCurrentAdminMenuLink = function changeCurrentAdminMenuLink(link) {

    var menuWrapper = document.querySelector('#toplevel_page_advanced-custom-post-type-lite .wp-submenu');

    menuWrapper.childNodes.forEach(function (currentValue, currentIndex, listObj) {
        var links = currentValue.getElementsByTagName('a');

        for (var i = 0; i < links.length; i++) {
            var elem = links[i];
            var href = elem.getAttribute("href");
            var toCompare = 'admin.php?page=advanced-custom-post-type-lite' + link;

            if (toCompare === href) {
                currentValue.classList.add("current");
            } else {
                currentValue.classList.remove("current");
            }
        }
    });
};

var refreshPage = exports.refreshPage = function refreshPage() {
    var timeout = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

    setTimeout(function () {
        window.location.reload();
    }, timeout);
};

/***/ })

}]);
//# sourceMappingURL=938.js.map