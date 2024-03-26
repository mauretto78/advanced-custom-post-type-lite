import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {changeCurrentAdminMenuLink, delay, metaTitle} from "../../utils/misc";
import useTranslation from "../../hooks/useTranslation";
import {fetchOptionPages} from "../../redux/reducers/fetchOptionPagesSlice";
import Loader from "../../components/Loader";
import Layout from "../../layout/Layout";
import Button from "../../components/Button";
import {styleVariants} from "../../constants/styles";
import {FormProvider, useForm} from "react-hook-form";
import {savedView} from "../../utils/localStorage";
import ListView from "./ListView";
import TabularView from "./TabularView";
import {isEmpty} from "../../utils/objects";
import DeleteAllPagesModal from "./Modal/DeleteAllPagesModal";
import PageNotFound from "../404";
import {addPage, hydrateState} from "../../redux/reducers/optionPagesStateSlice";
import {v4 as uuidv4} from "uuid";
import {scrollToId} from "../../utils/scroll";
import {toast} from "react-hot-toast";
import {saveOptionPages} from "../../redux/reducers/saveOptionPagesSlice";
import {useNavigate} from "react-router-dom";

const SaveOptionPages = ({}) => {

    // manage global state
    const dispatch = useDispatch();
    const {loading} = useSelector(state => state.fetchOptionPages);
    const {pages} = useSelector(state => state.optionPagesState);

    // manage local state
    const [fetchError, setFetchError] = useState(false);
    const [view, setView] = useState(savedView("option_page_manage_view"));
    const [activeTab, setActiveTab] = useState(0);

    // manage redirect
    const navigate = useNavigate();

    // form init
    const methods = useForm({
        mode: 'all'
    });

    useEffect(() => {
        metaTitle(useTranslation("Manage option pages"));
        changeCurrentAdminMenuLink('#/option-pages');
        dispatch(fetchOptionPages({}))
            .then(res => {
                dispatch(hydrateState(res.payload.records));

                // Set initial values
                res.payload.records && res.payload.records.map((page, index) => {
                    methods.setValue(`pages.${index}`, page);
                });
            })
            .catch(err => {
                console.error(err);
                setFetchError(true);
            })
        ;
    }, []);

    const handleAddPage = () => {

        const newPageId = uuidv4();
        const newPage = {
            id: newPageId,
            pageTitle: 'New option page',
            menuTitle: 'Menu title',
            menuSlug: 'menu_slug',
            icon: 'admin-appearance',
            capability: ["manage_options"],
            position: 99,
            description: null,
            parentId: null,
            children: [],
            isSaved: false,
        };

        dispatch(addPage({page: newPage}));
        setActiveTab(pages.length);

        delay(1).then(()=>{
            scrollToId(`lazy-${newPage.id}`);
        });
    };

    /**
     *
     * @return {boolean}
     */
    const isFormValid = () => {
        if(methods.formState.errors && methods.formState.errors.pages){
            return false;
        }

        return true;
    };

    const onSubmit = (data) => {
        dispatch(saveOptionPages(data))
            .then(res => {
                const payload = res.payload;

                if(payload.success){
                    navigate('/option-pages');
                    toast.success(useTranslation("Option pages successfully saved"));
                } else {
                    toast.error(payload.error);
                }
            })
            .catch(err => {
                toast.error(err);
            })
        ;
    };

    const actions = [
        <Button
            testId="add-page"
            style={styleVariants.SECONDARY}
            onClick={(e) => {
                e.preventDefault();
                handleAddPage();
            }}
        >
            {useTranslation("Add page")}
        </Button>,
        <Button
            testId="save-pages"
            disabled={!isFormValid()}
            style={styleVariants.PRIMARY}
        >
            {useTranslation("Save")}
        </Button>,
        <DeleteAllPagesModal />,
    ];

    if(loading){
        return (
            <Loader/>
        );
    }

    if(fetchError){
        return <PageNotFound />;
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Layout
                    title={useTranslation("Manage option pages")}
                    actions={actions}
                    crumbs={[
                        {
                            label: useTranslation("Option pages"),
                            link: "/option-pages"
                        },
                        {
                            label: useTranslation("Manage option pages"),
                        }
                    ]}
                >
                    {view === 'list' ? (
                        <ListView
                            setActiveTab={setActiveTab}
                            view={view}
                            setView={setView}
                            pages={!isEmpty(pages) ? pages : []}
                        />
                    ) : (
                        <TabularView
                            activeTab={activeTab}
                            setActiveTab={setActiveTab}
                            view={view}
                            setView={setView}
                            pages={!isEmpty(pages) ? pages : []}
                        />
                    )}
                </Layout>
            </form>
        </FormProvider>
    );
};

export default SaveOptionPages;