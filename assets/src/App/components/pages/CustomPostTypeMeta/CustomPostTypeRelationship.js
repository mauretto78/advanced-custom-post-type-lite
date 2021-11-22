import React, {useEffect, useRef, useState} from 'react';
import {reactSelectStyles} from "../../../constants/styles";
import Select from "react-select";
import {relationshipList} from "../../../constants/relationships";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../../reusable/Loader/Spinner";
import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
import {filterById, filterByLabel, filterByValue, isEmpty, isset} from "../../../utils/objects";
import {updateRelationInversedField, updateRelationPost, updateRelationType} from "../../../redux/actions/metaStateActions";
import {isBidirectional, opposite} from "../../../utils/relations";
import {fetchInversedMeta} from "../../../redux/thunks/fetchInversedMeta";
import {useParams} from "react-router";

const CustomPostTypeMetaRelationship  = ({id, boxId, fieldId}) => {

    // manage global state
    const dispatch = useDispatch();
    const {fetched, loading: {fetchingPostsTypeLoading} } = useSelector(state => state.fetchPostTypesReducer);
    const {values} = useSelector(state => state.metaStateReducer);
    const {fetched: fetchedInversed} = useSelector(state => state.fetchInversedMetaReducer);
    const box = filterById(values, boxId);
    const fieldValues = (isset(box, "fields")) ? filterById(box.fields, fieldId): {};
    const relationsValues = (isset(fieldValues, "relations")) ? filterById(fieldValues.relations, id): {};

    useEffect(() => {
        dispatch(fetchPostTypes());
    }, []);

    const handleInversedFieldChange = (inversedFieldName, inversedFieldId) => {
        dispatch(updateRelationInversedField(
            id,
            boxId,
            fieldId,
            selectedBoxId,
            selectedBoxName,
            inversedFieldName,
            inversedFieldId
        ));
    };

    // refs
    const selectRelationshipRef = useRef();
    const selectBoxRef = useRef();
    const selectFieldRef = useRef();

    // manage local state
    const {postType} = useParams();
    const [postMeta, setPostMeta] = useState([]);
    const [selectedBoxFields, setSelectedBoxFields] = useState([]);
    const [selectedBoxId, setSelectedBoxId] = useState(null);
    const [selectedBoxName, setSelectedBoxName] = useState(null);

    useEffect(() => {
        if(fetched.length > 0){
            if (isBidirectional(relationsValues.type)){
                const p = filterById(fetched, relationsValues.relatedPostType);
                if(!isEmpty(p) && isset(p, 'meta')){
                    setPostMeta(p.meta);
                }

                const f = filterById(postMeta, relationsValues.inversedBoxId);

                if(!isEmpty(f) && isset(f, 'fields')){
                    setSelectedBoxId(relationsValues.inversedBoxId);
                    setSelectedBoxName(relationsValues.inversedBoxName);
                    setSelectedBoxFields(f.fields);
                }
            }
        }
    }, [fetched]);

    const handleRelationPostChange = (relatedPostType) => {

        // reset other values if relatedPostType was changed
        if(relationsValues.relatedPostType !== relatedPostType){

            if(selectRelationshipRef.current){
                selectRelationshipRef.current.select.clearValue();
            }

            if(selectBoxRef.current){
                selectBoxRef.current.select.clearValue();
            }

            if(selectFieldRef.current){
                selectFieldRef.current.select.clearValue();
            }
        }

        dispatch(updateRelationPost(id, boxId, fieldId, relatedPostType));
    };

    const handleRelationTypeChange = (relation) => {
        dispatch(updateRelationType(id, boxId, fieldId, relation));

        if(selectBoxRef.current){
            selectBoxRef.current.select.clearValue();
        }

        if (isBidirectional(relation)){
            dispatch(fetchInversedMeta(relationsValues.relatedPostType, fieldId));
        }
    };

    const handleInversedBoxFieldChange = (boxId, boxName) => {
        if(selectFieldRef.current){
            selectFieldRef.current.select.clearValue();
        }

        const f = filterById(fetchedInversed, boxId);

        if(!isEmpty(f) && isset(f, 'fields')){
            setSelectedBoxId(boxId);
            setSelectedBoxName(boxName);
            setSelectedBoxFields(f.fields);
        }
    };

    if(fetchingPostsTypeLoading){
        return <Spinner/>;
    }

    if(isEmpty(fetched)){
        return <div className="acpt-alert acpt-alert-warning">Error fetching data</div>;
    }

    return (
        <div className="acpt-meta-relationship">
            <h4>Related post and relationship</h4>
            <div className="acpt-row">
                <div className="acpt-col acpt-col-sm">
                    <Select
                        defaultValue={relationsValues && relationsValues.relatedPostType &&
                            {
                                label: filterByLabel(fetched, 'name', relationsValues.relatedPostType).singular,
                                value: filterByLabel(fetched, 'name', relationsValues.relatedPostType).name,
                            }
                        }
                        onChange={(obj) => obj && handleRelationPostChange(obj.value) }
                        placeholder="Select post type from list"
                        styles={reactSelectStyles}
                        options={
                            fetched
                                .filter((f) => {
                                    // @TODO allow self relationship
                                    return postType !== f.name;
                                })
                                .map((f) => {
                                    return {label: f.singular, value: f.name};
                                })
                        }
                    />
                </div>
                <div className="acpt-col acpt-col-sm">
                    <Select
                        ref={selectRelationshipRef}
                        isDisabled={typeof relationsValues.relatedPostType === 'undefined'}
                        defaultValue={filterByValue(relationshipList, relationsValues.type)}
                        onChange={(obj) => obj && handleRelationTypeChange(obj.value) }
                        placeholder="Select relation type from list"
                        styles={reactSelectStyles}
                        options={relationshipList}
                    />
                </div>
            </div>
            {(relationsValues.relatedPostType && relationsValues.type && isBidirectional(relationsValues.type)) && (
                <React.Fragment>
                    <div className="inversed">
                        <h4>
                            Inversed field on target post
                        </h4>
                        <div className="acpt-row">
                            <div className="acpt-col acpt-col-sm">
                                <Select
                                    ref={selectBoxRef}
                                    defaultValue={relationsValues && relationsValues.inversedBoxId &&
                                        {
                                            label: relationsValues.inversedBoxName,
                                            value: relationsValues.inversedBoxId,
                                        }
                                    }
                                    placeholder="Select field box from list"
                                    styles={reactSelectStyles}
                                    onChange={(obj) => obj && handleInversedBoxFieldChange(obj.value, obj.label) }
                                    options={fetchedInversed.map((f) =>
                                        (
                                            {
                                                label: f.title,
                                                value: f.id
                                            }
                                        )
                                    )
                                    }
                                />
                            </div>
                            <div className="acpt-col acpt-col-sm">
                                <Select
                                    defaultValue={relationsValues && relationsValues.inversedFieldId &&
                                    {
                                        label: relationsValues.inversedFieldName,
                                        value: relationsValues.inversedFieldId,
                                    }
                                    }
                                    ref={selectFieldRef}
                                    onChange={(obj) => obj && handleInversedFieldChange(obj.label, obj.value) }
                                    placeholder="Select field from list"
                                    styles={reactSelectStyles}
                                    options={selectedBoxFields.map((f) => (
                                        {
                                            label: f.name,
                                            value: f.id
                                        }
                                    ))}
                                />
                            </div>
                        </div>
                        <div className="relationship">
                            {filterByValue(relationshipList, opposite(relationsValues.type)).label}
                        </div>
                    </div>
                </React.Fragment>
            ) }
        </div>
    );
};

export default CustomPostTypeMetaRelationship;


