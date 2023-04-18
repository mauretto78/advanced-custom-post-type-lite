(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[443],{

/***/ 8443:
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

var _useUnsavedChangesWarning = __webpack_require__(9755);

var _useUnsavedChangesWarning2 = _interopRequireDefault(_useUnsavedChangesWarning);

var _misc = __webpack_require__(3154);

var _fetchWooCommerceProductDataFields = __webpack_require__(3647);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _reactToastify = __webpack_require__(9249);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _reactSortableHoc = __webpack_require__(3350);

var _WooCommerceFieldsStateAction = __webpack_require__(9413);

var _WooCommerceProductDataFieldsSubmit = __webpack_require__(3765);

var _deleteAllWooCommerceProductDataFields = __webpack_require__(8574);

var _Sortable = __webpack_require__(91);

var _fetchWooCommerceProductData = __webpack_require__(7338);

var _ = __webpack_require__(4929);

var _2 = _interopRequireDefault(_);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _MiniNavMap = __webpack_require__(2632);

var _MiniNavMap2 = _interopRequireDefault(_MiniNavMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WooCommerceProductDataFields = function WooCommerceProductDataFields() {

    // manage global state
    var _useParams = (0, _reactRouterDom.useParams)(),
        id = _useParams.id;

    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchWooCommerceProductDataReducer;
    }),
        productData = _useSelector.fetched,
        productDataLoading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.WooCommerceFieldsStateReducer;
    }),
        fields = _useSelector2.fields,
        values = _useSelector2.values,
        isSaved = _useSelector2.isSaved,
        isValid = _useSelector2.isValid,
        saveLoading = _useSelector2.loading,
        saveErrors = _useSelector2.errors,
        success = _useSelector2.success;

    var _useSelector3 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchWooCommerceProductDataFieldsReducer;
    }),
        loading = _useSelector3.loading,
        fetched = _useSelector3.fetched;

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
        (0, _misc.metaTitle)("ACPT - WooCommerce product data" + (isSaved ? '' : '*'));
        if (!isSaved) {
            setDirty();
        }
    }, [isSaved]);

    // fetching data and
    // populate the UI
    (0, _react.useEffect)(function () {
        dispatch((0, _fetchWooCommerceProductData.fetchWooCommerceProductData)({
            id: id
        }));
        dispatch((0, _fetchWooCommerceProductDataFields.fetchWooCommerceProductDataFields)(id));
    }, [saveLoading]);

    // sortable
    var onSortEnd = function onSortEnd(_ref) {
        var oldIndex = _ref.oldIndex,
            newIndex = _ref.newIndex;

        dispatch((0, _WooCommerceFieldsStateAction.setWooCommerceProductDataFields)((0, _reactSortableHoc.arrayMove)(fields, oldIndex, newIndex)));
    };

    // handle data submit
    var handleSubmit = function handleSubmit() {
        dispatch((0, _WooCommerceProductDataFieldsSubmit.WooCommerceProductDataFieldsSubmit)(values));
        dispatch((0, _WooCommerceFieldsStateAction.setWooCommerceProductDataStatusSaved)());
        setPristine();
    };

    var handleDeleteAll = function handleDeleteAll() {
        dispatch((0, _deleteAllWooCommerceProductDataFields.deleteAllWooCommerceProductDataFields)(id));
        dispatch((0, _WooCommerceFieldsStateAction.setWooCommerceProductDataStatusSaved)());
        setPristine();
    };

    // handle form submission outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!saveLoading) {
                if (success) {
                    setPristine();
                    _reactToastify.toast.success("WooCommerce product data fields successfully saved");
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

    if (loading || productDataLoading) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    if (!productData[0]) {
        return wp.element.createElement(_2.default, null);
    }

    var actions = wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            "a",
            {
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    dispatch((0, _WooCommerceFieldsStateAction.createWooCommerceProductDataField)(id));
                },
                className: "acpt-btn acpt-btn-primary-o"
            },
            "Add field box"
        ),
        fields.length > 0 && wp.element.createElement(
            _react2.default.Fragment,
            null,
            wp.element.createElement(
                "button",
                {
                    disabled: !isValid,
                    onClick: function onClick(e) {
                        e.preventDefault();
                        handleSubmit();
                    },
                    type: "submit",
                    className: "acpt-btn acpt-btn-primary"
                },
                "Save"
            ),
            wp.element.createElement(
                "button",
                {
                    onClick: function onClick(e) {
                        e.preventDefault();
                        handleDeleteAll();
                    },
                    type: "submit",
                    className: "acpt-btn acpt-btn-danger"
                },
                "Delete all"
            )
        )
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        Prompt,
        wp.element.createElement(_ActionsBar2.default, {
            title: productData[0].name + " product data fields",
            actions: actions
        }),
        wp.element.createElement(
            "main",
            null,
            wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                    label: "Registered Custom Post Types",
                    link: "/"
                }, {
                    label: "WooCommerce product data",
                    link: "/product-data/product"
                }, {
                    label: productData[0].name + " product data fields"
                }]
            }),
            fields.length > 0 ? wp.element.createElement(
                _react2.default.Fragment,
                null,
                wp.element.createElement(
                    "div",
                    { className: "acpt-meta-wrapper" },
                    wp.element.createElement(
                        "div",
                        { className: "acpt-meta-list-wrapper" },
                        wp.element.createElement(
                            "div",
                            { className: "acpt-card" },
                            wp.element.createElement(
                                "div",
                                { className: "acpt-card__inner" },
                                wp.element.createElement(_Sortable.SortableList, {
                                    items: fields,
                                    onSortEnd: onSortEnd,
                                    useDragHandle: true,
                                    lockAxis: "y",
                                    helperClass: "dragging-helper-class",
                                    disableAutoscroll: false,
                                    useWindowAsScrollContainer: true
                                })
                            )
                        )
                    ),
                    wp.element.createElement(_MiniNavMap2.default, { values: values })
                )
            ) : wp.element.createElement(
                _react2.default.Fragment,
                null,
                wp.element.createElement(
                    "div",
                    { className: "acpt-alert acpt-alert-warning" },
                    "No field box already created. Create the first one now by clicking the button \"Add field box\"!"
                )
            )
        )
    );
};

exports.default = WooCommerceProductDataFields;

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

/***/ 3765:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.WooCommerceProductDataFieldsSubmit = undefined;

var _ajax = __webpack_require__(7569);

var _WooCommerceFieldsStateAction = __webpack_require__(9413);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var WooCommerceProductDataFieldsSubmit = exports.WooCommerceProductDataFieldsSubmit = function WooCommerceProductDataFieldsSubmit(data) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _WooCommerceFieldsStateAction.submitWooCommerceProductDataFieldsInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)("saveWooCommerceProductDataFieldsAction", data);

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _WooCommerceFieldsStateAction.submitWooCommerceProductDataFieldsSuccess)()) : dispatch((0, _WooCommerceFieldsStateAction.submitWooCommerceProductDataFieldsFailure)(res.error));
                            _context.next = 12;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);
                            dispatch((0, _WooCommerceFieldsStateAction.submitWooCommerceProductDataFieldsFailure)(_context.t0));

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

/***/ 8574:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.deleteAllWooCommerceProductDataFields = undefined;

var _ajax = __webpack_require__(7569);

var _WooCommerceFieldsStateAction = __webpack_require__(9413);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var deleteAllWooCommerceProductDataFields = exports.deleteAllWooCommerceProductDataFields = function deleteAllWooCommerceProductDataFields(id) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _WooCommerceFieldsStateAction.deleteAllWooCommerceProductDataFieldsInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)("deleteWooCommerceProductDataFieldsAction", { id: id });

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _WooCommerceFieldsStateAction.deleteAllWooCommerceProductDataFieldsSuccess)()) : dispatch((0, _WooCommerceFieldsStateAction.deleteAllWooCommerceProductDataFieldsFailure)(res.error));
                            _context.next = 12;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);
                            dispatch((0, _WooCommerceFieldsStateAction.deleteAllWooCommerceProductDataFieldsFailure)(_context.t0));

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

/***/ 7338:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchWooCommerceProductData = undefined;

var _ajax = __webpack_require__(7569);

var _fetchWooCommerceProductDataActions = __webpack_require__(6208);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchWooCommerceProductData = exports.fetchWooCommerceProductData = function fetchWooCommerceProductData(meta) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchWooCommerceProductDataActions.fetchWooCommerceProductDataInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchWooCommerceProductDataAction', meta);

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchWooCommerceProductDataActions.fetchWooCommerceProductDataSuccess)(fetched));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchWooCommerceProductDataActions.fetchWooCommerceProductDataFailure)(_context.t0));

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

/***/ 3647:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchWooCommerceProductDataFields = undefined;

var _ajax = __webpack_require__(7569);

var _fetchWooCommerceProductDataFieldsActions = __webpack_require__(2357);

var _WooCommerceFieldsStateAction = __webpack_require__(9413);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchWooCommerceProductDataFields = exports.fetchWooCommerceProductDataFields = function fetchWooCommerceProductDataFields(id) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchWooCommerceProductDataFieldsActions.fetchWooCommerceProductDataFieldsInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchWooCommerceProductDataFieldsAction', { id: id });

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchWooCommerceProductDataFieldsActions.fetchWooCommerceProductDataFieldsSuccess)(fetched));
                            dispatch((0, _WooCommerceFieldsStateAction.hydrateWooCommerceProductDataValues)(fetched));
                            _context.next = 12;
                            break;

                        case 9:
                            _context.prev = 9;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchWooCommerceProductDataFieldsActions.fetchWooCommerceProductDataFieldsFailure)(_context.t0));

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
//# sourceMappingURL=443.js.map