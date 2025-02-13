import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Steps from "../../components/Steps";
import BasicStep from "./Steps/BasicStep";
import LabelsStep from "./Steps/LabelsStep";
import SettingsStep from "./Steps/SettingsStep";
import useTranslation from "../../hooks/useTranslation";
import {fetchCustomPostTypes} from "../../redux/reducers/fetchCustomPostTypesSlice";
import {metaTitle, refreshPage} from "../../utils/misc";
import {scrollToTop} from "../../utils/scroll";
import {wpAjaxRequest} from "../../utils/ajax";
import {saveCustomPostType} from "../../redux/reducers/saveCustomPostTypeSlice";
import {toast} from "react-hot-toast";
import Loader from "../../components/Loader";
import PageNotFound from "../404";
import {setCookieMessage} from "../../utils/cookies";

const SaveCustomPostType = ({}) => {

    // manage global state
    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.saveCustomPostType);
    const {loading: fetchLoading} = useSelector(state => state.fetchCustomPostTypes);

    // manage local state
    const {postType} = useParams();
    const {step} = useParams();
    const [edit, setEdit] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [stepActive, setStepActive] = useState(step ? parseInt(step) : 0);
    const [formValues, setFormValues] = useState({});
    const [isWPGraphQLActive, setIsWPGraphQLActive] = useState(false);
    const [title, setTitle] = useState(postType && formValues[1] ? useTranslation("Edit") + " " + formValues[1].singular_label : useTranslation("Create new Custom Post Type"));

    // manage redirect
    const navigate = useNavigate();

    if(postType === 'page' || postType === 'post'){
        navigate('/');
    }

    useEffect(() => {
        if(postType && formValues[1]){
            setTitle(useTranslation("Edit") + " " + formValues[1].singular_label);
        }

    }, [formValues]);

    // is WPGraphQL active?
    useEffect(()=>{
        wpAjaxRequest("isWPGraphQLActiveAction", {})
            .then(res => {
                setIsWPGraphQLActive(res.status);
            })
            .catch(err => {
                console.error(err.message);
            })
        ;
    },[]);

    useEffect(() => {
        if(postType){
            setEdit(true);
            dispatch(fetchCustomPostTypes({
                postType:postType
            }))
                .then(res => {
                    if(res.payload.length !== 1){
                        setFetchError(true);
                    } else {
                        setFormValues({
                            1: {
                                icon: res.payload[0].icon,
                                plural_label: res.payload[0].plural,
                                post_name: res.payload[0].name,
                                singular_label: res.payload[0].singular,
                                support_0: res.payload[0].supports.includes('title') ? 'title' : false,
                                support_1: res.payload[0].supports.includes('editor') ? 'editor' : false,
                                support_2: res.payload[0].supports.includes('thumbnail') ? 'thumbnail' : false,
                                support_3: res.payload[0].supports.includes('excerpt') ? 'excerpt' : false,
                                support_4: res.payload[0].supports.includes('author') ? 'author' : false,
                                support_5: res.payload[0].supports.includes('trackbacks') ? 'trackbacks' : false,
                                support_6: res.payload[0].supports.includes('custom-fields') ? 'custom-fields' : false,
                                support_7: res.payload[0].supports.includes('comments') ? 'comments' : false,
                                support_8: res.payload[0].supports.includes('revisions') ? 'revisions' : false,
                                support_9: res.payload[0].supports.includes('page-attributes') ? 'page-attributes' : false,
                                support_10: res.payload[0].supports.includes('post-formats') ? 'post-formats' : false,

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
        } else {
            metaTitle(useTranslation("Register new Post Type"));
        }
    }, []);

    const crumbs = [
        {
            label: useTranslation("Registered Custom Post Types"),
            link: "/"
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
            dispatch(saveCustomPostType(formValues))
                .then(res => {
                    const payload = res.payload;

                    if(payload.success){
                        setCookieMessage("Custom post type successfully saved.");
                        navigate("/");
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
                        edit={edit}
                        title={title}
                        headings={headings}
                        crumbs={crumbs}
                        stepActive={stepActive}
                        setStepActive={setStepActive}
                        handleSubmit={handleSubmit}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        isWPGraphQLActive={isWPGraphQLActive}
                        loading={loading}
                    />
                ]}
                activeStep={stepActive}
            />
        </React.Fragment>
    );
};

export default SaveCustomPostType;