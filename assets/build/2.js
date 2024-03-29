(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[2],{

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

/***/ 7002:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(4022);

var _reactRedux = __webpack_require__(6706);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _misc = __webpack_require__(3154);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _fetchWooCommerceProductDataSlice = __webpack_require__(574);

var _ButtonLink = __webpack_require__(4545);

var _ButtonLink2 = _interopRequireDefault(_ButtonLink);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

var _styles = __webpack_require__(624);

var _Boolean = __webpack_require__(7306);

var _Boolean2 = _interopRequireDefault(_Boolean);

var _WooCommerceProductDataVisibility = __webpack_require__(8291);

var _WooCommerceProductDataVisibility2 = _interopRequireDefault(_WooCommerceProductDataVisibility);

var _woocommerce_icons = __webpack_require__(9132);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var ViewProductData = function ViewProductData(_ref) {
    _objectDestructuringEmpty(_ref);

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchWooCommerceProductData;
    }),
        data = _useSelector.data,
        loading = _useSelector.loading;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isReady = _useState2[0],
        setIsReady = _useState2[1];

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _useTranslation2.default)("View WooCommerce product data"));
        dispatch((0, _fetchWooCommerceProductDataSlice.fetchWooCommerceProductData)({ id: id })).then(function (res) {
            return setIsReady(true);
        });
    }, [id]);

    if (loading) {
        return wp.element.createElement(_Loader2.default, null);
    }

    if (!isReady) {
        return wp.element.createElement(_Loader2.default, null);
    }

    var actions = [wp.element.createElement(
        _ButtonLink2.default,
        {
            style: _styles.styleVariants.SECONDARY,
            to: "/product-data/product/edit/" + id
        },
        (0, _useTranslation2.default)("Edit")
    ), wp.element.createElement(
        _ButtonLink2.default,
        {
            style: _styles.styleVariants.PRIMARY,
            to: "/product-data/product/fields/" + id
        },
        (0, _useTranslation2.default)("Manage fields")
    )];

    return wp.element.createElement(
        _Layout2.default,
        {
            crumbs: [{
                label: (0, _useTranslation2.default)("Registered Custom Post Types"),
                link: "/"
            }, {
                label: (0, _useTranslation2.default)("WooCommerce product data"),
                link: "/product-data/product"
            }, {
                label: (0, _useTranslation2.default)("View WooCommerce product data")
            }],
            actions: actions,
            title: (0, _useTranslation2.default)("View WooCommerce product data")
        },
        wp.element.createElement(
            _Card2.default,
            { style: "with-shadow" },
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Name"),
                value: data.name
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Icon"),
                value: wp.element.createElement("span", {
                    className: "wcicon-" + (_typeof(data.icon) === 'object' ? data.icon.icon : _woocommerce_icons.woocommerceIconsMap[data.icon]),
                    style: {
                        color: "#007cba",
                        fontSize: "18px"
                    }
                })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Show on UI"),
                value: wp.element.createElement(_Boolean2.default, { status: data.showInUI })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Visibility"),
                value: wp.element.createElement(_WooCommerceProductDataVisibility2.default, { visibility: data.visibility })
            })
        )
    );
};

exports.default = ViewProductData;

/***/ }),

/***/ 2107:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 2703:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = __webpack_require__(414);

function emptyFunction() {}
function emptyFunctionWithReset() {}
emptyFunctionWithReset.resetWarningCache = emptyFunction;

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    var err = new Error(
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
    err.name = 'Invariant Violation';
    throw err;
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bigint: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    elementType: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim,

    checkPropTypes: emptyFunctionWithReset,
    resetWarningCache: emptyFunction
  };

  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),

/***/ 5697:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (false) { var throwOnDirectAccess, ReactIs; } else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(2703)();
}


/***/ }),

/***/ 414:
/***/ ((module) => {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ })

}]);
//# sourceMappingURL=2.js.map