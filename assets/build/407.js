(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[407],{

/***/ 3661:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4494);

var _reactHookForm = __webpack_require__(930);

var _stepsActions = __webpack_require__(4576);

var _InputText = __webpack_require__(7388);

var _InputText2 = _interopRequireDefault(_InputText);

var _StepsButtons = __webpack_require__(2873);

var _StepsButtons2 = _interopRequireDefault(_StepsButtons);

var _strings = __webpack_require__(8029);

var _validation = __webpack_require__(9593);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _StepsHeader = __webpack_require__(3119);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicStep = function BasicStep(_ref) {
    var edit = _ref.edit,
        headings = _ref.headings,
        taxonomy = _ref.taxonomy;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetched = _useSelector.fetched;

    var dispatch = (0, _reactRedux.useDispatch)();

    // handle form

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all',
        defaultValues: {
            slug: fetched.length > 0 ? fetched[0].slug : null,
            singular_label: fetched.length > 0 ? fetched[0].singular : null,
            plural_label: fetched.length > 0 ? fetched[0].plural : null
        }
    }),
        control = _useForm.control,
        register = _useForm.register,
        handleSubmit = _useForm.handleSubmit,
        setValue = _useForm.setValue,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid;

    var handleSlugChange = function handleSlugChange(slug) {
        setValue('slug', (0, _strings.sluggifyString)(slug, 32));
    };

    var onSubmit = function onSubmit(data) {
        dispatch((0, _stepsActions.stepForward)(data));
    };

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(
            "form",
            { onSubmit: handleSubmit(onSubmit) },
            wp.element.createElement(_ActionsBar2.default, {
                title: taxonomy ? "Edit Taxonomy" : "Create new Taxonomy",
                actions: wp.element.createElement(_StepsButtons2.default, { isValid: isValid, next: 2 })
            }),
            wp.element.createElement(
                "main",
                null,
                wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                        label: "Registered Custom Post Types",
                        link: "/"
                    }, {
                        label: "Registered Taxonomies",
                        link: "/taxonomies"
                    }, {
                        label: taxonomy ? "Edit Taxonomy" : "Create new Taxonomy"
                    }] }),
                wp.element.createElement(
                    "div",
                    { className: "acpt-card" },
                    wp.element.createElement(_StepsHeader2.default, { headings: headings }),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        wp.element.createElement(_InputText2.default, {
                            id: "slug",
                            label: "Slug",
                            placeholder: "slug",
                            readOnly: fetched.length > 0,
                            defaultValue: fetched.length > 0 ? fetched[0].slug : null,
                            description: "The post name/slug. Used for various queries for taxonomy content.",
                            register: register,
                            errors: errors,
                            isRequired: true,
                            onChangeCapture: function onChangeCapture(e) {
                                return handleSlugChange(e.currentTarget.value);
                            },
                            validate: {
                                validate: edit ? _validation.isTaxonomySlugValid : _validation.asyncIsTaxonomySlugValid,
                                required: "This field is mandatory"
                            } }),
                        wp.element.createElement(_InputText2.default, {
                            id: "singular_label",
                            label: "Singular label",
                            placeholder: "(e.g. Movie)",
                            defaultValue: fetched.length > 0 ? fetched[0].singular : null,
                            description: "Used when a singular label is needed",
                            register: register,
                            errors: errors,
                            isRequired: true,
                            validate: {
                                required: "This field is mandatory"
                            } }),
                        wp.element.createElement(_InputText2.default, {
                            id: "plural_label",
                            label: "Plural label",
                            placeholder: "(e.g. Movies)",
                            defaultValue: fetched.length > 0 ? fetched[0].plural : null,
                            description: "Used for the taxonomy admin menu item",
                            register: register,
                            errors: errors,
                            isRequired: true,
                            validate: {
                                required: "This field is mandatory"
                            } })
                    )
                )
            )
        )
    );
};

exports.default = BasicStep;

/***/ }),

/***/ 175:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4494);

var _reactHookForm = __webpack_require__(930);

var _stepsActions = __webpack_require__(4576);

var _InputText = __webpack_require__(7388);

var _InputText2 = _interopRequireDefault(_InputText);

var _StepsButtons = __webpack_require__(2873);

var _StepsButtons2 = _interopRequireDefault(_StepsButtons);

var _taxonomy_label = __webpack_require__(4644);

var _localization = __webpack_require__(8525);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _StepsHeader = __webpack_require__(3119);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AdditionalLabelsStep = function AdditionalLabelsStep(_ref) {
    var headings = _ref.headings,
        taxonomy = _ref.taxonomy;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.stepsReducer;
    }),
        stepsData = _useSelector.data,
        activeStep = _useSelector.activeStep;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetched = _useSelector2.fetched;

    var dispatch = (0, _reactRedux.useDispatch)();

    // handle form
    var labels = {};
    if (fetched.length > 0) {
        labels = fetched[0].labels;
    }

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all'
    }),
        register = _useForm.register,
        handleSubmit = _useForm.handleSubmit,
        setValue = _useForm.setValue,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid;

    // form default values


    (0, _react.useEffect)(function () {
        if (stepsData[1]) {
            setValue('name', fetched.length > 0 ? labels.name : stepsData[1].slug);
            setValue('singular_name', fetched.length > 0 ? labels.singular_name : stepsData[1].singular_label);
            setValue('search_items', fetched.length > 0 ? labels.search_items : "" + (0, _localization.translate)("general.labels.search_items", { r: stepsData[1].plural_label }));
            setValue('popular_items', fetched.length > 0 ? labels.popular_items : "" + (0, _localization.translate)("general.labels.popular_items", { r: stepsData[1].plural_label }));
            setValue('all_items', fetched.length > 0 ? labels.all_items : "" + (0, _localization.translate)("general.labels.all_items", { r: stepsData[1].plural_label }));
            setValue('parent_item', fetched.length > 0 ? labels.parent_item : "" + (0, _localization.translate)("general.labels.parent_item", { r: stepsData[1].singular_label }));
            setValue('parent_item_colon', fetched.length > 0 ? labels.parent_item_colon : (0, _localization.translate)("general.labels.parent_item_colon"));
            setValue('edit_item', fetched.length > 0 ? labels.edit_item : "" + (0, _localization.translate)("general.labels.edit"));
            setValue('view_item', fetched.length > 0 ? labels.view_item : "" + (0, _localization.translate)("general.labels.view"));
            setValue('update_item', fetched.length > 0 ? labels.update_item : "" + (0, _localization.translate)("general.labels.update_item", { r: stepsData[1].singular_label }));
            setValue('add_new_item', fetched.length > 0 ? labels.add_new_item : "" + (0, _localization.translate)("general.labels.add_new_item", { r: stepsData[1].singular_label }));
            setValue('new_item_name', fetched.length > 0 ? labels.new_item_name : "" + (0, _localization.translate)("general.labels.new_item_name", { r: stepsData[1].singular_label }));
            setValue('separate_items_with_commas', fetched.length > 0 ? labels.separate_items_with_commas : "" + (0, _localization.translate)("general.labels.separate_items_with_commas", { r: stepsData[1].plural_label }));
            setValue('add_or_remove_items', fetched.length > 0 ? labels.add_or_remove_items : "" + (0, _localization.translate)("general.labels.add_or_remove_items", { r: stepsData[1].plural_label }));
            setValue('choose_from_most_used', fetched.length > 0 ? labels.choose_from_most_used : "" + (0, _localization.translate)("general.labels.choose_from_most_used", { r: stepsData[1].singular_label }));
            setValue('not_found', fetched.length > 0 ? labels.not_found : (0, _localization.translate)("general.labels.not_found", { r: stepsData[1].singular_label }));
            setValue('no_terms', fetched.length > 0 ? labels.no_terms : "" + (0, _localization.translate)("general.labels.no_terms", { r: stepsData[1].plural_label }));
            setValue('filter_by_item', fetched.length > 0 ? labels.filter_by_item : "" + (0, _localization.translate)("general.labels.filter_by_item", { r: stepsData[1].singular_label }));
            setValue('items_list_navigation', fetched.length > 0 ? labels.items_list_navigation : (0, _localization.translate)("general.labels.items_list_navigation", { r: stepsData[1].plural_label }));
            setValue('items_list', fetched.length > 0 ? labels.items_list : (0, _localization.translate)("general.labels.items_list", { r: stepsData[1].plural_label }));
            setValue('most_used', fetched.length > 0 ? labels.most_used : "" + (0, _localization.translate)("general.labels.most_used", { r: stepsData[1].plural_label }));
            setValue('back_to_items', fetched.length > 0 ? labels.back_to_items : "" + (0, _localization.translate)("general.labels.back_to_items", { r: stepsData[1].plural_label }));
        }
    }, [activeStep]);

    var onSubmit = function onSubmit(data) {
        dispatch((0, _stepsActions.stepForward)(data));
    };

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(
            "form",
            { onSubmit: handleSubmit(onSubmit) },
            wp.element.createElement(_ActionsBar2.default, {
                title: taxonomy ? "Edit Taxonomy" : "Create new Taxonomy",
                actions: wp.element.createElement(_StepsButtons2.default, { isValid: isValid, next: 3, prev: 1 })
            }),
            wp.element.createElement(
                "main",
                null,
                wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                        label: "Registered Custom Post Types",
                        link: "/"
                    }, {
                        label: "Registered Taxonomies",
                        link: "/taxonomies"
                    }, {
                        label: taxonomy ? "Edit Taxonomy" : "Create new Taxonomy"
                    }] })
            ),
            wp.element.createElement(
                "div",
                { className: "acpt-card" },
                wp.element.createElement(_StepsHeader2.default, { headings: headings }),
                wp.element.createElement(
                    "div",
                    { className: "acpt-card__inner" },
                    _taxonomy_label.taxonomyLabelsList.map(function (item) {
                        return wp.element.createElement(_InputText2.default, {
                            id: item.id,
                            label: item.label,
                            placeholder: item.label,
                            register: register,
                            errors: errors,
                            description: item.description,
                            validate: {
                                maxLength: {
                                    value: 255,
                                    message: "min length is 255"
                                }
                            }
                        });
                    })
                )
            )
        )
    );
};

exports.default = AdditionalLabelsStep;

/***/ }),

/***/ 9303:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactRedux = __webpack_require__(4494);

var _reactRouterDom = __webpack_require__(886);

var _reactHookForm = __webpack_require__(930);

var _stepsSubmit = __webpack_require__(9218);

var _reactToastify = __webpack_require__(9249);

var _InputSwitch = __webpack_require__(8195);

var _InputSwitch2 = _interopRequireDefault(_InputSwitch);

var _InputText = __webpack_require__(7388);

var _InputText2 = _interopRequireDefault(_InputText);

var _StepsButtons = __webpack_require__(2873);

var _StepsButtons2 = _interopRequireDefault(_StepsButtons);

var _Checkboxes = __webpack_require__(2184);

var _Checkboxes2 = _interopRequireDefault(_Checkboxes);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

var _StepsHeader = __webpack_require__(3119);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var OtherSettingsStep = function OtherSettingsStep(_ref) {
    var headings = _ref.headings,
        taxonomy = _ref.taxonomy,
        setPristineHandler = _ref.setPristineHandler;


    // manage redux state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.stepsReducer;
    }),
        stepsErrors = _useSelector.errors,
        success = _useSelector.success,
        loading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetched = _useSelector2.fetched;

    // manage local state


    var didMountRef = (0, _react.useRef)(false);

    // manage redirect
    var history = (0, _reactRouterDom.useHistory)();

    // handle form
    var settings = {};
    if (fetched.length > 0) {
        settings = fetched[0].settings;
    }

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all',
        defaultValues: {
            public: fetched.length > 0 ? settings.public : null,
            publicly_queryable: fetched.length > 0 ? settings.publicly_queryable : null,
            hierarchical: fetched.length > 0 ? settings.hierarchical : null,
            show_ui: fetched.length > 0 ? settings.show_ui : null,
            show_in_menu: fetched.length > 0 ? settings.show_in_menu : null,
            show_in_nav_menus: fetched.length > 0 ? settings.show_in_nav_menus : null,
            show_in_rest: fetched.length > 0 ? settings.show_in_rest : true,
            rest_base: fetched.length > 0 ? settings.rest_base : null,
            rest_controller_class: fetched.length > 0 ? settings.rest_controller_class : null,
            show_tagcloud: fetched.length > 0 ? settings.show_tagcloud : null,
            show_in_quick_edit: fetched.length > 0 ? settings.show_in_quick_edit : null,
            show_admin_column: fetched.length > 0 ? settings.show_admin_column : true,
            capabilities: fetched.length > 0 ? settings.capabilities : null,
            rewrite: fetched.length > 0 ? settings.rewrite : null,
            custom_rewrite: fetched.length > 0 && settings.rewrite ? settings.rewrite.slug : null,
            query_var: fetched.length > 0 ? settings.query_var : null,
            custom_query_var: fetched.length > 0 ? settings.custom_query_var : null,
            default_term: fetched.length > 0 ? settings.default_term : null,
            sort: fetched.length > 0 ? settings.sort : null
        }
    }),
        register = _useForm.register,
        handleSubmit = _useForm.handleSubmit,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid,
        watch = _useForm.watch;

    var onSubmit = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            setPristineHandler();
                            _context.next = 3;
                            return dispatch((0, _stepsSubmit.stepsSubmit)('saveTaxonomyAction', data));

                        case 3:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function onSubmit(_x) {
            return _ref2.apply(this, arguments);
        };
    }();

    // handle form submission outcome
    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loading) {
                if (success) {
                    history.push('/taxonomies');
                    _reactToastify.toast.success("Taxonomy successfully saved");
                }

                if (stepsErrors.length > 0) {
                    stepsErrors.map(function (error) {
                        _reactToastify.toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    var rewrite = watch("rewrite");
    var query_var = watch("query_var");

    return wp.element.createElement(
        _Layout2.default,
        null,
        wp.element.createElement(
            "form",
            { onSubmit: handleSubmit(onSubmit) },
            wp.element.createElement(_ActionsBar2.default, {
                title: taxonomy ? "Edit Taxonomy" : "Create new Taxonomy",
                actions: wp.element.createElement(_StepsButtons2.default, { isValid: isValid, prev: 2 })
            }),
            wp.element.createElement(
                "main",
                null,
                wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                        label: "Registered Custom Post Types",
                        link: "/"
                    }, {
                        label: "Registered Taxonomies",
                        link: "/taxonomies"
                    }, {
                        label: taxonomy ? "Edit Taxonomy" : "Create new Taxonomy"
                    }] }),
                wp.element.createElement(
                    "div",
                    { className: "acpt-card" },
                    wp.element.createElement(_StepsHeader2.default, { headings: headings }),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "public",
                            label: "Is Public",
                            description: "Whether a taxonomy is intended for use publicly either via the admin interface or by front-end users.",
                            defaultValue: fetched.length > 0 ? settings.public : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "publicly_queryable",
                            label: "Publicly queryable",
                            description: "Whether the taxonomy is publicly queryable. If not set, the default is inherited from $public.",
                            defaultValue: fetched.length > 0 ? settings.publicly_queryable : false,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "hierarchical",
                            label: "Hierarchical",
                            description: "Whether the taxonomy is hierarchical. Default false.",
                            defaultValue: fetched.length > 0 ? settings.hierarchical : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_ui",
                            label: "Show in UI",
                            description: "Whether to generate and allow a UI for managing terms in this taxonomy in the admin. If not set, the default is inherited from $public (default true).",
                            defaultValue: fetched.length > 0 ? settings.show_ui : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_in_menu",
                            label: "Show in menu",
                            description: "Whether to show the taxonomy in the admin menu. If true, the taxonomy is shown as a submenu of the object type menu. If false, no menu is shown. $show_ui must be true. If not set, default is inherited from $show_ui (default true).",
                            defaultValue: fetched.length > 0 ? settings.show_in_menu : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_in_nav_menus",
                            label: "Show in nav menus",
                            description: "Makes this taxonomy available for selection in navigation menus. If not set, the default is inherited from $public (default true).",
                            defaultValue: fetched.length > 0 ? settings.show_in_nav_menus : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_in_rest",
                            label: "Show in REST API",
                            description: "Whether to include the taxonomy in the REST API. Set this to true for the taxonomy to be available in the block editor. SET TRUE TO ENABLE VISUALIZATION ON GUTEMBERG EDITOR.",
                            defaultValue: fetched.length > 0 ? settings.show_in_rest : false,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputText2.default, {
                            id: "rest_base",
                            label: "REST API base slug",
                            placeholder: "REST API base slug",
                            register: register,
                            errors: errors,
                            description: " To change the base url of REST API route. Default is $taxonomy.",
                            validate: {
                                maxLength: {
                                    value: 255,
                                    message: "min length is 255"
                                }
                            }
                        }),
                        wp.element.createElement(_InputText2.default, {
                            id: "rest_controller_class",
                            label: "REST controller class",
                            placeholder: "REST controller class",
                            register: register,
                            errors: errors,
                            description: "REST API Controller class name. Default is 'WP_REST_Terms_Controller'.",
                            validate: {
                                maxLength: {
                                    value: 255,
                                    message: "min length is 255"
                                }
                            }
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_tagcloud",
                            label: "Show Tagcloud",
                            description: "Whether to list the taxonomy in the Tag Cloud Widget controls. If not set, the default is inherited from $show_ui (default true).",
                            defaultValue: fetched.length > 0 ? settings.show_tagcloud : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_in_quick_edit",
                            label: "Show in quick edit",
                            description: "Whether to show the taxonomy in the quick/bulk edit panel. It not set, the default is inherited from $show_ui (default true).",
                            defaultValue: fetched.length > 0 ? settings.show_in_quick_edit : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_admin_column",
                            label: "Show admin column",
                            description: "Whether to display a column for the taxonomy on its post type listing screens. Default false.",
                            defaultValue: fetched.length > 0 ? settings.show_admin_column : false,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_Checkboxes2.default, {
                            id: "capabilities",
                            label: "Capabilities",
                            placeholder: "Capabilities",
                            register: register,
                            errors: errors,
                            defaultValue: "post",
                            description: "Array of capabilities for this taxonomy.",
                            values: {
                                "manage_terms": {
                                    "value": "manage_terms",
                                    "checked": fetched.length > 0 && settings.capabilities ? settings.capabilities.includes('manage_terms') : true
                                },
                                "edit_terms": {
                                    "value": "edit_terms",
                                    "checked": fetched.length > 0 && settings.capabilities ? settings.capabilities.includes('edit_terms') : true
                                },
                                "delete_terms": {
                                    "value": "delete_terms",
                                    "checked": fetched.length > 0 && settings.capabilities ? settings.capabilities.includes('delete_terms') : true
                                },
                                "assign_terms": {
                                    "value": "assign_terms",
                                    "checked": fetched.length > 0 && settings.capabilities ? settings.capabilities.includes('assign_terms') : true
                                }
                            },
                            validate: {
                                maxLength: {
                                    value: 255,
                                    message: "min length is 255"
                                }
                            }
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "rewrite",
                            label: "Rewrite",
                            description: "Triggers the handling of rewrites for this taxonomy. Default true, using $taxonomy as slug. To prevent rewrite, set to false. To specify rewrite rules, an array can be passed with any of these keys:",
                            defaultValue: fetched.length > 0 ? settings.rewrite : false,
                            register: register,
                            errors: errors
                        }),
                        rewrite && wp.element.createElement(_InputText2.default, {
                            id: "custom_rewrite",
                            label: "Custom rewrite rules",
                            placeholder: "Custom rewrite rules",
                            register: register,
                            errors: errors,
                            description: "Custom post type slug to use instead of default.",
                            validate: {
                                maxLength: {
                                    value: 255,
                                    message: "min length is 255"
                                }
                            }
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "query_var",
                            label: "Query var",
                            description: "Sets the query var key for this taxonomy. Default $taxonomy key. If false, a taxonomy cannot be loaded at ?{query_var}={term_slug}. If a string, the query ?{query_var}={term_slug} will be valid.",
                            defaultValue: fetched.length > 0 ? settings.query_var : false,
                            register: register,
                            errors: errors
                        }),
                        query_var && wp.element.createElement(_InputText2.default, {
                            id: "custom_query_var",
                            label: "Custom query var",
                            placeholder: "Custom query var",
                            register: register,
                            errors: errors,
                            description: "Custom query var slug to use instead of default.",
                            validate: {
                                maxLength: {
                                    value: 255,
                                    message: "min length is 255"
                                }
                            }
                        }),
                        wp.element.createElement(_InputText2.default, {
                            id: "default_term",
                            label: "Default term",
                            placeholder: "Default term to be used for the taxonomy.",
                            register: register,
                            errors: errors,
                            description: "Allowed keys: 'name', name of default term.|'slug', Slug for default term.|'description', Description for default term",
                            validate: {
                                maxLength: {
                                    value: 255,
                                    message: "min length is 255"
                                }
                            }
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "sort",
                            label: "Sort",
                            description: "Whether terms in this taxonomy should be sorted in the order they are provided to wp_set_object_terms(). Default null which equates to false.",
                            defaultValue: fetched.length > 0 ? settings.sort : false,
                            register: register,
                            errors: errors
                        })
                    )
                )
            )
        )
    );
};

exports.default = OtherSettingsStep;

/***/ }),

/***/ 7407:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _misc = __webpack_require__(3154);

var _reactRedux = __webpack_require__(4494);

var _reactRouterDom = __webpack_require__(886);

var _useUnsavedChangesWarning = __webpack_require__(9755);

var _useUnsavedChangesWarning2 = _interopRequireDefault(_useUnsavedChangesWarning);

var _Steps = __webpack_require__(5832);

var _Steps2 = _interopRequireDefault(_Steps);

var _steps = __webpack_require__(9500);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _fetchTaxonomies = __webpack_require__(1141);

var _resetTaxonomies = __webpack_require__(8623);

var _Basic = __webpack_require__(3661);

var _Basic2 = _interopRequireDefault(_Basic);

var _Labels = __webpack_require__(175);

var _Labels2 = _interopRequireDefault(_Labels);

var _Settings = __webpack_require__(9303);

var _Settings2 = _interopRequireDefault(_Settings);

var _localization = __webpack_require__(8525);

var _stepsActions = __webpack_require__(4576);

var _forms = __webpack_require__(9207);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SaveTaxonomy = function SaveTaxonomy() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomiesReducer;
    }),
        fetched = _useSelector.fetched,
        loading = _useSelector.loading;

    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        taxonomy = _useParams.taxonomy;

    var _useParams2 = (0, _reactRouterDom.useParams)(),
        step = _useParams2.step;

    var _useUnsavedChangesWar = (0, _useUnsavedChangesWarning2.default)(),
        _useUnsavedChangesWar2 = _slicedToArray(_useUnsavedChangesWar, 3),
        Prompt = _useUnsavedChangesWar2[0],
        setDirty = _useUnsavedChangesWar2[1],
        setPristine = _useUnsavedChangesWar2[2];

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        edit = _useState2[0],
        isEdit = _useState2[1];

    var didMountRef = (0, _react.useRef)(false);

    var _useState3 = (0, _react.useState)(null),
        _useState4 = _slicedToArray(_useState3, 2),
        fetchedSuccess = _useState4[0],
        setFetchedSuccess = _useState4[1];

    // handle fetch outcome


    (0, _react.useEffect)(function () {
        if (didMountRef.current) {
            if (!loading) {
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    (0, _react.useEffect)(function () {
        if (taxonomy) {
            (0, _misc.metaTitle)((0, _localization.translate)("taxonomy_edit.title"));
            dispatch((0, _fetchTaxonomies.fetchTaxonomies)({
                taxonomy: taxonomy
            }));

            isEdit(true);

            if (step) {
                if (fetchedSuccess) {
                    var stepInt = parseInt(step);
                    dispatch((0, _stepsActions.startFromStep)(stepInt, (0, _forms.hydrateTaxonomyFormFromStep)(stepInt, fetched[0])));
                }
            } else {
                dispatch((0, _stepsActions.stepReset)());
            }
        } else {
            (0, _misc.metaTitle)((0, _localization.translate)("taxonomy_create.title"));
            (0, _misc.changeCurrentAdminMenuLink)('#/register_taxonomy');
            dispatch((0, _resetTaxonomies.resetTaxonomies)());
            dispatch((0, _stepsActions.stepReset)());
        }
        setDirty();
    }, [fetchedSuccess]);

    var setPristineHandler = function setPristineHandler() {
        setPristine();
    };

    var steps = [wp.element.createElement(_Basic2.default, { taxonomy: taxonomy, edit: edit, headings: _steps.saveCustomPostTypeHeadings }), wp.element.createElement(_Labels2.default, { taxonomy: taxonomy, headings: _steps.saveCustomPostTypeHeadings }), wp.element.createElement(_Settings2.default, { taxonomy: taxonomy, setPristineHandler: setPristineHandler, headings: _steps.saveCustomPostTypeHeadings })];

    if (!fetchedSuccess) {
        return wp.element.createElement(_Spinner2.default, null);
    }

    return wp.element.createElement(
        _react2.default.Fragment,
        null,
        Prompt,
        wp.element.createElement(_Steps2.default, {
            steps: steps
        })
    );
};

exports.default = SaveTaxonomy;

/***/ }),

/***/ 4644:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

// please refer to
// https://developer.wordpress.org/reference/functions/get_taxonomy_labels/
var taxonomyLabelsList = exports.taxonomyLabelsList = [{
    id: "name",
    label: "Menu Name",
    description: "General name for the taxonomy, usually plural. The same as and overridden by $tax->label. Default 'Tags'/'Categories'."
}, {
    id: "singular_name",
    label: "Singular name",
    description: "Name for one object of this taxonomy. Default 'Tag'/'Category'"
}, {
    id: "search_items",
    label: "Search items",
    description: "Search Tags/Search Categories"
}, {
    id: "popular_items",
    label: "Popular items",
    description: "This label is only used for non-hierarchical taxonomies. Default 'Popular Tags'."
}, {
    id: "all_items",
    label: "All items",
    description: "All Tags'/'All Categories"
}, {
    id: "parent_item",
    label: "Parent item",
    description: "This label is only used for hierarchical taxonomies. Default 'Parent Category'."
}, {
    id: "parent_item_colon",
    label: "Parent item colon",
    description: "The same as parent_item, but with colon : in the end."
}, {
    id: "edit_item",
    label: "Edit item",
    description: "Edit Tag'/'Edit Category."
}, {
    id: "view_item",
    label: "View item",
    description: "View Tag'/'View Category."
}, {
    id: "update_item",
    label: "Update item",
    description: "Update Tag'/'Update Category."
}, {
    id: "add_new_item",
    label: "Add new item",
    description: "Add New Tag'/'Add New Category."
}, {
    id: "new_item_name",
    label: "New item name",
    description: "New Tag Name'/'New Category Name."
}, {
    id: "separate_items_with_commas",
    label: "Separate items with commas",
    description: "This label is only used for non-hierarchical taxonomies. Default 'Separate tags with commas', used in the meta box."
}, {
    id: "add_or_remove_items",
    label: "Add or remove items",
    description: "This label is only used for non-hierarchical taxonomies. Default 'Add or remove tags', used in the meta box when JavaScript is disabled."
}, {
    id: "choose_from_most_used",
    label: "Choose from most used",
    description: "This label is only used on non-hierarchical taxonomies. Default 'Choose from the most used tags', used in the meta box."
}, {
    id: "not_found",
    label: "Not found",
    description: "No tags found'/'No categories found', used in the meta box and taxonomy list table."
}, {
    id: "no_terms",
    label: "No terms",
    description: "No tags'/'No categories', used in the posts and media list tables."
}, {
    id: "filter_by_item",
    label: "Filter by item",
    description: "This label is only used for hierarchical taxonomies. Default 'Filter by category', used in the posts list table."
}, {
    id: "items_list_navigation",
    label: "Items list navigation",
    description: "Label for the table pagination hidden heading."
}, {
    id: "items_list",
    label: "Items list",
    description: "Label for the table hidden heading."
}, {
    id: "most_used",
    label: "Most used",
    description: "Title for the Most Used tab. Default 'Most Used'."
}, {
    id: "back_to_items",
    label: "Back to items",
    description: "Label displayed after a term has been updated."
}];

/***/ }),

/***/ 1141:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fetchTaxonomies = undefined;

var _ajax = __webpack_require__(7569);

var _fetchTaxonomiesActions = __webpack_require__(7783);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetchTaxonomies = exports.fetchTaxonomies = function fetchTaxonomies(meta) {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _context.prev = 0;

                            dispatch((0, _fetchTaxonomiesActions.fetchTaxonomiesInProgress)(meta));
                            _context.next = 4;
                            return (0, _ajax.wpAjaxRequest)('fetchTaxonomiesAction', meta ? meta : {});

                        case 4:
                            fetched = _context.sent;

                            dispatch((0, _fetchTaxonomiesActions.fetchTaxonomiesSuccess)(fetched));
                            _context.next = 11;
                            break;

                        case 8:
                            _context.prev = 8;
                            _context.t0 = _context["catch"](0);

                            dispatch((0, _fetchTaxonomiesActions.fetchTaxonomiesFailure)(_context.t0));

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

/***/ 8623:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.resetTaxonomies = undefined;

var _ajax = __webpack_require__(7569);

var _fetchTaxonomiesActions = __webpack_require__(7783);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var resetTaxonomies = exports.resetTaxonomies = function resetTaxonomies() {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            dispatch((0, _fetchTaxonomiesActions.resetTaxonomiesInProgress)());
                            _context.next = 3;
                            return (0, _ajax.wpAjaxRequest)('resetTaxonomiesAction');

                        case 3:
                            fetched = _context.sent;

                            dispatch((0, _fetchTaxonomiesActions.resetTaxonomiesSuccess)());

                        case 5:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }();
};

/***/ })

}]);
//# sourceMappingURL=407.js.map