import React, {useEffect, useState} from 'react';
import Input from "../../../components/Forms/Input";
import {useForm} from "react-hook-form";
import Button from "../../../components/Button";
import useTranslation from "../../../hooks/useTranslation";
import {styleVariants} from "../../../constants/styles";
import Layout from "../../../layout/Layout";
import PropTypes from 'prop-types';
import StepsHeader from "../../../components/Steps/StepsHeader";
import Card from "../../../components/Card";
import CardRow from "../../../components/Card/CardRow";
import {useSelector} from "react-redux";
import {asyncIsPostTypeNameValid, isPostTypeNameValid} from "../../../utils/validation";
import {sluggifyString} from "../../../utils/strings";
import IconPicker from "../../../components/Forms/IconPicker";
import Checkbox from "../../../components/Forms/Checkbox";

const BasicStep = ({ title, crumbs, headings, stepActive, setStepActive, handleSubmit, edit = false, formValues}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchCustomPostTypes);

    // manage local state
    const [icon, setIcon] = useState(null);
    const [supports, setSupports] = useState({
        title: true,
        editor: true,
        thumbnail: true,
        excerpt: true,
        author: false,
        trackbacks: false,
        custom_fields: false,
        comments: false,
        revisions: false,
        page_attributes: false,
        post_formats: false,
    });

    const { register, handleSubmit: submit, setValue, formState: {errors} } = useForm({
        mode: 'all'
    });

    useEffect(() => {
        if(formValues && formValues[1]){

            setIcon(formValues[1].icon);
            setSupports({
                title: formValues[1].support_0,
                editor: formValues[1].support_1,
                thumbnail: formValues[1].support_2,
                excerpt: formValues[1].support_3,
                author: formValues[1].support_4,
                trackbacks: formValues[1].support_5,
                custom_fields: formValues[1].support_6,
                comments: formValues[1].support_7,
                revisions: formValues[1].support_8,
                page_attributes: formValues[1].support_9,
                post_formats: formValues[1].support_10,
            });

            setValue("post_name", formValues[1].post_name);
            setValue("singular_label", formValues[1].singular_label);
            setValue("plural_label", formValues[1].plural_label);
            setValue("icon", formValues[1].icon);
            setValue("support_0", formValues[1].support_0);
            setValue("support_1", formValues[1].support_1);
            setValue("support_2", formValues[1].support_2);
            setValue("support_3", formValues[1].support_3);
            setValue("support_4", formValues[1].support_4);
            setValue("support_5", formValues[1].support_5);
            setValue("support_6", formValues[1].support_6);
            setValue("support_7", formValues[1].support_7);
            setValue("support_8", formValues[1].support_8);
            setValue("support_9", formValues[1].support_9);
            setValue("support_10", formValues[1].support_10);
        }
    }, [formValues]);

    useEffect(() => {
        if(data.length > 0){

            setIcon(data[0].icon);
            setSupports({
                title: data[0].supports.includes('title'),
                editor: data[0].supports.includes('editor'),
                thumbnail: data[0].supports.includes('thumbnail'),
                excerpt: data[0].supports.includes('excerpt'),
                author: data[0].supports.includes('author'),
                trackbacks: data[0].supports.includes('trackbacks'),
                custom_fields: data[0].supports.includes('custom-fields'),
                comments: data[0].supports.includes('comments'),
                revisions: data[0].supports.includes('revisions'),
                page_attributes: data[0].supports.includes('page-attributes'),
                post_formats: data[0].supports.includes('post-formats'),
            });

            setValue("post_name", data[0].name);
            setValue("singular_label", data[0].singular);
            setValue("plural_label", data[0].plural);
            setValue("icon", data[0].icon);
            setValue("support_0", data[0].supports.includes('title') ? 'title' : false);
            setValue("support_1", data[0].supports.includes('editor') ? 'editor' : false);
            setValue("support_2", data[0].supports.includes('thumbnail') ? 'thumbnail' : false);
            setValue("support_3", data[0].supports.includes('excerpt') ? 'excerpt' : false);
            setValue("support_4", data[0].supports.includes('author') ? 'author' : false);
            setValue("support_5", data[0].supports.includes('trackbacks') ? 'trackbacks' : false);
            setValue("support_6", data[0].supports.includes('custom-fields') ? 'custom-fields' : false);
            setValue("support_7", data[0].supports.includes('comments') ? 'comments' : false);
            setValue("support_8", data[0].supports.includes('revisions') ? 'revisions' : false);
            setValue("support_9", data[0].supports.includes('page-attributes') ? 'page-attributes' : false);
            setValue("support_10", data[0].supports.includes('post-formats') ? 'post-formats' : false);
        }
    }, [data]);

    const handlePostNameChange = (post_name) => {
        setValue('post_name', sluggifyString(post_name, 20));
    };

    const onSubmit = (data) => {
        handleSubmit(data, 1);
        setStepActive(1);
    };

    const actions = [
        <Button
            testId="next-step"
            style={styleVariants.SECONDARY}
        >
            {useTranslation("Next Step")}
        </Button>
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
                        label={useTranslation("Post name")}
                        value={
                            <Input
                                id="post_name"
                                placeholder={useTranslation("Post name")}
                                readOnly={data.length > 0}
                                description={useTranslation("The post name/slug. Used for various queries.")}
                                onChangeCapture={ e => handlePostNameChange(e.currentTarget.value) }
                                register={register}
                                errors={errors}
                                isRequired={true}
                                validate={{
                                    validate: edit ? isPostTypeNameValid : asyncIsPostTypeNameValid,
                                    required: useTranslation("This field is mandatory")
                                }}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Singular label")}
                        value={
                            <Input
                                id="singular_label"
                                placeholder={useTranslation("(e.g. Movie)")}
                                defaultValue={data.length > 0 ? data[0].singular : null }
                                description={useTranslation("Used when a singular label is needed")}
                                register={register}
                                errors={errors}
                                isRequired={true}
                                validate={{
                                    required: useTranslation("This field is mandatory")
                                }}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Plural label")}
                        value={
                            <Input
                                id="plural_label"
                                placeholder={useTranslation("(e.g. Movies)")}
                                defaultValue={data.length > 0 ? data[0].plural : null }
                                description={useTranslation("Used for the post type admin menu item")}
                                register={register}
                                errors={errors}
                                isRequired={true}
                                validate={{
                                    required: useTranslation("This field is mandatory")
                                }}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Icon")}
                        value={
                            <IconPicker
                                id="icon"
                                callback={(value) => {
                                    setValue("icon", value);
                                }}
                                defaultValue={icon}
                                register={register}
                                errors={errors}
                                description={useTranslation("Displayed on the sidebar of the admin panel")}
                                validate={{
                                    required: useTranslation("This field is mandatory")
                                }}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Support")}
                        wizard={`${useTranslation("Add support for various available post edit features. For more info")} <a target='_blank' href='https://developer.wordpress.org/reference/functions/register_post_type/#supports'>${useTranslation("see here")}<a/>.`}
                        value={
                            <Checkbox
                                register={register}
                                errors={errors}
                                id="support"
                                values={{
                                    "title": {
                                        "value": "title",
                                        "checked": supports.title,
                                    },
                                    "editor": {
                                        "value": "editor",
                                        "checked": supports.editor,
                                    },
                                    "thumbnail": {
                                        "value": "thumbnail",
                                        "checked": supports.thumbnail,
                                    },
                                    "excerpt": {
                                        "value": "excerpt",
                                        "checked": supports.excerpt,
                                    },
                                    "author": {
                                        "value": "author",
                                        "checked": supports.author,
                                    },
                                    "trackbacks": {
                                        "value": "trackbacks",
                                        "checked": supports.trackbacks,
                                    },
                                    "custom-fields": {
                                        "value": "custom-fields",
                                        "checked": supports.custom_fields,
                                    },
                                    "comments": {
                                        "value": "comments",
                                        "checked": supports.comments,
                                    },
                                    "revisions": {
                                        "value": "revisions",
                                        "checked": supports.revisions,
                                    },
                                    "page-attributes": {
                                        "value": "page-attributes",
                                        "checked": supports.page_attributes,
                                    },
                                    "post-formats": {
                                        "value": "post-formats",
                                        "checked": supports.post_formats,
                                    }
                                }}
                            />
                        }
                    />
                </Card>
            </Layout>
        </form>
    );
};

BasicStep.propTypes = {
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
    edit: PropTypes.bool
};

export default BasicStep;