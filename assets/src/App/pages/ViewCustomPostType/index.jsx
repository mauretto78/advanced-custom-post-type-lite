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
import Tabs from "../../components/Tabs";
import Tab from "../../components/Tabs/Tab";
import Card from "../../components/Card";
import Basic from "./Tabs/Basic";
import Labels from "./Tabs/Labels";
import Settings from "./Tabs/Settings";
import ButtonLink from "../../components/ButtonLink";
import {styleVariants} from "../../constants/styles";

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
            })
            .catch(err => {
                setFetchError(true);
                console.error(err);
            })
        ;
        metaTitle(useTranslation("Custom Post Type global settings"));
    }, [postType]);

    const handleStepChange = (step) => {
        setActiveTab(step);
    };

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
            <Card style="with-shadow p-24">
                <Tabs
                    handleClick={handleStepChange}
                    defaultActiveTab={activeTab}
                >
                    <Tab title={useTranslation("Basic")}>
                        <Basic data={data}/>
                    </Tab>
                    <Tab title={useTranslation("Labels")}>
                        <Labels data={data}/>
                    </Tab>
                    <Tab title={useTranslation("Settings")}>
                        <Settings data={data} isWPGraphQLActive={isWPGraphQLActive} />
                    </Tab>
                </Tabs>
            </Card>
        </Layout>
    );
};

export default ViewCustomPostType;