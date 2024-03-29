(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[778],{

/***/ 1220:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.WooCommerceFieldsList = exports.TEXTAREA = exports.TEXT = exports.SELECT = exports.RADIO = exports.CHECKBOX = undefined;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CHECKBOX = exports.CHECKBOX = 'Checkbox';
var RADIO = exports.RADIO = 'Radio';
var SELECT = exports.SELECT = 'Select';
var TEXT = exports.TEXT = 'Text';
var TEXTAREA = exports.TEXTAREA = 'Textarea';

// export const WooCommerceFieldsList = [
//     { value: TEXT, label: <div className="vertical-center"><Icon icon="bx:bx-text" width="18px" /> &nbsp; Text</div> },
//     { value: TEXTAREA, label: <div className="vertical-center"><Icon icon="bx:bx-pen" width="18px" /> &nbsp; Textarea</div> },
//     { value: SELECT, label: <div className="vertical-center"><Icon icon="bx:bx-select-multiple" width="18px" /> &nbsp; Select</div> },
//     { value: CHECKBOX, label: <div className="vertical-center"><Icon icon="bx:bx-checkbox-checked" width="18px" /> &nbsp; Checkbox</div> },
//     { value: RADIO, label: <div className="vertical-center"><Icon icon="bx:bx-radio-circle-marked" width="18px" /> &nbsp; Radio</div> },
// ];

var WooCommerceFieldsList = exports.WooCommerceFieldsList = [{ value: TEXT, label: "Text" }, { value: TEXTAREA, label: "Textarea" }, { value: SELECT, label: "Select" }, { value: CHECKBOX, label: "Checkbox" }, { value: RADIO, label: "Radio" }];

/***/ }),

/***/ 6460:
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

var _productDataFieldsStateSlice = __webpack_require__(2118);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ElementSelector = function ElementSelector(_ref) {
    var element = _ref.element;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.productDataFieldsState;
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
                    dispatch((0, _productDataFieldsStateSlice.selectElement)({
                        element: element,
                        selected: e.target.checked
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
    element: _propTypes2.default.object.isRequired
};

exports.default = ElementSelector;

/***/ }),

/***/ 3067:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(6706);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _styles = __webpack_require__(624);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _productDataFieldsStateSlice = __webpack_require__(2118);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactHookForm = __webpack_require__(930);

var _cloners = __webpack_require__(6118);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BulkActions = function BulkActions(_ref) {
    var view = _ref.view,
        setFieldTab = _ref.setFieldTab;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.productDataFieldsState;
    }),
        selectedElements = _useSelector.selectedElements;

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control,
        setValue = _useFormContext.setValue,
        getValues = _useFormContext.getValues;

    var watchedFields = (0, _reactHookForm.useWatch)({
        control: control,
        name: "fields"
    });

    // manage local state
    var ref = (0, _react.useRef)(null);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        action = _useState2[0],
        setAction = _useState2[1];

    var executeAction = function executeAction() {
        selectedElements.map(function (element) {

            var fieldIndex = watchedFields.findIndex(function (b) {
                return b.id === element.id;
            });
            var watchedField = watchedFields[fieldIndex];

            switch (action) {

                // duplicate
                case "duplicate":
                    var duplicatedField = (0, _cloners.cloneWCField)(watchedField);

                    watchedFields.push(duplicatedField);
                    setValue("fields", watchedFields);
                    dispatch((0, _productDataFieldsStateSlice.addField)({ field: duplicatedField }));

                    break;

                // delete
                case "delete":
                    var deletedField = _extends({}, watchedField);
                    var fields = getValues("fields").filter(function (f) {
                        return f.id !== element.id;
                    });
                    setValue("fields", fields);

                    if (setFieldTab) {
                        setFieldTab(0);
                    }

                    dispatch((0, _productDataFieldsStateSlice.deleteField)({ field: deletedField }));

                    break;
            }
        });

        if (action === 'delete' || action === 'duplicate') {
            dispatch((0, _productDataFieldsStateSlice.deselectAllElements)());
        }

        ref.current.value = "";
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        selectedElements.length > 0 && wp.element.createElement(
            "div",
            { className: "flex-between mb-24" },
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
    setFieldTab: _propTypes2.default.func
};

exports.default = BulkActions;

/***/ }),

/***/ 4592:
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

var _scroll = __webpack_require__(2727);

var _styles = __webpack_require__(624);

var _Badge = __webpack_require__(3136);

var _Badge2 = _interopRequireDefault(_Badge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuickNavigationField = function QuickNavigationField(_ref) {
    var field = _ref.field,
        index = _ref.index;

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var watchedBoxName = (0, _reactHookForm.useWatch)({
        control: control,
        name: "fields." + index + ".name"
    });

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            { className: "tree-el flex-between s-8", style: { "--level": 0 } },
            wp.element.createElement(
                "span",
                {
                    className: "text-ellipsis cursor-pointer",
                    onClick: function onClick(e) {
                        e.preventDefault();
                        (0, _scroll.scrollToId)("lazy-" + field.id);
                    }
                },
                watchedBoxName ? watchedBoxName : field.name
            ),
            wp.element.createElement(
                _Badge2.default,
                { style: _styles.styleVariants.SECONDARY },
                "F"
            )
        )
    );
};

QuickNavigationField.propTypes = {
    field: _propTypes2.default.object.isRequired,
    index: _propTypes2.default.number.isRequired
};

exports.default = QuickNavigationField;

/***/ }),

/***/ 9094:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _QuickNavigationField = __webpack_require__(4592);

var _QuickNavigationField2 = _interopRequireDefault(_QuickNavigationField);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var QuickNavigation = function QuickNavigation(_ref) {
    var fields = _ref.fields;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    if (fields.length === 0) {
        return null;
    }

    return wp.element.createElement(
        "div",
        { className: "b-rounded with-shadow bg-white p-24" },
        wp.element.createElement(
            "h3",
            { className: "mb-24 flex-between s-8" },
            wp.element.createElement(
                "span",
                { className: "text-ellipsis cursor-pointer" },
                (0, _useTranslation2.default)("product data fields")
            )
        ),
        wp.element.createElement(
            "div",
            { className: "tree " + (globals.is_rtl === true ? "rtl" : "") },
            fields.map(function (field, index) {
                return wp.element.createElement(_QuickNavigationField2.default, {
                    index: index,
                    field: field
                });
            })
        )
    );
};

QuickNavigation.propTypes = {
    fields: _propTypes2.default.array.isRequired
};

exports.default = QuickNavigation;

/***/ }),

/***/ 9316:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _SwitchView = __webpack_require__(6973);

var _SwitchView2 = _interopRequireDefault(_SwitchView);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _styles = __webpack_require__(624);

var _SortableList = __webpack_require__(5557);

var _SortableList2 = _interopRequireDefault(_SortableList);

var _ProductDataField = __webpack_require__(8785);

var _ProductDataField2 = _interopRequireDefault(_ProductDataField);

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _sortable = __webpack_require__(9125);

var _productDataFieldsStateSlice = __webpack_require__(2118);

var _QuickNavigation = __webpack_require__(9094);

var _QuickNavigation2 = _interopRequireDefault(_QuickNavigation);

var _BulkActions = __webpack_require__(3067);

var _BulkActions2 = _interopRequireDefault(_BulkActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListView = function ListView(_ref) {
    var fields = _ref.fields,
        view = _ref.view,
        setView = _ref.setView,
        setActiveTab = _ref.setActiveTab;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: "fields"
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

        dispatch((0, _productDataFieldsStateSlice.setFields)(sortedFields));
    };

    return wp.element.createElement(
        "div",
        { className: "container" },
        wp.element.createElement(
            "div",
            { className: "col-3 flex-column s-24 hidden-xs sticky", style: {
                    top: "200px"
                } },
            wp.element.createElement(_QuickNavigation2.default, { fields: fields })
        ),
        wp.element.createElement(
            "div",
            { className: "col-9" },
            wp.element.createElement(
                "div",
                { className: "flex-between mb-24 s-8 for-xs" },
                wp.element.createElement(
                    "h3",
                    null,
                    (0, _useTranslation2.default)("Manage product data fields")
                ),
                wp.element.createElement(
                    "div",
                    { className: "i-flex-center s-8" },
                    wp.element.createElement(_SwitchView2.default, {
                        localStorageKey: "wc_fields_manage_view",
                        setView: setView,
                        view: view
                    })
                )
            ),
            wp.element.createElement(_BulkActions2.default, {
                view: "list"
            }),
            fields.length > 0 ? wp.element.createElement(
                _SortableList2.default,
                {
                    onDragEnd: handleDragEnd,
                    items: fields
                },
                wp.element.createElement(
                    "div",
                    { className: "flex-column s-24" },
                    fields.map(function (field, index) {
                        return wp.element.createElement(_ProductDataField2.default, {
                            index: index,
                            key: field.id,
                            view: "list",
                            field: field
                        });
                    })
                )
            ) : wp.element.createElement(
                _Alert2.default,
                { style: _styles.styleVariants.WARNING },
                (0, _useTranslation2.default)('No fields already created. Create the first one now by clicking the button "Add field"!')
            )
        )
    );
};

ListView.propTypes = {
    view: _propTypes2.default.string.isRequired,
    setView: _propTypes2.default.func.isRequired,
    fields: _propTypes2.default.array.isRequired,
    setActiveTab: _propTypes2.default.func.isRequired
};

exports.default = ListView;

/***/ }),

/***/ 6036:
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

var _reactHookForm = __webpack_require__(930);

var _productDataFieldsStateSlice = __webpack_require__(2118);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteAllFieldsModal = function DeleteAllFieldsModal() {

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        setValue = _useFormContext.setValue;

    // manage local state


    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    var buttons = [wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.SUCCESS, onClick: function onClick(e) {
                e.preventDefault();
                dispatch((0, _productDataFieldsStateSlice.deleteAllFields)());
                setValue("fields", []);
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

exports.default = DeleteAllFieldsModal;

/***/ }),

/***/ 7877:
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

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _productDataFieldsStateSlice = __webpack_require__(2118);

var _react3 = __webpack_require__(4226);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteProductDataFieldModal = function DeleteProductDataFieldModal(_ref) {
    var field = _ref.field,
        index = _ref.index;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: "fields"
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
                dispatch((0, _productDataFieldsStateSlice.deleteField)({ field: field }));
                remove(index);
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
                    setModalOpen(!modalOpen);;
                }
            },
            wp.element.createElement(_react3.Icon, { icon: "bx-trash", width: 18 })
        )
    );
};

DeleteProductDataFieldModal.propTypes = {
    index: _propTypes2.default.number.isRequired,
    field: _propTypes2.default.object.isRequired
};

exports.default = DeleteProductDataFieldModal;

/***/ }),

/***/ 2111:
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

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _productDataFieldsStateSlice = __webpack_require__(2118);

var _react3 = __webpack_require__(4226);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteProductDataFieldOptionModal = function DeleteProductDataFieldOptionModal(_ref) {
    var fieldIndex = _ref.fieldIndex,
        optionIndex = _ref.optionIndex;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var formId = function formId() {
        return "fields." + fieldIndex + ".options";
    };

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: formId()
    }),
        remove = _useFieldArray.remove;

    // mange local state


    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    var buttons = [wp.element.createElement(
        _Button2.default,
        { style: _styles.styleVariants.SUCCESS, onClick: function onClick(e) {
                e.preventDefault();
                dispatch((0, _productDataFieldsStateSlice.deleteOption)({ fieldIndex: fieldIndex, optionIndex: optionIndex }));
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

DeleteProductDataFieldOptionModal.propTypes = {
    fieldIndex: _propTypes2.default.number.isRequired,
    optionIndex: _propTypes2.default.number.isRequired
};

exports.default = DeleteProductDataFieldOptionModal;

/***/ }),

/***/ 4145:
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

var _react3 = __webpack_require__(4226);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _localStorage = __webpack_require__(1500);

var _productDataFieldsStateSlice = __webpack_require__(2118);

var _reactRedux = __webpack_require__(6706);

var _MetaFieldType = __webpack_require__(1436);

var _MetaFieldType2 = _interopRequireDefault(_MetaFieldType);

var _ButtonSwitch = __webpack_require__(9804);

var _ButtonSwitch2 = _interopRequireDefault(_ButtonSwitch);

var _DeleteProductDataFieldModal = __webpack_require__(7877);

var _DeleteProductDataFieldModal2 = _interopRequireDefault(_DeleteProductDataFieldModal);

var _cloners = __webpack_require__(6118);

var _misc = __webpack_require__(3154);

var _scroll = __webpack_require__(2727);

var _ElementSelector = __webpack_require__(6460);

var _ElementSelector2 = _interopRequireDefault(_ElementSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductDataFieldHeader = function ProductDataFieldHeader(_ref) {
    var field = _ref.field,
        view = _ref.view,
        listeners = _ref.listeners,
        attributes = _ref.attributes,
        index = _ref.index,
        formId = _ref.formId;

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

    var watchedIsRequired = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("isRequired")
    });

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: "fields"
    }),
        append = _useFieldArray.append;

    // manage global state


    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.productDataFieldsState;
    }),
        closedElements = _useSelector.closedElements;

    /**
     *
     * @return {boolean}
     */


    var isClosed = function isClosed() {
        var filter = closedElements.filter(function (e) {
            return e === page.id;
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
     * Toggle close box
     */
    var handleToggleClose = function handleToggleClose() {
        (0, _localStorage.saveIsClosed)(field.id);

        if (isClosed()) {
            dispatch((0, _productDataFieldsStateSlice.showElement)({ id: field.id }));
        } else {
            dispatch((0, _productDataFieldsStateSlice.hideElement)({ id: field.id }));
        }
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
            wp.element.createElement(_ElementSelector2.default, {
                element: {
                    id: field.id
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
            wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(
                    "a",
                    {
                        href: "#",
                        onClick: function onClick(e) {
                            e.preventDefault();
                            var duplicatedField = (0, _cloners.cloneWCField)(field);
                            dispatch((0, _productDataFieldsStateSlice.addField)({ field: duplicatedField }));
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
            wp.element.createElement(_Tooltip2.default, {
                label: wp.element.createElement(_DeleteProductDataFieldModal2.default, {
                    index: index,
                    field: field
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
};

ProductDataFieldHeader.propTypes = {
    index: _propTypes2.default.number.isRequired,
    field: _propTypes2.default.object.isRequired,
    listeners: _propTypes2.default.func,
    attributes: _propTypes2.default.func,
    formId: _propTypes2.default.func.isRequired,
    view: _propTypes2.default.oneOf(["list", "tabular"]).isRequired
};

exports.default = ProductDataFieldHeader;

/***/ }),

/***/ 9330:
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

var _sortable = __webpack_require__(9125);

var _utilities = __webpack_require__(4285);

var _InputHidden = __webpack_require__(5978);

var _InputHidden2 = _interopRequireDefault(_InputHidden);

var _react3 = __webpack_require__(4226);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _DeleteProductDataFieldOptionModal = __webpack_require__(2111);

var _DeleteProductDataFieldOptionModal2 = _interopRequireDefault(_DeleteProductDataFieldOptionModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductDataFieldOption = (0, _react.memo)(function (_ref) {
    var index = _ref.index,
        fieldIndex = _ref.fieldIndex,
        fieldId = _ref.fieldId,
        option = _ref.option;


    // manage form state
    var formId = function formId(value) {
        return "fields." + fieldIndex + ".options." + index + "." + value;
    };

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register,
        errors = _useFormContext.formState.errors,
        control = _useFormContext.control,
        setValue = _useFormContext.setValue;

    var watchedValue = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("value")
    });
    var watchedLabel = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("label")
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
            { className: "i-flex-center s-24 w-100" },
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
                            setValue(formId("label"), null);
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
                null,
                wp.element.createElement(
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
                )
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
                            setValue(formId("value"), null);
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
            wp.element.createElement(_DeleteProductDataFieldOptionModal2.default, {
                fieldIndex: fieldIndex,
                optionIndex: index
            })
        )
    );
});

ProductDataFieldOption.propTypes = {
    fieldId: _propTypes2.default.string.isRequired,
    index: _propTypes2.default.number.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    option: _propTypes2.default.object.isRequired
};

exports.default = ProductDataFieldOption;

/***/ }),

/***/ 1750:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _uuid = __webpack_require__(1614);

var _productDataFieldsStateSlice = __webpack_require__(2118);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _styles = __webpack_require__(624);

var _SortableList = __webpack_require__(5557);

var _SortableList2 = _interopRequireDefault(_SortableList);

var _ProductDataFieldOption = __webpack_require__(9330);

var _ProductDataFieldOption2 = _interopRequireDefault(_ProductDataFieldOption);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductDataFieldOptionsList = function ProductDataFieldOptionsList(_ref) {
    var fieldId = _ref.fieldId,
        fieldIndex = _ref.fieldIndex,
        options = _ref.options;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage form state
    var formId = function formId() {
        return "fields." + fieldIndex + ".options";
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

        var oldIndex = options.findIndex(function (option) {
            return option.id === active.id;
        });
        var newIndex = options.findIndex(function (option) {
            return option.id === over.id;
        });
        move(oldIndex, newIndex);
    };

    /**
     * Add new option
     */
    var handleAddOption = function handleAddOption() {

        var option = {
            id: (0, _uuid.v4)(),
            fieldId: fieldId,
            label: 'option',
            value: 'option'
        };

        dispatch((0, _productDataFieldsStateSlice.addOption)({ fieldIndex: fieldIndex, option: option }));
    };

    return wp.element.createElement(
        "div",
        null,
        wp.element.createElement(
            "fieldset",
            { className: "acpt-fieldset" },
            wp.element.createElement(
                "legend",
                null,
                (0, _useTranslation2.default)("Option list")
            ),
            options && options.length > 0 ? wp.element.createElement(
                _SortableList2.default,
                {
                    onDragEnd: handleDragEnd,
                    items: options
                },
                wp.element.createElement(
                    "div",
                    { className: "flex-column s-24" },
                    options && options.map(function (option, index) {
                        return wp.element.createElement(_ProductDataFieldOption2.default, {
                            index: index,
                            fieldIndex: fieldIndex,
                            fieldId: fieldId,
                            option: option
                        });
                    })
                )
            ) : wp.element.createElement(
                _Alert2.default,
                { style: _styles.styleVariants.WARNING },
                (0, _useTranslation2.default)('No options already created. Create the first one now by clicking the button "Add option"!')
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

ProductDataFieldOptionsList.propTypes = {
    fieldId: _propTypes2.default.string.isRequired,
    fieldIndex: _propTypes2.default.number.isRequired,
    options: _propTypes2.default.array.isRequired
};

exports.default = ProductDataFieldOptionsList;

/***/ }),

/***/ 8785:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _sortable = __webpack_require__(9125);

var _utilities = __webpack_require__(4285);

var _reactHookForm = __webpack_require__(930);

var _reactRedux = __webpack_require__(6706);

var _InputHidden = __webpack_require__(5978);

var _InputHidden2 = _interopRequireDefault(_InputHidden);

var _Label = __webpack_require__(7115);

var _Label2 = _interopRequireDefault(_Label);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _ProductDataFieldHeader = __webpack_require__(4145);

var _ProductDataFieldHeader2 = _interopRequireDefault(_ProductDataFieldHeader);

var _Select = __webpack_require__(4003);

var _Select2 = _interopRequireDefault(_Select);

var _woocommerce_fields = __webpack_require__(1220);

var _ProductDataFieldOptionsList = __webpack_require__(1750);

var _ProductDataFieldOptionsList2 = _interopRequireDefault(_ProductDataFieldOptionsList);

var _LazyElement = __webpack_require__(5221);

var _LazyElement2 = _interopRequireDefault(_LazyElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductDataField = function ProductDataField(_ref) {
    var field = _ref.field,
        index = _ref.index,
        view = _ref.view;

    // DND-kit
    var _useSortable = (0, _sortable.useSortable)({ id: field.id }),
        attributes = _useSortable.attributes,
        listeners = _useSortable.listeners,
        setNodeRef = _useSortable.setNodeRef,
        transform = _useSortable.transform;

    var style = {
        transform: _utilities.CSS.Translate.toString(transform)
    };

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.productDataFieldsState;
    }),
        closedElements = _useSelector.closedElements;

    // manage form state


    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register,
        errors = _useFormContext.formState.errors,
        control = _useFormContext.control,
        setValue = _useFormContext.setValue;

    /**
     *
     * @param value
     * @return {string}
     */


    var formId = function formId(value) {
        return "fields." + index + "." + value;
    };

    var watchedType = (0, _reactHookForm.useWatch)({
        control: control,
        name: formId("type")
    });

    var fieldType = function fieldType() {
        return watchedType ? watchedType : field.type;
    };

    var fieldHasOptions = function fieldHasOptions(fieldType) {
        return fieldType === _woocommerce_fields.SELECT || fieldType === _woocommerce_fields.RADIO;
    };

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

    return wp.element.createElement(_LazyElement2.default, {
        id: field.id,
        element: wp.element.createElement(
            "div",
            { id: field.id, className: "bg-white b-rounded " + (view === 'list' ? "p-24" : ""), ref: view === 'list' ? setNodeRef : null, style: view === 'list' ? style : null },
            wp.element.createElement(_InputHidden2.default, {
                id: formId("id"),
                value: field.id,
                register: register
            }),
            wp.element.createElement(
                "div",
                { className: view === 'tabular' || !isClosed() && view === 'list' ? 'mb-24' : '' },
                wp.element.createElement(_ProductDataFieldHeader2.default, {
                    index: index,
                    formId: formId,
                    view: view,
                    field: field,
                    attributes: attributes,
                    listeners: listeners
                })
            ),
            wp.element.createElement(
                "div",
                { className: "" + (isClosed() ? 'hidden' : '') },
                wp.element.createElement(
                    "div",
                    { className: "flex-column s-24" },
                    wp.element.createElement(
                        "div",
                        { className: "container align-end" },
                        wp.element.createElement(
                            "div",
                            { className: "col-6" },
                            wp.element.createElement(_Label2.default, {
                                isRequired: true,
                                id: formId("name"),
                                label: (0, _useTranslation2.default)("Name")
                            }),
                            wp.element.createElement(_Input2.default, {
                                id: formId("name"),
                                register: register,
                                errors: errors,
                                placeholder: (0, _useTranslation2.default)("Name"),
                                defaultValue: field.name,
                                onClick: function onClick(e) {
                                    if (field.name && e.target.value === 'field') {
                                        setValue(formId("name"), null);
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
                            "div",
                            { className: "col-6" },
                            wp.element.createElement(_Label2.default, {
                                isRequired: true,
                                id: formId("type"),
                                label: (0, _useTranslation2.default)("Field type")
                            }),
                            wp.element.createElement(_Select2.default, {
                                register: register,
                                errors: errors,
                                id: formId("type"),
                                values: _woocommerce_fields.WooCommerceFieldsList
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
                                isRequired: false,
                                id: formId("defaultValue"),
                                label: (0, _useTranslation2.default)("Default value")
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
                                isRequired: false,
                                id: formId("description"),
                                label: (0, _useTranslation2.default)("A brief description")
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
                    ),
                    fieldHasOptions(fieldType()) && wp.element.createElement(_ProductDataFieldOptionsList2.default, {
                        fieldId: field.id,
                        fieldIndex: index,
                        options: field.options ? field.options : []
                    })
                )
            )
        )
    });
};

ProductDataField.propTypes = {
    view: _propTypes2.default.string.isRequired,
    index: _propTypes2.default.number.isRequired,
    field: _propTypes2.default.object.isRequired
};

exports.default = ProductDataField;

/***/ }),

/***/ 9883:
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

var _reactHookForm = __webpack_require__(930);

var _ElementSelector = __webpack_require__(6460);

var _ElementSelector2 = _interopRequireDefault(_ElementSelector);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductDataFieldSortableTab = function ProductDataFieldSortableTab(_ref) {
    var index = _ref.index,
        field = _ref.field,
        _ref$activeTab = _ref.activeTab,
        activeTab = _ref$activeTab === undefined ? 0 : _ref$activeTab,
        _onClick = _ref.onClick;

    // manage form state
    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var watchedName = (0, _reactHookForm.useWatch)({
        control: control,
        name: "fields." + index + ".name"
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

    return wp.element.createElement(
        "div",
        {
            id: field.id,
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
        wp.element.createElement(_ElementSelector2.default, {
            element: {
                id: field.id
            }
        }),
        wp.element.createElement(
            "span",
            { className: "text-ellipsis" },
            watchedName ? watchedName : field.name
        )
    );
};

ProductDataFieldSortableTab.propTypes = {
    index: _propTypes2.default.number.isRequired,
    field: _propTypes2.default.object.isRequired,
    activeTab: _propTypes2.default.number,
    onClick: _propTypes2.default.func
};

exports.default = ProductDataFieldSortableTab;

/***/ }),

/***/ 8918:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _sortable = __webpack_require__(9125);

var _productDataFieldsStateSlice = __webpack_require__(2118);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _SwitchView = __webpack_require__(6973);

var _SwitchView2 = _interopRequireDefault(_SwitchView);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _styles = __webpack_require__(624);

var _ProductDataField = __webpack_require__(8785);

var _ProductDataField2 = _interopRequireDefault(_ProductDataField);

var _SortableList = __webpack_require__(5557);

var _SortableList2 = _interopRequireDefault(_SortableList);

var _ProductDataFieldSortableTab = __webpack_require__(9883);

var _ProductDataFieldSortableTab2 = _interopRequireDefault(_ProductDataFieldSortableTab);

var _BulkActions = __webpack_require__(3067);

var _BulkActions2 = _interopRequireDefault(_BulkActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TabularView = function TabularView(_ref) {
    var fields = _ref.fields,
        view = _ref.view,
        setView = _ref.setView,
        activeTab = _ref.activeTab,
        setActiveTab = _ref.setActiveTab;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage form state

    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control;

    var _useFieldArray = (0, _reactHookForm.useFieldArray)({
        control: control,
        name: "fields"
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
        setActiveTab(newIndex);

        dispatch((0, _productDataFieldsStateSlice.setFields)(sortedFields));
    };

    var handleTabChange = function handleTabChange(index) {
        setActiveTab(index);
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            { className: "flex-between mb-24" },
            wp.element.createElement(
                "h3",
                null,
                (0, _useTranslation2.default)("Manage product data fields")
            ),
            wp.element.createElement(_SwitchView2.default, {
                localStorageKey: "wc_fields_manage_view",
                setView: setView,
                view: view
            })
        ),
        wp.element.createElement(_BulkActions2.default, {
            view: "tab",
            setFieldTab: setActiveTab
        }),
        fields.length > 0 ? wp.element.createElement(
            "div",
            { className: "acpt-horizontal-tabs" },
            wp.element.createElement(
                "div",
                { className: "tablist" },
                wp.element.createElement(
                    _SortableList2.default,
                    {
                        onDragEnd: handleDragEnd,
                        items: fields
                    },
                    fields.map(function (field, index) {
                        return wp.element.createElement(_ProductDataFieldSortableTab2.default, {
                            index: index,
                            field: field,
                            activeTab: activeTab,
                            onClick: handleTabChange
                        });
                    })
                )
            ),
            fields.map(function (field, index) {
                return wp.element.createElement(
                    _react2.default.Fragment,
                    null,
                    index === activeTab && wp.element.createElement(
                        "div",
                        { className: "tab-panel" },
                        wp.element.createElement(_ProductDataField2.default, {
                            field: field,
                            index: index,
                            view: view
                        })
                    )
                );
            })
        ) : wp.element.createElement(
            _Alert2.default,
            { style: _styles.styleVariants.WARNING },
            (0, _useTranslation2.default)('No fields already created. Create the first one now by clicking the button "Add field"!')
        )
    );
};

TabularView.propTypes = {
    view: _propTypes2.default.string.isRequired,
    setView: _propTypes2.default.func.isRequired,
    fields: _propTypes2.default.array.isRequired,
    activeTab: _propTypes2.default.number.isRequired,
    setActiveTab: _propTypes2.default.func.isRequired
};

exports.default = TabularView;

/***/ }),

/***/ 6756:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _reactRedux = __webpack_require__(6706);

var _localStorage = __webpack_require__(1500);

var _DeleteAllFieldsModal = __webpack_require__(6036);

var _DeleteAllFieldsModal2 = _interopRequireDefault(_DeleteAllFieldsModal);

var _objects = __webpack_require__(4040);

var _ListView = __webpack_require__(9316);

var _ListView2 = _interopRequireDefault(_ListView);

var _TabularView = __webpack_require__(8918);

var _TabularView2 = _interopRequireDefault(_TabularView);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _ = __webpack_require__(9167);

var _2 = _interopRequireDefault(_);

var _uuid = __webpack_require__(1614);

var _misc = __webpack_require__(3154);

var _scroll = __webpack_require__(2727);

var _woocommerce_fields = __webpack_require__(1220);

var _reactHotToast = __webpack_require__(4500);

var _reactRouterDom = __webpack_require__(4022);

var _saveWooCommerceProductDataFieldsSlice = __webpack_require__(8142);

var _InputHidden = __webpack_require__(5978);

var _InputHidden2 = _interopRequireDefault(_InputHidden);

var _productDataFieldsStateSlice = __webpack_require__(2118);

var _fetchProductDataFieldsSlice = __webpack_require__(9379);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var ProductDataFields = function ProductDataFields(_ref) {
    _objectDestructuringEmpty(_ref);

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchProductDataFields;
    }),
        loading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.productDataFieldsState;
    }),
        fields = _useSelector2.fields;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        fetchError = _useState2[0],
        setFetchError = _useState2[1];

    var _useState3 = (0, _react.useState)((0, _localStorage.savedView)("wc_fields_manage_view")),
        _useState4 = _slicedToArray(_useState3, 2),
        view = _useState4[0],
        setView = _useState4[1];

    var _useState5 = (0, _react.useState)(0),
        _useState6 = _slicedToArray(_useState5, 2),
        activeTab = _useState6[0],
        setActiveTab = _useState6[1];

    // manage redirect


    var navigate = (0, _reactRouterDom.useNavigate)();

    // form init
    var methods = (0, _reactHookForm.useForm)({
        mode: 'all'
    });

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _useTranslation2.default)("Manage product data fields"));
        (0, _misc.changeCurrentAdminMenuLink)('#/');
        dispatch((0, _fetchProductDataFieldsSlice.fetchProductDataFields)(id)).then(function (res) {
            dispatch((0, _productDataFieldsStateSlice.hydrateState)(res.payload));

            // Set initial values
            res.payload && res.payload.map(function (field, index) {
                methods.setValue("fields." + index, field);
            });
        }).catch(function (err) {
            console.error(err);
            setFetchError(true);
        });
    }, []);

    var handleAddField = function handleAddField() {

        var newFieldId = (0, _uuid.v4)();
        var newField = {
            id: newFieldId,
            name: 'field',
            type: _woocommerce_fields.TEXT,
            isRequired: false,
            description: null,
            defaultValue: null,
            options: []
        };

        dispatch((0, _productDataFieldsStateSlice.addField)({ field: newField }));
        setActiveTab(fields.length);

        (0, _misc.delay)(1).then(function () {
            (0, _scroll.scrollToId)(newFieldId);
        });
    };

    /**
     *
     * @return {boolean}
     */
    var isFormValid = function isFormValid() {
        if (methods.formState.errors && methods.formState.errors.pages) {
            return false;
        }

        return true;
    };

    var onSubmit = function onSubmit(data) {
        dispatch((0, _saveWooCommerceProductDataFieldsSlice.saveWooCommerceProductDataFields)(data)).then(function (res) {
            var payload = res.payload;

            if (payload.success) {
                navigate("/product-data/product/fields/" + id);
                _reactHotToast.toast.success((0, _useTranslation2.default)("WooCommerce product data fields successfully saved"));
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
            style: _styles.styleVariants.SECONDARY,
            onClick: function onClick(e) {
                e.preventDefault();
                handleAddField();
            }
        },
        (0, _useTranslation2.default)("Add field")
    ), wp.element.createElement(
        _Button2.default,
        {
            disabled: !isFormValid(),
            style: _styles.styleVariants.PRIMARY
        },
        (0, _useTranslation2.default)("Save")
    ), wp.element.createElement(_DeleteAllFieldsModal2.default, null)];

    if (loading) {
        return wp.element.createElement(_Loader2.default, null);
    }

    if (fetchError) {
        return wp.element.createElement(_2.default, null);
    }

    return wp.element.createElement(
        _reactHookForm.FormProvider,
        methods,
        wp.element.createElement(
            "form",
            { onSubmit: methods.handleSubmit(onSubmit) },
            wp.element.createElement(
                _Layout2.default,
                {
                    title: (0, _useTranslation2.default)("Manage option pages"),
                    actions: actions,
                    crumbs: [{
                        label: (0, _useTranslation2.default)("Registered Custom Post Types"),
                        link: "/"
                    }, {
                        label: (0, _useTranslation2.default)("WooCommerce product data"),
                        link: "/product-data/product"
                    }, {
                        label: (0, _useTranslation2.default)("product data fields")
                    }]
                },
                wp.element.createElement(_InputHidden2.default, {
                    register: methods.register,
                    id: "productDataId",
                    value: id
                }),
                view === 'list' ? wp.element.createElement(_ListView2.default, {
                    setActiveTab: setActiveTab,
                    view: view,
                    setView: setView,
                    fields: !(0, _objects.isEmpty)(fields) ? fields : []
                }) : wp.element.createElement(_TabularView2.default, {
                    activeTab: activeTab,
                    setActiveTab: setActiveTab,
                    view: view,
                    setView: setView,
                    fields: !(0, _objects.isEmpty)(fields) ? fields : []
                })
            )
        )
    );
};

exports.default = ProductDataFields;

/***/ })

}]);
//# sourceMappingURL=778.js.map