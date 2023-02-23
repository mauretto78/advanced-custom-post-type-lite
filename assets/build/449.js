(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[449],{

/***/ 4449:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _reactRedux = __webpack_require__(4494);

var _reactRouterDom = __webpack_require__(886);

var _useUnsavedChangesWarning = __webpack_require__(9755);

var _useUnsavedChangesWarning2 = _interopRequireDefault(_useUnsavedChangesWarning);

var _misc = __webpack_require__(3154);

var _fetchWooCommerceProductData = __webpack_require__(7338);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _resetWooCommerceProductData = __webpack_require__(2663);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _reactHookForm = __webpack_require__(930);

var _objects = __webpack_require__(4040);

var _woocommerce_icons = __webpack_require__(9132);

var _reactToastify = __webpack_require__(9249);

var _saveWooCommerceProductData = __webpack_require__(7322);

var _InputText = __webpack_require__(7388);

var _InputText2 = _interopRequireDefault(_InputText);

var _ReactSelect = __webpack_require__(2762);

var _ReactSelect2 = _interopRequireDefault(_ReactSelect);

var _Checkboxes = __webpack_require__(2184);

var _Checkboxes2 = _interopRequireDefault(_Checkboxes);

var _InputSwitch = __webpack_require__(8195);

var _InputSwitch2 = _interopRequireDefault(_InputSwitch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var SaveWooCommerceProductData = function SaveWooCommerceProductData() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchWooCommerceProductDataReducer;
    }),
        fetched = _useSelector.fetched,
        fetchingLoading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.saveWooCommerceProductDataReducer;
    }),
        saveProductDataErrors = _useSelector2.errors,
        success = _useSelector2.success,
        loading = _useSelector2.loading;

    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var _useUnsavedChangesWar = (0, _useUnsavedChangesWarning2.default)(),
        _useUnsavedChangesWar2 = _slicedToArray(_useUnsavedChangesWar, 3),
        Prompt = _useUnsavedChangesWar2[0],
        setDirty = _useUnsavedChangesWar2[1],
        setPristine = _useUnsavedChangesWar2[2];

    var didMountRef = (0, _react.useRef)(false);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        fetchedSuccess = _useState2[0],
        setFetchedSuccess = _useState2[1];

    (0, _react.useEffect)(function () {
        if (id) {
            (0, _misc.metaTitle)("Edit WooCommerce product data");
            dispatch((0, _fetchWooCommerceProductData.fetchWooCommerceProductData)({
                id: id
            }));
        } else {
            (0, _misc.metaTitle)("Create new WooCommerce product data");
            dispatch((0, _resetWooCommerceProductData.resetWooCommerceProductData)());
        }
        setDirty();
    }, []);

    var setPristineHandler = function setPristineHandler() {
        setPristine();
    };

    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!fetchingLoading) {
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [fetchingLoading]);

    // manage redirect
    var history = (0, _reactRouterDom.useHistory)();

    // handle form

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all',
        defaultValues: {
            product_data_name: fetched.length > 0 ? fetched[0].name : null,
            visibility: fetched.length > 0 ? fetched[0].visibility : null,
            show_ui: fetched.length > 0 ? fetched[0].showInUI : true,
            icon: fetched.length > 0 ? (0, _objects.filterByValue)(_woocommerce_icons.woocommerceIconsList, fetched[0].icon.value) : null
        }
    }),
        control = _useForm.control,
        register = _useForm.register,
        handleSubmit = _useForm.handleSubmit,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid;

    // handle form submission outcome


    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loading) {
                if (success) {
                    history.push('/product-data/product');
                    _reactToastify.toast.success("Product data successfully saved");
                }

                if (saveProductDataErrors.length > 0) {
                    saveProductDataErrors.map(function (error) {
                        _reactToastify.toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    var onSubmit = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
            var icon, visibility;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            icon = {
                                icon: data.icon.label.props.icon,
                                value: data.icon.value
                            };
                            visibility = [];

                            if (data.visibility_0) {
                                visibility.push(data.visibility_0);
                            }
                            if (data.visibility_1) {
                                visibility.push(data.visibility_1);
                            }
                            if (data.visibility_2) {
                                visibility.push(data.visibility_2);
                            }
                            if (data.visibility_3) {
                                visibility.push(data.visibility_3);
                            }
                            if (data.visibility_4) {
                                visibility.push(data.visibility_4);
                            }
                            if (data.visibility_5) {
                                visibility.push(data.visibility_5);
                            }

                            setPristineHandler();
                            _context.next = 11;
                            return dispatch((0, _saveWooCommerceProductData.saveWooCommerceProductData)({
                                id: id ? id : null,
                                product_data_name: data.product_data_name,
                                icon: icon,
                                visibility: visibility,
                                show_ui: data.show_ui
                            }));

                        case 11:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function onSubmit(_x) {
            return _ref.apply(this, arguments);
        };
    }();

    if (!fetchedSuccess) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    var actions = wp.element.createElement(
        "button",
        {
            className: "acpt-btn acpt-btn-primary",
            disabled: !isValid ? 'disabled' : ''
        },
        "Save"
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        Prompt,
        wp.element.createElement(
            "form",
            { onSubmit: handleSubmit(onSubmit) },
            wp.element.createElement(_ActionsBar2.default, {
                title: id ? "Edit WooCommerce product data" : "Create new WooCommerce product data",
                actions: actions
            }),
            wp.element.createElement(
                "main",
                null,
                wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                        label: "Registered Custom Post Types",
                        link: "/"
                    }, {
                        label: "WooCommerce product data",
                        link: "/product-data/product"
                    }, {
                        label: id ? "Edit WooCommerce product data" : "Create new WooCommerce product data"
                    }]
                }),
                wp.element.createElement(
                    "div",
                    { className: "acpt-card" },
                    wp.element.createElement(
                        "div",
                        { className: "acpt-steps-wrapper" },
                        wp.element.createElement(
                            "div",
                            { className: "acpt-card__inner" },
                            wp.element.createElement(_InputText2.default, {
                                id: "product_data_name",
                                label: "Product data name",
                                placeholder: "Product data name",
                                defaultValue: null,
                                description: "The product data name.",
                                register: register,
                                errors: errors,
                                isRequired: true,
                                validate: {
                                    maxLength: {
                                        value: 20,
                                        message: "max length is 20"
                                    },
                                    required: "This field is mandatory"
                                }
                            }),
                            wp.element.createElement(_ReactSelect2.default, {
                                id: "icon",
                                label: "Icon",
                                placeholder: "Associated icon",
                                description: "Displayed on the admin panel",
                                control: control,
                                defaultValue: fetched.length > 0 ? (0, _objects.filterByValue)(_woocommerce_icons.woocommerceIconsList, fetched[0].icon.value) : null,
                                values: _woocommerce_icons.woocommerceIconsList,
                                isRequired: true,
                                validate: {
                                    required: "This field is mandatory"
                                }
                            }),
                            wp.element.createElement(_Checkboxes2.default, {
                                id: "visibility",
                                label: "visibility",
                                wizard: "Visibility of product data",
                                values: {
                                    "Show in simple products": {
                                        "value": "show_if_simple",
                                        "checked": fetched.length > 0 ? fetched[0].visibility.includes("show_if_simple") : true
                                    },
                                    "Show in variable products": {
                                        "value": "show_if_variable",
                                        "checked": fetched.length > 0 ? fetched[0].visibility.includes("show_if_variable") : true
                                    },
                                    "Show in grouped products": {
                                        "value": "show_if_grouped",
                                        "checked": fetched.length > 0 ? fetched[0].visibility.includes("show_if_grouped") : true
                                    },
                                    "Show in external products": {
                                        "value": "show_if_external",
                                        "checked": fetched.length > 0 ? fetched[0].visibility.includes("show_if_external") : true
                                    },
                                    "Hide in virtual products": {
                                        "value": "hide_if_virtual",
                                        "checked": fetched.length > 0 ? fetched[0].visibility.includes("hide_if_virtual") : false
                                    },
                                    "Hide in external products": {
                                        "value": "hide_if_external",
                                        "checked": fetched.length > 0 ? fetched[0].visibility.includes("hide_if_external") : false
                                    }
                                },
                                register: register,
                                errors: errors
                            }),
                            wp.element.createElement(_InputSwitch2.default, {
                                id: "show_ui",
                                label: "Show in UI",
                                description: "Show the product data on the front store page.",
                                defaultValue: null,
                                register: register,
                                errors: errors
                            })
                        )
                    )
                )
            )
        )
    );
};

exports.default = SaveWooCommerceProductData;

// import React, {useEffect, useRef, useState} from 'react';
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {Icon} from "@iconify/react";
// import {useDispatch, useSelector} from "react-redux";
// import Copyright from "../../reusable/Copyright";
// import {useParams} from "react-router-dom";
// import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
// import {metaTitle} from "../../../utils/misc";
// import {fetchWooCommerceProductData} from "../../../redux/thunks/fetchWooCommerceProductData";
// import Spinner from "../../reusable/Loader/Spinner";
// import {resetWooCommerceProductData} from "../../../redux/thunks/resetWooCommerceProductData";
// import SaveWooCommerceProductDataForm from "./SaveWooCommerceProductDataForm";
//
// const SaveWooCommerceProductData = () => {
//
//     // manage global state
//     const {loading: fetchingLoading } = useSelector(state => state.fetchWooCommerceProductDataReducer);
//     const dispatch = useDispatch();
//
//     // manage local state
//     const {id} = useParams();
//     const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
//     const didMountRef = useRef(false);
//     const [fetchedSuccess, setFetchedSuccess] = useState(null);
//
//     useEffect(() => {
//         if(id){
//             metaTitle("Edit WooCommerce product data");
//             dispatch(fetchWooCommerceProductData({
//                 id: id
//             }));
//         } else {
//             metaTitle("Create new WooCommerce product data");
//             dispatch(resetWooCommerceProductData());
//         }
//         setDirty();
//     }, []);
//
//     const setPristineHandler = () => {
//         setPristine();
//     };
//
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!fetchingLoading){
//                 setFetchedSuccess(true);
//             }
//         } else {
//             didMountRef.current = true;
//         }
//     }, [fetchingLoading]);
//
//     if(!fetchedSuccess){
//         return <Spinner/>;
//     }
//
//     return (
//         <div>
//             <Breadcrumbs crumbs={[
//                 {
//                     label: "Registered Custom Post Types",
//                     link: "/"
//                 },
//                 {
//                     label: "WooCommerce product data",
//                     link: "/product-data/product"
//                 },
//                 {
//                     label: `Create new WooCommerce product data`
//                 }
//             ]}
//             />
//             {Prompt}
//             <h1 className="acpt-title">
//                 <Icon icon={id ? "bx:bx-edit" : "bx:bx-list-plus"} color="#02c39a" width="18px" />
//                 &nbsp;
//                 {id ? "Edit WooCommerce product data" : "Create new WooCommerce product data" }
//             </h1>
//             <div className="acpt-card">
//                 <div className="acpt-steps-wrapper">
//                     <SaveWooCommerceProductDataForm id={id} setPristineHandler={setPristineHandler}/>
//                 </div>
//             </div>
//             <Copyright/>
//         </div>
//     );
// };
//
// export default SaveWooCommerceProductData;

/***/ }),

/***/ 2184:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Checkboxes = function Checkboxes(_ref) {
    var id = _ref.id,
        label = _ref.label,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors,
        values = _ref.values,
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
            wp.element.createElement(
                "div",
                { className: "acpt-checkboxes-wrapper" },
                Object.keys(values).map(function (keyName, index) {
                    return wp.element.createElement(
                        "div",
                        { className: "acpt-checkbox", key: keyName },
                        wp.element.createElement("input", _extends({
                            id: id + "_" + index,
                            value: values[keyName]['value'],
                            defaultChecked: values[keyName]['checked'],
                            type: "checkbox",
                            "aria-invalid": error ? "true" : "false",
                            className: "form-control " + (error ? 'has-errors' : '')
                        }, register(id + "_" + index, _extends({}, validate)))),
                        wp.element.createElement(
                            "label",
                            { htmlFor: id + "_" + index },
                            keyName
                        )
                    );
                }),
                error && wp.element.createElement(
                    "div",
                    { className: "invalid-feedback" },
                    error.message
                )
            ),
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

exports.default = Checkboxes;

/***/ }),

/***/ 8195:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputSwitch = function InputSwitch(_ref) {
    var id = _ref.id,
        label = _ref.label,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors,
        defaultValue = _ref.defaultValue,
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
            wp.element.createElement(
                "label",
                { className: "switch" },
                wp.element.createElement("input", _extends({
                    id: id,
                    name: id,
                    required: isRequired,
                    type: "checkbox",
                    defaultChecked: defaultValue
                }, register(id, validate))),
                wp.element.createElement("span", { className: "slider round" })
            ),
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

exports.default = InputSwitch;

/***/ }),

/***/ 7388:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputText = function InputText(_ref) {
    var id = _ref.id,
        label = _ref.label,
        placeholder = _ref.placeholder,
        disabled = _ref.disabled,
        readOnly = _ref.readOnly,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors,
        isRequired = _ref.isRequired,
        defaultValue = _ref.defaultValue,
        description = _ref.description,
        wizard = _ref.wizard,
        onChangeCapture = _ref.onChangeCapture;


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
                type: "text",
                disabled: disabled,
                placeholder: placeholder,
                required: isRequired,
                onChangeCapture: onChangeCapture,
                readOnly: readOnly && 'readonly',
                defaultValue: defaultValue,
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

exports.default = InputText;

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

/***/ 6512:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _react3 = __webpack_require__(6229);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Breadcrumb = function Breadcrumb(_ref) {
    var label = _ref.label,
        link = _ref.link,
        isLast = _ref.isLast;


    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "li",
            { className: isLast ? 'current' : '' },
            link ? wp.element.createElement(
                _reactRouterDom.Link,
                { to: link },
                label
            ) : label
        ),
        !isLast && wp.element.createElement(
            "span",
            { className: "separator" },
            wp.element.createElement(_react3.Icon, { icon: "bx:bx-chevron-right", color: "#aaa", width: "18px" })
        )
    );
};

exports.default = Breadcrumb;

/***/ }),

/***/ 5827:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Breadcrumb = __webpack_require__(6512);

var _Breadcrumb2 = _interopRequireDefault(_Breadcrumb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Breadcrumbs = function Breadcrumbs(_ref) {
    var crumbs = _ref.crumbs;

    return wp.element.createElement(
        "div",
        { className: "acpt-breadcrumbs" },
        crumbs.length > 0 && wp.element.createElement(
            "ul",
            null,
            crumbs.map(function (crumb, index) {
                return wp.element.createElement(_Breadcrumb2.default, {
                    label: crumb.label,
                    link: crumb.link,
                    isLast: index + 1 === crumbs.length,
                    key: index
                });
            })
        )
    );
};

exports.default = Breadcrumbs;

/***/ }),

/***/ 9623:
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
        null,
        wp.element.createElement('span', { className: 'mr-1 wcicon-' + icon }),
        label
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
exports.woocommerceIconsList = undefined;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _WooCommerceIcon = __webpack_require__(9623);

var _WooCommerceIcon2 = _interopRequireDefault(_WooCommerceIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var woocommerceIconsList = exports.woocommerceIconsList = [{ value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "storefront", label: "Store front" }) }, { value: "\\e604", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "ccv", label: "CCV" }) }, { value: "\\e000", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "virtual", label: "Virtual" }) }, { value: "\\e022", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "down", label: "Down" }) }, { value: "\\e023", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "reports", label: "Reports" }) }, { value: "\\e031", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "refresh", label: "Refersh" }) }, { value: "\\e032", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "navigation", label: "Navigation" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "status-fill", label: "Status-fill" }) }, { value: "\\e004", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "contract", label: "Contract" }) }, { value: "\\e001", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "downloadable", label: "Downloadable" }) }, { value: "\\e007", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "plus", label: "Plus" }) }, { value: "\\e006", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "simple", label: "Simple" }) }, { value: "\\e033", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "on-hold", label: "On hold" }) }, { value: "\\e034", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "external", label: "External" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "contract-2", label: "Contract" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "expand-2", label: "Expand" }) }, { value: "\\e037", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "phone", label: "Phone" }) }, { value: "\\e038", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "user", label: "User" }) }, { value: "\\e039", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "status", label: "Status" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "status-pending", label: "Status pending" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "status-cancelled", label: "Status cancelled" }) }, { value: "\\e02f", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "west", label: "West" }) }, { value: "\\e02e", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "south", label: "South" }) }, { value: "\\e02d", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "mail", label: "Mail" }) }, { value: "\\e02c", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "inventory", label: "Inventory" }) }, { value: "\\e02b", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "attributes", label: "Attributes" }) }, { value: "\\e02a", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "north", label: "North" }) }, { value: "\\e029", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "east", label: "East" }) }, { value: "\\e028", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "note", label: "Note" }) }, { value: "\\e027", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "windows", label: "Windows" }) }, { value: "\\e026", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "user2", label: "User 2" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "search-2", label: "Search 2" }) }, { value: "\\e024", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "search", label: "Search" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "star-empty", label: "Star empty" }) }, { value: "\\e030", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "share", label: "Share" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "phone-fill", label: "Store front" }) }, { value: "\\e03d", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "woo", label: "Woo" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "user-fill", label: "User fill" }) }, { value: "\\e002", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "grouped", label: "Grouped" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "status-refunded", label: "Status refunded" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "status-completed", label: "Status completed" }) }, { value: "\\e003", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "variable", label: "Variable" }) }, { value: "\\e005", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "expand", label: "Expand" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "status-failed", label: "Status failed" }) }, { value: "\\e017", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "check", label: "Check" }) }, { value: "\\e008", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "right", label: "Right" }) }, { value: "\\e009", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "up", label: "Up" }) }, { value: "\\e018", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "query", label: "Query" }) }, { value: "\\e00a", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "down", label: "Down" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "truck-1", label: "Truck 1" }) }, { value: "\\e00b", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "left", label: "Left" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "truck-2", label: "Truck 2" }) }, { value: "\\e00c", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "image", label: "Image" }) }, { value: "\\e01b", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "globe", label: "Globe" }) }, { value: "\\e00d", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "link", label: "Link" }) }, { value: "\\e01c", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "gear", label: "Gear" }) }, { value: "\\e00e", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "calendar", label: "Calendar" }) }, { value: "\\e01d", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "cart", label: "Cart" }) }, { value: "\\e00f", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "processing", label: "Processing" }) }, { value: "\\e01e", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "card", label: "Card" }) }, { value: "\\e010", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "view", label: "View" }) }, { value: "\\e01f", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "stats", label: "Stats" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "status-processing", label: "Status processing" }) }, { value: "\\e900", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "star-full", label: "Star full" }) }, { value: "\\e600", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "coupon", label: "Coupon" }) }, { value: "\\e601", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "limit", label: "Limit" }) }, { value: "\\e602", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "restricted", label: "Restricted" }) }, { value: "\\e603", label: wp.element.createElement(_WooCommerceIcon2.default, { icon: "edit", label: "Edit" }) }];

/***/ }),

/***/ 9755:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useUnsavedChangesWarning = function useUnsavedChangesWarning() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Are you sure want to discard changes?";

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isDirty = _useState2[0],
        setDirty = _useState2[1];

    (0, _react.useEffect)(function () {
        //Detecting browser closing
        window.onbeforeunload = isDirty && function () {
            return message;
        };

        return function () {
            window.onbeforeunload = null;
        };
    }, [isDirty]);

    var routerPrompt = wp.element.createElement(_reactRouterDom.Prompt, { when: isDirty, message: message });

    return [routerPrompt, function () {
        return setDirty(true);
    }, function () {
        return setDirty(false);
    }, isDirty];
};

exports.default = useUnsavedChangesWarning;

/***/ }),

/***/ 7338:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchWooCommerceProductData = undefined;

var _ajax = __webpack_require__(7569);

var _fetchWooCommerceProductDataActions = __webpack_require__(6208);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchWooCommerceProductData = exports.fetchWooCommerceProductData = function fetchWooCommerceProductData(meta) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchWooCommerceProductDataActions.fetchWooCommerceProductDataInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchWooCommerceProductDataAction', meta);

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchWooCommerceProductDataActions.fetchWooCommerceProductDataSuccess)(fetched));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchWooCommerceProductDataActions.fetchWooCommerceProductDataFailure)(_context.t0));

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

/***/ 2663:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.resetWooCommerceProductData = undefined;

var _ajax = __webpack_require__(7569);

var _fetchWooCommerceProductDataActions = __webpack_require__(6208);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var resetWooCommerceProductData = exports.resetWooCommerceProductData = function resetWooCommerceProductData() {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            dispatch((0, _fetchWooCommerceProductDataActions.resetWooCommerceProductDataInProgress)());
                            _context.next = 3;
                            return (0, _ajax.wpAjaxRequest)('resetWooCommerceProductDataAction');

                        case 3:
                            fetched = _context.sent;

                            dispatch((0, _fetchWooCommerceProductDataActions.resetWooCommerceProductDataSuccess)());

                        case 5:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }();
};

/***/ }),

/***/ 7322:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.saveWooCommerceProductData = undefined;

var _ajax = __webpack_require__(7569);

var _saveWooCommerceProductDataActions = __webpack_require__(164);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var saveWooCommerceProductData = exports.saveWooCommerceProductData = function saveWooCommerceProductData(data) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _saveWooCommerceProductDataActions.saveWooCommerceProductDataInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('saveWooCommerceProductDataAction', data);

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _saveWooCommerceProductDataActions.saveWooCommerceProductDataSuccess)(res.data)) : dispatch((0, _saveWooCommerceProductDataActions.saveWooCommerceProductDataFailure)(res.error));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _saveWooCommerceProductDataActions.saveWooCommerceProductDataFailure)(_context.t0));

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

/***/ }),

/***/ 2107:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=449.js.map