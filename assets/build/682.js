(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[682],{

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

/***/ 595:
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

var _reactCodemirror = __webpack_require__(7969);

var _reactCodemirror2 = _interopRequireDefault(_reactCodemirror);

var _codemirrorExtensionsLangs = __webpack_require__(1582);

var _misc = __webpack_require__(3154);

var _reactHotToast = __webpack_require__(4500);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _react3 = __webpack_require__(4226);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Code = function Code(_ref) {
    var code = _ref.code,
        _ref$height = _ref.height,
        height = _ref$height === undefined ? "300px" : _ref$height,
        _ref$editable = _ref.editable,
        editable = _ref$editable === undefined ? true : _ref$editable,
        _ref$copyToClipboard = _ref.copyToClipboard,
        copyToClipboard = _ref$copyToClipboard === undefined ? true : _ref$copyToClipboard;

    var _useState = (0, _react.useState)(code),
        _useState2 = _slicedToArray(_useState, 2),
        updatedValue = _useState2[0],
        setUpdatedValue = _useState2[1];

    return wp.element.createElement(
        'div',
        { className: 'acpt-code' },
        wp.element.createElement(_reactCodemirror2.default, {
            value: code,
            height: height,
            editable: editable,
            theme: 'light',
            extensions: [_codemirrorExtensionsLangs.langs.php({})],
            onChange: function onChange(value) {
                setUpdatedValue(value);
            }
        }),
        copyToClipboard && wp.element.createElement(
            'button',
            {
                className: 'copy-to-clipboard',
                onClick: function onClick(e) {
                    e.preventDefault();
                    (0, _misc.copyToTheClipboard)(typeof updatedValue === 'undefined' ? code : updatedValue);
                    _reactHotToast.toast.success((0, _useTranslation2.default)("Copied to the clipboard!"));
                }
            },
            wp.element.createElement(_react3.Icon, { icon: 'bx:copy', color: '#777', width: 24 })
        )
    );
};

Code.propTypes = {
    code: _propTypes2.default.string.isRequired,
    height: _propTypes2.default.string,
    editable: _propTypes2.default.bool,
    copyToClipboard: _propTypes2.default.bool
};

exports.default = Code;

/***/ }),

/***/ 740:
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

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ElementTypeBadge = function ElementTypeBadge(_ref) {
    var element = _ref.element;


    var variant = void 0;
    var label = void 0;

    if (element.id === 'user_meta') {
        variant = _styles.styleVariants.DANGER;
        label = (0, _useTranslation2.default)("User");
    } else if (element.children) {
        variant = element.children.length > 0 || element.parentId === null ? _styles.styleVariants.SECONDARY : _styles.styleVariants.WARNING;
        label = (0, _useTranslation2.default)(element.children.length > 0 || element.parentId === null ? "Parent" : "Child");
    } else if (element.isNative) {
        variant = _styles.styleVariants.SECONDARY;
        label = (0, _useTranslation2.default)("Native");
    } else if (element.isWooCommerce) {
        variant = _styles.styleVariants.INFO;
        label = "WooCommerce";
    } else {
        variant = _styles.styleVariants.WARNING;
        label = (0, _useTranslation2.default)('Custom');
    }

    return wp.element.createElement(
        _Badge2.default,
        { style: variant },
        label
    );
};

ElementTypeBadge.propTypes = {
    element: _propTypes2.default.object.isRequired
};

exports.default = ElementTypeBadge;

/***/ }),

/***/ 8930:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _index = __webpack_require__(6103);

var _index2 = _interopRequireDefault(_index);

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Tabs = __webpack_require__(7222);

var _Tabs2 = _interopRequireDefault(_Tabs);

var _Tab = __webpack_require__(8360);

var _Tab2 = _interopRequireDefault(_Tab);

var _Code = __webpack_require__(595);

var _Code2 = _interopRequireDefault(_Code);

var _ajax = __webpack_require__(7569);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ExportCodeModal = function ExportCodeModal(_ref) {
    var belongsTo = _ref.belongsTo,
        find = _ref.find;

    // manage local state
    var _useState = (0, _react.useState)({}),
        _useState2 = _slicedToArray(_useState, 2),
        codeStrings = _useState2[0],
        setCodeStrings = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = _slicedToArray(_useState3, 2),
        modalOpen = _useState4[0],
        setModalOpen = _useState4[1];

    (0, _react.useEffect)(function () {
        if (modalOpen === true) {
            (0, _ajax.wpAjaxRequest)("exportCodeAction", { belongsTo: belongsTo, find: find }).then(function (res) {
                setCodeStrings(res);
            }).catch(function (err) {
                console.error(err.message);
            });
        }
    }, [modalOpen]);

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _index2.default,
            { title: (0, _useTranslation2.default)("Export code"), visible: modalOpen, textAlign: "left" },
            wp.element.createElement(
                _Tabs2.default,
                null,
                wp.element.createElement(
                    _Tab2.default,
                    { title: "WORDPRESS" },
                    wp.element.createElement(_Code2.default, { code: codeStrings.wordpress, editable: false })
                ),
                wp.element.createElement(
                    _Tab2.default,
                    { title: "ACPT" },
                    wp.element.createElement(_Code2.default, { code: codeStrings.acpt, editable: false })
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
            (0, _useTranslation2.default)("Export code")
        )
    );
};

ExportCodeModal.propTypes = {
    belongsTo: _propTypes2.default.string.isRequired,
    find: _propTypes2.default.string.isRequired
};

exports.default = ExportCodeModal;

/***/ }),

/***/ 655:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _index = __webpack_require__(6103);

var _index2 = _interopRequireDefault(_index);

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _styles = __webpack_require__(624);

var _fetchMetaSlice = __webpack_require__(9731);

var _reactRedux = __webpack_require__(6706);

var _reactRouterDom = __webpack_require__(4022);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FieldGroupsModal = function FieldGroupsModal(_ref) {
    var belongsTo = _ref.belongsTo,
        find = _ref.find;


    var documentGlobals = document.globals;
    var globals = documentGlobals.globals;

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchMeta;
    }),
        data = _useSelector.data,
        loading = _useSelector.loading;

    // manage local state


    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    (0, _react.useEffect)(function () {
        dispatch((0, _fetchMetaSlice.fetchMeta)({
            belongsTo: belongsTo,
            find: find
        }));
    }, [modalOpen, belongsTo, find]);

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _index2.default,
            { title: (0, _useTranslation2.default)("Associated meta fields"), visible: modalOpen, textAlign: "left" },
            loading ? wp.element.createElement(
                "div",
                null,
                (0, _useTranslation2.default)("Loading...")
            ) : wp.element.createElement(
                _react2.default.Fragment,
                null,
                data.records && data.records.length > 0 ? wp.element.createElement(
                    "div",
                    { className: "responsive" },
                    wp.element.createElement(
                        "table",
                        { className: "acpt-table with-border b-rounded " + (globals.is_rtl ? 'rtl' : '') },
                        wp.element.createElement(
                            "thead",
                            null,
                            wp.element.createElement(
                                "tr",
                                null,
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Group name")
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
                            data.records.map(function (record) {
                                return wp.element.createElement(
                                    "tr",
                                    null,
                                    wp.element.createElement(
                                        "td",
                                        null,
                                        record.name
                                    ),
                                    wp.element.createElement(
                                        "td",
                                        null,
                                        record.fieldsCount
                                    ),
                                    wp.element.createElement(
                                        "td",
                                        null,
                                        wp.element.createElement(
                                            "div",
                                            { className: "i-flex-center s-8" },
                                            wp.element.createElement(
                                                _reactRouterDom.Link,
                                                { to: "/edit_meta/" + record.id },
                                                (0, _useTranslation2.default)("Edit")
                                            )
                                        )
                                    )
                                );
                            })
                        )
                    )
                ) : wp.element.createElement(
                    _Alert2.default,
                    { style: _styles.styleVariants.SECONDARY },
                    (0, _useTranslation2.default)("No meta group found.")
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
            (0, _useTranslation2.default)("Show")
        )
    );
};

FieldGroupsModal.propTypes = {
    belongsTo: _propTypes2.default.string.isRequired,
    find: _propTypes2.default.string.isRequired
};

exports.default = FieldGroupsModal;

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

/***/ 1895:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var metaTypes = exports.metaTypes = {
    CUSTOM_POST_TYPE: "customPostType",
    OPTION_PAGE: "optionPage",
    TAXONOMY: "taxonomy",
    USER: "user"
};

/***/ })

}]);
//# sourceMappingURL=682.js.map