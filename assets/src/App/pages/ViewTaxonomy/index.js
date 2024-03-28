import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import Loader from "../../components/Loader";
import PageNotFound from "../404";
import ButtonLink from "../../components/ButtonLink";
import {styleVariants} from "../../constants/styles";
import useTranslation from "../../hooks/useTranslation";
import {metaTitle} from "../../utils/misc";
import {fetchTaxonomies} from "../../redux/reducers/fetchTaxonomiesSlice";
import Layout from "../../layout/Layout";
import Basic from "./Tabs/Basic";
import Labels from "./Tabs/Labels";
import Settings from "./Tabs/Settings";
import Tab from "../../components/Tabs/Tab";
import Tabs from "../../components/Tabs";
import Card from "../../components/Card";

const ViewTaxonomy = () => {

    // manage global state
    const {data, loading} = useSelector(state => state.fetchTaxonomies);
    const dispatch = useDispatch();

    // manage local state
    const {taxonomy} = useParams();
    const [activeTab, setActiveTab] = useState(0);
    const [fetchError, setFetchError] = useState(false);

    // manage redirect
    const navigate = useNavigate();

    if(taxonomy === 'category' || taxonomy === 'product_cat'){
        navigate('/');
    }

    // fetch post
    useEffect(() => {
        dispatch(fetchTaxonomies({
            taxonomy: taxonomy
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

        metaTitle(useTranslation("Taxonomy global settings"));
    }, [taxonomy]);

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
        <ButtonLink style={styleVariants.PRIMARY} to={`/edit_taxonomy/${taxonomy}/${activeTab}`}>{useTranslation("Edit")}</ButtonLink>,
        <ButtonLink style={styleVariants.SECONDARY} to={`/assoc-post-taxonomy/${taxonomy}`}>{useTranslation("Taxonomies association")}</ButtonLink>,
    ];

    return (
        <Layout
            title={useTranslation("Taxonomy global settings")}
            actions={actions}
            crumbs={[
                {
                    label: useTranslation("Registered Taxonomies"),
                    link: "/taxonomies"
                },
                {
                    label: useTranslation("Taxonomy global settings")
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
                        <Settings data={data} />
                    </Tab>
                </Tabs>
            </Card>
        </Layout>
    );
};

export default ViewTaxonomy;