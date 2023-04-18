import React, {useEffect, useRef} from 'react';
import {useForm} from "react-hook-form";
import InputText from "../../reusable/Form/InputText";
import {useDispatch, useSelector} from "react-redux";
import StepsButtons from "../../reusable/Steps/StepsButtons";
import {stepsSubmit} from "../../../redux/thunks/stepsSubmit";
import InputSwitch from "../../reusable/Form/InputSwitch";
import InputNumber from "../../reusable/Form/InputNumber";
import {toast} from 'react-toastify';
import {useHistory} from 'react-router-dom';
import {refreshPage} from "../../../utils/misc";
import {validWPGraphQLName} from "../../../utils/validation";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import StepsHeader from "../../reusable/Steps/StepsHeader";

const OtherSettingsStep = ({postType, headings, isWPGraphQLActive, setPristineHandler}) => {

    // manage redux state
    const dispatch = useDispatch();
    const {data:stepsData, activeStep, errors: stepsErrors, success, loading} = useSelector(state => state.stepsReducer);
    const {fetched} = useSelector(state => state.fetchPostTypesReducer);

    // manage local state
    const didMountRef = useRef(false);

    // manage redirect
    const history = useHistory();

    // handle form
    let settings = {};
    if(fetched.length > 0){
        settings = fetched[0].settings;
    }

    const { register, handleSubmit, setValue, setError, formState: {errors, isValid}, watch } = useForm({
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
    });

    // GRAPHQL Integration
    useEffect(() => {
        if (stepsData[1]) {
            setValue("show_in_graphql",  fetched.length > 0 ? settings.show_in_graphql : true);
            setValue("graphql_single_name",  fetched.length > 0 ? settings.graphql_single_name : stepsData[1].singular_label);
            setValue("graphql_plural_name",  fetched.length > 0 ? settings.graphql_plural_name : stepsData[1].plural_label);
        }
    }, [activeStep]);

    const showInGraphql = watch('show_in_graphql');
    const graphqlSingleName = watch('graphql_single_name');
    const graphqlPluralName = watch('graphql_plural_name');

    const handleGraphQLSingleNameChange = (single_name) => {
        if (single_name === graphqlPluralName) {
            return 'Single name MUST be different from plural name';
        }
    };

    const handleGraphQLPluralNameChange = (plural_name) => {
        if (plural_name === graphqlSingleName) {
            return 'Different name MUST be different from single name';
        }
    };

    // submit data
    const onSubmit = async ( data ) => {
        setPristineHandler();
        await dispatch( stepsSubmit( 'saveCustomPostTypeAction', data ) );
    };

    // handle form submission outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                if(success){
                    history.push('/');
                    toast.success("Custom post type successfully saved. The browser will refresh after 5 seconds.");
                    refreshPage(5000);
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
        <Layout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ActionsBar
                    title={postType ? "Edit Custom Post Type" : "Create new Custom Post Type"}
                    actions={<StepsButtons isValid={isValid} prev={2} />}
                />
                <main>
                    <Breadcrumbs crumbs={[
                        {
                            label: "Registered Custom Post Types",
                            link: "/"
                        },
                        {
                            label: postType ? "Edit Custom Post Type" : "Create new Custom Post Type"
                        }
                    ]} />
                    <div className="acpt-card">
                        <StepsHeader headings={headings}/>
                        {isWPGraphQLActive && (
                            <div className="wpgraphql-wrapper">
                                <InputSwitch
                                    id="show_in_graphql"
                                    label="Show in GraphQL"
                                    isRequired={true}
                                    description="Show the custom post type in WPGraphQL."
                                    register={register}
                                    errors={errors}
                                />
                                <InputText
                                    id="graphql_single_name"
                                    label="GraphQL single name"
                                    placeholder="Ex. movie"
                                    register={register}
                                    errors={errors}
                                    isRequired={showInGraphql}
                                    description="Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the plural name."
                                    validate={{
                                        validate: {
                                            validWPGraphQLName,
                                            handleGraphQLSingleNameChange
                                        },
                                    }}
                                />
                                <InputText
                                    id="graphql_plural_name"
                                    label="GraphQL plural name"
                                    placeholder="Ex. movies"
                                    register={register}
                                    errors={errors}
                                    isRequired={showInGraphql}
                                    description="Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the single name."
                                    validate={{
                                        validate: {
                                            validWPGraphQLName,
                                            handleGraphQLPluralNameChange
                                        },
                                    }}
                                />
                            </div>
                        )}
                        <div className="acpt-card__inner">
                            <InputSwitch
                                id="public"
                                label="Is Public"
                                description="Whether a post type is intended for use publicly either via the admin interface or by front-end users."
                                defaultValue={fetched.length > 0 ? settings.public : true}
                                register={register}
                                errors={errors}
                            />
                            <InputSwitch
                                id="publicly_queryable"
                                label="Publicly queryable"
                                description="Whether queries can be performed on the front end for the post type as part of parse_request()."
                                defaultValue={fetched.length > 0 ? settings.publicly_queryable : true}
                                register={register}
                                errors={errors}
                            />
                            <InputSwitch
                                id="show_ui"
                                label="Show in UI"
                                description="Whether to generate and allow a UI for managing this post type in the admin. Default is value of $public."
                                defaultValue={fetched.length > 0 ? settings.show_ui : true}
                                register={register}
                                errors={errors}
                            />
                            <InputSwitch
                                id="show_in_menu"
                                label="Show in menu"
                                description="Where to show the post type in the admin menu. To work, $show_ui must be true. If true, the post type is shown in its own top level menu. If false, no menu is shown."
                                defaultValue={fetched.length > 0 ? settings.show_in_menu : true}
                                register={register}
                                errors={errors}
                            />
                            <InputSwitch
                                id="show_in_nav_menus"
                                label="Show in nav menus"
                                description="Makes this post type available for selection in navigation menus. Default is value of $public."
                                defaultValue={fetched.length > 0 ? settings.show_in_nav_menus : true}
                                register={register}
                                errors={errors}
                            />
                            <InputSwitch
                                id="show_in_admin_bar"
                                label="Show in admin bar"
                                description="Makes this post type available via the admin bar. Default is value of $show_in_menu."
                                defaultValue={fetched.length > 0 ? settings.show_in_admin_bar : true}
                                register={register}
                                errors={errors}
                            />
                            <InputSwitch
                                id="show_in_rest"
                                label="Show in REST API"
                                description="Whether to include the post type in the REST API. Set this to true for the post type to be available in the block editor. SET TRUE TO ENABLE GUTEMBERG EDITOR."
                                defaultValue={fetched.length > 0 ? settings.show_in_rest : true}
                                register={register}
                                errors={errors}
                            />
                            <InputText
                                id="rest_base"
                                label="REST API base slug"
                                placeholder="REST API base slug"
                                register={register}
                                errors={errors}
                                description="To change the base url of REST API route. Default is $post_type."
                                validate={{
                                    maxLength: {
                                        value: 255,
                                        message: "min length is 255"
                                    }
                                }}
                            />
                            <InputNumber
                                id="menu_position"
                                min="5"
                                max="100"
                                label="Menu position"
                                placeholder="Menu position"
                                register={register}
                                errors={errors}
                                description="The position in the menu order the post type should appear. To work, $show_in_menu must be true. Default null (at the bottom)."
                                validate={{
                                    min: {
                                        value: 5,
                                        message: "min length is 5"
                                    },
                                    max: {
                                        value: 100,
                                        message: "max length is 100"
                                    }
                                }}
                            />
                            <InputText
                                id="capability_type"
                                label="Capability type"
                                placeholder="Capability type"
                                register={register}
                                errors={errors}
                                defaultValue="post"
                                description="The string to use to build the read, edit, and delete capabilities. May be passed as an array to allow for alternative plurals when using this argument as a base to construct the capabilities, e.g. array('story', 'stories'). Default 'post'."
                                validate={{
                                    maxLength: {
                                        value: 255,
                                        message: "min length is 255"
                                    }
                                }}
                            />
                            <InputSwitch
                                id="has_archive"
                                label="Has archive"
                                description="Whether there should be post type archives, or if a string, the archive slug to use. Will generate the proper rewrite rules if $rewrite is enabled."
                                defaultValue={fetched.length > 0 ? settings.has_archive : true}
                                register={register}
                                errors={errors}
                            />
                            <InputSwitch
                                id="rewrite"
                                label="Rewrite"
                                description="Whether there should be post type archives, or if a string, the archive slug to use. Will generate the proper rewrite rules if $rewrite is enabled."
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
                                description="Sets the query_var key for this post type. Defaults to $post_type key. If false, a post type cannot be loaded at ?{query_var}={post_slug}. If specified as a string, the query ?{query_var_string}={post_slug} will be valid."
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
                        </div>
                    </div>
                </main>
            </form>
        </Layout>
    )
};

export default OtherSettingsStep;