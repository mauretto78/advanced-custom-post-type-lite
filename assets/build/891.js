(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[891],{

/***/ 7035:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _assocTaxonomyToPostType = __webpack_require__(4061);

var _reactRedux = __webpack_require__(4494);

var _CustomPostTypeLabel = __webpack_require__(6054);

var _CustomPostTypeLabel2 = _interopRequireDefault(_CustomPostTypeLabel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssocTaxonomyElement = function AssocTaxonomyElement(_ref) {
    var id = _ref.id,
        element = _ref.element,
        postType = _ref.postType,
        defaultChecked = _ref.defaultChecked;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var handleOnChange = function handleOnChange(element) {
        dispatch((0, _assocTaxonomyToPostType.assocTaxonomyToPostType)(postType, [element]));
    };

    return wp.element.createElement(
        "tr",
        null,
        wp.element.createElement(
            "td",
            null,
            wp.element.createElement(
                "strong",
                null,
                element.slug
            )
        ),
        wp.element.createElement(
            "td",
            null,
            wp.element.createElement(_CustomPostTypeLabel2.default, { element: element })
        ),
        wp.element.createElement(
            "td",
            null,
            element.singular
        ),
        wp.element.createElement(
            "td",
            null,
            element.plural
        ),
        wp.element.createElement(
            "td",
            { className: "with-border" },
            wp.element.createElement(
                "span",
                { className: "acpt-badge" },
                wp.element.createElement(
                    "span",
                    { className: "label" },
                    element.postCount
                )
            )
        ),
        wp.element.createElement(
            "td",
            null,
            wp.element.createElement(
                "label",
                { className: "switch" },
                wp.element.createElement("input", {
                    id: element.id,
                    type: "checkbox",
                    defaultChecked: defaultChecked,
                    onChange: function onChange(e) {
                        return handleOnChange({
                            id: element.id,
                            checked: e.target.checked
                        });
                    }
                }),
                wp.element.createElement("span", { className: "slider round" })
            )
        )
    );
};

exports.default = AssocTaxonomyElement;

/***/ }),

/***/ 891:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _reactRedux = __webpack_require__(4494);

var _misc = __webpack_require__(3154);

var _fetchTaxonomies = __webpack_require__(1141);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _AssocTaxonomyElement = __webpack_require__(7035);

var _AssocTaxonomyElement2 = _interopRequireDefault(_AssocTaxonomyElement);

var _fetchPostTypes = __webpack_require__(4825);

var _objects = __webpack_require__(4040);

var _reactToastify = __webpack_require__(9249);

var _react3 = __webpack_require__(6229);

var _Tippy = __webpack_require__(5825);

var _Tippy2 = _interopRequireDefault(_Tippy);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssocTaxonomyToCustomPostType = function AssocTaxonomyToCustomPostType() {

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.assocTaxonomyToPostReducer;
    }),
        successAssocTaxonomyToPost = _useSelector.success,
        loadingAssocTaxonomyToPost = _useSelector.loading,
        assocTaxonomyToPostErrors = _useSelector.errors;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetchedTaxonomies = _useSelector2.fetched,
        loadingTaxonomies = _useSelector2.loading;

    var _useSelector3 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
    }),
        fetchedPosts = _useSelector3.fetched,
        loadingPosts = _useSelector3.loading;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        postType = _useParams.postType;

    var didMountRef = (0, _react.useRef)(false);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        fetchedSuccess = _useState2[0],
        setFetchedSuccess = _useState2[1];

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)("Registered Taxonomies");
        dispatch((0, _fetchTaxonomies.fetchTaxonomies)());
        dispatch((0, _fetchPostTypes.fetchPostTypes)({
            postType: postType
        }));
    }, []);

    // handle fetch outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loadingTaxonomies && !loadingPosts) {
                setFetchedSuccess(true);

                var f = [];
                fetchedTaxonomies.map(function (item) {
                    f.push({
                        id: item.id,
                        checked: !(0, _objects.isEmpty)((0, _objects.filterById)(fetchedPosts[0].taxonomies, item.id))
                    });
                });
            }
        } else {
            didMountRef.current = true;
        }
    }, [loadingTaxonomies, loadingPosts]);

    // handle assoc outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loadingAssocTaxonomyToPost) {
                if (successAssocTaxonomyToPost) {
                    _reactToastify.toast.success("Custom post type was associated to selected taxonomies");
                }

                if (assocTaxonomyToPostErrors.length > 0) {
                    assocTaxonomyToPostErrors.map(function (error) {
                        _reactToastify.toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loadingAssocTaxonomyToPost]);

    if (!fetchedSuccess) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(_ActionsBar2.default, {
            title: "Associate taxonomies to " + postType
        }),
        wp.element.createElement(
            "main",
            null,
            wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                    label: "Registered Custom Post Types",
                    link: "/"
                }, {
                    label: postType,
                    link: "/view/" + postType
                }, {
                    label: "Associate taxonomies to " + postType
                }] }),
            fetchedTaxonomies.length > 0 ? wp.element.createElement(
                "div",
                { className: "acpt-card" },
                wp.element.createElement(
                    "div",
                    { className: "acpt-card__header" },
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        fetchedTaxonomies.length,
                        " taxonomies registered"
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
                                        { className: "grey backend with-border", colSpan: 5 },
                                        "Taxonomy data"
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        { className: "grey frontend", colSpan: 1 },
                                        "Actions"
                                    )
                                ),
                                wp.element.createElement(
                                    "tr",
                                    null,
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Slug \xA0",
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: "Taxonomy slug. The post name/slug. Used for various queries for taxonomy content." },
                                            wp.element.createElement(
                                                "span",
                                                { className: "helper" },
                                                wp.element.createElement(_react3.Icon, { icon: "bx:bx-help-circle", width: "18px" })
                                            )
                                        )
                                    ),
                                    wp.element.createElement("th", null),
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Singular \xA0",
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: "Singular label. Used when a singular label is needed" },
                                            wp.element.createElement(
                                                "span",
                                                { className: "helper" },
                                                wp.element.createElement(_react3.Icon, { icon: "bx:bx-help-circle", width: "18px" })
                                            )
                                        )
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Plural \xA0",
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: "Plural label. Used for the taxonomy admin menu item" },
                                            wp.element.createElement(
                                                "span",
                                                { className: "helper" },
                                                wp.element.createElement(_react3.Icon, { icon: "bx:bx-help-circle", width: "18px" })
                                            )
                                        )
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        { className: "with-border" },
                                        "Post count \xA0",
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: "Published posts count associated with the taxonomy" },
                                            wp.element.createElement(
                                                "span",
                                                { className: "helper" },
                                                wp.element.createElement(_react3.Icon, { icon: "bx:bx-help-circle", width: "18px" })
                                            )
                                        )
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Associate \xA0",
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: "Associate custom post types here" },
                                            wp.element.createElement(
                                                "span",
                                                { className: "helper" },
                                                wp.element.createElement(_react3.Icon, { icon: "bx:bx-help-circle", width: "18px" })
                                            )
                                        )
                                    )
                                )
                            ),
                            wp.element.createElement(
                                "tbody",
                                null,
                                fetchedTaxonomies.map(function (element) {
                                    return wp.element.createElement(_AssocTaxonomyElement2.default, {
                                        postType: postType,
                                        id: element.id,
                                        key: element.id,
                                        element: element,
                                        defaultChecked: !(0, _objects.isEmpty)((0, _objects.filterById)(fetchedPosts[0].taxonomies, element.id))
                                    });
                                })
                            )
                        )
                    )
                )
            ) : wp.element.createElement(
                "div",
                { className: "acpt-alert acpt-alert-secondary" },
                "No taxonomies found. ",
                wp.element.createElement(
                    _reactRouterDom.Link,
                    { to: "/register_taxonomy" },
                    "Register the first one"
                ),
                "!"
            )
        )
    );
};

exports.default = AssocTaxonomyToCustomPostType;

// import React, {useEffect, useRef, useState} from 'react';
// import {Link, useParams} from "react-router-dom";
// import {useDispatch, useSelector} from "react-redux";
// import {metaTitle} from "../../../utils/misc";
// import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
// import Spinner from "../../reusable/Loader/Spinner";
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import AssocTaxonomyElement from "./AssocTaxonomyElement";
// import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
// import {filterById, isEmpty} from "../../../utils/objects";
// import {toast} from "react-toastify";
// import {Icon} from "@iconify/react";
// import Tippy from "../../reusable/Tippy";
// import Copyright from "../../reusable/Copyright";
//
// const AssocTaxonomyToCustomPostType = () => {
//
//     // manage global state
//     const dispatch = useDispatch();
//     const {success: successAssocTaxonomyToPost, loading: loadingAssocTaxonomyToPost, errors: assocTaxonomyToPostErrors} = useSelector(state => state.assocTaxonomyToPostReducer);
//     const {fetched: fetchedTaxonomies, loading: loadingTaxonomies} = useSelector(state => state.fetchTaxonomiesReducer);
//     const {fetched: fetchedPosts, loading: loadingPosts} = useSelector(state => state.fetchPostTypesReducer);
//
//     // manage local state
//     const {postType} = useParams();
//     const didMountRef = useRef(false);
//     const [fetchedSuccess, setFetchedSuccess] = useState(null);
//
//     useEffect(() => {
//         metaTitle("Registered Taxonomies");
//         dispatch(fetchTaxonomies());
//         dispatch(fetchPostTypes({
//             postType:postType
//         }));
//     }, []);
//
//     // handle fetch outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!loadingTaxonomies && !loadingPosts){
//                 setFetchedSuccess(true);
//
//                 const f = [];
//                 fetchedTaxonomies.map((item)=>{
//                     f.push({
//                         id: item.id,
//                         checked: !isEmpty(filterById(fetchedPosts[0].taxonomies, item.id)),
//                     });
//                 });
//             }
//         } else {
//             didMountRef.current = true;
//         }
//     }, [loadingTaxonomies, loadingPosts]);
//
//     // handle assoc outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!loadingAssocTaxonomyToPost){
//                 if(successAssocTaxonomyToPost){
//                     toast.success("Custom post type was associated to selected taxonomies");
//                 }
//
//                 if(assocTaxonomyToPostErrors.length > 0){
//                     assocTaxonomyToPostErrors.map((error) => {
//                         toast.error(error);
//                     });
//                 }
//             }
//         } else {
//             didMountRef.current = true;
//         }
//     }, [loadingAssocTaxonomyToPost]);
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
//                     label: "Registered Taxonomies",
//                     link: "/taxonomies"
//                 },
//                 {
//                     label: postType,
//                     link: `/view/${postType}`
//                 },
//                 {
//                     label: `Associate taxonomies to ${postType}`
//                 }
//             ]} />
//             <h1 className="acpt-title">
//                 <Icon icon="bx:bx-repost" color="#02c39a" width="18px"/>
//                 &nbsp;
//                 Associate taxonomies to {postType}
//             </h1>
//             {fetchedTaxonomies.length > 0 ?
//                 <div className="acpt-card">
//                     <div className="acpt-card__header">
//                         <div className="acpt-card__inner">
//                             {fetchedTaxonomies.length} taxonomies registered
//                         </div>
//                     </div>
//                     <div className="acpt-card__body">
//                         <div className="acpt-table-responsive">
//                             <table className="acpt-table">
//                                 <thead>
//                                     <tr>
//                                         <th className="grey backend with-border" colSpan={5}>Taxonomy data</th>
//                                         <th className="grey frontend" colSpan={1}>Actions</th>
//                                     </tr>
//                                     <tr>
//                                         <th>
//                                             Slug
//                                             &nbsp;
//                                             <Tippy title="Taxonomy slug. The post name/slug. Used for various queries for taxonomy content.">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                         <th/>
//                                         <th>
//                                             Singular
//                                             &nbsp;
//                                             <Tippy title="Singular label. Used when a singular label is needed">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                         <th>
//                                             Plural
//                                             &nbsp;
//                                             <Tippy title="Plural label. Used for the taxonomy admin menu item">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                         <th className="with-border">
//                                             Post count
//                                             &nbsp;
//                                             <Tippy title="Published posts count associated with the taxonomy">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                         <th>
//                                             Associate
//                                             &nbsp;
//                                             <Tippy title="Associate custom post types here">
//                                                 <span className="helper">
//                                                     <Icon icon="bx:bx-help-circle" width="18px"/>
//                                                 </span>
//                                             </Tippy>
//                                         </th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {fetchedTaxonomies.map((element) =>
//                                         <AssocTaxonomyElement
//                                             //onChange={handleChange}
//                                             postType={postType}
//                                             id={element.id}
//                                             key={element.id}
//                                             element={element}
//                                             defaultChecked={!isEmpty(filterById(fetchedPosts[0].taxonomies, element.id))}
//                                         />)}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//                 :
//                 <div className="acpt-alert acpt-alert-secondary">
//                     No taxonomies found. <Link to="/register_taxonomy">Register the first one</Link>!
//                 </div>
//             }
//             <Copyright/>
//         </div>
//     );
// };
//
// export default AssocTaxonomyToCustomPostType;

/***/ }),

/***/ 6054:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomPostTypeLabel = function CustomPostTypeLabel(_ref) {
    var element = _ref.element;


    // Note: can be used also for Taxonomy

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        element.isNative ? wp.element.createElement(
            'span',
            { className: 'acpt-badge acpt-badge-native' },
            wp.element.createElement(
                'span',
                { className: 'label' },
                'Native'
            )
        ) : wp.element.createElement(
            'span',
            { className: 'acpt-badge acpt-badge-' + (element.isWooCommerce === true ? 'woocommerce' : 'custom') },
            wp.element.createElement(
                'span',
                { className: 'label' },
                element.isWooCommerce === true ? 'WooCommerce' : 'Custom'
            )
        )
    );
};

exports.default = CustomPostTypeLabel;

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

/***/ 4061:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.assocTaxonomyToPostType = undefined;

var _ajax = __webpack_require__(7569);

var _assocTaxonomyToPostActions = __webpack_require__(4627);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var assocTaxonomyToPostType = exports.assocTaxonomyToPostType = function assocTaxonomyToPostType(postType, taxonomies) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _assocTaxonomyToPostActions.assocTaxonomyToPostInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)("assocTaxonomyToPostTypeAction", { postType: postType, taxonomies: taxonomies });

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _assocTaxonomyToPostActions.assocTaxonomyToPostSuccess)()) : dispatch((0, _assocTaxonomyToPostActions.assocTaxonomyToPostFailure)(res.error));
                            _context.next = 12;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);
                            dispatch((0, _assocTaxonomyToPostActions.assocTaxonomyToPostFailure)(_context.t0));

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

/***/ 4825:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchPostTypes = undefined;

var _ajax = __webpack_require__(7569);

var _fetchCustomPostTypesActions = __webpack_require__(8912);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchPostTypes = exports.fetchPostTypes = function fetchPostTypes(meta) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchCustomPostTypesActions.fetchPostTypesInProgress)(meta));
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchCustomPostTypesAction', meta ? meta : {});

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchCustomPostTypesActions.fetchPostTypesSuccess)(fetched));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchCustomPostTypesActions.fetchPostTypesFailure)(_context.t0));

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

/***/ 1141:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchTaxonomies = undefined;

var _ajax = __webpack_require__(7569);

var _fetchTaxonomiesActions = __webpack_require__(7783);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchTaxonomies = exports.fetchTaxonomies = function fetchTaxonomies(meta) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchTaxonomiesActions.fetchTaxonomiesInProgress)(meta));
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchTaxonomiesAction', meta ? meta : {});

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchTaxonomiesActions.fetchTaxonomiesSuccess)(fetched));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchTaxonomiesActions.fetchTaxonomiesFailure)(_context.t0));

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
//# sourceMappingURL=891.js.map