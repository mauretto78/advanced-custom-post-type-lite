import React, {useEffect, useReducer, useRef} from 'react';
import Layout from "../../layout/Layout";
import useTranslation from "../../hooks/useTranslation";
import {changeCurrentAdminMenuLink, metaTitle, refreshPage} from "../../utils/misc";
import {useDispatch, useSelector} from "react-redux";
import {Link, useParams} from "react-router-dom";
import {filterByLabel} from "../../utils/objects";
import {fetchTaxonomies} from "../../redux/reducers/fetchTaxonomiesSlice";
import Loader from "../../components/Loader";
import ButtonLink from "../../components/ButtonLink";
import {styleVariants} from "../../constants/styles";
import Alert from "../../components/Alert";
import Tooltip from "../../components/Tooltip";
import Pagination from "../../components/Pagination";
import TaxonomyListElement from "./TaxonomyListElement";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import {wpAjaxRequest} from "../../utils/ajax";
import {toast} from "react-hot-toast";
import {metaTypes} from "../../constants/metaTypes";
import {useAutoAnimate} from "@formkit/auto-animate/react";
import {scrollToTop} from "../../utils/scroll";
import BulkActions from "../../components/BulkActions";
import {hiddenElements, hideElements, isElementHidden} from "../../utils/localStorage";
import {flushCookieMessages, setCookieMessage} from "../../utils/cookies";

const TaxonomyList = () => {

    const globals = document.globals;
    const settings = globals.settings;

    const hiddenElms = hiddenElements(metaTypes.TAXONOMY);

    // re-render component
    const [_, forceUpdate] = useReducer((x) => x + 1, 0);

    // auto-animate
    const [parent] = useAutoAnimate();

    // ref
    const ref = useRef();

    // form init
    const methods = useForm({
        mode: 'all'
    });

    const watchedElements = useWatch({
        control: methods.control,
        name: "elements"
    });

    // manage global state
    const dispatch = useDispatch();
    const {data, loading} = useSelector(state => state.fetchTaxonomies);

    // manage local state
    const {page} = useParams();
    const perPage = (settings.length > 0 && filterByLabel(settings, 'key', 'records_per_page') !== '') ? filterByLabel(settings, 'key', 'records_per_page').value : 20;
    const totalPages = Math.ceil( data.count / perPage );

    useEffect(() => {
        metaTitle(useTranslation("Registered Taxonomies"));
        changeCurrentAdminMenuLink('#/taxonomies');
        dispatch(fetchTaxonomies({
            page: page ? page : 1,
            perPage: perPage
        })).then(res => {
            flushCookieMessages();
        });
    }, [page]);

    useEffect(() => {

        /**
         *
         * @return {boolean}
         */
        const areAllSelected = () => {

            if(!watchedElements){
                return false;
            }

            let matches = 0;
            for (const [key, value] of Object.entries(watchedElements)) {
                if(value === true){
                    matches++;
                }
            }

            return matches === Object.entries(watchedElements).length;
        };

        if(areAllSelected()){
            ref.current.checked = true;
        } else {
            if(ref.current){
                ref.current.checked = false;
            }
        }

    }, [watchedElements]);

    /**
     * re-render the app when hidden elements are restored
     */
    document.addEventListener("restoredElement", function(){
        forceUpdate();
    });

    const onSubmit = (data) => {
        methods.reset();
        data.belongsTo = metaTypes.TAXONOMY;
        const action = data.action;

        if(!action){
            return;
        }

        switch(action) {

            // hide elements
            case "hide":
                hideElements(data);
                break;

            // delete elements
            // duplicate elements
            case "delete":
            case "duplicate":
                wpAjaxRequest('bulkActionsAction', data)
                    .then(res => {
                        if(res.success === true){

                            // flush message
                            switch (data.action) {
                                case "delete":
                                    setCookieMessage("Taxonomy successfully deleted.");
                                    break;

                                case "duplicate":
                                    setCookieMessage("Taxonomy successfully duplicated.");
                                    break;
                            }

                            scrollToTop();
                            refreshPage();
                        } else {
                            toast.error(res.error);
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        toast.error(useTranslation("Unknown error, please retry later"));
                    })
                ;
                break;
        }
    };

    const handleSelectAll = (checked) => {
        data.records
            .filter(r => r.isNative === false)
            .filter(r => !isElementHidden(r.slug, metaTypes.TAXONOMY))
            .map((r) => {
                methods.setValue(`elements.${r.slug}`, checked);
            });
    };

    const actions = [
        <ButtonLink style={styleVariants.PRIMARY} to="/register_taxonomy">{useTranslation("Register new Taxonomy")}</ButtonLink>,
    ];

    if(loading){
        return (
            <Loader/>
        );
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Layout
                    title={useTranslation("Registered Taxonomies")}
                    actions={actions}
                    crumbs={[
                        {
                            label: useTranslation("Registered Taxonomies")
                        }
                    ]}
                >
                    <BulkActions belongsTo={metaTypes.TAXONOMY} />
                    {data.records && data.records.length > 0 ? (
                        <div className="responsive with-shadow b-rounded">
                            <table
                                data-cy="cpt-table"
                                className={`acpt-table ${globals.is_rtl ? 'rtl' : ''}`}
                            >
                                <thead>
                                <tr>
                                    <th style={{
                                        width: "24px"
                                    }}>
                                        <label
                                            data-cy="select-all"
                                            className="checkbox"
                                            htmlFor="all"
                                        >
                                            <input
                                                ref={ref}
                                                type="checkbox"
                                                id="all"
                                                defaultChecked={false}
                                                onClick={e => handleSelectAll(e.currentTarget.checked)}
                                            />
                                            <span/>
                                        </label>
                                    </th>
                                    <th>
                                        <Tooltip
                                            tip={useTranslation("Taxonomy slug. The post name/slug. Used for various queries for taxonomy content.")}
                                            label={useTranslation("Slug")}
                                        />
                                    </th>
                                    <th>
                                        {useTranslation("Type")}
                                    </th>
                                    <th>
                                        <Tooltip
                                            tip={useTranslation("Associate custom post types here")}
                                            label={useTranslation("Associated post types")}
                                        />
                                    </th>
                                    <th>
                                        {useTranslation("Field groups")}
                                    </th>
                                    <th>
                                        {useTranslation("Actions")}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                    {data.records && data.records.map((record) => {
                                        if(!isElementHidden(record.slug, metaTypes.TAXONOMY)){
                                            return (
                                                <TaxonomyListElement
                                                    key={record.id}
                                                    record={record}
                                                    page={page}
                                                    perPage={perPage}
                                                />
                                            );
                                        }
                                    })}
                                </tbody>
                                {totalPages > 1 && (
                                    <tfoot>
                                    <tr>
                                        <td colSpan={6}>
                                            <Pagination
                                                currentPage={page ? parseInt(page) : 1}
                                                totalPages={totalPages}
                                                baseLink="/taxonomies"
                                            />
                                        </td>
                                    </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>
                    ) : (
                        <Alert style={styleVariants.SECONDARY}>
                            {useTranslation("No taxonomies found.")} <Link to="/register_taxonomy">{useTranslation("Register the first one")}</Link>!
                        </Alert>
                    )}
                </Layout>
            </form>
        </FormProvider>
    );
};

TaxonomyList.propTypes = {};

export default TaxonomyList;