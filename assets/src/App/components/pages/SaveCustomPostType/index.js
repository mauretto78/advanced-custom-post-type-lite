import React, {useEffect, useRef, useState} from 'react';
import OtherSettingsStep from "./_Settings";
import BasicStep from "./_Basic";
import AdditionalLabelsStep from "./_Labels";
import Steps from "../../reusable/Steps";
import {saveCustomPostTypeHeadings} from "../../../constants/steps";
import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
import Spinner from "../../reusable/Loader/Spinner";
import {resetPostTypes} from "../../../redux/thunks/resetPostTypes";
import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
import {startFromStep, stepReset} from "../../../redux/actions/stepsActions";
import {hydratePostTypeFormFromStep} from "../../../utils/forms";
import {wpAjaxRequest} from "../../../utils/ajax";

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
    const [isWPGraphQLActive, setIsWPGraphQLActive] = useState(false);

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
        <BasicStep postType={postType} edit={edit} headings={saveCustomPostTypeHeadings}/>,
        <AdditionalLabelsStep postType={postType} headings={saveCustomPostTypeHeadings} />,
        <OtherSettingsStep postType={postType} isWPGraphQLActive={false} headings={saveCustomPostTypeHeadings} setPristineHandler={setPristineHandler}/>,
    ];

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    return(
        <React.Fragment>
            {Prompt}
            <Steps
                steps={steps}
            />
        </React.Fragment>
    )
};

export default SaveCustomPostType;