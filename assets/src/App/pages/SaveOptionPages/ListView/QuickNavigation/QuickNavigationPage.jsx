import React, {useState} from "react";
import PropTypes from 'prop-types';
import {Icon} from "@iconify/react";
import {useFormContext, useWatch} from "react-hook-form";
import {scrollToId} from "../../../../utils/scroll";
import {styleVariants} from "../../../../constants/styles";
import Badge from "../../../../components/Badge";

const QuickNavigationPage = ({index, parentPageIndex, page}) => {

    /**
     *
     * @return {string}
     */
    const formId = () => {
        if(page.parentId){
            return `pages.${parentPageIndex}.children.${index}.menuTitle`;
        }

        return `pages.${index}.menuTitle`;
    };

    const { control } = useFormContext();
    const watchedPageName = useWatch({
        control,
        name: formId()
    });

    const documentGlobals = document.globals;
    const globals = documentGlobals.globals;

    const [isClosed, setIsClosed] = useState(false);

    if(page.parentId){
        return (
            <div className="tree-el flex-between s-8" style={{"--level": 0}}>
                <span
                    className="text-ellipsis cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId(`lazy-${page.id}`);
                    }}
                >
                    {watchedPageName ? watchedPageName : page.menuTitle}
                </span>
                <Badge style={styleVariants.SECONDARY}>
                    C
                </Badge>
            </div>
        );
    }

    return (
        <div key={page.id} className="b-rounded with-shadow bg-white p-24">
            <h3 className={`${(!isClosed && page.children && page.children.length > 0) ? 'mb-24' : ''} flex-between s-8`}>
                <span className="cursor-pointer top-2" onClick={() => setIsClosed(!isClosed)}>
                    <Icon width={18} icon={!isClosed ? 'bx:chevron-down' : 'bx:chevron-up'} color="#777" />
                </span>
                <span
                    className="text-ellipsis cursor-pointer"
                    onClick={(e) => {
                        e.preventDefault();
                        scrollToId(`lazy-${page.id}`);
                    }}
                >
                    {watchedPageName ? watchedPageName : page.menuTitle}
                </span>
            </h3>
            {!isClosed && page.children && page.children.length > 0 && (
                <div className={`tree ${globals.is_rtl === true ? `rtl` : ``}`}>
                    {page.children.map((child, childIndex) => (
                        <React.Fragment>
                            <QuickNavigationPage
                                page={child}
                                parentPageIndex={index}
                                index={childIndex}
                            />
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

QuickNavigationPage.propTypes = {
    index: PropTypes.number.isRequired,
    parentPageIndex: PropTypes.number,
    page: PropTypes.object.isRequired
};

export default QuickNavigationPage;