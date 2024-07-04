import React, {useState} from "react";
import useTranslation from "../../hooks/useTranslation";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import {styleVariants} from "../../constants/styles";
import Alert from "../../components/Alert";

const BugFixModal = () => {

    // mange local state
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Submit a bug')}
                visible={modalOpen}
                buttons={[
                    <Button style={styleVariants.DANGER} onClick={(e) => {
                        e.preventDefault();
                        setModalOpen(!modalOpen);
                    }}>
                        {useTranslation("Close")}
                    </Button>,
                ]}
            >
                <div className="flex-column s-12">
                    <Alert style={styleVariants.WARNING}>
                            First of all, be sure the bug you found is <u>reproducible</u>.
                    </Alert>
                    <span>If you are not sure about it, you can consider discussing it with other users on <a style={{display: "inline"}} href="https://www.facebook.com/groups/880817719861018" target="_blank">Facebook's official group</a>.</span>
                    <span>
                        Once you are sure about the bug, please <a style={{display: "inline"}} href="https://tree.taiga.io/project/mauretto78-acpt-bugs-dashboard/kanban" target="_blank">go to the official ACPT bug report dashboard</a>.
                    </span>
                    <span>
                        <u>Please note that you will be required to register to <a href="https://taiga.io" target="_blank">Taiga.io</a> if you have not yet an account.</u>
                    </span>
                    <h3>
                        If the bug is not present
                    </h3>
                    <ul className="disc m-0">
                        <li>Open a card in the BUGS column</li>
                        <li>Please describe the bug in a simple, plain English, specifying HOW to reproduce the issue</li>
                        <li>Attach one of more screenshots if needed</li>
                        <li>Remember to specify the ACPT version</li>
                    </ul>
                    <h3>
                        If the bug is already present
                    </h3>
                    <ul className="disc m-0">
                        <li>Open the card</li>
                        <li>Read the content</li>
                        <li>If you think that you can add something useful, please add your comment. Feel free to attach one of more screenshots if needed</li>
                    </ul>
                    <Alert style={styleVariants.INFO}>
                        Every bug will be analyzed, labeled, and prioritized. The bug will be moved to the WORKING section, and then to DEPLOYED when a new version is released.
                    </Alert>
                    <span>
                        If the bug fix is confirmed, the card will be archived. If not, it will be returned in the loop.
                    </span>
                </div>
            </Modal>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation("Submit a bug")}
            </a>
        </React.Fragment>
    );
};

export default BugFixModal;