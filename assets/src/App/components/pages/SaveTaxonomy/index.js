import React, {useEffect, useRef, useState} from 'react';
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
import {startFromStep, stepReset} from "../../../redux/actions/stepsActions";
import {hydratePostTypeFormFromStep, hydrateTaxonomyFormFromStep} from "../../../utils/forms";

const SaveTaxonomy = () => {

    // manage global state
    const {fetched, loading} = useSelector(state => state.fetchTaxonomiesReducer);
    const dispatch = useDispatch();

    // manage local state
    const {taxonomy} = useParams();
    const {step} = useParams();
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const [edit, isEdit] = useState(false);
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);

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

    useEffect(() => {
        if(taxonomy){
            metaTitle(translate("taxonomy_edit.title"));
            dispatch(fetchTaxonomies({
                taxonomy:taxonomy
            }));

            isEdit(true);

            if(step){
                if(fetchedSuccess){
                    const stepInt = parseInt(step);
                    dispatch(startFromStep(stepInt, hydrateTaxonomyFormFromStep(stepInt,fetched[0])));
                }
            } else {
                dispatch(stepReset());
            }

        } else {
            metaTitle(translate("taxonomy_create.title"));
            changeCurrentAdminMenuLink('#/register_taxonomy');
            dispatch(resetTaxonomies());
            dispatch(stepReset());
        }
        setDirty();
    }, [fetchedSuccess]);

    const setPristineHandler = () => {
        setPristine();
    };

    const steps = [
        <BasicStep edit={edit} />,
        <AdditionalLabelsStep/>,
        <OtherSettingsStep setPristineHandler={setPristineHandler}/>,
    ];

    if(!fetchedSuccess){
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