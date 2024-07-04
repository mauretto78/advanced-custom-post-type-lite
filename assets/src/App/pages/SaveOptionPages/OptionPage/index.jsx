import React, {useState} from 'react';
import PropTypes from "prop-types";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {useFormContext, useWatch} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {slugify, transliterate} from "transliteration";
import InputHidden from "../../../components/Forms/InputHidden";
import OptionPageHeader from "./OptionPageHeader";
import useTranslation from "../../../hooks/useTranslation";
import Label from "../../../components/Forms/Label";
import {alphanumericallyValid} from "../../../utils/validation";
import Input from "../../../components/Forms/Input";
import Select from "../../../components/Forms/Select";
import Textarea from "../../../components/Forms/Textarea";
import IconPicker from "../../../components/Forms/IconPicker";
import Alert from "../../../components/Alert";
import {styleVariants} from "../../../constants/styles";
import Button from "../../../components/Button";
import {v4 as uuidv4} from "uuid";
import {addPage} from "../../../redux/reducers/optionPagesStateSlice";
import {delay} from "../../../utils/misc";
import {scrollToId} from "../../../utils/scroll";
import ChildrenListView from "./Children/ChildrenListView";
import ChildrenTabularView from "./Children/ChildrenTabularView";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import LazyElement from "../../../components/LazyElement";
import MenuPosition from "../../../components/Forms/MenuPosition";

const OptionPage = ({page, index, parentPageIndex, parentSetActiveTab, view}) => {

    // DND-kit
    const {attributes, listeners, setNodeRef, transform} = useSortable({id: page.id});
    const style = {
        transform: CSS.Translate.toString(transform)
    };

    // auto-animate
    const [parent] = useAutoAnimate();

    // manage form state
    const { register, control, formState: {errors}, setValue, resetField, clearErrors, setError } = useFormContext();

    const watchedPages = useWatch({
        control,
        name: 'pages'
    });

    // manage global state
    const dispatch = useDispatch();
    const {closedElements} = useSelector(state => state.optionPagesState);

    // mange local state
    const [autoSlug, setAutoSlug] = useState(true);

    const handleAddChildPage = () => {

        const newPageId = uuidv4();
        const newPage = {
            id: newPageId,
            pageTitle: 'New option child page',
            menuTitle: 'Menu child title',
            menuSlug: 'menu_child_slug',
            icon: null,
            position: 99,
            description: null,
            parentId: page.id,
            capability: "manage_options",
            children: [],
            isSaved: false,
        };

        dispatch(addPage({page: newPage}));
        setActiveTab(page.children.length);

        delay(1).then(()=>{
            scrollToId(newPage.id);
        });
    };

    // manage local state
    const [activeTab, setActiveTab] = useState(0);

    const capabilities = [
        {label: useTranslation("Moderate comments"), value: "moderate_comments"},
        {label: useTranslation("Manage options"), value: "manage_options"},
        {label: useTranslation("Manage categories"), value: "manage_categories"},
        {label: useTranslation("Manage links"), value: "manage_links"},
        {label: useTranslation("Unfiltered html"), value: "unfiltered_html"},
        {label: useTranslation("Edit others posts"), value: "edit_others_posts"},
        {label: useTranslation("Edit pages"), value: "edit_pages"},
        {label: useTranslation("Edit others pages"), value: "edit_others_pages"},
        {label: useTranslation("Edit published pages"), value: "edit_published_pages"},
        {label: useTranslation("Publish pages"), value: "publish_pages"},
        {label: useTranslation("Delete pages"), value: "delete_pages"},
        {label: useTranslation("Delete others pages"), value: "delete_others_pages"},
        {label: useTranslation("Delete published pages"), value: "delete_published_pages"},
        {label: useTranslation("Delete others posts"), value: "delete_others_posts"},
        {label: useTranslation("Delete private posts"), value: "delete_private_posts"},
        {label: useTranslation("Edit private posts"), value: "edit_private_posts"},
        {label: useTranslation("Read private posts"), value: "read_private_posts"},
        {label: useTranslation("Delete private pages"), value: "delete_private_pages"},
        {label: useTranslation("Edit private pages"), value: "edit_private_pages"},
        {label: useTranslation("Read private pages"), value: "read_private_pages"},
    ];

    /**
     *
     * @return {boolean}
     */
    const isClosed = () => {
        const filter = closedElements.filter(e => e === page.id);

        return filter.length === 1;
    };

    /**
     *
     * @param value
     * @return {string}
     */
    const formId = (value = null) => {
        if(page.parentId){
            let parentFormId = `pages.${parentPageIndex}.children.${index}`;

            if(value){
                parentFormId += `.${value}`;
            }

            return parentFormId;
        }

        let formId = `pages.${index}`;

        if(value){
            formId += `.${value}`;
        }

        return formId;
    };

    /**
     *
     * @return {string}
     */
    const className = () => {

        if(view === 'list'){
            return 'with-shadow p-24';
        }

        return page.parentId ? 'with-border p-24' : '';
    };

    /**
     *
     * @return {*|boolean}
     */
    const addButtonIsVisible = () => {

        if(view === 'list'){
            return true;
        }

        return page.children && page.children.length === 0;
    };

    /**
     * Used by menu title and menu name is autoslug is ON
     * @param n
     * @return {*}
     */
    const checkIfNameIsValid = (n) => {
        if(autoSlug){
            const slugified = slugify(transliterate(n));

            if(checkIfSlugIsValid(slugified)){
                setError(
                    formId("menuSlug"),
                    {message: useTranslation("Name is already taken")}
                );
            } else {
                clearErrors(formId("menuSlug"));
            }
        }
    };

    /**
     * To avoid page slug collisions
     *
     * @param s
     * @return {*}
     */
    const checkIfSlugIsValid = (s) => {

        // check for other box names
        let otherPageSlugs = [];

        watchedPages.map((page, i) => {
            if(i !== index){
                otherPageSlugs.push(page.menuSlug);
            }

            if(page.children && page.children.length > 0){
                page.children.map((child, c) => {
                    if(c !== index){
                        otherPageSlugs.push(child.menuSlug);
                    }
                });
            }
        });

        if(otherPageSlugs.includes(s)){
            return useTranslation("Name is already taken");
        }
    };

    return (
        <LazyElement
            id={page.id}
            size={{
                type: !page.parentId ? "page" : "child-page",
                children: page.children.length
            }}
            isClosed={isClosed()}
            element={
                <div id={page.id} className={`bg-white b-rounded ${className()}`} ref={view === 'list' ? setNodeRef : null} style={view === 'list' ? style : null}>
                    <InputHidden
                        id={formId("id")}
                        value={page.id}
                        register={register}
                    />
                    <div className={(view === 'tabular' || (!isClosed() && view === 'list')) ? 'mb-24' : ''}>
                        <OptionPageHeader
                            index={index}
                            parentPageIndex={parentPageIndex}
                            formId={formId}
                            view={view}
                            page={page}
                            attributes={attributes}
                            listeners={listeners}
                            parentSetActiveTab={parentSetActiveTab}
                        />
                    </div>
                    <div className={`${(view === 'tabular' || (!isClosed() && view === 'list')) ? '' : 'hidden'}`}>
                        <div className="flex-column s-24">
                            <div className="container align-end">
                                <div className="col-4">
                                    <div className="flex-between s-8">
                                        <Label
                                            isRequired={true}
                                            id={formId("pageTitle")}
                                            label={useTranslation("Page title")}
                                        />
                                        <a
                                            href="#"
                                            onClick={e => {
                                                e.preventDefault();
                                                setAutoSlug(!autoSlug);
                                            }}
                                        >
                                            {useTranslation(`${autoSlug ? 'Auto slug ON' : 'Auto slug OFF'}`)}
                                        </a>
                                    </div>
                                    <Input
                                        id={formId("pageTitle")}
                                        register={register}
                                        errors={errors}
                                        placeholder={useTranslation("Page title")}
                                        defaultValue={page.pageTitle}
                                        validate={{
                                            required: useTranslation("This field is mandatory"),
                                            validate: {
                                                checkIfNameIsValid
                                            },
                                            maxLength: {
                                                value: 255,
                                                message: "max length is 255"
                                            }
                                        }}
                                        onChangeCapture={e => {
                                            if(autoSlug){
                                                setValue(formId("menuTitle"), e.target.value);
                                                setValue(formId("menuSlug"), slugify(transliterate(e.target.value)));
                                            }
                                        }}
                                        onClick={e => {
                                            if(e.target.value === 'New option page' || e.target.value === 'New option child page'){
                                                resetField(formId("pageTitle"));
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-4">
                                    <Label
                                        isRequired={true}
                                        id={formId("menuTitle")}
                                        label={useTranslation("Menu title")}
                                    />
                                    <Input
                                        id={formId("menuTitle")}
                                        register={register}
                                        errors={errors}
                                        placeholder={useTranslation("Menu title")}
                                        defaultValue={page.menuTitle}
                                        validate={{
                                            required: useTranslation("This field is mandatory"),
                                            validate: {
                                                checkIfNameIsValid
                                            },
                                            maxLength: {
                                                value: 255,
                                                message: "max length is 255"
                                            }
                                        }}
                                        onChangeCapture={e => {
                                            if(autoSlug){
                                                setValue(formId("pageTitle"), e.target.value);
                                                setValue(formId("menuSlug"), slugify(transliterate(e.target.value)));
                                            }
                                        }}
                                        onClick={e => {
                                            if(e.target.value === 'Menu title' || e.target.value === 'Menu child title'){
                                                resetField(formId("menuTitle"));
                                            }
                                        }}
                                    />
                                </div>
                                <div className="col-4">
                                    <Label
                                        isRequired={true}
                                        id={formId("menuSlug")}
                                        label={useTranslation("Menu slug")}
                                    />
                                    <Input
                                        id={formId("menuSlug")}
                                        register={register}
                                        errors={errors}
                                        placeholder={useTranslation("Menu slug")}
                                        defaultValue={page.menuSlug}
                                        validate={{
                                            required: useTranslation("This field is mandatory"),
                                            validate: {
                                                alphanumericallyValid,
                                                checkIfSlugIsValid
                                            },
                                            maxLength: {
                                                value: 255,
                                                message: "max length is 255"
                                            }
                                        }}
                                        onChangeCapture={e => {
                                            setValue(formId("menuSlug"), slugify(transliterate(e.target.value)));
                                        }}
                                        onClick={e => {
                                            if(e.target.value === 'menu_slug' || e.target.value === 'menu_child_slug'){
                                                resetField(formId("menuSlug"));
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="container align-end">
                                {!page.parentId && (
                                    <React.Fragment>
                                        <div className="col-4">
                                            <Label
                                                isRequired={true}
                                                id={formId("icon")}
                                                label={useTranslation("Menu icon")}
                                            />
                                            <IconPicker
                                                id={formId("icon")}
                                                callback={(value) => {
                                                    setValue(formId("icon"), value);
                                                }}
                                                defaultValue={page.icon}
                                                register={register}
                                                errors={errors}
                                                validate={{
                                                    required: useTranslation("This field is mandatory")
                                                }}
                                            />
                                        </div>
                                        <div className="col-4">
                                            <div className="flex-between s-8">
                                                <Label
                                                    isRequired={true}
                                                    id={formId("position")}
                                                    label={useTranslation("Menu position")}
                                                />
                                            </div>
                                            <MenuPosition
                                                id={formId("position")}
                                                defaultValue={page.position ? page.position : 99}
                                                register={register}
                                                setValue={setValue}
                                            />
                                        </div>
                                    </React.Fragment>
                                )}
                                <div className={!page.parentId ? "col-4" : "col-12"}>
                                    <Label
                                        isRequired={true}
                                        id={formId("capability")}
                                        label={useTranslation("Capability")}
                                    />
                                    <Select
                                        id={formId("capability")}
                                        defaultValue={page.capability}
                                        placeholder={useTranslation("Select capability")}
                                        errors={errors}
                                        register={register}
                                        values={capabilities}
                                        validate={{
                                            required: useTranslation("This field is mandatory"),
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label
                                    isRequired={false}
                                    id={formId("description")}
                                    label={useTranslation("Page description (will be displayed after the title)")}
                                />
                                <Textarea
                                    id={formId("description")}
                                    register={register}
                                    errors={errors}
                                    placeholder={useTranslation("Page description (will be displayed after the title)")}
                                    defaultValue={page.description}
                                    validate={{
                                        maxLength: {
                                            value: 255,
                                            message: "max length is 255"
                                        }
                                    }}
                                />
                            </div>
                            {!page.parentId && (
                                <div
                                    ref={parent}
                                    className="flex-column s-24"
                                >
                                    {page.children && page.children.length > 0 ? (
                                        <div>
                                            {view === 'list' ? (
                                                <div className="p-24 bg-pale-gray b-rounded">
                                                    <ChildrenListView
                                                        parentPageIndex={index}
                                                        pages={page.children}
                                                        setActiveTab={setActiveTab}
                                                    />
                                                </div>
                                            ) : (
                                                <ChildrenTabularView
                                                    activeTab={activeTab}
                                                    setActiveTab={setActiveTab}
                                                    parentPageId={page.id}
                                                    parentPageIndex={index}
                                                    pages={page.children}
                                                />
                                            )}
                                        </div>
                                    ) : (
                                        <Alert style={styleVariants.WARNING}>
                                            {useTranslation('No children already created. Create the first one now by clicking the button "Add child page"!')}
                                        </Alert>
                                    ) }
                                    {addButtonIsVisible() && (
                                        <div>
                                            <Button
                                                testId="add-child-page"
                                                style={styleVariants.SECONDARY}
                                                onClick={e => {
                                                    e.preventDefault();
                                                    handleAddChildPage();
                                                }}
                                            >
                                                {useTranslation("Add child page")}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }
        />
    );
};

OptionPage.propTypes = {
    index: PropTypes.number.isRequired,
    parentPageIndex: PropTypes.number,
    page: PropTypes.object.isRequired,
    setActiveTab: PropTypes.func,
    view: PropTypes.oneOf([
        "list",
        "tabular"
    ]).isRequired,
};
export default OptionPage;