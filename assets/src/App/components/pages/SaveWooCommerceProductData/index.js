import React, {useEffect, useRef, useState} from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {Icon} from "@iconify/react";
import {useDispatch, useSelector} from "react-redux";
import Copyright from "../../reusable/Copyright";
import {useParams} from "react-router-dom";
import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
import {metaTitle} from "../../../utils/misc";
import {fetchWooCommerceProductData} from "../../../redux/thunks/fetchWooCommerceProductData";
import Spinner from "../../reusable/Loader/Spinner";
import {resetWooCommerceProductData} from "../../../redux/thunks/resetWooCommerceProductData";
import SaveWooCommerceProductDataForm from "./SaveWooCommerceProductDataForm";

const SaveWooCommerceProductData = () => {

    // manage global state
    const {loading: fetchingLoading } = useSelector(state => state.fetchWooCommerceProductDataReducer);
    const dispatch = useDispatch();

    // manage local state
    const {id} = useParams();
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);

    useEffect(() => {
        if(id){
            metaTitle("Edit WooCommerce product data");
            dispatch(fetchWooCommerceProductData({
                id: id
            }));
        } else {
            metaTitle("Create new WooCommerce product data");
            dispatch(resetWooCommerceProductData());
        }
        setDirty();
    }, []);

    const setPristineHandler = () => {
        setPristine();
    };

    useEffect(() => {
        if (didMountRef.current){
            if(!fetchingLoading){
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [fetchingLoading]);

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
                    label: "WooCommerce product data",
                    link: "/product-data/product"
                },
                {
                    label: `Create new WooCommerce product data`
                }
            ]}
            />
            {Prompt}
            <h1 className="acpt-title">
                <Icon icon={id ? "bx:bx-edit" : "bx:bx-list-plus"} color="#02c39a" width="18px" />
                &nbsp;
                {id ? "Edit WooCommerce product data" : "Create new WooCommerce product data" }
            </h1>
            <div className="acpt-card">
                <div className="acpt-steps-wrapper">
                    <SaveWooCommerceProductDataForm id={id} setPristineHandler={setPristineHandler}/>
                </div>
            </div>
            <Copyright/>
        </div>
    );
};

export default SaveWooCommerceProductData;