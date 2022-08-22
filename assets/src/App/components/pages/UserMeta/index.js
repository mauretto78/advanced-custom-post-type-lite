import React, {useEffect, useRef} from 'react';
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {useHistory, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
import {changeCurrentAdminMenuLink, metaTitle} from "../../../utils/misc";
import {arrayMove} from "react-sortable-hoc";
import {toast} from "react-toastify";
import Spinner from "../../reusable/Loader/Spinner";
import {fetchUserMeta} from "../../../redux/thunks/fetchUserMeta";
import {createUserMetaBox, setUserMetaBoxes, setUserMetaStatusSaved} from "../../../redux/actions/userMetaStateActions";
import {deleteAllUserMeta} from "../../../redux/thunks/deleteAllUserMeta";
import {Icon} from "@iconify/react";
import {SortableList} from "../../reusable/Sortable";
import {userMetaSubmit} from "../../../redux/thunks/userMetaSubmit";

const UserMeta = () => {

    // manage global state
    const { postType } = useParams();
    const dispatch = useDispatch();
    const {boxes, values, isSaved, isValid, loading: saveLoading, errors: saveErrors, success} = useSelector(state => state.userMetaStateReducer);
    const {loading, fetched} = useSelector(state => state.fetchUserMetaReducer);

    // manage local state
    const didMountRef = useRef(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    // manage redirect
    const history = useHistory();

    // set page meta title
    useEffect(() => {
        metaTitle(`ACPT - User meta${isSaved ? '' : '*'}`);
        changeCurrentAdminMenuLink('#/user-meta');
        if(!isSaved){ setDirty(); }
    }, [isSaved]);

    // fetching data and
    // populate the UI
    useEffect(() => {
        dispatch(fetchUserMeta());
    }, [saveLoading]);

    // sortable
    const onSortEnd = ({oldIndex, newIndex}) => {
        dispatch(setUserMetaBoxes(arrayMove(boxes, oldIndex, newIndex)));
    };

    // handle data submit
    const handleSubmit = () => {
        dispatch(userMetaSubmit(values));
        dispatch(setUserMetaStatusSaved());
        setPristine();
    };

    const handleDeleteAll = () => {
        dispatch(deleteAllUserMeta());
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

    return (
        <div>
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
            <h1 className="acpt-title vertical-center">
                <Icon icon="bx:bx-user" color="#02c39a" width="18px"/>
                &nbsp;
                User meta boxes
            </h1>
            <div className="acpt-buttons">
                <a
                    href="#"
                    onClick={ (e) => {
                        e.preventDefault();
                        dispatch(createUserMetaBox());
                    } }
                    className="acpt-btn acpt-btn-primary-o"
                >
                    <Icon icon="bx:bx-plus-circle" width="18px"/>
                    &nbsp;
                    Add meta box
                </a>
            </div>
            {boxes.length > 0
                ? (
                    <React.Fragment>
                        <SortableList
                            items={boxes}
                            onSortEnd={onSortEnd}
                            useDragHandle
                            lockAxis="y"
                            helperClass="dragging-helper-class"
                            disableAutoscroll={false}
                            useWindowAsScrollContainer={true}
                        />
                        <div className="acpt-buttons">
                            <a
                                href="#"
                                onClick={ (e) => {
                                    e.preventDefault();
                                    dispatch(createUserMetaBox());
                                } }
                                className="acpt-btn acpt-btn-primary-o"
                            >
                                <Icon icon="bx:bx-plus-circle" width="18px"/>
                                &nbsp;
                                Add meta box
                            </a>
                        </div>
                        <div className="acpt-card__footer">
                            <div className="acpt-card__inner">
                                <button
                                    disabled={!isValid}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSubmit();
                                    }}
                                    type="submit"
                                    className="acpt-btn acpt-btn-primary submit"
                                >
                                    <Icon icon="bx:bx-save" width="18px"/>
                                    &nbsp;
                                    Save
                                </button>
                                &nbsp;
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleDeleteAll();
                                    }}
                                    type="submit"
                                    className="acpt-btn acpt-btn-danger submit"
                                >
                                    <Icon icon="bx:bx-trash" width="18px"/>
                                    &nbsp;
                                    Delete all
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                )
                : (
                    <React.Fragment>
                        <div className="">
                            No meta box already created. Create the first one now by clicking the button "Add meta box"!
                        </div>
                        {fetched.length > 0 && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDeleteAll();
                                }}
                                type="submit"
                                className="acpt-btn acpt-btn-danger submit"
                            >
                                <Icon icon="bx:bx-trash" width="18px"/>
                                &nbsp;
                                Delete all
                            </button>
                        )}
                    </React.Fragment>
                )
            }
        </div>
    );
};

export default UserMeta;