import React, {useEffect, useRef} from 'react';
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import {Link, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deletePostType} from "../../../redux/thunks/deletePostType";
import {toast} from "react-toastify";
import {metaTitle, refreshPage} from "../../../utils/misc";
import {filterByLabel} from "../../../utils/objects";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";

const DeleteCustomPostType = () => {

    // manage global state
    const dispatch = useDispatch();
    const {errors, success, loading} = useSelector(state => state.deleteCustomPostTypeReducer);
    const {loading: settingsLoading, fetched: settings} = useSelector(state => state.fetchSettingsReducer);
    const deletePostsOption = filterByLabel(settings, 'key', 'delete_posts').value;

    // manage local state
    const {postType} = useParams();
    const didMountRef = useRef(false);

    useEffect(() => {
        metaTitle(`Delete ${postType} custom post type`);
    }, []);

    // manage redirect
    const history = useHistory();

    if(postType === 'page' || postType === 'post'){
        history.push('/');
    }

    // manage delete
    const handleDeleteCustomPostType = async (postType, mode) => {
        await dispatch(deletePostType(postType, mode));
    };

    // handle delete outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                if(success){
                    history.push('/');
                    toast.success("Custom post type successfully deleted. The browser will refresh after 5 seconds.");
                    refreshPage(5000);
                }

                if(errors.length > 0){
                    errors.map((error) => {
                        toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    const buttons = (
        <React.Fragment>
            <a className="acpt-btn acpt-btn-danger" onClick={ e => handleDeleteCustomPostType(postType, 'all') }>
                Yes, Delete it
            </a>
            <Link
                to="/"
                className="acpt-btn acpt-btn-primary-o"
            >
                Return back to list
            </Link>
        </React.Fragment>
    );

    return (
        <Layout>
            <ActionsBar
                title={`Delete ${postType}`}
                actions={buttons}
            />
            <main>
                <Breadcrumbs crumbs={[
                    {
                        label: "Advanced custom post types",
                        link: "/"
                    },
                    {
                        label: 'Delete custom post type'
                    }
                ]} />
                <h3 className="no-space acpt-alert acpt-alert-warning">
                    You are going to delete <strong>{postType} </strong> custom post type. Are you sure?
                </h3>
                {deletePostsOption === "1" && (
                    <strong className="">
                        WARNING: This action will delete all {postType} posts and metadata. The action is irreversible.
                    </strong>
                )}
            </main>
        </Layout>
    );
};

export default DeleteCustomPostType;