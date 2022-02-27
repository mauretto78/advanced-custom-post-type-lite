import React, {useEffect, useRef, useState} from 'react';
import OtherSettingsStep from "./_Settings";
import BasicStep from "./_Basic";
import AdditionalLabelsStep from "./_Labels";
import Steps from "../../reusable/Steps";
import {saveCustomPostTypeHeadings} from "../../../constants/steps";
import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
import Spinner from "../../reusable/Loader/Spinner";
import {resetPostTypes} from "../../../redux/thunks/resetPostTypes";
import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
import {Icon} from "@iconify/react";
import Copyright from "../../reusable/Copyright";
import {startFromStep, stepReset} from "../../../redux/actions/stepsActions";
import {hydratePostTypeFormFromStep} from "../../../utils/forms";
import {filterById, isEmpty} from "../../../utils/objects";

const SaveCustomPostType = () => {

    // manage global state
    const {fetched,loading} = useSelector(state => state.fetchPostTypesReducer);
    const dispatch = useDispatch();

    // manage local state
    const {postType} = useParams();
    const {step} = useParams();
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const [edit, isEdit] = useState(false);
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);

    // manage redirect
    const history = useHistory();

    if(postType === 'page' || postType === 'post'){
        history.push('/');
    }

    // handle fetch outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    useEffect(() => {
        if(postType){
            metaTitle("Edit Custom Post Type");
            dispatch(fetchPostTypes({
                postType:postType
            }));

            isEdit(true);

            if(step){
                if(fetchedSuccess){
                    const stepInt = parseInt(step);
                    dispatch(startFromStep(stepInt, hydratePostTypeFormFromStep(stepInt,fetched[0])));
                }
            } else {
                dispatch(stepReset());
            }

        } else {
            metaTitle("Register new Custom Post Type");
            changeCurrentAdminMenuLink('#/register');
            dispatch(resetPostTypes());
            dispatch(stepReset());
        }
        setDirty();
    }, [fetchedSuccess]);

    const setPristineHandler = () => {
        setPristine();
    };

    const steps = [
        <BasicStep edit={edit} />,
        <AdditionalLabelsStep/>,
        <OtherSettingsStep setPristineHandler={setPristineHandler}/>,
    ];

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    return(
        <div>
            <Breadcrumbs crumbs={[
                {
                    label: "Registered Custom Post Types",
                    link: "/"
                },
                {
                    label: postType ? "Edit Custom Post Type" : "Create new Custom Post Type"
                }
            ]} />
            {Prompt}
            <h1 className="acpt-title">
                <Icon icon={postType ? "bx:bx-edit" : "bx:bx-list-plus"} color="#02c39a" width="24px" />
                &nbsp;
                {postType ? "Edit Custom Post Type" : "Create new Custom Post Type" }
            </h1>
            <div className="acpt-card">
                <Steps headings={saveCustomPostTypeHeadings} steps={steps}/>
            </div>
            <Copyright/>
        </div>
    )
};

export default SaveCustomPostType;