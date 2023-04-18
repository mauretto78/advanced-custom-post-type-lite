(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[846],{

/***/ 7846:
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

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _misc = __webpack_require__(3154);

var _ = __webpack_require__(4929);

var _2 = _interopRequireDefault(_);

var _fetchWooCommerceProductData = __webpack_require__(7338);

var _Boolean = __webpack_require__(9904);

var _Boolean2 = _interopRequireDefault(_Boolean);

var _WooCommerceProductDataVisibility = __webpack_require__(8670);

var _WooCommerceProductDataVisibility2 = _interopRequireDefault(_WooCommerceProductDataVisibility);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewWooCommerceProductData = function ViewWooCommerceProductData() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchWooCommerceProductDataReducer;
    }),
        fetched = _useSelector.fetched,
        loading = _useSelector.loading;

    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var didMountRef = (0, _react.useRef)(false);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        fetchedSuccess = _useState2[0],
        setFetchedSuccess = _useState2[1];

    (0, _react.useEffect)(function () {
        dispatch((0, _fetchWooCommerceProductData.fetchWooCommerceProductData)({
            id: id
        }));
        (0, _misc.metaTitle)("View WooCommerce product data");
    }, [id]);

    // handle fetch outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loading) {
                if (fetched.length !== 0) {
                    setFetchedSuccess(true);
                } else {
                    setFetchedSuccess(false);
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    if (fetchedSuccess === null) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    if (!fetchedSuccess) {
        return wp.element.createElement(_2.default, null);
    }

    var actions = wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                className: "acpt-btn acpt-btn-primary",
                to: "/product-data/product/edit/" + id },
            "Edit"
        ),
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                className: "acpt-btn acpt-btn-primary-o",
                to: "/product-data/product/fields/" + id },
            "Manage fields"
        ),
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                className: "acpt-btn acpt-btn-primary-o",
                to: "/product-data/product/content/" + id },
            "Manage content"
        )
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(_ActionsBar2.default, {
            title: "View " + fetched[0].name + " details",
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
                    label: "View WooCommerce product data"
                }] }),
            wp.element.createElement(
                "div",
                { className: "acpt-card" },
                wp.element.createElement(
                    "div",
                    { className: "acpt-card__inner" },
                    wp.element.createElement(
                        "table",
                        { className: "acpt-table acpt-table-secondary" },
                        wp.element.createElement(
                            "tr",
                            null,
                            wp.element.createElement(
                                "th",
                                { style: { width: "180px" } },
                                "Name"
                            ),
                            wp.element.createElement(
                                "td",
                                null,
                                fetched[0].name
                            )
                        ),
                        wp.element.createElement(
                            "tr",
                            null,
                            wp.element.createElement(
                                "th",
                                { style: { width: "180px" } },
                                "Icon"
                            ),
                            wp.element.createElement(
                                "td",
                                null,
                                wp.element.createElement("span", { className: "wcicon-" + fetched[0].icon.icon })
                            )
                        ),
                        wp.element.createElement(
                            "tr",
                            null,
                            wp.element.createElement(
                                "th",
                                { style: { width: "180px" } },
                                "Visibility"
                            ),
                            wp.element.createElement(
                                "td",
                                null,
                                wp.element.createElement(_WooCommerceProductDataVisibility2.default, { visibility: fetched[0].visibility })
                            )
                        ),
                        wp.element.createElement(
                            "tr",
                            null,
                            wp.element.createElement(
                                "th",
                                { style: { width: "180px" } },
                                "Show in UI"
                            ),
                            wp.element.createElement(
                                "td",
                                null,
                                wp.element.createElement(_Boolean2.default, { status: fetched[0].showInUI })
                            )
                        )
                    )
                )
            )
        )
    );
};

exports.default = ViewWooCommerceProductData;

// import React, {useEffect, useRef, useState} from 'react';
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {useDispatch, useSelector} from "react-redux";
// import {Link, useParams} from "react-router-dom";
// import Spinner from "../../reusable/Loader/Spinner";
// import {metaTitle} from "../../../utils/misc";
// import NotFound404 from "../404";
// import {Icon} from "@iconify/react";
// import Copyright from "../../reusable/Copyright";
// import {fetchWooCommerceProductData} from "../../../redux/thunks/fetchWooCommerceProductData";
// import Boolean from "../../reusable/Boolean";
// import WooCommerceProductDataVisibility from "../../reusable/WooCommerceProductDataVisibility";
//
// const ViewWooCommerceProductData = () => {
//
//     // manage global state
//     const {fetched, loading} = useSelector(state => state.fetchWooCommerceProductDataReducer);
//     const dispatch = useDispatch();
//
//     // manage local state
//     const {id} = useParams();
//     const didMountRef = useRef(false);
//     const [fetchedSuccess, setFetchedSuccess] = useState(null);
//
//     useEffect(() => {
//         dispatch(fetchWooCommerceProductData({
//             id:id
//         }));
//         metaTitle("View WooCommerce product data");
//     }, [id]);
//
//     // handle fetch outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!loading){
//                 if(fetched.length !== 0){
//                     setFetchedSuccess(true);
//                 } else {
//                     setFetchedSuccess(false);
//                 }
//             }
//         } else {
//             didMountRef.current = true;
//         }
//     }, [loading]);
//
//     if(fetchedSuccess === null){
//         return <Spinner/>;
//     }
//
//     if(!fetchedSuccess){
//         return <NotFound404/>;
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
//                     label: "View WooCommerce product data"
//                 }
//             ]} />
//             <h1 className="acpt-title">
//                 <Icon icon="bx:bx-search-alt" color="#02c39a" width="18px" />
//                 &nbsp;
//                 View {fetched[0].name} details
//             </h1>
//
//
//             <div className="acpt-card">
//                 <div className="acpt-card__inner">
//                     <table className="acpt-table acpt-table-secondary mb-3">
//                         <tr>
//                             <th style={{ width: "180px" }}>
//                                 Name
//                             </th>
//                             <td>
//                                 {fetched[0].name}
//                             </td>
//                         </tr>
//                         <tr>
//                             <th style={{ width: "180px" }}>
//                                 Icon
//                             </th>
//                             <td>
//                                 <span className={`wcicon-${fetched[0].icon.icon}`} />
//                             </td>
//                         </tr>
//                         <tr>
//                             <th style={{ width: "180px" }}>
//                                 Visibility
//                             </th>
//                             <td>
//                                 <WooCommerceProductDataVisibility visibility={fetched[0].visibility} />
//                             </td>
//                         </tr>
//                         <tr>
//                             <th style={{ width: "180px" }}>
//                                 Show in UI
//                             </th>
//                             <td>
//                                 <Boolean status={fetched[0].showInUI}/>
//                             </td>
//                         </tr>
//                     </table>
//                     <Link
//                         className="acpt-btn acpt-btn-primary mr-1"
//                         to={`/product-data/product/edit/${id}`}>
//                         <Icon icon="bx:bx-edit" width="18px" />
//                         Edit
//                     </Link>
//                     <Link
//                         className="acpt-btn acpt-btn-primary-o mr-1"
//                         to={`/product-data/product/fields/${id}`}>
//                         <Icon icon="bx:bxs-inbox" width="18px" />
//                         Manage fields
//                     </Link>
//                     <Link
//                         className="acpt-btn acpt-btn-primary-o"
//                         to={`/product-data/product/content/${id}`}>
//                         <Icon icon="bx:bx-message-square-detail" width="18px" />
//                         Manage content
//                     </Link>
//                 </div>
//             </div>
//
//             <Copyright/>
//         </div>
//     );
// };
//
// export default ViewWooCommerceProductData;

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

/***/ })

}]);
//# sourceMappingURL=846.js.map