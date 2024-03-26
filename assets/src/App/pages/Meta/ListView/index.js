import React, {useState} from "react";
import PropTypes from 'prop-types';
import QuickNavigation from "./QuickNavigation";
import {styleVariants} from "../../../constants/styles";
import useTranslation from "../../../hooks/useTranslation";
import Alert from "../../../components/Alert";
import MetaBox from "../MetaBox";
import {hideAll, setBoxes, showAll} from "../../../redux/reducers/metaStateSlice";
import {arrayMove} from "@dnd-kit/sortable";
import {useDispatch, useSelector} from "react-redux";
import SortableList from "../../../components/SortableList";
import {useFieldArray, useFormContext} from "react-hook-form";
import MetaGroupHeader from "../MetaGroupHeader";
import {isEmpty} from "../../../utils/objects";
import {v4 as uuidv4} from "uuid";
import SwitchView from "../../../components/SwitchView";
import {getElementIds} from "../../../utils/fields";
import {saveCloseAll, saveShowAll} from "../../../utils/localStorage";
import Button from "../../../components/Button";
import {Icon} from "@iconify/react";
import Tooltip from "../../../components/Tooltip";
import MetaGroupSettings from "../MetaGroupSettings";
import {useParams} from "react-router-dom";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import BulkActions from "../BulkActions";

const ListView = ({boxes, view, setView}) => {

    // manage global state
    const dispatch = useDispatch();
    const {group, closedElements} = useSelector(state => state.metaState);

    // manage local state
    const newGroupId = uuidv4();
    const {id} = useParams();
    const [settingsVisible, setSettingsVisible] = useState(typeof id !== 'string');

    // auto-animate
    const [parent] = useAutoAnimate();

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

        dispatch(setBoxes(sortedBoxes));
    };

    // show hide all fields handlers
    const showHideAllFields = () => {
        const ids = getElementIds(group.boxes);
        const isClosed = closedElements.length > 0;

        if(isClosed){
            saveShowAll(ids);
            dispatch(showAll());
        } else {
            saveCloseAll(ids);
            dispatch(hideAll());
        }
    };

    return (
        <React.Fragment>
            <div className="flex-between mb-24 s-8 for-xs">
                <MetaGroupHeader
                    groupId={!isEmpty(group) ? group.id : newGroupId}
                    settingsVisible={settingsVisible}
                    setSettingsVisible={setSettingsVisible}
                />
                <div className="i-flex-center s-8">
                    <Tooltip
                        label={
                            <Button
                                css={{
                                    height: "40px"
                                }}
                                style={styleVariants.WHITE}
                                size="xs"
                                onClick={(e)=>{
                                    e.preventDefault();
                                    showHideAllFields();
                                }}
                            >
                                <Icon icon={closedElements.length > 0 ? 'ant-design:eye-outlined' : 'ant-design:eye-invisible-outlined'} width={18} />
                            </Button>
                        }
                        tip={useTranslation("Show/hide all fields")}
                        icon={false}
                    />
                    <SwitchView
                        localStorageKey={!isEmpty(group) ? group.id : newGroupId}
                        setView={setView}
                        view={view}
                    />
                </div>
            </div>
            <div className={!settingsVisible ? 'hidden' : ''}>
                <MetaGroupSettings groupId={!isEmpty(group) ? group.id : newGroupId} />
            </div>
            <div className="container">
                <div className="col-3 flex-column s-24 hidden-xs sticky" style={{
                    top: "200px"
                }}>
                    <QuickNavigation boxes={boxes} />
                </div>
                <div className="col-9">
                    <div
                        className="flex-column s-24"
                        ref={parent}
                    >
                        <BulkActions
                            view="list"
                        />
                        {boxes && boxes.length > 0 ? (
                            <SortableList
                                onDragEnd={handleDragEnd}
                                items={boxes}
                            >
                                <React.Fragment>
                                    {boxes.map((box, index)=> (
                                        <MetaBox
                                            index={index}
                                            key={box.id}
                                            view="list"
                                            box={box}
                                        />
                                    ))}
                                </React.Fragment>
                            </SortableList>
                        ) : (
                            <Alert style={styleVariants.WARNING}>
                                {useTranslation('No meta box already created. Create the first one now by clicking the button "Add meta box"!')}
                            </Alert>
                        )}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

ListView.propTypes = {
    view: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired,
    boxes: PropTypes.array.isRequired,
};

export default ListView;