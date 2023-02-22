(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[12],{

/***/ 6595:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _objects = __webpack_require__(4040);

var _Tippy = __webpack_require__(5825);

var _Tippy2 = _interopRequireDefault(_Tippy);

var _react3 = __webpack_require__(6229);

var _Modal = __webpack_require__(2651);

var _Modal2 = _interopRequireDefault(_Modal);

var _MetaBoxMiniTable = __webpack_require__(5410);

var _MetaBoxMiniTable2 = _interopRequireDefault(_MetaBoxMiniTable);

var _TaxonomiesMiniTable = __webpack_require__(9738);

var _TaxonomiesMiniTable2 = _interopRequireDefault(_TaxonomiesMiniTable);

var _WoocommerceMiniTable = __webpack_require__(5200);

var _WoocommerceMiniTable2 = _interopRequireDefault(_WoocommerceMiniTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomPostTypeListElement = function CustomPostTypeListElement(_ref) {
    var id = _ref.id,
        thereIsWooCommerce = _ref.thereIsWooCommerce,
        element = _ref.element,
        handeDeleteTemplate = _ref.handeDeleteTemplate;

    // manage local state
    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        modalVisible = _useState2[0],
        setModalVisible = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = _slicedToArray(_useState3, 2),
        modalTemplateType = _useState4[0],
        setModalTemplateType = _useState4[1];

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _Modal2.default,
            { title: 'Confirm deleting this template?', visible: modalVisible },
            wp.element.createElement(
                'p',
                null,
                'Are you sure?'
            ),
            wp.element.createElement(
                'p',
                null,
                wp.element.createElement(
                    'a',
                    {
                        href: '#',
                        className: 'acpt-btn acpt-btn-primary',
                        onClick: function onClick(e) {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                            handeDeleteTemplate(element.name, modalTemplateType);
                        }
                    },
                    'Yes'
                ),
                '\xA0',
                wp.element.createElement(
                    'a',
                    {
                        href: '#',
                        className: 'acpt-btn acpt-btn-primary-o',
                        onClick: function onClick(e) {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                        }
                    },
                    'No'
                )
            )
        ),
        wp.element.createElement(
            'tr',
            null,
            wp.element.createElement(
                'td',
                { className: 'backend' },
                wp.element.createElement(_react3.Icon, { icon: 'dashicons:' + element.icon, color: '#7e9ebd', width: '18px' })
            ),
            wp.element.createElement(
                'td',
                { className: 'backend' },
                wp.element.createElement(
                    'div',
                    { className: 'm-0 mb-1' },
                    wp.element.createElement(
                        'strong',
                        null,
                        element.name
                    ),
                    !element.isNative && wp.element.createElement(
                        'div',
                        { className: 'element-buttons' },
                        wp.element.createElement(
                            'a',
                            { href: '#/view/' + element.name },
                            'View'
                        ),
                        '\xA0',
                        wp.element.createElement(
                            'a',
                            { href: '#/edit/' + element.name },
                            'Edit'
                        ),
                        '\xA0',
                        wp.element.createElement(
                            'a',
                            { href: '#/delete/' + element.name },
                            'Delete'
                        )
                    )
                )
            ),
            wp.element.createElement(
                'td',
                null,
                element.isNative ? wp.element.createElement(
                    'span',
                    { className: 'acpt-badge acpt-badge-native ml-1' },
                    wp.element.createElement(
                        'span',
                        { className: 'label' },
                        'Native'
                    )
                ) : wp.element.createElement(
                    'span',
                    { className: 'acpt-badge acpt-badge-' + (element.isWooCommerce === true ? 'woocommerce' : 'custom') + ' ml-1' },
                    wp.element.createElement(
                        'span',
                        { className: 'label' },
                        element.isWooCommerce === true ? 'WooCommerce' : 'Custom'
                    )
                )
            ),
            wp.element.createElement(
                'td',
                { className: 'backend' },
                (0, _objects.isset)(element, "meta") && element.meta.length > 0 ? wp.element.createElement(
                    _Tippy2.default,
                    {
                        placement: 'end',
                        html: wp.element.createElement(_MetaBoxMiniTable2.default, { postType: element.name, elements: element.meta })
                    },
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        {
                            to: 'meta/' + element.name,
                            className: 'acpt-btn no-border acpt-btn-sm acpt-btn-info-o'
                        },
                        'Manage'
                    )
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    {
                        to: 'meta/' + element.name,
                        className: 'acpt-btn no-border acpt-btn-sm acpt-btn-primary-o'
                    },
                    'Create'
                )
            ),
            thereIsWooCommerce === true && wp.element.createElement(
                'td',
                { className: 'backend' },
                element.isWooCommerce === true && wp.element.createElement(
                    _react2.default.Fragment,
                    null,
                    (0, _objects.isset)(element, "woocommerceProductData") && element.woocommerceProductData.length > 0 ? wp.element.createElement(
                        _Tippy2.default,
                        {
                            placement: 'top',
                            html: wp.element.createElement(_WoocommerceMiniTable2.default, { postType: element.name, elements: element.woocommerceProductData })
                        },
                        wp.element.createElement(
                            _reactRouterDom.Link,
                            {
                                to: '/product-data/' + element.name,
                                className: 'acpt-btn no-border acpt-btn-sm acpt-btn-info-o'
                            },
                            'Manage'
                        )
                    ) : wp.element.createElement(
                        _reactRouterDom.Link,
                        {
                            to: '/product-data/' + element.name,
                            className: 'acpt-btn no-border acpt-btn-sm acpt-btn-primary-o'
                        },
                        'Create'
                    )
                )
            ),
            wp.element.createElement(
                'td',
                null,
                (0, _objects.isset)(element, "taxonomies") && element.taxonomies.length > 0 ? wp.element.createElement(
                    _Tippy2.default,
                    {
                        placement: 'top',
                        html: wp.element.createElement(_TaxonomiesMiniTable2.default, { postType: element.name, elements: element.taxonomies })
                    },
                    wp.element.createElement(
                        _reactRouterDom.Link,
                        {
                            to: '/assoc-taxonomy-post/' + element.name,
                            className: 'acpt-btn no-border acpt-btn-sm acpt-btn-info-o'
                        },
                        'Manage'
                    )
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    {
                        to: '/assoc-taxonomy-post/' + element.name,
                        className: 'acpt-btn no-border acpt-btn-sm acpt-btn-primary-o'
                    },
                    'Associate'
                )
            ),
            wp.element.createElement(
                'td',
                { className: 'backend with-border' },
                wp.element.createElement(
                    'span',
                    { className: 'acpt-badge' },
                    wp.element.createElement(
                        'span',
                        { className: 'label' },
                        element.postCount
                    )
                )
            ),
            wp.element.createElement(
                'td',
                { className: 'frontend' },
                wp.element.createElement(
                    'a',
                    {
                        className: 'acpt-btn no-border acpt-btn-sm acpt-btn-primary-o text-danger',
                        href: 'https://acpt.io/checkout',
                        target: '_blank'
                    },
                    'Buy a PRO license'
                )
            ),
            wp.element.createElement(
                'td',
                { className: 'frontend' },
                wp.element.createElement(
                    'a',
                    {
                        className: 'acpt-btn no-border acpt-btn-sm acpt-btn-primary-o text-danger',
                        href: 'https://acpt.io/checkout',
                        target: '_blank'
                    },
                    'Buy a PRO license'
                )
            )
        )
    );
};

exports.default = CustomPostTypeListElement;

/***/ }),

/***/ 5410:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MetaBoxMiniTable = function MetaBoxMiniTable(_ref) {
    var postType = _ref.postType,
        elements = _ref.elements;


    return wp.element.createElement(
        "div",
        { className: "acpt-table-responsive" },
        wp.element.createElement(
            "table",
            { className: "acpt-minitable" },
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    null,
                    "Meta box"
                ),
                wp.element.createElement(
                    "th",
                    null,
                    "Fields count"
                )
            ),
            elements.map(function (element) {
                return wp.element.createElement(
                    "tr",
                    null,
                    wp.element.createElement(
                        "td",
                        null,
                        element.name
                    ),
                    wp.element.createElement(
                        "td",
                        null,
                        wp.element.createElement(
                            "span",
                            { className: "acpt-badge" },
                            wp.element.createElement(
                                "span",
                                { className: "label" },
                                element.count
                            )
                        )
                    )
                );
            })
        ),
        wp.element.createElement(
            "div",
            { className: "minitable-buttons" },
            wp.element.createElement(
                "a",
                { href: "#/meta/" + postType },
                "Manage"
            )
        )
    );
};

exports.default = MetaBoxMiniTable;

/***/ }),

/***/ 9738:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TaxonomiesMiniTable = function TaxonomiesMiniTable(_ref) {
    var postType = _ref.postType,
        elements = _ref.elements;


    return wp.element.createElement(
        "div",
        { className: "acpt-table-responsive" },
        wp.element.createElement(
            "table",
            { className: "acpt-minitable" },
            wp.element.createElement(
                "tr",
                null,
                wp.element.createElement(
                    "th",
                    null,
                    "Taxonomy"
                ),
                wp.element.createElement(
                    "th",
                    null,
                    "Sing. label"
                ),
                wp.element.createElement(
                    "th",
                    null,
                    "Plural label"
                ),
                wp.element.createElement(
                    "th",
                    null,
                    "Post count"
                )
            ),
            elements.map(function (element) {
                return wp.element.createElement(
                    "tr",
                    null,
                    wp.element.createElement(
                        "td",
                        null,
                        element.slug
                    ),
                    wp.element.createElement(
                        "td",
                        null,
                        element.singular
                    ),
                    wp.element.createElement(
                        "td",
                        null,
                        element.plural
                    ),
                    wp.element.createElement(
                        "td",
                        null,
                        wp.element.createElement(
                            "span",
                            { className: "acpt-badge" },
                            wp.element.createElement(
                                "span",
                                { className: "label" },
                                element.postCount ? element.postCount : 0
                            )
                        )
                    )
                );
            })
        ),
        wp.element.createElement(
            "div",
            { className: "minitable-buttons" },
            wp.element.createElement(
                "a",
                { href: "#/assoc-taxonomy-post/" + postType },
                "Manage"
            )
        )
    );
};

exports.default = TaxonomiesMiniTable;

/***/ }),

/***/ 5200:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(2107);

var _Boolean = __webpack_require__(9904);

var _Boolean2 = _interopRequireDefault(_Boolean);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var WoocommerceMiniTable = function WoocommerceMiniTable(_ref) {
    var postType = _ref.postType,
        elements = _ref.elements;


    return wp.element.createElement(
        'div',
        { className: 'acpt-table-responsive' },
        wp.element.createElement(
            'table',
            { className: 'acpt-minitable' },
            wp.element.createElement(
                'tr',
                null,
                wp.element.createElement(
                    'th',
                    null,
                    'Name'
                ),
                wp.element.createElement(
                    'th',
                    null,
                    'Icon'
                ),
                wp.element.createElement(
                    'th',
                    null,
                    'Show on UI'
                ),
                wp.element.createElement(
                    'th',
                    null,
                    'Fields'
                )
            ),
            elements.map(function (element) {
                return wp.element.createElement(
                    'tr',
                    null,
                    wp.element.createElement(
                        'td',
                        null,
                        element.name
                    ),
                    wp.element.createElement(
                        'td',
                        null,
                        wp.element.createElement('span', { className: 'wcicon-' + element.icon.icon })
                    ),
                    wp.element.createElement(
                        'td',
                        null,
                        wp.element.createElement(_Boolean2.default, { status: element.showInUI })
                    ),
                    wp.element.createElement(
                        'td',
                        null,
                        wp.element.createElement(
                            'span',
                            { className: 'acpt-badge' },
                            wp.element.createElement(
                                'span',
                                { className: 'label' },
                                element.fields.length
                            )
                        )
                    )
                );
            })
        ),
        wp.element.createElement(
            'div',
            { className: 'minitable-buttons' },
            wp.element.createElement(
                'a',
                { href: '#/product-data/' + postType },
                'Manage'
            )
        )
    );
};

exports.default = WoocommerceMiniTable;

/***/ }),

/***/ 9012:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

var _CustomPostTypeListElement = __webpack_require__(6595);

var _CustomPostTypeListElement2 = _interopRequireDefault(_CustomPostTypeListElement);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _reactRedux = __webpack_require__(4494);

var _fetchPostTypes = __webpack_require__(4825);

var _fetchPostTypesCount = __webpack_require__(4953);

var _misc = __webpack_require__(3154);

var _deletePostTypeTemplate = __webpack_require__(8031);

var _reactToastify = __webpack_require__(9249);

var _syncPosts = __webpack_require__(682);

var _objects = __webpack_require__(4040);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _Tippy = __webpack_require__(5825);

var _Tippy2 = _interopRequireDefault(_Tippy);

var _react3 = __webpack_require__(6229);

var _Pagination = __webpack_require__(1222);

var _Pagination2 = _interopRequireDefault(_Pagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomPostTypeList = function CustomPostTypeList() {

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
    }),
        fetched = _useSelector.fetched,
        loading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesCountReducer;
    }),
        fetchedCount = _useSelector2.fetched,
        loadingCount = _useSelector2.loading;

    var _useSelector3 = (0, _reactRedux.useSelector)(function (state) {
        return state.deletePostTypeTemplateReducer;
    }),
        deleteTemplateErrors = _useSelector3.errors,
        deleteTemplateSuccess = _useSelector3.success,
        deleteTemplateLoading = _useSelector3.loading;

    var _useSelector4 = (0, _reactRedux.useSelector)(function (state) {
        return state.syncPostsReducer;
    }),
        syncPostsErrors = _useSelector4.errors,
        syncPostsSuccess = _useSelector4.success,
        syncPostsLoading = _useSelector4.loading;

    var _useSelector5 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchSettingsReducer;
    }),
        settingsLoading = _useSelector5.loading,
        settings = _useSelector5.fetched;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        page = _useParams.page;

    var didMountRef = (0, _react.useRef)(false);

    var _useState = (0, _react.useState)(null),
        _useState2 = _slicedToArray(_useState, 2),
        fetchedSuccess = _useState2[0],
        setFetchedSuccess = _useState2[1];

    var _useState3 = (0, _react.useState)(false),
        _useState4 = _slicedToArray(_useState3, 2),
        thereIsWooCommerce = _useState4[0],
        setThereIsWooCommerce = _useState4[1];

    var perPage = settings.length > 0 && (0, _objects.filterByLabel)(settings, 'key', 'records_per_page') !== '' ? (0, _objects.filterByLabel)(settings, 'key', 'records_per_page').value : 20;
    var history = (0, _reactRouterDom.useHistory)();

    (0, _react.useEffect)(function () {
        (0, _misc.metaTitle)("Registered Custom Post Types");
        (0, _misc.changeCurrentAdminMenuLink)('');
        dispatch((0, _fetchPostTypesCount.fetchPostTypesCount)());
        dispatch((0, _fetchPostTypes.fetchPostTypes)({
            page: page ? page : 1,
            perPage: perPage
        }));
    }, [page]);

    // handle fetch outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loading && !settingsLoading) {
                setFetchedSuccess(true);

                var isWooCommerce = 0;

                fetched.map(function (post) {
                    if (post.isWooCommerce) {
                        isWooCommerce++;
                    }
                });

                isWooCommerce > 0 && setThereIsWooCommerce(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    // handle delete template outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!deleteTemplateLoading) {
                if (deleteTemplateSuccess) {
                    history.push('/');
                    _reactToastify.toast.success("Template was successfully deleted. The browser will refresh after 5 seconds...");
                    (0, _misc.refreshPage)(5000);
                }

                if (deleteTemplateErrors.length > 0) {
                    deleteTemplateErrors.map(function (error) {
                        _reactToastify.toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [deleteTemplateLoading]);

    // handle sync posts
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!syncPostsLoading) {
                if (syncPostsSuccess) {
                    history.push('/');
                    _reactToastify.toast.success("Successfully post sync. The browser will refresh after 5 seconds...");
                    (0, _misc.refreshPage)(5000);
                }

                if (syncPostsErrors.length > 0) {
                    syncPostsErrors.map(function (error) {
                        _reactToastify.toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [syncPostsLoading]);

    var handleDeleteTemplate = function handleDeleteTemplate(name, type) {
        dispatch((0, _deletePostTypeTemplate.deletePostTypeTemplate)(name, type));
    };

    var handleSyncPosts = function handleSyncPosts() {
        dispatch((0, _syncPosts.syncPosts)());
    };

    if (!fetchedSuccess) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    var actions = wp.element.createElement(
        _react2.default.Fragment,
        null,
        wp.element.createElement(
            _reactRouterDom.Link,
            {
                className: 'acpt-btn acpt-btn-primary',
                to: '/register' },
            'Register new Post Type'
        ),
        wp.element.createElement(
            'a',
            {
                onClick: function onClick(e) {
                    e.preventDefault();
                    handleSyncPosts();
                },
                className: 'acpt-btn acpt-btn-primary-o',
                href: '#'
            },
            'Sync with post types'
        )
    );

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(_ActionsBar2.default, {
            title: 'Registered Custom Post Types',
            actions: actions
        }),
        wp.element.createElement(
            'main',
            null,
            wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                    label: "Registered Custom Post Types"
                }] }),
            fetched.length > 0 ? wp.element.createElement(
                'div',
                { className: 'acpt-card' },
                wp.element.createElement(
                    'div',
                    { className: 'acpt-card__header borderless' },
                    wp.element.createElement(
                        'div',
                        { className: 'acpt-card__inner' },
                        fetchedCount,
                        ' record(s) found'
                    )
                ),
                wp.element.createElement(
                    'div',
                    { className: 'acpt-card__body' },
                    wp.element.createElement(
                        'div',
                        { className: 'acpt-table-responsive' },
                        wp.element.createElement(
                            'table',
                            { className: 'acpt-table' },
                            wp.element.createElement(
                                'thead',
                                null,
                                wp.element.createElement(
                                    'tr',
                                    null,
                                    wp.element.createElement(
                                        'th',
                                        { className: 'grey backend with-border', colSpan: thereIsWooCommerce ? 7 : 6 },
                                        'Backend UI'
                                    ),
                                    wp.element.createElement(
                                        'th',
                                        { className: 'grey frontend', colSpan: 2 },
                                        'Frontend UI'
                                    )
                                ),
                                wp.element.createElement(
                                    'tr',
                                    null,
                                    wp.element.createElement('th', null),
                                    wp.element.createElement(
                                        'th',
                                        null,
                                        'Name'
                                    ),
                                    wp.element.createElement('th', null),
                                    wp.element.createElement(
                                        'th',
                                        null,
                                        'Meta boxes \xA0',
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: 'Associated meta boxes' },
                                            wp.element.createElement(
                                                'span',
                                                { className: 'helper' },
                                                wp.element.createElement(_react3.Icon, { icon: 'bx:bx-help-circle', width: '18px' })
                                            )
                                        )
                                    ),
                                    thereIsWooCommerce === true && wp.element.createElement(
                                        'th',
                                        null,
                                        'Product data \xA0',
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: 'Associated WooCommerce product data' },
                                            wp.element.createElement(
                                                'span',
                                                { className: 'helper' },
                                                wp.element.createElement(_react3.Icon, { icon: 'bx:bx-help-circle', width: '18px' })
                                            )
                                        )
                                    ),
                                    wp.element.createElement(
                                        'th',
                                        null,
                                        'Associated taxonomies \xA0',
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: 'Associated taxonomies with the post' },
                                            wp.element.createElement(
                                                'span',
                                                { className: 'helper' },
                                                wp.element.createElement(_react3.Icon, { icon: 'bx:bx-help-circle', width: '18px' })
                                            )
                                        )
                                    ),
                                    wp.element.createElement(
                                        'th',
                                        { className: 'with-border' },
                                        'Post count \xA0',
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: 'Published posts count' },
                                            wp.element.createElement(
                                                'span',
                                                { className: 'helper' },
                                                wp.element.createElement(_react3.Icon, { icon: 'bx:bx-help-circle', width: '18px' })
                                            )
                                        )
                                    ),
                                    wp.element.createElement(
                                        'th',
                                        { className: 'text-center' },
                                        'Archive template \xA0',
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: 'The archive template for this custom post type' },
                                            wp.element.createElement(
                                                'span',
                                                { className: 'helper' },
                                                wp.element.createElement(_react3.Icon, { icon: 'bx:bx-help-circle', width: '18px' })
                                            )
                                        )
                                    ),
                                    wp.element.createElement(
                                        'th',
                                        { className: 'text-center' },
                                        'Single template \xA0',
                                        wp.element.createElement(
                                            _Tippy2.default,
                                            { title: 'The single template for this custom post type' },
                                            wp.element.createElement(
                                                'span',
                                                { className: 'helper' },
                                                wp.element.createElement(_react3.Icon, { icon: 'bx:bx-help-circle', width: '18px' })
                                            )
                                        )
                                    )
                                )
                            ),
                            wp.element.createElement(
                                'tbody',
                                null,
                                fetched.map(function (element) {
                                    return wp.element.createElement(_CustomPostTypeListElement2.default, { id: element.id, thereIsWooCommerce: thereIsWooCommerce, key: element.id, element: element, handeDeleteTemplate: handleDeleteTemplate });
                                })
                            )
                        )
                    )
                ),
                wp.element.createElement(
                    'div',
                    { className: 'acpt-card__footer', style: { border: "none" } },
                    wp.element.createElement(
                        'div',
                        { className: 'acpt-card__inner' },
                        wp.element.createElement(_Pagination2.default, { currentPage: page ? page : 1, perPage: perPage, records: fetchedCount })
                    )
                )
            ) : wp.element.createElement(
                'div',
                { className: 'acpt-alert acpt-alert-secondary' },
                'No custom post types found. ',
                wp.element.createElement(
                    _reactRouterDom.Link,
                    { to: '/register' },
                    'Register the first one'
                ),
                '!'
            )
        )
    );
};

exports.default = CustomPostTypeList;

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

/***/ 1222:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRouterDom = __webpack_require__(886);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Pagination = function Pagination(_ref) {
    var currentPage = _ref.currentPage,
        perPage = _ref.perPage,
        records = _ref.records;


    var totalPages = Math.ceil(records / perPage);
    var rows = [];
    for (var i = 1; i <= totalPages; i++) {
        rows.push(i);
    }

    if (rows.length < 2) {
        return wp.element.createElement(_react2.default.Fragment, null);
    }

    return wp.element.createElement(
        "ul",
        { className: "acpt-pagination" },
        rows.map(function (row) {
            return wp.element.createElement(
                "li",
                null,
                row == currentPage ? wp.element.createElement(
                    "span",
                    null,
                    row
                ) : wp.element.createElement(
                    _reactRouterDom.Link,
                    { to: "/" + row },
                    row
                )
            );
        })
    );
};

exports.default = Pagination;

/***/ }),

/***/ 8031:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.deletePostTypeTemplate = undefined;

var _ajax = __webpack_require__(7569);

var _deletePostTypeTemplateActions = __webpack_require__(8839);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var deletePostTypeTemplate = exports.deletePostTypeTemplate = function deletePostTypeTemplate(postType, templateType) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _deletePostTypeTemplateActions.deletePostTypeTemplateInProgress)(postType, templateType));
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('deletePostTypeTemplateAction', postType ? { postType: postType, templateType: templateType } : {});

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _deletePostTypeTemplateActions.deletePostTypeTemplateSuccess)()) : dispatch((0, _deletePostTypeTemplateActions.deletePostTypeTemplateFailure)(res.error));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _deletePostTypeTemplateActions.deletePostTypeTemplateFailure)(_context.t0));

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

/***/ 4953:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchPostTypesCount = undefined;

var _ajax = __webpack_require__(7569);

var _fetchCustomPostTypesCountActions = __webpack_require__(8137);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchPostTypesCount = exports.fetchPostTypesCount = function fetchPostTypesCount() {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchCustomPostTypesCountActions.fetchPostTypesCountInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchCustomPostTypesCountAction');

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchCustomPostTypesCountActions.fetchPostTypesCountSuccess)(fetched));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchCustomPostTypesCountActions.fetchPostTypesCountFailure)(_context.t0));

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

/***/ 682:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.syncPosts = undefined;

var _ajax = __webpack_require__(7569);

var _syncPostsAction = __webpack_require__(1575);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var syncPosts = exports.syncPosts = function syncPosts() {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var res;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _syncPostsAction.syncPostsInProgress)());
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)("syncPostsAction");

                        case 4:
                            res = _context.sent;

                            res.success === true ? dispatch((0, _syncPostsAction.syncPostsSuccess)(res.data)) : dispatch((0, _syncPostsAction.syncPostsFailure)(res.error));
                            _context.next = 12;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            console.log(_context.t0);
                            dispatch((0, _syncPostsAction.syncPostsFailure)(_context.t0));

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

/***/ 2107:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=12.js.map