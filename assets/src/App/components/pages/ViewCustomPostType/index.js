import React, {useEffect, useRef, useState} from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory, useParams} from "react-router-dom";
import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
import Spinner from "../../reusable/Loader/Spinner";
import {metaTitle} from "../../../utils/misc";
import Accordion from "../../reusable/Accordion";
import LabelsElement from "./_Labels";
import BasicElement from "./_Basic";
import SettingsElement from "./_Settings";
import NotFound404 from "../404";
import Layout from "../../../components/reusable/Layout";
import ActionsBar from "../../../components/reusable/Layout/ActionsBar";

const ViewCustomPostType = () => {

    // manage global state
    const {fetched, loading} = useSelector(state => state.fetchPostTypesReducer);
    const dispatch = useDispatch();

    // manage local state
    const {postType} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);
    const [activeTab, setActiveTab] = useState(1);

    const handleAccordionClick = (index) => {
        setActiveTab(index+1);
    };

    // manage redirect
    const history = useHistory();

    if(postType === 'page' || postType === 'post'){
        history.push('/');
    }

    useEffect(() => {
        dispatch(fetchPostTypes({
            postType:postType
        }));
        metaTitle("Custom Post Type global settings");
    }, [postType]);

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

    const buttons =
        <React.Fragment>
            <Link
                className="acpt-btn acpt-btn-primary"
                to={`/edit/${postType}/${activeTab}`}
            >
                Edit
            </Link>
            <Link
                className="acpt-btn acpt-btn-primary-o"
                to={`/assoc-taxonomy-post/${postType}`}
            >
                Taxonomies association
            </Link>
        </React.Fragment>;

    return (
        <Layout>
            <ActionsBar
                title={`${postType} global settings`}
                actions={buttons}
            />
            <main>
                <Breadcrumbs crumbs={[
                    {
                        label: "Registered Custom Post Types",
                        link: "/"
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

export default ViewCustomPostType;