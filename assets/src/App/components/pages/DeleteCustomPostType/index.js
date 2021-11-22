import React, {useEffect, useRef} from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {Link, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deletePostType} from "../../../redux/thunks/deletePostType";
import {toast} from "react-toastify";
import {metaTitle, refreshPage} from "../../../utils/misc";
import {Icon} from "@iconify/react";
import Copyright from "../../reusable/Copyright";

const DeleteCustomPostType = () => {

    // manage global state
    const dispatch = useDispatch();
    const {errors, success, loading} = useSelector(state => state.deleteCustomPostTypeReducer);

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
                    toast.success("Custom post type successfully deleted. The browser will refresh after 5 seconds...");
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

    return (
        <div>
            <Breadcrumbs crumbs={[
                {
                    label: "Advanced custom post types",
                    link: "/"
                },
                {
                    label: 'Delete custom post type'
                }
            ]} />
            <h1 className="acpt-title">
                <Icon icon="bx:bx-trash" color="#02c39a" width="24px"/>
                &nbsp;
                Delete {postType}
            </h1>
            <p>You are going to delete <strong>{postType} </strong> custom post type. Are you sure?</p>
            <div className="mb-3">
                <a className="acpt-btn acpt-btn-danger" onClick={ e => handleDeleteCustomPostType(postType, 'all') }>
                    <Icon icon="bx:bx-trash" width="24px"/>
                    Yes, Delete it
                </a>
                &nbsp;
                <Link
                    to="/"
                    className="acpt-btn acpt-btn-primary-o prev">
                    <Icon icon="bx:bx-category-alt" width="24px" />
                        Return back to list
                </Link>
            </div>
            <Copyright/>
        </div>
    );
};

export default DeleteCustomPostType;