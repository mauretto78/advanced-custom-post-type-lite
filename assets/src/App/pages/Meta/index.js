import React, {useEffect, useState} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import Button from "../../components/Button";
import {styleVariants} from "../../constants/styles";
import {FormProvider, useForm} from "react-hook-form";
import {changeCurrentAdminMenuLink, delay, metaTitle} from "../../utils/misc";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchMeta} from "../../redux/reducers/fetchMetaSlice";
import Loader from "../../components/Loader";
import {v4 as uuidv4} from "uuid";
import {isEmpty} from "../../utils/objects";
import ListView from "./ListView";
import TabularView from "./TabularView";
import PageNotFound from "../404";
import {addBox, hydrateState} from "../../redux/reducers/metaStateSlice";
import DeleteAllMetaBoxesModal from "./Modal/DeleteAllMetaBoxesModal";
import {savedView} from "../../utils/localStorage";
import {scrollToId, scrollToTop} from "../../utils/scroll";
import {saveMeta} from "../../redux/reducers/saveMetaSlice";
import {toast} from "react-hot-toast";
import {useConfirmTabClose} from "../../hooks/useConfirmTabClose";

const Meta = () => {

    // manage global state
    const dispatch = useDispatch();
    const {error: saveError, success: saveSuccess, loading: saveLoading} = useSelector(state => state.saveMeta);
    const {loading} = useSelector(state => state.fetchMeta);
    const {group} = useSelector(state => state.metaState);

    // manage local state
    const newGroupId = uuidv4();
    const {id} = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const groupId = id ? id : newGroupId;
    const [isSubmitting, setIsSubmitted] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [fetchError, setFetchError] = useState(false);
    const [view, setView] = useState(savedView(groupId));
    const [activeBoxTab, setActiveBoxTab] = useState(0);

    // manage redirect
    const navigate = useNavigate();

    // form init
    const methods = useForm({
        mode: 'onChange'
    });

    useEffect(() => {
        metaTitle(`${useTranslation("Manage meta fields")}${(hasUnsavedChanges) ? '*' : ''}`);
    }, [hasUnsavedChanges]);

    useConfirmTabClose(hasUnsavedChanges);

    /**
     * Add box
     */
    const handleAddBox = () => {

        const newBoxId = uuidv4();
        const newBox = {
            id: newBoxId,
            name: useTranslation("meta_box_title"),
            UIName: useTranslation("meta_box_title"),
            label: "meta box title",
            fields: [],
            isSaved: false,
            sort: group.boxes ? group.boxes.length : 1
        };

        dispatch(addBox(newBox));
        setActiveBoxTab(group.boxes ? group.boxes.length : 0);

        delay(1).then(()=>{
            scrollToId(`lazy-${newBoxId}`);
        });
    };

    // manage local state
    useEffect(() => {
        metaTitle(useTranslation("Manage meta fields"));
        changeCurrentAdminMenuLink('#/meta');

        if(id){
            dispatch(fetchMeta({
                id: id
            }))
                .then(res => {
                    dispatch(hydrateState(res.payload));

                    // Set initial values
                    methods.setValue('id', id);
                    methods.setValue('name', res.payload.name);
                    methods.setValue('label', res.payload.label);
                    methods.setValue('display', res.payload.display);
                    res.payload.belongs && res.payload.belongs.map((belong, index) => {
                        methods.setValue(`belongs.${index}.id`, belong.id);
                        methods.setValue(`belongs.${index}.belongsTo`, belong.belongsTo);
                        methods.setValue(`belongs.${index}.operator`, belong.operator);
                        methods.setValue(`belongs.${index}.find`, belong.find);
                        methods.setValue(`belongs.${index}.logic`, belong.logic);
                    });
                    res.payload.boxes && res.payload.boxes.map((box, index) => {
                        methods.setValue(`boxes.${index}`, box);
                    });
                })
                .catch(err => {
                    console.error(err);
                    setFetchError(true);
                });
        } else {
            // Set initial name
            const find = searchParams.get('find');
            const belongsTo = searchParams.get('belongsTo');

            const newGroupName = `${find ? find+'_' : ''}group_name`;
            const newGroupLabel = `${find ? find+' ' : ''}group name`;

            let state = {
                name: newGroupName,
                label: newGroupLabel,
            };

            methods.reset();
            methods.setValue('name', newGroupName);
            methods.setValue('label', newGroupLabel);

            if(find && belongsTo){
                const newUuid = uuidv4();

                methods.setValue(`belongs.0.id`, newUuid);
                methods.setValue(`belongs.0.belongsTo`, belongsTo);
                methods.setValue(`belongs.0.operator`, "=");
                methods.setValue(`belongs.0.find`, find);

                state.belongs = [];
                state.belongs.push({
                    id: newUuid,
                    belongsTo: belongsTo,
                    operator: "=",
                    find: find
                });
            }

            dispatch(hydrateState(state));
        }
    }, [id]);

    /**
     *
     * @return {boolean}
     */
    const isSaveButtonEnabled = () => {

        if(isSubmitting){
            return false;
        }

        if(saveLoading){
            return false;
        }

        if(!isEmpty(methods.formState.errors)){
            return false;
        }

        return true;
    };

    /**
     * Handle data submission
     *
     * @param data
     */
    const onSubmit = (data) => {

        setIsSubmitted(true);

        dispatch(saveMeta(data))
            .then(res => {
                const payload = res.payload;

                if(payload.success){
                    if(!id){
                        navigate('/meta');
                    }

                    methods.reset({}, { keepValues: true, keepIsSubmitted: true });
                    setHasUnsavedChanges(false);
                    toast.success(useTranslation("Meta group settings successfully saved"));
                    dispatch(hydrateState(data));
                    scrollToTop();
                } else {
                    toast.error(payload.error);
                }

                setIsSubmitted(false);

            })
            .catch(err => {
                toast.error(err);
                setIsSubmitted(false);
            })
        ;
    };

    const actions = [
        <Button
            type="button"
            style={styleVariants.SECONDARY}
            onClick={(e) => {
                e.preventDefault();
                handleAddBox();
            }}
        >
            {useTranslation("Add meta box")}
        </Button>,
        <Button
            disabled={!isSaveButtonEnabled()}
            style={styleVariants.PRIMARY}
        >
            {useTranslation("Save")}
        </Button>,
        <DeleteAllMetaBoxesModal />,
    ];

    if(id && loading){
        return <Loader/>;
    }

    if(fetchError){
        return <PageNotFound />;
    }

    return (
        <React.Fragment>
            <FormProvider {...methods}>
                <form
                    onSubmit={methods.handleSubmit(onSubmit)}
                    onChange={() => {
                        setHasUnsavedChanges(true);
                    }}
                >
                    <Layout
                        title={useTranslation("Manage meta fields")}
                        actions={actions}
                        crumbs={[
                            {
                                label: useTranslation("Field groups"),
                                link: "/meta"
                            },
                            {
                                label: useTranslation("Manage meta fields"),
                            }
                        ]}
                    >
                        {view === 'list' ? (
                            <ListView
                                view={view}
                                setView={setView}
                                boxes={!isEmpty(group) ? group.boxes : []}
                            />
                        ) : (
                            <TabularView
                                activeBoxTab={activeBoxTab}
                                setActiveBoxTab={setActiveBoxTab}
                                view={view}
                                setView={setView}
                                boxes={!isEmpty(group) ? group.boxes : []}
                            />
                        )}
                    </Layout>
                </form>
            </FormProvider>
        </React.Fragment>
    );
};

export default Meta;