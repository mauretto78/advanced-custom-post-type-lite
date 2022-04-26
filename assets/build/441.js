(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[441],{

/***/ 1441:
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

var _reactRouterDom = __webpack_require__(3727);

var _reactRedux = __webpack_require__(4494);

var _useUnsavedChangesWarning = __webpack_require__(9755);

var _useUnsavedChangesWarning2 = _interopRequireDefault(_useUnsavedChangesWarning);

var _misc = __webpack_require__(3154);

var _reactSortableHoc = __webpack_require__(3350);

var _reactToastify = __webpack_require__(9249);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _fetchUserMeta = __webpack_require__(1307);

var _userMetaStateActions = __webpack_require__(8616);

var _deleteAllUserMeta = __webpack_require__(3022);

var _react3 = __webpack_require__(6229);

var _Sortable = __webpack_require__(91);

var _userMetaSubmit = __webpack_require__(4033);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserMeta = function UserMeta() {

    // manage global state
    var _useParams = (0, _reactRouterDom.useParams)(),
        postType = _useParams.postType;

    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.userMetaStateReducer;
    }),
        boxes = _useSelector.boxes,
        values = _useSelector.values,
        isSaved = _useSelector.isSaved,
        isValid = _useSelector.isValid,
        saveLoading = _useSelector.loading,
        saveErrors = _useSelector.errors,
        success = _useSelector.success;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchUserMetaReducer;
    }),
        loading = _useSelector2.loading,
        fetched = _useSelector2.fetched;

    // manage local state


    var didMountRef = (0, _react.useRef)(false);

    var _useUnsavedChangesWar = (0, _useUnsavedChangesWarning2.default)(),
        _useUnsavedChangesWar2 = _slicedToArray(_useUnsavedChangesWar, 3),
        Prompt = _useUnsavedChangesWar2[0],
        setDirty = _useUnsavedChangesWar2[1],
        setPristine = _useUnsavedChangesWar2[2];

    // manage redirect


    var history = (0, _reactRouterDom.useHistory)();

    // set page meta title
    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)("ACPT - User meta" + (isSaved ? '' : '*'));
        (0, _misc.changeCurrentAdminMenuLink)('#/user-meta');
        if (!isSaved) {
            setDirty();
        }
    }, [isSaved]);

    // fetching data and
    // populate the UI
    (0, _react.useEffect)(function () {
        dispatch((0, _fetchUserMeta.fetchUserMeta)());
    }, [saveLoading]);

    // sortable
    var onSortEnd = function onSortEnd(_ref) {
        var oldIndex = _ref.oldIndex,
            newIndex = _ref.newIndex;

        dispatch((0, _userMetaStateActions.setUserMetaBoxes)((0, _reactSortableHoc.arrayMove)(boxes, oldIndex, newIndex)));
    };

    // handle data submit
    var handleSubmit = function handleSubmit() {
        dispatch((0, _userMetaSubmit.userMetaSubmit)(values));
        dispatch((0, _userMetaStateActions.setUserMetaStatusSaved)());
        setPristine();
    };

    var handleDeleteAll = function handleDeleteAll() {
        dispatch((0, _deleteAllUserMeta.deleteAllUserMeta)());
        dispatch((0, _userMetaStateActions.setUserMetaStatusSaved)());
        setPristine();
    };

    // handle form submission outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!saveLoading) {
                if (success) {
                    setPristine();
                    _reactToastify.toast.success("User meta successfully saved");
                }

                if (saveErrors.length > 0) {
                    saveErrors.map(function (error) {
                        _reactToastify.toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [saveLoading]);

    if (loading) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    return wp.element.createElement(
        "div",
        null,
        wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                label: "Registered Custom Post Types",
                link: "/"
            }, {
                label: "Manage User Meta"
            }] }),
        Prompt,
        wp.element.createElement(
            "h1",
            { className: "acpt-title vertical-center" },
            wp.element.createElement(_react3.Icon, { icon: "bx:bx-user", color: "#02c39a", width: "24px" }),
            "\xA0 User meta boxes"
        ),
        wp.element.createElement(
            "div",
            { className: "acpt-buttons" },
            wp.element.createElement(
                "a",
                {
                    href: "#",
                    onClick: function onClick(e) {
                        e.preventDefault();
                        dispatch((0, _userMetaStateActions.createUserMetaBox)());
                    },
                    className: "acpt-btn acpt-btn-primary-o"
                },
                wp.element.createElement(_react3.Icon, { icon: "bx:bx-plus-circle", width: "24px" }),
                "\xA0 Add meta box"
            )
        ),
        boxes.length > 0 ? wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(_Sortable.SortableList, {
                items: boxes,
                onSortEnd: onSortEnd,
                useDragHandle: true,
                lockAxis: "y",
                helperClass: "dragging-helper-class",
                disableAutoscroll: false,
                useWindowAsScrollContainer: true
            }),
            wp.element.createElement(
                "div",
                { className: "acpt-buttons" },
                wp.element.createElement(
                    "a",
                    {
                        href: "#",
                        onClick: function onClick(e) {
                            e.preventDefault();
                            dispatch((0, _userMetaStateActions.createUserMetaBox)());
                        },
                        className: "acpt-btn acpt-btn-primary-o"
                    },
                    wp.element.createElement(_react3.Icon, { icon: "bx:bx-plus-circle", width: "24px" }),
                    "\xA0 Add meta box"
                )
            ),
            wp.element.createElement(
                "div",
                { className: "acpt-card__footer" },
                wp.element.createElement(
                    "div",
                    { className: "acpt-card__inner" },
                    wp.element.createElement(
                        "button",
                        {
                            disabled: !isValid,
                            onClick: function onClick(e) {
                                e.preventDefault();
                                handleSubmit();
                            },
                            type: "submit",
                            className: "acpt-btn acpt-btn-primary submit"
                        },
                        wp.element.createElement(_react3.Icon, { icon: "bx:bx-save", width: "24px" }),
                        "\xA0 Save"
                    ),
                    "\xA0",
                    wp.element.createElement(
                        "button",
                        {
                            onClick: function onClick(e) {
                                e.preventDefault();
                                handleDeleteAll();
                            },
                            type: "submit",
                            className: "acpt-btn acpt-btn-danger submit"
                        },
                        wp.element.createElement(_react3.Icon, { icon: "bx:bx-trash", width: "24px" }),
                        "\xA0 Delete all"
                    )
                )
            )
        ) : wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(
                "div",
                { className: "" },
                "No meta box already created. Create the first one now by clicking the button \"Add meta box\"!"
            ),
            fetched.length > 0 && wp.element.createElement(
                "button",
                {
                    onClick: function onClick(e) {
                        e.preventDefault();
                        handleDeleteAll();
                    },
                    type: "submit",
                    className: "acpt-btn acpt-btn-danger submit"
                },
                wp.element.createElement(_react3.Icon, { icon: "bx:bx-trash", width: "24px" }),
                "\xA0 Delete all"
            )
        )
    );
};

exports.default = UserMeta;

/***/ }),

/***/ 3022:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.deleteAllUserMeta = undefined;

var _ajax = __webpack_require__(7569);

var _userMetaStateActions = __webpack_require__(8616);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var deleteAllUserMeta = exports.deleteAllUserMeta = function deleteAllUserMeta() {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _userMetaStateActions.deleteAllUserMetaInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)("deleteUserMetaAction", {});

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _userMetaStateActions.deleteAllUserMetaSuccess)()) : dispatch((0, _userMetaStateActions.deleteAllUserMetaFailure)(res.error));
                            _context.next = 12;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);
                            dispatch((0, _userMetaStateActions.deleteAllUserMetaFailure)(_context.t0));

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

/***/ 1307:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchUserMeta = undefined;

var _ajax = __webpack_require__(7569);

var _fetchUserMetaActions = __webpack_require__(8799);

var _userMetaStateActions = __webpack_require__(8616);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchUserMeta = exports.fetchUserMeta = function fetchUserMeta() {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchUserMetaActions.fetchUserMetaInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchUserMetaAction', {});

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchUserMetaActions.fetchUserMetaSuccess)(fetched));
                            dispatch((0, _userMetaStateActions.hydrateUserMetaValues)(fetched));
                            _context.next = 12;
                            break;

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchUserMetaActions.fetchUserMetaFailure)(_context.t0));

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

/***/ 4033:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.userMetaSubmit = undefined;

var _ajax = __webpack_require__(7569);

var _userMetaStateActions = __webpack_require__(8616);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var userMetaSubmit = exports.userMetaSubmit = function userMetaSubmit(data) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _userMetaStateActions.submitUserMetaInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)("saveUserMetaAction", data);

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _userMetaStateActions.submitUserMetaSuccess)()) : dispatch((0, _userMetaStateActions.submitUserMetaFailure)(res.error));
                            _context.next = 12;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);
                            dispatch((0, _userMetaStateActions.submitUserMetaFailure)(_context.t0));

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

/***/ })

}]);
//# sourceMappingURL=441.js.map