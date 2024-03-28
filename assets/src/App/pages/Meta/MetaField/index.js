import React from "react";
import PropTypes from 'prop-types';
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import InputHidden from "../../../components/Forms/InputHidden";
import MetaFieldHeader from "./MetaFieldHeader";
import Tabs from "../../../components/Tabs";
import useTranslation from "../../../hooks/useTranslation";
import Tab from "../../../components/Tabs/Tab";
import BasicTab from "./Tabs/BasicTab";
import {useFormContext, useWatch} from "react-hook-form";
import {getFormId} from "../../../utils/fields";
import {useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import LazyElement from "../../../components/LazyElement";

const MetaField = ({boxIndex, fieldIndex, view, boxId, field, parentFieldIndex, parentFieldId, parentBlockId, setActiveTab}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: field.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage form state
    const { register, control } = useFormContext();

    // manage global state
    const {group, closedElements} = useSelector(state => state.metaState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === field.id);

        return filter.length === 1;
    };

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value) => {
        return `${getFormId(group.boxes, boxId, field.id)}.${value}`;
    };

    const watchedFieldType = useWatch({
        control,
        name: formId("type")
    });

    return (
        <LazyElement
            id={field.id}
            element={
                <div
                    id={field.id}
                    className={`bg-white b-rounded p-24 ${view === 'list' ? 'with-shadow' : ''}`}
                    ref={view === 'list' ? setNodeRef : null}
                    style={view === 'list' ? style : null}
                >
                    <InputHidden
                        id={formId("id")}
                        value={field.id}
                        register={register}
                    />
                    <InputHidden
                        id={formId("parentId")}
                        value={parentFieldId ? parentFieldId : ''}
                        register={register}
                    />
                    <InputHidden
                        id={formId("blockId")}
                        value={parentBlockId ? parentBlockId : ''}
                        register={register}
                    />
                    <div className={(view === 'tabular' || (!isClosed() && view === 'list')) ? 'mb-24' : ''}>
                        <MetaFieldHeader
                            setActiveTab={setActiveTab}
                            boxIndex={boxIndex}
                            fieldIndex={fieldIndex}
                            parentFieldId={parentFieldId}
                            parentBlockId={parentBlockId}
                            formId={formId}
                            attributes={view === 'list' ? attributes : null}
                            listeners={view === 'list' ? listeners : null}
                            boxId={boxId}
                            field={field}
                            view={view}
                        />
                    </div>
                    <div ref={parent}>
                        <div className={`${view === 'list' && isClosed() ? 'hidden' : ''}`}>
                            <BasicTab
                                view={view}
                                boxIndex={boxIndex}
                                fieldIndex={fieldIndex}
                                formId={formId}
                                boxId={boxId}
                                field={field}
                            />
                        </div>
                    </div>
                </div>
            }
        />
    );
};

MetaField.propTypes = {
    boxIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
    boxId: PropTypes.string.isRequired,
    field: PropTypes.object.isRequired,
    parentFieldIndex: PropTypes.string,
    parentFieldId: PropTypes.string,
    parentBlockId: PropTypes.string,
    setActiveTab: PropTypes.func
};

export default MetaField;