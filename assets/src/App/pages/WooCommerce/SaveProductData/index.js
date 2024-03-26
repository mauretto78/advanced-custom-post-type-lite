import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import Layout from "../../../layout/Layout";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {woocommerceIconsList} from "../../../constants/woocommerce_icons";
import useTranslation from "../../../hooks/useTranslation";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {metaTitle} from "../../../utils/misc";
import Card from "../../../components/Card";
import Input from "../../../components/Forms/Input";
import CardRow from "../../../components/Card/CardRow";
import Toggle from "../../../components/Forms/Toggle";
import Checkbox from "../../../components/Forms/Checkbox";
import SelectMulti from "../../../components/Forms/SelectMulti";
import InputHidden from "../../../components/Forms/InputHidden";
import {v4 as uuidv4} from "uuid";
import {toast} from "react-hot-toast";
import {saveWooCommerceProductData} from "../../../redux/reducers/saveWooCommerceProductDataSlice";
import {fetchWooCommerceProductData} from "../../../redux/reducers/fetchWooCommerceProductDataSlice";
import Loader from "../../../components/Loader";

const SaveProductData = ({}) => {

    // manage global state
    const dispatch = useDispatch();
    const {data} = useSelector(state => state.fetchWooCommerceProductData);

    // manage redirect
    const navigate = useNavigate();

    // manage local state
    const {id} = useParams();
    const title = (id) ? "Edit WooCommerce product data" : "Create new WooCommerce product data";
    const [isReady, setIsReady] = useState(false);

    // manage form state
    const { register, handleSubmit: submit, setValue, formState: {errors}, clearErrors } = useForm({
        mode: 'all'
    });

    /**
     *
     * @return {[*]|null|[*]}
     */
    const defaultIcon = () => {

        if(data){
            if(typeof data.icon === 'undefined'){
                return null;
            }

            if(typeof data.icon === 'object'){
                return [data.icon.icon];
            }

            return [data.icon];
        }

        return null;
    };

    useEffect(() => {
        metaTitle(useTranslation(title));

        if(id){
            dispatch(fetchWooCommerceProductData({ id: id }))
                .then(res => {
                    const record = res.payload;

                    setValue("product_data_name", record.name);
                    setValue("icon", record.icon);
                    setValue("show_ui", record.showInUI);
                    setIsReady(true);
                })
            ;
        } else {
            setIsReady(true);
        }
    }, []);

    const onSubmit = (data) => {
        dispatch(saveWooCommerceProductData(data))
            .then(res => {
                const payload = res.payload;

                if(payload.success){
                    navigate('/product-data/product');
                    toast.success(useTranslation("Product data successfully saved"));
                } else {
                    toast.error(payload.error);
                }
            })
            .catch(err => {
                toast.error(err);
            })
        ;
    };

    const actions = [
        <Button
            type="submit"
            style={styleVariants.PRIMARY}
        >
            {useTranslation("Save")}
        </Button>
    ];

    if(!isReady){
        return <Loader/>;
    }

    return (
        <form onSubmit={submit(onSubmit)}>
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
                        label: id ? useTranslation("Edit WooCommerce product data") : useTranslation("Create new WooCommerce product data")
                    }
                ]}
                title={title}
                actions={actions}
            >
                <Card style="with-shadow">
                    <InputHidden register={register} id="id" value={id ? id : uuidv4()} />
                    <CardRow
                        label={useTranslation("Product data name")}
                        value={
                            <Input
                                id="product_data_name"
                                placeholder={useTranslation("Product data name")}
                                description={useTranslation("The product data name.")}
                                register={register}
                                errors={errors}
                                isRequired={true}
                                validate={{
                                    maxLength: {
                                        value: 20,
                                        message: useTranslation("max length is 20")
                                    },
                                    required: useTranslation("This field is mandatory")
                                }}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Icon")}
                        value={
                            <SelectMulti
                                id="icon"
                                register={register}
                                setValue={setValue}
                                defaultValue={defaultIcon()}
                                values={woocommerceIconsList}
                                clearErrors={clearErrors}
                                errors={errors}
                                maxItems={1}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("visibility")}
                        value={
                            <Checkbox
                                register={register}
                                errors={errors}
                                id="visibility"
                                values={{
                                    "Show in simple products": {
                                        "value": "show_if_simple",
                                        "checked":  (data && data.visibility) ? data.visibility.includes("show_if_simple") : true,
                                    },
                                    "Show in variable products": {
                                        "value": "show_if_variable",
                                        "checked": (data && data.visibility) ? data.visibility.includes("show_if_variable") : true,
                                    },
                                    "Show in grouped products": {
                                        "value": "show_if_grouped",
                                        "checked": (data && data.visibility) ? data.visibility.includes("show_if_grouped") : true,
                                    },
                                    "Show in external products": {
                                        "value": "show_if_external",
                                        "checked": (data && data.visibility) ? data.visibility.includes("show_if_external") : true,
                                    },
                                    "Hide in virtual products": {
                                        "value": "hide_if_virtual",
                                        "checked": (data && data.visibility) ? data.visibility.includes("hide_if_virtual") : false,
                                    },
                                    "Hide in external products": {
                                        "value": "hide_if_external",
                                        "checked": (data && data.visibility) ? data.visibility.includes("hide_if_external") : false,
                                    },
                                }}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Show in UI")}
                        value={
                            <Toggle
                                register={register}
                                errors={errors}
                                id="show_ui"
                                description={useTranslation("Show the product data on the front store page.")}
                                defaultValue={ null }
                            />
                        }
                    />
                </Card>
            </Layout>
        </form>
    );
};

export default SaveProductData;