import React, {useEffect, useRef, useState} from 'react';
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import {useDispatch, useSelector} from "react-redux";
import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
import {arrayMove} from "react-sortable-hoc";
import {toast} from "react-toastify";
import Spinner from "../../reusable/Loader/Spinner";
import {Icon} from "@iconify/react";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";
import {fetchMeta} from "../../../redux/thunks/fetchMeta";
import {metaTypes} from "../../../constants/metaTypes";
import {metaSubmit} from "../../../redux/thunks/metaSubmit";
import {deleteAllMeta} from "../../../redux/thunks/deleteAllMeta";
import {createBox, setBoxes, setStatusSaved} from "../../../redux/actions/metaStateActions";
import Meta from "../../reusable/Meta";
import Modal from "../../reusable/Modal";

const UserMeta = () => {

    // manage global state
    const dispatch = useDispatch();
    const {boxes, fields, values, isSaved, isValid, loading: saveLoading, errors: saveErrors, success} = useSelector(state => state.metaStateReducer);
    const {loading, fetched} = useSelector(state => state.fetchMetaReducer);

    // manage local state
    const didMountRef = useRef(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const [modalVisible, setModalVisible] = useState(false);

    // set page meta title
    useEffect(() => {
        metaTitle(`ACPT - User meta${isSaved ? '' : '*'}`);
        changeCurrentAdminMenuLink('#/user-meta');
        if(!isSaved){ setDirty(); }
    }, [isSaved]);

    // fetching data and
    // populate the UI
    useEffect(() => {
        dispatch(fetchMeta(metaTypes.USER));
    }, [saveLoading]);

    // sortable
    const onSortEnd = ({oldIndex, newIndex}) => {
        dispatch(setBoxes(arrayMove(boxes, oldIndex, newIndex)));
    };

    // handle data submit
    const handleSubmit = () => {
        dispatch(metaSubmit(values));
        dispatch(setStatusSaved());
        setPristine();
    };

    const handleDeleteAll = () => {
        dispatch(deleteAllMeta(metaTypes.USER));
        dispatch(setUserMetaStatusSaved());
        setPristine();
    };

    // handle form submission outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!saveLoading){
                if(success){
                    setPristine();
                    toast.success("User meta successfully saved");
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

    if(loading){
        return <Spinner />;
    }

    const renderDeleteButton = (
        <React.Fragment>
            <Modal title={`Confirm deleting all`} visible={modalVisible}>
                <p>Are you sure?</p>
                <p>
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary"
                        onClick={(e) => {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                            handleDeleteAll();
                        }}
                    >
                        Yes
                    </a>
                    &nbsp;
                    <a
                        href="#"
                        className="acpt-btn acpt-btn-primary-o"
                        onClick={(e) => {
                            e.preventDefault();
                            setModalVisible(!modalVisible);
                        }}
                    >
                        No
                    </a>
                </p>
            </Modal>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setModalVisible(true);
                }}
                type="submit"
                className="acpt-btn acpt-btn-danger"
            >
                Delete all
            </button>
        </React.Fragment>
    );

    const buttons = (
        <React.Fragment>
            <button
                onClick={ (e) => {
                    e.preventDefault();
                    dispatch(createBox(metaTypes.USER));
                } }
                className="acpt-btn acpt-btn-primary-o"
            >
                Add meta box
            </button>
            {boxes.length > 0
                ?
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
                    {renderDeleteButton}
                </React.Fragment>
                :
                <React.Fragment>
                    {fetched.length > 0 && renderDeleteButton}
                </React.Fragment>
            }
        </React.Fragment>
    );

    return (
        <Layout>
            <ActionsBar
                title="User meta boxes"
                actions={buttons}
            />
            <main>
                <Breadcrumbs crumbs={[
                    {
                        label: "Registered Custom Post Types",
                        link: "/"
                    },
                    {
                        label: "Manage User Meta"
                    }
                ]} />
                {Prompt}
                <Meta
                    belongsTo={metaTypes.USER}
                    boxes={boxes}
                    fields={fields}
                    onSortEnd={onSortEnd}
                    values={values}
                />
            </main>
        </Layout>
    );
};

export default UserMeta;



// import React, {useEffect, useRef} from 'react';
// import Breadcrumbs from "../../reusable/Breadcrumbs";
// import {useHistory, useParams} from "react-router-dom";
// import {useDispatch, useSelector} from "react-redux";
// import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
// import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
// import {arrayMove} from "react-sortable-hoc";
// import {toast} from "react-toastify";
// import Spinner from "../../reusable/Loader/Spinner";
// import {fetchUserMeta} from "../../../redux/thunks/fetchUserMeta";
// import {createUserMetaBox, setUserMetaBoxes, setUserMetaStatusSaved} from "../../../redux/actions/userMetaStateActions";
// import {deleteAllUserMeta} from "../../../redux/thunks/deleteAllUserMeta";
// import {Icon} from "@iconify/react";
// import {SortableList} from "../../reusable/Sortable";
// import {userMetaSubmit} from "../../../redux/thunks/userMetaSubmit";
//
// const UserMeta = () => {
//
//     // manage global state
//     const { postType } = useParams();
//     const dispatch = useDispatch();
//     const {boxes, values, isSaved, isValid, loading: saveLoading, errors: saveErrors, success} = useSelector(state => state.userMetaStateReducer);
//     const {loading, fetched} = useSelector(state => state.fetchUserMetaReducer);
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
//         metaTitle(`ACPT - User meta${isSaved ? '' : '*'}`);
//         changeCurrentAdminMenuLink('#/user-meta');
//         if(!isSaved){ setDirty(); }
//     }, [isSaved]);
//
//     // fetching data and
//     // populate the UI
//     useEffect(() => {
//         dispatch(fetchUserMeta());
//     }, [saveLoading]);
//
//     // sortable
//     const onSortEnd = ({oldIndex, newIndex}) => {
//         dispatch(setUserMetaBoxes(arrayMove(boxes, oldIndex, newIndex)));
//     };
//
//     // handle data submit
//     const handleSubmit = () => {
//         dispatch(userMetaSubmit(values));
//         dispatch(setUserMetaStatusSaved());
//         setPristine();
//     };
//
//     const handleDeleteAll = () => {
//         dispatch(deleteAllUserMeta());
//         dispatch(setUserMetaStatusSaved());
//         setPristine();
//     };
//
//     // handle form submission outcome
//     useEffect(() => {
//         if (didMountRef.current){
//             if(!saveLoading){
//                 if(success){
//                     setPristine();
//                     toast.success("User meta successfully saved");
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
//     if(loading){
//         return <Spinner />;
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
//                     label: "Manage User Meta"
//                 }
//             ]} />
//             {Prompt}
//             <h1 className="acpt-title vertical-center">
//                 <Icon icon="bx:bx-user" color="#02c39a" width="18px"/>
//                 &nbsp;
//                 User meta boxes
//             </h1>
//             <div className="acpt-buttons">
//                 <a
//                     href="#"
//                     onClick={ (e) => {
//                         e.preventDefault();
//                         dispatch(createUserMetaBox());
//                     } }
//                     className="acpt-btn acpt-btn-primary-o"
//                 >
//                     <Icon icon="bx:bx-plus-circle" width="18px"/>
//                     &nbsp;
//                     Add meta box
//                 </a>
//             </div>
//             {boxes.length > 0
//                 ? (
//                     <React.Fragment>
//                         <SortableList
//                             items={boxes}
//                             onSortEnd={onSortEnd}
//                             useDragHandle
//                             lockAxis="y"
//                             helperClass="dragging-helper-class"
//                             disableAutoscroll={false}
//                             useWindowAsScrollContainer={true}
//                         />
//                         <div className="acpt-buttons">
//                             <a
//                                 href="#"
//                                 onClick={ (e) => {
//                                     e.preventDefault();
//                                     dispatch(createUserMetaBox());
//                                 } }
//                                 className="acpt-btn acpt-btn-primary-o"
//                             >
//                                 <Icon icon="bx:bx-plus-circle" width="18px"/>
//                                 &nbsp;
//                                 Add meta box
//                             </a>
//                         </div>
//                         <div className="acpt-card__footer">
//                             <div className="acpt-card__inner">
//                                 <button
//                                     disabled={!isValid}
//                                     onClick={(e) => {
//                                         e.preventDefault();
//                                         handleSubmit();
//                                     }}
//                                     type="submit"
//                                     className="acpt-btn acpt-btn-primary submit"
//                                 >
//                                     <Icon icon="bx:bx-save" width="18px"/>
//                                     &nbsp;
//                                     Save
//                                 </button>
//                                 &nbsp;
//                                 <button
//                                     onClick={(e) => {
//                                         e.preventDefault();
//                                         handleDeleteAll();
//                                     }}
//                                     type="submit"
//                                     className="acpt-btn acpt-btn-danger submit"
//                                 >
//                                     <Icon icon="bx:bx-trash" width="18px"/>
//                                     &nbsp;
//                                     Delete all
//                                 </button>
//                             </div>
//                         </div>
//                     </React.Fragment>
//                 )
//                 : (
//                     <React.Fragment>
//                         <div className="">
//                             No meta box already created. Create the first one now by clicking the button "Add meta box"!
//                         </div>
//                         {fetched.length > 0 && (
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
//                         )}
//                     </React.Fragment>
//                 )
//             }
//         </div>
//     );
// };
//
// export default UserMeta;