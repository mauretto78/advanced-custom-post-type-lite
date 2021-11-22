import React, {useEffect} from 'react';
import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
import Steps from "../../reusable/Steps";
import {saveCustomPostTypeHeadings} from "../../../constants/steps";
import Spinner from "../../reusable/Loader/Spinner";
import {fetchTaxonomies} from "../../../redux/thunks/fetchTaxonomies";
import {resetTaxonomies} from "../../../redux/thunks/resetTaxonomies";
import BasicStep from "./_Basic";
import AdditionalLabelsStep from "./_Labels";
import OtherSettingsStep from "./_Settings";
import {Icon} from "@iconify/react";
import {translate} from "../../../localization";
import Copyright from "../../reusable/Copyright";

const SaveTaxonomy = () => {

    // manage global state
    const {loading} = useSelector(state => state.fetchTaxonomiesReducer);
    const dispatch = useDispatch();

    // manage local state
    const {taxonomy} = useParams();
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    useEffect(() => {
        if(taxonomy){
            metaTitle(translate("taxonomy_edit.title"));
            dispatch(fetchTaxonomies({
                taxonomy:taxonomy
            }));
        } else {
            metaTitle(translate("taxonomy_create.title"));
            changeCurrentAdminMenuLink('#/register_taxonomy');
            dispatch(resetTaxonomies());
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

    return (
        <div>
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
                    label: taxonomy ? "Edit Taxonomy" : "Create new Taxonomy"
                }
            ]} />
            {Prompt}
            <h1 className="acpt-title">
                <Icon icon={taxonomy ? "bx:bx-edit" : "bx:bx-list-plus"} color="#02c39a" width="24px" />
                &nbsp;
                {taxonomy ? "Edit Taxonomy" : "Create new Taxonomy" }
            </h1>
            <div className="acpt-card">
                <Steps headings={saveCustomPostTypeHeadings} steps={steps}/>
            </div>
            <Copyright/>
        </div>
    );
};

export default SaveTaxonomy;