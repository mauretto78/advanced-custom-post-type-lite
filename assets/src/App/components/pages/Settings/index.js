import React, {useEffect, useRef, useState} from 'react';
import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {Icon} from "@iconify/react";
import {useDispatch, useSelector} from "react-redux";
import {fetchSettings} from "../../../redux/thunks/fetchSettings";
import Spinner from "../../reusable/Loader/Spinner";
import SettingsForm from "./SettingsForm";
import Copyright from "../../reusable/Copyright";

const Settings = () => {

    // manage global state
    const {loading} = useSelector(state => state.fetchSettingsReducer);
    const dispatch = useDispatch();

    // manage local state
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);

    useEffect(() => {
        metaTitle(`Settings page`);
        changeCurrentAdminMenuLink('#/settings');
        dispatch(fetchSettings());
    }, []);

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

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    return (
        <React.Fragment>
            <Breadcrumbs crumbs={[
                {
                    label: "Advanced custom post types",
                    link: "/"
                },
                {
                    label: "Settings"
                }
            ]} />
            <h1 className="acpt-title">
                <Icon icon="bx:bx-cog" color="#02c39a" width="18px" />
                &nbsp;
                Settings
            </h1>
            <div className="acpt-card">
                <SettingsForm/>
            </div>
            <Copyright/>
        </React.Fragment>
    );
};

export default Settings;