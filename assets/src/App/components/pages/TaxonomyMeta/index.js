import React, {useEffect, useRef, useState} from 'react';
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import useUnsavedChangesWarning from "../../../hooks/useUnsavedChangesWarning";
import {metaTitle} from "../../../utils/misc";
import {fetchMeta} from "../../../redux/thunks/fetchMeta";
import {metaTypes} from "../../../constants/metaTypes";
import {createBox, setBoxes, setStatusSaved} from "../../../redux/actions/metaStateActions";
import {arrayMove} from "react-sortable-hoc";
import {metaSubmit} from "../../../redux/thunks/metaSubmit";
import {deleteAllMeta} from "../../../redux/thunks/deleteAllMeta";
import {toast} from "react-toastify";
import Spinner from "../../reusable/Loader/Spinner";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../reusable/Layout/ActionsBar";
import Breadcrumbs from "../../reusable/Layout/Breadcrumbs";
import Meta from "../../reusable/Meta";
import Modal from "../../reusable/Modal";

const TaxonomyMeta = () => {

    // manage global state
    const { taxonomy } = useParams();
    const dispatch = useDispatch();
    const {boxes, fields, values, isSaved, isValid, loading: saveLoading, errors: saveErrors, success} = useSelector(state => state.metaStateReducer);
    const {loading, fetched} = useSelector(state => state.fetchMetaReducer);

    // manage local state
    const didMountRef = useRef(false);
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();
    const [modalVisible, setModalVisible] = useState(false);

    // set page meta title
    useEffect(() => {
        metaTitle(`ACPT - taxonomy meta${isSaved ? '' : '*'}`);
        if(!isSaved){ setDirty(); }
    }, [isSaved]);

    // fetching data and
    // populate the UI
    useEffect(() => {
        dispatch(fetchMeta(metaTypes.TAXONOMY, taxonomy));
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
        dispatch(deleteAllMeta(metaTypes.TAXONOMY, taxonomy));
        dispatch(setStatusSaved());
        setPristine();
    };

    // handle form submission outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!saveLoading){
                if(success){
                    setPristine();
                    toast.success("Taxonomy meta successfully saved");
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
                    setModalVisible(!modalVisible);
                }}
                type="submit"
                className="acpt-btn acpt-btn-danger"
            >
                Delete all
            </button>
        </React.Fragment>
    );

    const buttons =
        <React.Fragment>
            <a
                href="#"
                onClick={ (e) => {
                    e.preventDefault();
                    dispatch(createBox(metaTypes.TAXONOMY, taxonomy));
                } }
                className="acpt-btn acpt-btn-primary-o"
            >
                Add meta box
            </a>
            {boxes.length > 0
                ? (
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
                ) : (
                    <React.Fragment>
                        {fetched.length > 0 && renderDeleteButton}
                    </React.Fragment>
                )}
        </React.Fragment>
    ;

    return(
        <Layout>
            <ActionsBar
                title={`${taxonomy} meta boxes`}
                actions={buttons}
            />
            <main>
                <Breadcrumbs crumbs={[
                    {
                        label: "Registered Taxonomies",
                        link: "/taxonomies"
                    },
                    {
                        label: `${taxonomy} meta boxes`
                    }
                ]} />
                {Prompt}
                <Meta
                    belongsTo={metaTypes.TAXONOMY}
                    find={taxonomy}
                    boxes={boxes}
                    fields={fields}
                    onSortEnd={onSortEnd}
                    values={values}
                />
            </main>
        </Layout>
    )
};

export default TaxonomyMeta;