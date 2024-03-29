(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[941],{

/***/ 3704:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BulkActions = function BulkActions() {

    // manage form state
    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        control = _useFormContext.control,
        register = _useFormContext.register;

    var watchedElements = (0, _reactHookForm.useWatch)({
        control: control,
        name: "elements"
    });

    /**
     *
     * @return {number}
     */
    var count = function count() {

        var count = 0;

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Object.entries(watchedElements)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _ref = _step.value;

                var _ref2 = _slicedToArray(_ref, 2);

                var key = _ref2[0];
                var value = _ref2[1];

                if (value === true) {
                    count++;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        return count;
    };

    return wp.element.createElement(
        "div",
        {
            className: "flex-between s-8 mb-24",
            "data-cy": "bulk-actions"
        },
        wp.element.createElement(
            "span",
            null,
            count(),
            " ",
            (0, _useTranslation2.default)("Selected items")
        ),
        wp.element.createElement(
            "div",
            { className: "i-flex-center s-8" },
            wp.element.createElement(
                "select",
                _extends({
                    name: "action",
                    "data-cy": "taxonomy-bulk-actions",
                    className: "form-control sm"
                }, register("action")),
                wp.element.createElement(
                    "option",
                    { value: "" },
                    (0, _useTranslation2.default)("Select")
                ),
                wp.element.createElement(
                    "option",
                    { value: "delete" },
                    (0, _useTranslation2.default)("Delete")
                )
            ),
            wp.element.createElement(
                _Button2.default,
                {
                    testId: "taxonomy-bulk-actions",
                    style: _styles.styleVariants.WHITE,
                    size: "sm"
                },
                (0, _useTranslation2.default)("Execute")
            )
        )
    );
};

exports.default = BulkActions;

/***/ }),

/***/ 9358:
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

var _Modal = __webpack_require__(6103);

var _Modal2 = _interopRequireDefault(_Modal);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _reactRedux = __webpack_require__(6706);

var _reactRouterDom = __webpack_require__(4022);

var _deleteTaxonomySlice = __webpack_require__(823);

var _reactHotToast = __webpack_require__(4500);

var _misc = __webpack_require__(3154);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeleteTaxonomyModal = function DeleteTaxonomyModal(_ref) {
    var taxonomy = _ref.taxonomy;


    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    // manage redirect
    var navigate = (0, _reactRouterDom.useNavigate)();

    // mange local state

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalOpen = _useState2[0],
        setModalOpen = _useState2[1];

    var handleDeleteTaxonomy = function handleDeleteTaxonomy() {
        dispatch((0, _deleteTaxonomySlice.deleteTaxonomy)(taxonomy)).then(function (res) {
            var payload = res.payload;

            if (payload.success) {
                navigate('/taxonomies');
                setModalOpen(!modalOpen);
                _reactHotToast.toast.success((0, _useTranslation2.default)("Taxonomy successfully deleted. The browser will refresh after 5 seconds."));
                (0, _misc.refreshPage)(5000);
            } else {
                _reactHotToast.toast.error(payload.error);
            }
        }).catch(function (err) {
            _reactHotToast.toast.error(err);
        });
    };

    var buttons = [wp.element.createElement(
        _Button2.default,
        {
            style: _styles.styleVariants.DANGER,
            onClick: function onClick() {
                handleDeleteTaxonomy();
            }
        },
        (0, _useTranslation2.default)("Yes, delete it")
    ), wp.element.createElement(
        _Button2.default,
        {
            style: _styles.styleVariants.SECONDARY,
            onClick: function onClick() {
                setModalOpen(!modalOpen);
            }
        },
        (0, _useTranslation2.default)("Return back to list")
    )];

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            { title: (0, _useTranslation2.default)('Delete Taxonomy'), buttons: buttons, visible: modalOpen },
            wp.element.createElement(
                "div",
                null,
                (0, _useTranslation2.default)("You are going to delete this taxonomy. Are you sure?")
            )
        ),
        wp.element.createElement(
            "a",
            {
                href: "#",
                onClick: function onClick(e) {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }
            },
            (0, _useTranslation2.default)("Delete")
        )
    );
};

DeleteTaxonomyModal.propTypes = {
    taxonomy: _propTypes2.default.string.isRequired
};

exports.default = DeleteTaxonomyModal;

/***/ }),

/***/ 2641:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ExportCodeModal = __webpack_require__(8930);

var _ExportCodeModal2 = _interopRequireDefault(_ExportCodeModal);

var _metaTypes = __webpack_require__(1895);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _ElementTypeBadge = __webpack_require__(740);

var _ElementTypeBadge2 = _interopRequireDefault(_ElementTypeBadge);

var _objects = __webpack_require__(4040);

var _reactRouterDom = __webpack_require__(4022);

var _DeleteTaxonomyModal = __webpack_require__(9358);

var _DeleteTaxonomyModal2 = _interopRequireDefault(_DeleteTaxonomyModal);

var _reactHookForm = __webpack_require__(930);

var _FieldGroupsModal = __webpack_require__(655);

var _FieldGroupsModal2 = _interopRequireDefault(_FieldGroupsModal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaxonomyListElement = (0, _react.memo)(function (_ref) {
    var record = _ref.record;

    // manage form state
    var _useFormContext = (0, _reactHookForm.useFormContext)(),
        register = _useFormContext.register;

    var formId = 'elements.' + record.slug;

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            'tr',
            null,
            wp.element.createElement(
                'td',
                { style: {
                        width: "24px"
                    } },
                !record.isNative && wp.element.createElement(
                    'label',
                    {
                        className: 'checkbox',
                        htmlFor: formId,
                        'data-cy': 'select-' + record.slug
                    },
                    wp.element.createElement('input', _extends({
                        type: 'checkbox',
                        id: formId,
                        name: formId,
                        defaultChecked: false
                    }, register(formId))),
                    wp.element.createElement('span', null)
                )
            ),
            wp.element.createElement(
                'td',
                null,
                record.slug
            ),
            wp.element.createElement(
                'td',
                null,
                wp.element.createElement(_ElementTypeBadge2.default, { element: record })
            ),
            wp.element.createElement(
                'td',
                null,
                (0, _objects.isset)(record, "customPostTypes") && record.customPostTypes.length > 0 ? wp.element.createElement(
                    _reactRouterDom.Link,
                    { to: '/assoc-post-taxonomy/' + record.slug },
                    (0, _useTranslation2.default)("Manage")
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    { to: '/assoc-post-taxonomy/' + record.slug },
                    (0, _useTranslation2.default)("Associate")
                )
            ),
            wp.element.createElement(
                'td',
                null,
                wp.element.createElement(
                    'div',
                    { className: 'i-flex-center s-8' },
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        { to: '/register_meta?belongsTo=' + _metaTypes.metaTypes.TAXONOMY + '&find=' + record.slug },
                        (0, _useTranslation2.default)("Create")
                    ),
                    wp.element.createElement(_FieldGroupsModal2.default, {
                        find: record.slug,
                        belongsTo: _metaTypes.metaTypes.TAXONOMY
                    })
                )
            ),
            wp.element.createElement(
                'td',
                null,
                !record.isNative && wp.element.createElement(
                    'div',
                    { className: 'i-flex-center s-8' },
                    wp.element.createElement(
                        'a',
                        { href: '#/view_taxonomy/' + record.slug },
                        (0, _useTranslation2.default)("View")
                    ),
                    wp.element.createElement(
                        'a',
                        { href: '#/edit_taxonomy/' + record.slug },
                        (0, _useTranslation2.default)("Edit")
                    ),
                    wp.element.createElement(_DeleteTaxonomyModal2.default, { taxonomy: record.slug }),
                    wp.element.createElement(_ExportCodeModal2.default, {
                        belongsTo: _metaTypes.metaTypes.TAXONOMY,
                        find: record.slug
                    })
                )
            )
        )
    );
});

TaxonomyListElement.propTypes = {
    record: _propTypes2.default.object.isRequired
};

exports.default = TaxonomyListElement;

/***/ }),

/***/ 5858:
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

var _misc = __webpack_require__(3154);

var _reactRedux = __webpack_require__(6706);

var _reactRouterDom = __webpack_require__(4022);

var _objects = __webpack_require__(4040);

var _fetchTaxonomiesSlice = __webpack_require__(7176);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _ButtonLink = __webpack_require__(4545);

var _ButtonLink2 = _interopRequireDefault(_ButtonLink);

var _styles = __webpack_require__(624);

var _Alert = __webpack_require__(1316);

var _Alert2 = _interopRequireDefault(_Alert);

var _Tooltip = __webpack_require__(4877);

var _Tooltip2 = _interopRequireDefault(_Tooltip);

var _Pagination = __webpack_require__(5253);

var _Pagination2 = _interopRequireDefault(_Pagination);

var _TaxonomyListElement = __webpack_require__(2641);

var _TaxonomyListElement2 = _interopRequireDefault(_TaxonomyListElement);

var _reactHookForm = __webpack_require__(930);

var _ajax = __webpack_require__(7569);

var _reactHotToast = __webpack_require__(4500);

var _BulkActions = __webpack_require__(3704);

var _BulkActions2 = _interopRequireDefault(_BulkActions);

var _metaTypes = __webpack_require__(1895);

var _react3 = __webpack_require__(8839);

var _scroll = __webpack_require__(2727);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaxonomyList = function TaxonomyList() {

    var globals = document.globals;
    var settings = globals.settings;

    // auto-animate

    var _useAutoAnimate = (0, _react3.useAutoAnimate)(),
        _useAutoAnimate2 = _slicedToArray(_useAutoAnimate, 1),
        parent = _useAutoAnimate2[0];

    // ref


    var ref = (0, _react.useRef)();

    // form init
    var methods = (0, _reactHookForm.useForm)({
        mode: 'all'
    });

    var watchedElements = (0, _reactHookForm.useWatch)({
        control: methods.control,
        name: "elements"
    });

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomies;
    }),
        data = _useSelector.data,
        loading = _useSelector.loading;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        page = _useParams.page;

    var perPage = settings.length > 0 && (0, _objects.filterByLabel)(settings, 'key', 'records_per_page') !== '' ? (0, _objects.filterByLabel)(settings, 'key', 'records_per_page').value : 20;
    var totalPages = Math.ceil(data.count / perPage);

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)((0, _useTranslation2.default)("Registered Taxonomies"));
        (0, _misc.changeCurrentAdminMenuLink)('#/taxonomies');
        dispatch((0, _fetchTaxonomiesSlice.fetchTaxonomies)({
            page: page ? page : 1,
            perPage: perPage
        }));
    }, [page]);

    (0, _react.useEffect)(function () {

        /**
         *
         * @return {boolean}
         */
        var areAllSelected = function areAllSelected() {

            if (!watchedElements) {
                return false;
            }

            var matches = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = Object.entries(watchedElements)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _ref = _step.value;

                    var _ref2 = _slicedToArray(_ref, 2);

                    var key = _ref2[0];
                    var value = _ref2[1];

                    if (value === true) {
                        matches++;
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return matches === Object.entries(watchedElements).length;
        };

        if (areAllSelected()) {
            ref.current.checked = true;
        } else {
            if (ref.current) {
                ref.current.checked = false;
            }
        }
    }, [watchedElements]);

    /**
     *
     * @return {boolean}
     */
    var showBulkActions = function showBulkActions() {

        if (!watchedElements) {
            return false;
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = Object.entries(watchedElements)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var _ref3 = _step2.value;

                var _ref4 = _slicedToArray(_ref3, 2);

                var key = _ref4[0];
                var value = _ref4[1];

                if (value === true) {
                    return true;
                }
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        return false;
    };

    var onSubmit = function onSubmit(data) {
        methods.reset();
        data.belongsTo = _metaTypes.metaTypes.TAXONOMY;
        (0, _ajax.wpAjaxRequest)('bulkActionsAction', data).then(function (res) {
            if (res.success === true) {

                // flush message
                switch (data.action) {
                    case "delete":
                        _reactHotToast.toast.success((0, _useTranslation2.default)("Taxonomy successfully deleted. The browser will refresh after 5 seconds."));
                        methods.resetField("elements");
                        (0, _scroll.scrollToTop)();

                        // refresh items
                        dispatch((0, _fetchTaxonomiesSlice.fetchTaxonomies)({
                            page: page ? page : 1,
                            perPage: perPage
                        }));

                        (0, _misc.refreshPage)(5000);
                        break;
                }
            } else {
                _reactHotToast.toast.error(res.error);
            }
        }).catch(function (err) {
            console.error(err);
            _reactHotToast.toast.error((0, _useTranslation2.default)("Unknown error, please retry later"));
        });
    };

    var actions = [wp.element.createElement(
        _ButtonLink2.default,
        { style: _styles.styleVariants.PRIMARY, to: "/register_taxonomy" },
        (0, _useTranslation2.default)("Register new Taxonomy")
    )];

    if (loading) {
        return wp.element.createElement(_Loader2.default, null);
    }

    return wp.element.createElement(
        _reactHookForm.FormProvider,
        methods,
        wp.element.createElement(
            "form",
            { onSubmit: methods.handleSubmit(onSubmit) },
            wp.element.createElement(
                _Layout2.default,
                {
                    title: (0, _useTranslation2.default)("Registered Taxonomies"),
                    actions: actions,
                    crumbs: [{
                        label: (0, _useTranslation2.default)("Registered Taxonomies")
                    }]
                },
                wp.element.createElement(
                    "div",
                    { ref: parent },
                    showBulkActions() && wp.element.createElement(_BulkActions2.default, null)
                ),
                data.records && data.records.length > 0 ? wp.element.createElement(
                    "div",
                    { className: "responsive" },
                    wp.element.createElement(
                        "table",
                        {
                            "data-cy": "cpt-table",
                            className: "acpt-table with-shadow " + (globals.is_rtl ? 'rtl' : '')
                        },
                        wp.element.createElement(
                            "thead",
                            null,
                            wp.element.createElement(
                                "tr",
                                null,
                                wp.element.createElement(
                                    "th",
                                    { style: {
                                            width: "24px"
                                        } },
                                    wp.element.createElement(
                                        "label",
                                        {
                                            "data-cy": "select-all",
                                            className: "checkbox",
                                            htmlFor: "all"
                                        },
                                        wp.element.createElement("input", {
                                            ref: ref,
                                            type: "checkbox",
                                            id: "all",
                                            defaultChecked: false,
                                            onClick: function onClick(e) {
                                                data.records.filter(function (r) {
                                                    return r.isNative === false;
                                                }).map(function (r) {
                                                    methods.setValue("elements." + r.slug, e.currentTarget.checked);
                                                });
                                            }
                                        }),
                                        wp.element.createElement("span", null)
                                    )
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    wp.element.createElement(_Tooltip2.default, {
                                        tip: (0, _useTranslation2.default)("Taxonomy slug. The post name/slug. Used for various queries for taxonomy content."),
                                        label: (0, _useTranslation2.default)("Slug")
                                    })
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
                                        tip: (0, _useTranslation2.default)("Associate custom post types here"),
                                        label: (0, _useTranslation2.default)("Associated post types")
                                    })
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Field groups")
                                ),
                                wp.element.createElement(
                                    "th",
                                    null,
                                    (0, _useTranslation2.default)("Actions")
                                )
                            )
                        ),
                        wp.element.createElement(
                            "tbody",
                            null,
                            data.records && data.records.map(function (record) {
                                return wp.element.createElement(_TaxonomyListElement2.default, { key: record.id, record: record });
                            })
                        ),
                        totalPages > 1 && wp.element.createElement(
                            "tfoot",
                            null,
                            wp.element.createElement(
                                "tr",
                                null,
                                wp.element.createElement(
                                    "td",
                                    { colSpan: 7 },
                                    wp.element.createElement(_Pagination2.default, {
                                        currentPage: page ? parseInt(page) : 1,
                                        totalPages: totalPages,
                                        baseLink: "/taxonomies"
                                    })
                                )
                            )
                        )
                    )
                ) : wp.element.createElement(
                    _Alert2.default,
                    { style: _styles.styleVariants.SECONDARY },
                    (0, _useTranslation2.default)("No taxonomies found."),
                    " ",
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        { to: "/register_taxonomy" },
                        (0, _useTranslation2.default)("Register the first one")
                    ),
                    "!"
                )
            )
        )
    );
};

TaxonomyList.propTypes = {};

exports.default = TaxonomyList;

/***/ })

}]);
//# sourceMappingURL=941.js.map