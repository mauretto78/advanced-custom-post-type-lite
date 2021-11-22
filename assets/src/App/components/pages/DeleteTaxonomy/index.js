import React, {useEffect, useRef} from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {Link, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {metaTitle} from "../../../utils/misc";
import {deleteTaxonomy} from "../../../redux/thunks/deleteTaxonomy";
import {Icon} from "@iconify/react";
import Copyright from "../../reusable/Copyright";

const DeleteTaxonomy = () => {

    // manage global state
    const dispatch = useDispatch();
    const {errors, success, loading} = useSelector(state => state.deleteTaxonomyReducer);

    // manage local state
    const {taxonomy} = useParams();
    const didMountRef = useRef(false);

    useEffect(() => {
        metaTitle(`Delete ${taxonomy}`);
    }, []);

    // manage redirect
    const history = useHistory();

    // manage delete
    const handleDeleteTaxonomy = async (taxonomy) => {
        await dispatch(deleteTaxonomy(taxonomy));
    };

    // handle delete outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                if(success){
                    history.push('/taxonomies');
                    toast.success("Taxonomy successfully deleted");
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
                    label: "Registered Custom Post Types",
                    link: "/"
                },
                {
                    label: "Registered Taxonomies",
                    link: "/taxonomies"
                },
                {
                    label: 'Delete Taxonomy'
                }
            ]} />
            <h1 className="acpt-title">
                <Icon icon="bx:bx-trash" color="#02c39a" width="24px" />
                &nbsp;
                Delete {taxonomy}
            </h1>
            <p>You are going to delete <strong>{taxonomy} </strong> taxonomy. Are you sure?</p>
            <div>
                <a className="acpt-btn acpt-btn-danger" onClick={ e => handleDeleteTaxonomy(taxonomy) }>
                    <Icon icon="bx:bx-trash" width="24px" />
                    Yes, Delete it
                </a>
                &nbsp;
                <Link
                    to="/taxonomies"
                    className="acpt-btn acpt-btn-primary-o prev">
                    <Icon icon="bx:bx-category-alt" width="24px" />
                    Return back to list
                </Link>
            </div>
            <Copyright/>
        </div>
    );
};

export default DeleteTaxonomy;