import {metaTypes} from "../../../../constants/metaTypes";
import {fetchFindFromBelongsTo, fetchMetaFieldsFromBelongsTo} from "../utils/functions";
import useTranslation from "../../../../hooks/useTranslation";

export const addTraits = ( editor) => {
    
    const domc = editor.DomComponents;

    const surroundingTags = [
        { id: 'h1', name: 'h1'},
        { id: 'h2', name: 'h2'},
        { id: 'h3', name: 'h3'},
        { id: 'h4', name: 'h4'},
        { id: 'p', name: 'p'},
        { id: 'span', name: 'span'},
        { id: 'div', name: 'div'},
    ];

    const styles = {
        wp: ``,
        wc: `color: #8155b0;`,
        acpt: `color: #00c39b;`,
        theme: `background: #f0f0f1;
                border: 1px solid #c3c4c7;
                border-radius: 2px;
                padding: 10px;
                color: #3c434a;
                text-align: center;
                font-size: 14px;
                font-family: 'Monaco', monospace;
                `,
    };

    // Basics
    domc.addType('div', {
        model: {
            defaults: {
                id: 'div',
                tagName: 'div',
                removable: true,
                draggable: true,
                stylable: true,
                highlightable: true,
                selectable: true,
                editable: true,
                components: [
                    `<div>${useTranslation("Drag your component(s) here")}</div>`
                ],
            }
        },
    });

    // Theme element
    domc.addType('theme-el', {
        model: {
            defaults: {
                tagName: 'div',
            }
        },
        view: {
            onRender() {
                const { model, el } = this;
                el.setAttribute('style', styles.theme);
            }
        }
    });

    // WooCommerce containers
    domc.addType('wp-before-main-content', {
        model: {
            defaults: {
                id: 'wp-before-main-content',
                tagName: 'wp-before-main-content',
                removable: true,
                draggable: true,
                stylable: true,
                highlightable: true,
                selectable: true,
                editable: true,
                components: [
                    `<p>${useTranslation("Drag your loop component(s) here")}</p>`
                ],
            }
        }
    });

    domc.addType('wc-before-product-summary', {
        model: {
            defaults: {
                id: 'wc-before-product-summary',
                tagName: 'wc-before-product-summary',
                removable: true,
                draggable: true,
                stylable: true,
                highlightable: true,
                selectable: true,
                editable: true,
                components: [
                    `<p>${useTranslation("Drag your loop component(s) here")}</p>`
                ],
            }
        }
    });

    domc.addType('wc-product-summary', {
        model: {
            defaults: {
                id: 'wc-product-summary',
                tagName: 'wc-product-summary',
                removable: true,
                draggable: true,
                stylable: true,
                highlightable: true,
                selectable: true,
                editable: true,
                components: [
                    `<p>${useTranslation("Drag your loop component(s) here")}</p>`
                ],
            }
        }
    });

    domc.addType('wc-after-product-summary', {
        model: {
            defaults: {
                id: 'wc-after-product-summary',
                tagName: 'wc-after-product-summary',
                removable: true,
                draggable: true,
                stylable: true,
                highlightable: true,
                selectable: true,
                editable: true,
                components: [
                    `<p>${useTranslation("Drag your loop component(s) here")}</p>`
                ],
            }
        }
    });

    // WooCommerce element
    domc.addType('wc-el', {
        model: {
            defaults: {
                tagName: 'span',
                textable: true,
                traits: [
                    {
                        type: "text",
                        label: "id",
                        name: "id",
                        placeholder: "12345",
                        changeProp: true,
                    },
                    {
                        type: "text",
                        label: "title",
                        name: "title",
                        placeholder: useTranslation(useTranslation("eg. Text here")),
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        label: 'Surrounding tag',
                        name: 'tag',
                        changeProp: true,
                        options: surroundingTags,
                    },
                ]
            },
            init() {
                this.on('change:id', this.handleIdChange);
                this.on('change:title', this.handleTitleChange);
                this.on('change:tag', this.handleTagChange);
            },
            handleIdChange() {
                this.setAttributes({id: this.changed.id});
            },
            handleTitleChange() {
                this.setAttributes({title: this.changed.title});
            },
            handleTagChange() {
                this.set("tagName", this.changed.tag);
            },
        },
        view: {
            onRender() {
                const { model, el } = this;

                el.setAttribute('style', styles.wc);
            }
        }
    });

    // WP elements
    domc.addType('wp-el', {
        model: {
            defaults: {
                tagName: 'span',
                textable: true,
                traits: [
                    {
                        type: "text",
                        label: "id",
                        name: "id",
                        placeholder: "12345",
                        changeProp: true,
                    },
                    {
                        type: "text",
                        label: "title",
                        name: "title",
                        placeholder: useTranslation(useTranslation("eg. Text here")),
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        label: 'Surrounding tag',
                        name: 'tag',
                        changeProp: true,
                        options: surroundingTags,
                    }
                ]
            },
            init() {
                this.on('change:id', this.handleIdChange);
                this.on('change:title', this.handleTitleChange);
                this.on('change:tag', this.handleTagChange);
            },
            handleIdChange() {
                this.setAttributes({id: this.changed.id});
            },
            handleTitleChange() {
                this.setAttributes({title: this.changed.title});
            },
            handleTagChange() {
                this.set("tagName", this.changed.tag);
            },
        },
        view: {
            onRender() {
                const { model, el } = this;
                el.setAttribute('style', styles.wp);
            }
        }
    });

    domc.addType('wp-breadcrumb', {
        model: {
            defaults: {
                tagName: 'div',
                textable: true,
                traits: [
                    {
                        type: "text",
                        label: "id",
                        name: "id",
                        placeholder: "12345",
                        changeProp: true,
                    },
                    {
                        type: "text",
                        label: "title",
                        name: "title",
                        placeholder: useTranslation("eg. Text here"),
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        label: 'Separator',
                        name: 'separator',
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null},
                            {name: "»", id: "raquo"},
                            {name: ">", id: "gt"},
                            {name: "/", id: "/"},
                        ]
                    },
                    {
                        type: 'select',
                        label: 'Surrounding tag',
                        name: 'tag',
                        changeProp: true,
                        options: surroundingTags,
                    },
                ]
            },
            init() {
                this.on('change:id', this.handleIdChange);
                this.on('change:title', this.handleTitleChange);
                this.on('change:separator', this.handleSeparatorChange);
                this.on('change:tag', this.handleTagChange);
            },
            handleIdChange() {
                this.setAttributes({id: this.changed.id});
            },
            handleTitleChange() {
                this.setAttributes({title: this.changed.title});
            },
            handleSeparatorChange() {
                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/separator="[a-zA-Z0-9;&>»\-\/.\s+]*"/i, "");

                if(this.changed.separator !== "null"){
                    newContent = `{{${newContent} separator="${this.changed.separator}"}}`;
                } else {
                    newContent = `{{${newContent}}}`;
                }

                this.set("content", newContent.trim());
            },
            handleTagChange() {
                this.set("tagName", this.changed.tag);
            },
        },
        view: {
            onRender() {
                const { model, el } = this;
                el.setAttribute('style', styles.wp);
            }
        }
    });

    domc.addType('acpt-loop', {
        model: {
            defaults: {
                id: 'acpt-loop',
                attributes: {
                    type: '',
                    find: '',
                    order_by: 'date',
                    sort_by: 'ASC',
                    per_page: 12,
                    per_row: 3
                },
                tagName: 'acpt-loop',
                removable: true,
                draggable: true,
                stylable: true,
                highlightable: true,
                selectable: true,
                editable: true,
                components: [
                    `<p>${useTranslation("Drag your loop component(s) here")}</p>`
                ],
                traits: [
                    {
                        type: 'select',
                        label: 'Condition',
                        name: 'belongs_to',
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null},
                            {name: "custom post type", id: metaTypes.CUSTOM_POST_TYPE},
                            {name: "taxonomy", id: metaTypes.TAXONOMY},
                            {name: "repeater meta field", id: "meta_field"},
                            {name: "flexible field block", id: "flex_block"},
                        ]
                    },
                    {
                        type: 'select',
                        label: useTranslation('Condition value'),
                        name: 'find',
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null}
                        ]
                    },
                    {
                        type: 'number',
                        label: useTranslation('Elements per page'),
                        name: 'per_page',
                        default: 12,
                        min: 1,
                        max: 20,
                        step: 1,
                        changeProp: true
                    },
                    {
                        type: 'number',
                        label: useTranslation('Elements per row'),
                        name: 'per_row',
                        default: 3,
                        min: 1,
                        max: 6,
                        step: 1,
                        changeProp: true
                    },
                    {
                        type: 'text',
                        label: useTranslation('No records message'),
                        name: 'no_records',
                        default: useTranslation('Sorry, no posts matched your criteria.'),
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        label: useTranslation('Show pagination'),
                        name: 'pagination',
                        changeProp: true,
                        options: [
                            {name: useTranslation("Yes"), id: 1},
                            {name: useTranslation("No"), id: 0},
                        ]
                    },
                    {
                        type: 'select',
                        label: 'Order by',
                        name: useTranslation('order_by'),
                        changeProp: true,
                        options: []
                    },
                    {
                        type: 'select',
                        label: 'Sort by',
                        name: 'sort_by',
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null},
                            {name: useTranslation("ASC"), id: "ASC"},
                            {name: useTranslation("DESC"), id: "DESC"},
                        ]
                    }
                ],
            },
            async init() {

                this.listenTo(this, 'change:belongs_to', this.handleBelongsToChange);
                this.listenTo(this, 'change:find', this.handleFindChange);

                const belongsTo = this.attributes.belongs_to;
                const find = this.attributes.find;

                if(typeof belongsTo !== 'undefined'){
                    const findOptions = await fetchFindFromBelongsTo(belongsTo);

                    this.updateTrait("find", {
                        options: findOptions
                    });

                    if(typeof find !== 'undefined'){
                        const orderByOptions = await fetchMetaFieldsFromBelongsTo(belongsTo, find);

                        this.updateTrait("order_by", {
                            options: orderByOptions
                        });
                    }
                }

                this.on('change:pagination', this.handlePaginationChange);
                this.on('change:no_records', this.handleNoRecordsChange);
                this.on('change:per_page', this.handlePerPageChange);
                this.on('change:per_row', this.handlePerRowChange);
                this.on('change:order_by', this.handleOrderByChange);
                this.on('change:sort_by', this.handleSortByChange);
            },
            async handleBelongsToChange() {

                const newBelongsTo = this.changed.belongs_to;
                const findOptions = await fetchFindFromBelongsTo(newBelongsTo);

                if(newBelongsTo === metaTypes.CUSTOM_POST_TYPE){
                    this.set('tagName', 'acpt-loop');
                } else if(newBelongsTo === metaTypes.TAXONOMY){
                    this.set('tagName', 'acpt-tax-loop');
                } else if(newBelongsTo === 'meta_field'){
                    this.set('tagName', 'acpt-field-loop');
                } else if(newBelongsTo === 'flex_block'){
                    this.set('tagName', 'acpt-block-loop');
                }

                this.updateTrait("find", {
                    options: findOptions
                });

                this.setAttributes({
                    belongs_to: newBelongsTo,
                    find: this.attributes.find,
                    pagination: this.attributes.pagination,
                    per_page: this.attributes.per_page,
                    per_row: this.attributes.per_row,
                    order_by: this.attributes.order_by,
                    sort_by: this.attributes.sort_by,
                    no_records: this.attributes.no_records,
                });
            },
            async handleFindChange() {

                const belongsTo = this.attributes.belongs_to;
                const newFind = this.changed.find;
                const orderByOptions = await fetchMetaFieldsFromBelongsTo(belongsTo, newFind);

                this.updateTrait("order_by", {
                    options: orderByOptions
                });

                this.setAttributes({
                    belongs_to: belongsTo,
                    find: newFind,
                    pagination: this.attributes.pagination,
                    per_page: this.attributes.per_page,
                    per_row: this.attributes.per_row,
                    order_by: this.attributes.order_by,
                    sort_by: this.attributes.sort_by,
                    no_records: this.attributes.no_records,
                });
            },
            handlePaginationChange() {
                this.setAttributes({
                    belongs_to: this.attributes.belongs_to,
                    find: this.attributes.find,
                    pagination: this.changed.pagination,
                    per_page: this.attributes.per_page,
                    per_row: this.attributes.per_row,
                    order_by: this.attributes.order_by,
                    sort_by: this.attributes.sort_by,
                    no_records: this.changed.no_records,
                });
            },
            handleNoRecordsChange() {
                this.setAttributes({
                    belongs_to: this.attributes.belongs_to,
                    find: this.changed.find,
                    pagination: this.attributes.pagination,
                    per_page: this.attributes.per_page,
                    per_row: this.attributes.per_row,
                    order_by: this.attributes.order_by,
                    sort_by: this.attributes.sort_by,
                    no_records: this.changed.no_records,
                });
            },
            handlePerPageChange() {
                this.setAttributes({
                    belongs_to: this.attributes.belongs_to,
                    find: this.attributes.find,
                    pagination: this.attributes.pagination,
                    per_page: this.changed.per_page,
                    per_row: this.attributes.per_row,
                    order_by: this.attributes.order_by,
                    sort_by: this.attributes.sort_by,
                    no_records: this.attributes.no_records,
                });
            },
            handlePerRowChange() {
                this.setAttributes({
                    belongs_to: this.attributes.belongs_to,
                    find: this.attributes.find,
                    pagination: this.attributes.pagination,
                    per_page: this.attributes.per_page,
                    per_row: this.changed.per_row,
                    order_by: this.attributes.order_by,
                    sort_by: this.attributes.sort_by,
                    no_records: this.attributes.no_records,
                });
            },
            handleOrderByChange() {
                this.setAttributes({
                    belongs_to: this.attributes.belongs_to,
                    find: this.attributes.find,
                    pagination: this.attributes.pagination,
                    per_page: this.attributes.per_page,
                    per_row: this.attributes.per_row,
                    order_by: this.changed.order_by,
                    sort_by: this.attributes.sort_by,
                    no_records: this.attributes.no_records,
                });
            },
            handleSortByChange() {
                this.setAttributes({
                    belongs_to: this.attributes.belongs_to,
                    find: this.attributes.find,
                    pagination: this.attributes.pagination,
                    per_page: this.attributes.per_page,
                    per_row: this.attributes.per_row,
                    order_by: this.attributes.order_by,
                    sort_by: this.changed.sort_by,
                    no_records: this.attributes.no_records,
                });
            },
        }
    });

    domc.addType('wp-permalink', {
        model: {
            defaults: {
                tagName: 'span',
                textable: true,
                traits: [
                    {
                        type: "text",
                        label: "id",
                        name: "id",
                        placeholder: "12345",
                        changeProp: true,
                    },
                    {
                        type: "text",
                        label: "title",
                        name: "title",
                        placeholder: useTranslation("eg. Text here"),
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        label: 'Surrounding tag',
                        name: 'tag',
                        changeProp: true,
                        options: surroundingTags,
                    },
                    {
                        type: 'select',
                        label: 'Link target',
                        name: 'target',
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null},
                            {name: "Opens in a new window or tab", id: "_blank"},
                            {name: "Opens in the same frame as it was clicked", id: "_self"},
                            {name: "Opens in the parent frame", id: "_parent"},
                            {name: "Opens in the full body of the window", id: "_top"},
                        ]
                    },
                    {
                        type: "text",
                        label: "Permalink text",
                        name: "anchor",
                        placeholder: useTranslation("eg. Text here"),
                        changeProp: true,
                    },
                ]
            },
            init() {
                this.on('change:id', this.handleIdChange);
                this.on('change:title', this.handleTitleChange);
                this.on('change:tag', this.handleTagChange);
                this.on('change:target', this.handleTargetChange);
                this.on('change:anchor', this.handleAnchorTextChange);
            },
            handleIdChange() {
                this.setAttributes({id: this.changed.id});
            },
            handleTitleChange() {
                this.setAttributes({title: this.changed.title});
            },
            handleTagChange() {
                this.set("tagName", this.changed.tag);
            },
            handleAnchorTextChange() {
                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/anchor="[a-z_]*"/i, "");

                if(this.changed.anchor !== "null"){
                    newContent = `{{${newContent} anchor="${this.changed.anchor}"}}`;
                } else {
                    newContent = `{{${newContent}}}`;
                }

                this.set("content", newContent.trim());
            },
            handleTargetChange() {

                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/target="[a-z_]*"/i, "");

                if(this.changed.target !== "null"){
                    newContent = `{{${newContent} target="${this.changed.target}"}}`;
                } else {
                    newContent = `{{${newContent}}}`;
                }

                this.set("content", newContent.trim());
            },
        },
        view: {
            onRender() {
                const { model, el } = this;
                el.setAttribute('style', styles.wp);
            }
        }
    });

    domc.addType('wp-date', {
        model: {
            defaults: {
                tagName: 'span',
                textable: true,
                traits: [
                    {
                        type: "text",
                        label: "id",
                        name: "id",
                        placeholder: "12345",
                        changeProp: true,
                    },
                    {
                        type: "text",
                        label: "title",
                        name: "title",
                        placeholder: useTranslation("eg. Text here"),
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        label: 'Surrounding tag',
                        name: 'tag',
                        changeProp: true,
                        options: surroundingTags,
                    },
                    {
                        type: 'select',
                        label: 'Date format',
                        name: 'format',
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null},
                            {id:"d-M-y", name: "dd-mmm-yy (ex. 28-OCT-90)"},
                            {id:"d-M-Y", name: "dd-mmm-yyyy (ex. 28-OCT-1990)"},
                            {id:"d M y", name: "mmm yy (ex. 28 OCT 90)"},
                            {id:"d M Y", name: "mmm yyyy (ex. 28 OCT 1990)"},
                            {id:"d/m/Y", name: "dd/mm/yy (ex. 28/10/90)"},
                            {id:"d/m/Y", name: "dd/mm/yyyy (ex. 28/10/1990)"},
                            {id:"m/d/y", name: "mm/dd/yy (ex. 10/28/90)"},
                            {id:"m/d/Y", name: "mm/dd/yyyy (ex. 10/28/1990)"},
                            {id:"d.m.Y", name: "dd.mm.yy (ex. 28.10.90)"},
                            {id:"d.m.Y", name: "dd.mm.yyyy (ex. 28.10.1990)"}
                        ]
                    }
                ]
            },
            init() {
                this.on('change:id', this.handleIdChange);
                this.on('change:title', this.handleTitleChange);
                this.on('change:tag', this.handleTagChange);
                this.on('change:format', this.handleDateFormatChange);
            },
            handleIdChange() {
                this.setAttributes({id: this.changed.id});
            },
            handleTitleChange() {
                this.setAttributes({title: this.changed.title});
            },
            handleTagChange() {
                this.set("tagName", this.changed.tag);
            },
            handleDateFormatChange() {

                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/format="[a-zA-Z_\s\-\/\.]*"/i, "");

                if(this.changed.format !== "null"){
                    newContent = `{{${newContent} format="${this.changed.format}"}}`;
                } else {
                    newContent = `{{${newContent.trim()}}}`;
                }

                this.set("content", newContent.trim());
            },
        },
        view: {
            onRender() {
                const { model, el } = this;
                el.setAttribute('style', styles.wp);
            }
        }
    });

    domc.addType('wp-thumbnail', {
        model: {
            defaults: {
                tagName: 'span',
                textable: true,
                traits: [
                    {
                        type: "text",
                        label: "id",
                        name: "id",
                        placeholder: "12345",
                        changeProp: true,
                    },
                    {
                        type: "text",
                        label: "title",
                        name: "title",
                        placeholder: useTranslation("eg. Text here"),
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        label: 'Surrounding tag',
                        name: 'tag',
                        changeProp: true,
                        options: surroundingTags,
                    },
                    {
                        type: 'select',
                        label: 'Format',
                        name: 'format',
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null},
                            {name: useTranslation("Thumbnail"), id: "thumbnail"},
                            {name: useTranslation("Medium"), id: "medium"},
                            {name: useTranslation("Large"), id: "large"},
                            {name: useTranslation("Full size"), id: "full"},
                        ]
                    }
                ]
            },
            init() {
                this.on('change:id', this.handleIdChange);
                this.on('change:title', this.handleTitleChange);
                this.on('change:tag', this.handleTagChange);
                this.on('change:format', this.handleFormatChange);
            },
            handleIdChange() {
                this.setAttributes({id: this.changed.id});
            },
            handleTitleChange() {
                this.setAttributes({title: this.changed.title});
            },
            handleTagChange() {
                this.set("tagName", this.changed.tag);
            },
            handleFormatChange() {

                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/format="[a-zA-Z_\s\-\/\.]*"/i, "");

                if(this.changed.format !== "null"){
                    newContent = `{{${newContent} format="${this.changed.format}"}}`;
                } else {
                    newContent = `{{${newContent.trim()}}}`;
                }

                this.set("content", newContent.trim());
            },
        },
        view: {
            onRender() {
                const { model, el } = this;

                el.setAttribute('style', styles.wp);
            }
        }
    });

    // ACPT element
    domc.addType('acpt-meta', {
        model: {
            defaults: {
                tagName: 'span',
                textable: true,
                traits: [
                    {
                        type: "text",
                        label: "id",
                        name: "id",
                        placeholder: "12345",
                        changeProp: true,
                    },
                    {
                        type: "text",
                        label: "title",
                        name: "title",
                        placeholder: useTranslation("eg. Text here"),
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        label: useTranslation('Surrounding tag'),
                        name: 'tag',
                        changeProp: true,
                        options: surroundingTags,
                    },
                    {
                        type: "text",
                        label: "Width",
                        name: useTranslation("width"),
                        placeholder: useTranslation("eg. 100%"),
                        changeProp: true,
                    },
                    {
                        type: "text",
                        label: useTranslation("Height"),
                        name: useTranslation("height"),
                        placeholder: useTranslation("eg. 300px"),
                        changeProp: true,
                    },
                    {
                        type: 'select',
                        label: useTranslation('Link target'),
                        name: useTranslation('target'),
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null},
                            {name: useTranslation("Opens in a new window or tab"), id: "_blank"},
                            {name: useTranslation("Opens in the same frame as it was clicked"), id: "_self"},
                            {name: useTranslation("Opens in the parent frame"), id: "_parent"},
                            {name: useTranslation("Opens in the full body of the window"), id: "_top"},
                        ]
                    },
                    {
                        type: 'select',
                        label: useTranslation('Date format'),
                        name: useTranslation('date'),
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null},
                            {id:"d-M-y", name: "dd-mmm-yy (ex. 28-OCT-90)"},
                            {id:"d-M-Y", name: "dd-mmm-yyyy (ex. 28-OCT-1990)"},
                            {id:"d M y", name: "mmm yy (ex. 28 OCT 90)"},
                            {id:"d M Y", name: "mmm yyyy (ex. 28 OCT 1990)"},
                            {id:"d/m/Y", name: "dd/mm/yy (ex. 28/10/90)"},
                            {id:"d/m/Y", name: "dd/mm/yyyy (ex. 28/10/1990)"},
                            {id:"m/d/y", name: "mm/dd/yy (ex. 10/28/90)"},
                            {id:"m/d/Y", name: "mm/dd/yyyy (ex. 10/28/1990)"},
                            {id:"d.m.Y", name: "dd.mm.yy (ex. 28.10.90)"},
                            {id:"d.m.Y", name: "dd.mm.yyyy (ex. 28.10.1990)"}
                        ]
                    },
                    {
                        type: 'number',
                        label: useTranslation('Elements to display'),
                        name: useTranslation('per_page'),
                        default: 3,
                        min: 1,
                        max: 6,
                        step: 1,
                        changeProp: true
                    },
                    {
                        type: 'select',
                        label: useTranslation('What you want to display?'),
                        name: useTranslation('render'),
                        changeProp: true,
                        options: [
                            {name: useTranslation("--Select---"), id: null},
                            {id:"value", name: useTranslation("Value")},
                            {id:"label", name: useTranslation("Label")},
                        ]
                    }
                ]
            },
            init() {
                this.on('change:id', this.handleIdChange);
                this.on('change:title', this.handleTitleChange);
                this.on('change:tag', this.handleTagChange);
                this.on('change:width', this.handleWidthChange);
                this.on('change:height', this.handleHeightChange);
                this.on('change:date', this.handleDateChange);
                this.on('change:target', this.handleTargetChange);
                this.on('change:elements', this.handleElementsChange);
                this.on('change:render', this.handleRenderChange);
            },
            handleIdChange() {
                this.setAttributes({
                    id: this.changed.id,
                    title: this.attributes.title,

                });
            },
            handleTitleChange() {
                this.setAttributes({
                    id: this.attributes.id,
                    title: this.changed.title,
                });
            },
            handleTagChange() {
                this.set("tagName", this.changed.tag);
            },
            handleWidthChange() {

                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/width="[a-z0-9]*"/i, "");

                if(this.changed.width !== ""){
                    newContent = `{{${newContent} width="${this.changed.width}"}}`;
                } else {
                    newContent = `{{${newContent}}}`;
                }

                this.set("content", newContent.trim());
            },
            handleHeightChange() {

                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/height="[a-z0-9]*"/i, "");

                if(this.changed.height !== ""){
                    newContent = `{{${newContent} height="${this.changed.height}"}}`;
                } else {
                    newContent = `{{${newContent}}}`;
                }

                this.set("content", newContent.trim());
            },
            handleDateChange() {

                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/date-format="[a-zA-Z_\s\-\/\.]*"/i, "");

                if(this.changed.date !== "null"){
                    newContent = `{{${newContent} date-format="${this.changed.date}"}}`;
                } else {
                    newContent = `{{${newContent}}}`;
                }

                this.set("content", newContent.trim());
            },
            handleTargetChange() {

                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/target="[a-z_]*"/i, "");

                if(this.changed.target !== "null"){
                    newContent = `{{${newContent} target="${this.changed.target}"}}`;
                } else {
                    newContent = `{{${newContent}}}`;
                }

                this.set("content", newContent.trim());
            },
            handleElementsChange() {

                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/elements="[1-6]*"/i, "");

                if(this.changed.elements !== "null"){
                    newContent = `{{${newContent} elements="${this.changed.elements}"}}`;
                } else {
                    newContent = `{{${newContent}}}`;
                }

                this.set("content", newContent.trim());
            },
            handleRenderChange() {

                let newContent = this.attributes.content;
                newContent = newContent.replace("{{", "");
                newContent = newContent.replace("}}", "");
                newContent = newContent.replace(/render="[a-z_]*"/i, "");

                if(this.changed.render !== "null"){
                    newContent = `{{${newContent} render="${this.changed.render}"}}`;
                } else {
                    newContent = `{{${newContent}}}`;
                }

                this.set("content", newContent.trim());
            }
        },
        view: {
            onRender() {
                // @TODO ajax call for dynamic render it
                const { model, el } = this;
                el.setAttribute('style', styles.acpt);
            }
        }
    });
};