import React, {useEffect, useState} from 'react';
import useTranslation from "../../hooks/useTranslation";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../components/Loader";
import PageNotFound from "../404";
import {changeCurrentAdminMenuLink, metaTitle, refreshPage} from "../../utils/misc";
import {fetchTaxonomies} from "../../redux/reducers/fetchTaxonomiesSlice";
import {scrollToTop} from "../../utils/scroll";
import Steps from "../../components/Steps";
import BasicStep from "./Steps/BasicStep";
import LabelsStep from "./Steps/LabelsStep";
import SettingsStep from "./Steps/SettingsStep";
import {saveTaxonomy} from "../../redux/reducers/saveTaxonomySlice";
import {toast} from "react-hot-toast";
import {setCookieMessage} from "../../utils/cookies";

const SaveTaxonomy = ({}) => {

    // manage global state
    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.saveTaxonomy);
    const {loading: fetchLoading} = useSelector(state => state.fetchTaxonomies);

    // manage local state
    const {taxonomy} = useParams();
    const {step} = useParams();
    const [edit, isEdit] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [stepActive, setStepActive] = useState(step ? parseInt(step) : 0);
    const [formValues, setFormValues] = useState({});
    const [title, setTitle] = useState(taxonomy && formValues[1] ? useTranslation("Edit") + " " + formValues[1].singular_label : useTranslation("Create new Taxonomy"));

    // manage redirect
    const navigate = useNavigate();

    if(taxonomy === 'category' || taxonomy === 'product_tag'){
        navigate('/');
    }

    useEffect(() => {
        if(taxonomy && formValues[1]){
            setTitle(useTranslation("Edit") + " " + formValues[1].singular_label);
        }

    }, [formValues]);

    useEffect(() => {
        if(taxonomy){
            dispatch(fetchTaxonomies({
                taxonomy:taxonomy
            }))
                .then(res => {

                    if(res.payload.length !== 1){
                        setFetchError(true);
                    } else {
                        setFormValues({
                            1: {
                                slug: res.payload[0].slug,
                                plural_label: res.payload[0].plural,
                                singular_label: res.payload[0].singular,
                            },
                            2: res.payload[0].labels,
                            3: res.payload[0].settings,
                        });

                        metaTitle(`${useTranslation("Edit")} ${res.payload[0].singular}`);
                    }

                })
                .catch(err => {
                    setFetchError(true);
                    console.error(err);
                })
            ;

            isEdit(true);

        } else {
            metaTitle(useTranslation("Create new Taxonomy"));
            changeCurrentAdminMenuLink('#/register_taxonomy');
        }
    }, []);

    const crumbs = [
        {
            label: useTranslation("Registered Taxonomies"),
            link: "/taxonomies"
        },
        {
            label: title
        }
    ];

    const headings = [
        {
            "label": useTranslation("Basic"),
            "description": useTranslation("Minimum configuration")
        },
        {
            "label": useTranslation("Labels"),
            "description": useTranslation("Additional labels")
        },
        {
            "label": useTranslation("Settings"),
            "description": useTranslation("Other settings")
        }
    ];

    const handleSubmit = (data, index) => {

        formValues[index] = data;
        setFormValues(formValues);
        scrollToTop();

        const isFormComplete = Object.keys(formValues).length === 3;

        if(isFormComplete){
            dispatch(saveTaxonomy(formValues))
                .then(res => {
                    const payload = res.payload;

                    if(payload.success){
                        setCookieMessage("Taxonomy successfully saved.");
                        navigate('/taxonomies');
                        refreshPage();
                    } else {
                        toast.error(payload.error);
                    }
                })
                .catch(err => {
                    toast.error(err);
                })
            ;
        }
    };

    if(edit && fetchLoading){
        return <Loader/>;
    }

    if(fetchError){
        return (
            <PageNotFound />
        );
    }

    return (
        <React.Fragment>
            <Steps
                steps={[
                    <BasicStep
                        edit={edit}
                        title={title}
                        headings={headings}
                        crumbs={crumbs}
                        stepActive={stepActive}
                        setStepActive={setStepActive}
                        handleSubmit={handleSubmit}
                        formValues={formValues}
                        setFormValues={setFormValues}
                    />,
                    <LabelsStep
                        edit={edit}
                        title={title}
                        headings={headings}
                        crumbs={crumbs}
                        stepActive={stepActive}
                        setStepActive={setStepActive}
                        handleSubmit={handleSubmit}
                        formValues={formValues}
                        setFormValues={setFormValues}
                    />,
                    <SettingsStep
                        title={title}
                        headings={headings}
                        crumbs={crumbs}
                        stepActive={stepActive}
                        setStepActive={setStepActive}
                        handleSubmit={handleSubmit}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        loading={loading}
                        edit={edit}
                    />
                ]}
                activeStep={stepActive}
            />
        </React.Fragment>
    );
};

export default SaveTaxonomy;