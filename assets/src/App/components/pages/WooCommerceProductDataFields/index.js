import React, {useEffect, useRef} from 'react';
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
import {metaTitle} from "../../../utils/misc";
import {fetchWooCommerceProductDataFields} from "../../../redux/thunks/fetchWooCommerceProductDataFields";
import Spinner from "../../reusable/Loader/Spinner";
import {toast} from "react-toastify";
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import {arrayMove} from "react-sortable-hoc";
import {
    createWooCommerceProductDataField,
    setWooCommerceProductDataFields,
    setWooCommerceProductDataStatusSaved
} from "../../../redux/actions/WooCommerceFieldsStateAction";
import {WooCommerceProductDataFieldsSubmit} from "../../../redux/thunks/WooCommerceProductDataFieldsSubmit";
import {deleteAllWooCommerceProductDataFields} from "../../../redux/thunks/deleteAllWooCommerceProductDataFields";
import {SortableList} from "../../reusable/Sortable";
import {fetchWooCommerceProductData} from "../../../redux/thunks/fetchWooCommerceProductData";
import NotFound404 from "../404";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";
import MiniNavMap from "../../reusable/MiniNavMap";

const WooCommerceProductDataFields = () => {

    // manage global state
    const { id } = useParams();
    const dispatch = useDispatch();
    const {fetched: productData, loading:productDataLoading} = useSelector(state => state.fetchWooCommerceProductDataReducer);
    const {fields, values, isSaved, isValid, loading: saveLoading, errors: saveErrors, success} = useSelector(state => state.WooCommerceFieldsStateReducer);
    const {loading, fetched} = useSelector(state => state.fetchWooCommerceProductDataFieldsReducer);

    // manage local state
    const didMountRef = useRef(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    // manage redirect
    const history = useHistory();

    // set page meta title
    useEffect(() => {
        metaTitle(`ACPT - WooCommerce product data${isSaved ? '' : '*'}`);
        if(!isSaved){ setDirty(); }
    }, [isSaved]);

    // fetching data and
    // populate the UI
    useEffect(() => {
        dispatch(fetchWooCommerceProductData({
            id:id
        }));
        dispatch(fetchWooCommerceProductDataFields(id));
    }, [saveLoading]);

    // sortable
    const onSortEnd = ({oldIndex, newIndex}) => {
        dispatch(setWooCommerceProductDataFields(arrayMove(fields, oldIndex, newIndex)));
    };

    // handle data submit
    const handleSubmit = () => {
        dispatch(WooCommerceProductDataFieldsSubmit(values));
        dispatch(setWooCommerceProductDataStatusSaved());
        setPristine();
    };

    const handleDeleteAll = () => {
        dispatch(deleteAllWooCommerceProductDataFields(id));
        dispatch(setWooCommerceProductDataStatusSaved());
        setPristine();
    };

    // handle form submission outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!saveLoading){
                if(success){
                    setPristine();
                    toast.success("WooCommerce product data fields successfully saved");
                }

                if(saveErrors.length > 0){
                    saveErrors.map((error) => {
                        toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [saveLoading]);

    if(loading || productDataLoading){
        return <Spinner />;
    }

    if(!productData[0]){
        return <NotFound404/>;
    }

    const actions = (
        <React.Fragment>
            <a
                href="#"
                onClick={ (e) => {
                    e.preventDefault();
                    dispatch(createWooCommerceProductDataField(id));
                } }
                className="acpt-btn acpt-btn-primary-o"
            >
                Add field box
            </a>
            {fields.length > 0 && (
                <React.Fragment>
                    <button
                        disabled={!isValid}
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                        type="submit"
                        className="acpt-btn acpt-btn-primary"
                    >
                        Save
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleDeleteAll();
                        }}
                        type="submit"
                        className="acpt-btn acpt-btn-danger"
                    >
                        Delete all
                    </button>
                </React.Fragment>
            )}
        </React.Fragment>
    );

    return (
        <Layout>
            {Prompt}
            <ActionsBar
                title={`${productData[0].name} product data fields`}
                actions={actions}
            />
            <main>
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
                        label: `${productData[0].name} product data fields`
                    }
                ]}
                />
                {fields.length > 0 ? (
                    <React.Fragment>
                        <div className="acpt-meta-wrapper">
                            <div className="acpt-meta-list-wrapper">
                                <div className="acpt-card">
                                    <div className="acpt-card__inner">
                                        <SortableList
                                            items={fields}
                                            onSortEnd={onSortEnd}
                                            useDragHandle
                                            lockAxis="y"
                                            helperClass="dragging-helper-class"
                                            disableAutoscroll={false}
                                            useWindowAsScrollContainer={true}
                                        />
                                    </div>
                                </div>
                            </div>
                            <MiniNavMap values={values} />
                        </div>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <div className="acpt-alert acpt-alert-warning">
                            No field box already created. Create the first one now by clicking the button "Add field box"!
                        </div>
                    </React.Fragment>
                )}
            </main>
        </Layout>
    );
};

export default WooCommerceProductDataFields;




// import React, {useEffect, useRef} from 'react';
// import {useHistory, useParams} from "react-router-dom";
// import {useDispatch, useSelector} from "react-redux";
// import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
// import {metaTitle} from "../../../utils/misc";
// import {fetchWooCommerceProductDataFields} from "../../../redux/thunks/fetchWooCommerceProductDataFields";
// import Spinner from "../../reusable/Loader/Spinner";
// import {toast} from "react-toastify";
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {Icon} from "@iconify/react";
// import {arrayMove} from "react-sortable-hoc";
// import {createWooCommerceProductDataField, setWooCommerceProductDataFields, setWooCommerceProductDataStatusSaved} from "../../../redux/actions/WooCommerceFieldsStateAction";
// import {WooCommerceProductDataFieldsSubmit} from "../../../redux/thunks/WooCommerceProductDataFieldsSubmit";
// import {deleteAllWooCommerceProductDataFields} from "../../../redux/thunks/deleteAllWooCommerceProductDataFields";
// import {SortableList} from "../../reusable/Sortable";
// import {fetchWooCommerceProductData} from "../../../redux/thunks/fetchWooCommerceProductData";
// import NotFound404 from "../404";
//
// const WooCommerceProductDataFields = () => {
//
//     // manage global state
//     const { id } = useParams();
//     const dispatch = useDispatch();
//     const {fetched: productData, loading:productDataLoading} = useSelector(state => state.fetchWooCommerceProductDataReducer);
//     const {fields, values, isSaved, isValid, loading: saveLoading, errors: saveErrors, success} = useSelector(state => state.WooCommerceFieldsStateReducer);
//     const {loading, fetched} = useSelector(state => state.fetchWooCommerceProductDataFieldsReducer);
//
//     // manage local state
//     const didMountRef = useRef(false);
//     const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
//
//     // manage redirect
//     const history = useHistory();
//
//     // set page meta title
//     useEffect(() => {
//         metaTitle(`ACPT - WooCommerce product data${isSaved ? '' : '*'}`);
//         if(!isSaved){ setDirty(); }
//     }, [isSaved]);
//
//     // fetching data and
//     // populate the UI
//     useEffect(() => {
//         dispatch(fetchWooCommerceProductData({
//             id:id
//         }));
//         dispatch(fetchWooCommerceProductDataFields(id));
//     }, [saveLoading]);
//
//     // sortable
//     const onSortEnd = ({oldIndex, newIndex}) => {
//         dispatch(setWooCommerceProductDataFields(arrayMove(fields, oldIndex, newIndex)));
//     };
//
//     // handle data submit
//     const handleSubmit = () => {
//         dispatch(WooCommerceProductDataFieldsSubmit(values));
//         dispatch(setWooCommerceProductDataStatusSaved());
//         setPristine();
//     };
//
//     const handleDeleteAll = () => {
//         dispatch(deleteAllWooCommerceProductDataFields(id));
//         dispatch(setWooCommerceProductDataStatusSaved());
//         setPristine();
//     };
//
//     // handle form submission outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!saveLoading){
//                 if(success){
//                     setPristine();
//                     toast.success("WooCommerce product data fields successfully saved");
//                 }
//
//                 if(saveErrors.length > 0){
//                     saveErrors.map((error) => {
//                         toast.error(error);
//                     });
//                 }
//             }
//         } else {
//             didMountRef.current = true;
//         }
//     }, [saveLoading]);
//
//     if(loading || productDataLoading){
//         return <Spinner />;
//     }
//
//     if(!productData[0]){
//         return <NotFound404/>;
//     }
//
//     return (
//         <div>
//             <Breadcrumbs crumbs={[
//                 {
//                     label: "Registered Custom Post Types",
//                     link: "/"
//                 },
//                 {
//                     label: "WooCommerce product data",
//                     link: "/product-data/product"
//                 },
//                 {
//                     label: `${productData[0].name} product data fields`
//                 }
//             ]} />
//             {Prompt}
//             <h1 className="acpt-title vertical-center">
//                 <Icon icon="bx:bx-inbox" color="#02c39a" width="18px"/>
//                 &nbsp;
//                 {productData[0].name} product data fields
//             </h1>
//             <div className="acpt-buttons">
//                 <a
//                     href="#"
//                     onClick={ (e) => {
//                         e.preventDefault();
//                         dispatch(createWooCommerceProductDataField(id));
//                     } }
//                     className="acpt-btn acpt-btn-primary-o"
//                 >
//                     <Icon icon="bx:bx-plus-circle" width="18px"/>
//                     &nbsp;
//                     Add field box
//                 </a>
//             </div>
//             {fields.length > 0 ? (
//                 <React.Fragment>
//                     <div className="acpt-box-card" style={{
//                         background: "#fff"
//                     }}>
//                         <SortableList
//                             items={fields}
//                             onSortEnd={onSortEnd}
//                             useDragHandle
//                             lockAxis="y"
//                             helperClass="dragging-helper-class"
//                             disableAutoscroll={false}
//                             useWindowAsScrollContainer={true}
//                         />
//                     </div>
//                     <div className="acpt-buttons">
//                         <a
//                             href="#"
//                             onClick={ (e) => {
//                                 e.preventDefault();
//                                 dispatch(createWooCommerceProductDataField(id));
//                             } }
//                             className="acpt-btn acpt-btn-primary-o"
//                         >
//                             <Icon icon="bx:bx-plus-circle" width="18px"/>
//                             &nbsp;
//                             Add field box
//                         </a>
//                     </div>
//                     <div className="acpt-card__footer">
//                         <div className="acpt-card__inner">
//                             <button
//                                 disabled={!isValid}
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     handleSubmit();
//                                 }}
//                                 type="submit"
//                                 className="acpt-btn acpt-btn-primary submit"
//                             >
//                                 <Icon icon="bx:bx-save" width="18px"/>
//                                 &nbsp;
//                                 Save
//                             </button>
//                             &nbsp;
//                             <button
//                                 onClick={(e) => {
//                                     e.preventDefault();
//                                     handleDeleteAll();
//                                 }}
//                                 type="submit"
//                                 className="acpt-btn acpt-btn-danger submit"
//                             >
//                                 <Icon icon="bx:bx-trash" width="18px"/>
//                                 &nbsp;
//                                 Delete all
//                             </button>
//                         </div>
//                     </div>
//                 </React.Fragment>
//             ) : (
//                 <React.Fragment>
//                     <div className="">
//                         No field box already created. Create the first one now by clicking the button "Add field box"!
//                     </div>
//                     {fields.length > 0 && (
//                         <button
//                             onClick={(e) => {
//                                 e.preventDefault();
//                                 handleDeleteAll();
//                             }}
//                             type="submit"
//                             className="acpt-btn acpt-btn-danger submit"
//                         >
//                             <Icon icon="bx:bx-trash" width="18px"/>
//                             &nbsp;
//                             Delete all
//                         </button>
//                     )}
//                 </React.Fragment>
//             )}
//         </div>
//     );
// };
//
// export default WooCommerceProductDataFields;