import React, {useEffect} from 'react';
import {useForm} from "react-hook-form";
import Input from "../../../components/Forms/Input";
import {styleVariants} from "../../../constants/styles";
import Button from "../../../components/Button";
import useTranslation from "../../../hooks/useTranslation";
import StepsHeader from "../../../components/Steps/StepsHeader";
import Layout from "../../../layout/Layout";
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import Card from "../../../components/Card";
import {useSelector} from "react-redux";
import Toggle from "../../../components/Forms/Toggle";
import {validWPGraphQLName} from "../../../utils/validation";
import MenuPosition from "../../../components/Forms/MenuPosition";
import {isEmpty} from "../../../utils/objects";

const SettingsStep = ({title, crumbs, headings, stepActive, setStepActive, handleSubmit, formValues, isWPGraphQLActive = false, loading = false, edit = false}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchCustomPostTypes);

    // handle form
    let settings = {};
    if(data.length > 0){
        settings = data[0].settings;
    }

    const { register, handleSubmit: submit, formState: {errors, isValid}, setValue, watch } = useForm({
        mode: 'all',
        defaultValues: {
            public: data.length > 0 ? settings.public : null,
            publicly_queryable: data.length > 0 ? settings.publicly_queryable : null,
            show_ui: data.length > 0 ? settings.show_ui : null,
            show_in_menu: data.length > 0 ? settings.show_in_menu : null,
            show_in_nav_menus: data.length > 0 ? settings.show_in_nav_menus : null,
            show_in_admin_bar: data.length > 0 ? settings.show_in_admin_bar : null,
            show_in_rest: data.length > 0 ? settings.show_in_rest : null,
            rest_base: data.length > 0 ? settings.rest_base : null,
            menu_position: data.length > 0 ? settings.menu_position : null,
            capability_type: data.length > 0 ? settings.capability_type : 'post',
            has_archive: data.length > 0 ? settings.has_archive : null,
            rewrite: data.length > 0 ? settings.rewrite : null,
            custom_rewrite: data.length > 0 ? settings.custom_rewrite : null,
            query_var: data.length > 0 ? settings.query_var : null,
            custom_query_var: data.length > 0 ? settings.custom_query_var : null
        }
    });

    // GRAPHQL Integration
    useEffect(() => {
        if (formValues && !isEmpty(formValues)) {
            setValue("show_in_graphql",  data.length > 0 ? settings.show_in_graphql : true);
            setValue("graphql_single_name",  data.length > 0 ? settings.graphql_single_name : formValues[1].singular_label);
            setValue("graphql_plural_name",  data.length > 0 ? settings.graphql_plural_name : formValues[1].plural_label);
        }
    }, [formValues]);

    const showInGraphql = watch('show_in_graphql');
    const graphqlSingleName = watch('graphql_single_name');
    const graphqlPluralName = watch('graphql_plural_name');

    const handleGraphQLSingleNameChange = (single_name) => {
        if (single_name === graphqlPluralName) {
            return useTranslation('Single name MUST be different from plural name');
        }
    };

    const handleGraphQLPluralNameChange = (plural_name) => {
        if (plural_name === graphqlSingleName) {
            return useTranslation('Different name MUST be different from single name');
        }
    };

    const rewrite = watch("rewrite");
    const query_var = watch("query_var");

    const onSubmit = (data) => {
        handleSubmit(data, 3);
    };

    const actions = [
        <Button testId="prev-step" type="button" onClick={() => setStepActive(1)} style={styleVariants.SECONDARY}>{useTranslation("Previous Step")}</Button>,
        <Button testId="save" style={styleVariants.PRIMARY} disabled={loading}>{useTranslation("Save")}</Button>,
    ];

    return (
        <form onSubmit={submit(onSubmit)}>
            <Layout
                crumbs={crumbs}
                title={title}
                actions={actions}
            >
                <Card style="with-shadow">
                    <StepsHeader
                        stepActive={stepActive}
                        headings={headings}
                    />
                    {isWPGraphQLActive && (
                        <React.Fragment>
                            <CardRow
                                label={useTranslation("Show in GraphQL")}
                                value={
                                    <Toggle
                                        id="show_in_graphql"
                                        description={useTranslation("Show the custom post type in WPGraphQL.")}
                                        defaultValue={true}
                                        register={register}
                                        errors={errors}
                                    />
                                }
                            />
                            <CardRow
                                label={useTranslation("GraphQL single name")}
                                value={
                                    <Input
                                        id="graphql_single_name"
                                        register={register}
                                        placeholder={useTranslation("Ex. movie")}
                                        description={useTranslation("Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the plural name.")}
                                        errors={errors}
                                        isRequired={showInGraphql}
                                        validate={{
                                            validate: {
                                                validWPGraphQLName,
                                                handleGraphQLSingleNameChange
                                            },
                                        }}
                                    />
                                }
                            />
                            <CardRow
                                label={useTranslation("GraphQL plural name")}
                                value={
                                    <Input
                                        id="graphql_plural_name"
                                        register={register}
                                        placeholder={useTranslation("Ex. movies")}
                                        description={useTranslation("Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the single name.")}
                                        errors={errors}
                                        isRequired={showInGraphql}
                                        validate={{
                                            validate: {
                                                validWPGraphQLName,
                                                handleGraphQLSingleNameChange
                                            },
                                        }}
                                    />
                                }
                            />
                        </React.Fragment>
                    )}
                    <CardRow
                        label={useTranslation("Hierarchical")}
                        value={<Toggle
                            id="hierarchical"
                            description={useTranslation("Whether the post type is hierarchical (e.g. page). Default false.")}
                            defaultValue={data.length > 0 ? settings.hierarchical : false}
                            register={register}
                            errors={errors}
                        />}
                    />
                    <CardRow
                        label={useTranslation("Is Public")}
                        value={
                            <Toggle
                                id="public"
                                description={useTranslation("Whether a post type is intended for use publicly either via the admin interface or by front-end users.")}
                                defaultValue={data.length > 0 ? settings.public : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Publicly queryable")}
                        value={
                            <Toggle
                                id="publicly_queryable"
                                description={useTranslation("Whether queries can be performed on the front end for the post type as part of parse_request().")}
                                defaultValue={data.length > 0 ? settings.publicly_queryable : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Show in UI")}
                        value={
                            <Toggle
                                id="show_ui"
                                description={useTranslation("Whether to generate and allow a UI for managing this post type in the admin. Default is value of $public.")}
                                defaultValue={data.length > 0 ? settings.show_ui : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Show in menu")}
                        value={
                            <Toggle
                                id="show_in_menu"
                                description={useTranslation("Where to show the post type in the admin menu. To work, $show_ui must be true. If true, the post type is shown in its own top level menu. If false, no menu is shown.")}
                                defaultValue={data.length > 0 ? settings.show_in_menu : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Show in nav menus")}
                        value={
                            <Toggle
                                id="show_in_nav_menus"
                                description={useTranslation("Makes this post type available for selection in navigation menus. Default is value of $public.")}
                                defaultValue={data.length > 0 ? settings.show_in_nav_menus : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Show in admin bar")}
                        value={
                            <Toggle
                                id="show_in_admin_bar"
                                description={useTranslation("Makes this post type available via the admin bar. Default is value of $show_in_menu.")}
                                defaultValue={data.length > 0 ? settings.show_in_admin_bar : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Show in REST API")}
                        value={
                            <Toggle
                                id="show_in_rest"
                                description={useTranslation("Whether to include the post type in the REST API. Set this to true for the post type to be available in the block editor. SET TRUE TO ENABLE GUTEMBERG EDITOR.")}
                                defaultValue={data.length > 0 ? settings.show_in_rest : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("REST API base slug")}
                        value={
                            <Input
                                id="rest_base"
                                placeholder={useTranslation("REST API base slug")}
                                description={useTranslation("To change the base url of REST API route. Default is $post_type.")}
                                validate={{
                                    maxLength: {
                                        value: 255,
                                        message: useTranslation("max length is 255")
                                    }
                                }}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Menu position")}
                        value={
                            <MenuPosition
                                id="menu_position"
                                defaultValue={data.length > 0 ? settings.menu_position : null}
                                description={useTranslation("The position in the menu order the post type should appear. To work, $show_in_menu must be true. Default null (at the bottom).")}
                                register={register}
                                setValue={setValue}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Capability type")}
                        value={
                            <Input
                                id="capability_type"
                                defaultValue="post"
                                description={useTranslation("The string to use to build the read, edit, and delete capabilities. May be passed as an array to allow for alternative plurals when using this argument as a base to construct the capabilities, e.g. array('story', 'stories'). Default 'post'.")}
                                validate={{
                                    maxLength: {
                                        value: 255,
                                        message: "max length is 255"
                                    }
                                }}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Has archive")}
                        value={
                            <Toggle
                                id="has_archive"
                                description={useTranslation("Whether there should be post type archives, or if a string, the archive slug to use. Will generate the proper rewrite rules if $rewrite is enabled.")}
                                defaultValue={data.length > 0 ? settings.has_archive : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Rewrite")}
                        value={
                            <Toggle
                                id="rewrite"
                                description={useTranslation("Triggers the handling of rewrites for this post type. To prevent rewrite, set to false. Defaults to true, using $post_type as slug. To specify rewrite rules, an array can be passed with any of these keys:")}
                                defaultValue={data.length > 0 ? settings.rewrite : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    {rewrite && (
                        <CardRow
                            label={useTranslation("Custom rewrite rules")}
                            value={
                                <Input
                                    id="custom_rewrite"
                                    placeholder={useTranslation("Custom rewrite rules")}
                                    description={useTranslation("Custom post type slug to use instead of default.")}
                                    validate={{
                                        maxLength: {
                                            value: 255,
                                            message: useTranslation("max length is 255")
                                        }
                                    }}
                                    register={register}
                                    errors={errors}
                                />
                            }
                        />
                    )}
                    <CardRow
                        label={useTranslation("Query var")}
                        value={
                            <Toggle
                                id="query_var"
                                description={useTranslation("Sets the query_var key for this post type. Defaults to  key. If false, a post type cannot be loaded at ?{query_var}={post_slug}. If specified as a string, the query {post_slug} will be valid.")}
                                defaultValue={data.length > 0 ? settings.query_var : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    {query_var && (
                        <CardRow
                            label={useTranslation("Custom query var")}
                            value={
                                <Input
                                    id="custom_query_var"
                                    placeholder={useTranslation("Custom query var")}
                                    description={useTranslation("Custom query var slug to use instead of default.")}
                                    validate={{
                                        maxLength: {
                                            value: 255,
                                            message: useTranslation("min length is") + " 255"
                                        }
                                    }}
                                    register={register}
                                    errors={errors}
                                />
                            }
                        />
                    )}
                </Card>
            </Layout>
        </form>
    );
};

SettingsStep.propTypes = {
    headings: PropTypes.arrayOf(PropTypes.shape({
        label:  PropTypes.string.isRequired,
        description:  PropTypes.string.isRequired,
    })).isRequired,
    title: PropTypes.string.isRequired,
    crumbs: PropTypes.arrayOf(Button).isRequired,
    stepActive: PropTypes.number.isRequired,
    setStepActive: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    formValues: PropTypes.object.isRequired,
    isWPGraphQLActive: PropTypes.bool,
    loading: PropTypes.bool,
    edit: PropTypes.bool,
};

export default SettingsStep;