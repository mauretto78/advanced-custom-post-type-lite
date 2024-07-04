import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from "react-hook-form";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import Layout from "../../../layout/Layout";
import {useDispatch, useSelector} from "react-redux";
import {savedView} from "../../../utils/localStorage";
import DeleteAllFieldsModal from "./Modal/DeleteAllFieldsModal";
import {isEmpty} from "../../../utils/objects";
import ListView from "./ListView";
import TabularView from "./TabularView";
import Loader from "../../../components/Loader";
import PageNotFound from "../../404";
import {v4 as uuidv4} from "uuid";
import {changeCurrentAdminMenuLink, delay, metaTitle} from "../../../utils/misc";
import {scrollToId} from "../../../utils/scroll";
import {TEXT} from "../../../constants/woocommerce_fields";
import {toast} from "react-hot-toast";
import {useNavigate, useParams} from "react-router-dom";
import {saveWooCommerceProductDataFields} from "../../../redux/reducers/saveWooCommerceProductDataFieldsSlice";
import InputHidden from "../../../components/Forms/InputHidden";
import {addField, hydrateState} from "../../../redux/reducers/productDataFieldsStateSlice";
import {fetchProductDataFields} from "../../../redux/reducers/fetchProductDataFieldsSlice";

const ProductDataFields = ({}) => {

    // manage global state
    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.fetchProductDataFields);
    const {fields} = useSelector(state => state.productDataFieldsState);

    // manage local state
    const {id} = useParams();
    const [fetchError, setFetchError] = useState(false);
    const [view, setView] = useState(savedView("wc_fields_manage_view"));
    const [activeTab, setActiveTab] = useState(0);

    // manage redirect
    const navigate = useNavigate();

    // form init
    const methods = useForm({
        mode: 'all'
    });

    useEffect(() => {
        metaTitle(useTranslation("Manage product data fields"));
        changeCurrentAdminMenuLink('#/');
        dispatch(fetchProductDataFields(id))
            .then(res => {
                dispatch(hydrateState(res.payload));

                // Set initial values
                res.payload && res.payload.map((field, index) => {
                    methods.setValue(`fields.${index}`, field);
                });
            })
            .catch(err => {
                console.error(err);
                setFetchError(true);
            })
        ;
    }, []);

    const handleAddField = () => {

        const newFieldId = uuidv4();
        const newField = {
            id: newFieldId,
            name: 'field',
            type: TEXT,
            isRequired: false,
            description: null,
            defaultValue: null,
            options: [],
        };

        dispatch(addField({field: newField}));
        setActiveTab(fields.length);

        delay(1).then(()=>{
            scrollToId(newFieldId);
        });
    };

    /**
     *
     * @return {boolean}
     */
    const isFormValid = () => {
        if(methods.formState.errors && methods.formState.errors.pages){
            return false;
        }

        return true;
    };

    const onSubmit = (data) => {
        dispatch(saveWooCommerceProductDataFields(data))
            .then(res => {
                const payload = res.payload;

                if(payload.success){
                    navigate(`/product-data/product/fields/${id}`);
                    toast.success(useTranslation("WooCommerce product data fields successfully saved"));
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
            style={styleVariants.SECONDARY}
            onClick={(e) => {
                e.preventDefault();
                handleAddField();
            }}
        >
            {useTranslation("Add field")}
        </Button>,
        <Button
            disabled={!isFormValid()}
            style={styleVariants.PRIMARY}
        >
            {useTranslation("Save")}
        </Button>,
        <DeleteAllFieldsModal />,
    ];

    if(loading){
        return (
            <Loader/>
        );
    }

    if(fetchError){
        return <PageNotFound />;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Layout
                    title={useTranslation("Manage option pages")}
                    actions={actions}
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
                            label: useTranslation("product data fields")
                        }
                    ]}
                >
                    <InputHidden
                        register={methods.register}
                        id="productDataId"
                        value={id}
                    />
                    {view === 'list' ? (
                        <ListView
                            setActiveTab={setActiveTab}
                            view={view}
                            setView={setView}
                            fields={!isEmpty(fields) ? fields : []}
                        />
                    ) : (
                        <TabularView
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            view={view}
                            setView={setView}
                            fields={!isEmpty(fields) ? fields : []}
                        />
                    )}
                </Layout>
            </form>
        </FormProvider>
    );
};

export default ProductDataFields;