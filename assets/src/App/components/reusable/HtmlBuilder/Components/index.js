import React from "react";
import {Element} from "@craftjs/core";
import {Heading} from "./User/Heading";
import {WYSIWYGEditor} from "./User/WYSIWYGEditor";
import {Table} from "./User/Table";
import {Image} from "./User/Image";
import {Video} from "./User/Video";
import {Div} from "./User/Div";
import {Map} from "./User/Map";
import {Link} from "./User/Link";
import {CustomIcon} from "./User/CustomIcon";
import {Row} from "./User/Row";
import {ColumnOneHalf} from "./User/ColumnOneHalf";
import {ColumnOneThird} from "./User/ColumnOneThird";
import {ColumnTwoThirds} from "./User/ColumnTwoThirds";
import {ColumnOneFourth} from "./User/ColumnOneFourth";
import {ColumnThreeFourths} from "./User/ColumnThreeFourths";
import {ColumnFull} from "./User/ColumnFull";
import {WPTitle} from "./User/WPTitle";
import {WPThumbnail} from "./User/WPThumbnail";
import {WPExcerpt} from "./User/WPExcerpt";
import {WPContent} from "./User/WPContent";
import {WPDate} from "./User/WPDate";
import {WPAuthor} from "./User/WPAuthor";
import {ACPTMetaField} from "./User/ACPTMetaField";
import {WPPermalink} from "./User/WPPermalink";
import {TextEditor} from "./User/TextEditor";
import {likeThat} from "../../../../utils/strings";
import {
    ADDRESS,
    COLOR,
    CURRENCY,
    DATE,
    EDITOR,
    EMAIL,
    EMBED,
    FILE,
    GALLERY,
    HTML,
    IMAGE,
    LIST,
    NUMBER,
    PHONE,
    POST,
    SELECT,
    SELECT_MULTI,
    TEXT,
    TEXTAREA,
    TOGGLE,
    URL,
    VIDEO
} from "../../../../constants/fields";
import {WPSidebar} from "./User/WPSidebar";
import {ACPTBreadcrumbs} from "./User/ACPTBreadcrumbs";
import {WPPrevNext} from "./User/WPPrevNext";
import {WPTaxonomy} from "./User/WPTaxonomy";

/**
 * Components list for HTML Builder
 *
 * @param postId
 * @param postMeta
 * @param searchTerm
 * @param sidebars
 * @param headersAndFooters
 * @return {[{elements: ({component: *, icon: string, name: string}|{component: *, icon: string, name: string}|{component: *, icon: string, name: string}|{component: *, icon: string, name: string}|{component: *, icon: string, name: string})[], group: string}, {elements: ({component: *, icon: string, name: string}|{component: *, icon: string, name: string}|{component: *, icon: string, name: string}|{component: *, icon: string, name: string}|{component: *, icon: string, name: string})[], group: string}, {elements: [{component, icon: string, name: string}, {component, icon: string, name: string}], group: string}, {elements: [{component, icon: string, name: string}, {component, icon: string, name: string}], group: string}]}
 */
export const getComponents = (postId, postMeta, searchTerm, sidebars, headersAndFooters) => {

    let components = [
        {
            group: "Basic",
            elements: [
                {
                    icon: "bx:bx-heading",
                    name: "Title",
                    visible: ['archive','single'],
                    component: <Heading />
                },
                {
                    icon: "bx:bx-text",
                    name: "Text",
                    visible: ['archive','single'],
                    component: <TextEditor />
                },
                {
                    icon: "ic:baseline-wysiwyg",
                    name: "WYSIWYG Editor",
                    visible: ['archive','single'],
                    component: <WYSIWYGEditor text="<p>Your text here.</p>" />
                },
                {
                    icon: "bx:bx-table",
                    name: "Table",
                    visible: ['archive','single'],
                    component: <Table columns={2} rows={2} />
                },
                {
                    icon: "bx:bx-image",
                    name: "Image",
                    visible: ['archive','single'],
                    component: <Image width="300px" />
                },
                {
                    icon: "bx:bx-video",
                    name: "Video",
                    visible: ['archive','single'],
                    component: <Video width="300px" />
                },
                {
                    icon: "bx:bx-rectangle",
                    name: "Div",
                    visible: ['archive','single'],
                    component: <Element is={Div} canvas />
                },
                {
                    icon: "bx:bx-link",
                    name: "Link",
                    visible: ['archive','single'],
                    component: <Link />
                },
                {
                    icon: "bx:bx-map",
                    name: "Map",
                    visible: ['archive','single'],
                    component: <Map />
                },
                {
                    icon: "bx:bx-star",
                    name: "Icon",
                    visible: ['archive','single'],
                    component: <CustomIcon />
                },
            ]
        },
        {
            group: "Layout",
            elements: [
                {
                    icon: "bx:bx-columns",
                    name: "Row",
                    visible: ['archive','single'],
                    component: <Element is={Row} canvas/>
                },
                {
                    icon: "bx:bx-columns",
                    name: "Column full",
                    visible: ['archive','single'],
                    component: <Element is={ColumnFull} canvas/>
                },
                {
                    icon: "bx:bx-columns",
                    name: "Column 1/2",
                    visible: ['archive','single'],
                    component: <Element is={ColumnOneHalf} canvas/>
                },
                {
                    icon: "bx:bx-columns",
                    name: "Column 1/3",
                    visible: ['archive','single'],
                    component: <Element is={ColumnOneThird} canvas/>
                },
                {
                    icon: "bx:bx-columns",
                    name: "Column 2/3",
                    visible: ['archive','single'],
                    component: <Element is={ColumnTwoThirds} canvas/>
                },
                {
                    icon: "bx:bx-columns",
                    name: "Column 1/4",
                    visible: ['archive','single'],
                    component: <Element is={ColumnOneFourth} canvas/>
                },
                {
                    icon: "bx:bx-columns",
                    name: "Column 3/4",
                    visible: ['archive','single'],
                    component: <Element is={ColumnThreeFourths} canvas/>
                },
            ]
        },
        {
            group: "Wordpress standard fields",
            elements: [
                {
                    icon: "bx:bxl-wordpress",
                    name: "[post-title]",
                    visible: ['archive','single'],
                    component: <WPTitle />
                },
                {
                    icon: "bx:bxl-wordpress",
                    name: "[post-thumbnail]",
                    visible: ['archive','single'],
                    component: <WPThumbnail />
                },
                {
                    icon: "bx:bxl-wordpress",
                    name: "[post-content]",
                    visible: ['archive','single'],
                    component: <WPContent />
                },
                {
                    icon: "bx:bxl-wordpress",
                    name: "[post-excerpt]",
                    visible: ['archive','single'],
                    component: <WPExcerpt />
                },
                {
                    icon: "bx:bxl-wordpress",
                    name: "[post-author]",
                    visible: ['archive','single'],
                    component: <WPAuthor />
                },
                {
                    icon: "bx:bxl-wordpress",
                    name: "[post-date]",
                    visible: ['archive','single'],
                    component: <WPDate />
                },
                {
                    icon: "bx:bxl-wordpress",
                    name: "[post-taxonomy]",
                    visible: ['archive','single'],
                    component: <WPTaxonomy />
                },
                {
                    icon: "bx:bxl-wordpress",
                    name: "[post-permalink]",
                    visible: ['archive'],
                    component: <Element is={WPPermalink} canvas/>
                },
                {
                    icon: "bx:bxl-wordpress",
                    name: "[prev-next links]",
                    visible: ['single'],
                    component: <WPPrevNext />
                },
            ]
        }
    ];

    // Headers & Footers
    // @TODO in the near future
    // let themeHeadersAndFooters = [];
    //
    // headersAndFooters.headers.map((header)=>{
    //     themeHeadersAndFooters.push({
    //         icon: 'fluent:document-header-24-regular',
    //         name: `[${header}]`,
    //         visible: ['archive','single'],
    //         component: <WPHeader  name={header} />
    //     });
    // });
    //
    // headersAndFooters.footers.map((footer)=>{
    //     themeHeadersAndFooters.push({
    //         icon: 'fluent:document-footer-24-regular',
    //         name: `[${footer}]`,
    //         visible: ['archive','single'],
    //         component: <WPFooter  name={footer} />
    //     });
    // });
    //
    // components.push({
    //     group: "Theme\'s headers and footers",
    //     elements: themeHeadersAndFooters
    // });

    // Sidebars
    let registredSidebars = [];

    sidebars.map((sidebar)=>{
        registredSidebars.push({
            icon: 'bx:bxs-widget',
            name: `[${sidebar.name}]`,
            visible: ['archive','single'],
            component: <WPSidebar sidebarId={sidebar.id} sidebarName={sidebar.name} />
        });
    });

    components.push({
        group: "Theme\'s registered widget areas",
        elements: registredSidebars
    });

    // ACPT custom hooks
    components.push({
        group: "ACPT custom hooks",
        elements: [
                {
                    icon: "icon-park-outline:bread",
                    name: "ACPT breadcrumbs",
                    visible: ['archive','single'],
                    component: <ACPTBreadcrumbs />
                }
            ]
        }
    );

    // ACPT meta fields
    let fields = [];

    postMeta.map((box) => {
        box.fields.map((field)=> {

            let icon = 'code-alt';

            switch (field.type) {
                case ADDRESS:
                    icon = "bx:bx-map";
                    break;

                case COLOR:
                    icon = "bx:bx-color-fill";
                    break;

                case CURRENCY:
                    icon = "bx:bx-euro";
                    break;

                case DATE:
                    icon = "bx:bx-calendar";
                    break;

                case EDITOR:
                    icon = "bx:bx-font-color";
                    break;

                case EMAIL:
                    icon = "bx:bx-envelope";
                    break;

                case NUMBER:
                    icon = "bx:bx-list-ol";
                    break;

                case PHONE:
                    icon = "bx:bx-phone";
                    break;

                case TEXT:
                    icon = "bx:bx-text";
                    break;

                case TEXTAREA:
                    icon = "bx:bx-pen";
                    break;

                case LIST:
                    icon = "bx:bx-list-ul";
                    break;

                case HTML:
                    icon = "bx:bx-code-alt";
                    break;

                case URL:
                    icon = "bx:bx-link";
                    break;

                case SELECT:
                    icon = "bx:bx-select";
                    break;

                case SELECT_MULTI:
                    icon = "bx:bx-select-multiple";
                    break;

                case TOGGLE:
                    icon = "bx:bx-toggle";
                    break;

                case EMBED:
                    icon = "bx:bx-extension";
                    break;

                case FILE:
                    icon = "bx:bx-cloud-upload";
                    break;

                case GALLERY:
                    icon = "bx:bx-images";
                    break;

                case IMAGE:
                    icon = "bx:bx-image";
                    break;

                case VIDEO:
                    icon = "bx:bx-video";
                    break;

                case POST:
                    icon = "bx:bx-repost";
                    break;
            }

            fields.push({
                icon: icon,
                name: `[${field.db_name}]`,
                visible: ['archive','single'],
                component: <ACPTMetaField postId={postId} box={box.title} field={field.name} type={field.type} />
            });
        });
    });

    components.push({
        group: "ACPT Meta fields",
        elements: fields
    });

    if (searchTerm !== '') {
        return components.map((element) => {
            return {...element, elements: element.elements.filter((subElement) => likeThat(subElement.name, searchTerm) )};
        });
    }

    return components;
};
