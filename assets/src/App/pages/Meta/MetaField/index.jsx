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
import {useDispatch, useSelector} from "react-redux";
import {Icon} from "@iconify/react";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import LazyElement from "../../../components/LazyElement";
import {setActiveElement} from "../../../redux/reducers/metaStateSlice";

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
    const dispatch = useDispatch();
    const {group, closedElements, activeElement} = useSelector(state => state.metaState);

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === field.id);

        if(typeof filter === 'undefined'){
            return false;
        }

        return filter.length > 0;
    };

    /**
     *
     * @return {boolean}
     */
    const isActiveElement = () => {

        if(!activeElement){
            return false;
        }

        return activeElement === field.id;
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

    /**
     * @return {string}
     */
    const fieldClassName = () => {
        let css = 'bg-white p-24';
        const isActiveEl = isActiveElement();

        if(view !== 'accordion'){
            css = css + ' b-rounded';
        }

        if(view === 'list'){
            css = css + ' with-shadow';
        }

        if(isActiveEl && view !== 'tabular'){
            css = css + ' bg-secondary with-primary-border';
        }

        if(view === 'accordion' && !isActiveEl){
            css = css + ' b-bottom-1';
        }

        return css;
    };

    return (
        <LazyElement
            id={field.id}
            size={{
                type: "field",
                children: field.children ? field.children.length : 0
            }}
            isClosed={isClosed()}
            element={
                <div
                    onMouseDownCapture={() => {
                        if(!isActiveElement()){
                            dispatch(setActiveElement({fieldId: field.id}));
                        }
                    }}
                >
                    <div
                        id={field.id}
                        className={fieldClassName()}
                        ref={(view === 'list' || view === 'accordion') ? setNodeRef : null}
                        style={(view === 'list' || view === 'accordion') ? style : null}
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
                        <div className={(view === 'tabular' || (!isClosed() && (view === 'list' || view === 'accordion'))) ? 'mb-24' : ''}>
                            <MetaFieldHeader
                                setActiveTab={setActiveTab}
                                boxIndex={boxIndex}
                                fieldIndex={fieldIndex}
                                parentFieldId={parentFieldId}
                                parentBlockId={parentBlockId}
                                formId={formId}
                                attributes={(view === 'list' || view === 'accordion') ? attributes : null}
                                listeners={(view === 'list' || view === 'accordion') ? listeners : null}
                                boxId={boxId}
                                field={field}
                                view={view}
                            />
                        </div>
                        <div ref={parent}>
                            <div className={`${(view === 'list' || view === 'accordion') && isClosed() ? 'hidden' : ''}`}>
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
        "accordion",
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