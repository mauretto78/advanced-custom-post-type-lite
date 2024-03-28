import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import Loader from "../../../components/Loader";
import {metaTitle} from "../../../utils/misc";
import useTranslation from "../../../hooks/useTranslation";
import {fetchWooCommerceProductData} from "../../../redux/reducers/fetchWooCommerceProductDataSlice";
import ButtonLink from "../../../components/ButtonLink";
import Layout from "../../../layout/Layout";
import CardRow from "../../../components/Card/CardRow";
import Card from "../../../components/Card";
import {styleVariants} from "../../../constants/styles";
import Boolean from "../../../components/Boolean";
import WooCommerceProductDataVisibility from "../../../components/WooCommerceProductDataVisibility";
import {woocommerceIconsMap} from "../../../constants/woocommerce_icons";

const ViewProductData = ({}) => {

    // manage global state
    const dispatch = useDispatch();
    const {data, loading} = useSelector(state => state.fetchWooCommerceProductData);

    // manage local state
    const {id} = useParams();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        metaTitle(useTranslation("View WooCommerce product data"));
        dispatch(fetchWooCommerceProductData({ id: id }))
            .then(res => setIsReady(true))
        ;
    }, [id]);

    if(loading){
        return <Loader/>;
    }

    if(!isReady){
        return <Loader/>;
    }

    const actions = [
        <ButtonLink
            style={styleVariants.SECONDARY}
            to={`/product-data/product/edit/${id}`}
        >
            {useTranslation("Edit")}
        </ButtonLink>,
        <ButtonLink
            style={styleVariants.PRIMARY}
            to={`/product-data/product/fields/${id}`}
        >
                {useTranslation("Manage fields")}
        </ButtonLink>
    ];

    return (
        <Layout
            crumbs={[
                {
                    label: useTranslation("Registered Custom Post Types"),
                    link: "/"
                },
                {
                    label: useTranslation("WooCommerce product data"),
                    link: "/product-data/product"
                },
                {
                    label: useTranslation("View WooCommerce product data")
                }
            ]}
            actions={actions}
            title={useTranslation("View WooCommerce product data")}
        >
            <Card style="with-shadow">
                <CardRow
                    label={useTranslation("Name")}
                    value={data.name}
                />
                <CardRow
                    label={useTranslation("Icon")}
                    value={
                        <span
                            className={`wcicon-${typeof data.icon === 'object' ? data.icon.icon : woocommerceIconsMap[data.icon]}`}
                            style={{
                                color: "#007cba",
                                fontSize: "18px"
                            }}
                        />
                    }
                />
                <CardRow
                    label={useTranslation("Show on UI")}
                    value={<Boolean status={data.showInUI}/>}
                />
                <CardRow
                    label={useTranslation("Visibility")}
                    value={<WooCommerceProductDataVisibility visibility={data.visibility} />}
                />
            </Card>
        </Layout>
    );
};

export default ViewProductData;