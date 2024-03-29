(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[876],{

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

/***/ 4250:
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

var DashiconSelectorItem = function DashiconSelectorItem(_ref) {
    var icon = _ref.icon,
        callback = _ref.callback;


    return wp.element.createElement(
        'div',
        {
            title: icon,
            className: 'icon',
            onClick: function onClick() {
                callback(icon);
            }
        },
        wp.element.createElement(_react3.Icon, { icon: icon, width: '24px' })
    );
};

DashiconSelectorItem.propTypes = {
    icon: _propTypes2.default.string.isRequired,
    callback: _propTypes2.default.func
};

exports.default = DashiconSelectorItem;

/***/ }),

/***/ 8172:
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

var _DashiconSelectorItem = __webpack_require__(4250);

var _DashiconSelectorItem2 = _interopRequireDefault(_DashiconSelectorItem);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var DashiconSelector = function DashiconSelector(_ref) {
    var type = _ref.type,
        callback = _ref.callback;

    var _useState = (0, _react.useState)([]),
        _useState2 = _slicedToArray(_useState, 2),
        searchResults = _useState2[0],
        setSearchResults = _useState2[1];

    var ICONIFY_API_ROOT = 'https://api.iconify.design/';

    /**
     * Filter icons
     * @param search
     */
    var searchIcons = function searchIcons(search) {
        fetch(ICONIFY_API_ROOT + "search?query=" + search + "&prefix=dashicons&limit=96").then(function (res) {
            return res.json();
        }).then(function (res) {
            setSearchResults(res.icons);
        });
    };

    /**
     * Fetch all icons
     */
    var fetchIcons = function fetchIcons() {
        fetch(ICONIFY_API_ROOT + "collection?prefix=dashicons").then(function (res) {
            return res.json();
        }).then(function (res) {
            var icons = [];

            res.uncategorized.map(function (icon) {
                icons.push("dashicons-" + icon);
            });

            setSearchResults(icons);
        });
    };

    /**
     * Open WP Media and select image
     */
    var openWpMedia = function openWpMedia() {

        if (!wp || !wp.media) {
            alert((0, _useTranslation2.default)('The media gallery is not available. You must admin_enqueue this function: wp_enqueue_media()'));
            return;
        }

        var image = wp.media({
            title: (0, _useTranslation2.default)('Upload an Image'),
            library: {
                type: ['image']
            },
            multiple: false
        });

        image.on('select', function (e) {
            var uploaded_image = image.state().get('selection').first();
            var image_url = uploaded_image.toJSON().url;
            callback(image_url);
        });

        image.open();
    };

    (0, _react.useEffect)(function () {
        fetchIcons();
    }, []);

    if (type === 'image') {
        return wp.element.createElement(
            "a",
            {
                href: "#",
                className: "mt-1 acpt-btn acpt-btn-primary-o acpt-btn-block",
                onClick: function onClick(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    openWpMedia();
                }
            },
            (0, _useTranslation2.default)("Upload an Image")
        );
    }

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "div",
            { className: "form-group" },
            wp.element.createElement("input", {
                type: "text",
                className: "form-control",
                placeholder: (0, _useTranslation2.default)("Type at least 3 characters to start searching."),
                onChange: function () {
                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(e) {
                        var search;
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                            while (1) {
                                switch (_context.prev = _context.next) {
                                    case 0:
                                        search = e.currentTarget.value;


                                        if (search.length === 0) {
                                            fetchIcons();
                                        }

                                        if (search.length >= 3) {
                                            searchIcons(search);
                                        }

                                    case 3:
                                    case "end":
                                        return _context.stop();
                                }
                            }
                        }, _callee, undefined);
                    }));

                    return function (_x) {
                        return _ref2.apply(this, arguments);
                    };
                }()
            })
        ),
        searchResults.length > 0 && wp.element.createElement(
            "div",
            {
                className: "mt-24 icon-picker-wrapper",
                "data-cy": "icon-picker-wrapper"
            },
            searchResults.map(function (searchResult) {
                return wp.element.createElement(_DashiconSelectorItem2.default, { icon: searchResult, callback: callback });
            })
        )
    );
};

DashiconSelector.propTypes = {
    type: _propTypes2.default.string.isRequired,
    callback: _propTypes2.default.func
};

exports.default = DashiconSelector;

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

/***/ 4726:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _DashiconSelector = __webpack_require__(8172);

var _DashiconSelector2 = _interopRequireDefault(_DashiconSelector);

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _ElementIcon = __webpack_require__(3900);

var _ElementIcon2 = _interopRequireDefault(_ElementIcon);

var _reactHookForm = __webpack_require__(930);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IconPicker = function IconPicker(_ref) {
    var callback = _ref.callback,
        id = _ref.id,
        validate = _ref.validate,
        register = _ref.register,
        description = _ref.description,
        defaultValue = _ref.defaultValue,
        errors = _ref.errors;


    var error = (0, _reactHookForm.get)(errors, id);

    var _useState = (0, _react.useState)(defaultValue),
        _useState2 = _slicedToArray(_useState, 2),
        icon = _useState2[0],
        setIcon = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = _slicedToArray(_useState3, 2),
        modalVisible = _useState4[0],
        setModalVisible = _useState4[1];

    var _useState5 = (0, _react.useState)(null),
        _useState6 = _slicedToArray(_useState5, 2),
        iconPicker = _useState6[0],
        setIconPicker = _useState6[1];

    var handleCallback = function handleCallback(value) {
        setModalVisible(false);
        setIcon(value);
        callback(value);
    };

    (0, _react.useEffect)(function () {
        if (defaultValue !== null) {
            setIcon(defaultValue);
        }
    }, [defaultValue]);

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            {
                title: (0, _useTranslation2.default)("Choose icon"),
                visible: modalVisible,
                testId: id
            },
            wp.element.createElement(
                'div',
                { className: 'text-left' },
                wp.element.createElement(
                    'label',
                    { className: 'form-label', htmlFor: 'icon-picker' },
                    (0, _useTranslation2.default)("Select icon type from the list")
                ),
                wp.element.createElement(
                    'select',
                    {
                        'data-cy': 'select-icon',
                        onChange: function onChange(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            setIconPicker(e.currentTarget.value);
                        },
                        className: 'form-control',
                        id: 'icon-picker'
                    },
                    wp.element.createElement(
                        'option',
                        { value: '' },
                        (0, _useTranslation2.default)("--Select--")
                    ),
                    wp.element.createElement(
                        'option',
                        { value: 'dashicon' },
                        (0, _useTranslation2.default)("Select a Dashicon")
                    ),
                    wp.element.createElement(
                        'option',
                        { value: 'image' },
                        (0, _useTranslation2.default)("Upload an icon image")
                    )
                )
            ),
            iconPicker && wp.element.createElement(
                'div',
                { className: 'mt-8' },
                wp.element.createElement(_DashiconSelector2.default, {
                    type: iconPicker,
                    callback: handleCallback
                })
            )
        ),
        wp.element.createElement(
            'div',
            { className: 'flex-center s-8' },
            icon && wp.element.createElement(_ElementIcon2.default, { value: icon }),
            wp.element.createElement('input', _extends({
                id: id,
                name: id,
                type: 'text',
                'data-cy': 'input-icon',
                value: icon ? icon : '',
                className: 'hidden'
            }, register(id, validate))),
            wp.element.createElement(
                _Button2.default,
                {
                    onClick: function onClick(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        setModalVisible(!modalVisible);
                    },
                    style: _styles.styleVariants.SECONDARY,
                    size: 'sm',
                    testId: id
                },
                (0, _useTranslation2.default)("Choose icon")
            )
        ),
        description && wp.element.createElement(
            'div',
            { className: 'form-description' },
            description
        ),
        error && wp.element.createElement(
            'div',
            { 'data-cy': 'input-error-icon', className: 'invalid-feedback' },
            error.message
        )
    );
};

IconPicker.propTypes = {
    id: _propTypes2.default.string.isRequired,
    defaultValue: _propTypes2.default.string,
    description: _propTypes2.default.string,
    callback: _propTypes2.default.func,
    validate: _propTypes2.default.func,
    register: _propTypes2.default.func.isRequired,
    errors: _propTypes2.default.array.isRequired

};

exports.default = IconPicker;

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

/***/ 9322:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _reactHookForm = __webpack_require__(930);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _styles = __webpack_require__(624);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _StepsHeader = __webpack_require__(5438);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _reactRedux = __webpack_require__(6706);

var _validation = __webpack_require__(9593);

var _strings = __webpack_require__(8029);

var _IconPicker = __webpack_require__(4726);

var _IconPicker2 = _interopRequireDefault(_IconPicker);

var _Checkbox = __webpack_require__(4575);

var _Checkbox2 = _interopRequireDefault(_Checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicStep = function BasicStep(_ref) {
    var title = _ref.title,
        crumbs = _ref.crumbs,
        headings = _ref.headings,
        stepActive = _ref.stepActive,
        setStepActive = _ref.setStepActive,
        handleSubmit = _ref.handleSubmit,
        _ref$edit = _ref.edit,
        edit = _ref$edit === undefined ? false : _ref$edit,
        formValues = _ref.formValues;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchCustomPostTypes;
    }),
        data = _useSelector.data;

    // manage local state


    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        icon = _useState2[0],
        setIcon = _useState2[1];

    var _useState3 = (0, _react.useState)({
        title: true,
        editor: true,
        thumbnail: true,
        excerpt: true,
        author: false,
        trackbacks: false,
        custom_fields: false,
        comments: false,
        revisions: false,
        page_attributes: false,
        post_formats: false
    }),
        _useState4 = _slicedToArray(_useState3, 2),
        supports = _useState4[0],
        setSupports = _useState4[1];

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all'
    }),
        register = _useForm.register,
        submit = _useForm.handleSubmit,
        setValue = _useForm.setValue,
        errors = _useForm.formState.errors;

    (0, _react.useEffect)(function () {
        if (formValues && formValues[1]) {

            setIcon(formValues[1].icon);
            setSupports({
                title: formValues[1].support_0,
                editor: formValues[1].support_1,
                thumbnail: formValues[1].support_2,
                excerpt: formValues[1].support_3,
                author: formValues[1].support_4,
                trackbacks: formValues[1].support_5,
                custom_fields: formValues[1].support_6,
                comments: formValues[1].support_7,
                revisions: formValues[1].support_8,
                page_attributes: formValues[1].support_9,
                post_formats: formValues[1].support_10
            });

            setValue("post_name", formValues[1].post_name);
            setValue("singular_label", formValues[1].singular_label);
            setValue("plural_label", formValues[1].plural_label);
            setValue("icon", formValues[1].icon);
            setValue("support_0", formValues[1].support_0);
            setValue("support_1", formValues[1].support_1);
            setValue("support_2", formValues[1].support_2);
            setValue("support_3", formValues[1].support_3);
            setValue("support_4", formValues[1].support_4);
            setValue("support_5", formValues[1].support_5);
            setValue("support_6", formValues[1].support_6);
            setValue("support_7", formValues[1].support_7);
            setValue("support_8", formValues[1].support_8);
            setValue("support_9", formValues[1].support_9);
            setValue("support_10", formValues[1].support_10);
        }
    }, [formValues]);

    (0, _react.useEffect)(function () {
        if (data.length > 0) {

            setIcon(data[0].icon);
            setSupports({
                title: data[0].supports.includes('title'),
                editor: data[0].supports.includes('editor'),
                thumbnail: data[0].supports.includes('thumbnail'),
                excerpt: data[0].supports.includes('excerpt'),
                author: data[0].supports.includes('author'),
                trackbacks: data[0].supports.includes('trackbacks'),
                custom_fields: data[0].supports.includes('custom-fields'),
                comments: data[0].supports.includes('comments'),
                revisions: data[0].supports.includes('revisions'),
                page_attributes: data[0].supports.includes('page-attributes'),
                post_formats: data[0].supports.includes('post-formats')
            });

            setValue("post_name", data[0].name);
            setValue("singular_label", data[0].singular);
            setValue("plural_label", data[0].plural);
            setValue("icon", data[0].icon);
            setValue("support_0", data[0].supports.includes('title') ? 'title' : false);
            setValue("support_1", data[0].supports.includes('editor') ? 'editor' : false);
            setValue("support_2", data[0].supports.includes('thumbnail') ? 'thumbnail' : false);
            setValue("support_3", data[0].supports.includes('excerpt') ? 'excerpt' : false);
            setValue("support_4", data[0].supports.includes('author') ? 'author' : false);
            setValue("support_5", data[0].supports.includes('trackbacks') ? 'trackbacks' : false);
            setValue("support_6", data[0].supports.includes('custom-fields') ? 'custom-fields' : false);
            setValue("support_7", data[0].supports.includes('comments') ? 'comments' : false);
            setValue("support_8", data[0].supports.includes('revisions') ? 'revisions' : false);
            setValue("support_9", data[0].supports.includes('page-attributes') ? 'page-attributes' : false);
            setValue("support_10", data[0].supports.includes('post-formats') ? 'post-formats' : false);
        }
    }, [data]);

    var handlePostNameChange = function handlePostNameChange(post_name) {
        setValue('post_name', (0, _strings.sluggifyString)(post_name, 20));
    };

    var onSubmit = function onSubmit(data) {
        handleSubmit(data, 1);
        setStepActive(1);
    };

    var actions = [wp.element.createElement(
        _Button2.default,
        {
            testId: "next-step",
            style: _styles.styleVariants.SECONDARY
        },
        (0, _useTranslation2.default)("Next Step")
    )];

    return wp.element.createElement(
        "form",
        { onSubmit: submit(onSubmit) },
        wp.element.createElement(
            _Layout2.default,
            {
                crumbs: crumbs,
                title: title,
                actions: actions
            },
            wp.element.createElement(
                _Card2.default,
                { style: "with-shadow" },
                wp.element.createElement(_StepsHeader2.default, {
                    stepActive: stepActive,
                    headings: headings
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Post name"),
                    value: wp.element.createElement(_Input2.default, {
                        id: "post_name",
                        placeholder: (0, _useTranslation2.default)("Post name"),
                        readOnly: data.length > 0,
                        description: (0, _useTranslation2.default)("The post name/slug. Used for various queries."),
                        onChangeCapture: function onChangeCapture(e) {
                            return handlePostNameChange(e.currentTarget.value);
                        },
                        register: register,
                        errors: errors,
                        isRequired: true,
                        validate: {
                            validate: edit ? _validation.isPostTypeNameValid : _validation.asyncIsPostTypeNameValid,
                            required: (0, _useTranslation2.default)("This field is mandatory")
                        }
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Singular label"),
                    value: wp.element.createElement(_Input2.default, {
                        id: "singular_label",
                        placeholder: (0, _useTranslation2.default)("(e.g. Movie)"),
                        defaultValue: data.length > 0 ? data[0].singular : null,
                        description: (0, _useTranslation2.default)("Used when a singular label is needed"),
                        register: register,
                        errors: errors,
                        isRequired: true,
                        validate: {
                            required: (0, _useTranslation2.default)("This field is mandatory")
                        }
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Plural label"),
                    value: wp.element.createElement(_Input2.default, {
                        id: "plural_label",
                        placeholder: (0, _useTranslation2.default)("(e.g. Movies)"),
                        defaultValue: data.length > 0 ? data[0].plural : null,
                        description: (0, _useTranslation2.default)("Used for the post type admin menu item"),
                        register: register,
                        errors: errors,
                        isRequired: true,
                        validate: {
                            required: (0, _useTranslation2.default)("This field is mandatory")
                        }
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Icon"),
                    value: wp.element.createElement(_IconPicker2.default, {
                        id: "icon",
                        callback: function callback(value) {
                            setValue("icon", value);
                        },
                        defaultValue: icon,
                        register: register,
                        errors: errors,
                        description: (0, _useTranslation2.default)("Displayed on the sidebar of the admin panel"),
                        validate: {
                            required: (0, _useTranslation2.default)("This field is mandatory")
                        }
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Support"),
                    wizard: (0, _useTranslation2.default)("Add support for various available post edit features. For more info") + " <a target='_blank' href='https://developer.wordpress.org/reference/functions/register_post_type/#supports'>" + (0, _useTranslation2.default)("see here") + "<a/>.",
                    value: wp.element.createElement(_Checkbox2.default, {
                        register: register,
                        errors: errors,
                        id: "support",
                        values: {
                            "title": {
                                "value": "title",
                                "checked": supports.title
                            },
                            "editor": {
                                "value": "editor",
                                "checked": supports.editor
                            },
                            "thumbnail": {
                                "value": "thumbnail",
                                "checked": supports.thumbnail
                            },
                            "excerpt": {
                                "value": "excerpt",
                                "checked": supports.excerpt
                            },
                            "author": {
                                "value": "author",
                                "checked": supports.author
                            },
                            "trackbacks": {
                                "value": "trackbacks",
                                "checked": supports.trackbacks
                            },
                            "custom-fields": {
                                "value": "custom-fields",
                                "checked": supports.custom_fields
                            },
                            "comments": {
                                "value": "comments",
                                "checked": supports.comments
                            },
                            "revisions": {
                                "value": "revisions",
                                "checked": supports.revisions
                            },
                            "page-attributes": {
                                "value": "page-attributes",
                                "checked": supports.page_attributes
                            },
                            "post-formats": {
                                "value": "post-formats",
                                "checked": supports.post_formats
                            }
                        }
                    })
                })
            )
        )
    );
};

BasicStep.propTypes = {
    headings: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        label: _propTypes2.default.string.isRequired,
        description: _propTypes2.default.string.isRequired
    })).isRequired,
    title: _propTypes2.default.string.isRequired,
    crumbs: _propTypes2.default.arrayOf(_Button2.default).isRequired,
    stepActive: _propTypes2.default.number.isRequired,
    setStepActive: _propTypes2.default.func.isRequired,
    handleSubmit: _propTypes2.default.func.isRequired,
    formValues: _propTypes2.default.object.isRequired,
    edit: _propTypes2.default.bool
};

exports.default = BasicStep;

/***/ }),

/***/ 9467:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _StepsHeader = __webpack_require__(5438);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _styles = __webpack_require__(624);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

var _reactRedux = __webpack_require__(6706);

var _postLabels = __webpack_require__(5971);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LabelsStep = function LabelsStep(_ref) {
    var title = _ref.title,
        crumbs = _ref.crumbs,
        headings = _ref.headings,
        stepActive = _ref.stepActive,
        setStepActive = _ref.setStepActive,
        handleSubmit = _ref.handleSubmit,
        formValues = _ref.formValues,
        edit = _ref.edit;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchCustomPostTypes;
    }),
        data = _useSelector.data;

    var labels = {};
    if (data.length > 0) {
        labels = data[0].labels;
    }

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all'
    }),
        register = _useForm.register,
        submit = _useForm.handleSubmit,
        errors = _useForm.formState.errors,
        setValue = _useForm.setValue;

    (0, _react.useEffect)(function () {
        if (!edit && formValues && formValues[1]) {
            setValue('menu_name', formValues[1].singular_label);
            setValue('all_items', "" + (0, _useTranslation2.default)("All {{r}}", { r: formValues[1].singular_label }));
            setValue('add_new', (0, _useTranslation2.default)("Add") + " " + formValues[1].singular_label);
            setValue('add_new_item', "" + (0, _useTranslation2.default)("Add new {{r}}", { r: formValues[1].singular_label }));
            setValue('edit_item', (0, _useTranslation2.default)("Edit") + " " + formValues[1].singular_label);
            setValue('new_item', (0, _useTranslation2.default)("New") + " " + formValues[1].singular_label);
            setValue('view_item', (0, _useTranslation2.default)("View") + " " + formValues[1].singular_label);
            setValue('view_items', (0, _useTranslation2.default)("View") + " " + formValues[1].plural_label);
            setValue('search_item', (0, _useTranslation2.default)("Search") + " " + formValues[1].plural_label);
            setValue('not_found', (0, _useTranslation2.default)("No {{r}} found", { r: formValues[1].singular_label }));
            setValue('not_found_in_trash', (0, _useTranslation2.default)("No {{r}} found", { r: formValues[1].singular_label }));
            setValue('parent_item_colon', (0, _useTranslation2.default)("Parent item"));
            setValue('featured_image', (0, _useTranslation2.default)("Featured image"));
            setValue('set_featured_image', (0, _useTranslation2.default)("Set featured image"));
            setValue('remove_featured_image', (0, _useTranslation2.default)("Remove featured image"));
            setValue('use_featured_image', (0, _useTranslation2.default)("Use featured image"));
            setValue('archives', (0, _useTranslation2.default)("Archives"));
            setValue('insert_into_item', (0, _useTranslation2.default)("Insert"));
            setValue('uploaded_to_this_item', (0, _useTranslation2.default)("Upload"));
            setValue('filter_items_list', (0, _useTranslation2.default)("Filter {{r}} list", { r: formValues[1].plural_label }));
            setValue('items_list_navigation', (0, _useTranslation2.default)("Navigation list {{r}}", { r: formValues[1].plural_label }));
            setValue('items_list', (0, _useTranslation2.default)("List {{r}}", { r: formValues[1].plural_label }));
            setValue('filter_by_date', (0, _useTranslation2.default)("Filter by date"));
            setValue('item_published', (0, _useTranslation2.default)("{{r}} published", { r: formValues[1].singular_label }));
            setValue('item_published_privately', (0, _useTranslation2.default)("{{r}} published privately", { r: formValues[1].singular_label }));
            setValue('item_reverted_to_draft', (0, _useTranslation2.default)("{{r}} reverted to draft", { r: formValues[1].singular_label }));
            setValue('item_scheduled', (0, _useTranslation2.default)("{{r}} scheduled", { r: formValues[1].singular_label }));
            setValue('item_updated', (0, _useTranslation2.default)("{{r}} updated", { r: formValues[1].singular_label }));
        }
    }, [formValues]);

    (0, _react.useEffect)(function () {
        if (edit && data.length > 0) {
            setValue('menu_name', labels.menu_name);
            setValue('all_items', labels.all_items);
            setValue('add_new', labels.add_new);
            setValue('add_new_item', labels.add_new_item);
            setValue('edit_item', labels.edit_item);
            setValue('new_item', labels.new_item);
            setValue('view_item', labels.view_item);
            setValue('view_items', labels.view_items);
            setValue('search_item', labels.search_item);
            setValue('not_found', labels.not_found);
            setValue('not_found_in_trash', labels.not_found_in_trash);
            setValue('parent_item_colon', labels.parent_item_colon);
            setValue('featured_image', labels.featured_image);
            setValue('set_featured_image', labels.set_featured_image);
            setValue('remove_featured_image', labels.remove_featured_image);
            setValue('use_featured_image', labels.use_featured_image);
            setValue('archives', labels.archives);
            setValue('insert_into_item', labels.insert_into_item);
            setValue('uploaded_to_this_item', labels.uploaded_to_this_item);
            setValue('filter_items_list', labels.filter_items_list);
            setValue('items_list_navigation', labels.items_list_navigation);
            setValue('items_list', labels.items_list);
            setValue('filter_by_date', labels.filter_by_date);
            setValue('item_published', labels.item_published);
            setValue('item_published_privately', labels.item_published_privately);
            setValue('item_reverted_to_draft', labels.item_reverted_to_draft);
            setValue('item_scheduled', labels.item_scheduled);
            setValue('item_updated', labels.item_updated);
        }
    }, [data]);

    var onSubmit = function onSubmit(data) {
        handleSubmit(data, 2);
        setStepActive(2);
    };

    var actions = [wp.element.createElement(
        _Button2.default,
        { testId: "prev-step", type: "button", onClick: function onClick() {
                return setStepActive(0);
            }, style: _styles.styleVariants.SECONDARY },
        (0, _useTranslation2.default)("Previous Step")
    ), wp.element.createElement(
        _Button2.default,
        { testId: "next-step", style: _styles.styleVariants.SECONDARY },
        (0, _useTranslation2.default)("Next Step")
    )];

    return wp.element.createElement(
        "form",
        { onSubmit: submit(onSubmit) },
        wp.element.createElement(
            _Layout2.default,
            {
                crumbs: crumbs,
                title: title,
                actions: actions
            },
            wp.element.createElement(
                _Card2.default,
                { style: "with-shadow" },
                wp.element.createElement(_StepsHeader2.default, {
                    stepActive: stepActive,
                    headings: headings
                }),
                _postLabels.postLabels.map(function (label) {
                    return wp.element.createElement(_CardRow2.default, {
                        label: label.label,
                        value: wp.element.createElement(_Input2.default, {
                            id: label.id,
                            register: register,
                            description: label.description,
                            errors: errors,
                            isRequired: true,
                            validate: {
                                required: (0, _useTranslation2.default)("This field is mandatory")
                            }
                        })
                    });
                })
            )
        )
    );
};

LabelsStep.propTypes = {
    headings: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        label: _propTypes2.default.string.isRequired,
        description: _propTypes2.default.string.isRequired
    })).isRequired,
    title: _propTypes2.default.string.isRequired,
    crumbs: _propTypes2.default.arrayOf(_Button2.default).isRequired,
    stepActive: _propTypes2.default.number.isRequired,
    setStepActive: _propTypes2.default.func.isRequired,
    handleSubmit: _propTypes2.default.func.isRequired,
    formValues: _propTypes2.default.object.isRequired,
    edit: _propTypes2.default.bool.isRequired
};

exports.default = LabelsStep;

/***/ }),

/***/ 4346:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _styles = __webpack_require__(624);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _StepsHeader = __webpack_require__(5438);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

var _reactRedux = __webpack_require__(6706);

var _Toggle = __webpack_require__(8040);

var _Toggle2 = _interopRequireDefault(_Toggle);

var _validation = __webpack_require__(9593);

var _Boolean = __webpack_require__(7306);

var _Boolean2 = _interopRequireDefault(_Boolean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SettingsStep = function SettingsStep(_ref) {
    var title = _ref.title,
        crumbs = _ref.crumbs,
        headings = _ref.headings,
        stepActive = _ref.stepActive,
        setStepActive = _ref.setStepActive,
        handleSubmit = _ref.handleSubmit,
        formValues = _ref.formValues,
        _ref$isWPGraphQLActiv = _ref.isWPGraphQLActive,
        isWPGraphQLActive = _ref$isWPGraphQLActiv === undefined ? false : _ref$isWPGraphQLActiv,
        _ref$loading = _ref.loading,
        loading = _ref$loading === undefined ? false : _ref$loading;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchCustomPostTypes;
    }),
        data = _useSelector.data;

    // handle form


    var settings = {};
    if (data.length > 0) {
        settings = data[0].settings;
    }

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all',
        defaultValues: {
            public: data.length > 0 ? settings.public : null,
            publicly_queryable: data.length > 0 ? settings.publicly_queryable : null,
            show_ui: data.length > 0 ? settings.show_ui : null,
            show_in_menu: data.length > 0 ? settings.show_in_menu : null,
            show_in_nav_menus: data.length > 0 ? settings.show_in_nav_menus : null,
            show_in_admin_bar: data.length > 0 ? settings.show_in_admin_bar : null,
            show_in_rest: data.length > 0 ? settings.show_in_rest : null,
            rest_base: data.length > 0 ? settings.rest_base : null,
            menu_position: data.length > 0 ? settings.menu_position : null,
            capability_type: data.length > 0 ? settings.capability_type : 'post',
            has_archive: data.length > 0 ? settings.has_archive : null,
            rewrite: data.length > 0 ? settings.rewrite : null,
            custom_rewrite: data.length > 0 ? settings.custom_rewrite : null,
            query_var: data.length > 0 ? settings.query_var : null,
            custom_query_var: data.length > 0 ? settings.custom_query_var : null
        }
    }),
        register = _useForm.register,
        submit = _useForm.handleSubmit,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid,
        setValue = _useForm.setValue,
        watch = _useForm.watch;

    // GRAPHQL Integration


    (0, _react.useEffect)(function () {
        if (formValues) {
            setValue("show_in_graphql", data.length > 0 ? settings.show_in_graphql : true);
            setValue("graphql_single_name", data.length > 0 ? settings.graphql_single_name : formValues[1].singular_label);
            setValue("graphql_plural_name", data.length > 0 ? settings.graphql_plural_name : formValues[1].plural_label);
        }
    }, [formValues]);

    var showInGraphql = watch('show_in_graphql');
    var graphqlSingleName = watch('graphql_single_name');
    var graphqlPluralName = watch('graphql_plural_name');

    var handleGraphQLSingleNameChange = function handleGraphQLSingleNameChange(single_name) {
        if (single_name === graphqlPluralName) {
            return (0, _useTranslation2.default)('Single name MUST be different from plural name');
        }
    };

    var handleGraphQLPluralNameChange = function handleGraphQLPluralNameChange(plural_name) {
        if (plural_name === graphqlSingleName) {
            return (0, _useTranslation2.default)('Different name MUST be different from single name');
        }
    };

    var rewrite = watch("rewrite");
    var query_var = watch("query_var");

    var onSubmit = function onSubmit(data) {
        handleSubmit(data, 3);
    };

    var actions = [wp.element.createElement(
        _Button2.default,
        { testId: "prev-step", type: "button", onClick: function onClick() {
                return setStepActive(1);
            }, style: _styles.styleVariants.SECONDARY },
        (0, _useTranslation2.default)("Previous Step")
    ), wp.element.createElement(
        _Button2.default,
        { testId: "save", style: _styles.styleVariants.PRIMARY, disabled: loading },
        (0, _useTranslation2.default)("Save")
    )];

    return wp.element.createElement(
        "form",
        { onSubmit: submit(onSubmit) },
        wp.element.createElement(
            _Layout2.default,
            {
                crumbs: crumbs,
                title: title,
                actions: actions
            },
            wp.element.createElement(
                _Card2.default,
                { style: "with-shadow" },
                wp.element.createElement(_StepsHeader2.default, {
                    stepActive: stepActive,
                    headings: headings
                }),
                isWPGraphQLActive && wp.element.createElement(
                    _react2.default.Fragment,
                    null,
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("Show in GraphQL"),
                        value: wp.element.createElement(_Toggle2.default, {
                            id: "show_in_graphql",
                            description: (0, _useTranslation2.default)("Show the custom post type in WPGraphQL."),
                            defaultValue: true,
                            register: register,
                            errors: errors
                        })
                    }),
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("GraphQL single name"),
                        value: wp.element.createElement(_Input2.default, {
                            id: "graphql_single_name",
                            register: register,
                            placeholder: (0, _useTranslation2.default)("Ex. movie"),
                            description: (0, _useTranslation2.default)("Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the plural name."),
                            errors: errors,
                            isRequired: showInGraphql,
                            validate: {
                                validate: {
                                    validWPGraphQLName: _validation.validWPGraphQLName,
                                    handleGraphQLSingleNameChange: handleGraphQLSingleNameChange
                                }
                            }
                        })
                    }),
                    wp.element.createElement(_CardRow2.default, {
                        label: (0, _useTranslation2.default)("GraphQL plural name"),
                        value: wp.element.createElement(_Input2.default, {
                            id: "graphql_plural_name",
                            register: register,
                            placeholder: (0, _useTranslation2.default)("Ex. movies"),
                            description: (0, _useTranslation2.default)("Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the single name."),
                            errors: errors,
                            isRequired: showInGraphql,
                            validate: {
                                validate: {
                                    validWPGraphQLName: _validation.validWPGraphQLName,
                                    handleGraphQLSingleNameChange: handleGraphQLSingleNameChange
                                }
                            }
                        })
                    })
                ),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Hierarchical"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "hierarchical",
                        description: (0, _useTranslation2.default)("Whether the post type is hierarchical (e.g. page). Default false."),
                        defaultValue: data.length > 0 ? settings.hierarchical : false,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Is Public"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "public",
                        description: (0, _useTranslation2.default)("Whether a post type is intended for use publicly either via the admin interface or by front-end users."),
                        defaultValue: data.length > 0 ? settings.public : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Publicly queryable"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "publicly_queryable",
                        description: (0, _useTranslation2.default)("Whether queries can be performed on the front end for the post type as part of parse_request()."),
                        defaultValue: data.length > 0 ? settings.publicly_queryable : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in UI"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "show_ui",
                        description: (0, _useTranslation2.default)("Whether to generate and allow a UI for managing this post type in the admin. Default is value of $public."),
                        defaultValue: data.length > 0 ? settings.show_ui : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in menu"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "show_in_menu",
                        description: (0, _useTranslation2.default)("Where to show the post type in the admin menu. To work, $show_ui must be true. If true, the post type is shown in its own top level menu. If false, no menu is shown."),
                        defaultValue: data.length > 0 ? settings.show_in_menu : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in nav menus"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "show_in_nav_menus",
                        description: (0, _useTranslation2.default)("Makes this post type available for selection in navigation menus. Default is value of $public."),
                        defaultValue: data.length > 0 ? settings.show_in_nav_menus : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in admin bar"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "show_in_admin_bar",
                        description: (0, _useTranslation2.default)("Makes this post type available via the admin bar. Default is value of $show_in_menu."),
                        defaultValue: data.length > 0 ? settings.show_in_admin_bar : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in REST API"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "show_in_rest",
                        description: (0, _useTranslation2.default)("Whether to include the post type in the REST API. Set this to true for the post type to be available in the block editor. SET TRUE TO ENABLE GUTEMBERG EDITOR."),
                        defaultValue: data.length > 0 ? settings.show_in_rest : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("REST API base slug"),
                    value: wp.element.createElement(_Input2.default, {
                        id: "rest_base",
                        placeholder: (0, _useTranslation2.default)("REST API base slug"),
                        description: (0, _useTranslation2.default)("To change the base url of REST API route. Default is $post_type."),
                        validate: {
                            maxLength: {
                                value: 255,
                                message: (0, _useTranslation2.default)("max length is 255")
                            }
                        },
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Menu position"),
                    value: wp.element.createElement(_Input2.default, {
                        id: "menu_position",
                        min: "1",
                        max: "100",
                        placeholder: (0, _useTranslation2.default)("Menu position"),
                        description: (0, _useTranslation2.default)("The position in the menu order the post type should appear. To work, $show_in_menu must be true. Default null (at the bottom)."),
                        validate: {
                            min: {
                                value: 1,
                                message: (0, _useTranslation2.default)("min length is") + " 1"
                            },
                            max: {
                                value: 100,
                                message: (0, _useTranslation2.default)("max length is") + " 100"
                            }
                        },
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Capability type"),
                    value: wp.element.createElement(_Input2.default, {
                        id: "capability_type",
                        defaultValue: "post",
                        description: (0, _useTranslation2.default)("The string to use to build the read, edit, and delete capabilities. May be passed as an array to allow for alternative plurals when using this argument as a base to construct the capabilities, e.g. array('story', 'stories'). Default 'post'."),
                        validate: {
                            maxLength: {
                                value: 255,
                                message: "max length is 255"
                            }
                        },
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Has archive"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "has_archive",
                        description: (0, _useTranslation2.default)("Whether there should be post type archives, or if a string, the archive slug to use. Will generate the proper rewrite rules if $rewrite is enabled."),
                        defaultValue: data.length > 0 ? settings.has_archive : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Rewrite"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "rewrite",
                        description: (0, _useTranslation2.default)("Triggers the handling of rewrites for this post type. To prevent rewrite, set to false. Defaults to true, using $post_type as slug. To specify rewrite rules, an array can be passed with any of these keys:"),
                        defaultValue: data.length > 0 ? settings.rewrite : true,
                        register: register,
                        errors: errors
                    })
                }),
                rewrite && wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Custom rewrite rules"),
                    value: wp.element.createElement(_Input2.default, {
                        id: "custom_rewrite",
                        placeholder: (0, _useTranslation2.default)("Custom rewrite rules"),
                        description: (0, _useTranslation2.default)("Custom post type slug to use instead of default."),
                        validate: {
                            maxLength: {
                                value: 255,
                                message: (0, _useTranslation2.default)("max length is 255")
                            }
                        },
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Query var"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: "query_var",
                        description: (0, _useTranslation2.default)("Sets the query_var key for this post type. Defaults to  key. If false, a post type cannot be loaded at ?{query_var}={post_slug}. If specified as a string, the query {post_slug} will be valid."),
                        defaultValue: data.length > 0 ? settings.query_var : true,
                        register: register,
                        errors: errors
                    })
                }),
                query_var && wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Custom query var"),
                    value: wp.element.createElement(_Input2.default, {
                        id: "custom_query_var",
                        placeholder: (0, _useTranslation2.default)("Custom query var"),
                        description: (0, _useTranslation2.default)("Custom query var slug to use instead of default."),
                        validate: {
                            maxLength: {
                                value: 255,
                                message: (0, _useTranslation2.default)("min length is") + " 255"
                            }
                        },
                        register: register,
                        errors: errors
                    })
                })
            )
        )
    );
};

SettingsStep.propTypes = {
    headings: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        label: _propTypes2.default.string.isRequired,
        description: _propTypes2.default.string.isRequired
    })).isRequired,
    title: _propTypes2.default.string.isRequired,
    crumbs: _propTypes2.default.arrayOf(_Button2.default).isRequired,
    stepActive: _propTypes2.default.number.isRequired,
    setStepActive: _propTypes2.default.func.isRequired,
    handleSubmit: _propTypes2.default.func.isRequired,
    formValues: _propTypes2.default.object.isRequired,
    isWPGraphQLActive: _propTypes2.default.bool,
    loading: _propTypes2.default.bool
};

exports.default = SettingsStep;

/***/ }),

/***/ 9876:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(4022);

var _reactRedux = __webpack_require__(6706);

var _Steps = __webpack_require__(3377);

var _Steps2 = _interopRequireDefault(_Steps);

var _BasicStep = __webpack_require__(9322);

var _BasicStep2 = _interopRequireDefault(_BasicStep);

var _LabelsStep = __webpack_require__(9467);

var _LabelsStep2 = _interopRequireDefault(_LabelsStep);

var _SettingsStep = __webpack_require__(4346);

var _SettingsStep2 = _interopRequireDefault(_SettingsStep);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _fetchCustomPostTypesSlice = __webpack_require__(9300);

var _misc = __webpack_require__(3154);

var _scroll = __webpack_require__(2727);

var _ajax = __webpack_require__(7569);

var _saveCustomPostTypeSlice = __webpack_require__(7987);

var _reactHotToast = __webpack_require__(4500);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _ = __webpack_require__(9167);

var _2 = _interopRequireDefault(_);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var SaveCustomPostType = function SaveCustomPostType(_ref) {
    _objectDestructuringEmpty(_ref);

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.saveCustomPostType;
    }),
        loading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchCustomPostTypes;
    }),
        fetchLoading = _useSelector2.loading;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        postType = _useParams.postType;

    var _useParams2 = (0, _reactRouterDom.useParams)(),
        step = _useParams2.step;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        edit = _useState2[0],
        setEdit = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = _slicedToArray(_useState3, 2),
        fetchError = _useState4[0],
        setFetchError = _useState4[1];

    var _useState5 = (0, _react.useState)(step ? parseInt(step) : 0),
        _useState6 = _slicedToArray(_useState5, 2),
        stepActive = _useState6[0],
        setStepActive = _useState6[1];

    var _useState7 = (0, _react.useState)({}),
        _useState8 = _slicedToArray(_useState7, 2),
        formValues = _useState8[0],
        setFormValues = _useState8[1];

    var _useState9 = (0, _react.useState)(false),
        _useState10 = _slicedToArray(_useState9, 2),
        isWPGraphQLActive = _useState10[0],
        setIsWPGraphQLActive = _useState10[1];

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

    (0, _react.useEffect)(function () {
        if (postType) {
            (0, _misc.metaTitle)((0, _useTranslation2.default)("Edit Custom Post Type"));
            setEdit(true);
            dispatch((0, _fetchCustomPostTypesSlice.fetchCustomPostTypes)({
                postType: postType
            })).then(function (res) {

                if (res.payload.length !== 1) {
                    setFetchError(true);
                } else {
                    setFormValues({
                        1: {
                            icon: res.payload[0].icon,
                            plural_label: res.payload[0].plural,
                            post_name: res.payload[0].name,
                            singular_label: res.payload[0].singular,
                            support_0: res.payload[0].supports.includes('title') ? 'title' : false,
                            support_1: res.payload[0].supports.includes('editor') ? 'editor' : false,
                            support_2: res.payload[0].supports.includes('thumbnail') ? 'thumbnail' : false,
                            support_3: res.payload[0].supports.includes('excerpt') ? 'excerpt' : false,
                            support_4: res.payload[0].supports.includes('author') ? 'author' : false,
                            support_5: res.payload[0].supports.includes('trackbacks') ? 'trackbacks' : false,
                            support_6: res.payload[0].supports.includes('custom-fields') ? 'custom-fields' : false,
                            support_7: res.payload[0].supports.includes('comments') ? 'comments' : false,
                            support_8: res.payload[0].supports.includes('revisions') ? 'revisions' : false,
                            support_9: res.payload[0].supports.includes('page-attributes') ? 'page-attributes' : false,
                            support_10: res.payload[0].supports.includes('post-formats') ? 'post-formats' : false

                        },
                        2: res.payload[0].labels,
                        3: res.payload[0].settings
                    });
                }
            }).catch(function (err) {
                setFetchError(true);
                console.error(err);
            });
        } else {
            (0, _misc.metaTitle)((0, _useTranslation2.default)("Register new Post Type"));
        }
    }, []);

    var title = postType ? (0, _useTranslation2.default)("Edit Custom Post Type") : (0, _useTranslation2.default)("Create new Custom Post Type");
    var crumbs = [{
        label: (0, _useTranslation2.default)("Registered Custom Post Types"),
        link: "/"
    }, {
        label: postType ? (0, _useTranslation2.default)("Edit Custom Post Type") : (0, _useTranslation2.default)("Create new Custom Post Type")
    }];

    var headings = [{
        "label": (0, _useTranslation2.default)("Basic"),
        "description": (0, _useTranslation2.default)("Minimum configuration")
    }, {
        "label": (0, _useTranslation2.default)("Labels"),
        "description": (0, _useTranslation2.default)("Additional labels")
    }, {
        "label": (0, _useTranslation2.default)("Settings"),
        "description": (0, _useTranslation2.default)("Other settings")
    }];

    var handleSubmit = function handleSubmit(data, index) {

        formValues[index] = data;
        setFormValues(formValues);
        (0, _scroll.scrollToTop)();

        if (stepActive === 2) {
            dispatch((0, _saveCustomPostTypeSlice.saveCustomPostType)(formValues)).then(function (res) {
                var payload = res.payload;

                if (payload.success) {
                    navigate('/');
                    _reactHotToast.toast.success((0, _useTranslation2.default)("Custom post type successfully saved. The browser will refresh after 5 seconds."));
                    (0, _misc.refreshPage)(5000);
                } else {
                    _reactHotToast.toast.error(payload.error);
                }
            }).catch(function (err) {
                _reactHotToast.toast.error(err);
            });
        }
    };

    if (edit && fetchLoading) {
        return wp.element.createElement(_Loader2.default, null);
    }

    if (fetchError) {
        return wp.element.createElement(_2.default, null);
    }

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(_Steps2.default, {
            steps: [wp.element.createElement(_BasicStep2.default, {
                edit: edit,
                title: title,
                headings: headings,
                crumbs: crumbs,
                stepActive: stepActive,
                setStepActive: setStepActive,
                handleSubmit: handleSubmit,
                formValues: formValues
            }), wp.element.createElement(_LabelsStep2.default, {
                edit: edit,
                title: title,
                headings: headings,
                crumbs: crumbs,
                stepActive: stepActive,
                setStepActive: setStepActive,
                handleSubmit: handleSubmit,
                formValues: formValues
            }), wp.element.createElement(_SettingsStep2.default, {
                title: title,
                headings: headings,
                crumbs: crumbs,
                stepActive: stepActive,
                setStepActive: setStepActive,
                handleSubmit: handleSubmit,
                formValues: formValues,
                isWPGraphQLActive: isWPGraphQLActive,
                loading: loading
            })],
            activeStep: stepActive
        })
    );
};

exports.default = SaveCustomPostType;

/***/ })

}]);
//# sourceMappingURL=876.js.map