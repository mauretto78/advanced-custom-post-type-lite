import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {fetchPostData} from "../../../../redux/thunks/fetchPostData";
import {fetchPreviewLink} from "../../../../redux/thunks/fetchPreviewLink";

const ArchiveSettings = ({postType, postId, hasTemplate, showPreview}) => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchPostsReducer);
    const dispatch = useDispatch();

    // handle redirect click
    const handlePreviewRedirect = () => {
        dispatch( fetchPreviewLink( postId, postType, 'archive_link' ) );
    };

    const showPreviewButton = () => {
        if(hasTemplate){
            return true;
        }

        return showPreview;
    };

    const onChangeHandler = (id) => {
        dispatch(fetchPostData(id));
    };

    return (
        <div className="space-between mb-3">
            <label style={{width: "200px"}} className="mr-1">
                <strong>Leading post:</strong>
            </label>
            <select
                className={`acpt-form-control`}
                onChange={e => onChangeHandler(e.currentTarget.value) }
            >
                {fetched.map((item) => (
                    <option key={item.id} value={item.id}>{item.title}</option>
                ))}
            </select>
            {showPreviewButton() && (
                <a href="#"
                   onClick={e => {
                       e.preventDefault();
                       handlePreviewRedirect();
                   }}
                   className="ml-1 acpt-btn acpt-btn-primary-o"
                >
                    Preview
                </a>
            )}
        </div>
    );
};

export default ArchiveSettings;