(self["webpackChunkadvanced_custom_post_type_lite"] = self["webpackChunkadvanced_custom_post_type_lite"] || []).push([[75],{

/***/ 9908:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _InputText = __webpack_require__(7388);

var _InputText2 = _interopRequireDefault(_InputText);

var _reactRedux = __webpack_require__(4494);

var _stepsActions = __webpack_require__(4576);

var _StepsButtons = __webpack_require__(2873);

var _StepsButtons2 = _interopRequireDefault(_StepsButtons);

var _Checkboxes = __webpack_require__(2184);

var _Checkboxes2 = _interopRequireDefault(_Checkboxes);

var _ReactSelect = __webpack_require__(2762);

var _ReactSelect2 = _interopRequireDefault(_ReactSelect);

var _dashicons = __webpack_require__(6921);

var _objects = __webpack_require__(4040);

var _strings = __webpack_require__(8029);

var _validation = __webpack_require__(9593);

var _Layout = __webpack_require__(3067);

var _Layout2 = _interopRequireDefault(_Layout);

var _ActionsBar = __webpack_require__(3700);

var _ActionsBar2 = _interopRequireDefault(_ActionsBar);

var _StepsHeader = __webpack_require__(3119);

var _StepsHeader2 = _interopRequireDefault(_StepsHeader);

var _Breadcrumbs = __webpack_require__(5827);

var _Breadcrumbs2 = _interopRequireDefault(_Breadcrumbs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BasicStep = function BasicStep(_ref) {
    var postType = _ref.postType,
        headings = _ref.headings,
        edit = _ref.edit;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
    }),
        fetched = _useSelector.fetched;

    var dispatch = (0, _reactRedux.useDispatch)();

    // handle form
    var supports = [];
    if (fetched.length > 0) {
        supports = fetched[0].supports;
    }

    var _useForm = (0, _reactHookForm.useForm)({
        mode: 'all',
        defaultValues: {
            post_name: fetched.length > 0 ? fetched[0].name : null,
            singular_label: fetched.length > 0 ? fetched[0].singular : null,
            plural_label: fetched.length > 0 ? fetched[0].plural : null,
            icon: fetched.length > 0 ? fetched[0].icon : null
        }
    }),
        control = _useForm.control,
        register = _useForm.register,
        handleSubmit = _useForm.handleSubmit,
        setValue = _useForm.setValue,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid;

    var handlePostNameChange = function handlePostNameChange(post_name) {
        setValue('post_name', (0, _strings.sluggifyString)(post_name, 20));
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
                title: postType ? "Edit Custom Post Type" : "Create new Custom Post Type",
                actions: wp.element.createElement(_StepsButtons2.default, { isValid: isValid, next: 2 })
            }),
            wp.element.createElement(
                "main",
                null,
                wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                        label: "Registered Custom Post Types",
                        link: "/"
                    }, {
                        label: postType ? "Edit Custom Post Type" : "Create new Custom Post Type"
                    }] }),
                wp.element.createElement(
                    "div",
                    { className: "acpt-card" },
                    wp.element.createElement(_StepsHeader2.default, { headings: headings }),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        wp.element.createElement(_InputText2.default, {
                            id: "post_name",
                            label: "Post name",
                            placeholder: "Post name",
                            readOnly: fetched.length > 0,
                            defaultValue: fetched.length > 0 ? fetched[0].name : null,
                            description: "The post name/slug. Used for various queries.",
                            register: register,
                            errors: errors,
                            isRequired: true,
                            onChangeCapture: function onChangeCapture(e) {
                                return handlePostNameChange(e.currentTarget.value);
                            },
                            validate: {
                                validate: edit ? _validation.isPostTypeNameValid : _validation.asyncIsPostTypeNameValid,
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
                            description: "Used for the post type admin menu item",
                            register: register,
                            errors: errors,
                            isRequired: true,
                            validate: {
                                required: "This field is mandatory"
                            } }),
                        wp.element.createElement(_ReactSelect2.default, {
                            id: "icon",
                            label: "Icon",
                            placeholder: "Associated icon",
                            description: "Displayed on the sidebar of the admin panel",
                            control: control,
                            defaultValue: fetched.length > 0 ? (0, _objects.filterByValue)(_dashicons.dashiconList, fetched[0].icon) : null,
                            values: _dashicons.dashiconList,
                            isRequired: true,
                            validate: {
                                required: "This field is mandatory"
                            }
                        }),
                        wp.element.createElement(_Checkboxes2.default, {
                            id: "support",
                            label: "Support",
                            wizard: "Add support for various available post edit features. For more info <a target='_blank' href='https://developer.wordpress.org/reference/functions/register_post_type/#supports'>see here</>.",
                            values: {
                                "title": {
                                    "value": "title",
                                    "checked": supports.length > 0 ? supports.includes('title') : true
                                },
                                "editor": {
                                    "value": "editor",
                                    "checked": supports.length > 0 ? supports.includes('editor') : true
                                },
                                "thumbnail": {
                                    "value": "thumbnail",
                                    "checked": supports.length > 0 ? supports.includes('thumbnail') : true
                                },
                                "excerpt": {
                                    "value": "excerpt",
                                    "checked": supports.length > 0 ? supports.includes('excerpt') : true
                                },
                                "author": {
                                    "value": "author",
                                    "checked": supports.length > 0 ? supports.includes('author') : false
                                },
                                "trackbacks": {
                                    "value": "trackbacks",
                                    "checked": supports.length > 0 ? supports.includes('trackbacks') : false
                                },
                                "custom-fields": {
                                    "value": "custom-fields",
                                    "checked": supports.length > 0 ? supports.includes('custom-fields') : false
                                },
                                "comments": {
                                    "value": "comments",
                                    "checked": supports.length > 0 ? supports.includes('comments') : false
                                },
                                "revisions": {
                                    "value": "revisions",
                                    "checked": supports.length > 0 ? supports.includes('revisions') : false
                                },
                                "page-attributes": {
                                    "value": "page-attributes",
                                    "checked": supports.length > 0 ? supports.includes('page-attributes') : false
                                },
                                "post-formats": {
                                    "value": "post-formats",
                                    "checked": supports.length > 0 ? supports.includes('post-formats') : false
                                }
                            },
                            register: register,
                            errors: errors
                        })
                    )
                )
            )
        )
    );
};

exports.default = BasicStep;

// import React from 'react';
// import {useForm} from "react-hook-form";
// import InputText from "../../reusable/Form/InputText";
// import {useDispatch, useSelector} from "react-redux";
// import {stepForward} from "../../../redux/actions/stepsActions";
// import StepsButtons from "../../reusable/Steps/StepsButtons";
// import Checkboxes from "../../reusable/Form/Checkboxes";
// import ReactSelect from "../../reusable/Form/ReactSelect";
// import {dashiconList} from "../../../constants/dashicons";
// import {filterByValue} from "../../../utils/objects";
// import {sluggifyString} from "../../../utils/strings";
// import {asyncIsPostTypeNameValid, isPostTypeNameValid} from "../../../utils/validation";
//
// const BasicStep = ({edit}) => {
//
//     // manage global state
//     const {fetched} = useSelector(state => state.fetchPostTypesReducer);
//     const dispatch = useDispatch();
//
//     // handle form
//     let supports = [];
//     if(fetched.length > 0){
//         supports = fetched[0].supports;
//     }
//
//     const { control, register, handleSubmit, setValue, formState: {errors, isValid} } = useForm({
//         mode: 'all',
//         defaultValues: {
//             post_name: fetched.length > 0 ? fetched[0].name : null,
//             singular_label: fetched.length > 0 ? fetched[0].singular : null,
//             plural_label: fetched.length > 0 ? fetched[0].plural : null,
//             icon: fetched.length > 0 ? fetched[0].icon : null,
//         }
//     });
//
//     const handlePostNameChange = (post_name) => {
//         setValue('post_name', sluggifyString(post_name, 20));
//     };
//
//     const onSubmit = (data) => {
//         dispatch(stepForward(data));
//     };
//
//     return(
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <div className="acpt-card__inner">
//                 <InputText
//                     id="post_name"
//                     label="Post name"
//                     placeholder="Post name"
//                     readOnly={fetched.length > 0}
//                     defaultValue={fetched.length > 0 ? fetched[0].name : null }
//                     description="The post name/slug. Used for various queries."
//                     register={register}
//                     errors={errors}
//                     isRequired={true}
//                     onChangeCapture={ e => handlePostNameChange(e.currentTarget.value) }
//                     validate={{
//                         validate: edit ? isPostTypeNameValid : asyncIsPostTypeNameValid,
//                         required: "This field is mandatory"
//                     }} />
//                 <InputText
//                     id="singular_label"
//                     label="Singular label"
//                     placeholder="(e.g. Movie)"
//                     defaultValue={fetched.length > 0 ? fetched[0].singular : null }
//                     description="Used when a singular label is needed"
//                     register={register}
//                     errors={errors}
//                     isRequired={true}
//                     validate={{
//                         required: "This field is mandatory"
//                     }} />
//                 <InputText
//                     id="plural_label"
//                     label="Plural label"
//                     placeholder="(e.g. Movies)"
//                     defaultValue={fetched.length > 0 ? fetched[0].plural : null }
//                     description="Used for the post type admin menu item"
//                     register={register}
//                     errors={errors}
//                     isRequired={true}
//                     validate={{
//                         required: "This field is mandatory"
//                     }} />
//                 <ReactSelect
//                     id="icon"
//                     label="Icon"
//                     placeholder="Associated icon"
//                     description="Displayed on the sidebar of the admin panel"
//                     control={control}
//                     defaultValue={fetched.length > 0 ? filterByValue(dashiconList, fetched[0].icon) : null }
//                     values={dashiconList}
//                     isRequired={true}
//                     validate={{
//                         required: "This field is mandatory"
//                     }}
//                 />
//                 <Checkboxes
//                     id="support"
//                     label="Support"
//                     wizard="Add support for various available post edit features. For more info <a target='_blank' href='https://developer.wordpress.org/reference/functions/register_post_type/#supports'>see here</>."
//                     values={{
//                         "title": {
//                             "value": "title",
//                             "checked": supports.length > 0 ? supports.includes('title') : true,
//                         },
//                         "editor": {
//                             "value": "editor",
//                             "checked": supports.length > 0 ? supports.includes('editor') : true,
//                         },
//                         "thumbnail": {
//                             "value": "thumbnail",
//                             "checked": supports.length > 0 ? supports.includes('thumbnail') : true,
//                         },
//                         "excerpt": {
//                             "value": "excerpt",
//                             "checked": supports.length > 0 ? supports.includes('excerpt') : true,
//                         },
//                         "author": {
//                             "value": "author",
//                             "checked": supports.length > 0 ? supports.includes('author') : false,
//                         },
//                         "trackbacks": {
//                             "value": "trackbacks",
//                             "checked": supports.length > 0 ? supports.includes('trackbacks') : false,
//                         },
//                         "custom-fields": {
//                             "value": "custom-fields",
//                             "checked": supports.length > 0 ? supports.includes('custom-fields') : false,
//                         },
//                         "comments": {
//                             "value": "comments",
//                             "checked": supports.length > 0 ? supports.includes('comments') : false,
//                         },
//                         "revisions": {
//                             "value": "revisions",
//                             "checked": supports.length > 0 ? supports.includes('revisions') : false,
//                         },
//                         "page-attributes": {
//                             "value": "page-attributes",
//                             "checked": supports.length > 0 ? supports.includes('page-attributes') : false,
//                         },
//                         "post-formats": {
//                             "value": "post-formats",
//                             "checked": supports.length > 0 ? supports.includes('post-formats') : false,
//                         }
//                     }}
//                     register={register}
//                     errors={errors}
//                  />
//             </div>
//             <StepsButtons isValid={isValid} next={2} />
//         </form>
//     )
// };
//
// export default BasicStep;

/***/ }),

/***/ 9099:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _InputText = __webpack_require__(7388);

var _InputText2 = _interopRequireDefault(_InputText);

var _StepsButtons = __webpack_require__(2873);

var _StepsButtons2 = _interopRequireDefault(_StepsButtons);

var _reactRedux = __webpack_require__(4494);

var _stepsActions = __webpack_require__(4576);

var _label = __webpack_require__(4384);

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
    var postType = _ref.postType,
        headings = _ref.headings;

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.stepsReducer;
    }),
        stepsData = _useSelector.data,
        activeStep = _useSelector.activeStep;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
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
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid,
        setValue = _useForm.setValue;

    // form default values


    (0, _react.useEffect)(function () {
        if (stepsData[1]) {
            setValue('menu_name', fetched.length > 0 ? labels.menu_name : stepsData[1].singular_label);
            setValue('all_items', fetched.length > 0 ? labels.all_items : "" + (0, _localization.translate)("general.labels.all_items", { r: stepsData[1].plural_label }));
            setValue('add_new', fetched.length > 0 ? labels.add_new : (0, _localization.translate)("general.labels.add") + " " + stepsData[1].singular_label);
            setValue('add_new_item', fetched.length > 0 ? labels.add_new_item : (0, _localization.translate)("general.labels.add") + " " + stepsData[1].singular_label);
            setValue('edit_item', fetched.length > 0 ? labels.edit_item : (0, _localization.translate)("general.labels.edit") + " " + stepsData[1].singular_label);
            setValue('new_item', fetched.length > 0 ? labels.new_item : (0, _localization.translate)("general.labels.new") + " " + stepsData[1].singular_label);
            setValue('view_item', fetched.length > 0 ? labels.view_item : (0, _localization.translate)("general.labels.view") + " " + stepsData[1].singular_label);
            setValue('view_items', fetched.length > 0 ? labels.view_items : (0, _localization.translate)("general.labels.view") + " " + stepsData[1].plural_label);
            setValue('search_item', fetched.length > 0 ? labels.search_item : (0, _localization.translate)("general.labels.search") + " " + stepsData[1].plural_label);
            setValue('not_found', fetched.length > 0 ? labels.not_found : (0, _localization.translate)("general.labels.not_found", { r: stepsData[1].singular_label }));
            setValue('not_found_in_trash', fetched.length > 0 ? labels.not_found_in_trash : (0, _localization.translate)("general.labels.not_found", { r: stepsData[1].singular_label }));
            setValue('parent_item_colon', fetched.length > 0 ? labels.parent_item_colon : (0, _localization.translate)("general.labels.parent_item_colon"));
            setValue('featured_image', fetched.length > 0 ? labels.featured_image : (0, _localization.translate)("general.labels.featured_image"));
            setValue('set_featured_image', fetched.length > 0 ? labels.set_featured_image : (0, _localization.translate)("general.labels.set_featured_image"));
            setValue('remove_featured_image', fetched.length > 0 ? labels.remove_featured_image : (0, _localization.translate)("general.labels.remove_featured_image"));
            setValue('use_featured_image', fetched.length > 0 ? labels.use_featured_image : (0, _localization.translate)("general.labels.use_featured_image"));
            setValue('archives', fetched.length > 0 ? labels.archives : (0, _localization.translate)("general.labels.archives"));
            setValue('insert_into_item', fetched.length > 0 ? labels.insert_into_item : (0, _localization.translate)("general.labels.insert_into_item"));
            setValue('uploaded_to_this_item', fetched.length > 0 ? labels.uploaded_to_this_item : (0, _localization.translate)("general.labels.uploaded_to_this_item"));
            setValue('filter_items_list', fetched.length > 0 ? labels.filter_items_list : (0, _localization.translate)("general.labels.filter_items_list", { r: stepsData[1].plural_label }));
            setValue('items_list_navigation', fetched.length > 0 ? labels.items_list_navigation : (0, _localization.translate)("general.labels.items_list_navigation", { r: stepsData[1].plural_label }));
            setValue('items_list', fetched.length > 0 ? labels.items_list : (0, _localization.translate)("general.labels.items_list", { r: stepsData[1].plural_label }));
            setValue('filter_by_date', fetched.length > 0 ? labels.filter_by_date : (0, _localization.translate)("general.labels.filter_by_date"));
            setValue('item_published', fetched.length > 0 ? labels.item_published : (0, _localization.translate)("general.labels.item_published", { r: stepsData[1].singular_label }));
            setValue('item_published_privately', fetched.length > 0 ? labels.item_published_privately : (0, _localization.translate)("general.labels.item_published_privately", { r: stepsData[1].singular_label }));
            setValue('item_reverted_to_draft', fetched.length > 0 ? labels.item_reverted_to_draft : (0, _localization.translate)("general.labels.item_reverted_to_draft", { r: stepsData[1].singular_label }));
            setValue('item_scheduled', fetched.length > 0 ? labels.item_scheduled : (0, _localization.translate)("general.labels.item_scheduled", { r: stepsData[1].singular_label }));
            setValue('item_updated', fetched.length > 0 ? labels.item_updated : (0, _localization.translate)("general.labels.item_updated", { r: stepsData[1].singular_label }));
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
                title: postType ? "Edit Custom Post Type" : "Create new Custom Post Type",
                actions: wp.element.createElement(_StepsButtons2.default, { isValid: isValid, next: 3, prev: 1 })
            }),
            wp.element.createElement(
                "main",
                null,
                wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                        label: "Registered Custom Post Types",
                        link: "/"
                    }, {
                        label: postType ? "Edit Custom Post Type" : "Create new Custom Post Type"
                    }] }),
                wp.element.createElement(
                    "div",
                    { className: "acpt-card" },
                    wp.element.createElement(_StepsHeader2.default, { headings: headings }),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        _label.postLabelsList.map(function (item) {
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
        )
    );
};

exports.default = AdditionalLabelsStep;

/***/ }),

/***/ 9814:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _InputText = __webpack_require__(7388);

var _InputText2 = _interopRequireDefault(_InputText);

var _reactRedux = __webpack_require__(4494);

var _StepsButtons = __webpack_require__(2873);

var _StepsButtons2 = _interopRequireDefault(_StepsButtons);

var _stepsSubmit = __webpack_require__(9218);

var _InputSwitch = __webpack_require__(8195);

var _InputSwitch2 = _interopRequireDefault(_InputSwitch);

var _InputNumber = __webpack_require__(1759);

var _InputNumber2 = _interopRequireDefault(_InputNumber);

var _reactToastify = __webpack_require__(9249);

var _reactRouterDom = __webpack_require__(886);

var _misc = __webpack_require__(3154);

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

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var OtherSettingsStep = function OtherSettingsStep(_ref) {
    var postType = _ref.postType,
        headings = _ref.headings,
        isWPGraphQLActive = _ref.isWPGraphQLActive,
        setPristineHandler = _ref.setPristineHandler;


    // manage redux state
    var dispatch = (0, _reactRedux.useDispatch)();

    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.stepsReducer;
    }),
        stepsData = _useSelector.data,
        activeStep = _useSelector.activeStep,
        stepsErrors = _useSelector.errors,
        success = _useSelector.success,
        loading = _useSelector.loading;

    var _useSelector2 = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
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
            show_ui: fetched.length > 0 ? settings.show_ui : null,
            show_in_menu: fetched.length > 0 ? settings.show_in_menu : null,
            show_in_nav_menus: fetched.length > 0 ? settings.show_in_nav_menus : null,
            show_in_admin_bar: fetched.length > 0 ? settings.show_in_admin_bar : null,
            show_in_rest: fetched.length > 0 ? settings.show_in_rest : null,
            rest_base: fetched.length > 0 ? settings.rest_base : null,
            menu_position: fetched.length > 0 ? settings.menu_position : null,
            capability_type: fetched.length > 0 ? settings.capability_type : 'post',
            has_archive: fetched.length > 0 ? settings.has_archive : null,
            rewrite: fetched.length > 0 ? settings.rewrite : null,
            custom_rewrite: fetched.length > 0 ? settings.custom_rewrite : null,
            query_var: fetched.length > 0 ? settings.query_var : null,
            custom_query_var: fetched.length > 0 ? settings.custom_query_var : null
        }
    }),
        register = _useForm.register,
        handleSubmit = _useForm.handleSubmit,
        setValue = _useForm.setValue,
        setError = _useForm.setError,
        _useForm$formState = _useForm.formState,
        errors = _useForm$formState.errors,
        isValid = _useForm$formState.isValid,
        watch = _useForm.watch;

    // GRAPHQL Integration


    (0, _react.useEffect)(function () {
        if (stepsData[1]) {
            setValue("show_in_graphql", fetched.length > 0 ? settings.show_in_graphql : true);
            setValue("graphql_single_name", fetched.length > 0 ? settings.graphql_single_name : stepsData[1].singular_label);
            setValue("graphql_plural_name", fetched.length > 0 ? settings.graphql_plural_name : stepsData[1].plural_label);
        }
    }, [activeStep]);

    var showInGraphql = watch('show_in_graphql');
    var graphqlSingleName = watch('graphql_single_name');
    var graphqlPluralName = watch('graphql_plural_name');

    var handleGraphQLSingleNameChange = function handleGraphQLSingleNameChange(single_name) {
        if (single_name === graphqlPluralName) {
            return 'Single name MUST be different from plural name';
        }
    };

    var handleGraphQLPluralNameChange = function handleGraphQLPluralNameChange(plural_name) {
        if (plural_name === graphqlSingleName) {
            return 'Different name MUST be different from single name';
        }
    };

    // submit data
    var onSubmit = function () {
        var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(data) {
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            setPristineHandler();
                            _context.next = 3;
                            return dispatch((0, _stepsSubmit.stepsSubmit)('saveCustomPostTypeAction', data));

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
                    history.push('/');
                    _reactToastify.toast.success("Custom post type successfully saved. The browser will refresh after 5 seconds.");
                    (0, _misc.refreshPage)(5000);
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
                title: postType ? "Edit Custom Post Type" : "Create new Custom Post Type",
                actions: wp.element.createElement(_StepsButtons2.default, { isValid: isValid, prev: 2 })
            }),
            wp.element.createElement(
                "main",
                null,
                wp.element.createElement(_Breadcrumbs2.default, { crumbs: [{
                        label: "Registered Custom Post Types",
                        link: "/"
                    }, {
                        label: postType ? "Edit Custom Post Type" : "Create new Custom Post Type"
                    }] }),
                wp.element.createElement(
                    "div",
                    { className: "acpt-card" },
                    wp.element.createElement(_StepsHeader2.default, { headings: headings }),
                    isWPGraphQLActive && wp.element.createElement(
                        "div",
                        { className: "wpgraphql-wrapper" },
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_in_graphql",
                            label: "Show in GraphQL",
                            isRequired: true,
                            description: "Show the custom post type in WPGraphQL.",
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputText2.default, {
                            id: "graphql_single_name",
                            label: "GraphQL single name",
                            placeholder: "Ex. movie",
                            register: register,
                            errors: errors,
                            isRequired: showInGraphql,
                            description: "Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the plural name.",
                            validate: {
                                validate: {
                                    validWPGraphQLName: _validation.validWPGraphQLName,
                                    handleGraphQLSingleNameChange: handleGraphQLSingleNameChange
                                }
                            }
                        }),
                        wp.element.createElement(_InputText2.default, {
                            id: "graphql_plural_name",
                            label: "GraphQL plural name",
                            placeholder: "Ex. movies",
                            register: register,
                            errors: errors,
                            isRequired: showInGraphql,
                            description: "Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the single name.",
                            validate: {
                                validate: {
                                    validWPGraphQLName: _validation.validWPGraphQLName,
                                    handleGraphQLPluralNameChange: handleGraphQLPluralNameChange
                                }
                            }
                        })
                    ),
                    wp.element.createElement(
                        "div",
                        { className: "acpt-card__inner" },
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "public",
                            label: "Is Public",
                            description: "Whether a post type is intended for use publicly either via the admin interface or by front-end users.",
                            defaultValue: fetched.length > 0 ? settings.public : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "publicly_queryable",
                            label: "Publicly queryable",
                            description: "Whether queries can be performed on the front end for the post type as part of parse_request().",
                            defaultValue: fetched.length > 0 ? settings.publicly_queryable : false,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_ui",
                            label: "Show in UI",
                            description: "Whether to generate and allow a UI for managing this post type in the admin. Default is value of $public.",
                            defaultValue: fetched.length > 0 ? settings.show_ui : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_in_menu",
                            label: "Show in menu",
                            description: "Where to show the post type in the admin menu. To work, $show_ui must be true. If true, the post type is shown in its own top level menu. If false, no menu is shown.",
                            defaultValue: fetched.length > 0 ? settings.show_in_menu : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_in_nav_menus",
                            label: "Show in nav menus",
                            description: "Makes this post type available for selection in navigation menus. Default is value of $public.",
                            defaultValue: fetched.length > 0 ? settings.show_in_nav_menus : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_in_admin_bar",
                            label: "Show in admin bar",
                            description: "Makes this post type available via the admin bar. Default is value of $show_in_menu.",
                            defaultValue: fetched.length > 0 ? settings.show_in_admin_bar : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "show_in_rest",
                            label: "Show in REST API",
                            description: "Whether to include the post type in the REST API. Set this to true for the post type to be available in the block editor. SET TRUE TO ENABLE GUTEMBERG EDITOR.",
                            defaultValue: fetched.length > 0 ? settings.show_in_rest : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputText2.default, {
                            id: "rest_base",
                            label: "REST API base slug",
                            placeholder: "REST API base slug",
                            register: register,
                            errors: errors,
                            description: "To change the base url of REST API route. Default is $post_type.",
                            validate: {
                                maxLength: {
                                    value: 255,
                                    message: "min length is 255"
                                }
                            }
                        }),
                        wp.element.createElement(_InputNumber2.default, {
                            id: "menu_position",
                            min: "5",
                            max: "100",
                            label: "Menu position",
                            placeholder: "Menu position",
                            register: register,
                            errors: errors,
                            description: "The position in the menu order the post type should appear. To work, $show_in_menu must be true. Default null (at the bottom).",
                            validate: {
                                min: {
                                    value: 5,
                                    message: "min length is 5"
                                },
                                max: {
                                    value: 100,
                                    message: "max length is 100"
                                }
                            }
                        }),
                        wp.element.createElement(_InputText2.default, {
                            id: "capability_type",
                            label: "Capability type",
                            placeholder: "Capability type",
                            register: register,
                            errors: errors,
                            defaultValue: "post",
                            description: "The string to use to build the read, edit, and delete capabilities. May be passed as an array to allow for alternative plurals when using this argument as a base to construct the capabilities, e.g. array('story', 'stories'). Default 'post'.",
                            validate: {
                                maxLength: {
                                    value: 255,
                                    message: "min length is 255"
                                }
                            }
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "has_archive",
                            label: "Has archive",
                            description: "Whether there should be post type archives, or if a string, the archive slug to use. Will generate the proper rewrite rules if $rewrite is enabled.",
                            defaultValue: fetched.length > 0 ? settings.has_archive : true,
                            register: register,
                            errors: errors
                        }),
                        wp.element.createElement(_InputSwitch2.default, {
                            id: "rewrite",
                            label: "Rewrite",
                            description: "Whether there should be post type archives, or if a string, the archive slug to use. Will generate the proper rewrite rules if $rewrite is enabled.",
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
                            description: "Sets the query_var key for this post type. Defaults to $post_type key. If false, a post type cannot be loaded at ?{query_var}={post_slug}. If specified as a string, the query ?{query_var_string}={post_slug} will be valid.",
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
                        })
                    )
                )
            )
        )
    );
};

exports.default = OtherSettingsStep;

/***/ }),

/***/ 5075:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _Settings = __webpack_require__(9814);

var _Settings2 = _interopRequireDefault(_Settings);

var _Basic = __webpack_require__(9908);

var _Basic2 = _interopRequireDefault(_Basic);

var _Labels = __webpack_require__(9099);

var _Labels2 = _interopRequireDefault(_Labels);

var _Steps = __webpack_require__(5832);

var _Steps2 = _interopRequireDefault(_Steps);

var _steps = __webpack_require__(9500);

var _misc = __webpack_require__(3154);

var _reactRouterDom = __webpack_require__(886);

var _reactRedux = __webpack_require__(4494);

var _fetchPostTypes = __webpack_require__(4825);

var _Spinner = __webpack_require__(7410);

var _Spinner2 = _interopRequireDefault(_Spinner);

var _resetPostTypes = __webpack_require__(3648);

var _useUnsavedChangesWarning = __webpack_require__(9755);

var _useUnsavedChangesWarning2 = _interopRequireDefault(_useUnsavedChangesWarning);

var _stepsActions = __webpack_require__(4576);

var _forms = __webpack_require__(9207);

var _ajax = __webpack_require__(7569);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SaveCustomPostType = function SaveCustomPostType() {

    // manage global state
    var _useSelector = (0, _reactRedux.useSelector)(function (state) {
        return state.fetchPostTypesReducer;
    }),
        fetched = _useSelector.fetched,
        loading = _useSelector.loading;

    var dispatch = (0, _reactRedux.useDispatch)();

    // manage local state

    var _useParams = (0, _reactRouterDom.useParams)(),
        postType = _useParams.postType;

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

    var _useState5 = (0, _react.useState)(false),
        _useState6 = _slicedToArray(_useState5, 2),
        isWPGraphQLActive = _useState6[0],
        setIsWPGraphQLActive = _useState6[1];

    // manage redirect


    var history = (0, _reactRouterDom.useHistory)();

    if (postType === 'page' || postType === 'post') {
        history.push('/');
    }

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
        if (postType) {
            (0, _misc.metaTitle)("Edit Custom Post Type");
            dispatch((0, _fetchPostTypes.fetchPostTypes)({
                postType: postType
            }));

            isEdit(true);

            if (step) {
                if (fetchedSuccess) {
                    var stepInt = parseInt(step);
                    dispatch((0, _stepsActions.startFromStep)(stepInt, (0, _forms.hydratePostTypeFormFromStep)(stepInt, fetched[0])));
                }
            } else {
                dispatch((0, _stepsActions.stepReset)());
            }
        } else {
            (0, _misc.metaTitle)("Register new Custom Post Type");
            (0, _misc.changeCurrentAdminMenuLink)('#/register');
            dispatch((0, _resetPostTypes.resetPostTypes)());
            dispatch((0, _stepsActions.stepReset)());
        }
        setDirty();
    }, [fetchedSuccess]);

    var setPristineHandler = function setPristineHandler() {
        setPristine();
    };

    var steps = [wp.element.createElement(_Basic2.default, { postType: postType, edit: edit, headings: _steps.saveCustomPostTypeHeadings }), wp.element.createElement(_Labels2.default, { postType: postType, headings: _steps.saveCustomPostTypeHeadings }), wp.element.createElement(_Settings2.default, { postType: postType, isWPGraphQLActive: false, headings: _steps.saveCustomPostTypeHeadings, setPristineHandler: setPristineHandler })];

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

exports.default = SaveCustomPostType;

/***/ }),

/***/ 2626:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

__webpack_require__(4065);

var _react3 = __webpack_require__(6229);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DashiconListElement = function DashiconListElement(_ref) {
    var icon = _ref.icon;

    return wp.element.createElement(
        'div',
        { className: 'dashicon-element' },
        wp.element.createElement(_react3.Icon, { icon: 'dashicons:' + icon, width: '18px' }),
        wp.element.createElement(
            'span',
            { className: 'dashicon-label' },
            icon
        )
    );
};

exports.default = DashiconListElement;

/***/ }),

/***/ 1759:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var InputNumber = function InputNumber(_ref) {
    var id = _ref.id,
        label = _ref.label,
        placeholder = _ref.placeholder,
        validate = _ref.validate,
        register = _ref.register,
        errors = _ref.errors,
        min = _ref.min,
        max = _ref.max,
        step = _ref.step,
        isRequired = _ref.isRequired,
        description = _ref.description,
        wizard = _ref.wizard;


    var error = errors[id];

    return wp.element.createElement(
        "div",
        { className: "acpt-form-group" },
        wp.element.createElement(
            "div",
            { className: "acpt-form-label-wrapper" },
            wp.element.createElement(
                "label",
                { htmlFor: id },
                label,
                isRequired && wp.element.createElement(
                    "span",
                    { className: "required" },
                    "*"
                )
            ),
            wizard && wp.element.createElement("span", { className: "wizard", dangerouslySetInnerHTML: { __html: wizard } })
        ),
        wp.element.createElement(
            "div",
            { className: "acpt-form-control-wrapper" },
            wp.element.createElement("input", _extends({
                id: id,
                name: id,
                type: "number",
                min: min ? min : 0,
                max: max,
                step: step ? min : 1,
                placeholder: placeholder,
                required: isRequired,
                "aria-invalid": error ? "true" : "false",
                className: "acpt-form-control " + (error ? 'has-errors' : '')
            }, register(id, validate))),
            description && wp.element.createElement(
                "span",
                { className: "description" },
                description
            ),
            error && wp.element.createElement(
                "div",
                { className: "invalid-feedback" },
                error.message
            )
        )
    );
};

exports.default = InputNumber;

/***/ }),

/***/ 2762:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

var _reactSelect = __webpack_require__(3442);

var _reactSelect2 = _interopRequireDefault(_reactSelect);

var _react = __webpack_require__(7294);

var _react2 = _interopRequireDefault(_react);

var _reactHookForm = __webpack_require__(930);

var _styles = __webpack_require__(624);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ReactSelect = function ReactSelect(_ref) {
    var id = _ref.id,
        label = _ref.label,
        validate = _ref.validate,
        control = _ref.control,
        values = _ref.values,
        defaultValue = _ref.defaultValue,
        isRequired = _ref.isRequired,
        description = _ref.description,
        wizard = _ref.wizard;


    return wp.element.createElement(
        "div",
        { className: "acpt-form-group" },
        wp.element.createElement(
            "div",
            { className: "acpt-form-label-wrapper" },
            wp.element.createElement(
                "label",
                { htmlFor: id },
                label,
                isRequired && wp.element.createElement(
                    "span",
                    { className: "required" },
                    "*"
                )
            ),
            wizard && wp.element.createElement("span", { className: "wizard", dangerouslySetInnerHTML: { __html: wizard } })
        ),
        wp.element.createElement(
            "div",
            { className: "acpt-form-control-wrapper" },
            wp.element.createElement(_reactHookForm.Controller, {
                id: id,
                control: control,
                name: id,
                rules: validate,
                render: function render(_ref2) {
                    var _ref2$field = _ref2.field,
                        onChange = _ref2$field.onChange,
                        onBlur = _ref2$field.onBlur,
                        value = _ref2$field.value,
                        name = _ref2$field.name,
                        ref = _ref2$field.ref,
                        _ref2$fieldState = _ref2.fieldState,
                        invalid = _ref2$fieldState.invalid,
                        isTouched = _ref2$fieldState.isTouched,
                        isDirty = _ref2$fieldState.isDirty,
                        error = _ref2$fieldState.error,
                        formState = _ref2.formState;
                    return wp.element.createElement(
                        "div",
                        null,
                        wp.element.createElement(_reactSelect2.default, {
                            defaultValue: defaultValue,
                            styles: _styles.reactSelectStyles,
                            classNamePrefix: "addl-class",
                            onBlur: onBlur,
                            onChange: onChange,
                            checked: value,
                            inputRef: ref,
                            options: values
                        }),
                        error && wp.element.createElement(
                            "div",
                            { className: "invalid-feedback" },
                            error.message
                        )
                    );
                }
            }),
            description && wp.element.createElement(
                "span",
                { className: "description" },
                description
            )
        )
    );
};

exports.default = ReactSelect;

/***/ }),

/***/ 6921:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.dashiconList = undefined;

var _DashiconListElement = __webpack_require__(2626);

var _DashiconListElement2 = _interopRequireDefault(_DashiconListElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dashiconList = exports.dashiconList = [{ value: 'admin-appearance', label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-appearance" }) }, { value: "admin-collapse", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-collapse" }) }, { value: "admin-comments", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-comments" }) }, { value: "admin-customizer", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-customizer" }) }, { value: "admin-generic", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-generic" }) }, { value: "admin-home", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-home" }) }, { value: "admin-links", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-links" }) }, { value: "admin-media", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-media" }) }, { value: "admin-multisite", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-multisite" }) }, { value: "admin-network", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-network" }) }, { value: "admin-page", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-page" }) }, { value: "admin-plugins", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-plugins" }) }, { value: "admin-post", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-post" }) }, { value: "admin-settings", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-settings" }) }, { value: "admin-site-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-site-alt" }) }, { value: "admin-site-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-site-alt2" }) }, { value: "admin-site-alt3", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-site-alt3" }) }, { value: "admin-site", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-site" }) }, { value: "admin-tools", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-tools" }) }, { value: "admin-users", label: wp.element.createElement(_DashiconListElement2.default, { icon: "admin-users" }) }, { value: "airplane", label: wp.element.createElement(_DashiconListElement2.default, { icon: "airplane" }) }, { value: "album", label: wp.element.createElement(_DashiconListElement2.default, { icon: "album" }) }, { value: "align-center", label: wp.element.createElement(_DashiconListElement2.default, { icon: "align-center" }) }, { value: "align-full-width", label: wp.element.createElement(_DashiconListElement2.default, { icon: "align-full-width" }) }, { value: "align-left", label: wp.element.createElement(_DashiconListElement2.default, { icon: "align-left" }) }, { value: "align-none", label: wp.element.createElement(_DashiconListElement2.default, { icon: "align-none" }) }, { value: "align-pull-left", label: wp.element.createElement(_DashiconListElement2.default, { icon: "align-pull-left" }) }, { value: "align-pull-right", label: wp.element.createElement(_DashiconListElement2.default, { icon: "align-pull-right" }) }, { value: "align-right", label: wp.element.createElement(_DashiconListElement2.default, { icon: "align-right" }) }, { value: "align-wide", label: wp.element.createElement(_DashiconListElement2.default, { icon: "align-wide" }) }, { value: "amazon", label: wp.element.createElement(_DashiconListElement2.default, { icon: "amazon" }) }, { value: "analytics", label: wp.element.createElement(_DashiconListElement2.default, { icon: "analytics" }) }, { value: "archive", label: wp.element.createElement(_DashiconListElement2.default, { icon: "archive" }) }, { value: "arrow-down-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-down-alt" }) }, { value: "arrow-down-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-down-alt2" }) }, { value: "arrow-down", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-down" }) }, { value: "arrow-left-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-left-alt" }) }, { value: "arrow-left-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-left-alt2" }) }, { value: "arrow-left", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-left" }) }, { value: "arrow-right-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-right-alt" }) }, { value: "arrow-right-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-right-alt2" }) }, { value: "arrow-right", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-right" }) }, { value: "arrow-up-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-up-alt" }) }, { value: "arrow-up-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-up-alt2" }) }, { value: "arrow-up-duplicate", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-up-duplicate" }) }, { value: "arrow-up", label: wp.element.createElement(_DashiconListElement2.default, { icon: "arrow-up" }) }, { value: "art", label: wp.element.createElement(_DashiconListElement2.default, { icon: "art" }) }, { value: "awards", label: wp.element.createElement(_DashiconListElement2.default, { icon: "awards" }) }, { value: "backup", label: wp.element.createElement(_DashiconListElement2.default, { icon: "backup" }) }, { value: "bank", label: wp.element.createElement(_DashiconListElement2.default, { icon: "bank" }) }, { value: "beer", label: wp.element.createElement(_DashiconListElement2.default, { icon: "beer" }) }, { value: "bell", label: wp.element.createElement(_DashiconListElement2.default, { icon: "bell" }) }, { value: "block-default", label: wp.element.createElement(_DashiconListElement2.default, { icon: "block-default" }) }, { value: "book-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "book-alt" }) }, { value: "book", label: wp.element.createElement(_DashiconListElement2.default, { icon: "book" }) }, { value: "buddicons-activity", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-activity" }) }, { value: "buddicons-bbpress-logo", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-bbpress-logo" }) }, { value: "buddicons-buddypress-logo", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-buddypress-logo" }) }, { value: "buddicons-community", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-community" }) }, { value: "buddicons-forums", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-forums" }) }, { value: "buddicons-friends", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-friends" }) }, { value: "buddicons-groups", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-groups" }) }, { value: "buddicons-pm", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-pm" }) }, { value: "buddicons-replies", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-replies" }) }, { value: "buddicons-topics", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-topics" }) }, { value: "buddicons-tracking", label: wp.element.createElement(_DashiconListElement2.default, { icon: "buddicons-tracking" }) }, { value: "building", label: wp.element.createElement(_DashiconListElement2.default, { icon: "building" }) }, { value: "businessman", label: wp.element.createElement(_DashiconListElement2.default, { icon: "businessman" }) }, { value: "businessperson", label: wp.element.createElement(_DashiconListElement2.default, { icon: "businessperson" }) }, { value: "businesswoman", label: wp.element.createElement(_DashiconListElement2.default, { icon: "businesswoman" }) }, { value: "button", label: wp.element.createElement(_DashiconListElement2.default, { icon: "button" }) }, { value: "calculator", label: wp.element.createElement(_DashiconListElement2.default, { icon: "calculator" }) }, { value: "calendar-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "calendar-alt" }) }, { value: "calendar", label: wp.element.createElement(_DashiconListElement2.default, { icon: "calendar" }) }, { value: "camera-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "camera-alt" }) }, { value: "camera", label: wp.element.createElement(_DashiconListElement2.default, { icon: "camera" }) }, { value: "car", label: wp.element.createElement(_DashiconListElement2.default, { icon: "car" }) }, { value: "carrot", label: wp.element.createElement(_DashiconListElement2.default, { icon: "carrot" }) }, { value: "cart", label: wp.element.createElement(_DashiconListElement2.default, { icon: "cart" }) }, { value: "category", label: wp.element.createElement(_DashiconListElement2.default, { icon: "category" }) }, { value: "chart-area", label: wp.element.createElement(_DashiconListElement2.default, { icon: "chart-area" }) }, { value: "chart-bar", label: wp.element.createElement(_DashiconListElement2.default, { icon: "chart-bar" }) }, { value: "chart-line", label: wp.element.createElement(_DashiconListElement2.default, { icon: "chart-line" }) }, { value: "chart-pie", label: wp.element.createElement(_DashiconListElement2.default, { icon: "chart-pie" }) }, { value: "clipboard", label: wp.element.createElement(_DashiconListElement2.default, { icon: "clipboard" }) }, { value: "clock", label: wp.element.createElement(_DashiconListElement2.default, { icon: "clock" }) }, { value: "cloud-saved", label: wp.element.createElement(_DashiconListElement2.default, { icon: "cloud-saved" }) }, { value: "cloud-upload", label: wp.element.createElement(_DashiconListElement2.default, { icon: "cloud-upload" }) }, { value: "cloud", label: wp.element.createElement(_DashiconListElement2.default, { icon: "cloud" }) }, { value: "code-standards", label: wp.element.createElement(_DashiconListElement2.default, { icon: "code-standards" }) }, { value: "coffee", label: wp.element.createElement(_DashiconListElement2.default, { icon: "coffee" }) }, { value: "color-picker", label: wp.element.createElement(_DashiconListElement2.default, { icon: "color-picker" }) }, { value: "columns", label: wp.element.createElement(_DashiconListElement2.default, { icon: "columns" }) }, { value: "controls-back", label: wp.element.createElement(_DashiconListElement2.default, { icon: "controls-back" }) }, { value: "controls-forward", label: wp.element.createElement(_DashiconListElement2.default, { icon: "controls-forward" }) }, { value: "controls-pause", label: wp.element.createElement(_DashiconListElement2.default, { icon: "controls-pause" }) }, { value: "controls-play", label: wp.element.createElement(_DashiconListElement2.default, { icon: "controls-play" }) }, { value: "controls-repeat", label: wp.element.createElement(_DashiconListElement2.default, { icon: "controls-repeat" }) }, { value: "controls-skipback", label: wp.element.createElement(_DashiconListElement2.default, { icon: "controls-skipback" }) }, { value: "controls-skipforward", label: wp.element.createElement(_DashiconListElement2.default, { icon: "controls-skipforward" }) }, { value: "controls-volumeoff", label: wp.element.createElement(_DashiconListElement2.default, { icon: "controls-volumeoff" }) }, { value: "controls-volumeon", label: wp.element.createElement(_DashiconListElement2.default, { icon: "controls-volumeon" }) }, { value: "cover-image", label: wp.element.createElement(_DashiconListElement2.default, { icon: "cover-image" }) }, { value: "dashboard", label: wp.element.createElement(_DashiconListElement2.default, { icon: "dashboard" }) }, { value: "database-add", label: wp.element.createElement(_DashiconListElement2.default, { icon: "database-add" }) }, { value: "database-export", label: wp.element.createElement(_DashiconListElement2.default, { icon: "database-export" }) }, { value: "database-import", label: wp.element.createElement(_DashiconListElement2.default, { icon: "database-import" }) }, { value: "database-remove", label: wp.element.createElement(_DashiconListElement2.default, { icon: "database-remove" }) }, { value: "database-view", label: wp.element.createElement(_DashiconListElement2.default, { icon: "database-view" }) }, { value: "database", label: wp.element.createElement(_DashiconListElement2.default, { icon: "database" }) }, { value: "desktop", label: wp.element.createElement(_DashiconListElement2.default, { icon: "desktop" }) }, { value: "dismiss", label: wp.element.createElement(_DashiconListElement2.default, { icon: "dismiss" }) }, { value: "download", label: wp.element.createElement(_DashiconListElement2.default, { icon: "download" }) }, { value: "drumstick", label: wp.element.createElement(_DashiconListElement2.default, { icon: "drumstick" }) }, { value: "edit-large", label: wp.element.createElement(_DashiconListElement2.default, { icon: "edit-large" }) }, { value: "edit-page", label: wp.element.createElement(_DashiconListElement2.default, { icon: "edit-page" }) }, { value: "edit", label: wp.element.createElement(_DashiconListElement2.default, { icon: "edit" }) }, { value: "editor-aligncenter", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-aligncenter" }) }, { value: "editor-alignleft", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-alignleft" }) }, { value: "editor-alignright", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-alignright" }) }, { value: "editor-bold", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-bold" }) }, { value: "editor-break", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-break" }) }, { value: "editor-code-duplicate", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-code-duplicate" }) }, { value: "editor-code", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-code" }) }, { value: "editor-contract", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-contract" }) }, { value: "editor-customchar", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-customchar" }) }, { value: "editor-expand", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-expand" }) }, { value: "editor-help", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-help" }) }, { value: "editor-indent", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-indent" }) }, { value: "editor-insertmore", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-insertmore" }) }, { value: "editor-italic", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-italic" }) }, { value: "editor-justify", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-justify" }) }, { value: "editor-kitchensink", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-kitchensink" }) }, { value: "editor-ltr", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-ltr" }) }, { value: "editor-ol-rtl", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-ol-rtl" }) }, { value: "editor-ol", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-ol" }) }, { value: "editor-outdent", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-outdent" }) }, { value: "editor-paragraph", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-paragraph" }) }, { value: "editor-paste-text", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-paste-text" }) }, { value: "editor-paste-word", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-paste-word" }) }, { value: "editor-quote", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-quote" }) }, { value: "editor-removeformatting", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-removeformatting" }) }, { value: "editor-rtl", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-rtl" }) }, { value: "editor-spellcheck", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-spellcheck" }) }, { value: "editor-strikethrough", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-strikethrough" }) }, { value: "editor-table", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-table" }) }, { value: "editor-textcolor", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-textcolor" }) }, { value: "editor-ul", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-ul" }) }, { value: "editor-underline", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-underline" }) }, { value: "editor-unlink", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-unlink" }) }, { value: "editor-video", label: wp.element.createElement(_DashiconListElement2.default, { icon: "editor-video" }) }, { value: "ellipsis", label: wp.element.createElement(_DashiconListElement2.default, { icon: "ellipsis" }) }, { value: "email-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "email-alt" }) }, { value: "email-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "email-alt2" }) }, { value: "email", label: wp.element.createElement(_DashiconListElement2.default, { icon: "email" }) }, { value: "embed-audio", label: wp.element.createElement(_DashiconListElement2.default, { icon: "embed-audio" }) }, { value: "embed-generic", label: wp.element.createElement(_DashiconListElement2.default, { icon: "embed-generic" }) }, { value: "embed-photo", label: wp.element.createElement(_DashiconListElement2.default, { icon: "embed-photo" }) }, { value: "embed-post", label: wp.element.createElement(_DashiconListElement2.default, { icon: "embed-post" }) }, { value: "embed-video", label: wp.element.createElement(_DashiconListElement2.default, { icon: "embed-video" }) }, { value: "excerpt-view", label: wp.element.createElement(_DashiconListElement2.default, { icon: "excerpt-view" }) }, { value: "exit", label: wp.element.createElement(_DashiconListElement2.default, { icon: "exit" }) }, { value: "external", label: wp.element.createElement(_DashiconListElement2.default, { icon: "external" }) }, { value: "facebook-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "facebook-alt" }) }, { value: "facebook", label: wp.element.createElement(_DashiconListElement2.default, { icon: "facebook" }) }, { value: "feedback", label: wp.element.createElement(_DashiconListElement2.default, { icon: "feedback" }) }, { value: "filter", label: wp.element.createElement(_DashiconListElement2.default, { icon: "filter" }) }, { value: "flag", label: wp.element.createElement(_DashiconListElement2.default, { icon: "flag" }) }, { value: "food", label: wp.element.createElement(_DashiconListElement2.default, { icon: "food" }) }, { value: "format-aside", label: wp.element.createElement(_DashiconListElement2.default, { icon: "format-aside" }) }, { value: "format-audio", label: wp.element.createElement(_DashiconListElement2.default, { icon: "format-audio" }) }, { value: "format-chat", label: wp.element.createElement(_DashiconListElement2.default, { icon: "format-chat" }) }, { value: "format-gallery", label: wp.element.createElement(_DashiconListElement2.default, { icon: "format-gallery" }) }, { value: "format-image", label: wp.element.createElement(_DashiconListElement2.default, { icon: "format-image" }) }, { value: "format-quote", label: wp.element.createElement(_DashiconListElement2.default, { icon: "format-quote" }) }, { value: "format-status", label: wp.element.createElement(_DashiconListElement2.default, { icon: "format-status" }) }, { value: "format-video", label: wp.element.createElement(_DashiconListElement2.default, { icon: "format-video" }) }, { value: "forms", label: wp.element.createElement(_DashiconListElement2.default, { icon: "forms" }) }, { value: "fullscreen-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "fullscreen-alt" }) }, { value: "fullscreen-exit-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "fullscreen-exit-alt" }) }, { value: "games", label: wp.element.createElement(_DashiconListElement2.default, { icon: "games" }) }, { value: "google", label: wp.element.createElement(_DashiconListElement2.default, { icon: "google" }) }, { value: "googleplus", label: wp.element.createElement(_DashiconListElement2.default, { icon: "googleplus" }) }, { value: "grid-view", label: wp.element.createElement(_DashiconListElement2.default, { icon: "grid-view" }) }, { value: "groups", label: wp.element.createElement(_DashiconListElement2.default, { icon: "groups" }) }, { value: "hammer", label: wp.element.createElement(_DashiconListElement2.default, { icon: "hammer" }) }, { value: "heading", label: wp.element.createElement(_DashiconListElement2.default, { icon: "heading" }) }, { value: "heart", label: wp.element.createElement(_DashiconListElement2.default, { icon: "heart" }) }, { value: "hidden", label: wp.element.createElement(_DashiconListElement2.default, { icon: "hidden" }) }, { value: "hourglass", label: wp.element.createElement(_DashiconListElement2.default, { icon: "hourglass" }) }, { value: "html", label: wp.element.createElement(_DashiconListElement2.default, { icon: "html" }) }, { value: "id-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "id-alt" }) }, { value: "id", label: wp.element.createElement(_DashiconListElement2.default, { icon: "id" }) }, { value: "image-crop", label: wp.element.createElement(_DashiconListElement2.default, { icon: "image-crop" }) }, { value: "image-filter", label: wp.element.createElement(_DashiconListElement2.default, { icon: "image-filter" }) }, { value: "image-flip-horizontal", label: wp.element.createElement(_DashiconListElement2.default, { icon: "image-flip-horizontal" }) }, { value: "image-flip-vertical", label: wp.element.createElement(_DashiconListElement2.default, { icon: "image-flip-vertical" }) }, { value: "image-rotate-left", label: wp.element.createElement(_DashiconListElement2.default, { icon: "image-rotate-left" }) }, { value: "image-rotate-right", label: wp.element.createElement(_DashiconListElement2.default, { icon: "image-rotate-right" }) }, { value: "image-rotate", label: wp.element.createElement(_DashiconListElement2.default, { icon: "image-rotate" }) }, { value: "images-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "images-alt" }) }, { value: "images-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "images-alt2" }) }, { value: "index-card", label: wp.element.createElement(_DashiconListElement2.default, { icon: "index-card" }) }, { value: "info-outline", label: wp.element.createElement(_DashiconListElement2.default, { icon: "info-outline" }) }, { value: "info", label: wp.element.createElement(_DashiconListElement2.default, { icon: "info" }) }, { value: "insert-after", label: wp.element.createElement(_DashiconListElement2.default, { icon: "insert-after" }) }, { value: "insert-before", label: wp.element.createElement(_DashiconListElement2.default, { icon: "insert-before" }) }, { value: "insert", label: wp.element.createElement(_DashiconListElement2.default, { icon: "insert" }) }, { value: "instagram", label: wp.element.createElement(_DashiconListElement2.default, { icon: "instagram" }) }, { value: "laptop", label: wp.element.createElement(_DashiconListElement2.default, { icon: "laptop" }) }, { value: "layout", label: wp.element.createElement(_DashiconListElement2.default, { icon: "layout" }) }, { value: "leftright", label: wp.element.createElement(_DashiconListElement2.default, { icon: "leftright" }) }, { value: "lightbulb", label: wp.element.createElement(_DashiconListElement2.default, { icon: "lightbulb" }) }, { value: "linkedin", label: wp.element.createElement(_DashiconListElement2.default, { icon: "linkedin" }) }, { value: "list-view", label: wp.element.createElement(_DashiconListElement2.default, { icon: "list-view" }) }, { value: "location-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "location-alt" }) }, { value: "location", label: wp.element.createElement(_DashiconListElement2.default, { icon: "location" }) }, { value: "lock-duplicate", label: wp.element.createElement(_DashiconListElement2.default, { icon: "lock-duplicate" }) }, { value: "lock", label: wp.element.createElement(_DashiconListElement2.default, { icon: "lock" }) }, { value: "marker", label: wp.element.createElement(_DashiconListElement2.default, { icon: "marker" }) }, { value: "media-archive", label: wp.element.createElement(_DashiconListElement2.default, { icon: "media-archive" }) }, { value: "media-audio", label: wp.element.createElement(_DashiconListElement2.default, { icon: "media-audio" }) }, { value: "media-code", label: wp.element.createElement(_DashiconListElement2.default, { icon: "media-code" }) }, { value: "media-default", label: wp.element.createElement(_DashiconListElement2.default, { icon: "media-default" }) }, { value: "media-document", label: wp.element.createElement(_DashiconListElement2.default, { icon: "media-document" }) }, { value: "media-interactive", label: wp.element.createElement(_DashiconListElement2.default, { icon: "media-interactive" }) }, { value: "media-spreadsheet", label: wp.element.createElement(_DashiconListElement2.default, { icon: "media-spreadsheet" }) }, { value: "media-text", label: wp.element.createElement(_DashiconListElement2.default, { icon: "media-text" }) }, { value: "media-video", label: wp.element.createElement(_DashiconListElement2.default, { icon: "media-video" }) }, { value: "megaphone", label: wp.element.createElement(_DashiconListElement2.default, { icon: "megaphone" }) }, { value: "menu-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "menu-alt" }) }, { value: "menu-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "menu-alt2" }) }, { value: "menu-alt3", label: wp.element.createElement(_DashiconListElement2.default, { icon: "menu-alt3" }) }, { value: "menu", label: wp.element.createElement(_DashiconListElement2.default, { icon: "menu" }) }, { value: "microphone", label: wp.element.createElement(_DashiconListElement2.default, { icon: "microphone" }) }, { value: "migrate", label: wp.element.createElement(_DashiconListElement2.default, { icon: "migrate" }) }, { value: "minus", label: wp.element.createElement(_DashiconListElement2.default, { icon: "minus" }) }, { value: "money-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "money-alt" }) }, { value: "money", label: wp.element.createElement(_DashiconListElement2.default, { icon: "money" }) }, { value: "move", label: wp.element.createElement(_DashiconListElement2.default, { icon: "move" }) }, { value: "nametag", label: wp.element.createElement(_DashiconListElement2.default, { icon: "nametag" }) }, { value: "networking", label: wp.element.createElement(_DashiconListElement2.default, { icon: "networking" }) }, { value: "no-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "no-alt" }) }, { value: "no", label: wp.element.createElement(_DashiconListElement2.default, { icon: "no" }) }, { value: "open-folder", label: wp.element.createElement(_DashiconListElement2.default, { icon: "open-folder" }) }, { value: "palmtree", label: wp.element.createElement(_DashiconListElement2.default, { icon: "palmtree" }) }, { value: "paperclip", label: wp.element.createElement(_DashiconListElement2.default, { icon: "paperclip" }) }, { value: "pdf", label: wp.element.createElement(_DashiconListElement2.default, { icon: "pdf" }) }, { value: "performance", label: wp.element.createElement(_DashiconListElement2.default, { icon: "performance" }) }, { value: "pets", label: wp.element.createElement(_DashiconListElement2.default, { icon: "pets" }) }, { value: "phone", label: wp.element.createElement(_DashiconListElement2.default, { icon: "phone" }) }, { value: "pinterest", label: wp.element.createElement(_DashiconListElement2.default, { icon: "pinterest" }) }, { value: "playlist-audio", label: wp.element.createElement(_DashiconListElement2.default, { icon: "playlist-audio" }) }, { value: "playlist-video", label: wp.element.createElement(_DashiconListElement2.default, { icon: "playlist-video" }) }, { value: "plugins-checked", label: wp.element.createElement(_DashiconListElement2.default, { icon: "plugins-checked" }) }, { value: "plus-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "plus-alt" }) }, { value: "plus-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "plus-alt2" }) }, { value: "plus", label: wp.element.createElement(_DashiconListElement2.default, { icon: "plus" }) }, { value: "podio", label: wp.element.createElement(_DashiconListElement2.default, { icon: "podio" }) }, { value: "portfolio", label: wp.element.createElement(_DashiconListElement2.default, { icon: "portfolio" }) }, { value: "post-status", label: wp.element.createElement(_DashiconListElement2.default, { icon: "post-status" }) }, { value: "pressthis", label: wp.element.createElement(_DashiconListElement2.default, { icon: "pressthis" }) }, { value: "printer", label: wp.element.createElement(_DashiconListElement2.default, { icon: "printer" }) }, { value: "privacy", label: wp.element.createElement(_DashiconListElement2.default, { icon: "privacy" }) }, { value: "products", label: wp.element.createElement(_DashiconListElement2.default, { icon: "products" }) }, { value: "randomize", label: wp.element.createElement(_DashiconListElement2.default, { icon: "randomize" }) }, { value: "reddit", label: wp.element.createElement(_DashiconListElement2.default, { icon: "reddit" }) }, { value: "redo", label: wp.element.createElement(_DashiconListElement2.default, { icon: "redo" }) }, { value: "remove", label: wp.element.createElement(_DashiconListElement2.default, { icon: "remove" }) }, { value: "rest-api", label: wp.element.createElement(_DashiconListElement2.default, { icon: "rest-api" }) }, { value: "rss", label: wp.element.createElement(_DashiconListElement2.default, { icon: "rss" }) }, { value: "saved", label: wp.element.createElement(_DashiconListElement2.default, { icon: "saved" }) }, { value: "schedule", label: wp.element.createElement(_DashiconListElement2.default, { icon: "schedule" }) }, { value: "screenoptions", label: wp.element.createElement(_DashiconListElement2.default, { icon: "screenoptions" }) }, { value: "search", label: wp.element.createElement(_DashiconListElement2.default, { icon: "search" }) }, { value: "share-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "share-alt" }) }, { value: "share-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "share-alt2" }) }, { value: "share", label: wp.element.createElement(_DashiconListElement2.default, { icon: "share" }) }, { value: "shield-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "shield-alt" }) }, { value: "shield", label: wp.element.createElement(_DashiconListElement2.default, { icon: "shield" }) }, { value: "shortcode", label: wp.element.createElement(_DashiconListElement2.default, { icon: "shortcode" }) }, { value: "slides", label: wp.element.createElement(_DashiconListElement2.default, { icon: "slides" }) }, { value: "smartphone", label: wp.element.createElement(_DashiconListElement2.default, { icon: "smartphone" }) }, { value: "smiley", label: wp.element.createElement(_DashiconListElement2.default, { icon: "smiley" }) }, { value: "sort", label: wp.element.createElement(_DashiconListElement2.default, { icon: "sort" }) }, { value: "sos", label: wp.element.createElement(_DashiconListElement2.default, { icon: "sos" }) }, { value: "spotify", label: wp.element.createElement(_DashiconListElement2.default, { icon: "spotify" }) }, { value: "star-empty", label: wp.element.createElement(_DashiconListElement2.default, { icon: "star-empty" }) }, { value: "star-filled", label: wp.element.createElement(_DashiconListElement2.default, { icon: "star-filled" }) }, { value: "star-half", label: wp.element.createElement(_DashiconListElement2.default, { icon: "star-half" }) }, { value: "sticky", label: wp.element.createElement(_DashiconListElement2.default, { icon: "sticky" }) }, { value: "store", label: wp.element.createElement(_DashiconListElement2.default, { icon: "store" }) }, { value: "superhero-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "superhero-alt" }) }, { value: "superhero", label: wp.element.createElement(_DashiconListElement2.default, { icon: "superhero" }) }, { value: "table-col-after", label: wp.element.createElement(_DashiconListElement2.default, { icon: "table-col-after" }) }, { value: "table-col-before", label: wp.element.createElement(_DashiconListElement2.default, { icon: "table-col-before" }) }, { value: "table-col-delete", label: wp.element.createElement(_DashiconListElement2.default, { icon: "table-col-delete" }) }, { value: "table-row-after", label: wp.element.createElement(_DashiconListElement2.default, { icon: "table-row-after" }) }, { value: "table-row-before", label: wp.element.createElement(_DashiconListElement2.default, { icon: "table-row-before" }) }, { value: "table-row-delete", label: wp.element.createElement(_DashiconListElement2.default, { icon: "table-row-delete" }) }, { value: "tablet", label: wp.element.createElement(_DashiconListElement2.default, { icon: "tablet" }) }, { value: "tag", label: wp.element.createElement(_DashiconListElement2.default, { icon: "tag" }) }, { value: "tagcloud", label: wp.element.createElement(_DashiconListElement2.default, { icon: "tagcloud" }) }, { value: "testimonial", label: wp.element.createElement(_DashiconListElement2.default, { icon: "testimonial" }) }, { value: "text-page", label: wp.element.createElement(_DashiconListElement2.default, { icon: "text-page" }) }, { value: "text", label: wp.element.createElement(_DashiconListElement2.default, { icon: "text" }) }, { value: "thumbs-down", label: wp.element.createElement(_DashiconListElement2.default, { icon: "thumbs-down" }) }, { value: "thumbs-up", label: wp.element.createElement(_DashiconListElement2.default, { icon: "thumbs-up" }) }, { value: "tickets-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "tickets-alt" }) }, { value: "tickets", label: wp.element.createElement(_DashiconListElement2.default, { icon: "tickets" }) }, { value: "tide", label: wp.element.createElement(_DashiconListElement2.default, { icon: "tide" }) }, { value: "translation", label: wp.element.createElement(_DashiconListElement2.default, { icon: "translation" }) }, { value: "trash", label: wp.element.createElement(_DashiconListElement2.default, { icon: "trash" }) }, { value: "twitch", label: wp.element.createElement(_DashiconListElement2.default, { icon: "twitch" }) }, { value: "twitter-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "twitter-alt" }) }, { value: "twitter", label: wp.element.createElement(_DashiconListElement2.default, { icon: "twitter" }) }, { value: "undo", label: wp.element.createElement(_DashiconListElement2.default, { icon: "undo" }) }, { value: "universal-access-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "universal-access-alt" }) }, { value: "universal-access", label: wp.element.createElement(_DashiconListElement2.default, { icon: "universal-access" }) }, { value: "unlock", label: wp.element.createElement(_DashiconListElement2.default, { icon: "unlock" }) }, { value: "update-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "update-alt" }) }, { value: "update", label: wp.element.createElement(_DashiconListElement2.default, { icon: "update" }) }, { value: "upload", label: wp.element.createElement(_DashiconListElement2.default, { icon: "upload" }) }, { value: "vault", label: wp.element.createElement(_DashiconListElement2.default, { icon: "vault" }) }, { value: "video-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "video-alt" }) }, { value: "video-alt2", label: wp.element.createElement(_DashiconListElement2.default, { icon: "video-alt2" }) }, { value: "video-alt3", label: wp.element.createElement(_DashiconListElement2.default, { icon: "video-alt3" }) }, { value: "visibility", label: wp.element.createElement(_DashiconListElement2.default, { icon: "visibility" }) }, { value: "warning", label: wp.element.createElement(_DashiconListElement2.default, { icon: "warning" }) }, { value: "welcome-add-page", label: wp.element.createElement(_DashiconListElement2.default, { icon: "welcome-add-page" }) }, { value: "welcome-comments", label: wp.element.createElement(_DashiconListElement2.default, { icon: "welcome-comments" }) }, { value: "welcome-learn-more", label: wp.element.createElement(_DashiconListElement2.default, { icon: "welcome-learn-more" }) }, { value: "welcome-view-site", label: wp.element.createElement(_DashiconListElement2.default, { icon: "welcome-view-site" }) }, { value: "welcome-widgets-menus", label: wp.element.createElement(_DashiconListElement2.default, { icon: "welcome-widgets-menus" }) }, { value: "welcome-write-blog", label: wp.element.createElement(_DashiconListElement2.default, { icon: "welcome-write-blog" }) }, { value: "whatsapp", label: wp.element.createElement(_DashiconListElement2.default, { icon: "whatsapp" }) }, { value: "wordpress-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "wordpress-alt" }) }, { value: "wordpress", label: wp.element.createElement(_DashiconListElement2.default, { icon: "wordpress" }) }, { value: "xing", label: wp.element.createElement(_DashiconListElement2.default, { icon: "xing" }) }, { value: "yes-alt", label: wp.element.createElement(_DashiconListElement2.default, { icon: "yes-alt" }) }, { value: "yes", label: wp.element.createElement(_DashiconListElement2.default, { icon: "yes" }) }, { value: "youtube", label: wp.element.createElement(_DashiconListElement2.default, { icon: "youtube" }) }];

/***/ }),

/***/ 4384:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));

// please refer to
// https://developer.wordpress.org/reference/functions/get_post_type_labels/
var postLabelsList = exports.postLabelsList = [{
    id: "menu_name",
    label: "Menu Name",
    description: "Label for the menu name. Default is the same as name."
}, {
    id: "all_items",
    label: "All items",
    description: "Label to signify all items in a submenu link. Default is ‘All Posts’ / ‘All Pages’."
}, {
    id: "add_new",
    label: "Add New",
    description: "Default is ‘Add New’ for both hierarchical and non-hierarchical types."
}, {
    id: "add_new_item",
    label: "Add New Item",
    description: "Label for adding a new singular item. Default is ‘Add New Post’ / ‘Add New Page’."
}, {
    id: "edit_item",
    label: "Edit Item",
    description: "Label for editing a singular item. Default is ‘Edit Post’ / ‘Edit Page’."
}, {
    id: "new_item",
    label: "New Item",
    description: "Label for the new item page title. Default is ‘New Post’ / ‘New Page’."
}, {
    id: "view_item",
    label: "View Item",
    description: "Label for viewing a singular item. Default is ‘View Post’ / ‘View Page’."
}, {
    id: "view_items",
    label: "View Items",
    description: "Label for viewing post type archives. Default is ‘View Posts’ / ‘View Pages’."
}, {
    id: "search_item",
    label: "Search Item",
    description: "Label for searching plural items. Default is ‘Search Posts’ / ‘Search Pages’."
}, {
    id: "not_found",
    label: "Not Found",
    description: "Label used when no items are found. Default is ‘No posts found’ / ‘No pages found’."
}, {
    id: "not_found_in_trash",
    label: "Not Found in Trash",
    description: "Label used when no items are in the Trash. Default is ‘No posts found in Trash’ / ‘No pages found in Trash’."
}, {
    id: "parent_item_colon",
    label: "Parent",
    description: "Label used to prefix parents of hierarchical items. Not used on non-hierarchical post types. Default is ‘Parent Page:’."
}, {
    id: "featured_image",
    label: "Featured Image",
    description: "Label for the featured image meta box title. Default is ‘Featured image’."
}, {
    id: "set_featured_image",
    label: "Set Featured Image",
    description: "Label for setting the featured image. Default is ‘Set featured image’."
}, {
    id: "remove_featured_image",
    label: "Remove Featured Image",
    description: "Label for removing the featured image. Default is ‘Remove featured image’."
}, {
    id: "use_featured_image",
    label: "Use Featured Image",
    description: "Label in the media frame for using a featured image. Default is ‘Use as featured image’."
}, {
    id: "archives",
    label: "Archives",
    description: "Label for archives in nav menus. Default is ‘Post Archives’ / ‘Page Archives’."
}, {
    id: "insert_into_item",
    label: "Insert into item",
    description: "Label for the media frame button. Default is ‘Insert into post’ / ‘Insert into page’."
}, {
    id: "uploaded_to_this_item",
    label: "Uploaded to this Item",
    description: "Label for the media frame filter. Default is ‘Uploaded to this post’ / ‘Uploaded to this page’."
}, {
    id: "filter_items_list",
    label: "Filter Items List",
    description: "Label for the table views hidden heading. Default is ‘Filter posts list’ / ‘Filter pages list’."
}, {
    id: "items_list_navigation",
    label: "Items List Navigation",
    description: "Label for the table pagination hidden heading. Default is ‘Posts list navigation’ / ‘Pages list navigation’."
}, {
    id: "items_list",
    label: "Items List",
    description: "Label for the table hidden heading. Default is ‘Posts list’ / ‘Pages list’."
}, {
    id: "filter_by_date",
    label: "Filter by date",
    description: "Label for the date filter in list tables. Default is ‘Filter by date’."
}, {
    id: "item_published",
    label: "Item published",
    description: "Label used when an item is published. Default is ‘Post published.’ / ‘Page published.’"
}, {
    id: "item_published_privately",
    label: "Item published privately",
    description: "Label used when an item is published with private visibility. Default is ‘Post published privately.’ / ‘Page published privately.’"
}, {
    id: "item_reverted_to_draft",
    label: "Item reverted to draft",
    description: "Label used when an item is switched to a draft. Default is ‘Post reverted to draft.’ / ‘Page reverted to draft.’"
}, {
    id: "item_scheduled",
    label: "Item scheduled",
    description: "Label used when an item is scheduled for publishing. Default is ‘Post scheduled.’ / ‘Page scheduled.’"
}, {
    id: "item_updated",
    label: "Item updated",
    description: "Label used when an item is updated. Default is ‘Post updated.’ / ‘Page updated.’"
}];

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

/***/ 3648:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.resetPostTypes = undefined;

var _fetchCustomPostTypesActions = __webpack_require__(8912);

var _ajax = __webpack_require__(7569);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var resetPostTypes = exports.resetPostTypes = function resetPostTypes() {
    return function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(dispatch, getState) {
            var fetched;
            return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            dispatch((0, _fetchCustomPostTypesActions.resetPostTypesInProgress)());
                            _context.next = 3;
                            return (0, _ajax.wpAjaxRequest)('resetCustomPostTypesAction');

                        case 3:
                            fetched = _context.sent;

                            dispatch((0, _fetchCustomPostTypesActions.resetPostTypesSuccess)());

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

/***/ }),

/***/ 4065:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=75.js.map