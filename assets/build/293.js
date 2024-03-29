(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[293],{

/***/ 7798:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.taxonomyLabels = undefined;

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var taxonomyLabels = exports.taxonomyLabels = [{
    id: "name",
    label: (0, _useTranslation2.default)("Menu Name"),
    description: (0, _useTranslation2.default)("General name for the taxonomy, usually plural. The same as and overridden by $tax->label. Default 'Tags/Categories'.")
}, {
    id: "singular_name",
    label: (0, _useTranslation2.default)("Singular name"),
    description: (0, _useTranslation2.default)("Name for one object of this taxonomy. Default 'Tag/Category'")
}, {
    id: "search_items",
    label: (0, _useTranslation2.default)("Search items"),
    description: (0, _useTranslation2.default)("Search Tags/Search Categories")
}, {
    id: "popular_items",
    label: (0, _useTranslation2.default)("Popular items"),
    description: (0, _useTranslation2.default)("This label is only used for non-hierarchical taxonomies. Default 'Popular Tags'.")
}, {
    id: "all_items",
    label: (0, _useTranslation2.default)("All items"),
    description: (0, _useTranslation2.default)("All Tags/All Categories")
}, {
    id: "parent_item",
    label: (0, _useTranslation2.default)("Parent item"),
    description: (0, _useTranslation2.default)("This label is only used for hierarchical taxonomies. Default 'Parent Category'.")
}, {
    id: "parent_item_colon",
    label: (0, _useTranslation2.default)("Parent item colon"),
    description: (0, _useTranslation2.default)("The same as parent_item, but with colon : in the end.")
}, {
    id: "edit_item",
    label: (0, _useTranslation2.default)("Edit item"),
    description: (0, _useTranslation2.default)("Edit Tag/Edit Category.")
}, {
    id: "view_item",
    label: (0, _useTranslation2.default)("View item"),
    description: (0, _useTranslation2.default)("View Tag/View Category.")
}, {
    id: "update_item",
    label: (0, _useTranslation2.default)("Update item"),
    description: (0, _useTranslation2.default)("Update Tag/Update Category.")
}, {
    id: "add_new_item",
    label: (0, _useTranslation2.default)("Add new item"),
    description: (0, _useTranslation2.default)("Add New Tag/Add New Category.")
}, {
    id: "new_item_name",
    label: (0, _useTranslation2.default)("New item name"),
    description: (0, _useTranslation2.default)("New Tag Name/New Category Name.")
}, {
    id: "separate_items_with_commas",
    label: (0, _useTranslation2.default)("Separate items with commas"),
    description: (0, _useTranslation2.default)("This label is only used for non-hierarchical taxonomies. Default 'Separate tags with commas', used in the meta box.")
}, {
    id: "add_or_remove_items",
    label: (0, _useTranslation2.default)("Add or remove items"),
    description: (0, _useTranslation2.default)("This label is only used for non-hierarchical taxonomies. Default 'Add or remove tags', used in the meta box when JavaScript is disabled.")
}, {
    id: "choose_from_most_used",
    label: (0, _useTranslation2.default)("Choose from most used"),
    description: (0, _useTranslation2.default)("This label is only used on non-hierarchical taxonomies. Default 'Choose from the most used tags', used in the meta box.")
}, {
    id: "not_found",
    label: (0, _useTranslation2.default)("Not found"),
    description: (0, _useTranslation2.default)("No tags found/No categories found', used in the meta box and taxonomy list table.")
}, {
    id: "no_terms",
    label: (0, _useTranslation2.default)("No terms"),
    description: (0, _useTranslation2.default)("No tags/No categories', used in the posts and media list tables.")
}, {
    id: "filter_by_item",
    label: (0, _useTranslation2.default)("Filter by item"),
    description: (0, _useTranslation2.default)("This label is only used for hierarchical taxonomies. Default 'Filter by category', used in the posts list table.")
}, {
    id: "items_list_navigation",
    label: (0, _useTranslation2.default)("Items list navigation"),
    description: (0, _useTranslation2.default)("Label for the table pagination hidden heading.")
}, {
    id: "items_list",
    label: (0, _useTranslation2.default)("Items list"),
    description: (0, _useTranslation2.default)("Label for the table hidden heading.")
}, {
    id: "most_used",
    label: (0, _useTranslation2.default)("Most used"),
    description: (0, _useTranslation2.default)("Title for the Most Used tab. Default 'Most Used'.")
}, {
    id: "back_to_items",
    label: (0, _useTranslation2.default)("Back to items"),
    description: (0, _useTranslation2.default)("Label displayed after a term has been updated.")
}]; // please refer to
// https://developer.wordpress.org/reference/functions/get_taxonomy_labels/

/***/ }),

/***/ 7843:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _reactHookForm = __webpack_require__(930);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _StepsHeader = __webpack_require__(5438);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

var _reactRedux = __webpack_require__(6706);

var _strings = __webpack_require__(8029);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _validation = __webpack_require__(9593);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicStep = function BasicStep(_ref) {
    var title = _ref.title,
        crumbs = _ref.crumbs,
        headings = _ref.headings,
        stepActive = _ref.stepActive,
        setStepActive = _ref.setStepActive,
        handleSubmit = _ref.handleSubmit,
        formValues = _ref.formValues,
        _ref$edit = _ref.edit,
        edit = _ref$edit === undefined ? false : _ref$edit;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomies;
    }),
        data = _useSelector.data;

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all'
    }),
        register = _useForm.register,
        submit = _useForm.handleSubmit,
        setValue = _useForm.setValue,
        errors = _useForm.formState.errors;

    (0, _react.useEffect)(function () {
        if (formValues && formValues[1]) {
            setValue("slug", formValues[1].slug);
            setValue("singular_label", formValues[1].singular_label);
            setValue("plural_label", formValues[1].plural_label);
        }
    }, [formValues]);

    (0, _react.useEffect)(function () {
        if (data.length > 0) {
            setValue("slug", data[0].slug);
            setValue("singular_label", data[0].singular);
            setValue("plural_label", data[0].plural);
        }
    }, [data]);

    var handleSlugChange = function handleSlugChange(slug) {
        setValue('slug', (0, _strings.sluggifyString)(slug, 32));
    };

    var onSubmit = function onSubmit(data) {
        handleSubmit(data, 1);
        setStepActive(1);
    };

    var actions = [wp.element.createElement(
        _Button2.default,
        {
            testId: 'next-step',
            style: _styles.styleVariants.SECONDARY
        },
        (0, _useTranslation2.default)("Next Step")
    )];

    return wp.element.createElement(
        'form',
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
                { style: 'with-shadow' },
                wp.element.createElement(_StepsHeader2.default, {
                    stepActive: stepActive,
                    headings: headings
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Slug"),
                    value: wp.element.createElement(_Input2.default, {
                        id: 'slug',
                        placeholder: (0, _useTranslation2.default)("Slug"),
                        readOnly: data.length > 0,
                        description: (0, _useTranslation2.default)("The post name/slug. Used for various queries for taxonomy content."),
                        onChangeCapture: function onChangeCapture(e) {
                            return handleSlugChange(e.currentTarget.value);
                        },
                        register: register,
                        errors: errors,
                        isRequired: true,
                        validate: {
                            validate: edit ? _validation.isTaxonomySlugValid : _validation.asyncIsTaxonomySlugValid,
                            required: (0, _useTranslation2.default)("This field is mandatory")
                        }
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Singular label"),
                    value: wp.element.createElement(_Input2.default, {
                        id: 'singular_label',
                        placeholder: (0, _useTranslation2.default)("(e.g. Movie)"),
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
                        id: 'plural_label',
                        placeholder: (0, _useTranslation2.default)("(e.g. Movies)"),
                        description: (0, _useTranslation2.default)("Used for the taxonomy admin menu item"),
                        register: register,
                        errors: errors,
                        isRequired: true,
                        validate: {
                            required: (0, _useTranslation2.default)("This field is mandatory")
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

/***/ 3423:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _StepsHeader = __webpack_require__(5438);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

var _taxonomyLabels = __webpack_require__(7798);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

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
        return state.fetchTaxonomies;
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
        setValue = _useForm.setValue,
        errors = _useForm.formState.errors;

    // form default values


    (0, _react.useEffect)(function () {
        if (!edit && formValues && formValues[1]) {
            setValue('name', formValues[1].slug);
            setValue('singular_name', formValues[1].singular_label);
            setValue('search_items', '' + (0, _useTranslation2.default)("Search {{r}}", { r: formValues[1].plural_label }));
            setValue('popular_items', '' + (0, _useTranslation2.default)("Popular {{r}}", { r: formValues[1].plural_label }));
            setValue('all_items', '' + (0, _useTranslation2.default)("All {{r}}", { r: formValues[1].plural_label }));
            setValue('parent_item', '' + (0, _useTranslation2.default)("Parent {{r}}", { r: formValues[1].singular_label }));
            setValue('parent_item_colon', (0, _useTranslation2.default)("Parent item"));
            setValue('edit_item', '' + (0, _useTranslation2.default)("Edit"));
            setValue('view_item', '' + (0, _useTranslation2.default)("View"));
            setValue('update_item', '' + (0, _useTranslation2.default)("Update {{r}}", { r: formValues[1].singular_label }));
            setValue('add_new_item', '' + (0, _useTranslation2.default)("Add new {{r}}", { r: formValues[1].singular_label }));
            setValue('new_item_name', '' + (0, _useTranslation2.default)("New {{r}}", { r: formValues[1].singular_label }));
            setValue('separate_items_with_commas', '' + (0, _useTranslation2.default)("Separate {{r}} with commas", { r: formValues[1].plural_label }));
            setValue('add_or_remove_items', '' + (0, _useTranslation2.default)("Add or remove {{r}}", { r: formValues[1].plural_label }));
            setValue('choose_from_most_used', '' + (0, _useTranslation2.default)("Choose from most used {{r}}", { r: formValues[1].singular_label }));
            setValue('not_found', (0, _useTranslation2.default)("No {{r}} found", { r: formValues[1].singular_label }));
            setValue('no_terms', '' + (0, _useTranslation2.default)("No {{r}}", { r: formValues[1].plural_label }));
            setValue('filter_by_item', '' + (0, _useTranslation2.default)("Filter by {{r}}", { r: formValues[1].singular_label }));
            setValue('items_list_navigation', (0, _useTranslation2.default)("Navigation list {{r}}", { r: formValues[1].plural_label }));
            setValue('items_list', (0, _useTranslation2.default)("List {{r}}", { r: formValues[1].plural_label }));
            setValue('most_used', '' + (0, _useTranslation2.default)("Most used {{r}}", { r: formValues[1].plural_label }));
            setValue('back_to_items', '' + (0, _useTranslation2.default)("Back to {{r}}", { r: formValues[1].plural_label }));
        }
    }, [formValues]);

    (0, _react.useEffect)(function () {
        if (edit && data.length > 0) {
            setValue('name', labels.name);
            setValue('singular_name', labels.singular_name);
            setValue('search_items', labels.search_items);
            setValue('popular_items', labels.popular_items);
            setValue('all_items', labels.all_items);
            setValue('parent_item', labels.parent_item);
            setValue('parent_item_colon', labels.parent_item_colon);
            setValue('edit_item', labels.edit_item);
            setValue('view_item', labels.view_item);
            setValue('update_item', labels.update_item);
            setValue('add_new_item', labels.add_new_item);
            setValue('new_item_name', labels.new_item_name);
            setValue('separate_items_with_commas', labels.separate_items_with_commas);
            setValue('add_or_remove_items', labels.add_or_remove_items);
            setValue('choose_from_most_used', labels.choose_from_most_used);
            setValue('not_found', labels.not_found);
            setValue('no_terms', labels.no_terms);
            setValue('filter_by_item', labels.filter_by_item);
            setValue('items_list_navigation', labels.items_list_navigation);
            setValue('items_list', labels.items_list);
            setValue('most_used', labels.most_used);
            setValue('back_to_items', labels.back_to_items);
        }
    }, [data]);

    var onSubmit = function onSubmit(data) {
        handleSubmit(data, 2);
        setStepActive(2);
    };

    var actions = [wp.element.createElement(
        _Button2.default,
        { testId: 'prev-step', type: 'button', onClick: function onClick() {
                return setStepActive(0);
            }, style: _styles.styleVariants.SECONDARY },
        (0, _useTranslation2.default)("Previous Step")
    ), wp.element.createElement(
        _Button2.default,
        { testId: 'next-step', style: _styles.styleVariants.SECONDARY },
        (0, _useTranslation2.default)("Next Step")
    )];

    return wp.element.createElement(
        'form',
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
                { style: 'with-shadow' },
                wp.element.createElement(_StepsHeader2.default, {
                    stepActive: stepActive,
                    headings: headings
                }),
                _taxonomyLabels.taxonomyLabels.map(function (label) {
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

/***/ 9326:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _propTypes = __webpack_require__(5697);

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Button = __webpack_require__(6337);

var _Button2 = _interopRequireDefault(_Button);

var _reactRedux = __webpack_require__(6706);

var _reactHookForm = __webpack_require__(930);

var _styles = __webpack_require__(624);

var _useTranslation = __webpack_require__(1422);

var _useTranslation2 = _interopRequireDefault(_useTranslation);

var _Layout = __webpack_require__(145);

var _Layout2 = _interopRequireDefault(_Layout);

var _Card = __webpack_require__(1959);

var _Card2 = _interopRequireDefault(_Card);

var _StepsHeader = __webpack_require__(5438);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

var _Toggle = __webpack_require__(8040);

var _Toggle2 = _interopRequireDefault(_Toggle);

var _CardRow = __webpack_require__(1005);

var _CardRow2 = _interopRequireDefault(_CardRow);

var _Input = __webpack_require__(9053);

var _Input2 = _interopRequireDefault(_Input);

var _Checkbox = __webpack_require__(4575);

var _Checkbox2 = _interopRequireDefault(_Checkbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SettingsStep = function SettingsStep(_ref) {
    var title = _ref.title,
        crumbs = _ref.crumbs,
        headings = _ref.headings,
        stepActive = _ref.stepActive,
        setStepActive = _ref.setStepActive,
        handleSubmit = _ref.handleSubmit,
        formValues = _ref.formValues,
        _ref$loading = _ref.loading,
        loading = _ref$loading === undefined ? false : _ref$loading;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomies;
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
            hierarchical: data.length > 0 ? settings.hierarchical : null,
            show_ui: data.length > 0 ? settings.show_ui : null,
            show_in_menu: data.length > 0 ? settings.show_in_menu : null,
            show_in_nav_menus: data.length > 0 ? settings.show_in_nav_menus : null,
            show_in_rest: data.length > 0 ? settings.show_in_rest : null,
            rest_base: data.length > 0 ? settings.rest_base : null,
            rest_controller_class: data.length > 0 ? settings.rest_controller_class : null,
            show_tagcloud: data.length > 0 ? settings.show_tagcloud : null,
            show_in_quick_edit: data.length > 0 ? settings.show_in_quick_edit : null,
            show_admin_column: data.length > 0 ? settings.show_admin_column : null,
            capabilities: data.length > 0 ? settings.capabilities : null,
            rewrite: data.length > 0 ? settings.rewrite : null,
            custom_rewrite: data.length > 0 ? settings.custom_rewrite : null,
            query_var: data.length > 0 ? settings.query_var : null,
            custom_query_var: data.length > 0 ? settings.custom_query_var : null,
            default_term: data.length > 0 ? settings.default_term : null,
            sort: data.length > 0 ? settings.sort : null
        }
    }),
        register = _useForm.register,
        submit = _useForm.handleSubmit,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid,
        setValue = _useForm.setValue,
        watch = _useForm.watch;

    var rewrite = watch("rewrite");
    var query_var = watch("query_var");

    var onSubmit = function onSubmit(data) {
        handleSubmit(data, 3);
    };

    var actions = [wp.element.createElement(
        _Button2.default,
        { testId: 'prev-step', type: 'button', onClick: function onClick() {
                return setStepActive(1);
            }, style: _styles.styleVariants.SECONDARY },
        (0, _useTranslation2.default)("Previous Step")
    ), wp.element.createElement(
        _Button2.default,
        { testId: 'save', style: _styles.styleVariants.PRIMARY, disabled: loading },
        (0, _useTranslation2.default)("Save")
    )];

    return wp.element.createElement(
        'form',
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
                { style: 'with-shadow' },
                wp.element.createElement(_StepsHeader2.default, {
                    stepActive: stepActive,
                    headings: headings
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Is Public"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'public',
                        description: (0, _useTranslation2.default)("Whether a taxonomy is intended for use publicly either via the admin interface or by front-end users."),
                        defaultValue: data.length > 0 ? settings.public : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Publicly queryable"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'publicly_queryable',
                        description: (0, _useTranslation2.default)("Whether the taxonomy is publicly queryable. If not set, the default is inherited from $public."),
                        defaultValue: data.length > 0 ? settings.publicly_queryable : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Hierarchical"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'hierarchical',
                        description: (0, _useTranslation2.default)("Whether the taxonomy is hierarchical. Default false."),
                        defaultValue: data.length > 0 ? settings.hierarchical : false,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in UI"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'show_ui',
                        description: (0, _useTranslation2.default)("Whether to generate and allow a UI for managing terms in this taxonomy in the admin. If not set, the default is inherited from $public (default true)."),
                        defaultValue: data.length > 0 ? settings.show_ui : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in menu"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'show_in_menu',
                        description: (0, _useTranslation2.default)("Whether to show the taxonomy in the admin menu. If true, the taxonomy is shown as a submenu of the object type menu. If false, no menu is shown. $show_ui must be true. If not set, default is inherited from $show_ui (default true)."),
                        defaultValue: data.length > 0 ? settings.show_in_menu : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in nav menus"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'show_in_nav_menus',
                        description: (0, _useTranslation2.default)("Makes this taxonomy available for selection in navigation menus. If not set, the default is inherited from $public (default true)."),
                        defaultValue: data.length > 0 ? settings.show_in_nav_menus : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in REST API"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'show_in_rest',
                        description: (0, _useTranslation2.default)("Whether to include the taxonomy in the REST API. Set this to true for the taxonomy to be available in the block editor. SET TRUE TO ENABLE VISUALIZATION ON GUTEMBERG EDITOR."),
                        defaultValue: data.length > 0 ? settings.show_in_rest : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("REST API base slug"),
                    value: wp.element.createElement(_Input2.default, {
                        id: 'rest_base',
                        placeholder: (0, _useTranslation2.default)("REST API base slug"),
                        description: (0, _useTranslation2.default)("To change the base url of REST API route. Default is $taxonomy."),
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
                    label: (0, _useTranslation2.default)("REST controller class"),
                    value: wp.element.createElement(_Input2.default, {
                        id: 'rest_controller_class',
                        placeholder: (0, _useTranslation2.default)("REST controller class"),
                        description: (0, _useTranslation2.default)("REST API Controller class name. Default is 'WP_REST_Terms_Controller'."),
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
                    label: (0, _useTranslation2.default)("Show Tagcloud"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'show_tagcloud',
                        description: (0, _useTranslation2.default)("Whether to list the taxonomy in the Tag Cloud Widget controls. If not set, the default is inherited from $show_ui (default true)."),
                        defaultValue: data.length > 0 ? settings.show_tagcloud : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show in quick edit"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'show_in_quick_edit',
                        description: (0, _useTranslation2.default)("Whether to show the taxonomy in the quick/bulk edit panel. It not set, the default is inherited from $show_ui (default true)."),
                        defaultValue: data.length > 0 ? settings.show_in_quick_edit : true,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Show admin column"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'show_admin_column',
                        description: (0, _useTranslation2.default)("Whether to display a column for the taxonomy on its post type listing screens. Default false."),
                        defaultValue: data.length > 0 ? settings.show_admin_column : false,
                        register: register,
                        errors: errors
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Capabilities"),
                    value: wp.element.createElement(_Checkbox2.default, {
                        id: 'capabilities',
                        defaultValue: 'post',
                        description: (0, _useTranslation2.default)("Array of capabilities for this taxonomy."),
                        register: register,
                        errors: errors,
                        values: {
                            "manage_terms": {
                                "value": "manage_terms",
                                "checked": data.length > 0 && settings.capabilities ? settings.capabilities.includes('manage_terms') : true
                            },
                            "edit_terms": {
                                "value": "edit_terms",
                                "checked": data.length > 0 && settings.capabilities ? settings.capabilities.includes('edit_terms') : true
                            },
                            "delete_terms": {
                                "value": "delete_terms",
                                "checked": data.length > 0 && settings.capabilities ? settings.capabilities.includes('delete_terms') : true
                            },
                            "assign_terms": {
                                "value": "assign_terms",
                                "checked": data.length > 0 && settings.capabilities ? settings.capabilities.includes('assign_terms') : true
                            }
                        },
                        validate: {
                            maxLength: {
                                value: 255,
                                message: (0, _useTranslation2.default)("max length is 255")
                            }
                        }
                    })
                }),
                wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Rewrite"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'rewrite',
                        description: (0, _useTranslation2.default)("Triggers the handling of rewrites for this taxonomy. Default true, using $taxonomy as slug. To prevent rewrite, set to false. To specify rewrite rules, an array can be passed with any of these keys:"),
                        defaultValue: data.length > 0 ? settings.rewrite : false,
                        register: register,
                        errors: errors
                    })
                }),
                rewrite && wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Custom rewrite rules"),
                    value: wp.element.createElement(_Input2.default, {
                        id: 'custom_rewrite',
                        placeholder: (0, _useTranslation2.default)("Custom rewrite rules"),
                        description: (0, _useTranslation2.default)("Taxonomy slug to use instead of default."),
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
                    label: (0, _useTranslation2.default)("Query var"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'query_var',
                        description: (0, _useTranslation2.default)("Sets the query var key for this taxonomy. Default $taxonomy key. If false, a taxonomy cannot be loaded at ?{query_var}={term_slug}. If a string, the query ?{query_var}={term_slug} will be valid."),
                        defaultValue: data.length > 0 ? settings.query_var : false,
                        register: register,
                        errors: errors
                    })
                }),
                query_var && wp.element.createElement(_CardRow2.default, {
                    label: (0, _useTranslation2.default)("Custom query var"),
                    value: wp.element.createElement(_Input2.default, {
                        id: 'custom_query_var',
                        placeholder: (0, _useTranslation2.default)("Custom query var"),
                        description: (0, _useTranslation2.default)("Custom query var slug to use instead of default."),
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
                    label: (0, _useTranslation2.default)("Default term"),
                    value: wp.element.createElement(_Input2.default, {
                        id: 'default_term',
                        placeholder: (0, _useTranslation2.default)("Default term to be used for the taxonomy."),
                        description: (0, _useTranslation2.default)("Allowed keys: 'name', name of default term.|'slug', Slug for default term.|'description', Description for default term"),
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
                    label: (0, _useTranslation2.default)("Sort"),
                    value: wp.element.createElement(_Toggle2.default, {
                        id: 'sort',
                        description: (0, _useTranslation2.default)("Whether terms in this taxonomy should be sorted in the order they are provided to wp_set_object_terms(). Default null which equates to false."),
                        defaultValue: data.length > 0 ? settings.sort : false,
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
    loading: _propTypes2.default.bool
};

exports.default = SettingsStep;

/***/ }),

/***/ 8293:
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

var _reactRedux = __webpack_require__(6706);

var _Loader = __webpack_require__(9660);

var _Loader2 = _interopRequireDefault(_Loader);

var _ = __webpack_require__(9167);

var _2 = _interopRequireDefault(_);

var _misc = __webpack_require__(3154);

var _fetchTaxonomiesSlice = __webpack_require__(7176);

var _scroll = __webpack_require__(2727);

var _Steps = __webpack_require__(3377);

var _Steps2 = _interopRequireDefault(_Steps);

var _BasicStep = __webpack_require__(7843);

var _BasicStep2 = _interopRequireDefault(_BasicStep);

var _LabelsStep = __webpack_require__(3423);

var _LabelsStep2 = _interopRequireDefault(_LabelsStep);

var _SettingsStep = __webpack_require__(9326);

var _SettingsStep2 = _interopRequireDefault(_SettingsStep);

var _saveTaxonomySlice = __webpack_require__(7668);

var _reactHotToast = __webpack_require__(4500);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var SaveTaxonomy = function SaveTaxonomy(_ref) {
    _objectDestructuringEmpty(_ref);

    // manage global state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.saveTaxonomy;
    }),
        loading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchTaxonomies;
    }),
        fetchLoading = _useSelector2.loading;

    // manage local state


    var _useParams = (0, _reactRouterDom.useParams)(),
        taxonomy = _useParams.taxonomy;

    var _useParams2 = (0, _reactRouterDom.useParams)(),
        step = _useParams2.step;

    var _useState = (0, _react.useState)(false),
        _useState2 = _slicedToArray(_useState, 2),
        edit = _useState2[0],
        isEdit = _useState2[1];

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

    // manage redirect


    var navigate = (0, _reactRouterDom.useNavigate)();

    if (taxonomy === 'category' || taxonomy === 'product_tag') {
        navigate('/');
    }

    (0, _react.useEffect)(function () {
        if (taxonomy) {
            (0, _misc.metaTitle)((0, _useTranslation2.default)("Edit Taxonomy"));
            dispatch((0, _fetchTaxonomiesSlice.fetchTaxonomies)({
                taxonomy: taxonomy
            })).then(function (res) {

                if (res.payload.length !== 1) {
                    setFetchError(true);
                } else {
                    setFormValues({
                        1: {
                            slug: res.payload[0].slug,
                            plural_label: res.payload[0].plural,
                            singular_label: res.payload[0].singular
                        },
                        2: res.payload[0].labels,
                        3: res.payload[0].settings
                    });
                }
            }).catch(function (err) {
                setFetchError(true);
                console.error(err);
            });

            isEdit(true);
        } else {
            (0, _misc.metaTitle)((0, _useTranslation2.default)("Create new Taxonomy"));
            (0, _misc.changeCurrentAdminMenuLink)('#/register_taxonomy');
        }
    }, []);

    var title = taxonomy ? (0, _useTranslation2.default)("Edit Taxonomy") : (0, _useTranslation2.default)("Create new Taxonomy");
    var crumbs = [{
        label: (0, _useTranslation2.default)("Registered Taxonomies"),
        link: "/taxonomies"
    }, {
        label: taxonomy ? (0, _useTranslation2.default)("Edit Taxonomy") : (0, _useTranslation2.default)("Create new Taxonomy")
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
            dispatch((0, _saveTaxonomySlice.saveTaxonomy)(formValues)).then(function (res) {
                var payload = res.payload;

                if (payload.success) {
                    navigate('/taxonomies');
                    _reactHotToast.toast.success((0, _useTranslation2.default)("Taxonomy successfully saved. The browser will refresh after 5 seconds."));
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
                loading: loading
            })],
            activeStep: stepActive
        })
    );
};

exports.default = SaveTaxonomy;

/***/ })

}]);
//# sourceMappingURL=293.js.map