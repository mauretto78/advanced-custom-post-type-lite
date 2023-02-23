import React, {useEffect, useRef} from 'react';
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import {Link, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {metaTitle} from "../../../utils/misc";
import {deleteTaxonomy} from "../../../redux/thunks/deleteTaxonomy";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";

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

    const buttons = (
        <React.Fragment>
            <a className="acpt-btn acpt-btn-danger" onClick={ e => handleDeleteTaxonomy(taxonomy) }>
                Yes, Delete it
            </a>
            <Link
                to="/taxonomies"
                className="acpt-btn acpt-btn-primary-o">
                Return back to list
            </Link>
        </React.Fragment>
    );

    return (
        <Layout>
            <ActionsBar
                title={`Delete ${taxonomy}`}
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
                        label: 'Delete Taxonomy'
                    }
                ]} />
                <h3 className="acpt-alert acpt-alert-warning">You are going to delete <strong>{taxonomy} </strong> taxonomy. Are you sure?</h3>
            </main>
        </Layout>
    );
};

export default DeleteTaxonomy;