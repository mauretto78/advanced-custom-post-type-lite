(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[26],{

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

/***/ 2301:
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

var _styles = __webpack_require__(624);

var _metaTypes = __webpack_require__(1895);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Badge = __webpack_require__(3136);

var _Badge2 = _interopRequireDefault(_Badge);

var _ajax = __webpack_require__(7569);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BelongBadge = function BelongBadge(_ref) {
    var belongsTo = _ref.belongsTo,
        find = _ref.find;

    var _useState = (0, _react.useState)(find),
        _useState2 = _slicedToArray(_useState, 2),
        findValue = _useState2[0],
        setFindValue = _useState2[1];

    var style = _styles.styleVariants.SECONDARY;

    if (belongsTo === _metaTypes.metaTypes.TAXONOMY || belongsTo === 'TERM_ID') {
        style = _styles.styleVariants.WARNING;
    }

    if (belongsTo === _metaTypes.metaTypes.OPTION_PAGE) {
        style = _styles.styleVariants.INFO;
    }

    if (belongsTo === "USER_ID") {
        style = _styles.styleVariants.DANGER;
    }

    var fetchFind = function fetchFind() {
        (0, _ajax.wpAjaxRequest)("fetchFindAction", { belongsTo: belongsTo, id: find }).then(function (res) {
            setFindValue(res);
        }).catch(function (err) {
            console.error(err.message);
        });
    };

    if (belongsTo === "POST_ID" || belongsTo === "POST_TAX" || belongsTo === "POST_CAT" || belongsTo === "POST_TEMPLATE" || belongsTo === "TERM_ID" || belongsTo === "USER_ID") {
        fetchFind();
    }

    if (belongsTo === _metaTypes.metaTypes.USER) {
        return wp.element.createElement(
            _Badge2.default,
            { style: _styles.styleVariants.DANGER },
            (0, _useTranslation2.default)("User")
        );
    }

    return wp.element.createElement(
        _Badge2.default,
        { style: style },
        findValue
    );
};

BelongBadge.propTypes = {
    belongsTo: _propTypes2.default.string.isRequired,
    find: _propTypes2.default.string.isRequired
};

exports.default = BelongBadge;

/***/ }),

/***/ 4545:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRouterDom = __webpack_require__(4022);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ButtonLink = function ButtonLink(_ref) {
    var _ref$style = _ref.style,
        style = _ref$style === undefined ? 'default' : _ref$style,
        _ref$size = _ref.size,
        size = _ref$size === undefined ? 'default' : _ref$size,
        to = _ref.to,
        target = _ref.target,
        children = _ref.children;

    return wp.element.createElement(
        _reactRouterDom.Link,
        {
            to: to ? to : '#',
            target: target,
            className: 'acpt-btn acpt-btn-' + style + ' acpt-btn-' + size
        },
        children
    );
};

ButtonLink.propTypes = {
    style: _propTypes2.default.oneOf(Object.values(_styles.styleVariants)).isRequired,
    size: _propTypes2.default.oneOf(['default', 'sm', 'xs']),
    to: _propTypes2.default.string.isRequired,
    target: _propTypes2.default.oneOf(['_blank', '_self', '_parent', '_top'])
};

exports.default = ButtonLink;

/***/ }),

/***/ 6123:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _index = __webpack_require__(6103);

var _index2 = _interopRequireDefault(_index);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _styles = __webpack_require__(624);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _BelongBadge = __webpack_require__(2301);

var _BelongBadge2 = _interopRequireDefault(_BelongBadge);

var _metaTypes = __webpack_require__(1895);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BelongsModal = function BelongsModal(_ref) {
    var belongs = _ref.belongs;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    // manage local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    /**
     *
     * @param belong
     * @return {string|*}
     */


    var belongsTo = function belongsTo(belong) {

        if (!belong.belongsTo) {
            return '';
        }

        var string = '';

        switch (belong.belongsTo) {
            case _metaTypes.metaTypes.CUSTOM_POST_TYPE:
                string = "Custom post type";
                break;

            case _metaTypes.metaTypes.TAXONOMY:
                string = "Taxonomy";
                break;

            case _metaTypes.metaTypes.OPTION_PAGE:
                string = "Option page";
                break;

            case _metaTypes.metaTypes.USER:
                string = "All users";
                break;

            case "POST_ID":
                string = "Post";
                break;

            case "POST_TEMPLATE":
                string = "Post template";
                break;

            case "POST_TAX":
                string = "Post taxonomy";
                break;

            case "POST_CAT":
                string = "Post category";
                break;

            case "TERM_ID":
                string = "Term";
                break;

            case "USER_ID":
                string = "User";
                break;
        }

        return (0, _useTranslation2.default)(string);
    };

    /**
     *
     * @param belong
     * @return {*}
     */
    var operator = function operator(belong) {

        if (!belong.operator) {
            return '';
        }

        var string = '';

        switch (belong.operator) {
            case "=":
                string = "is equal to";
                break;

            case "!=":
                string = "is not equal to";
                break;

            case "IN":
                string = "is included in";
                break;

            case "NOT_IN":
                string = "is not included in";
                break;
        }

        return (0, _useTranslation2.default)(string);
    };

    /**
     *
     * @param belong
     * @return {*}
     */
    var find = function find(belong) {
        if (!belong.find || belong.find === '') {
            return '';
        }

        var finds = belong.find.split(",");

        if (finds.length > 0) {
            return wp.element.createElement(
                "div",
                { className: "i-flex-center flex-wrap s-4" },
                finds.map(function (find) {
                    return wp.element.createElement(_BelongBadge2.default, {
                        belongsTo: belong.belongsTo,
                        find: find
                    });
                })
            );
        }

        return '';
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _index2.default,
            { title: (0, _useTranslation2.default)("Location"), visible: modalOpen, textAlign: "left" },
            belongs.length > 0 ? wp.element.createElement(
                "div",
                { className: "responsive" },
                wp.element.createElement(
                    "table",
                    { className: "acpt-table spaceless " + (globals.is_rtl ? 'rtl' : '') },
                    wp.element.createElement(
                        "tbody",
                        null,
                        belongs.map(function (belong, index) {

                            var isLast = index === belongs.length - 1;

                            return wp.element.createElement(
                                "tr",
                                null,
                                wp.element.createElement(
                                    "td",
                                    null,
                                    belongsTo(belong)
                                ),
                                wp.element.createElement(
                                    "td",
                                    null,
                                    operator(belong)
                                ),
                                wp.element.createElement(
                                    "td",
                                    null,
                                    find(belong)
                                ),
                                wp.element.createElement(
                                    "td",
                                    null,
                                    !isLast && belong.logic && (0, _useTranslation2.default)(belong.logic)
                                )
                            );
                        })
                    )
                )
            ) : wp.element.createElement(
                _Alert2.default,
                { style: _styles.styleVariants.SECONDARY },
                (0, _useTranslation2.default)("No conditions are present.")
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
            (0, _useTranslation2.default)("Show")
        )
    );
};

BelongsModal.propTypes = {
    belongs: _propTypes2.default.array.isRequired
};

exports.default = BelongsModal;

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

/***/ 5253:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(4022);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pagination = function Pagination(_ref) {
    var currentPage = _ref.currentPage,
        totalPages = _ref.totalPages,
        baseLink = _ref.baseLink;


    var rows = [];
    for (var i = 1; i <= totalPages; i++) {
        rows.push(i);
    }

    if (rows.length < 2) {
        return null;
    }

    return wp.element.createElement(
        "ul",
        { className: "acpt-pagination" },
        rows.map(function (row, index) {
            return wp.element.createElement(
                "li",
                { key: index },
                row === currentPage ? wp.element.createElement(
                    "span",
                    null,
                    row
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    { to: baseLink + "/" + row },
                    row
                )
            );
        })
    );
};

Pagination.propTypes = {
    currentPage: _propTypes2.default.number.isRequired,
    totalPages: _propTypes2.default.number.isRequired,
    baseLink: _propTypes2.default.string.isRequired
};

exports.default = Pagination;

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

/***/ 410:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BulkActions = function BulkActions() {

    // manage form state
    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control,
        register = _useFormContext.register;

    var watchedElements = (0, _reactHookForm.useWatch)({
        control: control,
        name: "elements"
    });

    /**
     *
     * @return {number}
     */
    var count = function count() {

        var count = 0;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(watchedElements)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref = _step.value;

                var _ref2 = _slicedToArray(_ref, 2);

                var key = _ref2[0];
                var value = _ref2[1];

                if (value === true) {
                    count++;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return count;
    };

    return wp.element.createElement(
        "div",
        { className: "flex-between s-8 mb-24" },
        wp.element.createElement(
            "span",
            null,
            count(),
            " ",
            (0, _useTranslation2.default)("Selected items")
        ),
        wp.element.createElement(
            "div",
            { className: "i-flex-center s-8" },
            wp.element.createElement(
                "select",
                _extends({
                    name: "action",
                    className: "form-control sm"
                }, register("action")),
                wp.element.createElement(
                    "option",
                    { value: "" },
                    (0, _useTranslation2.default)("Select")
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
                    size: "sm"
                },
                (0, _useTranslation2.default)("Execute")
            )
        )
    );
};

exports.default = BulkActions;

/***/ }),

/***/ 5345:
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

var _reactRouterDom = __webpack_require__(4022);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _DeleteMetaModal = __webpack_require__(3074);

var _DeleteMetaModal2 = _interopRequireDefault(_DeleteMetaModal);

var _BelongsModal = __webpack_require__(6123);

var _BelongsModal2 = _interopRequireDefault(_BelongsModal);

var _reactHookForm = __webpack_require__(930);

var _fields = __webpack_require__(857);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaListElement = (0, _react.memo)(function (_ref) {
    var record = _ref.record,
        page = _ref.page;

    // manage form state
    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register;

    var formId = 'elements.' + record.id;

    /**
     *
     * @param display
     * @return {*}
     */
    var displayAs = function displayAs(display) {
        switch (display) {
            default:
            case _fields.fieldGroupsDisplay.STANDARD:
                return (0, _useTranslation2.default)("Standard view");

            case _fields.fieldGroupsDisplay.ACCORDION:
                return (0, _useTranslation2.default)("Accordion");

            case _fields.fieldGroupsDisplay.HORIZONTAL_TABS:
                return (0, _useTranslation2.default)("Horizontal tabs");

            case _fields.fieldGroupsDisplay.VERTICAL_TABS:
                return (0, _useTranslation2.default)("Vertical tabs");

        }
    };

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            'tr',
            null,
            wp.element.createElement(
                'td',
                { style: {
                        width: "24px"
                    } },
                wp.element.createElement(
                    'label',
                    { className: 'checkbox', htmlFor: formId },
                    wp.element.createElement('input', _extends({
                        type: 'checkbox',
                        id: formId,
                        name: formId,
                        defaultChecked: false
                    }, register(formId))),
                    wp.element.createElement('span', null)
                )
            ),
            wp.element.createElement(
                'td',
                null,
                record.name
            ),
            wp.element.createElement(
                'td',
                null,
                record.label
            ),
            wp.element.createElement(
                'td',
                null,
                displayAs(record.display)
            ),
            wp.element.createElement(
                'td',
                null,
                wp.element.createElement(_BelongsModal2.default, { belongs: record.belongs })
            ),
            wp.element.createElement(
                'td',
                null,
                record.fieldsCount
            ),
            wp.element.createElement(
                'td',
                null,
                wp.element.createElement(
                    'div',
                    { className: 'i-flex-center s-8' },
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        { to: '/edit_meta/' + record.id },
                        (0, _useTranslation2.default)("Edit")
                    ),
                    wp.element.createElement(_DeleteMetaModal2.default, {
                        id: record.id,
                        page: page
                    })
                )
            )
        )
    );
});

MetaListElement.propTypes = {
    page: _propTypes2.default.number.isRequired,
    record: _propTypes2.default.object.isRequired
};

exports.default = MetaListElement;

/***/ }),

/***/ 3074:
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

var _styles = __webpack_require__(624);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _reactRedux = __webpack_require__(6706);

var _deleteMetaSlice = __webpack_require__(3557);

var _reactHotToast = __webpack_require__(4500);

var _reactRouterDom = __webpack_require__(4022);

var _fetchMetaSlice = __webpack_require__(9731);

var _objects = __webpack_require__(4040);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteMetaModal = function DeleteMetaModal(_ref) {
    var page = _ref.page,
        id = _ref.id;


    var documentGlobals = document.globals;
    var settings = documentGlobals.settings;

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state
    var perPage = settings.length > 0 && (0, _objects.filterByLabel)(settings, 'key', 'records_per_page') !== '' ? (0, _objects.filterByLabel)(settings, 'key', 'records_per_page').value : 20;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalVisible = _useState2[0],
        setmodalVisible = _useState2[1];

    // manage redirect


    var navigate = (0, _reactRouterDom.useNavigate)();

    var handleDeleteModal = function handleDeleteModal() {
        dispatch((0, _deleteMetaSlice.deleteMeta)(id)).then(function (res) {
            var payload = res.payload;

            if (payload.success) {
                navigate('/meta');
                setmodalVisible(!modalVisible);
                _reactHotToast.toast.success((0, _useTranslation2.default)("Meta group successfully deleted."));
                dispatch((0, _fetchMetaSlice.fetchMeta)({
                    page: page ? page : 1,
                    perPage: perPage
                }));
            } else {
                _reactHotToast.toast.error(payload.error);
            }
        }).catch(function (err) {
            return console.error(err);
        });
    };

    var buttons = [wp.element.createElement(
        _Button2.default,
        {
            style: _styles.styleVariants.DANGER,
            onClick: function onClick() {
                handleDeleteModal();
            }
        },
        (0, _useTranslation2.default)("Yes, delete it")
    ), wp.element.createElement(
        _Button2.default,
        {
            style: _styles.styleVariants.SECONDARY,
            onClick: function onClick() {
                setmodalVisible(!modalVisible);
            }
        },
        (0, _useTranslation2.default)("Return back to list")
    )];

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            { title: (0, _useTranslation2.default)('Delete meta group'), buttons: buttons, visible: modalVisible },
            wp.element.createElement(
                "div",
                null,
                (0, _useTranslation2.default)("You are going to delete this meta group. Are you sure?")
            )
        ),
        wp.element.createElement(
            "a",
            {
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    setmodalVisible(!modalVisible);
                }
            },
            (0, _useTranslation2.default)("Delete")
        )
    );
};

DeleteMetaModal.propTypes = {
    page: _propTypes2.default.number.isRequired,
    id: _propTypes2.default.string.isRequired
};

exports.default = DeleteMetaModal;

/***/ }),

/***/ 1026:
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

var _misc = __webpack_require__(3154);

var _reactRedux = __webpack_require__(6706);

var _fetchMetaSlice = __webpack_require__(9731);

var _reactRouterDom = __webpack_require__(4022);

var _objects = __webpack_require__(4040);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _ButtonLink = __webpack_require__(4545);

var _ButtonLink2 = _interopRequireDefault(_ButtonLink);

var _styles = __webpack_require__(624);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _MetaListElement = __webpack_require__(5345);

var _MetaListElement2 = _interopRequireDefault(_MetaListElement);

var _Pagination = __webpack_require__(5253);

var _Pagination2 = _interopRequireDefault(_Pagination);

var _reactHookForm = __webpack_require__(930);

var _metaTypes = __webpack_require__(1895);

var _ajax = __webpack_require__(7569);

var _reactHotToast = __webpack_require__(4500);

var _BulkActions = __webpack_require__(410);

var _BulkActions2 = _interopRequireDefault(_BulkActions);

var _react3 = __webpack_require__(8839);

var _scroll = __webpack_require__(2727);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaList = function MetaList() {

    var documentGlobals = document.globals;
    var settings = documentGlobals.settings;
    var globals = documentGlobals.globals;

    // auto-animate

    var _useAutoAnimate = (0, _react3.useAutoAnimate)(),
        _useAutoAnimate2 = _slicedToArray(_useAutoAnimate, 1),
        parent = _useAutoAnimate2[0];

    // ref


    var ref = (0, _react.useRef)();

    // form init
    var methods = (0, _reactHookForm.useForm)({
        mode: 'all'
    });

    var watchedElements = (0, _reactHookForm.useWatch)({
        control: methods.control,
        name: "elements"
    });

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchMeta;
    }),
        data = _useSelector.data,
        loading = _useSelector.loading;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        page = _useParams.page;

    var perPage = settings.length > 0 && (0, _objects.filterByLabel)(settings, 'key', 'records_per_page') !== '' ? (0, _objects.filterByLabel)(settings, 'key', 'records_per_page').value : 20;
    var totalPages = Math.ceil(data.count / perPage);

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _useTranslation2.default)("Field groups"));
        (0, _misc.changeCurrentAdminMenuLink)('#/meta');
        dispatch((0, _fetchMetaSlice.fetchMeta)({
            page: page ? page : 1,
            perPage: perPage
        }));
    }, [page]);

    (0, _react.useEffect)(function () {

        /**
         *
         * @return {boolean}
         */
        var areAllSelected = function areAllSelected() {

            if (!watchedElements) {
                return false;
            }

            var matches = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(watchedElements)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var key = _ref2[0];
                    var value = _ref2[1];

                    if (value === true) {
                        matches++;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return matches === Object.entries(watchedElements).length;
        };

        if (areAllSelected()) {
            ref.current.checked = true;
        } else {
            if (ref.current) {
                ref.current.checked = false;
            }
        }
    }, [watchedElements]);

    /**
     *
     * @return {boolean}
     */
    var showBulkActions = function showBulkActions() {

        if (!watchedElements) {
            return false;
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Object.entries(watchedElements)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _ref3 = _step2.value;

                var _ref4 = _slicedToArray(_ref3, 2);

                var key = _ref4[0];
                var value = _ref4[1];

                if (value === true) {
                    return true;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return false;
    };

    var onSubmit = function onSubmit(data) {
        methods.reset();
        data.belongsTo = _metaTypes.metaTypes.META;
        (0, _ajax.wpAjaxRequest)('bulkActionsAction', data).then(function (res) {
            if (res.success === true) {

                // flush message
                switch (data.action) {
                    case "delete":
                        _reactHotToast.toast.success((0, _useTranslation2.default)("Meta group successfully deleted."));
                        methods.resetField("elements");
                        (0, _scroll.scrollToTop)();

                        // refresh items
                        dispatch((0, _fetchMetaSlice.fetchMeta)({
                            page: page ? page : 1,
                            perPage: perPage
                        }));

                        break;
                }
            } else {
                _reactHotToast.toast.error(res.error);
            }
        }).catch(function (err) {
            console.error(err);
            _reactHotToast.toast.error((0, _useTranslation2.default)("Unknown error, please retry later"));
        });
    };

    var actions = [wp.element.createElement(
        _ButtonLink2.default,
        { style: _styles.styleVariants.PRIMARY, to: "/register_meta" },
        (0, _useTranslation2.default)("Create new Meta group")
    )];

    if (loading) {
        return wp.element.createElement(_Loader2.default, null);
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
                    title: (0, _useTranslation2.default)("Field groups"),
                    actions: actions,
                    crumbs: [{
                        label: (0, _useTranslation2.default)("Field groups")
                    }]
                },
                wp.element.createElement(
                    "div",
                    { ref: parent },
                    showBulkActions() && wp.element.createElement(_BulkActions2.default, null)
                ),
                data.records && data.records.length > 0 ? wp.element.createElement(
                    "div",
                    { className: "responsive" },
                    wp.element.createElement(
                        "table",
                        { className: "acpt-table with-shadow " + (globals.is_rtl ? 'rtl' : '') },
                        wp.element.createElement(
                            "thead",
                            null,
                            wp.element.createElement(
                                "tr",
                                null,
                                wp.element.createElement(
                                    "th",
                                    { style: {
                                            width: "24px"
                                        } },
                                    wp.element.createElement(
                                        "label",
                                        { className: "checkbox", htmlFor: "all" },
                                        wp.element.createElement("input", {
                                            ref: ref,
                                            type: "checkbox",
                                            id: "all",
                                            defaultChecked: false,
                                            onClick: function onClick(e) {
                                                data.records.map(function (r) {
                                                    methods.setValue("elements." + r.id, e.currentTarget.checked);
                                                });
                                            }
                                        }),
                                        wp.element.createElement("span", null)
                                    )
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Group name")
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Group label")
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Display as")
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Location")
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Fields count")
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Actions")
                                )
                            )
                        ),
                        wp.element.createElement(
                            "tbody",
                            null,
                            data.records && data.records.map(function (record) {
                                return wp.element.createElement(_MetaListElement2.default, {
                                    page: page,
                                    record: record,
                                    key: record.id
                                });
                            })
                        ),
                        totalPages > 1 && wp.element.createElement(
                            "tfoot",
                            null,
                            wp.element.createElement(
                                "tr",
                                null,
                                wp.element.createElement(
                                    "td",
                                    { colSpan: 7 },
                                    wp.element.createElement(_Pagination2.default, {
                                        currentPage: page ? parseInt(page) : 1,
                                        totalPages: totalPages,
                                        baseLink: "/meta"
                                    })
                                )
                            )
                        )
                    )
                ) : wp.element.createElement(
                    _Alert2.default,
                    { style: _styles.styleVariants.SECONDARY },
                    (0, _useTranslation2.default)("No meta group found."),
                    " ",
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        { to: "/register_meta" },
                        (0, _useTranslation2.default)("Register the first one")
                    ),
                    "!"
                )
            )
        )
    );
};

MetaList.propTypes = {};

exports.default = MetaList;

/***/ })

}]);
//# sourceMappingURL=26.js.map