(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[157],{

/***/ 157:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _reactRouterDom = __webpack_require__(886);

var _reactRedux = __webpack_require__(4494);

var _reactToastify = __webpack_require__(9249);

var _misc = __webpack_require__(3154);

var _deleteWooCommerceProductData = __webpack_require__(4889);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var DeleteWooCommerceProductData = function DeleteWooCommerceProductData() {

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.deleteWooCommerceProductDataReducer;
    }),
        errors = _useSelector.errors,
        success = _useSelector.success,
        loading = _useSelector.loading;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var didMountRef = (0, _react.useRef)(false);

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)("Delete WooCommerce product data " + id);
    }, []);

    // manage redirect
    var history = (0, _reactRouterDom.useHistory)();

    // manage delete
    var handleDeleteTaxonomy = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(id) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.next = 2;
                            return dispatch((0, _deleteWooCommerceProductData.deleteWooCommerceProductData)(id));

                        case 2:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function handleDeleteTaxonomy(_x) {
            return _ref.apply(this, arguments);
        };
    }();

    // handle delete outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loading) {
                if (success) {
                    history.push('/product-data/product');
                    _reactToastify.toast.success("WooCommerce product data successfully deleted");
                }

                if (errors.length > 0) {
                    errors.map(function (error) {
                        _reactToastify.toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    var actions = wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "a",
            { className: "acpt-btn acpt-btn-danger", onClick: function onClick(e) {
                    return handleDeleteTaxonomy(id);
                } },
            "Yes, Delete it"
        ),
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                to: "/product-data/product",
                className: "acpt-btn acpt-btn-primary-o prev"
            },
            "Return back to list"
        )
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(_ActionsBar2.default, {
            title: "Delete WooCommerce product data #" + id,
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
                    label: 'Delete WooCommerce product data'
                }] }),
            wp.element.createElement(
                "p",
                { className: "acpt-alert acpt-alert-warning" },
                "You are going to delete WooCommerce product data ",
                wp.element.createElement(
                    "strong",
                    null,
                    "#",
                    id,
                    " "
                ),
                ". Are you sure?"
            )
        )
    );
};

exports.default = DeleteWooCommerceProductData;

// import React, {useEffect, useRef} from 'react';
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {Link, useHistory, useParams} from "react-router-dom";
// import {useDispatch, useSelector} from "react-redux";
// import {toast} from "react-toastify";
// import {metaTitle} from "../../../utils/misc";
// import {Icon} from "@iconify/react";
// import Copyright from "../../reusable/Copyright";
// import {deleteWooCommerceProductData} from "../../../redux/thunks/deleteWooCommerceProductData";
//
// const DeleteWooCommerceProductData = () => {
//
//     // manage global state
//     const dispatch = useDispatch();
//     const {errors, success, loading} = useSelector(state => state.deleteWooCommerceProductDataReducer);
//
//     // manage local state
//     const {id} = useParams();
//     const didMountRef = useRef(false);
//
//     useEffect(() => {
//         metaTitle(`Delete WooCommerce product data ${id}`);
//     }, []);
//
//     // manage redirect
//     const history = useHistory();
//
//     // manage delete
//     const handleDeleteTaxonomy = async (id) => {
//         await dispatch(deleteWooCommerceProductData(id));
//     };
//
//     // handle delete outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!loading){
//                 if(success){
//                     history.push('/product-data/product');
//                     toast.success("WooCommerce product data successfully deleted");
//                 }
//
//                 if(errors.length > 0){
//                     errors.map((error) => {
//                         toast.error(error);
//                     });
//                 }
//             }
//         } else {
//             didMountRef.current = true;
//         }
//     }, [loading]);
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
//                     label: 'Delete WooCommerce product data'
//                 }
//             ]} />
//             <h1 className="acpt-title">
//                 <Icon icon="bx:bx-trash" color="#02c39a" width="18px" />
//                 &nbsp;
//                 Delete WooCommerce product data #{id}
//             </h1>
//             <p>You are going to delete WooCommerce product data <strong>#{id} </strong>. Are you sure?</p>
//             <div className="mb-3">
//                 <a className="acpt-btn acpt-btn-danger" onClick={ e => handleDeleteTaxonomy(id) }>
//                     <Icon icon="bx:bx-trash" width="18px" />
//                     Yes, Delete it
//                 </a>
//                 &nbsp;
//                 <Link
//                     to="/product-data/product"
//                     className="acpt-btn acpt-btn-primary-o prev">
//                     <Icon icon="bx:bx-category-alt" width="18px" />
//                     Return back to list
//                 </Link>
//             </div>
//             <Copyright/>
//         </div>
//     );
// };
//
// export default DeleteWooCommerceProductData;

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

/***/ 4889:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.deleteWooCommerceProductData = undefined;

var _ajax = __webpack_require__(7569);

var _deleteWooCommerceProductDataActions = __webpack_require__(7461);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var deleteWooCommerceProductData = exports.deleteWooCommerceProductData = function deleteWooCommerceProductData(id) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _deleteWooCommerceProductDataActions.deleteWooCommerceProductDataInProgress)(id));
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('deleteWooCommerceProductDataAction', { id: id });

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _deleteWooCommerceProductDataActions.deleteWooCommerceProductDataSuccess)()) : dispatch((0, _deleteWooCommerceProductDataActions.deleteWooCommerceProductDataFailure)(res.error));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _deleteWooCommerceProductDataActions.deleteWooCommerceProductDataFailure)(_context.t0));

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
//# sourceMappingURL=157.js.map