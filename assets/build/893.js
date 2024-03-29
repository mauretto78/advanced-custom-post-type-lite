(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[893],{

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

/***/ 5438:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _StepsHeaderElement = __webpack_require__(5519);

var _StepsHeaderElement2 = _interopRequireDefault(_StepsHeaderElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StepsHeader = function StepsHeader(_ref) {
    var stepActive = _ref.stepActive,
        headings = _ref.headings;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    return wp.element.createElement(
        "div",
        { className: "acpt-steps " + (globals.is_rtl === true ? "rtl" : "") },
        headings.map(function (heading, index) {
            return wp.element.createElement(_StepsHeaderElement2.default, { heading: heading, index: index, stepActive: stepActive });
        })
    );
};

StepsHeader.propTypes = {
    stepActive: _propTypes2.default.number.isRequired,
    headings: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        label: _propTypes2.default.string.isRequired,
        description: _propTypes2.default.string.isRequired
    })).isRequired
};

exports.default = StepsHeader;

/***/ }),

/***/ 5519:
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

var StepsHeaderElement = function StepsHeaderElement(_ref) {
    var heading = _ref.heading,
        stepActive = _ref.stepActive,
        index = _ref.index;


    var getClassName = function getClassName() {
        var className = 'acpt-steps-heading';

        if (index === stepActive) {
            className += ' active';
        } else if (stepActive > index) {
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
            index + 1
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
};

StepsHeaderElement.propTypes = {
    index: _propTypes2.default.number.isRequired,
    stepActive: _propTypes2.default.number.isRequired,
    heading: _propTypes2.default.shape({
        label: _propTypes2.default.string.isRequired,
        description: _propTypes2.default.string.isRequired
    }).isRequired
};

exports.default = StepsHeaderElement;

/***/ }),

/***/ 3377:
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

var Steps = function Steps(_ref) {
    var steps = _ref.steps,
        _ref$activeStep = _ref.activeStep,
        activeStep = _ref$activeStep === undefined ? 0 : _ref$activeStep;


    var realActiveStep = function realActiveStep() {

        if (activeStep < 0) {
            return 0;
        }

        if (activeStep > steps.length) {
            return steps.length;
        }

        return activeStep;
    };

    if (!steps[realActiveStep()]) {
        return null;
    }

    return wp.element.createElement(
        "div",
        null,
        steps[realActiveStep()]
    );
};

Steps.propTypes = {
    activeStep: _propTypes2.default.number,
    steps: _propTypes2.default.arrayOf(_propTypes2.default.element).isRequired
};

exports.default = Steps;

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
//# sourceMappingURL=893.js.map