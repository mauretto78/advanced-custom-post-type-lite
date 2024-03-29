(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[454],{

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

/***/ 3900:
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

var ElementIcon = function ElementIcon(_ref) {
    var value = _ref.value;


    // render image if values starts by http / https
    if (value && value.includes("http://") || value && value.includes("https://")) {
        return wp.element.createElement('img', { src: value, width: 18, alt: '' });
    }

    // add dashicons: for retro-compatibility
    if (value && !value.includes("dashicons")) {
        return wp.element.createElement(_react3.Icon, { icon: 'dashicons:' + value, color: '#777', width: '18px' });
    }

    return wp.element.createElement(_react3.Icon, { icon: value, color: '#777', width: '18px' });
};

ElementIcon.propTypes = {
    value: _propTypes2.default.string.isRequired
};

exports.default = ElementIcon;

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

/***/ 5971:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.postLabels = undefined;

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var postLabels = exports.postLabels = [{
    id: "menu_name",
    label: (0, _useTranslation2.default)("Menu Name"),
    description: (0, _useTranslation2.default)("Label for the menu name. Default is the same as name.")
}, {
    id: "all_items",
    label: (0, _useTranslation2.default)("All items"),
    description: (0, _useTranslation2.default)("Label to signify all items in a submenu link. Default is ‘All Posts’ / ‘All Pages’.")
}, {
    id: "add_new",
    label: (0, _useTranslation2.default)("Add New"),
    description: (0, _useTranslation2.default)("Default is ‘Add New’ for both hierarchical and non-hierarchical types.")
}, {
    id: "add_new_item",
    label: (0, _useTranslation2.default)("Add New Item"),
    description: (0, _useTranslation2.default)("Label for adding a new singular item. Default is ‘Add New Post’ / ‘Add New Page’.")
}, {
    id: "edit_item",
    label: (0, _useTranslation2.default)("Edit Item"),
    description: (0, _useTranslation2.default)("Label for editing a singular item. Default is ‘Edit Post’ / ‘Edit Page’.")
}, {
    id: "new_item",
    label: (0, _useTranslation2.default)("New Item"),
    description: (0, _useTranslation2.default)("Label for the new item page title. Default is ‘New Post’ / ‘New Page’.")
}, {
    id: "view_item",
    label: (0, _useTranslation2.default)("View Item"),
    description: (0, _useTranslation2.default)("Label for viewing a singular item. Default is ‘View Post’ / ‘View Page’.")
}, {
    id: "view_items",
    label: (0, _useTranslation2.default)("View Items"),
    description: (0, _useTranslation2.default)("Label for viewing post type archives. Default is ‘View Posts’ / ‘View Pages’.")
}, {
    id: "search_item",
    label: (0, _useTranslation2.default)("Search Item"),
    description: (0, _useTranslation2.default)("Label for searching plural items. Default is ‘Search Posts’ / ‘Search Pages’.")
}, {
    id: "not_found",
    label: (0, _useTranslation2.default)("Not Found"),
    description: (0, _useTranslation2.default)("Label used when no items are found. Default is ‘No posts found’ / ‘No pages found’.")
}, {
    id: "not_found_in_trash",
    label: (0, _useTranslation2.default)("Not Found in Trash"),
    description: (0, _useTranslation2.default)("Label used when no items are in the Trash. Default is ‘No posts found in Trash’ / ‘No pages found in Trash’.")
}, {
    id: "parent_item_colon",
    label: (0, _useTranslation2.default)("Parent"),
    description: (0, _useTranslation2.default)("Label used to prefix parents of hierarchical items. Not used on non-hierarchical post types. Default is ‘Parent Page:’.")
}, {
    id: "featured_image",
    label: (0, _useTranslation2.default)("Featured Image"),
    description: (0, _useTranslation2.default)("Label for the featured image meta box title. Default is ‘Featured image’.")
}, {
    id: "set_featured_image",
    label: (0, _useTranslation2.default)("Set Featured Image"),
    description: (0, _useTranslation2.default)("Label for setting the featured image. Default is ‘Set featured image’.")
}, {
    id: "remove_featured_image",
    label: (0, _useTranslation2.default)("Remove Featured Image"),
    description: (0, _useTranslation2.default)("Label for removing the featured image. Default is ‘Remove featured image’.")
}, {
    id: "use_featured_image",
    label: (0, _useTranslation2.default)("Use Featured Image"),
    description: (0, _useTranslation2.default)("Label in the media frame for using a featured image. Default is ‘Use as featured image’.")
}, {
    id: "archives",
    label: (0, _useTranslation2.default)("Archives"),
    description: (0, _useTranslation2.default)("Label for archives in nav menus. Default is ‘Post Archives’ / ‘Page Archives’.")
}, {
    id: "insert_into_item",
    label: (0, _useTranslation2.default)("Insert into item"),
    description: (0, _useTranslation2.default)("Label for the media frame button. Default is ‘Insert into post’ / ‘Insert into page’.")
}, {
    id: "uploaded_to_this_item",
    label: (0, _useTranslation2.default)("Uploaded to this Item"),
    description: (0, _useTranslation2.default)("Label for the media frame filter. Default is ‘Uploaded to this post’ / ‘Uploaded to this page’.")
}, {
    id: "filter_items_list",
    label: (0, _useTranslation2.default)("Filter Items List"),
    description: (0, _useTranslation2.default)("Label for the table views hidden heading. Default is ‘Filter posts list’ / ‘Filter pages list’.")
}, {
    id: "items_list_navigation",
    label: (0, _useTranslation2.default)("Items List Navigation"),
    description: (0, _useTranslation2.default)("Label for the table pagination hidden heading. Default is ‘Posts list navigation’ / ‘Pages list navigation’.")
}, {
    id: "items_list",
    label: (0, _useTranslation2.default)("Items List"),
    description: (0, _useTranslation2.default)("Label for the table hidden heading. Default is ‘Posts list’ / ‘Pages list’.")
}, {
    id: "filter_by_date",
    label: (0, _useTranslation2.default)("Filter by date"),
    description: (0, _useTranslation2.default)("Label for the date filter in list tables. Default is ‘Filter by date’.")
}, {
    id: "item_published",
    label: (0, _useTranslation2.default)("Item published"),
    description: (0, _useTranslation2.default)("Label used when an item is published. Default is ‘Post published.’ / ‘Page published.’")
}, {
    id: "item_published_privately",
    label: (0, _useTranslation2.default)("Item published privately"),
    description: (0, _useTranslation2.default)("Label used when an item is published with private visibility. Default is ‘Post published privately.’ / ‘Page published privately.’")
}, {
    id: "item_reverted_to_draft",
    label: (0, _useTranslation2.default)("Item reverted to draft"),
    description: (0, _useTranslation2.default)("Label used when an item is switched to a draft. Default is ‘Post reverted to draft.’ / ‘Page reverted to draft.’")
}, {
    id: "item_scheduled",
    label: (0, _useTranslation2.default)("Item scheduled"),
    description: (0, _useTranslation2.default)("Label used when an item is scheduled for publishing. Default is ‘Post scheduled.’ / ‘Page scheduled.’")
}, {
    id: "item_updated",
    label: (0, _useTranslation2.default)("Item updated"),
    description: (0, _useTranslation2.default)("Label used when an item is updated. Default is ‘Post updated.’ / ‘Page updated.’")
}]; // please refer to
// https://developer.wordpress.org/reference/functions/get_post_type_labels/

/***/ }),

/***/ 9167:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(4022);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PageNotFound = function PageNotFound() {

    return wp.element.createElement(
        _Layout2.default,
        {
            crumbs: [{
                label: (0, _useTranslation2.default)("Registered Custom Post Types"),
                link: "/"
            }, {
                label: (0, _useTranslation2.default)("Page not found")
            }],
            title: (0, _useTranslation2.default)('Page not found')
        },
        wp.element.createElement(
            _Alert2.default,
            { style: _styles.styleVariants.WARNING },
            (0, _useTranslation2.default)('The requested page was not found, was deleted or was moved!')
        ),
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                className: "mt-12",
                to: "/"
            },
            (0, _useTranslation2.default)('Return back to list')
        )
    );
};

exports.default = PageNotFound;

/***/ }),

/***/ 7489:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _ElementIcon = __webpack_require__(3900);

var _ElementIcon2 = _interopRequireDefault(_ElementIcon);

var _Badge = __webpack_require__(3136);

var _Badge2 = _interopRequireDefault(_Badge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Basic = function Basic(_ref) {
    var data = _ref.data;


    if (data.length > 0) {
        return wp.element.createElement(
            'div',
            { className: 'with-border b-rounded' },
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Name"),
                value: data[0].name
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Singular"),
                value: data[0].singular
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Plural"),
                value: data[0].plural
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Icon"),
                value: wp.element.createElement(_ElementIcon2.default, { value: data[0].icon })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Supports"),
                value: wp.element.createElement(
                    'div',
                    { className: 'i-flex-center s-8' },
                    data[0].supports.map(function (s) {
                        return wp.element.createElement(
                            _Badge2.default,
                            null,
                            s
                        );
                    })
                )
            })
        );
    }
};

Basic.propTypes = {
    data: _propTypes2.default.object.isRequired
};

exports.default = Basic;

/***/ }),

/***/ 760:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _postLabels = __webpack_require__(5971);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Labels = function Labels(_ref) {
    var data = _ref.data;


    if (data.length > 0) {
        return wp.element.createElement(
            'div',
            { className: 'with-border b-rounded' },
            _postLabels.postLabels.map(function (label) {
                return wp.element.createElement(_CardRow2.default, {
                    index: label.id,
                    label: (0, _useTranslation2.default)(label.label),
                    value: data[0].labels[label.id]
                });
            })
        );
    }
};

Labels.propTypes = {
    data: _propTypes2.default.object.isRequired
};

exports.default = Labels;

/***/ }),

/***/ 4842:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Boolean = __webpack_require__(7306);

var _Boolean2 = _interopRequireDefault(_Boolean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Settings = function Settings(_ref) {
    var data = _ref.data,
        _ref$isWPGraphQLActiv = _ref.isWPGraphQLActive,
        isWPGraphQLActive = _ref$isWPGraphQLActiv === undefined ? false : _ref$isWPGraphQLActiv;


    if (data.length > 0) {
        return wp.element.createElement(
            'div',
            { className: 'with-border b-rounded' },
            isWPGraphQLActive && wp.element.createElement(
                _react2.default.Fragment,
                null,
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show the custom post type in WPGraphQL"),
                    value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.show_in_graphql })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("GraphQL single name"),
                    value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.graphql_single_name })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("GraphQL plural name"),
                    value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.graphql_plural_name })
                })
            ),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Hierarchical"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.hierarchical })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Is Public"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.public })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Publicly queryable"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.publicly_queryable })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Show in UI"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.show_ui })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Show in menu"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.show_in_menu })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Show in nav menus"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.show_in_nav_menus })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Show in admin bar"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.show_in_admin_bar })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Show in REST API"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.show_in_rest })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("REST API base slug"),
                value: data[0].settings.rest_base
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Menu position"),
                value: data[0].settings.menu_position
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Capability Type"),
                value: data[0].settings.capability_type
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Has archive"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.has_archive })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Rewrite"),
                value: wp.element.createElement(_Boolean2.default, { status: data[0].settings.rewrite })
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Custom rewrite rules"),
                value: data[0].settings.custom_rewrite
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Query var"),
                value: data[0].settings.query_var
            }),
            wp.element.createElement(_CardRow2.default, {
                label: (0, _useTranslation2.default)("Custom query var"),
                value: data[0].settings.custom_query_var
            })
        );
    }
};

Settings.propTypes = {
    data: _propTypes2.default.object.isRequired,
    isWPGraphQLActive: _propTypes2.default.bool
};

exports.default = Settings;

/***/ }),

/***/ 7454:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _reactRouterDom = __webpack_require__(4022);

var _reactRedux = __webpack_require__(6706);

var _ajax = __webpack_require__(7569);

var _misc = __webpack_require__(3154);

var _fetchCustomPostTypesSlice = __webpack_require__(9300);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _ = __webpack_require__(9167);

var _2 = _interopRequireDefault(_);

var _Tabs = __webpack_require__(7222);

var _Tabs2 = _interopRequireDefault(_Tabs);

var _Tab = __webpack_require__(8360);

var _Tab2 = _interopRequireDefault(_Tab);

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

var _Basic = __webpack_require__(7489);

var _Basic2 = _interopRequireDefault(_Basic);

var _Labels = __webpack_require__(760);

var _Labels2 = _interopRequireDefault(_Labels);

var _Settings = __webpack_require__(4842);

var _Settings2 = _interopRequireDefault(_Settings);

var _ButtonLink = __webpack_require__(4545);

var _ButtonLink2 = _interopRequireDefault(_ButtonLink);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ViewCustomPostType = function ViewCustomPostType() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchCustomPostTypes;
    }),
        data = _useSelector.data,
        loading = _useSelector.loading;

    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        postType = _useParams.postType;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isWPGraphQLActive = _useState2[0],
        setIsWPGraphQLActive = _useState2[1];

    var _useState3 = (0, _react.useState)(0),
        _useState4 = _slicedToArray(_useState3, 2),
        activeTab = _useState4[0],
        setActiveTab = _useState4[1];

    var _useState5 = (0, _react.useState)(false),
        _useState6 = _slicedToArray(_useState5, 2),
        fetchError = _useState6[0],
        setFetchError = _useState6[1];

    // manage redirect


    var navigate = (0, _reactRouterDom.useNavigate)();

    if (postType === 'page' || postType === 'post') {
        navigate('/');
    }

    // is WPGraphQL active?
    (0, _react.useEffect)(function () {
        (0, _ajax.wpAjaxRequest)("isWPGraphQLActiveAction", {}).then(function (res) {
            setIsWPGraphQLActive(res.status);
        }).catch(function (err) {
            console.error(err.message);
        });
    }, []);

    // fetch post
    (0, _react.useEffect)(function () {
        dispatch((0, _fetchCustomPostTypesSlice.fetchCustomPostTypes)({
            postType: postType
        })).then(function (res) {
            if (res.payload.length !== 1) {
                setFetchError(true);
            }
        }).catch(function (err) {
            setFetchError(true);
            console.error(err);
        });
        (0, _misc.metaTitle)((0, _useTranslation2.default)("Custom Post Type global settings"));
    }, [postType]);

    var handleStepChange = function handleStepChange(step) {
        setActiveTab(step);
    };

    if (loading) {
        return wp.element.createElement(_Loader2.default, null);
    }

    if (fetchError) {
        return wp.element.createElement(_2.default, null);
    }

    var actions = [wp.element.createElement(
        _ButtonLink2.default,
        { style: _styles.styleVariants.PRIMARY, to: "/edit/" + postType + "/" + activeTab },
        (0, _useTranslation2.default)("Edit")
    ), wp.element.createElement(
        _ButtonLink2.default,
        { style: _styles.styleVariants.SECONDARY, to: "/assoc-taxonomy-post/" + postType },
        (0, _useTranslation2.default)("Taxonomies association")
    )];

    return wp.element.createElement(
        _Layout2.default,
        {
            title: postType + ": " + (0, _useTranslation2.default)("global settings"),
            actions: actions,
            crumbs: [{
                label: (0, _useTranslation2.default)("Registered Custom Post Types"),
                link: "/"
            }, {
                label: postType + ": " + (0, _useTranslation2.default)("global settings")
            }]
        },
        wp.element.createElement(
            _Card2.default,
            { style: "with-shadow p-24" },
            wp.element.createElement(
                _Tabs2.default,
                {
                    handleClick: handleStepChange,
                    defaultActiveTab: activeTab
                },
                wp.element.createElement(
                    _Tab2.default,
                    { title: (0, _useTranslation2.default)("Basic") },
                    wp.element.createElement(_Basic2.default, { data: data })
                ),
                wp.element.createElement(
                    _Tab2.default,
                    { title: (0, _useTranslation2.default)("Labels") },
                    wp.element.createElement(_Labels2.default, { data: data })
                ),
                wp.element.createElement(
                    _Tab2.default,
                    { title: (0, _useTranslation2.default)("Settings") },
                    wp.element.createElement(_Settings2.default, { data: data, isWPGraphQLActive: isWPGraphQLActive })
                )
            )
        )
    );
};

exports.default = ViewCustomPostType;

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
//# sourceMappingURL=454.js.map