import React from 'react';
import {SortableList} from "../../reusable/Sortable";
import MiniNavMap from "../../reusable/MiniNavMap";
import {useDispatch, useSelector} from "react-redux";

const Meta = ({boxes, onSortEnd, values}) => {

    // manage global state
    const dispatch = useDispatch();
    const {fetched: fetchedMeta} = useSelector(state => state.fetchMetaReducer);

    return (
        <React.Fragment>
            {boxes.length > 0
                ? (
                    <React.Fragment>
                        <div className="acpt-meta-wrapper">
                            <div className="acpt-meta-list-wrapper">
                                <SortableList
                                    items={boxes}
                                    onSortEnd={onSortEnd}
                                    useDragHandle
                                    lockAxis="y"
                                    helperClass="dragging-helper-class"
                                    disableAutoscroll={false}
                                    useWindowAsScrollContainer={true}
                                />
                            </div>
                            <MiniNavMap values={values} />
                        </div>
                    </React.Fragment>
                )
                : (
                    <React.Fragment>
                        <div className="acpt-alert acpt-alert-warning">
                            No meta box already created. Create the first one now by clicking the button "Add meta box"!
                        </div>
                    </React.Fragment>
                )
            }
        </React.Fragment>
    );
};

export default Meta;