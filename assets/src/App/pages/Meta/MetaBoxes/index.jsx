import React, {useEffect, useState} from "react";
import PropTypes from 'prop-types';
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import MetaBox from "../MetaBox";
import {addBox, hideAll, setBoxes, showAll} from "../../../redux/reducers/metaStateSlice";
import {arrayMove} from "@dnd-kit/sortable";
import {useDispatch, useSelector} from "react-redux";
import SortableList from "../../../components/SortableList";
import {useFieldArray, useFormContext} from "react-hook-form";
import {isEmpty} from "../../../utils/objects";
import {v4 as uuidv4} from "uuid";
import MetaGroupSettings from "../MetaGroup/MetaGroupSettings";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import BulkActions from "../BulkActions";
import Button from "../../../components/Button";
import {delay} from "../../../utils/misc";
import {scrollToId} from "../../../utils/scroll";
import {Icon} from "@iconify/react";
import {isNavigationEnabled, saveCloseAll, saveShowAll, toggleNavigation} from "../../../utils/localStorage";
import {getElementIds} from "../../../utils/fields";
import QuickNavigation from "../QuickNavigation";

const MetaBoxes = ({boxes}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group, closedElements} = useSelector(state => state.metaState);

    // manage local state
    const newGroupId = uuidv4();

    // auto-animate
    const [parent, container] = useAutoAnimate();

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: "boxes",
    });

    const [isNavigationVisible, setIsNavigationVisible] = useState(isNavigationEnabled(group.id));

    useEffect(()=>{
        if(typeof group.id !== "undefined"){
            setIsNavigationVisible(isNavigationEnabled(group.id));
        }
    }, [group]);

    /**
     * Add box
     */
    const handleAddBox = () => {

        const newBoxId = uuidv4();
        const newBox = {
            id: newBoxId,
            name: "meta_box_title",
            UIName: "meta box title",
            label: "meta box title",
            fields: [],
            isSaved: false,
            sort: group.boxes ? group.boxes.length : 1
        };

        dispatch(addBox(newBox));

        delay(1).then(()=>{
            scrollToId(`${newBoxId}`);
        });
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = boxes.findIndex((box) => box.id === active.id);
        const newIndex = boxes.findIndex((box) => box.id === over.id);
        const sortedBoxes = arrayMove(boxes, oldIndex, newIndex);
        move(oldIndex, newIndex);

        dispatch(setBoxes(sortedBoxes));
    };

    /**
     * Show/hide all fields
     */
    const handleToggleSelectAll = () => {
        const ids = getElementIds(group.boxes);

        if(closedElements.length > 0){
            dispatch(showAll());
            saveShowAll(ids);
        } else {
            dispatch(hideAll());
            saveCloseAll(ids);
        }
    };

    const handleToggleNavigation = (checked) => {
        toggleNavigation(group.id, checked);
        setIsNavigationVisible(!isNavigationVisible);
    };

    return (
        <React.Fragment>
            <MetaGroupSettings
                groupId={!isEmpty(group) ? group.id : newGroupId}
            />
            <div
                className="flex-column s-24"
                ref={parent}
            >
                <div className="flex-between s-8">
                    <div className="i-flex-center s-8">
                        <Icon icon="bx:box" width={24} color="#007CBA" />
                        <h3>
                            {useTranslation("Meta boxes")}
                        </h3>
                        <span className="px-8 py-4 font-sm bg-light-gray text-normal b-rounded">
                            {boxes && boxes.length > 0 ? boxes.length : 0}
                        </span>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggleSelectAll();
                            }}
                        >
                            {useTranslation(closedElements.length > 0 ? "Show elements" : "Hide elements")}
                        </a>
                    </div>
                    {boxes && boxes.length > 0 && (
                        <div className="i-flex-center s-8">
                            <div className="toggle-group">
                                <label
                                    htmlFor="toggle_navigation"
                                    className="toggle"
                                >
                                    <input
                                        id="toggle_navigation"
                                        type="checkbox"
                                        checked={isNavigationVisible}
                                        onChangeCapture={(e)=>{
                                            handleToggleNavigation(e.target.checked);
                                        }}
                                    />
                                    <span className="slider round"/>
                                </label>
                            </div>
                            <label
                                className="cursor-pointer"
                                htmlFor="toggle_navigation"
                            >
                                {useTranslation(isNavigationVisible ? "Hide navigation" : "Show navigation")}
                            </label>
                        </div>
                    )}
                </div>
                <BulkActions />
                {boxes && boxes.length > 0 ? (
                    <div
                        ref={container}
                        className="container"
                    >
                        {isNavigationVisible && (
                            <div className="col-3 flex-column s-24 hidden-xs sticky" style={{
                                top: "130px"
                            }}>
                                <QuickNavigation boxes={boxes}/>
                            </div>
                        )}
                        <div className={`flex-column s-24 ${isNavigationVisible ? "col-9" : "col-12"}`}>
                            <SortableList
                                onDragEnd={handleDragEnd}
                                items={boxes}
                            >
                                <React.Fragment>
                                    {boxes && boxes.map((box, index)=> (
                                        <MetaBox
                                            index={index}
                                            key={box.id}
                                            box={box}
                                        />
                                    ))}
                                </React.Fragment>
                            </SortableList>
                            <div>
                                <Button
                                    type="button"
                                    style={styleVariants.WHITE}
                                    onClick={() => {
                                        handleAddBox();
                                    }}
                                >
                                    {useTranslation("Add meta box")}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-24 p-24 bg-white with-shadow">
                        <div className="b-maxi b-rounded p-24 flex-column s-12 text-center">
                            <span>
                                {useTranslation('No meta box already created. Create the first one now by clicking the button "Add meta box"!')}
                            </span>
                            <div>
                                <Button
                                    type="button"
                                    style={styleVariants.SECONDARY}
                                    onClick={() => {
                                        handleAddBox();
                                    }}
                                >
                                    {useTranslation("Add meta box")}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
};

MetaBoxes.propTypes = {
    boxes: PropTypes.array.isRequired
};

export default MetaBoxes;