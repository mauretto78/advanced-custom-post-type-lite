(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[112],{

/***/ 8053:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./en.js": 3167
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 8053;

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

/***/ 9633:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.default = Step;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Step(_ref) {
    var isActive = _ref.isActive,
        component = _ref.component;

    return wp.element.createElement(
        'div',
        { className: 'acpt-step ' + (isActive ? 'active' : 'hidden') },
        component
    );
}

/***/ }),

/***/ 2873:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.default = StepsButtons;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4494);

var _stepsActions = __webpack_require__(4576);

var _scroll = __webpack_require__(2727);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StepsButtons(_ref) {
    var isValid = _ref.isValid,
        next = _ref.next,
        prev = _ref.prev;


    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.stepsReducer;
    }),
        loading = _useSelector.loading;

    return wp.element.createElement(
        "div",
        { className: "acpt-step-buttons" },
        prev && wp.element.createElement(
            "a",
            { className: "acpt-btn acpt-btn-primary-o",
                onClick: function onClick(e) {
                    dispatch((0, _stepsActions.stepBack)());
                    (0, _scroll.scrollToTop)();
                }
            },
            "Previous Step"
        ),
        next && wp.element.createElement(
            "button",
            {
                className: "acpt-btn acpt-btn-primary-o",
                disabled: isValid ? '' : 'disabled',
                onClick: function onClick() {
                    (0, _scroll.scrollToTop)();
                }
            },
            "Next Step"
        ),
        !next && wp.element.createElement(
            "button",
            {
                className: "acpt-btn acpt-btn-primary",
                disabled: !isValid || loading ? 'disabled' : ''
            },
            loading ? 'Loading...' : 'Save'
        )
    );
}

/***/ }),

/***/ 69:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.default = StepsContainer;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4494);

var _Step = __webpack_require__(9633);

var _Step2 = _interopRequireDefault(_Step);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StepsContainer(_ref) {
    var steps = _ref.steps;

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.stepsReducer;
    }),
        activeStep = _useSelector.activeStep;

    return wp.element.createElement(
        "div",
        { className: "acpt-steps-wrapper" },
        steps.map(function (step, index) {
            return wp.element.createElement(_Step2.default, { component: step, isActive: activeStep === index + 1 });
        })
    );
}

/***/ }),

/***/ 3119:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.default = StepsHeader;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _StepsHeaderElement = __webpack_require__(3319);

var _StepsHeaderElement2 = _interopRequireDefault(_StepsHeaderElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StepsHeader(_ref) {
    var headings = _ref.headings;


    if (typeof headings === 'undefined') {
        return null;
    }

    return wp.element.createElement(
        'div',
        { className: 'acpt-steps__headings' },
        headings.map(function (heading) {
            return wp.element.createElement(_StepsHeaderElement2.default, { heading: heading });
        })
    );
}

/***/ }),

/***/ 3319:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.default = StepsHeaderElement;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4494);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function StepsHeaderElement(_ref) {
    var heading = _ref.heading;

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.stepsReducer;
    }),
        activeStep = _useSelector.activeStep;

    var getClassName = function getClassName() {
        var className = 'acpt-steps__heading';

        if (activeStep == heading.number) {
            className += ' active';
        } else if (activeStep > heading.number) {
            className += ' done';
        } else {
            className += ' undone';
        }

        return className;
    };

    return wp.element.createElement(
        'div',
        { className: getClassName() },
        wp.element.createElement(
            'div',
            { className: 'number' },
            heading.number
        ),
        wp.element.createElement(
            'h3',
            { className: 'title' },
            heading.title
        ),
        heading.description && wp.element.createElement(
            'div',
            { className: 'description' },
            heading.description
        )
    );
}

/***/ }),

/***/ 5832:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.default = Steps;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _StepsHeader = __webpack_require__(3119);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

var _StepsContainer = __webpack_require__(69);

var _StepsContainer2 = _interopRequireDefault(_StepsContainer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Steps(_ref) {
    var headings = _ref.headings,
        steps = _ref.steps;

    return wp.element.createElement(
        "div",
        { className: "acpt-steps" },
        wp.element.createElement(_StepsHeader2.default, { headings: headings }),
        wp.element.createElement(_StepsContainer2.default, { steps: steps })
    );
}

/***/ }),

/***/ 9500:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var saveCustomPostTypeHeadings = exports.saveCustomPostTypeHeadings = [{
    "id": 1,
    "number": 1,
    "title": "Basic",
    "description": "Minimum configuration"
}, {
    "id": 2,
    "number": 2,
    "title": "Labels",
    "description": "Additional labels"
}, {
    "id": 3,
    "number": 3,
    "title": "Settings",
    "description": "Other settings"
}];

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

/***/ 8525:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

/**
 * Translate a string from locale files
 *
 * @param string
 * @return {*}
 */
var translate = exports.translate = function translate(string, args) {
    var lang = __webpack_require__.g.settings && __webpack_require__.g.settings.language ? __webpack_require__.g.settings.language : 'en';
    var json = __webpack_require__(8053)("./" + lang + ".js").translations;
    var strings = string.split(".");
    var translation = getTranslatedString(json, strings);

    if (args !== null && typeof args !== 'undefined') {
        for (var key in args) {
            translation = translation.replace("{{" + key + "}}", args[key]);
        }
    }

    return typeof translation !== 'undefined' ? translation : string;
};

var getTranslatedString = function getTranslatedString(json, strings) {

    var object = json;

    strings.map(function (s) {
        object = object[s];
    });

    return object;
};

/***/ }),

/***/ 3167:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var translations = exports.translations = {
    "404": {
        "title": "Page not found"
    },
    "create": {
        "title": "Register a new Custom Post Type"
    },
    "edit": {
        "title": "Edit a new Custom Post Type"
    },
    "list": {
        "title": "Registered Custom Post Types"
    },
    "view": {
        "title": "Custom Post Type global settings"
    },
    "taxonomy_list": {
        "title": "Registered Taxonomies"
    },
    "taxonomy_create": {
        "title": "Register a new Taxonomy"
    },
    "taxonomy_edit": {
        "title": "Edit a Taxonomy"
    },
    "taxonomy_view": {
        "title": "Taxonomy settings"
    },
    "general": {
        "labels": {
            "all_items": "All {{r}}",
            "add": "Add",
            "add_new_item": "Add new {{r}}",
            "back_to_items": "Back to {{r}}",
            "edit": "Edit",
            "new": "New",
            "not_found": "No {{r}} found",
            "search": "Search",
            "view": "View",
            "parent_item_colon": "Parent item",
            "featured_image": "Featured image",
            "set_featured_image": "Set featured image",
            "remove_featured_image": "Remove featured image",
            "use_featured_image": "Use featured image",
            "most_used": "Most used {{r}}",
            "archives": "Archives",
            "insert_into_item": "Insert",
            "uploaded_to_this_item": "Upload",
            "filter_items_list": "Filter {{r}} list",
            "items_list_navigation": "Navigation list {{r}}",
            "items_list": "List {{r}}",
            "filter_by_date": "Filter by date",
            "item_published": "{{r}} published",
            "item_published_privately": "{{r}} published privately",
            "item_reverted_to_draft": "{{r}} reverted to draft",
            "item_scheduled": "{{r}} scheduled",
            "item_updated": "{{r}} updated",
            "popular_items": "Popular {{r}}",
            "update_item": "Update {{r}}",
            "no_terms": "No {{r}}",
            "parent_item": "Parent {{r}}",
            "new_item_name": "New {{r}}",
            "filter_by_item": "Filter by {{r}}",
            "separate_items_with_commas": "Separate {{r}} with commas",
            "add_or_remove_items": "Add or remove {{r}}",
            "choose_from_most_used": "Choose from most used {{r}}",
            "search_items": "Search {{r}}"
        }
    }
};

/***/ }),

/***/ 9218:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.stepsSubmit = undefined;

var _stepsActions = __webpack_require__(4576);

var _ajax = __webpack_require__(7569);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var stepsSubmit = exports.stepsSubmit = function stepsSubmit(action, data) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _stepsActions.stepsSubmitInProgress)(data));
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)(action, getState().stepsReducer.data);

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _stepsActions.stepsSubmitSuccess)()) : dispatch((0, _stepsActions.stepsSubmitFailure)(res.error));
                            _context.next = 12;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);
                            dispatch((0, _stepsActions.stepsSubmitFailure)(_context.t0));

                        case 12:
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

/***/ 9207:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var hydratePostTypeFormFromStep = exports.hydratePostTypeFormFromStep = function hydratePostTypeFormFromStep(step, data) {

    if (step === 2) {
        return {
            1: {
                post_name: data.name,
                singular_label: data.singular,
                plural_label: data.plural,
                icon: data.icon,
                support_0: data.supports[0] ? data.supports[0] : false,
                support_1: data.supports[1] ? data.supports[1] : false,
                support_2: data.supports[2] ? data.supports[2] : false,
                support_3: data.supports[3] ? data.supports[3] : false,
                support_4: data.supports[4] ? data.supports[4] : false,
                support_5: data.supports[5] ? data.supports[5] : false,
                support_6: data.supports[6] ? data.supports[6] : false,
                support_7: data.supports[7] ? data.supports[7] : false,
                support_8: data.supports[8] ? data.supports[8] : false,
                support_9: data.supports[9] ? data.supports[9] : false,
                support_10: data.supports[10] ? data.supports[10] : false
            }
        };
    }

    if (step === 3) {
        return {
            1: {
                post_name: data.name,
                singular_label: data.singular,
                plural_label: data.plural,
                icon: data.icon,
                support_0: data.supports[0] ? data.supports[0] : false,
                support_1: data.supports[1] ? data.supports[1] : false,
                support_2: data.supports[2] ? data.supports[2] : false,
                support_3: data.supports[3] ? data.supports[3] : false,
                support_4: data.supports[4] ? data.supports[4] : false,
                support_5: data.supports[5] ? data.supports[5] : false,
                support_6: data.supports[6] ? data.supports[6] : false,
                support_7: data.supports[7] ? data.supports[7] : false,
                support_8: data.supports[8] ? data.supports[8] : false,
                support_9: data.supports[9] ? data.supports[9] : false,
                support_10: data.supports[10] ? data.supports[10] : false
            },
            2: {
                menu_name: data.labels.menu_name,
                all_items: data.labels.all_items,
                add_new: data.labels.add_new,
                add_new_item: data.labels.add_new_item,
                edit_item: data.labels.edit_item,
                new_item: data.labels.new_item,
                view_item: data.labels.view_item,
                view_items: data.labels.view_items,
                search_item: data.labels.search_item,
                not_found: data.labels.not_found,
                not_found_in_trash: data.labels.not_found_in_trash,
                parent_item_colon: data.labels.parent_item_colon,
                featured_image: data.labels.featured_image,
                set_featured_image: data.labels.set_featured_image,
                remove_featured_image: data.labels.remove_featured_image,
                use_featured_image: data.labels.use_featured_image,
                archives: data.labels.archives,
                insert_into_item: data.labels.insert_into_item,
                uploaded_to_this_item: data.labels.uploaded_to_this_item,
                filter_items_list: data.labels.filter_items_list,
                items_list_navigation: data.labels.items_list_navigation,
                items_list: data.labels.items_list,
                filter_by_date: data.labels.filter_by_date,
                item_published: data.labels.item_published,
                item_published_privately: data.labels.item_published_privately,
                item_reverted_to_draft: data.labels.item_reverted_to_draft,
                item_scheduled: data.labels.item_scheduled,
                item_updated: data.labels.item_updated
            }
        };
    }

    return {};
};

var hydrateTaxonomyFormFromStep = exports.hydrateTaxonomyFormFromStep = function hydrateTaxonomyFormFromStep(step, data) {

    console.log(data);

    if (step === 2) {
        return {
            1: {
                slug: data.slug,
                singular_label: data.singular,
                plural_label: data.plural
            }
        };
    }

    if (step === 3) {
        return {
            1: {
                slug: data.slug,
                singular_label: data.singular,
                plural_label: data.plural
            },
            2: {
                name: data.labels.name,
                singular_name: data.labels.singular_name,
                search_items: data.labels.search_items,
                popular_items: data.labels.popular_items,
                all_items: data.labels.all_items,
                parent_item: data.labels.parent_item,
                parent_item_colon: data.labels.parent_item_colon,
                edit_item: data.labels.edit_item,
                view_item: data.labels.view_item,
                update_item: data.labels.update_item,
                add_new_item: data.labels.add_new_item,
                new_item_name: data.labels.new_item_name,
                separate_items_with_commas: data.labels.separate_items_with_commas,
                add_or_remove_items: data.labels.add_or_remove_items,
                choose_from_most_used: data.labels.choose_from_most_used,
                not_found: data.labels.not_found,
                no_terms: data.labels.no_terms,
                filter_by_item: data.labels.filter_by_item,
                items_list_navigation: data.labels.items_list_navigation,
                items_list: data.labels.items_list,
                most_used: data.labels.most_used,
                back_to_items: data.labels.back_to_items
            }
        };
    }

    return {};
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

/***/ 2727:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var scrollToTop = exports.scrollToTop = function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

var scrollToBottom = exports.scrollToBottom = function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight + 120, behavior: 'smooth' });
};

var scrollToTargetId = exports.scrollToTargetId = function scrollToTargetId(id) {
    var element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' }, true);
};

var scrollToId = exports.scrollToId = function scrollToId(id) {
    var yOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -130;


    var element = document.getElementById(id);
    var y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
};

/***/ }),

/***/ 8029:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

/**
 * Capitalize text
 *
 * @param txt
 * @return {string}
 */
var capitalizeTxt = exports.capitalizeTxt = function capitalizeTxt(txt) {
    return txt.charAt(0).toUpperCase() + txt.slice(1); //or if you want lowercase the rest txt.slice(1).toLowerCase();
};

/**
 * Converts [0,0,20,0,'px'] into 0px 0px 20px 0px
 * @param values
 * @return {string|null}
 */
var squaresToString = exports.squaresToString = function squaresToString(values) {

    if (values && typeof values !== 'undefined') {
        return values[0] + values[4] + " " + values[1] + values[4] + " " + values[2] + values[4] + " " + values[3] + values[4];
    }

    return null;
};

/**
 * For the UI the padding cannot be 0
 * (example: overlapping nested divs)
 */
var generatePadding = exports.generatePadding = function generatePadding(padding) {

    var minPadding = 10;

    if (padding !== null && typeof padding !== 'undefined') {
        var paddings = [];

        if (padding[0] < minPadding) {
            paddings.push(minPadding);
        } else {
            paddings.push(padding[0]);
        }
        if (padding[0] < minPadding) {
            paddings.push(minPadding);
        } else {
            paddings.push(padding[1]);
        }
        if (padding[0] < minPadding) {
            paddings.push(minPadding);
        } else {
            paddings.push(padding[2]);
        }
        if (padding[0] < minPadding) {
            paddings.push(minPadding);
        } else {
            paddings.push(padding[3]);
        }
        if (padding[4] !== null) {
            paddings.push(padding[4]);
        } else {
            paddings.push("px");
        }

        return squaresToString(paddings);
    }

    return minPadding + 'px';
};

/**
 *
 * @param item
 * @param searchTerm
 * @return {boolean}
 */
var likeThat = exports.likeThat = function likeThat(item, searchTerm) {
    return item.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
};

/**
 *
 * @param string
 * @return {*}
 */
var addSlashes = exports.addSlashes = function addSlashes(string) {
    return string.replace(/\\/g, '\\\\').replace(/\u0008/g, '\\b').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\f/g, '\\f').replace(/\r/g, '\\r').replace(/'/g, '\\\'').replace(/"/g, '\\"');
};

/**
 *
 * @param string
 * @param maxLength
 * @return {string}
 */
var sluggifyString = exports.sluggifyString = function sluggifyString(string, maxLength) {

    var sanitized = '';

    if (typeof string === 'string') {
        sanitized = string.toLowerCase();
        sanitized = sanitized.replace(" ", "-");
        sanitized = sanitized.replace(/[^a-z0-9_\-]/g, '-');
    }

    return sanitized.substr(0, maxLength ? maxLength : 20);
};

/***/ })

}]);
//# sourceMappingURL=112.js.map