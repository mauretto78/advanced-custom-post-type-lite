import React, {useEffect, useState} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {wpAjaxRequest} from "../../utils/ajax";
import {metaTitle} from "../../utils/misc";
import {fetchCustomPostTypes} from "../../redux/reducers/fetchCustomPostTypesSlice";
import Loader from "../../components/Loader";
import PageNotFound from "../404";
import Basic from "./Tabs/Basic";
import Labels from "./Tabs/Labels";
import Settings from "./Tabs/Settings";
import ButtonLink from "../../components/ButtonLink";
import {styleVariants} from "../../constants/styles";
import {flushCookieMessages} from "../../utils/cookies";
import {useTabsKeyboardNav} from "../../hooks/useTabsKeyboardNav";

const ViewCustomPostType = () => {
    // manage global state
    const {data, loading} = useSelector(state => state.fetchCustomPostTypes);
    const dispatch = useDispatch();

    // manage local state
    const {postType} = useParams();
    const [isWPGraphQLActive, setIsWPGraphQLActive] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [fetchError, setFetchError] = useState(false);

    const tabs = [
        "Basic",
        "Labels",
        "Settings"
    ];

    const {getTabProps} = useTabsKeyboardNav(activeTab, setActiveTab, tabs.length);

    // manage redirect
    const navigate = useNavigate();

    if(postType === 'page' || postType === 'post'){
        navigate('/');
    }

    // fetch post
    useEffect(() => {
        dispatch(fetchCustomPostTypes({
            postType:postType
        }))
            .then(res => {
                if(res.payload.length !== 1){
                    setFetchError(true);
                }

                metaTitle(`${res.payload[0].singular}: ${useTranslation("global settings")}`);
                flushCookieMessages();
            })
            .catch(err => {
                setFetchError(true);
                console.error(err);
            })
        ;

    }, [postType]);

    if(loading){
        return <Loader/>;
    }

    if(fetchError){
        return (
            <PageNotFound />
        );
    }

    const actions = [
        <ButtonLink key="edit" style={styleVariants.PRIMARY} size="sm" icon="bx:edit-alt" to={`/edit/${postType}/${activeTab}`}>{useTranslation("Edit")}</ButtonLink>,
        <ButtonLink key="taxonomies-association" style={styleVariants.OUTLINED_PRIMARY} size="sm" icon="bx:link" to={`/assoc-taxonomy-post/${postType}`}>{useTranslation("Taxonomies association")}</ButtonLink>,
    ];

    return (
        <Layout
            title={`${postType}: ${useTranslation("global settings")}`}
            actions={actions}
            crumbs={[
                {
                    label: useTranslation("Registered Custom Post Types"),
                    link: "/"
                },
                {
                    label: `${data.length > 0 ? data[0].singular : ""}: ${useTranslation("global settings")}`
                }
            ]}
        >
            <div>
                <div className="acpt-tabs">
                    <ul
                        role="tablist"
                        className={`acpt-tablist mb-12`}
                    >
                        {tabs.map((tab, index) => (
                            <li
                                key={index}
                                className={`acpt-accordion-tab ${activeTab === index ? "active" : ""}`}
                                {...getTabProps(index)}
                            >
                                {tab}
                            </li>
                        ))}
                    </ul>
                </div>
                {activeTab === 0 && (<Basic data={data}/>)}
                {activeTab === 1 && (<Labels data={data} postType={postType}/>)}
                {activeTab === 2 && ( <Settings data={data} isWPGraphQLActive={isWPGraphQLActive} />)}
            </div>
        </Layout>
    );
};

export default ViewCustomPostType;