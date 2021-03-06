import React, {useEffect, useRef} from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {Link, useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {metaTitle} from "../../../utils/misc";
import {Icon} from "@iconify/react";
import Copyright from "../../reusable/Copyright";
import {deleteWooCommerceProductData} from "../../../redux/thunks/deleteWooCommerceProductData";

const DeleteWooCommerceProductData = () => {

    // manage global state
    const dispatch = useDispatch();
    const {errors, success, loading} = useSelector(state => state.deleteWooCommerceProductDataReducer);

    // manage local state
    const {id} = useParams();
    const didMountRef = useRef(false);

    useEffect(() => {
        metaTitle(`Delete WooCommerce product data ${id}`);
    }, []);

    // manage redirect
    const history = useHistory();

    // manage delete
    const handleDeleteTaxonomy = async (id) => {
        await dispatch(deleteWooCommerceProductData(id));
    };

    // handle delete outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                if(success){
                    history.push('/product-data/product');
                    toast.success("WooCommerce product data successfully deleted");
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
                    label: "WooCommerce product data",
                    link: "/product-data/product"
                },
                {
                    label: 'Delete WooCommerce product data'
                }
            ]} />
            <h1 className="acpt-title">
                <Icon icon="bx:bx-trash" color="#02c39a" width="24px" />
                &nbsp;
                Delete WooCommerce product data #{id}
            </h1>
            <p>You are going to delete WooCommerce product data <strong>#{id} </strong>. Are you sure?</p>
            <div className="mb-3">
                <a className="acpt-btn acpt-btn-danger" onClick={ e => handleDeleteTaxonomy(id) }>
                    <Icon icon="bx:bx-trash" width="24px" />
                    Yes, Delete it
                </a>
                &nbsp;
                <Link
                    to="/product-data/product"
                    className="acpt-btn acpt-btn-primary-o prev">
                    <Icon icon="bx:bx-category-alt" width="24px" />
                    Return back to list
                </Link>
            </div>
            <Copyright/>
        </div>
    );
};

export default DeleteWooCommerceProductData;