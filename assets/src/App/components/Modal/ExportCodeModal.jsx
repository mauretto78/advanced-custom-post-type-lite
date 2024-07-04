import Modal from "./index";
import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import useTranslation from "../../hooks/useTranslation";
import Tabs from "../../components/Tabs";
import Tab from "../../components/Tabs/Tab";
import Code from "../../components/Code";
import {wpAjaxRequest} from "../../utils/ajax";

const ExportCodeModal = ({belongsTo, find}) => {

    // manage local state
    const [codeStrings, setCodeStrings] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    
    useEffect(()=>{
        if(modalOpen === true){
            wpAjaxRequest("exportCodeAction", {belongsTo :belongsTo, find:find})
                .then(res => {
                    setCodeStrings(res);
                })
                .catch(err => {
                    console.error(err.message);
                })
            ;
        }
    }, [modalOpen]);

    return (
        <React.Fragment>
            <Modal title={useTranslation("Export code")} visible={modalOpen} textAlign="left">
                <Tabs>
                    <Tab title="WORDPRESS">
                        <Code code={codeStrings.wordpress} editable={false} />
                    </Tab>
                    <Tab title="ACPT">
                        <Code code={codeStrings.acpt} editable={false} />
                    </Tab>
                </Tabs>
            </Modal>
            <a
                href="#"
                onClick={e => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Export code")}
            </a>
        </React.Fragment>
    );
};

ExportCodeModal.propTypes = {
    belongsTo: PropTypes.string.isRequired,
    find: PropTypes.string.isRequired,
};

export default ExportCodeModal;
