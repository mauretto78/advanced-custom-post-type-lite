import React, {useEffect} from 'react';
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

const SaveCustomPostType = () => {

    // manage global state
    const {loading} = useSelector(state => state.fetchPostTypesReducer);
    const dispatch = useDispatch();

    // manage local state
    const {postType} = useParams();
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    // manage redirect
    const history = useHistory();

    if(postType === 'page' || postType === 'post'){
        history.push('/');
    }

    useEffect(() => {
        if(postType){
            metaTitle("Edit Custom Post Type");
            dispatch(fetchPostTypes({
                postType:postType
            }));
        } else {
            metaTitle("Register new Custom Post Type");
            changeCurrentAdminMenuLink('#/register');
            dispatch(resetPostTypes());
        }
        setDirty();
    }, []);

    const setPristineHandler = () => {
        setPristine();
    };

    const steps = [
        <BasicStep/>,
        <AdditionalLabelsStep/>,
        <OtherSettingsStep setPristineHandler={setPristineHandler}/>,
    ];

    if(loading){
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