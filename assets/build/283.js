(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[283],{

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

/***/ 7975:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Sortable = __webpack_require__(91);

var _MiniNavMap = __webpack_require__(2632);

var _MiniNavMap2 = _interopRequireDefault(_MiniNavMap);

var _reactRedux = __webpack_require__(4494);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Meta = function Meta(_ref) {
    var boxes = _ref.boxes,
        onSortEnd = _ref.onSortEnd,
        values = _ref.values;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchMetaReducer;
    }),
        fetchedMeta = _useSelector.fetched;

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        boxes.length > 0 ? wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(
                "div",
                { className: "acpt-meta-wrapper" },
                wp.element.createElement(
                    "div",
                    { className: "acpt-meta-list-wrapper" },
                    wp.element.createElement(_Sortable.SortableList, {
                        items: boxes,
                        onSortEnd: onSortEnd,
                        useDragHandle: true,
                        lockAxis: "y",
                        helperClass: "dragging-helper-class",
                        disableAutoscroll: false,
                        useWindowAsScrollContainer: true
                    })
                ),
                wp.element.createElement(_MiniNavMap2.default, { values: values })
            )
        ) : wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(
                "div",
                { className: "acpt-alert acpt-alert-warning" },
                "No meta box already created. Create the first one now by clicking the button \"Add meta box\"!"
            )
        )
    );
};

exports.default = Meta;

/***/ }),

/***/ 6824:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _react3 = __webpack_require__(6229);

var _scroll = __webpack_require__(2727);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MiniNavMapElement = function MiniNavMapElement(_ref) {
    var value = _ref.value,
        isActiveId = _ref.isActiveId,
        setActiveId = _ref.setActiveId;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isClosed = _useState2[0],
        setClosed = _useState2[1];

    return wp.element.createElement(
        "div",
        { className: "mini-map-element" },
        wp.element.createElement(
            "div",
            { className: "box" },
            wp.element.createElement(
                "a",
                { href: "#",
                    onClick: function onClick(e) {
                        e.preventDefault();
                        setClosed(!isClosed);
                    }
                },
                wp.element.createElement(_react3.Icon, { icon: "bx:bx-chevron-" + (isClosed ? 'up' : 'down'), width: "18px" })
            ),
            wp.element.createElement(
                "a",
                {
                    href: "#",
                    className: "title " + (isActiveId === value.id ? 'active' : ''),
                    onClick: function onClick(e) {
                        e.preventDefault();
                        (0, _scroll.scrollToId)(value.id);
                        setActiveId(value.id);
                    } },
                value.title ? value.title : value.name
            )
        ),
        value.fields && value.fields.length > 0 && wp.element.createElement(
            "ul",
            { className: isClosed ? 'closed' : 'open' },
            value.fields.map(function (field, index) {
                return wp.element.createElement(
                    "li",
                    { className: field.parentId ? 'is-child' : '', key: index },
                    wp.element.createElement(
                        "a",
                        {
                            href: "#",
                            className: isActiveId === field.id ? 'active' : '',
                            onClick: function onClick(e) {
                                e.preventDefault();
                                (0, _scroll.scrollToId)(field.id);
                                setActiveId(value.id);
                            }
                        },
                        field.name
                    )
                );
            })
        )
    );
};

exports.default = MiniNavMapElement;

/***/ }),

/***/ 2632:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _MiniNavMapElement = __webpack_require__(6824);

var _MiniNavMapElement2 = _interopRequireDefault(_MiniNavMapElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MiniNavMap = function MiniNavMap(_ref) {
    var values = _ref.values;

    // manage local state
    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        isActiveId = _useState2[0],
        setActiveId = _useState2[1];

    if (values.length === 0) {
        return null;
    }

    // scroll handling
    (0, _react.useEffect)(function () {

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting === true) {
                    setActiveId(entry.target.id);
                }
            });
        }, { threshold: [1] });

        values.map(function (value) {
            if (document.getElementById(value.id)) {
                observer.observe(document.getElementById(value.id));

                value.fields && value.fields.map(function (field) {
                    if (document.getElementById(field.id)) {
                        observer.observe(document.getElementById(field.id));
                    }
                });
            }
        });
    }, []);

    return wp.element.createElement(
        "div",
        { className: "acpt-mini-map" },
        wp.element.createElement(
            "h4",
            null,
            "Quick navigation"
        ),
        values.map(function (value, index) {
            return wp.element.createElement(_MiniNavMapElement2.default, {
                value: value,
                key: index,
                isActiveId: isActiveId,
                setActiveId: setActiveId
            });
        })
    );
};

exports.default = MiniNavMap;

/***/ }),

/***/ 9755:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useUnsavedChangesWarning = function useUnsavedChangesWarning() {
    var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "Are you sure want to discard changes?";

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        isDirty = _useState2[0],
        setDirty = _useState2[1];

    (0, _react.useEffect)(function () {
        //Detecting browser closing
        window.onbeforeunload = isDirty && function () {
            return message;
        };

        return function () {
            window.onbeforeunload = null;
        };
    }, [isDirty]);

    var routerPrompt = wp.element.createElement(_reactRouterDom.Prompt, { when: isDirty, message: message });

    return [routerPrompt, function () {
        return setDirty(true);
    }, function () {
        return setDirty(false);
    }, isDirty];
};

exports.default = useUnsavedChangesWarning;

/***/ }),

/***/ 7209:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.deleteAllMeta = undefined;

var _ajax = __webpack_require__(7569);

var _metaStateActions = __webpack_require__(8527);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var deleteAllMeta = exports.deleteAllMeta = function deleteAllMeta(belongsTo, find) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _metaStateActions.deleteAllInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)("deleteMetaAction", { belongsTo: belongsTo, find: find });

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _metaStateActions.deleteAllSuccess)()) : dispatch((0, _metaStateActions.deleteAllFailure)(res.error));
                            _context.next = 12;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);
                            dispatch((0, _metaStateActions.deleteAllFailure)(_context.t0));

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

/***/ 4553:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchMeta = undefined;

var _ajax = __webpack_require__(7569);

var _fetchMetaActions = __webpack_require__(6456);

var _metaStateActions = __webpack_require__(8527);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchMeta = exports.fetchMeta = function fetchMeta(belongsTo, find, metaFieldId) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchMetaActions.fetchMetaInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchMetaAction', { belongsTo: belongsTo, find: find, metaFieldId: metaFieldId });

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchMetaActions.fetchMetaSuccess)(fetched));
                            dispatch((0, _metaStateActions.hydrateValues)(fetched));
                            _context.next = 12;
                            break;

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchMetaActions.fetchMetaFailure)(_context.t0));

                        case 12:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined, [[0, 9]]);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }();
};

/***/ }),

/***/ 4717:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.metaSubmit = undefined;

var _ajax = __webpack_require__(7569);

var _metaStateActions = __webpack_require__(8527);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var metaSubmit = exports.metaSubmit = function metaSubmit(data) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _metaStateActions.submitInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)("saveMetaAction", data);

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _metaStateActions.submitSuccess)()) : dispatch((0, _metaStateActions.submitFailure)(res.error));
                            _context.next = 12;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);
                            dispatch((0, _metaStateActions.submitFailure)(_context.t0));

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
    var yOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -130;


    var element = document.getElementById(id);
    var y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
};

/***/ })

}]);
//# sourceMappingURL=283.js.map