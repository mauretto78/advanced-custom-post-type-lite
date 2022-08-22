import React, {useEffect, useRef, useState} from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useParams} from "react-router-dom";
import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
import Spinner from "../../reusable/Loader/Spinner";
import {metaTitle} from "../../../utils/misc";
import Accordion from "../../reusable/Accordion";
import LabelsElement from "./_Labels";
import BasicElement from "./_Basic";
import SettingsElement from "./_Settings";
import NotFound404 from "../404";
import {Icon} from "@iconify/react";
import Copyright from "../../reusable/Copyright";

const ViewCustomPostType = () => {

    // manage global state
    const {fetched, loading} = useSelector(state => state.fetchPostTypesReducer);
    const dispatch = useDispatch();

    // manage local state
    const {postType} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);

    // manage redirect
    const history = useHistory();

    if(postType === 'page' || postType === 'post'){
        history.push('/');
    }

    useEffect(() => {
        dispatch(fetchPostTypes({
            postType:postType
        }));
        metaTitle("Custom Post Type global settings");
    }, [postType]);

    // handle fetch outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                if(fetched.length !== 0){
                    setFetchedSuccess(true);
                } else {
                    setFetchedSuccess(false);
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    if(fetchedSuccess === null){
        return <Spinner/>;
    }

    if(!fetchedSuccess){
        return <NotFound404/>;
    }

    return (
        <div>
            <Breadcrumbs crumbs={[
                {
                    label: "Registered Custom Post Types",
                    link: "/"
                },
                {
                    label: "Custom Post Type global settings"
                }
            ]} />
            <h1 className="acpt-title">
                <Icon icon="bx:bx-search-alt" color="#02c39a" width="18px" />
                &nbsp;
                {postType} global settings
            </h1>
            <Accordion>
                <BasicElement title="Basic" />
                <LabelsElement title="Labels" />
                <SettingsElement title="Settings"/>
            </Accordion>
            <Copyright/>
        </div>
    );
};

export default ViewCustomPostType;