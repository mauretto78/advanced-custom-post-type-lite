(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[889],{

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

/***/ 7306:
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Boolean = function Boolean(_ref) {
    var status = _ref.status;


    var icon = status ? 'bx:bx-check' : 'bx:bx-x';
    var color = status ? '#02C39A' : '#F94144';

    return wp.element.createElement(_react3.Icon, { icon: icon, color: color, width: '18px' });
};

Boolean.propTypes = {
    status: _propTypes2.default.bool.isRequired
};

exports.default = Boolean;

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

/***/ 2517:
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
        { className: 'i-flex-center s-4' },
        wp.element.createElement('span', { className: 'wcicon-' + icon }),
        wp.element.createElement(
            'span',
            null,
            label
        )
    );
};

exports.default = WooCommerceListElement;

/***/ }),

/***/ 8291:
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WooCommerceProductDataVisibility = function WooCommerceProductDataVisibility(_ref) {
    var visibility = _ref.visibility;


    var vis = [];

    if (visibility.includes('show_if_simple')) {
        vis.push("Show in simple products");
    }
    if (visibility.includes('show_if_variable')) {
        vis.push("Show in variable products");
    }
    if (visibility.includes('show_if_grouped')) {
        vis.push("Show in grouped products");
    }
    if (visibility.includes('show_if_external')) {
        vis.push("Show in external products");
    }
    if (visibility.includes('hide_if_virtual')) {
        vis.push("Hide in virtual products");
    }
    if (visibility.includes('hide_if_external')) {
        vis.push("Hide in external products");
    }

    return wp.element.createElement(
        'div',
        { className: 'max-w-400 flex-wrap i-flex-center s-8' },
        vis.map(function (vis) {
            return wp.element.createElement(
                'span',
                { className: 'acpt-badge' },
                wp.element.createElement(
                    'span',
                    { className: 'label' },
                    (0, _useTranslation2.default)(vis)
                )
            );
        })
    );
};

WooCommerceProductDataVisibility.propTypes = {
    visibility: _propTypes2.default.array.isRequired
};

exports.default = WooCommerceProductDataVisibility;

/***/ }),

/***/ 9132:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.woocommerceIconsList = exports.woocommerceIconsMap = undefined;

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _WooCommerceListElement = __webpack_require__(2517);

var _WooCommerceListElement2 = _interopRequireDefault(_WooCommerceListElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var woocommerceIconsMap = exports.woocommerceIconsMap = {
    "\\e900": "storefront",
    "\\e604": "ccv",
    "\\e000": "virtual",
    "\\e022": "down",
    "\\e023": "reports",
    "\\e031": "refresh",
    "\\e032": "navigation",
    "\\e03c": "status-fill",
    "\\e004": "contract",
    "\\e001": "downloadable",
    "\\e007": "plus",
    "\\e006": "simple",
    "\\e033": "on-hold",
    "\\e034": "external",
    "\\e036": "contract-2",
    "\\e035": "expand-2",
    "\\e037": "phone",
    "\\e038": "user",
    "\\e039": "status",
    "\\e012": "status-pending",
    "\\e013": "status-cancelled",
    "\\e02f": "west",
    "\\e02e": "south",
    "\\e02d": "mail",
    "\\e02c": "inventory",
    "\\e02b": "attributes",
    "\\e02a": "north",
    "\\e029": "east",
    "\\e028": "note",
    "\\e027": "windows",
    "\\e026": "user2",
    "\\e025": "search-2",
    "\\e024": "search",
    "\\e021": "star-empty",
    "\\e030": "share",
    "\\e03b": "phone-fill",
    "\\e03d": "woo",
    "\\e03a": "user-fill",
    "\\e002": "grouped",
    "\\e014": "status-refunded",
    "\\e015": "status-completed",
    "\\e003": "variable",
    "\\e005": "expand",
    "\\e016": "status-failed",
    "\\e017": "check",
    "\\e008": "right",
    "\\e009": "up",
    "\\e018": "query",
    "\\e00a": "down",
    "\\e019": "truck-1",
    "\\e00b": "left",
    "\\e01a": "truck-2",
    "\\e00c": "image",
    "\\e01b": "globe",
    "\\e00d": "link",
    "\\e01c": "gear",
    "\\e00e": "calendar",
    "\\e01d": "cart",
    "\\e00f": "processing",
    "\\e01e": "card",
    "\\e010": "view",
    "\\e01f": "stats",
    "\\e011": "status-processing",
    "\\e020": "star-full",
    "\\e600": "coupon",
    "\\e601": "limit",
    "\\e602": "restricted",
    "\\e603": "edit"
};

var woocommerceIconsList = exports.woocommerceIconsList = [{ value: "\\e900", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "storefront", label: "Store front" }) }, { value: "\\e604", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "ccv", label: "CCV" }) }, { value: "\\e000", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "virtual", label: "Virtual" }) }, { value: "\\e022", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "down", label: "Down" }) }, { value: "\\e023", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "reports", label: "Reports" }) }, { value: "\\e031", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "refresh", label: "Refersh" }) }, { value: "\\e032", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "navigation", label: "Navigation" }) }, { value: "\\e03c", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-fill", label: "Status-fill" }) }, { value: "\\e004", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "contract", label: "Contract" }) }, { value: "\\e001", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "downloadable", label: "Downloadable" }) }, { value: "\\e007", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "plus", label: "Plus" }) }, { value: "\\e006", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "simple", label: "Simple" }) }, { value: "\\e033", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "on-hold", label: "On hold" }) }, { value: "\\e034", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "external", label: "External" }) }, { value: "\\e036", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "contract-2", label: "Contract" }) }, { value: "\\e035", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "expand-2", label: "Expand" }) }, { value: "\\e037", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "phone", label: "Phone" }) }, { value: "\\e038", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "user", label: "User" }) }, { value: "\\e039", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status", label: "Status" }) }, { value: "\\e012", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-pending", label: "Status pending" }) }, { value: "\\e013", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-cancelled", label: "Status cancelled" }) }, { value: "\\e02f", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "west", label: "West" }) }, { value: "\\e02e", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "south", label: "South" }) }, { value: "\\e02d", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "mail", label: "Mail" }) }, { value: "\\e02c", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "inventory", label: "Inventory" }) }, { value: "\\e02b", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "attributes", label: "Attributes" }) }, { value: "\\e02a", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "north", label: "North" }) }, { value: "\\e029", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "east", label: "East" }) }, { value: "\\e028", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "note", label: "Note" }) }, { value: "\\e027", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "windows", label: "Windows" }) }, { value: "\\e026", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "user2", label: "User 2" }) }, { value: "\\e025", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "search-2", label: "Search 2" }) }, { value: "\\e024", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "search", label: "Search" }) }, { value: "\\e021", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "star-empty", label: "Star empty" }) }, { value: "\\e030", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "share", label: "Share" }) }, { value: "\\e03b", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "phone-fill", label: "Store front" }) }, { value: "\\e03d", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "woo", label: "Woo" }) }, { value: "\\e03a", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "user-fill", label: "User fill" }) }, { value: "\\e002", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "grouped", label: "Grouped" }) }, { value: "\\e014", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-refunded", label: "Status refunded" }) }, { value: "\\e015", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-completed", label: "Status completed" }) }, { value: "\\e003", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "variable", label: "Variable" }) }, { value: "\\e005", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "expand", label: "Expand" }) }, { value: "\\e016", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-failed", label: "Status failed" }) }, { value: "\\e017", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "check", label: "Check" }) }, { value: "\\e008", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "right", label: "Right" }) }, { value: "\\e009", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "up", label: "Up" }) }, { value: "\\e018", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "query", label: "Query" }) }, { value: "\\e00a", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "down", label: "Down" }) }, { value: "\\e019", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "truck-1", label: "Truck 1" }) }, { value: "\\e00b", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "left", label: "Left" }) }, { value: "\\e01a", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "truck-2", label: "Truck 2" }) }, { value: "\\e00c", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "image", label: "Image" }) }, { value: "\\e01b", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "globe", label: "Globe" }) }, { value: "\\e00d", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "link", label: "Link" }) }, { value: "\\e01c", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "gear", label: "Gear" }) }, { value: "\\e00e", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "calendar", label: "Calendar" }) }, { value: "\\e01d", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "cart", label: "Cart" }) }, { value: "\\e00f", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "processing", label: "Processing" }) }, { value: "\\e01e", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "card", label: "Card" }) }, { value: "\\e010", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "view", label: "View" }) }, { value: "\\e01f", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "stats", label: "Stats" }) }, { value: "\\e011", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "status-processing", label: "Status processing" }) }, { value: "\\e020", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "star-full", label: "Star full" }) }, { value: "\\e600", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "coupon", label: "Coupon" }) }, { value: "\\e601", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "limit", label: "Limit" }) }, { value: "\\e602", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "restricted", label: "Restricted" }) }, { value: "\\e603", label: wp.element.createElement(_WooCommerceListElement2.default, { icon: "edit", label: "Edit" }) }];

/***/ }),

/***/ 7037:
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

var _deleteWooCommerceProductDataSlice = __webpack_require__(3426);

var _reactHotToast = __webpack_require__(4500);

var _fetchWooCommerceProductDataSlice = __webpack_require__(574);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteWooCommerceProductDataModal = function DeleteWooCommerceProductDataModal(_ref) {
    var id = _ref.id,
        page = _ref.page,
        perPage = _ref.perPage;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // mange local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalVisible = _useState2[0],
        setmodalVisible = _useState2[1];

    var handleDelete = function handleDelete() {
        dispatch((0, _deleteWooCommerceProductDataSlice.deleteWooCommerceProductData)(id)).then(function (res) {
            var payload = res.payload;

            if (payload.success) {
                setmodalVisible(!modalVisible);
                _reactHotToast.toast.success((0, _useTranslation2.default)("WooCommerce product data successfully deleted"));
                dispatch((0, _fetchWooCommerceProductDataSlice.fetchWooCommerceProductData)({
                    page: page ? page : 1,
                    perPage: perPage
                }));
            } else {
                _reactHotToast.toast.error(payload.error);
            }
        }).catch(function (err) {
            _reactHotToast.toast.error(err);
        });
    };

    var buttons = [wp.element.createElement(
        _Button2.default,
        {
            style: _styles.styleVariants.DANGER,
            onClick: function onClick() {
                handleDelete();
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
            { title: (0, _useTranslation2.default)('Delete WooCommerce product data'), buttons: buttons, visible: modalVisible },
            wp.element.createElement(
                "div",
                null,
                (0, _useTranslation2.default)("You are going to delete WooCommerce this product data. Are you sure?")
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

DeleteWooCommerceProductDataModal.propTypes = {
    id: _propTypes2.default.string.isRequired,
    page: _propTypes2.default.number.isRequired,
    perPage: _propTypes2.default.number.isRequired
};

exports.default = DeleteWooCommerceProductDataModal;

/***/ }),

/***/ 565:
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

/***/ 8026:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _reactRouterDom = __webpack_require__(4022);

__webpack_require__(2107);

var _woocommerce_icons = __webpack_require__(9132);

var _Boolean = __webpack_require__(7306);

var _Boolean2 = _interopRequireDefault(_Boolean);

var _WooCommerceProductDataVisibility = __webpack_require__(8291);

var _WooCommerceProductDataVisibility2 = _interopRequireDefault(_WooCommerceProductDataVisibility);

var _DeleteWooCommerceProductDataModal = __webpack_require__(7037);

var _DeleteWooCommerceProductDataModal2 = _interopRequireDefault(_DeleteWooCommerceProductDataModal);

var _reactHookForm = __webpack_require__(930);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProductDataListElement = (0, _react.memo)(function (_ref) {
    var record = _ref.record,
        page = _ref.page,
        perPage = _ref.perPage;

    // manage form state
    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register;

    var formId = 'elements.' + record.id;

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
                wp.element.createElement('span', {
                    className: 'wcicon-' + (_typeof(record.icon) === 'object' ? record.icon.icon : _woocommerce_icons.woocommerceIconsMap[record.icon]),
                    style: {
                        color: "#777",
                        fontSize: "18px"
                    }
                })
            ),
            wp.element.createElement(
                'td',
                null,
                record.name
            ),
            wp.element.createElement(
                'td',
                null,
                wp.element.createElement(_Boolean2.default, { status: record.showInUI })
            ),
            wp.element.createElement(
                'td',
                null,
                wp.element.createElement(_WooCommerceProductDataVisibility2.default, { visibility: record.visibility })
            ),
            wp.element.createElement(
                'td',
                null,
                record.fields.length > 0 ? wp.element.createElement(
                    _reactRouterDom.Link,
                    {
                        to: '/product-data/product/fields/' + record.id
                    },
                    (0, _useTranslation2.default)("Manage")
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    {
                        to: '/product-data/product/fields/' + record.id
                    },
                    (0, _useTranslation2.default)("Create")
                )
            ),
            wp.element.createElement(
                'td',
                null,
                wp.element.createElement(
                    'div',
                    { className: 'i-flex-center s-8' },
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        { to: '/product-data/product/view/' + record.id },
                        (0, _useTranslation2.default)("View")
                    ),
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        { to: '/product-data/product/edit/' + record.id },
                        (0, _useTranslation2.default)("Edit")
                    ),
                    wp.element.createElement(_DeleteWooCommerceProductDataModal2.default, {
                        id: record.id,
                        page: page,
                        perPage: perPage
                    })
                )
            )
        )
    );
});

ProductDataListElement.propTypes = {
    page: _propTypes2.default.number,
    perPage: _propTypes2.default.number,
    record: _propTypes2.default.object.isRequired
};

exports.default = ProductDataListElement;

/***/ }),

/***/ 2167:
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

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _styles = __webpack_require__(624);

var _ButtonLink = __webpack_require__(4545);

var _ButtonLink2 = _interopRequireDefault(_ButtonLink);

var _reactRedux = __webpack_require__(6706);

var _reactRouterDom = __webpack_require__(4022);

var _objects = __webpack_require__(4040);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _misc = __webpack_require__(3154);

var _fetchWooCommerceProductDataSlice = __webpack_require__(574);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _Pagination = __webpack_require__(5253);

var _Pagination2 = _interopRequireDefault(_Pagination);

var _ProductDataListElement = __webpack_require__(8026);

var _ProductDataListElement2 = _interopRequireDefault(_ProductDataListElement);

var _reactHookForm = __webpack_require__(930);

var _ajax = __webpack_require__(7569);

var _reactHotToast = __webpack_require__(4500);

var _scroll = __webpack_require__(2727);

var _react3 = __webpack_require__(8839);

var _BulkActions = __webpack_require__(565);

var _BulkActions2 = _interopRequireDefault(_BulkActions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var ProductDataList = function ProductDataList(_ref) {
    _objectDestructuringEmpty(_ref);

    var globals = document.globals;
    var settings = globals.settings;

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
        return state.fetchWooCommerceProductData;
    }),
        data = _useSelector.data,
        loading = _useSelector.loading;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        page = _useParams.page;

    var perPage = settings.length > 0 && (0, _objects.filterByLabel)(settings, 'key', 'records_per_page') !== '' ? (0, _objects.filterByLabel)(settings, 'key', 'records_per_page').value : 20;
    var totalPages = Math.ceil(data.count / perPage);

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _useTranslation2.default)("WooCommerce product data"));
        dispatch((0, _fetchWooCommerceProductDataSlice.fetchWooCommerceProductData)({
            page: page ? page : 1,
            perPage: perPage
        }));
    }, [page]);

    var actions = [wp.element.createElement(
        _ButtonLink2.default,
        {
            to: "/product-data/product/add",
            style: _styles.styleVariants.PRIMARY
        },
        (0, _useTranslation2.default)("Add product data")
    )];

    /**
     *
     * @return {boolean}
     */
    var showBulkActions = function showBulkActions() {

        if (!watchedElements) {
            return false;
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(watchedElements)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref2 = _step.value;

                var _ref3 = _slicedToArray(_ref2, 2);

                var key = _ref3[0];
                var value = _ref3[1];

                if (value === true) {
                    return true;
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

        return false;
    };

    /**
     *
     * @param data
     */
    var onSubmit = function onSubmit(data) {
        methods.reset();
        data.belongsTo = "woo_product_data";

        (0, _ajax.wpAjaxRequest)('bulkActionsAction', data).then(function (res) {
            if (res.success === true) {

                // flush message
                switch (data.action) {
                    case "delete":
                        _reactHotToast.toast.success((0, _useTranslation2.default)("WooCommerce product data successfully deleted"));
                        methods.resetField("elements");
                        (0, _scroll.scrollToTop)();

                        // refresh items
                        dispatch((0, _fetchWooCommerceProductDataSlice.fetchWooCommerceProductData)({
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
                    title: (0, _useTranslation2.default)("WooCommerce product data"),
                    actions: actions,
                    crumbs: [{
                        label: (0, _useTranslation2.default)("Registered Custom Post Types"),
                        link: "/"
                    }, {
                        label: (0, _useTranslation2.default)("WooCommerce product data")
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
                                wp.element.createElement("th", null),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Name")
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Show on UI")
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Visibility")
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Fields")
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
                                return wp.element.createElement(_ProductDataListElement2.default, {
                                    key: record.id,
                                    record: record,
                                    page: page ? page : 1,
                                    perPage: perPage
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
                                        baseLink: "/product-data/product"
                                    })
                                )
                            )
                        )
                    )
                ) : wp.element.createElement(
                    _Alert2.default,
                    { style: _styles.styleVariants.SECONDARY },
                    (0, _useTranslation2.default)("No product data found."),
                    " ",
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        { to: "/product-data/product/add" },
                        (0, _useTranslation2.default)("Register the first one")
                    ),
                    "!"
                )
            )
        )
    );
};

exports.default = ProductDataList;

/***/ }),

/***/ 2107:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=889.js.map