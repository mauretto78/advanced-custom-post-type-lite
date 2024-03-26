import React, {useState} from "react";
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import {Icon} from "@iconify/react";

const AdminMenuPositionsModal = () => {

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);

    const positions = [
        { position: 2, label: "Dashboard" },
        { position: 4, label: "Separator" },
        { position: 5, label: "Posts" },
        { position: 10, label: "Media" },
        { position: 15, label: "Links" },
        { position: 20, label: "Pages" },
        { position: 25, label: "Comments" },
        { position: 59, label: "Separator" },
        { position: 60, label: "Appearance" },
        { position: 65, label: "Plugins" },
        { position: 70, label: "Users" },
        { position: 75, label: "Tools" },
        { position: 80, label: "Settings" },
        { position: 99, label: "Separator" }
    ];

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Default positions for Core Menu Items')}
                visible={modalOpen}
                buttons={[]}
            >
                <div className="flex-column s-12">
                    <div>
                        {useTranslation('The position in the menu order this page should appear. The higher the number, the lower its position in the menu.')}
                    </div>
                    <div>
                        {useTranslation('Default positions for Core Menu Items')}:
                    </div>
                    <table>
                        {positions.map((p, index) => (
                            <tr key={index}>
                                <td width={60}>
                                    {p.position}
                                </td>
                                <td>
                                    {p.label}
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>
            </Modal>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                {useTranslation('Default positions')}
            </a>
        </React.Fragment>
    );
};

export default AdminMenuPositionsModal;


