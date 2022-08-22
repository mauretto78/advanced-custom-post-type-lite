import React, {useEffect, useRef} from 'react';
import {Icon} from "@iconify/react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {useForm} from "react-hook-form";
import InputText from "../../reusable/Form/InputText";
import InputSwitch from "../../reusable/Form/InputSwitch";
import Checkboxes from "../../reusable/Form/Checkboxes";
import ReactSelect from "../../reusable/Form/ReactSelect";
import {woocommerceIconsList} from "../../../constants/woocommerce_icons";
import {toast} from "react-toastify";
import {saveWooCommerceProductData} from "../../../redux/thunks/saveWooCommerceProductData";
import {filterByValue} from "../../../utils/objects";

const SaveWooCommerceProductDataForm = ({id, setPristineHandler}) => {

    // manage global state
    const {errors: saveProductDataErrors, success, loading} = useSelector(state => state.saveWooCommerceProductDataReducer);
    const {fetched, loading: fetchingLoading } = useSelector(state => state.fetchWooCommerceProductDataReducer);
    const dispatch = useDispatch();

    // manage local state
    const didMountRef = useRef(false);

    // manage redirect
    const history = useHistory();

    // handle form
    const { control, register, handleSubmit, formState: {errors, isValid} } = useForm({
        mode: 'all',
        defaultValues: {
            product_data_name: fetched.length > 0 ? fetched[0].name : null,
            visibility: fetched.length > 0 ? fetched[0].visibility : null,
            show_ui: fetched.length > 0 ? fetched[0].showInUI : true,
            icon: fetched.length > 0 ? filterByValue(woocommerceIconsList, fetched[0].icon.value) : null,
        }
    });

    // handle form submission outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                if(success){
                    history.push('/product-data/product');
                    toast.success("Product data successfully saved");
                }

                if(saveProductDataErrors.length > 0){
                    saveProductDataErrors.map((error) => {
                        toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    const onSubmit = async (data) => {

        const icon = {
            icon: data.icon.label.props.icon,
            value: data.icon.value
        };

        let visibility = [];
        if(data.visibility_0){ visibility.push(data.visibility_0); }
        if(data.visibility_1){ visibility.push(data.visibility_1); }
        if(data.visibility_2){ visibility.push(data.visibility_2); }
        if(data.visibility_3){ visibility.push(data.visibility_3); }
        if(data.visibility_4){ visibility.push(data.visibility_4); }
        if(data.visibility_5){ visibility.push(data.visibility_5); }

        setPristineHandler();
        await dispatch(saveWooCommerceProductData({
            id: id ? id : null,
            product_data_name: data.product_data_name,
            icon: icon,
            visibility: visibility,
            show_ui: data.show_ui
        }));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="acpt-card__inner">
                <InputText
                    id="product_data_name"
                    label="Product data name"
                    placeholder="Product data name"
                    defaultValue={ null }
                    description="The product data name."
                    register={register}
                    errors={errors}
                    isRequired={true}
                    validate={{
                        maxLength: {
                            value: 20,
                            message: "max length is 20"
                        },
                        required: "This field is mandatory"
                    }}
                />
                <ReactSelect
                    id="icon"
                    label="Icon"
                    placeholder="Associated icon"
                    description="Displayed on the admin panel"
                    control={control}
                    defaultValue={ fetched.length > 0 ? filterByValue(woocommerceIconsList, fetched[0].icon.value) : null }
                    values={woocommerceIconsList}
                    isRequired={true}
                    validate={{
                        required: "This field is mandatory"
                    }}
                />
                <Checkboxes
                    id="visibility"
                    label="visibility"
                    wizard="Visibility of product data"
                    values={{
                        "Show in simple products": {
                            "value": "show_if_simple",
                            "checked": fetched.length > 0 ? fetched[0].visibility.includes("show_if_simple") : true,
                        },
                        "Show in variable products": {
                            "value": "show_if_variable",
                            "checked": fetched.length > 0 ? fetched[0].visibility.includes("show_if_variable") : true,
                        },
                        "Show in grouped products": {
                            "value": "show_if_grouped",
                            "checked": fetched.length > 0 ? fetched[0].visibility.includes("show_if_grouped") : true,
                        },
                        "Show in external products": {
                            "value": "show_if_external",
                            "checked": fetched.length > 0 ? fetched[0].visibility.includes("show_if_external") : true,
                        },
                        "Hide in virtual products": {
                            "value": "hide_if_virtual",
                            "checked": fetched.length > 0 ? fetched[0].visibility.includes("hide_if_virtual") : false,
                        },
                        "Hide in external products": {
                            "value": "hide_if_external",
                            "checked": fetched.length > 0 ? fetched[0].visibility.includes("hide_if_external") : false,
                        },
                    }}
                    register={register}
                    errors={errors}
                />
                <InputSwitch
                    id="show_ui"
                    label="Show in UI"
                    description="Show the product data on the front store page."
                    defaultValue={ null }
                    register={register}
                    errors={errors}
                />
            </div>
            <div className="acpt-step-buttons">
                <button
                    className="acpt-btn acpt-btn-primary submit"
                    disabled={(!isValid) ? 'disabled' : ''}
                >
                    Save
                    <Icon icon="bx:bx-save" width="18px" />
                </button>
            </div>
        </form>
    );
};

export default SaveWooCommerceProductDataForm;