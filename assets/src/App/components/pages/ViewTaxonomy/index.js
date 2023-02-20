import React, {useEffect, useRef, useState} from 'react';
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import Spinner from "../../reusable/Loader/Spinner";
import {metaTitle} from "../../../utils/misc";
import Accordion from "../../reusable/Accordion";
import LabelsElement from "./_Labels";
import BasicElement from "./_Basic";
import SettingsElement from "./_Settings";
import NotFound404 from "../404";
import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
import {translate} from "../../../localization";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";

const ViewTaxonomy = () => {

    // manage global state
    const {fetched, loading} = useSelector(state => state.fetchTaxonomiesReducer);
    const dispatch = useDispatch();

    // manage local state
    const {taxonomy} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState(1);

    useEffect(() => {
        dispatch(fetchTaxonomies({
            taxonomy:taxonomy
        }));
        metaTitle(translate("taxonomy_view.title"));
    }, [taxonomy]);

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

    const handleAccordionClick = (index) => {
        setActiveTab(index+1);
    };

    const buttons =
        <React.Fragment>
            <Link
                className="acpt-btn acpt-btn-primary"
                to={`/edit_taxonomy/${taxonomy}/${activeTab}`}
            >
                Edit
            </Link>
        </React.Fragment>;

    return (
        <Layout>
            <ActionsBar
                title={`${taxonomy} global settings`}
                actions={buttons}
            />
            <main>
                <Breadcrumbs crumbs={[
                    {
                        label: "Registered Custom Post Types",
                        link: "/"
                    },
                    {
                        label: "Registered Taxonomies",
                        link: "/taxonomies"
                    },
                    {
                        label: "Custom Post Type global settings"
                    }
                ]} />
                <Accordion handleClick={handleAccordionClick}>
                    <BasicElement title="Basic" />
                    <LabelsElement title="Labels" />
                    <SettingsElement title="Settings"/>
                </Accordion>
            </main>
        </Layout>
    );
};

export default ViewTaxonomy;



// import React, {useEffect, useRef, useState} from 'react';
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {useDispatch, useSelector} from "react-redux";
// import {useParams} from "react-router-dom";
// import Spinner from "../../reusable/Loader/Spinner";
// import {metaTitle} from "../../../utils/misc";
// import Accordion from "../../reusable/Accordion";
// import LabelsElement from "./_Labels";
// import BasicElement from "./_Basic";
// import SettingsElement from "./_Settings";
// import NotFound404 from "../404";
// import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
// import {Icon} from "@iconify/react";
// import {translate} from "../../../localization";
// import Copyright from "../../reusable/Copyright";
//
// const ViewTaxonomy = () => {
//
//     // manage global state
//     const {fetched, loading} = useSelector(state => state.fetchTaxonomiesReducer);
//     const dispatch = useDispatch();
//
//     // manage local state
//     const {taxonomy} = useParams();
//     const didMountRef = useRef(false);
//     const [fetchedSuccess, setFetchedSuccess] = useState(null);
//
//     useEffect(() => {
//         dispatch(fetchTaxonomies({
//             taxonomy:taxonomy
//         }));
//         metaTitle(translate("taxonomy_view.title"));
//     }, [taxonomy]);
//
//     // handle fetch outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!loading){
//                 if(fetched.length !== 0){
//                     setFetchedSuccess(true);
//                 } else {
//                     setFetchedSuccess(false);
//                 }
//             }
//         } else {
//             didMountRef.current = true;
//         }
//     }, [loading]);
//
//     if(fetchedSuccess === null){
//         return <Spinner/>;
//     }
//
//     if(!fetchedSuccess){
//         return <NotFound404/>;
//     }
//
//     return (
//         <div>
//             <Breadcrumbs crumbs={[
//                 {
//                     label: "Registered Custom Post Types",
//                     link: "/"
//                 },
//                 {
//                     label: "Registered Taxonomies",
//                     link: "/taxonomies"
//                 },
//                 {
//                     label: "Custom Post Type global settings"
//                 }
//             ]} />
//             <h1 className="acpt-title">
//                 <Icon icon="bx:bx-search-alt" color="#02c39a" width="18px" />
//                 &nbsp;
//                 {taxonomy} global settings
//             </h1>
//             <Accordion>
//                 <BasicElement title="Basic" />
//                 <LabelsElement title="Labels" />
//                 <SettingsElement title="Settings"/>
//             </Accordion>
//             <Copyright/>
//         </div>
//     );
// };
//
// export default ViewTaxonomy;