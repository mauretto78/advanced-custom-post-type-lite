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

const ViewCustomPostType = () => {

    // manage global state
    const {data, loading} = useSelector(state => state.fetchCustomPostTypes);
    const dispatch = useDispatch();

    // manage local state
    const {postType} = useParams();
    const [isWPGraphQLActive, setIsWPGraphQLActive] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [fetchError, setFetchError] = useState(false);

    // manage redirect
    const navigate = useNavigate();

    if(postType === 'page' || postType === 'post'){
        navigate('/');
    }

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

    // fetch post
    useEffect(() => {
        dispatch(fetchCustomPostTypes({
            postType:postType
        }))
            .then(res => {
                if(res.payload.length !== 1){
                    setFetchError(true);
                }
                flushCookieMessages();
            })
            .catch(err => {
                setFetchError(true);
                console.error(err);
            })
        ;
        metaTitle(useTranslation("Custom Post Type global settings"));
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
        <ButtonLink style={styleVariants.PRIMARY} to={`/edit/${postType}/${activeTab}`}>{useTranslation("Edit")}</ButtonLink>,
        <ButtonLink style={styleVariants.SECONDARY} to={`/assoc-taxonomy-post/${postType}`}>{useTranslation("Taxonomies association")}</ButtonLink>,
     ];

    const tabs = [
        "Basic",
        "Labels",
        "Settings"
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
                    label: `${postType}: ${useTranslation("global settings")}`
                }
            ]}
        >
            <div>
                <div className="i-flex-center mb-8 s-8">
                    {tabs.map((tab, index) => (
                        <button
                            type="button"
                            className={`acpt-btn acpt-btn-${(parseInt(index) === parseInt(activeTab)) ? "white text-bold color-black" : "default"}`}
                            onClick={() => {
                                setActiveTab(parseInt(index));
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                {activeTab === 0 && (<Basic data={data}/>)}
                {activeTab === 1 && (<Labels data={data} postType={postType}/>)}
                {activeTab === 2 && ( <Settings data={data} isWPGraphQLActive={isWPGraphQLActive} />)}
            </div>
        </Layout>
    );
};

export default ViewCustomPostType;