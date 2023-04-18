(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[489],{

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

/***/ 6740:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomPostTypesMiniTable = function CustomPostTypesMiniTable(_ref) {
    var taxonomy = _ref.taxonomy,
        elements = _ref.elements;


    return wp.element.createElement(
        "div",
        { className: "acpt-table-responsive" },
        wp.element.createElement(
            "table",
            { className: "acpt-minitable" },
            wp.element.createElement(
                "thead",
                null,
                wp.element.createElement(
                    "tr",
                    null,
                    wp.element.createElement(
                        "th",
                        null,
                        "CPT"
                    ),
                    wp.element.createElement(
                        "th",
                        null,
                        "Sing. label"
                    ),
                    wp.element.createElement(
                        "th",
                        null,
                        "Plural label"
                    ),
                    wp.element.createElement(
                        "th",
                        null,
                        "Post count"
                    )
                )
            ),
            wp.element.createElement(
                "tbody",
                null,
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
                            element.singular
                        ),
                        wp.element.createElement(
                            "td",
                            null,
                            element.plural
                        ),
                        wp.element.createElement(
                            "td",
                            null,
                            wp.element.createElement(
                                "span",
                                { className: "acpt-badge" },
                                wp.element.createElement(
                                    "span",
                                    { className: "label" },
                                    element.postCount ? element.postCount : 0
                                )
                            )
                        )
                    );
                })
            )
        ),
        wp.element.createElement(
            "div",
            { className: "minitable-buttons" },
            wp.element.createElement(
                "a",
                { href: "#/assoc-post-taxonomy/" + taxonomy },
                "Manage"
            )
        )
    );
};

exports.default = CustomPostTypesMiniTable;

/***/ }),

/***/ 272:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _objects = __webpack_require__(4040);

var _Tippy = __webpack_require__(5825);

var _Tippy2 = _interopRequireDefault(_Tippy);

var _CustomPostTypeLabel = __webpack_require__(6054);

var _CustomPostTypeLabel2 = _interopRequireDefault(_CustomPostTypeLabel);

var _CustomPostTypesMiniTable = __webpack_require__(6740);

var _CustomPostTypesMiniTable2 = _interopRequireDefault(_CustomPostTypesMiniTable);

var _MetaBoxMiniTable = __webpack_require__(400);

var _MetaBoxMiniTable2 = _interopRequireDefault(_MetaBoxMiniTable);

var _ProFeatureAlert = __webpack_require__(3187);

var _ProFeatureAlert2 = _interopRequireDefault(_ProFeatureAlert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaxonomyListElement = function TaxonomyListElement(_ref) {
    var id = _ref.id,
        element = _ref.element,
        handleDeleteTemplate = _ref.handleDeleteTemplate;


    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "tr",
            null,
            wp.element.createElement(
                "td",
                { className: "backend" },
                wp.element.createElement(
                    "div",
                    { className: "m-0 mb-1" },
                    wp.element.createElement(
                        "strong",
                        null,
                        element.slug
                    ),
                    !element.isNative && wp.element.createElement(
                        "div",
                        { className: "element-buttons" },
                        wp.element.createElement(
                            "a",
                            { href: "#/view_taxonomy/" + element.slug },
                            "View"
                        ),
                        "\xA0",
                        wp.element.createElement(
                            "a",
                            { href: "#/edit_taxonomy/" + element.slug },
                            "Edit"
                        ),
                        "\xA0",
                        wp.element.createElement(
                            "a",
                            { href: "#/delete_taxonomy/" + element.slug },
                            "Delete"
                        )
                    )
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
                (0, _objects.isset)(element, "meta") && element.meta.length > 0 ? wp.element.createElement(
                    _reactRouterDom.Link,
                    {
                        to: "meta-taxonomy/" + element.slug,
                        className: "acpt-btn no-border acpt-btn-sm acpt-btn-info-o"
                    },
                    "Manage"
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    {
                        to: "/meta-taxonomy/" + element.slug,
                        className: "acpt-btn no-border acpt-btn-sm acpt-btn-primary-o"
                    },
                    "Create"
                )
            ),
            wp.element.createElement(
                "td",
                null,
                (0, _objects.isset)(element, "customPostTypes") && element.customPostTypes.length > 0 ? wp.element.createElement(
                    _reactRouterDom.Link,
                    {
                        to: "/assoc-post-taxonomy/" + element.slug,
                        className: "acpt-btn no-border acpt-btn-sm acpt-btn-info-o"
                    },
                    "Manage"
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    {
                        to: "/assoc-post-taxonomy/" + element.slug,
                        className: "acpt-btn no-border acpt-btn-sm acpt-btn-primary-o"
                    },
                    "Associate"
                )
            ),
            wp.element.createElement(
                "td",
                { className: "with-border" },
                wp.element.createElement(
                    "span",
                    { className: "acpt-badge acpt-badge-success" },
                    wp.element.createElement(
                        "span",
                        { className: "label" },
                        element.postCount
                    )
                )
            ),
            wp.element.createElement(
                "td",
                { className: "frontend" },
                wp.element.createElement(_ProFeatureAlert2.default, null)
            )
        )
    );
};

exports.default = TaxonomyListElement;

/***/ }),

/***/ 7489:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _misc = __webpack_require__(3154);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _reactRedux = __webpack_require__(4494);

var _reactRouterDom = __webpack_require__(886);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _fetchTaxonomiesCount = __webpack_require__(2081);

var _fetchTaxonomies = __webpack_require__(1141);

var _Pagination = __webpack_require__(1222);

var _Pagination2 = _interopRequireDefault(_Pagination);

var _TaxonomyListElement = __webpack_require__(272);

var _TaxonomyListElement2 = _interopRequireDefault(_TaxonomyListElement);

var _react3 = __webpack_require__(6229);

var _Tippy = __webpack_require__(5825);

var _Tippy2 = _interopRequireDefault(_Tippy);

var _localization = __webpack_require__(8525);

var _objects = __webpack_require__(4040);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _metaTypes = __webpack_require__(1895);

var _reactToastify = __webpack_require__(9249);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaxonomyList = function TaxonomyList() {

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetched = _useSelector.fetched,
        loading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesCountReducer;
    }),
        fetchedCount = _useSelector2.fetched,
        loadingCount = _useSelector2.loading;

    var _useSelector3 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchSettingsReducer;
    }),
        settingsLoading = _useSelector3.loading,
        settings = _useSelector3.fetched;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        page = _useParams.page;

    var didMountRef = (0, _react.useRef)(false);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        fetchedSuccess = _useState2[0],
        setFetchedSuccess = _useState2[1];

    var perPage = settings.length > 0 && (0, _objects.filterByLabel)(settings, 'key', 'records_per_page') !== '' ? (0, _objects.filterByLabel)(settings, 'key', 'records_per_page').value : 20;
    var totalPages = Math.ceil(fetchedCount / perPage);
    var history = (0, _reactRouterDom.useHistory)();

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _localization.translate)("taxonomy_list.title"));
        (0, _misc.changeCurrentAdminMenuLink)('#/taxonomies');
        dispatch((0, _fetchTaxonomiesCount.fetchTaxonomiesCount)());
        dispatch((0, _fetchTaxonomies.fetchTaxonomies)({
            page: page ? page : 1,
            perPage: perPage
        }));
    }, [page]);

    // handle fetch outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loading && !settingsLoading) {
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    if (!fetchedSuccess) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    var button = wp.element.createElement(
        _reactRouterDom.Link,
        {
            className: "acpt-btn acpt-btn-primary",
            to: "/register_taxonomy"
        },
        "Register new Taxonomy"
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(_ActionsBar2.default, {
            title: "Registered Taxonomies",
            actions: button
        }),
        wp.element.createElement(
            "main",
            null,
            wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                    label: "Registered Taxonomies"
                }] }),
            fetched.length > 0 ? wp.element.createElement(
                "div",
                { className: "acpt-card" },
                wp.element.createElement(
                    "div",
                    { className: "acpt-card__header" },
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        fetchedCount,
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
                                        { className: "grey backend with-border", colSpan: 5 },
                                        "Backend UI"
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        { className: "grey frontend", colSpan: 1 },
                                        "Frontend UI"
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
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Type"
                                    ),
                                    wp.element.createElement(
                                        "th",
                                        null,
                                        "Meta boxes \xA0",
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: "Associated meta boxes" },
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
                                        "Associated post types \xA0",
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: "Associate custom post types here" },
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
                                        { className: "text-center" },
                                        "Single template \xA0",
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: "The single template for taxonomy term" },
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
                                fetched.map(function (element) {
                                    return wp.element.createElement(_TaxonomyListElement2.default, { id: element.id, key: element.id, element: element });
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
                        wp.element.createElement(_Pagination2.default, { currentPage: page ? page : 1, perPage: perPage, records: fetchedCount })
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

exports.default = TaxonomyList;

// import React, {useEffect, useRef, useState} from 'react';
// import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {useDispatch, useSelector} from "react-redux";
// import {Link, useParams} from "react-router-dom";
// import Spinner from "../../reusable/Loader/Spinner";
// import {fetchTaxonomiesCount} from "../../../redux/thunks/fetchTaxonomiesCount";
// import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
// import Pagination from "../../reusable/Pagination";
// import TaxonomyListElement from "./TaxonomyListElement";
// import {Icon} from "@iconify/react";
// import Tippy from "../../reusable/Tippy";
// import {translate} from "../../../localization";
// import Copyright from "../../reusable/Copyright";
// import {filterByLabel} from "../../../utils/objects";
//
// const TaxonomyList = () => {
//
//     // manage global state
//     const dispatch = useDispatch();
//     const {fetched, loading} = useSelector(state => state.fetchTaxonomiesReducer);
//     const {fetched: fetchedCount, loading:loadingCount} = useSelector(state => state.fetchTaxonomiesCountReducer);
//     const {loading: settingsLoading, fetched: settings} = useSelector(state => state.fetchSettingsReducer);
//
//     // manage local state
//     const {page} = useParams();
//     const didMountRef = useRef(false);
//     const [fetchedSuccess, setFetchedSuccess] = useState(null);
//     const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
//
//     useEffect(() => {
//         metaTitle(translate("taxonomy_list.title"));
//         changeCurrentAdminMenuLink('#/taxonomies');
//         dispatch(fetchTaxonomiesCount());
//         dispatch(fetchTaxonomies({
//             page: page ? page : 1,
//             perPage: perPage
//         }));
//     }, [page]);
//
//     // handle fetch outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!loading && !settingsLoading){
//                 setFetchedSuccess(true);
//             }
//         } else {
//             didMountRef.current = true;
//         }
//     }, [loading]);
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
//                     label: "Registered Taxonomies"
//                 }
//             ]} />
//             <h1 className="acpt-title">
//                 <Icon icon="bx:bx-purchase-tag" color="#02c39a" width="18px" />
//                 &nbsp;
//                 Registered Taxonomies
//             </h1>
//             <div className="acpt-buttons">
//                 <Link
//                     className="acpt-btn acpt-btn-primary-o"
//                     to="/register_taxonomy">
//                     <Icon icon="bx:bx-list-plus" width="18px" />
//                     &nbsp;
//                     Register new Taxonomy
//                 </Link>
//             </div>
//             {fetched.length > 0 ?
//                 <div className="acpt-card">
//                     <div className="acpt-card__header">
//                         <div className="acpt-card__inner">
//                             {fetchedCount} record(s) found
//                         </div>
//                     </div>
//                     <div className="acpt-card__body">
//                         <div className="acpt-table-responsive">
//                             <table className="acpt-table">
//                                 <thead>
//                                     <tr>
//                                         <th className="grey backend with-border" colSpan={5}>Registered taxonomies</th>
//                                         <th className="grey frontend" colSpan={1}>Associated</th>
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
//                                             Custom post types
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
//                                 {fetched.map((element) => <TaxonomyListElement id={element.id} key={element.id} element={element} />)}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                     <div className="acpt-card__footer" style={{border: "none"}}>
//                         <div className="acpt-card__inner">
//                             <Pagination currentPage={page ? page : 1} perPage={perPage} records={fetchedCount}/>
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
// export default TaxonomyList;

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

/***/ 400:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaBoxMiniTable = function MetaBoxMiniTable(_ref) {
    var postType = _ref.postType,
        taxonomy = _ref.taxonomy,
        elements = _ref.elements;


    var manageLink = postType ? "#/meta/" + postType : "#/meta-taxonomy/" + taxonomy;

    return wp.element.createElement(
        "div",
        { className: "acpt-table-responsive" },
        wp.element.createElement(
            "table",
            { className: "acpt-minitable" },
            wp.element.createElement(
                "thead",
                null,
                wp.element.createElement(
                    "tr",
                    null,
                    wp.element.createElement(
                        "th",
                        null,
                        "Meta box"
                    ),
                    wp.element.createElement(
                        "th",
                        null,
                        "Fields count"
                    )
                )
            ),
            wp.element.createElement(
                "tbody",
                null,
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
                            wp.element.createElement(
                                "span",
                                { className: "acpt-badge" },
                                wp.element.createElement(
                                    "span",
                                    { className: "label" },
                                    element.count
                                )
                            )
                        )
                    );
                })
            )
        ),
        wp.element.createElement(
            "div",
            { className: "minitable-buttons" },
            wp.element.createElement(
                "a",
                { href: manageLink },
                "Manage"
            )
        )
    );
};

exports.default = MetaBoxMiniTable;

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

/***/ 3187:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProFeatureAlert = function ProFeatureAlert() {

    return wp.element.createElement(
        "span",
        { className: "pro-feature" },
        wp.element.createElement(
            "span",
            { className: "acpt-badge acpt-badge-pro" },
            "Pro feature"
        ),
        wp.element.createElement(
            "a",
            { href: "https://acpt.io/checkout/", target: "_blank" },
            "Upgrade"
        )
    );
};

exports.default = ProFeatureAlert;

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

/***/ 2081:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchTaxonomiesCount = undefined;

var _ajax = __webpack_require__(7569);

var _fetchTaxonomiesCountActions = __webpack_require__(5034);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchTaxonomiesCount = exports.fetchTaxonomiesCount = function fetchTaxonomiesCount() {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchTaxonomiesCountActions.fetchTaxonomiesCountInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchTaxonomiesCountAction');

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchTaxonomiesCountActions.fetchTaxonomiesCountSuccess)(fetched));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchTaxonomiesCountActions.fetchTaxonomiesCountFailure)(_context.t0));

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
//# sourceMappingURL=489.js.map