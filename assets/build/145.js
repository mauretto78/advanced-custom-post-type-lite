(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[145],{

/***/ 3136:
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

var Badge = function Badge(_ref) {
    var _ref$style = _ref.style,
        style = _ref$style === undefined ? 'default' : _ref$style,
        children = _ref.children;

    return wp.element.createElement(
        'span',
        { className: 'acpt-badge acpt-badge-' + style },
        children
    );
};

Badge.propTypes = {
    style: _propTypes2.default.oneOf(Object.values(_styles.styleVariants)).isRequired
};

exports.default = Badge;

/***/ }),

/***/ 6337:
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

var Button = function Button(_ref) {
    var _ref$style = _ref.style,
        style = _ref$style === undefined ? 'default' : _ref$style,
        _ref$size = _ref.size,
        size = _ref$size === undefined ? 'default' : _ref$size,
        _ref$type = _ref.type,
        type = _ref$type === undefined ? 'submit' : _ref$type,
        onClick = _ref.onClick,
        _ref$disabled = _ref.disabled,
        disabled = _ref$disabled === undefined ? false : _ref$disabled,
        css = _ref.css,
        className = _ref.className,
        children = _ref.children,
        testId = _ref.testId;


    return wp.element.createElement(
        'button',
        {
            style: css,
            type: type,
            onClick: onClick,
            className: 'acpt-btn acpt-btn-' + style + ' acpt-btn-' + size + ' ' + (className ? className : ''),
            disabled: disabled,
            'data-cy': testId ? "button-" + testId : null
        },
        children
    );
};

Button.propTypes = {
    style: _propTypes2.default.oneOf(Object.values(_styles.styleVariants)).isRequired,
    size: _propTypes2.default.oneOf(['default', 'sm', 'xs']),
    css: _propTypes2.default.object,
    onClick: _propTypes2.default.func,
    className: _propTypes2.default.string,
    type: _propTypes2.default.string,
    testId: _propTypes2.default.string,
    disabled: _propTypes2.default.bool
};

exports.default = Button;

/***/ }),

/***/ 624:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var reactSelectStyles = exports.reactSelectStyles = {
    control: function control(base, state) {
        return _extends({}, base, {
            background: state.isDisabled ? '#f8f8f8' : "#fff",
            borderRadius: "4px",
            borderWidth: "1px",
            borderColor: state.isFocused ? "#135e96" : "#ddd",
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
            boxShadow: null,
            "&:hover": {
                borderColor: "#135e96"
            },
            minHeight: "46px"
        });
    },
    dropdownIndicator: function dropdownIndicator(base) {
        return _extends({}, base, {
            color: "#ddd"
        });
    },
    option: function option(styles, state) {
        return _extends({}, styles, {
            backgroundColor: state.isSelected ? '#135e96' : '#fff',
            color: state.isSelected ? '#fff' : '#444',
            cursor: state.isDisabled ? 'not-allowed' : 'pointer',
            "&:hover": {
                backgroundColor: "#ddd"
            }
        });
    },
    valueContainer: function valueContainer(styles, state) {
        return _extends({}, styles, {
            borderColor: state.isFocused ? "#135e96" : "#ddd"
        });
    }
};

var styleVariants = exports.styleVariants = {
    WHITE: 'white',
    DEFAULT: 'default',
    DISABLED: 'disabled',
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    DANGER: 'danger',
    SUCCESS: 'success',
    INFO: 'info',
    WARNING: 'warning'
};

/***/ }),

/***/ 5490:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.useOutsideClick = undefined;

var _react = __webpack_require__(7294);

var useOutsideClick = exports.useOutsideClick = function useOutsideClick(ref, callback) {

    var handleOutsideTitleBoxClick = function handleOutsideTitleBoxClick(e) {
        if (ref && ref.current && !ref.current.contains(e.target)) {
            callback();
        }
    };

    (0, _react.useEffect)(function () {
        document.addEventListener("mousedown", handleOutsideTitleBoxClick);

        return function () {
            document.removeEventListener("mousedown", handleOutsideTitleBoxClick);
        };
    }, [ref]);
};

/***/ }),

/***/ 7759:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(4022);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react3 = __webpack_require__(4226);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Breadcrumb = function Breadcrumb(_ref) {
    var label = _ref.label,
        link = _ref.link,
        isLast = _ref.isLast;


    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            'li',
            { className: isLast ? 'current' : '' },
            link ? wp.element.createElement(
                _reactRouterDom.Link,
                { to: link },
                label
            ) : label
        ),
        !isLast && wp.element.createElement(
            'span',
            { className: 'separator top-2' },
            wp.element.createElement(_react3.Icon, { icon: 'bx:bx-chevron-right', color: '#777', width: '18px' })
        )
    );
};

Breadcrumb.propTypes = {
    label: _propTypes2.default.string.isRequired,
    link: _propTypes2.default.string,
    isLast: _propTypes2.default.bool
};

exports.default = Breadcrumb;

/***/ }),

/***/ 4801:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Breadcrumb = __webpack_require__(7759);

var _Breadcrumb2 = _interopRequireDefault(_Breadcrumb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Breadcrumbs = function Breadcrumbs(_ref) {
    var crumbs = _ref.crumbs;


    var settings = document.globals;

    return wp.element.createElement(
        'div',
        { className: 'acpt-breadcrumbs ' + (settings.globals.is_rtl === true ? 'rtl' : '') },
        crumbs.length > 0 && wp.element.createElement(
            'ul',
            { className: 'i-flex-center s-8' },
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

Breadcrumbs.propTypes = {
    crumbs: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        label: _propTypes2.default.string.isRequired,
        link: _propTypes2.default.string,
        isLast: _propTypes2.default.bool
    })).isRequired
};

exports.default = Breadcrumbs;

/***/ }),

/***/ 3832:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _react3 = __webpack_require__(4226);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _scroll = __webpack_require__(2727);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ScrollToTop = function ScrollToTop() {
    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        visible = _useState2[0],
        setVisible = _useState2[1];

    var toggleVisible = function toggleVisible() {
        var scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true);
        } else if (scrolled <= 300) {
            setVisible(false);
        }
    };

    window.addEventListener('scroll', toggleVisible);

    return wp.element.createElement(
        "div",
        {
            className: "scroll-to-top " + (visible ? 'visible' : 'none'),
            "data-cy": "scroll-to-top"
        },
        wp.element.createElement(
            _Button2.default,
            {
                type: "button",
                className: "with-shadow",
                style: _styles.styleVariants.WHITE,
                onClick: _scroll.scrollToTop
            },
            wp.element.createElement(
                "span",
                { className: "i-flex-center s-8" },
                wp.element.createElement(_react3.Icon, {
                    icon: "bx:up-arrow-alt",
                    size: 24
                }),
                wp.element.createElement(
                    "span",
                    null,
                    (0, _useTranslation2.default)("Scroll to top")
                )
            )
        )
    );
};

exports.default = ScrollToTop;

/***/ }),

/***/ 6369:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Footer = function Footer() {

    return wp.element.createElement(
        "div",
        {
            className: "acpt-footer",
            "data-cy": "acpt-footer"
        },
        (0, _useTranslation2.default)("Copyright"),
        " \xA9 2021 - ",
        new Date().getFullYear(),
        " \xA0",
        wp.element.createElement(
            "a",
            { href: "https://acpt.io", target: "_blank" },
            "ACPT"
        )
    );
};

exports.default = Footer;

/***/ }),

/***/ 7732:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _react3 = __webpack_require__(4226);

var _reactRedux = __webpack_require__(6706);

var _saveSettingsSlice = __webpack_require__(3243);

var _reactHotToast = __webpack_require__(4500);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _misc = __webpack_require__(3154);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LanguageMenu = function LanguageMenu() {

    var settings = document.globals;

    // redux global state

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.saveSettings;
    }),
        loading = _useSelector.loading,
        error = _useSelector.error,
        success = _useSelector.success;

    var dispatch = (0, _reactRedux.useDispatch)();

    // redux local state
    var availableLanguages = settings.globals.available_languages;
    var defaultValue = availableLanguages.filter(function (l) {
        return l.value === settings.globals.language;
    });

    var handleLanguageChange = function handleLanguageChange(language) {
        dispatch((0, _saveSettingsSlice.saveSettings)({ language: language }));
    };

    (0, _react.useEffect)(function () {
        if (!loading && success) {
            _reactHotToast.toast.success((0, _useTranslation2.default)("Settings saved. The browser will refresh after 5 seconds."));
            (0, _misc.refreshPage)(5000);
        }

        if (!loading && error) {
            _reactHotToast.toast.error(error);
        }
    }, [loading]);

    return wp.element.createElement(
        "div",
        { className: "i-flex-center s-4" },
        wp.element.createElement(_react3.Icon, { color: "#007CBA", icon: "mdi:language", width: 24 }),
        wp.element.createElement(
            "div",
            { className: "acpt-select" },
            wp.element.createElement(
                "select",
                {
                    id: "acpt-language",
                    tabIndex: 1,
                    disabled: loading === true,
                    onChangeCapture: function onChangeCapture(e) {
                        return handleLanguageChange(e.target.value);
                    },
                    defaultValue: defaultValue.length === 1 ? defaultValue[0].value : null,
                    className: "form-control"
                },
                availableLanguages.map(function (lang) {
                    return wp.element.createElement(
                        "option",
                        { value: lang.value },
                        lang.label
                    );
                })
            )
        )
    );
};

exports.default = LanguageMenu;

/***/ }),

/***/ 1858:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Logo = function Logo() {
    return wp.element.createElement(
        "div",
        { className: "i-flex-center s-4" },
        wp.element.createElement(
            "svg",
            { width: "35", height: "35", viewBox: "0 0 637 695", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            wp.element.createElement("path", { d: "M270.176 417.485V652.958L66.25 535.222C45.3654 523.164 32.5 500.88 32.5 476.765V241.292L236.426 359.028C257.31 371.086 270.176 393.369 270.176 417.485Z", stroke: "url(#paint0_linear_2042_20)", strokeWidth: "65" }),
            wp.element.createElement("path", { d: "M603.514 241.292L603.514 476.765C603.514 500.88 590.648 523.164 569.764 535.222L365.838 652.958L365.838 417.485C365.838 393.369 378.703 371.086 399.588 359.028L603.514 241.292Z", stroke: "#02C39A", strokeWidth: "65" }),
            wp.element.createElement("path", { d: "M351.426 42.3883L555.352 160.125L351.426 277.862C330.541 289.919 304.81 289.919 283.926 277.862L80 160.125L283.926 42.3883C304.81 30.3305 330.541 30.3305 351.426 42.3883Z", stroke: "#02C39A", strokeWidth: "65" }),
            wp.element.createElement(
                "defs",
                null,
                wp.element.createElement(
                    "linearGradient",
                    { id: "paint0_linear_2042_20", x1: "303", y1: "709", x2: "10", y2: "204", gradientUnits: "userSpaceOnUse" },
                    wp.element.createElement("stop", { stopColor: "#C9FF57" }),
                    wp.element.createElement("stop", { offset: "1", stopColor: "#80E0CC" })
                )
            )
        ),
        wp.element.createElement(
            "svg",
            { className: "hidden-xs", width: "66", height: "19", viewBox: "0 0 458 123", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
            wp.element.createElement("path", { d: "M457.998 1.95825V25.3853H426.192V122H396.951V25.3853H365.145V1.95825H457.998Z", fill: "#111" }),
            wp.element.createElement("path", { d: "M356.42 40.6043C356.42 47.5583 354.824 53.9423 351.632 59.7563C348.44 65.4563 343.538 70.0733 336.926 73.6073C330.314 77.1413 322.106 78.9083 312.302 78.9083H294.176V122H264.935V1.95825H312.302C321.878 1.95825 329.972 3.61125 336.584 6.91725C343.196 10.2232 348.155 14.7833 351.461 20.5973C354.767 26.4113 356.42 33.0803 356.42 40.6043ZM310.079 55.6523C315.665 55.6523 319.826 54.3413 322.562 51.7193C325.298 49.0973 326.666 45.3923 326.666 40.6043C326.666 35.8163 325.298 32.1113 322.562 29.4893C319.826 26.8673 315.665 25.5563 310.079 25.5563H294.176V55.6523H310.079Z", fill: "#111" }),
            wp.element.createElement("path", { d: "M129.722 61.8083C129.722 49.9523 132.287 39.4073 137.417 30.1733C142.547 20.8253 149.672 13.5863 158.792 8.45633C168.026 3.21233 178.457 0.590332 190.085 0.590332C204.335 0.590332 216.533 4.35233 226.679 11.8763C236.825 19.4003 243.608 29.6603 247.028 42.6563H214.88C212.486 37.6403 209.066 33.8213 204.62 31.1993C200.288 28.5773 195.329 27.2663 189.743 27.2663C180.737 27.2663 173.441 30.4013 167.855 36.6713C162.269 42.9413 159.476 51.3203 159.476 61.8083C159.476 72.2963 162.269 80.6753 167.855 86.9453C173.441 93.2153 180.737 96.3503 189.743 96.3503C195.329 96.3503 200.288 95.0393 204.62 92.4173C209.066 89.7953 212.486 85.9763 214.88 80.9603H247.028C243.608 93.9563 236.825 104.216 226.679 111.74C216.533 119.15 204.335 122.855 190.085 122.855C178.457 122.855 168.026 120.29 158.792 115.16C149.672 109.916 142.547 102.677 137.417 93.4433C132.287 84.2093 129.722 73.6643 129.722 61.8083Z", fill: "#111" }),
            wp.element.createElement("path", { d: "M83.3291 100.796H38.5271L31.3451 122H0.736084L44.1701 1.95825H78.0281L121.462 122H90.5111L83.3291 100.796ZM75.8051 78.2243L60.9281 34.2773L46.2221 78.2243H75.8051Z", fill: "#02C39A" })
        ),
        wp.element.createElement(
            "span",
            { className: "top-2" },
            "Lite"
        )
    );
};

exports.default = Logo;

/***/ }),

/***/ 6442:
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

var _reactRouterDom = __webpack_require__(4022);

var _react3 = __webpack_require__(4226);

var _useOutsideClick = __webpack_require__(5490);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PluginMenu = function PluginMenu() {

    // global settings
    var settings = document.globals;

    // local settings

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isVisible = _useState2[0],
        setIsVisible = _useState2[1];

    var node = (0, _react.useRef)();

    (0, _useOutsideClick.useOutsideClick)(node, function () {
        setIsVisible(false);
    });

    return wp.element.createElement(
        "div",
        { className: "relative" },
        wp.element.createElement(
            "a",
            {
                "data-cy": "button-plugin-menu",
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    setIsVisible(!isVisible);
                }
            },
            wp.element.createElement(_react3.Icon, { icon: "bx:menu-alt-right", color: "#777", width: 24 })
        ),
        wp.element.createElement(
            "nav",
            {
                "data-cy": "plugin-menu",
                ref: node,
                className: "acpt-nav " + (isVisible ? 'visible' : '') + " " + (settings.globals.is_rtl ? 'rtl' : '')
            },
            wp.element.createElement(
                "a",
                { href: "https://docs.acpt.io", target: "_blank" },
                (0, _useTranslation2.default)("Documentation")
            ),
            wp.element.createElement(
                "a",
                { href: "https://wordpress.org/plugins/acpt-lite/#developers", target: "_blank" },
                (0, _useTranslation2.default)("Changelog")
            ),
            wp.element.createElement(
                "a",
                { href: "https://wordpress.org/plugins/acpt-lite/#reviews", target: "_blank" },
                (0, _useTranslation2.default)("Rate this plugin")
            ),
            wp.element.createElement(
                "a",
                { className: "facebook", href: "https://www.facebook.com/groups/880817719861018", target: "_blank" },
                (0, _useTranslation2.default)("Facebook group")
            ),
            wp.element.createElement(
                "a",
                { className: "color-danger", href: "https://acpt.io/checkout/", target: "_blank" },
                (0, _useTranslation2.default)("Upgrade to PRO")
            )
        )
    );
};

exports.default = PluginMenu;

/***/ }),

/***/ 4511:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Badge = __webpack_require__(3136);

var _Badge2 = _interopRequireDefault(_Badge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VersionBadge = function VersionBadge() {

    var settings = document.globals;

    return wp.element.createElement(
        "div",
        { className: "hidden-xs top-2" },
        wp.element.createElement(
            _Badge2.default,
            { style: "success" },
            settings.globals.plugin_version
        )
    );
};

exports.default = VersionBadge;

/***/ }),

/***/ 4348:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Logo = __webpack_require__(1858);

var _Logo2 = _interopRequireDefault(_Logo);

var _VersionBadge = __webpack_require__(4511);

var _VersionBadge2 = _interopRequireDefault(_VersionBadge);

var _LanguageMenu = __webpack_require__(7732);

var _LanguageMenu2 = _interopRequireDefault(_LanguageMenu);

var _PluginMenu = __webpack_require__(6442);

var _PluginMenu2 = _interopRequireDefault(_PluginMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Header = function Header(_ref) {
    var title = _ref.title,
        actions = _ref.actions;


    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            'div',
            { className: 'acpt-header-top flex-between' },
            wp.element.createElement(
                'div',
                { className: 'i-flex-center s-8' },
                wp.element.createElement(_Logo2.default, null),
                wp.element.createElement(_VersionBadge2.default, null)
            ),
            wp.element.createElement(
                'div',
                { className: 'i-flex-center s-8' },
                wp.element.createElement(_LanguageMenu2.default, null),
                wp.element.createElement(_PluginMenu2.default, null)
            )
        ),
        wp.element.createElement(
            'div',
            { className: 'acpt-header-bottom flex-between for-xs' },
            wp.element.createElement(
                'h1',
                null,
                title
            ),
            actions && wp.element.createElement(
                'div',
                { className: 'i-flex-center s-8 for-xs' },
                actions.map(function (action) {
                    return action;
                })
            )
        )
    );
};

Header.propTypes = {
    title: _propTypes2.default.string.isRequired,
    actions: _propTypes2.default.element
};

exports.default = Header;

/***/ }),

/***/ 145:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Header = __webpack_require__(4348);

var _Header2 = _interopRequireDefault(_Header);

var _Footer = __webpack_require__(6369);

var _Footer2 = _interopRequireDefault(_Footer);

var _Breadcrumbs = __webpack_require__(4801);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _ScrollToTop = __webpack_require__(3832);

var _ScrollToTop2 = _interopRequireDefault(_ScrollToTop);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Layout = function Layout(_ref) {
    var title = _ref.title,
        actions = _ref.actions,
        crumbs = _ref.crumbs,
        children = _ref.children;


    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(_Header2.default, { title: title, actions: actions }),
        wp.element.createElement(
            "div",
            { className: "acpt-main" },
            wp.element.createElement(
                "div",
                { className: "acpt-main-wrapper" },
                wp.element.createElement(_Breadcrumbs2.default, { crumbs: crumbs }),
                children
            ),
            wp.element.createElement(_Footer2.default, null)
        ),
        wp.element.createElement(_ScrollToTop2.default, null)
    );
};

Layout.propTypes = {
    title: _propTypes2.default.string.isRequired,
    actions: _propTypes2.default.arrayOf(_Button2.default),
    crumbs: _propTypes2.default.arrayOf(_propTypes2.default.shape({
        label: _propTypes2.default.string.isRequired,
        link: _propTypes2.default.string,
        isLast: _propTypes2.default.bool
    })).isRequired
};

exports.default = Layout;

/***/ }),

/***/ 3154:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
/**
 *
 * @param text
 */
var copyToTheClipboard = exports.copyToTheClipboard = function copyToTheClipboard(text) {

    // text.select();
    // text.setSelectionRange(0, 99999);

    console.log('\'copied ' + text + ' to clipboard\'');
    navigator.clipboard.writeText(text);
};

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

var delay = exports.delay = function delay(time) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, time);
    });
};

/***/ }),

/***/ 2727:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var scrollToTop = exports.scrollToTop = function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

var scrollToBottom = exports.scrollToBottom = function scrollToBottom() {
    window.scrollTo({ top: document.body.scrollHeight + 120, behavior: 'smooth' });
};

var scrollToTargetId = exports.scrollToTargetId = function scrollToTargetId(id) {
    var element = document.getElementById(id);
    element.scrollIntoView({ behavior: 'smooth' }, true);
};

var scrollToId = exports.scrollToId = function scrollToId(id) {
    var yOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -230;


    var element = document.getElementById(id);

    if (element) {
        var y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
    }
};

/***/ })

}]);
//# sourceMappingURL=145.js.map