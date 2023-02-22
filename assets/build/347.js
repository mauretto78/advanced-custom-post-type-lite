(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[347],{

/***/ 3375:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _reactRedux = __webpack_require__(4494);

var _react3 = __webpack_require__(6229);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicElement = function BasicElement() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
    }),
        fetched = _useSelector.fetched;

    var data = {
        name: fetched[0].name,
        singular: fetched[0].singular,
        plural: fetched[0].plural,
        icon: fetched[0].icon,
        supports: fetched[0].supports
    };

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        postType = _useParams.postType;

    return wp.element.createElement(
        "div",
        null,
        wp.element.createElement(
            "table",
            { className: "acpt-table acpt-table-secondary mb-3" },
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Name"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.name
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
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Icon"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_react3.Icon, { icon: "dashicons:" + data.icon, color: "#2271b1", width: "18px" })
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Supports"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.supports && data.supports.map(function (s) {
                        return s !== '' && wp.element.createElement(
                            "div",
                            { className: "acpt-badge mr-1" },
                            wp.element.createElement(
                                "span",
                                { className: "label" },
                                s
                            )
                        );
                    })
                )
            )
        )
    );
};

exports.default = BasicElement;

/***/ }),

/***/ 500:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _label = __webpack_require__(4384);

var _reactRedux = __webpack_require__(4494);

var _react3 = __webpack_require__(6229);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LabelsElement = function LabelsElement() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
    }),
        fetched = _useSelector.fetched;

    var data = fetched[0].labels;

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        postType = _useParams.postType;

    return wp.element.createElement(
        "div",
        null,
        wp.element.createElement(
            "table",
            { className: "acpt-table acpt-table-secondary mb-3" },
            _label.postLabelsList.map(function (item) {
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

/***/ }),

/***/ 1268:
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

var _react3 = __webpack_require__(6229);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SettingsElement = function SettingsElement() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
    }),
        fetched = _useSelector.fetched;

    var data = fetched[0].settings;

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        postType = _useParams.postType;

    return wp.element.createElement(
        "div",
        null,
        wp.element.createElement(
            "table",
            { className: "acpt-table acpt-table-secondary mb-3" },
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
                    "Show in UI"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.show_ui })
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
                    "Show in admin bar"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.show_in_admin_bar })
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
                    "Menu position"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.menu_position
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Capability Type"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    data.capability_type
                )
            ),
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    { style: { width: '180px' } },
                    "Has archive"
                ),
                wp.element.createElement(
                    "td",
                    null,
                    wp.element.createElement(_Boolean2.default, { status: data.has_archive })
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
                    "Custom rewrite rules"
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

/***/ }),

/***/ 1347:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Breadcrumbs = __webpack_require__(7993);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _reactRedux = __webpack_require__(4494);

var _reactRouterDom = __webpack_require__(886);

var _fetchPostTypes = __webpack_require__(4825);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _misc = __webpack_require__(3154);

var _Accordion = __webpack_require__(1989);

var _Accordion2 = _interopRequireDefault(_Accordion);

var _Labels = __webpack_require__(500);

var _Labels2 = _interopRequireDefault(_Labels);

var _Basic = __webpack_require__(3375);

var _Basic2 = _interopRequireDefault(_Basic);

var _Settings = __webpack_require__(1268);

var _Settings2 = _interopRequireDefault(_Settings);

var _ = __webpack_require__(4929);

var _2 = _interopRequireDefault(_);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewCustomPostType = function ViewCustomPostType() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
    }),
        fetched = _useSelector.fetched,
        loading = _useSelector.loading;

    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        postType = _useParams.postType;

    var didMountRef = (0, _react.useRef)(false);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        fetchedSuccess = _useState2[0],
        setFetchedSuccess = _useState2[1];

    var _useState3 = (0, _react.useState)(1),
        _useState4 = _slicedToArray(_useState3, 2),
        activeTab = _useState4[0],
        setActiveTab = _useState4[1];

    var handleAccordionClick = function handleAccordionClick(index) {
        setActiveTab(index + 1);
    };

    // manage redirect
    var history = (0, _reactRouterDom.useHistory)();

    if (postType === 'page' || postType === 'post') {
        history.push('/');
    }

    (0, _react.useEffect)(function () {
        dispatch((0, _fetchPostTypes.fetchPostTypes)({
            postType: postType
        }));
        (0, _misc.metaTitle)("Custom Post Type global settings");
    }, [postType]);

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

    var buttons = wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                className: "acpt-btn acpt-btn-primary",
                to: "/edit/" + postType + "/" + activeTab
            },
            "Edit"
        ),
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                className: "acpt-btn acpt-btn-primary-o",
                to: "/assoc-taxonomy-post/" + postType
            },
            "Taxonomies association"
        )
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(_ActionsBar2.default, {
            title: postType + " global settings",
            actions: buttons
        }),
        wp.element.createElement(
            "main",
            null,
            wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                    label: "Registered Custom Post Types",
                    link: "/"
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

exports.default = ViewCustomPostType;

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

/***/ 4384:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

// please refer to
// https://developer.wordpress.org/reference/functions/get_post_type_labels/
var postLabelsList = exports.postLabelsList = [{
    id: "menu_name",
    label: "Menu Name",
    description: "Label for the menu name. Default is the same as name."
}, {
    id: "all_items",
    label: "All items",
    description: "Label to signify all items in a submenu link. Default is ‘All Posts’ / ‘All Pages’."
}, {
    id: "add_new",
    label: "Add New",
    description: "Default is ‘Add New’ for both hierarchical and non-hierarchical types."
}, {
    id: "add_new_item",
    label: "Add New Item",
    description: "Label for adding a new singular item. Default is ‘Add New Post’ / ‘Add New Page’."
}, {
    id: "edit_item",
    label: "Edit Item",
    description: "Label for editing a singular item. Default is ‘Edit Post’ / ‘Edit Page’."
}, {
    id: "new_item",
    label: "New Item",
    description: "Label for the new item page title. Default is ‘New Post’ / ‘New Page’."
}, {
    id: "view_item",
    label: "View Item",
    description: "Label for viewing a singular item. Default is ‘View Post’ / ‘View Page’."
}, {
    id: "view_items",
    label: "View Items",
    description: "Label for viewing post type archives. Default is ‘View Posts’ / ‘View Pages’."
}, {
    id: "search_item",
    label: "Search Item",
    description: "Label for searching plural items. Default is ‘Search Posts’ / ‘Search Pages’."
}, {
    id: "not_found",
    label: "Not Found",
    description: "Label used when no items are found. Default is ‘No posts found’ / ‘No pages found’."
}, {
    id: "not_found_in_trash",
    label: "Not Found in Trash",
    description: "Label used when no items are in the Trash. Default is ‘No posts found in Trash’ / ‘No pages found in Trash’."
}, {
    id: "parent_item_colon",
    label: "Parent",
    description: "Label used to prefix parents of hierarchical items. Not used on non-hierarchical post types. Default is ‘Parent Page:’."
}, {
    id: "featured_image",
    label: "Featured Image",
    description: "Label for the featured image meta box title. Default is ‘Featured image’."
}, {
    id: "set_featured_image",
    label: "Set Featured Image",
    description: "Label for setting the featured image. Default is ‘Set featured image’."
}, {
    id: "remove_featured_image",
    label: "Remove Featured Image",
    description: "Label for removing the featured image. Default is ‘Remove featured image’."
}, {
    id: "use_featured_image",
    label: "Use Featured Image",
    description: "Label in the media frame for using a featured image. Default is ‘Use as featured image’."
}, {
    id: "archives",
    label: "Archives",
    description: "Label for archives in nav menus. Default is ‘Post Archives’ / ‘Page Archives’."
}, {
    id: "insert_into_item",
    label: "Insert into item",
    description: "Label for the media frame button. Default is ‘Insert into post’ / ‘Insert into page’."
}, {
    id: "uploaded_to_this_item",
    label: "Uploaded to this Item",
    description: "Label for the media frame filter. Default is ‘Uploaded to this post’ / ‘Uploaded to this page’."
}, {
    id: "filter_items_list",
    label: "Filter Items List",
    description: "Label for the table views hidden heading. Default is ‘Filter posts list’ / ‘Filter pages list’."
}, {
    id: "items_list_navigation",
    label: "Items List Navigation",
    description: "Label for the table pagination hidden heading. Default is ‘Posts list navigation’ / ‘Pages list navigation’."
}, {
    id: "items_list",
    label: "Items List",
    description: "Label for the table hidden heading. Default is ‘Posts list’ / ‘Pages list’."
}, {
    id: "filter_by_date",
    label: "Filter by date",
    description: "Label for the date filter in list tables. Default is ‘Filter by date’."
}, {
    id: "item_published",
    label: "Item published",
    description: "Label used when an item is published. Default is ‘Post published.’ / ‘Page published.’"
}, {
    id: "item_published_privately",
    label: "Item published privately",
    description: "Label used when an item is published with private visibility. Default is ‘Post published privately.’ / ‘Page published privately.’"
}, {
    id: "item_reverted_to_draft",
    label: "Item reverted to draft",
    description: "Label used when an item is switched to a draft. Default is ‘Post reverted to draft.’ / ‘Page reverted to draft.’"
}, {
    id: "item_scheduled",
    label: "Item scheduled",
    description: "Label used when an item is scheduled for publishing. Default is ‘Post scheduled.’ / ‘Page scheduled.’"
}, {
    id: "item_updated",
    label: "Item updated",
    description: "Label used when an item is updated. Default is ‘Post updated.’ / ‘Page updated.’"
}];

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
//# sourceMappingURL=347.js.map