import React, {useState} from "react";
import PropTypes from 'prop-types';
import QuickNavigationField from "./QuickNavigationField";
import {Icon} from "@iconify/react";
import {useFieldArray, useFormContext, useWatch} from "react-hook-form";
import {scrollToId} from "../../../utils/scroll";
import {arrayMove, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import SortableList from "../../../components/SortableList";
import {setFields} from "../../../redux/reducers/metaStateSlice";
import {useDispatch} from "react-redux";

const QuickNavigationBox = ({index, box}) => {

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    // manage global state
    const dispatch = useDispatch();

    // manage local state
    const [isClosed, setIsClosed] = useState(false);

    // DND-kit
    const {attributes, listeners, setNodeRef, isDragging, transform} = useSortable({id: box.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    const { control } = useFormContext();
    const watchedBoxName = useWatch({
        control,
        name: `boxes.${index}.name`
    });

    const { move } = useFieldArray({
        control,
        name: `boxes.${index}.fields`,
    });

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const fields = box.fields;

        const oldIndex = fields.findIndex((field) => field.id === active.id);
        const newIndex = fields.findIndex((field) => field.id === over.id);
        const sortedFields = arrayMove(fields, oldIndex, newIndex);
        move(oldIndex, newIndex);

        dispatch(setFields({
            boxId: box.id,
            sortedFields: sortedFields,
            parentFieldId: null,
            parentBlockId: null
        }));
    };

    return (
        <div
            ref={setNodeRef}
            key={box.id}
            style={style}
            className="b-rounded with-shadow bg-white p-24"
        >
            <h3 className={`${(!isClosed && box.fields && box.fields.length > 0) ? 'mb-24' : ''} flex-between s-8`}>
                <div className="i-flex-center s-8">
                    <span className="cursor-move top-2 handle" {...attributes} {...listeners}>
                        <Icon icon="bx:dots-vertical-rounded" color="#777" width={18} />
                    </span>
                    <span
                        className="text-ellipsis cursor-pointer"
                        onClick={(e) => {
                            e.preventDefault();
                            scrollToId(box.id);
                        }}
                    >
                        {watchedBoxName ? watchedBoxName : box.name}
                    </span>
                </div>
                <span
                    className="cursor-pointer top-2"
                    style={{paddingRight: "6px"}}
                    onClick={() => setIsClosed(!isClosed)}
                >
                    <Icon width={18} icon={!isClosed ? 'bx:chevron-down' : 'bx:chevron-up'} color="#777" />
                </span>
            </h3>
            {!isClosed && box.fields && box.fields.length > 0 && (
                <div className={`tree ${globals.is_rtl === true ? `rtl` : ``}`}>
                    <SortableList
                        onDragEnd={handleDragEnd}
                        items={box.fields}
                    >
                        <React.Fragment>
                            {box.fields && box.fields.map((field) => (
                                <QuickNavigationField
                                    level={0}
                                    boxId={box.id}
                                    field={field}
                                />
                            ))}
                        </React.Fragment>
                    </SortableList>
                </div>
            )}
        </div>
    );
};

QuickNavigationBox.propTypes = {
    index: PropTypes.number.isRequired,
    box: PropTypes.object.isRequired,
};

export default QuickNavigationBox;