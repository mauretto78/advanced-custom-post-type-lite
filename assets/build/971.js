(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[971],{

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

/***/ 740:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Badge = __webpack_require__(3136);

var _Badge2 = _interopRequireDefault(_Badge);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ElementTypeBadge = function ElementTypeBadge(_ref) {
    var element = _ref.element;


    var variant = void 0;
    var label = void 0;

    if (element.id === 'user_meta') {
        variant = _styles.styleVariants.DANGER;
        label = (0, _useTranslation2.default)("User");
    } else if (element.children) {
        variant = element.children.length > 0 || element.parentId === null ? _styles.styleVariants.SECONDARY : _styles.styleVariants.WARNING;
        label = (0, _useTranslation2.default)(element.children.length > 0 || element.parentId === null ? "Parent" : "Child");
    } else if (element.isNative) {
        variant = _styles.styleVariants.SECONDARY;
        label = (0, _useTranslation2.default)("Native");
    } else if (element.isWooCommerce) {
        variant = _styles.styleVariants.INFO;
        label = "WooCommerce";
    } else {
        variant = _styles.styleVariants.WARNING;
        label = (0, _useTranslation2.default)('Custom');
    }

    return wp.element.createElement(
        _Badge2.default,
        { style: variant },
        label
    );
};

ElementTypeBadge.propTypes = {
    element: _propTypes2.default.object.isRequired
};

exports.default = ElementTypeBadge;

/***/ }),

/***/ 4877:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react3 = __webpack_require__(4226);

var _reactTooltip = __webpack_require__(461);

__webpack_require__(4595);

var _strings = __webpack_require__(8029);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Tooltip = function Tooltip(_ref) {
    var label = _ref.label,
        tip = _ref.tip,
        _ref$icon = _ref.icon,
        icon = _ref$icon === undefined ? true : _ref$icon;


    var id = "tooltip_" + (0, _strings.randomAlphabeticString)();

    return wp.element.createElement(
        'span',
        { className: 'acpt-tooltip' },
        wp.element.createElement(
            'span',
            {
                className: 'i-flex-center s-8 cursor-help',
                'data-tooltip-id': id,
                'data-tooltip-content': tip,
                'data-tooltip-place': 'top'
            },
            wp.element.createElement(
                'div',
                { className: 'acpt-tooltip-label' },
                label
            ),
            icon && wp.element.createElement(
                'div',
                { className: 'acpt-tooltip-help top-2' },
                wp.element.createElement(_react3.Icon, { icon: 'bx:help-circle', color: '#007CBA', width: '18px' })
            )
        ),
        wp.element.createElement(_reactTooltip.Tooltip, {
            id: id,
            style: {
                backgroundColor: "#777",
                color: "#fff"
            }
        })
    );
};

Tooltip.propTypes = {
    label: _propTypes2.default.string.isRequired,
    tip: _propTypes2.default.element.isRequired,
    icon: _propTypes2.default.bool
};

exports.default = Tooltip;

/***/ }),

/***/ 6522:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ElementTypeBadge = __webpack_require__(740);

var _ElementTypeBadge2 = _interopRequireDefault(_ElementTypeBadge);

var _reactRedux = __webpack_require__(6706);

var _assocPostTypeToTaxonomySlice = __webpack_require__(7274);

var _reactHotToast = __webpack_require__(4500);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssocCustomPostTypeToTaxonomyElement = function AssocCustomPostTypeToTaxonomyElement(_ref) {
    var record = _ref.record,
        taxonomy = _ref.taxonomy,
        defaultChecked = _ref.defaultChecked;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var handleOnChange = function handleOnChange(element) {
        dispatch((0, _assocPostTypeToTaxonomySlice.assocPostTypeToTaxonomy)({ taxonomy: taxonomy, postTypes: [element] })).then(function (res) {

            var payload = res.payload;

            if (payload.success) {
                _reactHotToast.toast.success((0, _useTranslation2.default)("Taxonomy was associated to selected Custom post types"));
            }

            if (payload.error) {
                _reactHotToast.toast.error(error);
            }
        }).catch(function (err) {
            return console.error(err);
        });
    };

    return wp.element.createElement(
        'tr',
        null,
        wp.element.createElement(
            'td',
            null,
            record.name
        ),
        wp.element.createElement(
            'td',
            null,
            wp.element.createElement(_ElementTypeBadge2.default, { element: record })
        ),
        wp.element.createElement(
            'td',
            null,
            record.singular
        ),
        wp.element.createElement(
            'td',
            null,
            record.plural
        ),
        wp.element.createElement(
            'td',
            null,
            wp.element.createElement(
                'label',
                {
                    'data-cy': 'assoc-' + record.name + '-to-' + taxonomy,
                    className: 'checkbox',
                    htmlFor: record.id
                },
                wp.element.createElement('input', {
                    id: record.id,
                    type: 'checkbox',
                    defaultChecked: defaultChecked,
                    onChange: function onChange(e) {
                        return handleOnChange({
                            id: record.id,
                            checked: e.target.checked
                        });
                    }
                }),
                wp.element.createElement('span', null)
            )
        )
    );
};

AssocCustomPostTypeToTaxonomyElement.propTypes = {
    taxonomy: _propTypes2.default.string.isRequired,
    record: _propTypes2.default.object.isRequired,
    defaultChecked: _propTypes2.default.bool.isRequired
};

exports.default = AssocCustomPostTypeToTaxonomyElement;

/***/ }),

/***/ 4944:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(6706);

var _reactRouterDom = __webpack_require__(4022);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _misc = __webpack_require__(3154);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _fetchTaxonomiesSlice = __webpack_require__(7176);

var _fetchCustomPostTypesSlice = __webpack_require__(9300);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _styles = __webpack_require__(624);

var _objects = __webpack_require__(4040);

var _AssocCustomPostTypeToTaxonomyElement = __webpack_require__(6522);

var _AssocCustomPostTypeToTaxonomyElement2 = _interopRequireDefault(_AssocCustomPostTypeToTaxonomyElement);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _ButtonLink = __webpack_require__(4545);

var _ButtonLink2 = _interopRequireDefault(_ButtonLink);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AssocCustomPostTypeToTaxonomy = function AssocCustomPostTypeToTaxonomy() {

    var documentGlobals = document.globals;
    var settings = documentGlobals.settings;
    var globals = documentGlobals.globals;

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomies;
    }),
        fetchedTaxonomies = _useSelector.data,
        loadingTaxonomies = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchCustomPostTypes;
    }),
        fetchedPosts = _useSelector2.data,
        loadingPosts = _useSelector2.loading;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        taxonomy = _useParams.taxonomy;

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _useTranslation2.default)((0, _useTranslation2.default)("Associate custom post types to") + " " + taxonomy));
        dispatch((0, _fetchTaxonomiesSlice.fetchTaxonomies)({
            taxonomy: taxonomy
        }));
        dispatch((0, _fetchCustomPostTypesSlice.fetchCustomPostTypes)());
    }, []);

    if (loadingTaxonomies && loadingPosts) {
        return wp.element.createElement(_Loader2.default, null);
    }

    var actions = [wp.element.createElement(
        _ButtonLink2.default,
        { style: _styles.styleVariants.PRIMARY, to: "/register_taxonomy" },
        (0, _useTranslation2.default)("Register new Taxonomy")
    )];

    return wp.element.createElement(
        _Layout2.default,
        {
            title: (0, _useTranslation2.default)((0, _useTranslation2.default)("Associate custom post types to") + " " + taxonomy),
            actions: actions,
            crumbs: [{
                label: (0, _useTranslation2.default)("Registered Taxonomies"),
                link: "/taxonomies"
            }, {
                label: taxonomy,
                link: "/view_taxonomy/" + taxonomy
            }, {
                label: (0, _useTranslation2.default)("Associate custom post types to") + " " + taxonomy
            }]
        },
        fetchedTaxonomies.length > 0 && fetchedPosts.records && fetchedPosts.records.length > 0 ? wp.element.createElement(
            "div",
            { className: "responsive" },
            wp.element.createElement(
                "table",
                { className: "acpt-table with-shadow " + (globals.is_rtl ? 'rtl' : '') },
                wp.element.createElement(
                    "thead",
                    null,
                    wp.element.createElement(
                        "tr",
                        null,
                        wp.element.createElement(
                            "th",
                            null,
                            (0, _useTranslation2.default)("Name")
                        ),
                        wp.element.createElement(
                            "th",
                            null,
                            (0, _useTranslation2.default)("Type")
                        ),
                        wp.element.createElement(
                            "th",
                            null,
                            wp.element.createElement(_Tooltip2.default, {
                                tip: (0, _useTranslation2.default)("Singular label. Used when a singular label is needed"),
                                label: (0, _useTranslation2.default)("Singular")
                            })
                        ),
                        wp.element.createElement(
                            "th",
                            null,
                            wp.element.createElement(_Tooltip2.default, {
                                tip: (0, _useTranslation2.default)("Plural label. Used for the taxonomy admin menu item"),
                                label: (0, _useTranslation2.default)("Plural")
                            })
                        ),
                        wp.element.createElement(
                            "th",
                            null,
                            (0, _useTranslation2.default)("Associate")
                        )
                    )
                ),
                wp.element.createElement(
                    "tbody",
                    null,
                    fetchedPosts.records && fetchedPosts.records.map(function (record) {
                        return wp.element.createElement(_AssocCustomPostTypeToTaxonomyElement2.default, {
                            record: record,
                            key: record.id,
                            taxonomy: taxonomy,
                            defaultChecked: !(0, _objects.isEmpty)((0, _objects.filterById)(fetchedTaxonomies[0].customPostTypes, record.id))
                        });
                    })
                )
            )
        ) : wp.element.createElement(
            _Alert2.default,
            { style: _styles.styleVariants.SECONDARY },
            (0, _useTranslation2.default)("No custom post type found."),
            " ",
            wp.element.createElement(
                _reactRouterDom.Link,
                { to: "/register" },
                (0, _useTranslation2.default)("Register the first one")
            ),
            "!"
        )
    );
};

exports.default = AssocCustomPostTypeToTaxonomy;

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
//# sourceMappingURL=971.js.map