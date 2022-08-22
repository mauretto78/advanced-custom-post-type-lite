import React, {useEffect, useRef, useState} from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import Spinner from "../../reusable/Loader/Spinner";
import {metaTitle} from "../../../utils/misc";
import NotFound404 from "../404";
import {Icon} from "@iconify/react";
import Copyright from "../../reusable/Copyright";
import {fetchWooCommerceProductData} from "../../../redux/thunks/fetchWooCommerceProductData";
import Boolean from "../../reusable/Boolean";
import WooCommerceProductDataVisibility from "../../reusable/WooCommerceProductDataVisibility";

const ViewWooCommerceProductData = () => {

    // manage global state
    const {fetched, loading} = useSelector(state => state.fetchWooCommerceProductDataReducer);
    const dispatch = useDispatch();

    // manage local state
    const {id} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);

    useEffect(() => {
        dispatch(fetchWooCommerceProductData({
            id:id
        }));
        metaTitle("View WooCommerce product data");
    }, [id]);

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
                    label: "View WooCommerce product data"
                }
            ]} />
            <h1 className="acpt-title">
                <Icon icon="bx:bx-search-alt" color="#02c39a" width="18px" />
                &nbsp;
                View {fetched[0].name} details
            </h1>


            <div className="acpt-card">
                <div className="acpt-card__inner">
                    <table className="acpt-table acpt-table-secondary mb-3">
                        <tr>
                            <th style={{ width: "180px" }}>
                                Name
                            </th>
                            <td>
                                {fetched[0].name}
                            </td>
                        </tr>
                        <tr>
                            <th style={{ width: "180px" }}>
                                Icon
                            </th>
                            <td>
                                <span className={`wcicon-${fetched[0].icon.icon}`} />
                            </td>
                        </tr>
                        <tr>
                            <th style={{ width: "180px" }}>
                                Visibility
                            </th>
                            <td>
                                <WooCommerceProductDataVisibility visibility={fetched[0].visibility} />
                            </td>
                        </tr>
                        <tr>
                            <th style={{ width: "180px" }}>
                                Show in UI
                            </th>
                            <td>
                                <Boolean status={fetched[0].showInUI}/>
                            </td>
                        </tr>
                    </table>
                    <Link
                        className="acpt-btn acpt-btn-primary mr-1"
                        to={`/product-data/product/edit/${id}`}>
                        <Icon icon="bx:bx-edit" width="18px" />
                        Edit
                    </Link>
                    <Link
                        className="acpt-btn acpt-btn-primary-o mr-1"
                        to={`/product-data/product/fields/${id}`}>
                        <Icon icon="bx:bxs-inbox" width="18px" />
                        Manage fields
                    </Link>
                    <Link
                        className="acpt-btn acpt-btn-primary-o"
                        to={`/product-data/product/content/${id}`}>
                        <Icon icon="bx:bx-message-square-detail" width="18px" />
                        Manage content
                    </Link>
                </div>
            </div>

            <Copyright/>
        </div>
    );
};

export default ViewWooCommerceProductData;