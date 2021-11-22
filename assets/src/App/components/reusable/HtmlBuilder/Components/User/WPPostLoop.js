import {useNode} from "@craftjs/core";
import React, {useEffect, useRef, useState} from "react";
import Measure from "../../SettingsPanel/Form/Measure";
import {WPPost} from "./WPPost";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {fetchPosts} from "../../../../../redux/thunks/fetchPosts";
import {fetchPostData} from "../../../../../redux/thunks/fetchPostData";
import Spinner from "../../../Loader/Spinner";
import ClonedElement from "../../../../pages/ArchiveTemplate/ClonedElement";
import {fetchPostTypeTemplate} from "../../../../../redux/thunks/fetchPostTypeTemplate";
import {Void} from "./Void";

export const WPPostLoop = ( {children, perRow, gap, perPage, isDeletable, isSaved, sortBy, sortOrder}) => {

    const { connectors: {connect, drag} } = useNode();

    // manage global state
    const { postType } = useParams();
    const dispatch = useDispatch();
    const {fetched, loading} = useSelector(state => state.fetchPostsReducer);
    const {fetched:postData, loading: postDataLoading} = useSelector(state => state.fetchPostDataReducer);
    const {fetched:postTemplate, loading: postTemplateLoading} = useSelector(state => state.fetchPostTypeTemplateReducer);

    // manage local state
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);
    const [nonLeadingPostsList, setNonLeadingPostsList] = useState([]);

    // fetch data
    useEffect(() => {
        dispatch(fetchPosts(postType, perPage, sortBy, sortOrder));
        dispatch(fetchPostTypeTemplate(postType, 'archive'));
    }, [perPage, sortBy, sortOrder]);

    // fetch post data
    useEffect(() => {
        if(fetched.length > 0){
            dispatch(fetchPostData(fetched[0].id));
        }
    }, [fetched]);

    // set non-leading posts list
    useEffect(() => {
        if(postData){

            const otherPosts = fetched.filter(x => {
                return x.id !== postData.ID;
            });

            setNonLeadingPostsList(otherPosts);
        }

    }, [postData]);

    // handle fetch outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading && !postDataLoading && !postTemplateLoading){
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading, postDataLoading]);

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    return (
        <div className="element-container" ref={ref=> connect(drag(ref))}>
            <span className="title">Loop posts</span>
            <div className={`content acpt-grid col-${perRow}`}>
                {children
                    ?
                    <React.Fragment>
                        {children}
                        {nonLeadingPostsList.length > 0 && nonLeadingPostsList.map((item)=> (
                                <ClonedElement
                                    currentPostId={item.id}
                                    leadingCompressedJson={postTemplate ? postTemplate.json : null}
                                />
                            )
                        )}
                    </React.Fragment>
                    :
                    <Void />
                }
            </div>
        </div>
    );
};

const GridSettings = () => {
    const { actions: {setProp}, perRow, gap, perPage, sortOrder, sortBy, css } = useNode((node) => ({
        perRow: node.data.props.perRow,
        perPage: node.data.props.perPage,
        gap: node.data.props.gap,
        sortBy: node.data.props.sortBy,
        sortOrder: node.data.props.sortOrder,
        css: node.data.props.css
    }));

    const {fetched:postMeta} = useSelector(state => state.fetchMetaReducer);

    let sortByOptions = [
        {"value": 'date', "label" : 'Post date'},
        {"value": 'title', 'label': 'Post title'},
    ];

    postMeta.map((meta)=>{
        meta.fields.map((field) => {
            sortByOptions.push({"value": field.id, "label": field.db_name});
        });
    });

    return (
        <div className="acpt-html-builder-additional-settings">
            <div className="acpt-form-group">
                <label>Gap size</label>
                <Measure
                    value={gap}
                    onChange={(value) => {
                        setProp(props => props.gap = value);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Elements per row</label>
                <select
                    value={perRow}
                    className={`acpt-form-control`}
                    onChange={(e) => {
                        const perRowValue = e.currentTarget.value;
                        setProp(props => props.perRow = perRowValue);
                    }}
                >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={6}>6</option>
                </select>
            </div>
            <div className="acpt-form-group">
                <label>Elements per page</label>
                <input
                    defaultValue={perPage}
                    className={`acpt-form-control`}
                    type="number"
                    min={1}
                    step={1}
                    onChange={(e) => {
                        const perPageValue = e.currentTarget.value;
                        setProp(props => props.perPage = perPageValue);
                    }}
                />
            </div>
            <div className="acpt-form-group">
                <label>Sort by</label>
                <div className="space-between">
                    <select
                        style={{
                            width: '75%'
                        }}
                        value={sortBy}
                        className={`acpt-form-control`}
                        onChange={(e) => {
                            const sortByValue = e.currentTarget.value;
                            setProp(props => props.sortBy = sortByValue);
                        }}
                    >
                        {sortByOptions.map((option)=>(
                            <option value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <select
                        style={{
                            width: '25%'
                        }}
                        value={sortOrder}
                        className={`acpt-form-control`}
                        onChange={(e) => {
                            const sortOrderValue = e.currentTarget.value;
                            setProp(props => props.sortOrder = sortOrderValue);
                        }}
                    >
                        <option value="ASC">ASC</option>
                        <option value="DESC">DESC</option>
                    </select>
                </div>
            </div>
            <div className="acpt-form-group">
                <label>Additional CSS classes</label>
                <input
                    type="text"
                    className="acpt-form-control"
                    defaultValue={css}
                    onChange={(e) => {
                        const cssValue = e.currentTarget.value;
                        setProp(props => props.css = cssValue);
                    }}
                />
            </div>
        </div>
    )
};

WPPostLoop.craft = {
    displayName: "Loop posts",
    props: {
        gap: '20px',
        css: ""
    },
    rules: {
        canMoveIn: (node) => {
            const name = node[0].data.name;

            return (
                name === "WPPost"
            );
        },
    },
    related: {
        settings: GridSettings
    }
};