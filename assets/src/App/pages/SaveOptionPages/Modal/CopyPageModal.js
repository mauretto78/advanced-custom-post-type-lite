import React, {useState} from "react";
import useTranslation from "../../../hooks/useTranslation";
import Modal from "../../../components/Modal";
import Button from "../../../components/Button";
import PropTypes from "prop-types";
import {Icon} from "@iconify/react";
import {useFormContext, useWatch} from "react-hook-form";
import {styleVariants} from "../../../constants/styles";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../../utils/misc";

const CopyPageModal = ({page, index, parentPageIndex, parentSetActiveTab, parentId}) => {

    // manage local state
    const [modalOpen, setModalOpen] = useState(false);
    const [targetPage, setTargetPage] = useState(null);
    const [deletePage, setDeletePage] = useState(null);

    const { control } = useFormContext();
    const watchedPages = useWatch({
        control,
        name: "pages"
    });

    const handlePageChange = (page) => {
        setTargetPage(page);
    };

    const handleSubmit = () => {
        wpAjaxRequest('copyOptionPageAction',  {
            targetPageId: targetPage,
            pageId: page.id,
            deletePage: deletePage
        })
            .then(res => {
                if(res.success){
                    toast.success(`${useTranslation("Page was successfully copied")}.${useTranslation("The browser will refresh after 5 seconds.")}`);
                    setModalOpen(!modalOpen);
                    refreshPage(5000);
                } else {
                    toast.error(res.error);
                }
            })
            .catch(err => console.err(err))
        ;
    };

    return (
        <React.Fragment>
            <Modal
                title={useTranslation('Copy this meta option page')}
                visible={modalOpen}
                buttons={[]}
            >
                <div className="flex-column s-24">
                    <div>
                        <label
                            className="form-label i-flex-center s-4"
                            htmlFor="page"
                        >
                            {useTranslation("Option page")}
                        </label>
                        <div className="acpt-select">
                            <select
                                id="page"
                                className="form-control"
                                onChange={e => handlePageChange(e.target.value)}
                            >
                                <option value={null}>{useTranslation("Select")}</option>
                                {watchedPages.map((page) => (
                                    <option value={page.id}>
                                        {page.pageTitle}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {targetPage && (
                        <div>
                            <div className="w-100 i-flex-center s-4 mb-8">
                                <input type="checkbox" defaultValue={deletePage} onClick={() => setDeletePage(!deletePage)} id="deletePage" />
                                <label htmlFor="deletePage">
                                    {useTranslation("Delete the meta option page after copying")}
                                </label>
                            </div>
                            <Button
                                onClick={() => handleSubmit() }
                                style={styleVariants.PRIMARY}
                            >
                                {useTranslation("Copy")}
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
            <a
                href="#"
                onClick={(e) => {
                    e.preventDefault();
                    setModalOpen(!modalOpen);
                }}
            >
                <Icon icon="bx:copy" width={18} />
            </a>
        </React.Fragment>
    );

};

CopyPageModal.propTypes = {
    parentId: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    parentPageIndex: PropTypes.number,
    page: PropTypes.object.isRequired,
    parentSetActiveTab: PropTypes.func,
};

export default CopyPageModal;