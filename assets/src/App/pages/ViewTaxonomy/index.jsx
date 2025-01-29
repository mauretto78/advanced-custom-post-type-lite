import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import Loader from "../../components/Loader";
import PageNotFound from "../404";
import ButtonLink from "../../components/ButtonLink";
import {styleVariants} from "../../constants/styles";
import useTranslation from "../../hooks/useTranslation";
import {changeCurrentAdminMenuLink, metaTitle} from "../../utils/misc";
import {fetchTaxonomies} from "../../redux/reducers/fetchTaxonomiesSlice";
import Layout from "../../layout/Layout";
import Basic from "./Tabs/Basic";
import Labels from "./Tabs/Labels";
import Settings from "./Tabs/Settings";
import {flushCookieMessages} from "../../utils/cookies";

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

                metaTitle(`${res.payload[0].singular}: ${useTranslation("global settings")}`);
                flushCookieMessages();
            })
            .catch(err => {
                setFetchError(true);
                console.error(err);
            })
        ;

        changeCurrentAdminMenuLink('#/taxonomies');
    }, [taxonomy]);

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

    const tabs = [
        "Basic",
        "Labels",
        "Settings"
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
                    label: `${data.length > 0 ? data[0].singular : ""}: ${useTranslation("global settings")}`
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
                {activeTab === 1 && (<Labels data={data} taxonomy={taxonomy}/>)}
                {activeTab === 2 && (<Settings data={data} />)}
            </div>
        </Layout>
    );
};

export default ViewTaxonomy;