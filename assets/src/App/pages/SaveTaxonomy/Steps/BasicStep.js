import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import {useForm} from "react-hook-form";
import Layout from "../../../layout/Layout";
import StepsHeader from "../../../components/Steps/StepsHeader";
import Card from "../../../components/Card";
import {useSelector} from "react-redux";
import {sluggifyString} from "../../../utils/strings";
import Input from "../../../components/Forms/Input";
import CardRow from "../../../components/Card/CardRow";
import {asyncIsTaxonomySlugValid, isTaxonomySlugValid} from "../../../utils/validation";

const BasicStep = ({ title, crumbs, headings, stepActive, setStepActive, handleSubmit, formValues, edit = false}) => {

    // manage global state
    const {data} = useSelector(state => state.fetchTaxonomies);

    const { register, handleSubmit: submit, setValue, formState: {errors} } = useForm({
        mode: 'all'
    });

    useEffect(() => {
        if(formValues && formValues[1]){
            setValue("slug", formValues[1].slug);
            setValue("singular_label", formValues[1].singular_label);
            setValue("plural_label", formValues[1].plural_label);
        }
    }, [formValues]);

    useEffect(()=>{
        if(data.length > 0){
            setValue("slug", data[0].slug);
            setValue("singular_label", data[0].singular);
            setValue("plural_label", data[0].plural);
        }
    }, [data]);

    const handleSlugChange = (slug) => {
        setValue('slug', sluggifyString(slug, 32));
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
                        label={useTranslation("Slug")}
                        value={
                            <Input
                                id="slug"
                                placeholder={useTranslation("Slug")}
                                readOnly={data.length > 0}
                                description={useTranslation("The post name/slug. Used for various queries for taxonomy content.")}
                                onChangeCapture={ e => handleSlugChange(e.currentTarget.value) }
                                register={register}
                                errors={errors}
                                isRequired={true}
                                validate={{
                                    validate: edit ? isTaxonomySlugValid : asyncIsTaxonomySlugValid,
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
                                description={useTranslation("Used for the taxonomy admin menu item")}
                                register={register}
                                errors={errors}
                                isRequired={true}
                                validate={{
                                    required: useTranslation("This field is mandatory")
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