(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[37],{

/***/ 3979:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WooCommerceFieldsMiniTable = function WooCommerceFieldsMiniTable(_ref) {
    var id = _ref.id,
        elements = _ref.elements;


    return wp.element.createElement(
        "div",
        { className: "acpt-table-responsive" },
        wp.element.createElement(
            "table",
            { className: "acpt-minitable" },
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    null,
                    "Name"
                ),
                wp.element.createElement(
                    "th",
                    null,
                    "Type"
                )
            ),
            elements.map(function (element) {
                return wp.element.createElement(
                    "tr",
                    null,
                    wp.element.createElement(
                        "td",
                        null,
                        element.name
                    ),
                    wp.element.createElement(
                        "td",
                        null,
                        element.type
                    )
                );
            })
        ),
        wp.element.createElement(
            "div",
            { className: "minitable-buttons" },
            wp.element.createElement(
                "a",
                { href: "#/product-data/product/fields/" + id },
                "Manage"
            )
        )
    );
};

exports.default = WooCommerceFieldsMiniTable;

/***/ }),

/***/ 7914:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

__webpack_require__(2107);

var _Boolean = __webpack_require__(9904);

var _Boolean2 = _interopRequireDefault(_Boolean);

var _WooCommerceProductDataVisibility = __webpack_require__(8670);

var _WooCommerceProductDataVisibility2 = _interopRequireDefault(_WooCommerceProductDataVisibility);

var _WooCommerceFieldsMiniTable = __webpack_require__(3979);

var _WooCommerceFieldsMiniTable2 = _interopRequireDefault(_WooCommerceFieldsMiniTable);

var _Tippy = __webpack_require__(5825);

var _Tippy2 = _interopRequireDefault(_Tippy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WooCommerceProductDataListElement = function WooCommerceProductDataListElement(_ref) {
    var id = _ref.id,
        element = _ref.element;

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            'tr',
            null,
            wp.element.createElement(
                'td',
                { className: 'backend' },
                wp.element.createElement(
                    'strong',
                    null,
                    element.name
                ),
                wp.element.createElement(
                    'div',
                    { className: 'element-buttons' },
                    wp.element.createElement(
                        'a',
                        { href: '#/product-data/product/view/' + id },
                        'View'
                    ),
                    '\xA0',
                    wp.element.createElement(
                        'a',
                        { href: '#/product-data/product/edit/' + id },
                        'Edit'
                    ),
                    '\xA0',
                    wp.element.createElement(
                        'a',
                        { href: '#/product-data/product/delete/' + id },
                        'Delete'
                    )
                )
            ),
            wp.element.createElement(
                'td',
                { className: 'backend' },
                wp.element.createElement('span', {
                    className: 'wcicon-lg wcicon-' + element.icon.icon,
                    style: {
                        color: "#7e9ebd",
                        fontSize: "18px"
                    }
                })
            ),
            wp.element.createElement(
                'td',
                { className: 'backend' },
                wp.element.createElement(_Boolean2.default, { status: element.showInUI })
            ),
            wp.element.createElement(
                'td',
                { className: 'backend' },
                wp.element.createElement(_WooCommerceProductDataVisibility2.default, { visibility: element.visibility })
            ),
            wp.element.createElement(
                'td',
                { className: 'backend' },
                element.fields.length > 0 ? wp.element.createElement(
                    _Tippy2.default,
                    {
                        placement: 'top',
                        html: wp.element.createElement(_WooCommerceFieldsMiniTable2.default, { id: element.id, elements: element.fields })
                    },
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        {
                            to: '/product-data/product/fields/' + element.id,
                            className: 'acpt-btn acpt-btn-sm no-border acpt-btn-info-o'
                        },
                        'Manage'
                    )
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    {
                        to: '/product-data/product/fields/' + element.id,
                        className: 'acpt-btn acpt-btn-sm no-border acpt-btn-primary-o'
                    },
                    'Create'
                )
            )
        )
    );
};

exports.default = WooCommerceProductDataListElement;

// import React from 'react';
// import {Link} from 'react-router-dom'
// import {Icon} from "@iconify/react";
// import '../../../scss/woocommerce.scss';
// import Boolean from "../../reusable/Boolean";
// import WooCommerceProductDataVisibility from "../../reusable/WooCommerceProductDataVisibility";
// import Tippy from "../../reusable/Tippy";
// import WooCommerceFieldsMiniTable from "./WooCommerceFieldsMiniTable";
//
// const WooCommerceProductDataListElement = ({id, element}) => {
//     return (
//         <React.Fragment>
//             <tr>
//                 <td className="backend">
//                     <strong>{element.name}</strong>
//                     <div className="element-buttons">
//                         <a href={`#/product-data/product/view/${id}`}>
//                             View
//                         </a>
//                         &nbsp;
//                         <a href={`#/product-data/product/edit/${id}`}>
//                             Edit
//                         </a>
//                         &nbsp;
//                         <a href={`#/product-data/product/delete/${id}`}>
//                             Delete
//                         </a>
//                     </div>
//                 </td>
//                 <td className="backend">
//                     <span className={`wcicon-lg wcicon-${element.icon.icon}`} />
//                 </td>
//                 <td className="backend">
//                     <Boolean status={element.showInUI}/>
//                 </td>
//                 <td className="backend">
//                     <WooCommerceProductDataVisibility visibility={element.visibility} />
//                 </td>
//                 <td className="backend">
//                     {element.fields.length > 0
//                         ?
//                         <Tippy
//                             placement='top'
//                             html={(
//                                 <WooCommerceFieldsMiniTable id={element.id} elements={element.fields}/>
//                             )}
//                         >
//                             <Link
//                                 to={`/product-data/product/fields/${element.id}`}
//                                 className="acpt-btn acpt-btn-sm acpt-btn-info-o"
//                             >
//                                 <Icon icon="bx:bxs-inbox" width="18px"/>
//                                 &nbsp;
//                                 Manage
//                             </Link>
//                         </Tippy>
//                         :
//                         <Link
//                             to={`/product-data/product/fields/${element.id}`}
//                             className="acpt-btn acpt-btn-sm acpt-btn-primary-o"
//                         >
//                             <Icon icon="bx:bxs-inbox" width="18px"/>
//                             &nbsp;
//                             Create
//                         </Link>
//                     }
//                 </td>
//             </tr>
//         </React.Fragment>
//     );
// };
//
// export default WooCommerceProductDataListElement;

/***/ }),

/***/ 37:
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

var _misc = __webpack_require__(3154);

var _fetchWooCommerceProductData = __webpack_require__(7338);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _Pagination = __webpack_require__(1222);

var _Pagination2 = _interopRequireDefault(_Pagination);

var _WooCommerceProductDataListElement = __webpack_require__(7914);

var _WooCommerceProductDataListElement2 = _interopRequireDefault(_WooCommerceProductDataListElement);

var _objects = __webpack_require__(4040);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WooCommerceProductDataList = function WooCommerceProductDataList() {

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchWooCommerceProductDataReducer;
    }),
        fetched = _useSelector.fetched,
        loading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchSettingsReducer;
    }),
        settingsLoading = _useSelector2.loading,
        settings = _useSelector2.fetched;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        page = _useParams.page;

    var didMountRef = (0, _react.useRef)(false);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        fetchedSuccess = _useState2[0],
        setFetchedSuccess = _useState2[1];

    var perPage = settings.length > 0 && (0, _objects.filterByLabel)(settings, 'key', 'records_per_page') !== '' ? (0, _objects.filterByLabel)(settings, 'key', 'records_per_page').value : 20;
    var totalPages = Math.ceil(fetched.length / perPage);

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)("WooCommerce product data");
        (0, _misc.changeCurrentAdminMenuLink)('');
        dispatch((0, _fetchWooCommerceProductData.fetchWooCommerceProductData)({
            page: page ? page : 1,
            perPage: perPage
        }));
    }, [page]);

    // handle fetch outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loading) {
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    if (!fetchedSuccess) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    var actions = wp.element.createElement(
        _reactRouterDom.Link,
        {
            to: "/product-data/product/add",
            className: "acpt-btn acpt-btn-primary"
        },
        "Add product data"
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(_ActionsBar2.default, {
            title: "WooCommerce product data",
            actions: actions
        }),
        wp.element.createElement(
            "main",
            null,
            wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                    label: "Registered Custom Post Types",
                    link: "/"
                }, {
                    label: "WooCommerce product data"
                }] }),
            fetched.length > 0 ? wp.element.createElement(
                "div",
                { className: "acpt-card" },
                wp.element.createElement(
                    "div",
                    { className: "acpt-card__header borderless" },
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        fetched.length,
                        " record(s) found"
                    )
                ),
                wp.element.createElement(
                    "div",
                    { className: "acpt-card__body" },
                    wp.element.createElement(
                        "div",
                        { className: "acpt-table-responsive" },
                        wp.element.createElement(
                            "table",
                            { className: "acpt-table" },
                            wp.element.createElement(
                                "thead",
                                null,
                                wp.element.createElement(
                                    "tr",
                                    null,
                                    wp.element.createElement(
                                        "th",
                                        { className: "grey backend", colSpan: 5 },
                                        "Backend UI"
                                    )
                                ),
                                wp.element.createElement(
                                    "tr",
                                    null,
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Name"
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Icon"
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Show on UI"
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Visibility"
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        { className: "with-border" },
                                        "Fields"
                                    )
                                )
                            ),
                            wp.element.createElement(
                                "tbody",
                                null,
                                fetched.map(function (element) {
                                    return wp.element.createElement(_WooCommerceProductDataListElement2.default, { id: element.id, key: element.id, element: element });
                                })
                            )
                        )
                    )
                ),
                totalPages > 1 && wp.element.createElement(
                    "div",
                    { className: "acpt-card__footer", style: { border: "none" } },
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        wp.element.createElement(_Pagination2.default, { currentPage: page ? page : 1, perPage: perPage, records: fetched.length })
                    )
                )
            ) : wp.element.createElement(
                "div",
                { className: "acpt-alert acpt-alert-secondary" },
                "No product data found. ",
                wp.element.createElement(
                    _reactRouterDom.Link,
                    { to: "/product-data/product/add" },
                    "Register the first one"
                ),
                "!"
            )
        )
    );
};

exports.default = WooCommerceProductDataList;

/***/ }),

/***/ 9904:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _react3 = __webpack_require__(6229);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Boolean = function Boolean(_ref) {
    var status = _ref.status;


    var icon = status ? 'bx:bx-check' : 'bx:bx-x';
    var color = status ? '#02c39a' : '#f94144';

    return wp.element.createElement(_react3.Icon, { icon: icon, color: color, width: '18px' });
};

exports.default = Boolean;

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

/***/ 1222:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pagination = function Pagination(_ref) {
    var currentPage = _ref.currentPage,
        perPage = _ref.perPage,
        records = _ref.records;


    var totalPages = Math.ceil(records / perPage);
    var rows = [];
    for (var i = 1; i <= totalPages; i++) {
        rows.push(i);
    }

    if (rows.length < 2) {
        return wp.element.createElement(_react2.default.Fragment, null);
    }

    return wp.element.createElement(
        "ul",
        { className: "acpt-pagination" },
        rows.map(function (row) {
            return wp.element.createElement(
                "li",
                null,
                row == currentPage ? wp.element.createElement(
                    "span",
                    null,
                    row
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    { to: "/" + row },
                    row
                )
            );
        })
    );
};

exports.default = Pagination;

/***/ }),

/***/ 8670:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

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
        _react2.default.Fragment,
        null,
        vis.map(function (vis) {
            return wp.element.createElement(
                'span',
                { className: 'acpt-badge mr-1' },
                wp.element.createElement(
                    'span',
                    { className: 'label' },
                    vis
                )
            );
        })
    );
};

exports.default = WooCommerceProductDataVisibility;

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
//# sourceMappingURL=37.js.map