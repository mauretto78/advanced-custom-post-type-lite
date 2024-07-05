import React, {useState} from "react";
import PropTypes from 'prop-types';
import {isEmpty} from "../../../utils/objects";
import SwitchView from "../../../components/SwitchView";
import {useDispatch, useSelector} from "react-redux";
import {v4 as uuidv4} from "uuid";
import MetaGroupHeader from "../MetaGroupHeader";
import Alert from "../../../components/Alert";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import BoxSortableTab from "./BoxSortableTab";
import {arrayMove} from "@dnd-kit/sortable";
import {setBoxes} from "../../../redux/reducers/metaStateSlice";
import SortableList from "../../../components/SortableList";
import {useFieldArray, useFormContext} from "react-hook-form";
import MetaBox from "../MetaBox";
import MetaGroupSettings from "../MetaGroupSettings";
import {useParams} from "react-router-dom";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import BulkActions from "../BulkActions";

const TabularView = ({boxes, view, setView, activeBoxTab, setActiveBoxTab}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group} = useSelector(state => state.metaState);

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage local state
    const newGroupId = uuidv4();
    const {id} = useParams();
    const [settingsVisible, setSettingsVisible] = useState(typeof id !== 'string');

    const handleTabChange = (index) => {
        setActiveBoxTab(index);
    };

    // manage form state
    const { control } = useFormContext();
    const { move } = useFieldArray({
        control,
        name: "boxes",
    });

    const handleDragEnd = (event) => {
        const {active, over} = event;

        if(active.id === over.id){
            return;
        }

        const oldIndex = boxes.findIndex((box) => box.id === active.id);
        const newIndex = boxes.findIndex((box) => box.id === over.id);
        const sortedBoxes = arrayMove(boxes, oldIndex, newIndex);
        move(oldIndex, newIndex);
        setActiveBoxTab(newIndex);

        dispatch(setBoxes(sortedBoxes));
    };

    return (
        <React.Fragment>
            <div className="flex-between mb-24">
                <MetaGroupHeader
                    groupId={!isEmpty(group) ? group.id : newGroupId}
                    settingsVisible={settingsVisible}
                    setSettingsVisible={setSettingsVisible}
                />
                <SwitchView
                    localStorageKey={!isEmpty(group) ? group.id : newGroupId}
                    setView={setView}
                    view={view}
                    choices={['list', 'accordion', 'tabular']}
                />
            </div>
            <div className={!settingsVisible ? 'hidden' : ''}>
                <MetaGroupSettings
                    groupId={!isEmpty(group) ? group.id : newGroupId}
                    setSettingsVisible={setSettingsVisible}
                />
            </div>
            <div ref={parent}>
                <BulkActions
                    view="tab"
                    setBoxTab={setActiveBoxTab}
                />
                {boxes && boxes.length > 0 ? (
                    <div className="acpt-horizontal-tabs">
                        <div className="tablist">
                            <SortableList
                                onDragEnd={handleDragEnd}
                                items={boxes}
                            >
                                {boxes.map((box, index) => {
                                    return (
                                        <BoxSortableTab
                                            index={index}
                                            box={box}
                                            activeTab={activeBoxTab}
                                            onClick={handleTabChange}
                                        />
                                    )
                                })}
                            </SortableList>
                        </div>
                        {boxes.map((box, index) => (
                            <React.Fragment>
                                {index === activeBoxTab && (
                                    <div className="tab-panel">
                                        <MetaBox
                                            index={index}
                                            key={box.id}
                                            view="tabular"
                                            box={box}
                                            setActiveTab={setActiveBoxTab}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    <Alert style={styleVariants.WARNING}>
                        {useTranslation('No meta box already created. Create the first one now by clicking the button "Add meta box"!')}
                    </Alert>
                )}
            </div>
        </React.Fragment>
    );
};

TabularView.propTypes = {
    view: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired,
    boxes: PropTypes.array.isRequired,
    activeBoxTab: PropTypes.number.isRequired,
    setActiveBoxTab: PropTypes.func.isRequired
};

export default TabularView;