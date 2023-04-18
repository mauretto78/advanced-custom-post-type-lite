import React, {useEffect, useRef, useState} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom'
import CustomPostTypeListElement from "./CustomPostTypeListElement";
import Spinner from "../../reusable/Loader/Spinner";
import {useDispatch, useSelector} from "react-redux";
import {fetchPostTypes} from "../../../redux/thunks/fetchPostTypes";
import {fetchPostTypesCount} from "../../../redux/thunks/fetchPostTypesCount";
import {changeCurrentAdminMenuLink, metaTitle, refreshPage} from "../../../utils/misc";
import {deletePostTypeTemplate} from "../../../redux/thunks/deletePostTypeTemplate";
import {toast} from "react-toastify";
import {syncPosts} from "../../../redux/thunks/syncPosts";
import {filterByLabel} from "../../../utils/objects";
import Layout from "../../reusable/Layout";
import ActionsBar from "../../../components/reusable/Layout/ActionsBar";
import Breadcrumbs from "../../../components/reusable/Layout/Breadcrumbs";
import Tippy from "../../../components/reusable/Tippy";
import {Icon} from '@iconify/react';
import Pagination from "../../../components/reusable/Pagination";

const CustomPostTypeList = () => {

    // manage global state
    const dispatch = useDispatch();
    const {fetched, loading} = useSelector(state => state.fetchPostTypesReducer);
    const {fetched: fetchedCount, loading:loadingCount} = useSelector(state => state.fetchPostTypesCountReducer);
    const {errors: deleteTemplateErrors, success: deleteTemplateSuccess, loading: deleteTemplateLoading} = useSelector(state => state.deletePostTypeTemplateReducer);
    const {errors: syncPostsErrors, success: syncPostsSuccess, loading: syncPostsLoading} = useSelector(state => state.syncPostsReducer);
    const {loading: settingsLoading, fetched: settings} = useSelector(state => state.fetchSettingsReducer);

    // manage local state
    const {page} = useParams();
    const didMountRef = useRef(false);
    const [fetchedSuccess, setFetchedSuccess] = useState(null);
    const [thereIsWooCommerce, setThereIsWooCommerce] = useState(false);
    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
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
            if(!loading && !settingsLoading){
                setFetchedSuccess(true);

                let isWooCommerce = 0;

                fetched.map((post)=>{
                    if(post.isWooCommerce){
                        isWooCommerce++;
                    }
                });

                (isWooCommerce > 0) && setThereIsWooCommerce(true);
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

    // handle sync posts
    useEffect(() => {
        if (didMountRef.current){
            if(!syncPostsLoading){
                if(syncPostsSuccess){
                    history.push('/');
                    toast.success("Successfully post sync. The browser will refresh after 5 seconds...");
                    refreshPage(5000);
                }

                if(syncPostsErrors.length > 0){
                    syncPostsErrors.map((error) => {
                        toast.error(error);
                    });
                }
            }
        } else {
            didMountRef.current = true;
        }
    }, [syncPostsLoading]);

    const handleDeleteTemplate = (name, type) => {
        dispatch(deletePostTypeTemplate(name, type));
    };

    const handleSyncPosts = () => {
        dispatch(syncPosts());
    };

    if(!fetchedSuccess){
        return <Spinner/>;
    }

    const actions =
        <React.Fragment>
            <Link
                className="acpt-btn acpt-btn-primary"
                to="/register">
                Register new Post Type
            </Link>
            <a
                onClick={e => {
                    e.preventDefault();
                    handleSyncPosts();
                }}
                className="acpt-btn acpt-btn-primary-o"
                href="#"
            >
                Sync with post types
            </a>
        </React.Fragment>
    ;

    return (
        <Layout>
            <ActionsBar
                title="Registered Custom Post Types"
                actions={actions}
            />
            <main>
                <Breadcrumbs crumbs={[
                    {
                        label: "Registered Custom Post Types",
                    }
                ]} />
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
                                            <th/>
                                            <th>
                                                Name
                                            </th>
                                            <th/>
                                            <th>
                                                Meta boxes
                                                &nbsp;
                                                <Tippy title="Associated meta boxes">
                                                    <span className="helper">
                                                        <Icon icon="bx:bx-help-circle" width="18px"/>
                                                    </span>
                                                </Tippy>
                                            </th>
                                            {thereIsWooCommerce === true && (
                                                <th>
                                                    Product data
                                                    &nbsp;
                                                    <Tippy title="Associated WooCommerce product data">
                                                        <span className="helper">
                                                            <Icon icon="bx:bx-help-circle" width="18px"/>
                                                        </span>
                                                    </Tippy>
                                                </th>
                                            )}
                                            <th>
                                                Associated taxonomies
                                                &nbsp;
                                                <Tippy title="Associated taxonomies with the post">
                                                    <span className="helper">
                                                        <Icon icon="bx:bx-help-circle" width="18px"/>
                                                    </span>
                                                </Tippy>
                                            </th>
                                            <th className="with-border">
                                                Post count
                                                &nbsp;
                                                <Tippy title="Published posts count">
                                                    <span className="helper">
                                                        <Icon icon="bx:bx-help-circle" width="18px"/>
                                                    </span>
                                                </Tippy>
                                            </th>
                                            <th className="text-center">
                                                Archive template
                                                &nbsp;
                                                <Tippy title="The archive template for this custom post type">
                                                    <span className="helper">
                                                        <Icon icon="bx:bx-help-circle" width="18px"/>
                                                    </span>
                                                </Tippy>
                                            </th>
                                            <th className="text-center">
                                                Single template
                                                &nbsp;
                                                <Tippy title="The single template for this custom post type">
                                                    <span className="helper">
                                                        <Icon icon="bx:bx-help-circle" width="18px"/>
                                                    </span>
                                                </Tippy>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetched.map((element) => <CustomPostTypeListElement id={element.id} thereIsWooCommerce={thereIsWooCommerce} key={element.id} element={element} handeDeleteTemplate={handleDeleteTemplate} />)}
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
            </main>
        </Layout>
    );
};

export default CustomPostTypeList;