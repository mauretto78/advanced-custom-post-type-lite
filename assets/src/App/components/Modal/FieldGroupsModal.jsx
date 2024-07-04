import Modal from "./index";
import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import Alert from "../Alert";
import {styleVariants} from "../../constants/styles";
import {fetchMeta} from "../../redux/reducers/fetchMetaSlice";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

const FieldGroupsModal = ({belongsTo, find}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage global state
    const dispatch = useDispatch();
    const {data, loading} = useSelector(state => state.fetchMeta);

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        // prevent pre-fetch
        if(modalOpen){
           dispatch(fetchMeta({
               belongsTo: belongsTo,
               find: find
           }));
       }
    }, [modalOpen, belongsTo, find]);

    return (
        <React.Fragment>
            <Modal title={useTranslation("Associated meta fields")} visible={modalOpen} textAlign="left">
                {loading ? (
                    <div>
                        {useTranslation("Loading...")}
                    </div>
                ) : (
                    <React.Fragment>
                        {data.records && data.records.length > 0 ? (
                            <div className="responsive">
                                <table className={`acpt-table with-border b-rounded ${globals.is_rtl ? 'rtl' : ''}`}>
                                    <thead>
                                    <tr>
                                        <th>
                                            {useTranslation("Group name")}
                                        </th>
                                        <th>
                                            {useTranslation("Fields count")}
                                        </th>
                                        <th>
                                            {useTranslation("Actions")}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {data.records.map((record) => (
                                        <tr>
                                            <td>
                                                {record.name}
                                            </td>
                                            <td>
                                                {record.fieldsCount}
                                            </td>
                                            <td>
                                                <div className="i-flex-center s-8">
                                                    <Link to={`/edit_meta/${record.id}`}>
                                                        {useTranslation("Edit")}
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <Alert style={styleVariants.SECONDARY}>
                                {useTranslation("No meta group found.")}
                            </Alert>
                        )}
                    </React.Fragment>
                )}
            </Modal>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Show")}
            </a>
        </React.Fragment>
    );
};

FieldGroupsModal.propTypes = {
    belongsTo: PropTypes.string.isRequired,
    find: PropTypes.string.isRequired,
};

export default FieldGroupsModal;