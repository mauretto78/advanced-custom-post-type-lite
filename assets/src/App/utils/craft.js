import React from "react";
import {Element} from "@craftjs/core";
import {craftJsResolvers} from "../constants/resolvers";
import {compressJson, decompressJson} from "./json";
import {getIcon} from "@iconify/react";
import {WYSIWYGEditor} from "../components/reusable/HtmlBuilder/Components/User/WYSIWYGEditor";
import {hexToRGB} from "./colors";
import {addSlashes, squaresToString} from "./strings";

/**
 * Deserialize a compressed json from craft.js
 * into a list of Node elements
 *
 * @param compressedJson
 * @return {*}
 */
export const deserializeCraftJson = (compressedJson) => {

    if(compressedJson === '' || compressedJson === null){
        return null;
    }

    const decompressedJson = JSON.parse(decompressJson(compressedJson));

    const renderedNodes = [];

    /**
     * Render node
     *
     * @param key
     * @param node
     * @return {null|*}
     */
    const renderNode = (key, node) => {

        if(false === renderedNodes.includes(key)){
            renderedNodes.push(key);
            let componentName = node.type.resolvedName;
            const Component = craftJsResolvers[componentName];

            if(node.isCanvas){
                if(node.nodes.length > 0){
                    return (
                        <Element is={Component} {...node.props} canvas>
                            {node.nodes.map((children)=> {
                                return renderNode(children, decompressedJson[children]);
                            })}
                        </Element>
                    );
                }

                return <Element is={Component} {...node.props} canvas />;
            } else {
                if(node.nodes.length > 0){
                    return (
                        <Component {...node.props}>
                            {node.nodes.length > 0 && node.nodes.map((child)=> {
                                return renderNode(child, decompressedJson[child]);
                            })}
                        </Component>
                    );
                }

                return <Component {...node.props}/>;
            }
        }

        return null;
    };

    return renderNode("ROOT", decompressedJson["ROOT"]);
};

/**
 * Deserialize a compressed json from craft.js
 * into target HTML code (as string)
 *
 * @param compressedJson
 * @return {*}
 */
export const extractHtmlFromCraftJson = (compressedJson) => {

    if(compressedJson === '' || compressedJson === null){
        return null;
    }

    const decompressedJson = JSON.parse(decompressJson(compressedJson));
    const renderedNodes = [];

    const renderStyle = (props) => {

        const generateBoxShadowString = () => {

            if(!props.boxShadow || typeof props.boxShadow === 'undefined'){
                return '';
            }

            if(typeof props.boxShadow.color !== 'undefined' && props.boxShadow.color !== ''){
                return (props.boxShadow.inset ? "inset " : "") + props.boxShadow.shiftRight+"px " +props.boxShadow.shiftDown+"px " +props.boxShadow.blur+"px " +props.boxShadow.spread+"px " +hexToRGB(props.boxShadow.color, props.boxShadow.opacity);
            }

            return '';
        };

        let style = '';

        const margin = (squaresToString(props.margin)) ? squaresToString(props.margin) : '';
        const padding = (squaresToString(props.padding)) ? squaresToString(props.padding) : '';
        const borderRadius = (squaresToString(props.borderRadius)) ? squaresToString(props.borderRadius) : '';

        style += (typeof props.display !== 'undefined') ? "display: " + props.display+";" : '';
        style += (typeof props.gap !== 'undefined') ? "gap: " + props.gap+";" : '';
        style += (typeof props.fontWeight !== 'undefined') ? "font-weight: " + props.fontWeight+";" : '';
        style += (typeof props.fontstyle !== 'undefined') ? "font-style: " + props.fontstyle+";" : '';
        style += (typeof props.textAlign !== 'undefined') ? "text-align: " + props.textAlign+";" : '';
        style += (typeof props.margin !== 'undefined' && props.margin[0] !== null) ? "margin: " + margin +";" : '';
        style += (typeof props.padding !== 'undefined' && props.padding[0] !== null) ? "padding: " + padding +";" : '';
        style += (typeof props.fontSize !== 'undefined') ? "font-size: " + props.fontSize+";" : '';
        style += (typeof props.background !== 'undefined') ? "background: " + props.background+";" : '';
        style += (typeof props.color !== 'undefined') ? "color: " + props.color+";" : '';
        style += (typeof props.borderRadius !== 'undefined' && props.borderRadius[0] !== null) ? "border-radius: " + borderRadius +";" : '';
        style += (typeof props.borderColor !== 'undefined') ? "border-color: " + props.borderColor+";" : '';
        style += (typeof props.borderThickness !== 'undefined') ? "border-style: solid;" : '';
        style += (typeof props.borderThickness !== 'undefined') ? "border-width: " + props.borderThickness+"px;" : '';
        style += (typeof props.width !== 'undefined') ? "width: " + props.width+";" : '';
        style += (typeof props.height !== 'undefined') ? "height: " + props.height+";" : '';
        style += (typeof props.maxWidth !== 'undefined') ? "max-width: " + props.maxWidth+";" : '';
        style += (typeof props.minHeight !== 'undefined') ? "min-height: " + props.minHeight+";" : '';
        style += (typeof props.boxShadow !== 'undefined' && typeof props.boxShadow.color !== 'undefined') ? "box-shadow: " + generateBoxShadowString()+";" : '';

        return style;
    };

    const renderNode = (key, node) => {

        if(false === renderedNodes.includes(key)){
            renderedNodes.push(key);

            const componentName = node.type.resolvedName;
            const children = node.nodes;

            switch (componentName ) {
                case "ACPTBreadcrumbs":

                    const renderBreadcrumbsProps = (props)=>{
                        let breadcrumbsArray = '[';
                        breadcrumbsArray += (typeof props.delimiter !== 'undefined') ? '"delimiter" => "'+props.delimiter+'",' : '"delimiter" => null,';
                        breadcrumbsArray += (typeof props.css !== 'undefined') ? '"css" => "'+props.css+'",' : '"css" => null,';
                        breadcrumbsArray += (typeof props.textAlign !== 'undefined') ? '"textAlign" => "'+props.textAlign+'",' : '"textAlign" => null,';
                        breadcrumbsArray += (typeof props.fontSize !== 'undefined') ? '"fontSize" => "'+props.fontSize+'",' : '"fontSize" => null,';
                        breadcrumbsArray += (typeof props.fontWeight !== 'undefined') ? '"fontWeight" => "'+props.fontWeight+'",' : '"fontWeight" => null,';
                        breadcrumbsArray += (typeof props.fontStyle !== 'undefined') ? '"fontStyle" => "'+props.fontStyle+'",' : '"fontStyle" => null,';
                        breadcrumbsArray += (typeof props.borderThickness !== 'undefined') ? '"borderThickness" => "'+props.borderThickness+'",' : '"borderThickness" => null,';
                        breadcrumbsArray += (typeof props.borderColor !== 'undefined') ? '"borderColor" => "'+props.borderColor+'",' : '"borderColor" => null,';
                        breadcrumbsArray += (typeof props.background !== 'undefined') ? '"background" => "'+props.background+'",' : '"background" => null,';
                        breadcrumbsArray += (typeof props.borderRadius !== 'undefined') ? '"borderRadius" => "'+props.borderRadius+'",' : '"borderRadius" => null,';
                        breadcrumbsArray += (props.margin && typeof props.margin !== 'undefined') ? '"margin" => "'+props.margin.join()+'",' : '"margin" => null,';
                        breadcrumbsArray += (props.padding && typeof props.padding !== 'undefined') ? '"padding" => "'+props.padding.join()+'",' : '"padding" => null,';
                        breadcrumbsArray += ']';

                        return breadcrumbsArray;
                    };

                    return `<?php do_action( 'acpt_breadcrumb', ${renderBreadcrumbsProps(node.props)}); ?>`;

                case "ACPTMetaField":
                    return `<?php echo do_shortcode('[acpt box="${node.props.box}" field="${node.props.field}" ${node.props.width ? 'width="'+node.props.width+'"' : ''} ${node.props.height ? 'height="'+node.props.height+'"' : ''} ${node.props.target ? 'target="'+node.props.target+'"' : ''} ${node.props.elements ? 'elements="'+node.props.elements+'"' : ''} ${node.props.dateFormat ? 'date-format="'+node.props.dateFormat+'"' : ''}]'); ?>`;

                case "Button":
                    let button = '<button class="'+node.props.css+'" style="font-family: inherit;'+renderStyle(node.props)+'">';
                    button += node.props.text;
                    button += '</button>';

                    return button;

                case "ColumnFull":
                    let columnFull = '<div class="acpt-col-md-12" style="'+renderStyle(node.props)+'">';

                    children.length > 0 && children.map((child)=> {
                        columnFull += renderNode(child, decompressedJson[child]);
                    });

                    columnFull += '</div>';

                    return columnFull;

                case "ColumnOneFourth":
                    let columnOneFourth = '<div class="acpt-col-md-3" style="'+renderStyle(node.props)+'">';

                    children.length > 0 && children.map((child)=> {
                        columnOneFourth += renderNode(child, decompressedJson[child]);
                    });

                    columnOneFourth += '</div>';

                    return columnOneFourth;

                case "ColumnOneHalf":
                    let columnOneHalf = '<div class="acpt-col-md-6" style="'+renderStyle(node.props)+'">';

                    children.length > 0 && children.map((child)=> {
                        columnOneHalf += renderNode(child, decompressedJson[child]);
                    });

                    columnOneHalf += '</div>';

                    return columnOneHalf;

                case "ColumnOneThird":
                    let columnOneThird = '<div class="acpt-col-md-4" style="'+renderStyle(node.props)+'">';

                    children.length > 0 && children.map((child)=> {
                        columnOneThird += renderNode(child, decompressedJson[child]);
                    });

                    columnOneThird += '</div>';

                    return columnOneThird;

                case "ColumnThreeFourths":
                    let columnThreeFourths = '<div class="acpt-col-md-9" style="'+renderStyle(node.props)+'">';

                    children.length > 0 && children.map((child)=> {
                        columnThreeFourths += renderNode(child, decompressedJson[child]);
                    });

                    columnThreeFourths += '</div>';

                    return columnThreeFourths;

                case "ColumnTwoThirds":
                    let columnTwoThirds = '<div class="acpt-col-md-8" style="'+renderStyle(node.props)+'">';

                    children.length > 0 && children.map((child)=> {
                        columnTwoThirds += renderNode(child, decompressedJson[child]);
                    });

                    columnTwoThirds += '</div>';

                    return columnTwoThirds;

                case "Container":
                    let containerClass = (node.props.css) ? node.props.css : '';
                    let container = '<div class="acpt-container '+containerClass+'" style="'+renderStyle(node.props)+'">';

                    children.length > 0 && children.map((child)=> {
                        container += renderNode(child, decompressedJson[child]);
                    });

                    container += '</div>';

                    return container;

                case "CustomIcon":

                    const iconify = getIcon(node.props.icon);
                    const width = (typeof node.props.fontSize !== 'undefined') ? ' width="'+node.props.fontSize+'"' : 'width="16px"';
                    const height= (typeof node.props.fontSize !== 'undefined') ? ' height="'+node.props.fontSize+'"' : 'height="16px"';

                    let icon = '<span style="display: inline-flex; align-content: center; justify-content: center; '+renderStyle(node.props)+'">';
                    icon += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" '+width+' '+height+' preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="color: '+node.props.color+'">';
                    icon += iconify.body;
                    icon += '</svg>';
                    icon += '</span>';

                    return  icon;

                case "Div":
                    let div = '<div style="'+renderStyle(node.props)+'"';
                    div += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    div += '>';

                    children.length > 0 && children.map((child)=> {
                        div += renderNode(child, decompressedJson[child]);
                    });

                    div += '</div>';

                    return div;

                case "Heading":
                    const level = node.props.level ? node.props.level : 'h1';
                    let heading = '<'+level+' style="'+renderStyle(node.props)+'"';
                    heading += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    heading += '>';
                    heading += node.props.text;
                    heading += '</'+level+'>';

                    return heading;

                case "Image":

                    if(typeof node.props.url === 'undefined' || node.props.url === ''){
                        return '<div class="img-placeholder" style="'+renderStyle(node.props)+'"><span class="icon iconify" data-icon="bx:bx-image-alt" data-width="48" data-height="48"></span></div>';
                    }

                    let image = '<img';
                    image += ' style="object-fit: cover;'+renderStyle(node.props)+'"';
                    image += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    image += (node.props.alt) ? ' alt="'+node.props.alt+'"' : '';
                    image += (node.props.width) ? ' width="'+node.props.width+'"' : '';
                    image += (node.props.height) ? ' height="'+node.props.height+'"' : '';
                    image += ' src="'+node.props.url+'"';
                    image += ' />';

                    return image;

                case "Link":

                    const linkHref = (typeof node.props.href !== 'undefined') ? node.props.href : '#';

                    let link = '<a';
                    link += ' style="'+renderStyle(node.props)+'"';
                    link += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    link += (node.props.target) ? ' target="'+node.props.target+'"' : '';
                    link += ' href="'+linkHref+'"';
                    link += '>';

                    if(node.props.icon !== null && typeof node.props.icon !== 'undefined'){

                        const linkWidth = (typeof node.props.fontSize !== 'undefined') ? ' width="'+node.props.fontSize+'"' : ' width="16px"';
                        const linkHeight = (typeof node.props.fontSize !== 'undefined') ? ' height="'+node.props.fontSize+'"' : ' height="16px"';
                        const linkColor = (typeof node.props.color !== 'undefined') ? node.props.color : '#00c39a';

                        const linkIconify = getIcon(node.props.icon);
                        link += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--bx" '+linkWidth+' '+linkHeight+' preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="display: inline-block; margin-right: 4px; position: relative; top: -2px; color: '+linkColor+'">';
                        link += linkIconify.body;
                        link += '</svg>';
                    }

                    link += node.props.text;
                    link += '</a>';

                    return link;

                case "Map":
                    let map = '<iframe';
                    map += ' style="'+renderStyle(node.props)+'"';
                    map += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    map += (node.props.width) ? ' width="'+node.props.width+'"' : '';
                    map += (node.props.height) ? ' height="'+node.props.height+'"' : '';
                    map += ' src="https://maps.google.com/maps?q='+node.props.address+'&t=&z='+node.props.zoom+'&ie=UTF8&iwloc=&output=embed"';
                    map += ' frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"/>';

                    return map;

                case "Row":
                    let row = '<div class="acpt-row" style="'+renderStyle(node.props)+'">';

                    children.length > 0 && children.map((child)=> {
                        row += renderNode(child, decompressedJson[child]);
                    });

                    row += '</div>';

                    return row;

                case "Table":
                    let table = '<table style="border-collapse: collapse; '+renderStyle(node.props)+'">';

                    const borderStyle = (node.props.border === 'border-all' || node.props.border === 'border-inner') ? node.props.borderThickness+"px solid " + node.props.borderColor : '';

                    if(node.props.withHeading){
                        table += '<tr>';

                        for ( let h=0; h < node.props.columns; h++ ){
                            table += '<th style="padding: 5px; border: '+borderStyle+'">'+node.props.text.heading[h]+'</th>';
                        }

                        table += '</tr>';
                    }

                    for ( let r=0; r < node.props.rows; r++ ){
                        table += '<tr>';

                        for ( let h=0; h < node.props.columns; h++ ){
                            table += '<td style="padding: 5px; border: '+borderStyle+'">'+node.props.text.body[r][h]+'</td>';
                        }

                        table += '</tr>';
                    }

                    table += '</table>';

                    return table;

                case "TextEditor":
                    const tag = node.props.tag ? node.props.tag : 'p';
                    let text = '<'+tag+' style="'+renderStyle(node.props)+'"';
                    text += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    text += '>';
                    text += '<?php echo do_shortcode("'+addSlashes(node.props.text)+'"); ?>';
                    text += '</'+tag+'>';

                    return text;

                case "WYSIWYGEditor":
                    let WYSIWYGEditor = '<div style="'+renderStyle(node.props)+'">';
                    WYSIWYGEditor += node.props.text;
                    WYSIWYGEditor += '</div>';

                    return WYSIWYGEditor;

                case "Video":
                    let video = '<video controls';
                    video += ' style="'+renderStyle(node.props)+'"';
                    video += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    video += (node.props.width) ? ' width="'+node.props.width+'"' : '';
                    video += (node.props.height) ? ' height="'+node.props.height+'"' : '';
                    video += '>';
                    video += '<source src="'+node.props.url+'" type="video/mp4"/>';
                    video += '</video>';

                    return video;

                case "WPAuthor":
                    let wpAuthor = '<div style="'+renderStyle(node.props)+'">';
                    wpAuthor += '<?php echo get_the_author(); ?>';
                    wpAuthor += '</div>';

                    return wpAuthor;

                case "WPContent":
                    let wpContent = '<div style="'+renderStyle(node.props)+'">';
                    wpContent += '<?php echo do_shortcode($post->post_content); ?>';
                    wpContent += '</div>';

                    return wpContent;

                case "WPDate":
                    let wpDate = '<div style="'+renderStyle(node.props)+'">';
                    wpDate += '<?php echo get_the_date('+node.props.format+'); ?>';
                    wpDate += '</div>';

                    return wpDate;

                case "WPExcerpt":
                    let wpExcerpt = '<div style="'+renderStyle(node.props)+'">';
                    wpExcerpt += '<?php echo get_the_excerpt($post); ?>';
                    wpExcerpt += '</div>';

                    return wpExcerpt;

                case "WPPermalink":
                    let wpPermalink = '<a target="'+node.props.target+'" href="<?php echo get_the_permalink(); ?>">';
                    children.length > 0 && children.map((child)=> {
                        wpPermalink += renderNode(child, decompressedJson[child]);
                    });
                    wpPermalink += '</a>';

                    return wpPermalink;

                case 'WPPostLoop':
                    let grid = '<div class="acpt-grid col-'+node.props.perRow+'" style="'+renderStyle(node.props)+'"';
                    grid += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    grid += '>';

                    grid += '<?php ';
                    grid += 'global $post;';

                    const sortOrder = (node.props.sortOrder !== null && typeof node.props.sortOrder !== 'undefined') ? node.props.sortOrder : 'ASC';
                    const sortBy = (node.props.sortBy !== null && typeof node.props.sortBy !== 'undefined') ? '"'+node.props.sortBy+'"' : null;

                    grid += "$loop = (new ACPT\\Admin\\Hooks())->loop(['postType' => $post->post_type, 'perPage' => '"+node.props.perPage+"', 'sortBy' => "+sortBy+" , 'sortOrder' => '"+sortOrder+"']);";
                    grid += '?>';

                    if(children.length > 0){

                        grid += '<?php ';
                        grid += 'while ($loop->have_posts()) { $loop->the_post();';
                        grid += '?>';

                        children.map((child) => {
                            grid += renderNode(child, decompressedJson[child]);
                        });

                        grid += '<?php } ?>';
                    }

                    grid += '<?php wp_reset_query(); ?>';
                    grid += '</div>';

                    grid += "<?php do_action( 'acpt_archive_pagination', "+node.props.perPage+" ); ?>";

                    return grid;

                case "WPPost":
                    let post = '<div style="'+renderStyle(node.props)+'"';
                    post += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    post += '>';

                    children.length > 0 && children.map((child)=> {
                        post += renderNode(child, decompressedJson[child]);
                    });

                    post += '</div>';

                    return post;

                case "WPPrevNext":
                    const renderWPPrevNextProps = (props)=>{
                        let renderWPPrevNextProps = '[';
                        renderWPPrevNextProps += (typeof props.css !== 'undefined') ? '"css" => "'+props.css+'",' : '"css" => null,';
                        renderWPPrevNextProps += (typeof props.color !== 'undefined') ? '"color" => "'+props.color+'",' : '"color" => null,';
                        renderWPPrevNextProps += (typeof props.borderThickness !== 'undefined') ? '"borderThickness" => "'+props.borderThickness+'",' : '"borderThickness" => null,';
                        renderWPPrevNextProps += (typeof props.borderColor !== 'undefined') ? '"borderColor" => "'+props.borderColor+'",' : '"borderColor" => null,';
                        renderWPPrevNextProps += (typeof props.background !== 'undefined') ? '"background" => "'+props.background+'",' : '"background" => null,';
                        renderWPPrevNextProps += (typeof props.borderRadius !== 'undefined') ? '"borderRadius" => "'+props.borderRadius+'",' : '"borderRadius" => null,';
                        renderWPPrevNextProps += (props.margin && typeof props.margin !== 'undefined') ? '"margin" => "'+props.margin.join()+'",' : '"margin" => null,';
                        renderWPPrevNextProps += (props.padding && typeof props.padding !== 'undefined') ? '"padding" => "'+props.padding.join()+'",' : '"padding" => null,';
                        renderWPPrevNextProps += ']';

                        return renderWPPrevNextProps;
                    };

                    return `<?php do_action( 'acpt_prev_next_links', ${renderWPPrevNextProps(node.props)}); ?>`;

                case "WPSidebar":
                    return '<?php dynamic_sidebar("'+node.props.sidebarName+'"); ?>';

                case "WPTaxonomy":
                    let renderWPTaxonomyProps = '[';
                    renderWPTaxonomyProps += (typeof node.props.css !== 'undefined') ? '"css" => "'+node.props.css+'",' : '"css" => null,';
                    renderWPTaxonomyProps += (node.props.fontSize && typeof props.fontSize !== 'undefined') ? '"fontSize" => "'+node.props.fontSize+'",' : '"fontSize" => null,';
                    renderWPTaxonomyProps += (node.props.margin && typeof props.margin !== 'undefined') ? '"margin" => "'+node.props.margin.join()+'",' : '"margin" => null,';
                    renderWPTaxonomyProps += (node.props.padding && typeof node.props.padding !== 'undefined') ? '"padding" => "'+node.props.padding.join()+'",' : '"padding" => null,';
                    renderWPTaxonomyProps += (node.props.delimiter && typeof node.props.delimiter !== 'undefined') ? '"delimiter" => "'+node.props.delimiter+'",' : '"delimiter" => null,';
                    renderWPTaxonomyProps += ']';

                    return "<?php do_action( 'acpt_taxonomy_links', "+renderWPTaxonomyProps+" ); ?>";

                case "WPThumbnail":
                    let wpThumbnail = '<div style="'+renderStyle(node.props)+'">';

                    const w = (typeof node.props.width !== 'undefined' && node.props.width) ? node.props.width : 'null';
                    const h = (typeof node.props.height !== 'undefined' && node.props.height) ? node.props.height : 'null';

                    wpThumbnail += '<?php do_action("acpt_thumbnail", ["w" => "'+w+'", "h" => "'+h+'"]); ?>';
                    wpThumbnail += '</div>';

                    return wpThumbnail;

                case "WPTitle":
                    const wpLevel = node.props.level ? node.props.level : 'h1';
                    let wpTitle = '<'+wpLevel+' style="'+renderStyle(node.props)+'"';
                    wpTitle += (node.props.css) ? ' class="'+node.props.css+'"' : '';
                    wpTitle += '>';
                    wpTitle += '<?php echo get_the_title(); ?>';
                    wpTitle += '</'+wpLevel+'>';

                    return wpTitle;
            }
        }

        return null;
    };

    let html = '';

    for(let key in decompressedJson){
        if(decompressedJson.hasOwnProperty(key)){
            const node = decompressedJson[key];
            const renderedNode = renderNode(key, node);

            if(renderedNode !== null){
                html += renderedNode;
            }
        }
    }

    return html;
};

/**
 * Serialize a json from craft.js
 *
 * @param json
 * @return {string}
 */
export const serializeCraftJson = (json) => {
    return compressJson(json);
};