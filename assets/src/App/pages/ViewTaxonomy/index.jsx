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
import {useTabsKeyboardNav} from "../../hooks/useTabsKeyboardNav";

const ViewTaxonomy = () => {
    // manage global state
    const {data, loading} = useSelector(state => state.fetchTaxonomies);
    const dispatch = useDispatch();

    // manage local state
    const {taxonomy} = useParams();
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
        <ButtonLink key="edit" style={styleVariants.PRIMARY} size="sm" icon="bx:edit-alt" to={`/edit_taxonomy/${taxonomy}/${activeTab}`}>{useTranslation("Edit")}</ButtonLink>,
        <ButtonLink key="taxonomies-association" style={styleVariants.OUTLINED_PRIMARY} size="sm" icon="bx:link" to={`/assoc-post-taxonomy/${taxonomy}`}>{useTranslation("Taxonomies association")}</ButtonLink>,
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
                {activeTab === 1 && (<Labels data={data} taxonomy={taxonomy}/>)}
                {activeTab === 2 && (<Settings data={data} />)}
            </div>
        </Layout>
    );
};

export default ViewTaxonomy;