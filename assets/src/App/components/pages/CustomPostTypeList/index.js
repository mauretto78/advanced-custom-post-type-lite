import React, {useEffect, useRef, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom'
import CustomPostTypeListElement from "./CustomPostTypeListElement";
import Spinner from "../../reusable/Loader/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
import {fetchPostTypesCount} from "../../../redux/thunks/fetchPostTypesCount";
import Breadcrumbs from "../../reusable/Breadcrumbs";
import {changeCurrentAdminMenuLink, metaTitle, refreshPage} from "../../../utils/misc";
import Pagination from "../../reusable/Pagination";
import Tippy from "../../reusable/Tippy";
import {Icon} from '@iconify/react';
import {deletePostTypeTemplate} from "../../../redux/thunks/deletePostTypeTemplate";
import {toast} from "react-toastify";
import Copyright from "../../reusable/Copyright";


const CustomPostTypeList = () => {

    // manage global state
    const dispatch = useDispatch();
    const {fetched, loading} = useSelector(state => state.fetchPostTypesReducer);
    const {fetched: fetchedCount, loading:loadingCount} = useSelector(state => state.fetchPostTypesCountReducer);
    const {errors: deleteTemplateErrors, success: deleteTemplateSuccess, loading: deleteTemplateLoading} = useSelector(state => state.deletePostTypeTemplateReducer);

    // manage local state
    const {page} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);
    const perPage = 20;
    const history = useHistory();

    useEffect(() => {
        metaTitle("Registered Custom Post Types");
        changeCurrentAdminMenuLink('');
        dispatch(fetchPostTypesCount());
        dispatch(fetchPostTypes({
            page: page ? page : 1,
            perPage: perPage
        }));
    }, [page]);

    // handle fetch outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!loading){
                setFetchedSuccess(true);
            }
        } else {
            didMountRef.current = true;
        }
    }, [loading]);

    // handle delete template outcome
    useEffect(() => {
        if (didMountRef.current){
            if(!deleteTemplateLoading){
                if(deleteTemplateSuccess){
                    history.push('/');
                    toast.success("Template was successfully deleted. The browser will refresh after 5 seconds...");
                    refreshPage(5000);
                }

                if(deleteTemplateErrors.length > 0){
                    deleteTemplateErrors.map((error) => {
                        toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [deleteTemplateLoading]);


    const handeDeleteTemplate = (name, type) => {
        dispatch(deletePostTypeTemplate(name, type));
    };

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    return(
        <div>
            <Breadcrumbs crumbs={[
                {
                    label: "Registered Custom Post Types",
                }
            ]} />
            <h1 className="acpt-title">
                <Icon icon="bx:bx-category-alt" color="#02c39a" width="20px" />
                &nbsp;
                Registered Custom Post Types
            </h1>
            <div className="acpt-buttons">
                <Link
                    className="acpt-btn acpt-btn-primary-o"
                    to="/register">
                        <Icon icon="bx:bx-list-plus" width="24px"/>
                        &nbsp;
                        Register new Post Type
                </Link>
            </div>
            {fetched.length > 0 ?
                <div className="acpt-card">
                    <div className="acpt-card__header borderless">
                        <div className="acpt-card__inner">
                            {fetchedCount} record(s) found
                        </div>
                    </div>
                    <div className="acpt-card__body">
                        <div className="acpt-table-responsive">
                            <table className="acpt-table">
                                <thead>
                                    <tr>
                                        <th className="grey backend with-border" colSpan={6}>Backend UI</th>
                                        <th className="grey frontend" colSpan={2}>Frontend UI</th>
                                    </tr>
                                    <tr>
                                        <th>
                                            Name
                                        </th>
                                        <th/>
                                        <th>
                                            Icon
                                            &nbsp;
                                            <Tippy title="Associated icon">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="24px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th>
                                            Meta boxes
                                            &nbsp;
                                            <Tippy title="Associated meta boxes">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="24px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th>
                                            Associated taxonomies
                                            &nbsp;
                                            <Tippy title="Associated taxonomies">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="24px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th className="with-border">
                                            Post count
                                            &nbsp;
                                            <Tippy title="Published posts count">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="24px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th className="text-center">
                                            Archive template
                                            &nbsp;
                                            <Tippy title="The archive template">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="24px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                        <th className="text-center">
                                            Single template
                                            &nbsp;
                                            <Tippy title="The single template">
                                                <span className="helper">
                                                    <Icon icon="bx:bx-help-circle" width="24px"/>
                                                </span>
                                            </Tippy>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fetched.map((element) => <CustomPostTypeListElement id={element.id} key={element.id} element={element} handeDeleteTemplate={handeDeleteTemplate} />)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="acpt-card__footer" style={{border: "none"}}>
                        <div className="acpt-card__inner">
                            <Pagination currentPage={page ? page : 1} perPage={perPage} records={fetchedCount}/>
                        </div>
                    </div>
                </div>
                :
                <div className="acpt-alert acpt-alert-secondary">
                    No custom post types found. <Link to="/register">Register the first one</Link>!
                </div>
            }
            <Copyright/>
        </div>
    )
};

export default CustomPostTypeList;