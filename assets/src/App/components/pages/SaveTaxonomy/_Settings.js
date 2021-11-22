import React, {useEffect, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import {stepsSubmit} from "../../../redux/thunks/stepsSubmit";
import {toast} from "react-toastify";
import InputSwitch from "../../reusable/Form/InputSwitch";
import InputText from "../../reusable/Form/InputText";
import StepsButtons from "../../reusable/Steps/StepsButtons";
import Checkboxes from "../../reusable/Form/Checkboxes";

const OtherSettingsStep = ({setPristineHandler}) => {

    // manage redux state
    const dispatch = useDispatch();
    const {errors: stepsErrors, success, loading} = useSelector(state => state.stepsReducer);
    const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);

    // manage local state
    const didMountRef = useRef(false);

    // manage redirect
    const history = useHistory();

    // handle form
    let settings = {};
    if(fetched.length > 0){
        settings = fetched[0].settings;
    }

    const { register, handleSubmit, formState: {errors, isValid}, watch } = useForm({
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
            custom_rewrite: fetched.length > 0 ? settings.custom_rewrite : null,
            query_var: fetched.length > 0 ? settings.query_var : null,
            custom_query_var: fetched.length > 0 ? settings.custom_query_var : null,
            default_term: fetched.length > 0 ? settings.default_term : null,
            sort: fetched.length > 0 ? settings.sort : null,
        }
    });

    const onSubmit = async ( data ) => {
        setPristineHandler();
        await dispatch( stepsSubmit( 'saveTaxonomyAction', data ) );
    };

    // handle form submission outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                if(success){
                    history.push('/taxonomies');
                    toast.success("Taxonomy successfully saved");
                }

                if(stepsErrors.length > 0){
                    stepsErrors.map((error) => {
                        toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    const rewrite = watch("rewrite");
    const query_var = watch("query_var");

    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="acpt-card__inner">
                <InputSwitch
                    id="public"
                    label="Is Public"
                    description="Whether a taxonomy is intended for use publicly either via the admin interface or by front-end users."
                    defaultValue={fetched.length > 0 ? settings.public : true}
                    register={register}
                    errors={errors}
                />
                <InputSwitch
                    id="publicly_queryable"
                    label="Publicly queryable"
                    description="Whether the taxonomy is publicly queryable. If not set, the default is inherited from $public."
                    defaultValue={fetched.length > 0 ? settings.publicly_queryable : false}
                    register={register}
                    errors={errors}
                />
                <InputSwitch
                    id="hierarchical"
                    label="Hierarchical"
                    description="Whether the taxonomy is hierarchical. Default false."
                    defaultValue={fetched.length > 0 ? settings.hierarchical : true}
                    register={register}
                    errors={errors}
                />
                <InputSwitch
                    id="show_ui"
                    label="Show in UI"
                    description="Whether to generate and allow a UI for managing terms in this taxonomy in the admin. If not set, the default is inherited from $public (default true)."
                    defaultValue={fetched.length > 0 ? settings.show_ui : true}
                    register={register}
                    errors={errors}
                />
                <InputSwitch
                    id="show_in_menu"
                    label="Show in menu"
                    description="Whether to show the taxonomy in the admin menu. If true, the taxonomy is shown as a submenu of the object type menu. If false, no menu is shown. $show_ui must be true. If not set, default is inherited from $show_ui (default true)."
                    defaultValue={fetched.length > 0 ? settings.show_in_menu : true}
                    register={register}
                    errors={errors}
                />
                <InputSwitch
                    id="show_in_nav_menus"
                    label="Show in nav menus"
                    description="Makes this taxonomy available for selection in navigation menus. If not set, the default is inherited from $public (default true)."
                    defaultValue={fetched.length > 0 ? settings.show_in_nav_menus : true}
                    register={register}
                    errors={errors}
                />
                <InputSwitch
                    id="show_in_rest"
                    label="Show in REST API"
                    description="Whether to include the taxonomy in the REST API. Set this to true for the taxonomy to be available in the block editor. SET TRUE TO ENABLE VISUALIZATION ON GUTEMBERG EDITOR."
                    defaultValue={fetched.length > 0 ? settings.show_in_rest : false}
                    register={register}
                    errors={errors}
                />
                <InputText
                    id="rest_base"
                    label="REST API base slug"
                    placeholder="REST API base slug"
                    register={register}
                    errors={errors}
                    description=" To change the base url of REST API route. Default is $taxonomy."
                    validate={{
                        maxLength: {
                            value: 255,
                            message: "min length is 255"
                        }
                    }}
                />
                <InputText
                    id="rest_controller_class"
                    label="REST controller class"
                    placeholder="REST controller class"
                    register={register}
                    errors={errors}
                    description="REST API Controller class name. Default is 'WP_REST_Terms_Controller'."
                    validate={{
                        maxLength: {
                            value: 255,
                            message: "min length is 255"
                        }
                    }}
                />
                <InputSwitch
                    id="show_tagcloud"
                    label="Show Tagcloud"
                    description="Whether to list the taxonomy in the Tag Cloud Widget controls. If not set, the default is inherited from $show_ui (default true)."
                    defaultValue={fetched.length > 0 ? settings.show_tagcloud : true}
                    register={register}
                    errors={errors}
                />
                <InputSwitch
                    id="show_in_quick_edit"
                    label="Show in quick edit"
                    description="Whether to show the taxonomy in the quick/bulk edit panel. It not set, the default is inherited from $show_ui (default true)."
                    defaultValue={fetched.length > 0 ? settings.show_in_quick_edit : true}
                    register={register}
                    errors={errors}
                />
                <InputSwitch
                    id="show_admin_column"
                    label="Show admin column"
                    description="Whether to display a column for the taxonomy on its post type listing screens. Default false."
                    defaultValue={fetched.length > 0 ? settings.show_admin_column : false}
                    register={register}
                    errors={errors}
                />
                <Checkboxes
                    id="capabilities"
                    label="Capabilities"
                    placeholder="Capabilities"
                    register={register}
                    errors={errors}
                    defaultValue="post"
                    description="Array of capabilities for this taxonomy."
                    values={{
                        "manage_terms": {
                            "value": "manage_terms",
                            "checked": fetched.length > 0 ? settings.capabilities.includes('manage_terms') : true,
                        },
                        "edit_terms": {
                            "value": "edit_terms",
                            "checked": fetched.length > 0 ? settings.capabilities.includes('edit_terms') : true,
                        },
                        "delete_terms": {
                            "value": "delete_terms",
                            "checked": fetched.length > 0 ? settings.capabilities.includes('delete_terms') : true,
                        },
                        "assign_terms": {
                            "value": "assign_terms",
                            "checked": fetched.length > 0 ? settings.capabilities.includes('assign_terms') : true,
                        }
                    }}
                    validate={{
                        maxLength: {
                            value: 255,
                            message: "min length is 255"
                        }
                    }}
                />
                <InputSwitch
                    id="rewrite"
                    label="Rewrite"
                    description="Triggers the handling of rewrites for this taxonomy. Default true, using $taxonomy as slug. To prevent rewrite, set to false. To specify rewrite rules, an array can be passed with any of these keys:"
                    defaultValue={fetched.length > 0 ? settings.rewrite : false}
                    register={register}
                    errors={errors}
                />
                {rewrite && (
                    <InputText
                        id="custom_rewrite"
                        label="Custom rewrite rules"
                        placeholder="Custom rewrite rules"
                        register={register}
                        errors={errors}
                        description="Custom post type slug to use instead of default."
                        validate={{
                            maxLength: {
                                value: 255,
                                message: "min length is 255"
                            }
                        }}
                    />
                )}
                <InputSwitch
                    id="query_var"
                    label="Query var"
                    description="Sets the query var key for this taxonomy. Default $taxonomy key. If false, a taxonomy cannot be loaded at ?{query_var}={term_slug}. If a string, the query ?{query_var}={term_slug} will be valid."
                    defaultValue={fetched.length > 0 ? settings.query_var : false}
                    register={register}
                    errors={errors}
                />
                {query_var && (
                    <InputText
                        id="custom_query_var"
                        label="Custom query var"
                        placeholder="Custom query var"
                        register={register}
                        errors={errors}
                        description="Custom query var slug to use instead of default."
                        validate={{
                            maxLength: {
                                value: 255,
                                message: "min length is 255"
                            }
                        }}
                    />
                )}
                <InputText
                    id="default_term"
                    label="Default term"
                    placeholder="Default term to be used for the taxonomy."
                    register={register}
                    errors={errors}
                    description="Allowed keys: 'name', name of default term.|'slug', Slug for default term.|'description', Description for default term"
                    validate={{
                        maxLength: {
                            value: 255,
                            message: "min length is 255"
                        }
                    }}
                />
                <InputSwitch
                    id="sort"
                    label="Sort"
                    description="Whether terms in this taxonomy should be sorted in the order they are provided to wp_set_object_terms(). Default null which equates to false."
                    defaultValue={fetched.length > 0 ? settings.sort : false}
                    register={register}
                    errors={errors}
                />
            </div>
            <StepsButtons isValid={isValid} prev={2} />
        </form>
    )
};

export default OtherSettingsStep;