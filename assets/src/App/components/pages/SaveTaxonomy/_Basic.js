import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "react-hook-form";
import {stepForward} from "../../../redux/actions/stepsActions";
import InputText from "../../reusable/Form/InputText";
import StepsButtons from "../../reusable/Steps/StepsButtons";
import {sluggifyString} from "../../../utils/strings";
import {asyncIsTaxonomySlugValid, isTaxonomySlugValid} from "../../../utils/validation";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import StepsHeader from "../../reusable/Steps/StepsHeader";

const BasicStep = ({edit, headings, taxonomy}) => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
    const dispatch = useDispatch();

    // handle form
    const { control, register, handleSubmit, setValue, formState: {errors, isValid} } = useForm({
        mode: 'all',
        defaultValues: {
            slug: fetched.length > 0 ? fetched[0].slug : null,
            singular_label: fetched.length > 0 ? fetched[0].singular : null,
            plural_label: fetched.length > 0 ? fetched[0].plural : null,
        }
    });

    const handleSlugChange = (slug) => {
        setValue('slug', sluggifyString(slug, 32));
    };

    const onSubmit = (data) => {
        dispatch(stepForward(data));
    };

    return (
        <Layout>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ActionsBar
                    title={taxonomy ? "Edit Taxonomy" : "Create new Taxonomy"}
                    actions={<StepsButtons isValid={isValid} next={2} />}
                />
                <main>
                    <Breadcrumbs crumbs={[
                        {
                            label: "Registered Custom Post Types",
                            link: "/"
                        },
                        {
                            label: "Registered Taxonomies",
                            link: "/taxonomies"
                        },
                        {
                            label: taxonomy ? "Edit Taxonomy" : "Create new Taxonomy"
                        }
                    ]} />
                    <div className="acpt-card">
                        <StepsHeader headings={headings}/>
                        <div className="acpt-card__inner">
                            <InputText
                                id="slug"
                                label="Slug"
                                placeholder="slug"
                                readOnly={fetched.length > 0}
                                defaultValue={fetched.length > 0 ? fetched[0].slug : null }
                                description="The post name/slug. Used for various queries for taxonomy content."
                                register={register}
                                errors={errors}
                                isRequired={true}
                                onChangeCapture={ e => handleSlugChange(e.currentTarget.value) }
                                validate={{
                                    validate: edit ? isTaxonomySlugValid : asyncIsTaxonomySlugValid,
                                    required: "This field is mandatory"
                                }} />
                            <InputText
                                id="singular_label"
                                label="Singular label"
                                placeholder="(e.g. Movie)"
                                defaultValue={fetched.length > 0 ? fetched[0].singular : null }
                                description="Used when a singular label is needed"
                                register={register}
                                errors={errors}
                                isRequired={true}
                                validate={{
                                    required: "This field is mandatory"
                                }} />
                            <InputText
                                id="plural_label"
                                label="Plural label"
                                placeholder="(e.g. Movies)"
                                defaultValue={fetched.length > 0 ? fetched[0].plural : null }
                                description="Used for the taxonomy admin menu item"
                                register={register}
                                errors={errors}
                                isRequired={true}
                                validate={{
                                    required: "This field is mandatory"
                                }} />
                        </div>
                    </div>
                </main>
            </form>
        </Layout>
    );
};

export default BasicStep;