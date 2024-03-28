import React from 'react';
import PropTypes from 'prop-types';
import Button from "../../../components/Button";
import {useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import Layout from "../../../layout/Layout";
import Card from "../../../components/Card";
import StepsHeader from "../../../components/Steps/StepsHeader";
import Toggle from "../../../components/Forms/Toggle";
import CardRow from "../../../components/Card/CardRow";
import Input from "../../../components/Forms/Input";
import Checkbox from "../../../components/Forms/Checkbox";

const SettingsStep = ({title, crumbs, headings, stepActive, setStepActive, handleSubmit, formValues, loading = false}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchTaxonomies);

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
            sort: data.length > 0 ? settings.sort : null,
        }
    });

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
                    <CardRow
                        label={useTranslation("Is Public")}
                        value={
                            <Toggle
                                id="public"
                                description={useTranslation("Whether a taxonomy is intended for use publicly either via the admin interface or by front-end users.")}
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
                                description={useTranslation("Whether the taxonomy is publicly queryable. If not set, the default is inherited from $public.")}
                                defaultValue={data.length > 0 ? settings.publicly_queryable : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Hierarchical")}
                        value={
                            <Toggle
                                id="hierarchical"
                                description={useTranslation("Whether the taxonomy is hierarchical. Default false.")}
                                defaultValue={data.length > 0 ? settings.hierarchical : false}
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
                                description={useTranslation("Whether to generate and allow a UI for managing terms in this taxonomy in the admin. If not set, the default is inherited from $public (default true).")}
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
                                description={useTranslation("Whether to show the taxonomy in the admin menu. If true, the taxonomy is shown as a submenu of the object type menu. If false, no menu is shown. $show_ui must be true. If not set, default is inherited from $show_ui (default true).")}
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
                                description={useTranslation("Makes this taxonomy available for selection in navigation menus. If not set, the default is inherited from $public (default true).")}
                                defaultValue={data.length > 0 ? settings.show_in_nav_menus : true}
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
                                description={useTranslation("Whether to include the taxonomy in the REST API. Set this to true for the taxonomy to be available in the block editor. SET TRUE TO ENABLE VISUALIZATION ON GUTEMBERG EDITOR.")}
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
                                description={useTranslation("To change the base url of REST API route. Default is $taxonomy.")}
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
                        label={useTranslation("REST controller class")}
                        value={
                            <Input
                                id="rest_controller_class"
                                placeholder={useTranslation("REST controller class")}
                                description={useTranslation("REST API Controller class name. Default is 'WP_REST_Terms_Controller'.")}
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
                        label={useTranslation("Show Tagcloud")}
                        value={
                            <Toggle
                                id="show_tagcloud"
                                description={useTranslation("Whether to list the taxonomy in the Tag Cloud Widget controls. If not set, the default is inherited from $show_ui (default true).")}
                                defaultValue={data.length > 0 ? settings.show_tagcloud : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Show in quick edit")}
                        value={
                            <Toggle
                                id="show_in_quick_edit"
                                description={useTranslation("Whether to show the taxonomy in the quick/bulk edit panel. It not set, the default is inherited from $show_ui (default true).")}
                                defaultValue={data.length > 0 ? settings.show_in_quick_edit : true}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Show admin column")}
                        value={
                            <Toggle
                                id="show_admin_column"
                                description={useTranslation("Whether to display a column for the taxonomy on its post type listing screens. Default false.")}
                                defaultValue={data.length > 0 ? settings.show_admin_column : false}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Capabilities")}
                        value={
                            <Checkbox
                                id="capabilities"
                                defaultValue="post"
                                description={useTranslation("Array of capabilities for this taxonomy.")}
                                register={register}
                                errors={errors}
                                values={{
                                    "manage_terms": {
                                        "value": "manage_terms",
                                        "checked": (data.length > 0 && settings.capabilities) ? settings.capabilities.includes('manage_terms') : true,
                                    },
                                    "edit_terms": {
                                        "value": "edit_terms",
                                        "checked": (data.length > 0 && settings.capabilities) ? settings.capabilities.includes('edit_terms') : true,
                                    },
                                    "delete_terms": {
                                        "value": "delete_terms",
                                        "checked": (data.length > 0 && settings.capabilities) ? settings.capabilities.includes('delete_terms') : true,
                                    },
                                    "assign_terms": {
                                        "value": "assign_terms",
                                        "checked": (data.length > 0 && settings.capabilities) ? settings.capabilities.includes('assign_terms') : true,
                                    }
                                }}
                                validate={{
                                    maxLength: {
                                        value: 255,
                                        message: useTranslation("max length is 255")
                                    }
                                }}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Rewrite")}
                        value={
                            <Toggle
                                id="rewrite"
                                description={useTranslation("Triggers the handling of rewrites for this taxonomy. Default true, using $taxonomy as slug. To prevent rewrite, set to false. To specify rewrite rules, an array can be passed with any of these keys:")}
                                defaultValue={data.length > 0 ? settings.rewrite : false}
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
                                    description={useTranslation("Taxonomy slug to use instead of default.")}
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
                    )}
                    <CardRow
                        label={useTranslation("Query var")}
                        value={
                            <Toggle
                                id="query_var"
                                description={useTranslation("Sets the query var key for this taxonomy. Default $taxonomy key. If false, a taxonomy cannot be loaded at ?{query_var}={term_slug}. If a string, the query ?{query_var}={term_slug} will be valid.")}
                                defaultValue={data.length > 0 ? settings.query_var : false}
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
                                            message: "max length is 255"
                                        }
                                    }}
                                    register={register}
                                    errors={errors}
                                />
                            }
                        />
                    )}
                    <CardRow
                        label={useTranslation("Default term")}
                        value={
                            <Input
                                id="default_term"
                                placeholder={useTranslation("Default term to be used for the taxonomy.")}
                                description={useTranslation("Allowed keys: 'name', name of default term.|'slug', Slug for default term.|'description', Description for default term")}
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
                        label={useTranslation("Sort")}
                        value={
                            <Toggle
                                id="sort"
                                description={useTranslation("Whether terms in this taxonomy should be sorted in the order they are provided to wp_set_object_terms(). Default null which equates to false.")}
                                defaultValue={data.length > 0 ? settings.sort : false}
                                register={register}
                                errors={errors}
                            />
                        }
                    />
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
    loading: PropTypes.bool,
};

export default SettingsStep;