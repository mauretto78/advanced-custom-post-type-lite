(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[792],{

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

/***/ 4347:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _reactRedux = __webpack_require__(4494);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicElement = function BasicElement() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetched = _useSelector.fetched;

    var data = {
        slug: fetched[0].slug,
        singular: fetched[0].singular,
        plural: fetched[0].plural
    };

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        taxonomy = _useParams.taxonomy;

    return wp.element.createElement(
        "div",
        null,
        wp.element.createElement(
            "table",
            { className: "acpt-table acpt-table-secondary" },
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Slug"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.slug
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Singular"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.singular
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Plural"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.plural
                )
            )
        )
    );
};

exports.default = BasicElement;

// import React from 'react';
// import {Link, useParams} from "react-router-dom";
// import {useSelector} from "react-redux";
// import {Icon} from "@iconify/react";
//
// const BasicElement = () => {
//
//     // manage global state
//     const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
//     const data = {
//         slug: fetched[0].slug,
//         singular: fetched[0].singular,
//         plural: fetched[0].plural,
//     };
//
//     // manage local state
//     const {taxonomy} = useParams();
//
//     return (
//         <div>
//             <table className="acpt-table acpt-table-secondary mb-3">
//                 <tr>
//                     <th style={{width: '180px'}}>Slug</th>
//                     <td>{data.slug}</td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Singular</th>
//                     <td>{data.singular}</td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Plural</th>
//                     <td>{data.plural}</td>
//                 </tr>
//             </table>
//             <Link
//                 className="acpt-btn acpt-btn-primary"
//                 to={`/edit_taxonomy/${taxonomy}/1`}>
//                 <Icon icon="bx:bx-edit" width="18px" />
//                 Edit
//             </Link>
//         </div>
//     );
// };
//
// export default BasicElement;

/***/ }),

/***/ 4350:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _reactRedux = __webpack_require__(4494);

var _taxonomy_label = __webpack_require__(4644);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LabelsElement = function LabelsElement() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetched = _useSelector.fetched;

    var data = fetched[0].labels;

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        taxonomy = _useParams.taxonomy;

    return wp.element.createElement(
        "div",
        null,
        wp.element.createElement(
            "table",
            { className: "acpt-table acpt-table-secondary" },
            _taxonomy_label.taxonomyLabelsList.map(function (item) {
                return wp.element.createElement(
                    "tr",
                    null,
                    wp.element.createElement(
                        "th",
                        { style: { width: '180px' } },
                        item.label
                    ),
                    wp.element.createElement(
                        "td",
                        null,
                        data[item.id]
                    )
                );
            })
        )
    );
};

exports.default = LabelsElement;

// import React from 'react';
// import {Link, useParams} from "react-router-dom";
// import {useSelector} from "react-redux";
// import {taxonomyLabelsList} from "../../../constants/taxonomy_label";
// import {Icon} from "@iconify/react";
//
// const LabelsElement = () => {
//
//     // manage global state
//     const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
//     const data = fetched[0].labels;
//
//     // manage local state
//     const {taxonomy} = useParams();
//
//     return (
//         <div>
//             <table className="acpt-table acpt-table-secondary mb-3">
//                 {taxonomyLabelsList.map((item) => (
//                     <tr>
//                         <th style={{width: '180px'}}>{item.label}</th>
//                         <td>{data[item.id]}</td>
//                     </tr>
//                 ))}
//             </table>
//             <Link
//                 className="acpt-btn acpt-btn-primary"
//                 to={`/edit_taxonomy/${taxonomy}/2`}>
//                 <Icon icon="bx:bx-edit" width="18px" />
//                 Edit
//             </Link>
//         </div>
//     );
// };
//
// export default LabelsElement;

/***/ }),

/***/ 3111:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4494);

var _reactRouterDom = __webpack_require__(886);

var _Boolean = __webpack_require__(9904);

var _Boolean2 = _interopRequireDefault(_Boolean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SettingsElement = function SettingsElement() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetched = _useSelector.fetched;

    var data = fetched[0].settings;

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        taxonomy = _useParams.taxonomy;

    return wp.element.createElement(
        "div",
        null,
        wp.element.createElement(
            "table",
            { className: "acpt-table acpt-table-secondary" },
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Is Public"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.public })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Publicly queryable"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.publicly_queryable })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Hierarchical"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.hierarchical })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Show in menu"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.show_in_menu })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Show in nav menus"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.show_in_nav_menus })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Show in REST API"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.show_in_rest })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "REST API base slug"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.rest_base
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "REST Controller class"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.rest_controller_class
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Show Tagcloud"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.show_tagcloud })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Show in quick edit"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.show_in_quick_edit })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Show admin column"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.show_admin_column })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Capabilities"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.capabilities && data.capabilities.map(function (s) {
                        return wp.element.createElement(
                            "div",
                            null,
                            s
                        );
                    })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Rewrite"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.rewrite })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Custom rewrite"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.custom_rewrite
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Query var"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.query_var })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Custom query var"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.custom_query_var
                )
            )
        )
    );
};

exports.default = SettingsElement;

// import React from 'react';
// import {useSelector} from "react-redux";
// import {Link, useParams} from "react-router-dom";
// import Boolean from "../../reusable/Boolean";
// import {Icon} from "@iconify/react";
//
// const SettingsElement = () => {
//
//     // manage global state
//     const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
//     const data = fetched[0].settings;
//
//     // manage local state
//     const {taxonomy} = useParams();
//
//     return (
//         <div>
//             <table className="acpt-table acpt-table-secondary mb-3">
//                 <tr>
//                     <th style={{width: '180px'}}>Is Public</th>
//                     <td><Boolean status={data.public}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Publicly queryable</th>
//                     <td><Boolean status={data.publicly_queryable}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Hierarchical</th>
//                     <td><Boolean status={data.hierarchical}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Show in menu</th>
//                     <td><Boolean status={data.show_in_menu}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Show in nav menus</th>
//                     <td><Boolean status={data.show_in_nav_menus}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Show in REST API</th>
//                     <td><Boolean status={data.show_in_rest}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>REST API base slug</th>
//                     <td>{data.rest_base}</td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>REST Controller class</th>
//                     <td>{data.rest_controller_class}</td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Show Tagcloud</th>
//                     <td><Boolean status={data.show_tagcloud}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Show in quick edit</th>
//                     <td><Boolean status={data.show_in_quick_edit}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Show admin column</th>
//                     <td><Boolean status={data.show_admin_column}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Capabilities</th>
//                     <td>
//                         {data.capabilities && data.capabilities.map((s)=>
//                             <div>{s}</div>
//                         )}
//                     </td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Rewrite</th>
//                     <td><Boolean status={data.rewrite}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Custom rewrite</th>
//                     <td>{data.custom_rewrite}</td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Query var</th>
//                     <td><Boolean status={data.query_var}/></td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Custom query var</th>
//                     <td>{data.custom_query_var}</td>
//                 </tr>
//             </table>
//             <Link
//                 className="acpt-btn acpt-btn-primary"
//                 to={`/edit_taxonomy/${taxonomy}/3`}>
//                 <Icon icon="bx:bx-edit" width="18px" />
//                 Edit
//             </Link>
//         </div>
//     );
// };
//
// export default SettingsElement;

/***/ }),

/***/ 3792:
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

var _Accordion = __webpack_require__(1989);

var _Accordion2 = _interopRequireDefault(_Accordion);

var _Labels = __webpack_require__(4350);

var _Labels2 = _interopRequireDefault(_Labels);

var _Basic = __webpack_require__(4347);

var _Basic2 = _interopRequireDefault(_Basic);

var _Settings = __webpack_require__(3111);

var _Settings2 = _interopRequireDefault(_Settings);

var _ = __webpack_require__(4929);

var _2 = _interopRequireDefault(_);

var _fetchTaxonomies = __webpack_require__(1141);

var _localization = __webpack_require__(8525);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewTaxonomy = function ViewTaxonomy() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetched = _useSelector.fetched,
        loading = _useSelector.loading;

    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        taxonomy = _useParams.taxonomy;

    var didMountRef = (0, _react.useRef)(false);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        fetchedSuccess = _useState2[0],
        setFetchedSuccess = _useState2[1];

    var _useState3 = (0, _react.useState)(1),
        _useState4 = _slicedToArray(_useState3, 2),
        activeTab = _useState4[0],
        setActiveTab = _useState4[1];

    (0, _react.useEffect)(function () {
        dispatch((0, _fetchTaxonomies.fetchTaxonomies)({
            taxonomy: taxonomy
        }));
        (0, _misc.metaTitle)((0, _localization.translate)("taxonomy_view.title"));
    }, [taxonomy]);

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

    var handleAccordionClick = function handleAccordionClick(index) {
        setActiveTab(index + 1);
    };

    var buttons = wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                className: "acpt-btn acpt-btn-primary",
                to: "/edit_taxonomy/" + taxonomy + "/" + activeTab
            },
            "Edit"
        )
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(_ActionsBar2.default, {
            title: taxonomy + " global settings",
            actions: buttons
        }),
        wp.element.createElement(
            "main",
            null,
            wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                    label: "Registered Custom Post Types",
                    link: "/"
                }, {
                    label: "Registered Taxonomies",
                    link: "/taxonomies"
                }, {
                    label: "Custom Post Type global settings"
                }] }),
            wp.element.createElement(
                _Accordion2.default,
                { handleClick: handleAccordionClick },
                wp.element.createElement(_Basic2.default, { title: "Basic" }),
                wp.element.createElement(_Labels2.default, { title: "Labels" }),
                wp.element.createElement(_Settings2.default, { title: "Settings" })
            )
        )
    );
};

exports.default = ViewTaxonomy;

// import React, {useEffect, useRef, useState} from 'react';
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {useDispatch, useSelector} from "react-redux";
// import {useParams} from "react-router-dom";
// import Spinner from "../../reusable/Loader/Spinner";
// import {metaTitle} from "../../../utils/misc";
// import Accordion from "../../reusable/Accordion";
// import LabelsElement from "./_Labels";
// import BasicElement from "./_Basic";
// import SettingsElement from "./_Settings";
// import NotFound404 from "../404";
// import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
// import {Icon} from "@iconify/react";
// import {translate} from "../../../localization";
// import Copyright from "../../reusable/Copyright";
//
// const ViewTaxonomy = () => {
//
//     // manage global state
//     const {fetched, loading} = useSelector(state => state.fetchTaxonomiesReducer);
//     const dispatch = useDispatch();
//
//     // manage local state
//     const {taxonomy} = useParams();
//     const didMountRef = useRef(false);
//     const [fetchedSuccess, setFetchedSuccess] = useState(null);
//
//     useEffect(() => {
//         dispatch(fetchTaxonomies({
//             taxonomy:taxonomy
//         }));
//         metaTitle(translate("taxonomy_view.title"));
//     }, [taxonomy]);
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
//                     label: "Registered Taxonomies",
//                     link: "/taxonomies"
//                 },
//                 {
//                     label: "Custom Post Type global settings"
//                 }
//             ]} />
//             <h1 className="acpt-title">
//                 <Icon icon="bx:bx-search-alt" color="#02c39a" width="18px" />
//                 &nbsp;
//                 {taxonomy} global settings
//             </h1>
//             <Accordion>
//                 <BasicElement title="Basic" />
//                 <LabelsElement title="Labels" />
//                 <SettingsElement title="Settings"/>
//             </Accordion>
//             <Copyright/>
//         </div>
//     );
// };
//
// export default ViewTaxonomy;

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

/***/ 4644:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

// please refer to
// https://developer.wordpress.org/reference/functions/get_taxonomy_labels/
var taxonomyLabelsList = exports.taxonomyLabelsList = [{
    id: "name",
    label: "Menu Name",
    description: "General name for the taxonomy, usually plural. The same as and overridden by $tax->label. Default 'Tags'/'Categories'."
}, {
    id: "singular_name",
    label: "Singular name",
    description: "Name for one object of this taxonomy. Default 'Tag'/'Category'"
}, {
    id: "search_items",
    label: "Search items",
    description: "Search Tags/Search Categories"
}, {
    id: "popular_items",
    label: "Popular items",
    description: "This label is only used for non-hierarchical taxonomies. Default 'Popular Tags'."
}, {
    id: "all_items",
    label: "All items",
    description: "All Tags'/'All Categories"
}, {
    id: "parent_item",
    label: "Parent item",
    description: "This label is only used for hierarchical taxonomies. Default 'Parent Category'."
}, {
    id: "parent_item_colon",
    label: "Parent item colon",
    description: "The same as parent_item, but with colon : in the end."
}, {
    id: "edit_item",
    label: "Edit item",
    description: "Edit Tag'/'Edit Category."
}, {
    id: "view_item",
    label: "View item",
    description: "View Tag'/'View Category."
}, {
    id: "update_item",
    label: "Update item",
    description: "Update Tag'/'Update Category."
}, {
    id: "add_new_item",
    label: "Add new item",
    description: "Add New Tag'/'Add New Category."
}, {
    id: "new_item_name",
    label: "New item name",
    description: "New Tag Name'/'New Category Name."
}, {
    id: "separate_items_with_commas",
    label: "Separate items with commas",
    description: "This label is only used for non-hierarchical taxonomies. Default 'Separate tags with commas', used in the meta box."
}, {
    id: "add_or_remove_items",
    label: "Add or remove items",
    description: "This label is only used for non-hierarchical taxonomies. Default 'Add or remove tags', used in the meta box when JavaScript is disabled."
}, {
    id: "choose_from_most_used",
    label: "Choose from most used",
    description: "This label is only used on non-hierarchical taxonomies. Default 'Choose from the most used tags', used in the meta box."
}, {
    id: "not_found",
    label: "Not found",
    description: "No tags found'/'No categories found', used in the meta box and taxonomy list table."
}, {
    id: "no_terms",
    label: "No terms",
    description: "No tags'/'No categories', used in the posts and media list tables."
}, {
    id: "filter_by_item",
    label: "Filter by item",
    description: "This label is only used for hierarchical taxonomies. Default 'Filter by category', used in the posts list table."
}, {
    id: "items_list_navigation",
    label: "Items list navigation",
    description: "Label for the table pagination hidden heading."
}, {
    id: "items_list",
    label: "Items list",
    description: "Label for the table hidden heading."
}, {
    id: "most_used",
    label: "Most used",
    description: "Title for the Most Used tab. Default 'Most Used'."
}, {
    id: "back_to_items",
    label: "Back to items",
    description: "Label displayed after a term has been updated."
}];

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
//# sourceMappingURL=792.js.map