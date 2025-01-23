import{j as s,e as le,u as t,s as ne}from"./fields-lEbqKXfy.js";import{a as y,R as V,u as D,d as oe}from"./vendor-Bd2ZL6QG.js";import{P as o,I as ue,B as k,s as T,b as N,i as Q,u as pe,w as ce,m as Y,c as de,L as _e,aw as he,r as me}from"./index-BQ3U1-jG.js";import{S as O,a as ge}from"./StepsHeader-Jm79ml21.js";import{I as R}from"./Input-B6WzOinM.js";import{g as fe,u as be,a as F,F as M}from"./index.esm-VK9FF9DZ.js";import{L as U,a as ve,s as ye,n as B}from"./Layout-CjJK5OT4.js";import{C as W,a as h}from"./CardRow-BU9eHmie.js";import{i as xe,b as we,v as H}from"./validation-Bhdt-Zor.js";import{M as je}from"./index-DYtzcsOi.js";import{E as Se}from"./index-BxoymHt8.js";import{C as qe}from"./Checkbox-CAi7RJWg.js";import{p as Re}from"./postLabels-j5DSRsyf.js";import{T as q}from"./Toggle-6oHGwNXF.js";import"./Select-CKTL5gu7.js";import{I as Ce}from"./InputHidden-DvoOz-FD.js";import{P as ke}from"./index--4lgCEp5.js";const z=({icon:f,isSelected:m,callback:x})=>s.jsx("div",{title:f,className:`icon ${m?"selected":""}`,onClick:()=>{x(f)},children:s.jsx(ue,{icon:f,width:"24px"})});z.propTypes={icon:o.string.isRequired,isSelected:o.bool,callback:o.func};const J=({type:f,defaultIcon:m=null,callback:x})=>{const[d,b]=y.useState([]),g="https://api.iconify.design/",r=l=>{fetch(`${g}search?query=${l}&prefix=dashicons&limit=96`).then(n=>n.json()).then(n=>{b(n.icons)})},p=()=>{fetch(`${g}collection?prefix=dashicons`).then(l=>l.json()).then(l=>{let n=[];l.uncategorized.map(e=>{n.push(`dashicons-${e}`)}),b(n)})},_=()=>{if(!wp||!wp.media){alert(t("The media gallery is not available. You must admin_enqueue this function: wp_enqueue_media()"));return}const l=wp.media({title:t("Upload an Image"),library:{type:["image"]},multiple:!1});l.on("select",function(n){const a=l.state().get("selection").first().toJSON().url;x(a)}),l.open()};return y.useEffect(()=>{p()},[]),f==="image"?s.jsxs(V.Fragment,{children:[m&&le(m)&&s.jsx("div",{className:"fit-content mt-8 mb-8 p-8 with-border b-rounded",children:s.jsx("img",{src:m,alt:"",width:128})}),s.jsx("a",{href:"#",className:"mt-1 acpt-btn acpt-btn-primary-o acpt-btn-block",onClick:l=>{l.preventDefault(),l.stopPropagation(),_()},children:t("Upload an Image")})]}):s.jsxs(V.Fragment,{children:[s.jsx("div",{className:"form-group",children:s.jsx("input",{type:"text",className:"form-control",placeholder:t("Type at least 3 characters to start searching."),onChange:async l=>{const n=l.currentTarget.value;n.length===0&&p(),n.length>=3&&r(n)}})}),d.length>0&&s.jsx("div",{className:"mt-24 icon-picker-wrapper","data-cy":"icon-picker-wrapper",children:d.map(l=>s.jsx(z,{isSelected:m===l,icon:l,callback:x}))})]})};J.propTypes={type:o.string.isRequired,defaultIcon:o.string,callback:o.func};const K=({callback:f,id:m,validate:x,register:d,description:b,defaultValue:g,errors:r})=>{const p=fe(r,m),[_,l]=y.useState(g),[n,e]=y.useState(!1),[a,w]=y.useState(null),u=v=>{l(v),f(v),e(!1)};y.useEffect(()=>{g!==null&&l(g)},[g]);const C=v=>{w(v),e(!n)};return s.jsxs(V.Fragment,{children:[n&&s.jsxs(je,{title:t("Choose icon"),visible:n,setVisible:e,testId:m,children:[s.jsxs("div",{className:"text-left",children:[s.jsx("label",{className:"form-label",htmlFor:"icon-picker",children:t("Select icon type from the list")}),s.jsxs("select",{"data-cy":"select-icon",onChange:v=>{v.preventDefault(),v.stopPropagation(),w(v.currentTarget.value)},defaultValue:a,className:"form-control",id:"icon-picker",children:[s.jsx("option",{value:"",children:t("--Select--")}),s.jsx("option",{value:"dashicon",children:t("Select a Dashicon")}),s.jsx("option",{value:"image",children:t("Upload an icon image")})]})]}),a&&s.jsx("div",{className:"mt-8",children:s.jsx(J,{type:a,defaultIcon:_,callback:u})})]}),s.jsxs("div",{className:"flex-center s-8",children:[_&&s.jsx(Se,{value:_}),s.jsx("input",{id:m,name:m,type:"text","data-cy":"input-icon",value:_||"",className:"hidden",...d(m,x)}),s.jsxs("div",{className:"i-flex-center s-8",children:[s.jsx(k,{onClick:v=>{v.preventDefault(),v.stopPropagation(),C("dashicon")},style:T.SECONDARY,size:"sm",testId:`${m}_dashicon`,children:t("Choose icon")}),s.jsx(k,{onClick:v=>{v.preventDefault(),v.stopPropagation(),C("image")},style:T.BORDERED,size:"sm",testId:`${m}_image`,children:t("Upload an icon image")})]})]}),b&&s.jsx("div",{className:"form-description",children:b}),p&&s.jsx("div",{"data-cy":"input-error-icon",className:"invalid-feedback",children:p.message})]})};K.propTypes={id:o.string.isRequired,defaultValue:o.string,description:o.string,callback:o.func,validate:o.func,register:o.func.isRequired,errors:o.array.isRequired};const L=({stepActive:f,setStepActive:m,setFormValues:x=null,steps:d})=>{const{getValues:b}=be();let g=[];for(const[r,p]of Object.entries(d))g.push(s.jsx("li",{className:`acpt-accordion-tab ${parseInt(r)===parseInt(f)?"active":""}`,onClick:()=>{x&&x(_=>(_[parseInt(f)+1]=b(),_)),m(r)},children:s.jsx("span",{children:p.label})},r));return s.jsx("div",{className:"acpt-tabs",children:s.jsx("ul",{role:"tablist",className:"tablist mb-12",children:g&&g.map(r=>r)})})};L.propTypes={setFormValues:o.func,setStepActive:o.func.isRequired,stepActive:o.number.isRequired,steps:o.arrayOf(o.shape({label:o.string.isRequired,description:o.string.isRequired})).isRequired};const X=({title:f,crumbs:m,headings:x,stepActive:d,setStepActive:b,handleSubmit:g,edit:r=!1,formValues:p,setFormValues:_=null})=>{const{data:l}=N(S=>S.fetchCustomPostTypes),[n,e]=y.useState(null),[a,w]=y.useState({title:!0,editor:!0,thumbnail:!0,excerpt:!0,author:!1,trackbacks:!1,custom_fields:!1,comments:!1,revisions:!1,page_attributes:!1,post_formats:!1}),u=F({mode:"onChange"});y.useEffect(()=>{l.length>0&&(e(l[0].icon),w({title:l[0].supports.includes("title"),editor:l[0].supports.includes("editor"),thumbnail:l[0].supports.includes("thumbnail"),excerpt:l[0].supports.includes("excerpt"),author:l[0].supports.includes("author"),trackbacks:l[0].supports.includes("trackbacks"),custom_fields:l[0].supports.includes("custom-fields"),comments:l[0].supports.includes("comments"),revisions:l[0].supports.includes("revisions"),page_attributes:l[0].supports.includes("page-attributes"),post_formats:l[0].supports.includes("post-formats")}),u.setValue("post_name",l[0].name),u.setValue("singular_label",l[0].singular),u.setValue("plural_label",l[0].plural),u.setValue("icon",l[0].icon),u.setValue("support_0",l[0].supports.includes("title")?"title":!1),u.setValue("support_1",l[0].supports.includes("editor")?"editor":!1),u.setValue("support_2",l[0].supports.includes("thumbnail")?"thumbnail":!1),u.setValue("support_3",l[0].supports.includes("excerpt")?"excerpt":!1),u.setValue("support_4",l[0].supports.includes("author")?"author":!1),u.setValue("support_5",l[0].supports.includes("trackbacks")?"trackbacks":!1),u.setValue("support_6",l[0].supports.includes("custom-fields")?"custom-fields":!1),u.setValue("support_7",l[0].supports.includes("comments")?"comments":!1),u.setValue("support_8",l[0].supports.includes("revisions")?"revisions":!1),u.setValue("support_9",l[0].supports.includes("page-attributes")?"page-attributes":!1),u.setValue("support_10",l[0].supports.includes("post-formats")?"post-formats":!1))},[]),y.useEffect(()=>{p&&p[1]&&(e(p[1].icon),w({title:p[1].support_0,editor:p[1].support_1,thumbnail:p[1].support_2,excerpt:p[1].support_3,author:p[1].support_4,trackbacks:p[1].support_5,custom_fields:p[1].support_6,comments:p[1].support_7,revisions:p[1].support_8,page_attributes:p[1].support_9,post_formats:p[1].support_10}),u.setValue("post_name",p[1].post_name),u.setValue("singular_label",p[1].singular_label),u.setValue("plural_label",p[1].plural_label),u.setValue("icon",p[1].icon),u.setValue("support_0",p[1].support_0),u.setValue("support_1",p[1].support_1),u.setValue("support_2",p[1].support_2),u.setValue("support_3",p[1].support_3),u.setValue("support_4",p[1].support_4),u.setValue("support_5",p[1].support_5),u.setValue("support_6",p[1].support_6),u.setValue("support_7",p[1].support_7),u.setValue("support_8",p[1].support_8),u.setValue("support_9",p[1].support_9),u.setValue("support_10",p[1].support_10))},[p]);const C=S=>{u.setValue("post_name",ne(S,20))},v=S=>{g(S,1),r||b(1)},i=[s.jsx(k,{testId:"next-step",style:r?T.PRIMARY:T.SECONDARY,children:t(r?"Save":"Next Step")})];return s.jsx(M,{...u,children:s.jsx("form",{onSubmit:u.handleSubmit(v),children:s.jsxs(U,{crumbs:m,title:f,actions:i,children:[r&&s.jsx(L,{setFormValues:_,stepActive:d,setStepActive:b,steps:x}),s.jsxs(W,{style:"with-shadow",children:[!r&&s.jsx(O,{stepActive:d,headings:x}),s.jsx(h,{label:t("Post name"),value:s.jsx(R,{id:"post_name",placeholder:t("Post name"),readOnly:l.length>0,description:t("The post name/slug. Used for various queries."),onChangeCapture:S=>C(S.currentTarget.value),register:u.register,errors:u.formState.errors,isRequired:!0,validate:{validate:r?xe:we,required:t("This field is mandatory")}})}),s.jsx(h,{label:t("Singular label"),value:s.jsx(R,{id:"singular_label",placeholder:t("(e.g. Movie)"),defaultValue:l.length>0?l[0].singular:null,description:t("Used when a singular label is needed"),register:u.register,errors:u.formState.errors,isRequired:!0,validate:{required:t("This field is mandatory")}})}),s.jsx(h,{label:t("Plural label"),value:s.jsx(R,{id:"plural_label",placeholder:t("(e.g. Movies)"),defaultValue:l.length>0?l[0].plural:null,description:t("Used for the post type admin menu item"),register:u.register,errors:u.formState.errors,isRequired:!0,validate:{required:t("This field is mandatory")}})}),s.jsx(h,{label:t("Icon"),value:s.jsx(K,{id:"icon",callback:S=>{u.setValue("icon",S)},defaultValue:n,register:u.register,errors:u.formState.errors,description:t("Displayed on the sidebar of the admin panel"),validate:{required:t("This field is mandatory")}})}),s.jsx(h,{label:t("Support"),wizard:`${t("Add support for various available post edit features. For more info")} <a target='_blank' href='https://developer.wordpress.org/reference/functions/register_post_type/#supports'>${t("see here")}<a/>.`,value:s.jsx(qe,{register:u.register,errors:u.formState.errors,id:"support",values:{title:{value:"title",checked:a.title},editor:{value:"editor",checked:a.editor},thumbnail:{value:"thumbnail",checked:a.thumbnail},excerpt:{value:"excerpt",checked:a.excerpt},author:{value:"author",checked:a.author},trackbacks:{value:"trackbacks",checked:a.trackbacks},"custom-fields":{value:"custom-fields",checked:a.custom_fields},comments:{value:"comments",checked:a.comments},revisions:{value:"revisions",checked:a.revisions},"page-attributes":{value:"page-attributes",checked:a.page_attributes},"post-formats":{value:"post-formats",checked:a.post_formats}}})})]})]})})})};X.propTypes={headings:o.arrayOf(o.shape({label:o.string.isRequired,description:o.string.isRequired})).isRequired,title:o.string.isRequired,crumbs:o.arrayOf(k).isRequired,stepActive:o.number.isRequired,setStepActive:o.func.isRequired,handleSubmit:o.func.isRequired,formValues:o.object.isRequired,setFormValues:o.func,edit:o.bool};const Z=({title:f,crumbs:m,headings:x,stepActive:d,setStepActive:b,handleSubmit:g,formValues:r,setFormValues:p=null,edit:_})=>{const{data:l}=N(u=>u.fetchCustomPostTypes);let n={};l.length>0&&(n=l[0].labels);const e=F({mode:"onChange"});y.useEffect(()=>{_&&l.length>0&&(e.setValue("menu_name",n.menu_name),e.setValue("all_items",n.all_items),e.setValue("add_new",n.add_new),e.setValue("add_new_item",n.add_new_item),e.setValue("edit_item",n.edit_item),e.setValue("new_item",n.new_item),e.setValue("view_item",n.view_item),e.setValue("view_items",n.view_items),e.setValue("search_item",n.search_item),e.setValue("not_found",n.not_found),e.setValue("not_found_in_trash",n.not_found_in_trash),e.setValue("parent_item_colon",n.parent_item_colon),e.setValue("featured_image",n.featured_image),e.setValue("set_featured_image",n.set_featured_image),e.setValue("remove_featured_image",n.remove_featured_image),e.setValue("use_featured_image",n.use_featured_image),e.setValue("archives",n.archives),e.setValue("insert_into_item",n.insert_into_item),e.setValue("uploaded_to_this_item",n.uploaded_to_this_item),e.setValue("filter_items_list",n.filter_items_list),e.setValue("items_list_navigation",n.items_list_navigation),e.setValue("items_list",n.items_list),e.setValue("filter_by_date",n.filter_by_date),e.setValue("item_published",n.item_published),e.setValue("item_published_privately",n.item_published_privately),e.setValue("item_reverted_to_draft",n.item_reverted_to_draft),e.setValue("item_scheduled",n.item_scheduled),e.setValue("item_updated",n.item_updated))},[]),y.useEffect(()=>{_?r&&r[2]&&(e.setValue("menu_name",r[2].menu_name),e.setValue("all_items",r[2].all_items),e.setValue("add_new",r[2].add_new),e.setValue("add_new_item",r[2].add_new_item),e.setValue("edit_item",r[2].edit_item),e.setValue("new_item",r[2].new_item),e.setValue("view_item",r[2].view_item),e.setValue("view_items",r[2].view_items),e.setValue("search_item",r[2].search_item),e.setValue("not_found",r[2].not_found),e.setValue("not_found_in_trash",r[2].not_found_in_trash),e.setValue("parent_item_colon",r[2].parent_item_colon),e.setValue("featured_image",r[2].featured_image),e.setValue("set_featured_image",r[2].set_featured_image),e.setValue("remove_featured_image",r[2].remove_featured_image),e.setValue("use_featured_image",r[2].use_featured_image),e.setValue("archives",r[2].archives),e.setValue("insert_into_item",r[2].insert_into_item),e.setValue("uploaded_to_this_item",r[2].uploaded_to_this_item),e.setValue("filter_items_list",r[2].filter_items_list),e.setValue("items_list_navigation",r[2].items_list_navigation),e.setValue("items_list",r[2].items_list),e.setValue("filter_by_date",r[2].filter_by_date),e.setValue("item_published",r[2].item_published),e.setValue("item_published_privately",r[2].item_published_privately),e.setValue("item_reverted_to_draft",r[2].item_reverted_to_draft),e.setValue("item_scheduled",r[2].item_scheduled),e.setValue("item_updated",r[2].item_updated)):r&&r[1]&&(e.setValue("menu_name",r[1].plural_label),e.setValue("all_items",`${t("All {{r}}",{r:r[1].plural_label})}`),e.setValue("add_new",`${t("Add")} ${r[1].singular_label}`),e.setValue("add_new_item",`${t("Add new {{r}}",{r:r[1].singular_label})}`),e.setValue("edit_item",`${t("Edit")} ${r[1].singular_label}`),e.setValue("new_item",`${t("New")} ${r[1].singular_label}`),e.setValue("view_item",`${t("View")} ${r[1].singular_label}`),e.setValue("view_items",`${t("View")} ${r[1].plural_label}`),e.setValue("search_item",`${t("Search")} ${r[1].plural_label}`),e.setValue("not_found",t("No {{r}} found",{r:r[1].singular_label})),e.setValue("not_found_in_trash",t("No {{r}} found",{r:r[1].singular_label})),e.setValue("parent_item_colon",t("Parent item")),e.setValue("featured_image",t("Featured image")),e.setValue("set_featured_image",t("Set featured image")),e.setValue("remove_featured_image",t("Remove featured image")),e.setValue("use_featured_image",t("Use featured image")),e.setValue("archives",t("Archives")),e.setValue("insert_into_item",t("Insert")),e.setValue("uploaded_to_this_item",t("Upload")),e.setValue("filter_items_list",t("Filter {{r}} list",{r:r[1].plural_label})),e.setValue("items_list_navigation",t("Navigation list {{r}}",{r:r[1].plural_label})),e.setValue("items_list",t("List {{r}}",{r:r[1].plural_label})),e.setValue("filter_by_date",t("Filter by date")),e.setValue("item_published",t("{{r}} published",{r:r[1].singular_label})),e.setValue("item_published_privately",t("{{r}} published privately",{r:r[1].singular_label})),e.setValue("item_reverted_to_draft",t("{{r}} reverted to draft",{r:r[1].singular_label})),e.setValue("item_scheduled",t("{{r}} scheduled",{r:r[1].singular_label})),e.setValue("item_updated",t("{{r}} updated",{r:r[1].singular_label})))},[r]);const a=u=>{g(u,2),_||b(2)};let w=[];return _||w.push(s.jsx(k,{testId:"prev-step",type:"button",onClick:()=>b(0),style:T.SECONDARY,children:t("Previous Step")})),w.push(s.jsx(k,{testId:"next-step",style:_?T.PRIMARY:T.SECONDARY,children:t(_?"Save":"Next Step")})),s.jsx(M,{...e,children:s.jsx("form",{onSubmit:e.handleSubmit(a),children:s.jsxs(U,{crumbs:m,title:f,actions:w,children:[_&&s.jsx(L,{setFormValues:p,stepActive:d,setStepActive:b,steps:x}),s.jsxs(W,{style:"with-shadow",children:[!_&&s.jsx(O,{stepActive:d,headings:x}),Re.map(u=>s.jsx(h,{label:u.label,value:s.jsx(R,{id:u.id,register:e.register,description:u.description,errors:e.formState.errors,isRequired:!0,validate:{required:t("This field is mandatory")}})}))]})]})})})};Z.propTypes={headings:o.arrayOf(o.shape({label:o.string.isRequired,description:o.string.isRequired})).isRequired,title:o.string.isRequired,crumbs:o.arrayOf(k).isRequired,stepActive:o.number.isRequired,setStepActive:o.func.isRequired,handleSubmit:o.func.isRequired,formValues:o.object.isRequired,setFormValues:o.func,edit:o.bool.isRequired};const ee=({id:f,register:m,setValue:x,defaultValue:d,description:b})=>{const g=y.useRef(null),r=y.useRef(null),p=()=>{const n=g.current.value,e=r.current.value;if(n&&e){const a=n==="after"?parseInt(e)+1:parseInt(e)-1;x(f,a)}},_=()=>{const n=a=>{const w=a.replace(/(<([^>]+)>)/gi,"");return a.length!==w.length?a.split(" ")[0]:a};let e=[];for(const[a,w]of Object.entries(document.globals.menu))e.push({label:w[0]!==""?n(w[0]):"----",value:a});return e},l=()=>{if(!d)return{position:null,menu:null};for(const[a,w]of Object.entries(document.globals.menu)){if(parseInt(a)+1===d)return{position:"after",menu:a};if(parseInt(a)-1===d)return{position:"before",menu:a}}const e=Object.keys(document.globals.menu).findIndex(a=>parseInt(a)===parseInt(d));return Object.entries(document.globals.menu)[e+1]?{position:"before",menu:Object.entries(document.globals.menu)[e+1][0]}:Object.entries(document.globals.menu)[e-1]?{position:"after",menu:Object.entries(document.globals.menu)[e-1][0]}:{position:null,menu:null}};return s.jsxs(V.Fragment,{children:[s.jsx(Ce,{register:m,id:f,value:d}),s.jsxs("div",{className:"i-flex-center s-8 w-100",children:[s.jsx("div",{className:"acpt-select w-50",children:s.jsxs("select",{ref:g,"data-cy":`position-${f}`,className:"form-control",onChangeCapture:p,defaultValue:l().position,children:[s.jsx("option",{value:"",children:t("Select")}),s.jsx("option",{value:"after",children:t("After")}),s.jsx("option",{value:"before",children:t("Before")})]})}),s.jsx("div",{className:"acpt-select w-50",children:s.jsxs("select",{ref:r,"data-cy":`menu-${f}`,className:"form-control",onChangeCapture:p,defaultValue:l().menu,children:[s.jsx("option",{value:"",children:t("Select")}),_().map(n=>s.jsx("option",{value:n.value,children:n.label},n.value))]})})]}),b&&s.jsx("div",{className:"form-description",children:b})]})};ee.propTypes={id:o.string.isRequired,defaultValue:o.number,description:o.string,setValue:o.func.isRequired,register:o.func.isRequired};const te=({title:f,crumbs:m,headings:x,stepActive:d,setStepActive:b,handleSubmit:g,formValues:r,isWPGraphQLActive:p=!1,loading:_=!1,edit:l=!1,setFormValues:n=null})=>{const{data:e}=N(j=>j.fetchCustomPostTypes);let a={};e.length>0&&(a=e[0].settings);const[w,u]=y.useState("toggle"),{postType:C}=D(),v=()=>C||(r&&!Q(r)?r[1].post_name:null),i=F({mode:"all",defaultValues:{hierarchical:e.length>0?a.hierarchical:null,public:e.length>0?a.public:null,publicly_queryable:e.length>0?a.publicly_queryable:null,show_ui:e.length>0?a.show_ui:null,show_in_menu:e.length>0?a.show_in_menu:null,show_in_nav_menus:e.length>0?a.show_in_nav_menus:null,show_in_admin_bar:e.length>0?a.show_in_admin_bar:null,show_in_rest:e.length>0?a.show_in_rest:null,rest_base:e.length>0?a.rest_base:null,menu_position:e.length>0?a.menu_position:null,capability_type:e.length>0?a.capability_type:"post",has_archive:e.length>0?a.has_archive:null,rewrite:e.length>0?a.rewrite:null,with_front:e.length>0?a.with_front:null,custom_rewrite:e.length>0?a.custom_rewrite:null,query_var:e.length>0?a.query_var:null,custom_query_var:e.length>0?a.custom_query_var:null,front_url_prefix:e.length>0&&typeof a.front_url_prefix<"u"?a.front_url_prefix:v()}});y.useEffect(()=>{e.length>0&&typeof a.show_in_menu=="string"&&u("custom"),r&&!Q(r)&&(i.setValue("show_in_graphql",e.length>0?a.show_in_graphql:!0),i.setValue("graphql_single_name",e.length>0&&a.graphql_single_name?a.graphql_single_name.toLowerCase():r[1].singular_label.toLowerCase()),i.setValue("graphql_plural_name",e.length>0&&a.graphql_plural_name?a.graphql_plural_name.toLowerCase():r[1].plural_label.toLowerCase())),l&&r&&r[3]&&(i.setValue("hierarchical",r[3].hierarchical),i.setValue("public",r[3].public),i.setValue("publicly_queryable",r[3].publicly_queryable),i.setValue("show_ui",r[3].show_ui),i.setValue("show_in_menu",r[3].show_in_menu),i.setValue("show_in_nav_menus",r[3].show_in_nav_menus),i.setValue("show_in_admin_bar",r[3].show_in_admin_bar),i.setValue("show_in_rest",r[3].show_in_rest),i.setValue("rest_base",r[3].rest_base),i.setValue("menu_position",r[3].menu_position),i.setValue("capability_type",r[3].capability_type),i.setValue("has_archive",r[3].has_archive),i.setValue("rewrite",r[3].rewrite),i.setValue("custom_rewrite",r[3].custom_rewrite),i.setValue("query_var",r[3].query_var),i.setValue("custom_query_var",r[3].custom_query_var),i.setValue("with_front",typeof r[3].with_front<"u"?r[3].with_front:!0),i.setValue("front_url_prefix",r[3].front_url_prefix))},[r]);const S=()=>l&&r&&r[3]?r[3].menu_position:e.length>0?a.menu_position:null,I=i.watch("show_in_graphql"),c=i.watch("graphql_single_name"),$=i.watch("graphql_plural_name"),G=j=>{i.setValue("graphql_single_name",j.toLowerCase())},P=j=>{i.setValue("graphql_plural_name",j.toLowerCase())},E=j=>{if(j===$)return t("Single name MUST be different from plural name")},se=j=>{if(j===c)return t("Different name MUST be different from single name")},re=i.watch("rewrite"),ae=i.watch("query_var"),ie=j=>{g(j,3)};let A=[];return l||A.push(s.jsx(k,{testId:"prev-step",type:"button",onClick:()=>b(1),style:T.SECONDARY,children:t("Previous Step")})),A.push(s.jsx(k,{testId:"next-step",style:T.PRIMARY,children:t("Save")})),s.jsx(M,{...i,children:s.jsx("form",{onSubmit:i.handleSubmit(ie),children:s.jsxs(U,{crumbs:m,title:f,actions:A,children:[l&&s.jsx(L,{setFormValues:n,stepActive:d,setStepActive:b,steps:x}),s.jsxs(W,{style:"with-shadow",children:[!l&&s.jsx(O,{setStepActive:b,stepActive:d,headings:x}),p&&s.jsxs(V.Fragment,{children:[s.jsx(h,{label:t("Show in GraphQL"),value:s.jsx(q,{id:"show_in_graphql",description:t("Show the custom post type in WPGraphQL."),defaultValue:!0,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("GraphQL single name"),value:s.jsx(R,{id:"graphql_single_name",register:i.register,placeholder:t("Ex. movie"),description:t("Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the plural name."),errors:i.formState.errors,isRequired:I,onChangeCapture:j=>G(j.currentTarget.value),validate:{validate:{validWPGraphQLName:H,handleGraphQLSingleNameChange:E}}})}),s.jsx(h,{label:t("GraphQL plural name"),value:s.jsx(R,{id:"graphql_plural_name",register:i.register,placeholder:t("Ex. movies"),description:t("Camel case string with no punctuation or spaces. Needs to start with a letter (not a number). Important to be different than the single name."),errors:i.formState.errors,isRequired:I,onChangeCapture:j=>P(j.currentTarget.value),validate:{validate:{validWPGraphQLName:H,handleGraphQLPluralNameChange:se}}})})]}),s.jsx(h,{label:t("Hierarchical"),value:s.jsx(q,{id:"hierarchical",description:t("Whether the post type is hierarchical (e.g. page). Default false."),defaultValue:e.length>0?a.hierarchical:!1,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Is Public"),value:s.jsx(q,{id:"public",description:t("Whether a post type is intended for use publicly either via the admin interface or by front-end users."),defaultValue:e.length>0?a.public:!0,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Publicly queryable"),value:s.jsx(q,{id:"publicly_queryable",description:t("Whether queries can be performed on the front end for the post type as part of parse_request()."),defaultValue:e.length>0?a.publicly_queryable:!0,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Show in UI"),value:s.jsx(q,{id:"show_ui",description:t("Whether to generate and allow a UI for managing this post type in the admin. Default is value of $public."),defaultValue:e.length>0?a.show_ui:!0,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Show in menu"),value:s.jsxs(V.Fragment,{children:[w==="toggle"&&s.jsx(q,{id:"show_in_menu",description:t("Where to show the post type in the admin menu. To work, $show_ui must be true. If true, the post type is shown in its own top level menu. If false, no menu is shown."),defaultValue:e.length>0?a.show_in_menu:!0,register:i.register,errors:i.formState.errors}),w==="custom"&&s.jsx(R,{id:"show_in_menu",defaultValue:e.length>0?a.show_in_menu:"",placeholder:t("Custom show in menu rule"),description:`${t("Where to show the post type in the admin menu. Set a custom show in menu rule here. For more info")} <a target='_blank' href='https://developer.wordpress.org/reference/functions/register_post_type/#show_in_menu'>${t("see here")}<a/>.`,validate:{maxLength:{value:255,message:t("max length is 255")}},register:i.register,errors:i.formState.errors}),s.jsx("a",{className:"mt-12",href:"#",onClick:j=>{j.preventDefault(),u(w==="toggle"?"custom":"toggle")},children:t(w==="custom"?"Standard settings":"Set custom settings")})]})}),s.jsx(h,{label:t("Show in nav menus"),value:s.jsx(q,{id:"show_in_nav_menus",description:t("Makes this post type available for selection in navigation menus. Default is value of $public."),defaultValue:e.length>0?a.show_in_nav_menus:!0,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Show in admin bar"),value:s.jsx(q,{id:"show_in_admin_bar",description:t("Makes this post type available via the admin bar. Default is value of $show_in_menu."),defaultValue:e.length>0?a.show_in_admin_bar:!0,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Show in REST API"),value:s.jsx(q,{id:"show_in_rest",description:t("Whether to include the post type in the REST API. Set this to true for the post type to be available in the block editor. SET TRUE TO ENABLE GUTEMBERG EDITOR."),defaultValue:e.length>0?a.show_in_rest:!0,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("REST API base slug"),value:s.jsx(R,{id:"rest_base",placeholder:t("REST API base slug"),description:t("To change the base url of REST API route. Default is $post_type."),validate:{maxLength:{value:255,message:t("max length is 255")}},register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Menu position"),value:s.jsx(ee,{id:"menu_position",defaultValue:S(),description:t("The position in the menu order the post type should appear. To work, $show_in_menu must be true. Default null (at the bottom)."),register:i.register,setValue:i.setValue})}),s.jsx(h,{label:t("Capability type"),value:s.jsx(R,{id:"capability_type",defaultValue:"post",description:t("The string to use to build the read, edit, and delete capabilities. May be passed as an array to allow for alternative plurals when using this argument as a base to construct the capabilities, e.g. array('story', 'stories'). Default 'post'."),validate:{maxLength:{value:255,message:"max length is 255"}},register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Has archive"),value:s.jsx(q,{id:"has_archive",description:t("Whether there should be post type archives, or if a string, the archive slug to use. Will generate the proper rewrite rules if $rewrite is enabled."),defaultValue:e.length>0?a.has_archive:!0,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Rewrite"),value:s.jsx(q,{id:"rewrite",description:t("Triggers the handling of rewrites for this post type. To prevent rewrite, set to false. Defaults to true, using $post_type as slug. To specify rewrite rules, an array can be passed with any of these keys:"),defaultValue:e.length>0?a.rewrite:!0,register:i.register,errors:i.formState.errors})}),re&&s.jsx(h,{label:t("Custom rewrite rules"),value:s.jsx(R,{id:"custom_rewrite",placeholder:t("Custom rewrite rules"),description:t("Custom post type slug to use instead of default."),validate:{maxLength:{value:255,message:t("max length is 255")}},register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("With front"),value:s.jsx(q,{id:"with_front",description:t("Should the permalink structure be prepended with the front base. (example: if your permalink structure is /blog/, then your links will be: false->/news/, true->/blog/news/). Defaults to true"),defaultValue:e.length>0&&typeof a.with_front<"u"?a.with_front:!0,register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Query var"),value:s.jsx(q,{id:"query_var",description:t("Sets the query_var key for this post type. Defaults to  key. If false, a post type cannot be loaded at ?{query_var}={post_slug}. If specified as a string, the query {post_slug} will be valid."),defaultValue:e.length>0?a.query_var:!0,register:i.register,errors:i.formState.errors})}),ae&&s.jsx(h,{label:t("Custom query var"),value:s.jsx(R,{id:"custom_query_var",placeholder:t("Custom query var"),description:t("Custom query var slug to use instead of default."),validate:{maxLength:{value:255,message:t("min length is")+" 255"}},register:i.register,errors:i.formState.errors})}),s.jsx(h,{label:t("Front URL prefix"),value:s.jsx(R,{id:"front_url_prefix",placeholder:t("Front URL prefix"),description:t("Alters the post type permalink structure to add a prefix to singular posts URLs (ex. /movie/titanic). Default value is the post type name."),defaultValue:e.length>0&&a.front_url_prefix?typeof a.front_url_prefix<"u":v(),validate:{maxLength:{value:255,message:t("min length is")+" 255"}},register:i.register,errors:i.formState.errors})})]})]})})})};te.propTypes={headings:o.arrayOf(o.shape({label:o.string.isRequired,description:o.string.isRequired})).isRequired,title:o.string.isRequired,crumbs:o.arrayOf(k).isRequired,stepActive:o.number.isRequired,setStepActive:o.func.isRequired,handleSubmit:o.func.isRequired,formValues:o.object.isRequired,isWPGraphQLActive:o.bool,loading:o.bool,edit:o.bool,setFormValues:o.func};const Be=({})=>{const f=pe(),{loading:m}=N(c=>c.saveCustomPostType),{loading:x}=N(c=>c.fetchCustomPostTypes),{postType:d}=D(),{step:b}=D(),[g,r]=y.useState(!1),[p,_]=y.useState(!1),[l,n]=y.useState(b?parseInt(b):0),[e,a]=y.useState({}),[w,u]=y.useState(!1),C=oe();(d==="page"||d==="post")&&C("/"),y.useEffect(()=>{ce("isWPGraphQLActiveAction",{}).then(c=>{u(c.status)}).catch(c=>{console.error(c.message)})},[]),y.useEffect(()=>{d?(Y(t("Edit Custom Post Type")),r(!0),f(de({postType:d})).then(c=>{c.payload.length!==1?_(!0):a({1:{icon:c.payload[0].icon,plural_label:c.payload[0].plural,post_name:c.payload[0].name,singular_label:c.payload[0].singular,support_0:c.payload[0].supports.includes("title")?"title":!1,support_1:c.payload[0].supports.includes("editor")?"editor":!1,support_2:c.payload[0].supports.includes("thumbnail")?"thumbnail":!1,support_3:c.payload[0].supports.includes("excerpt")?"excerpt":!1,support_4:c.payload[0].supports.includes("author")?"author":!1,support_5:c.payload[0].supports.includes("trackbacks")?"trackbacks":!1,support_6:c.payload[0].supports.includes("custom-fields")?"custom-fields":!1,support_7:c.payload[0].supports.includes("comments")?"comments":!1,support_8:c.payload[0].supports.includes("revisions")?"revisions":!1,support_9:c.payload[0].supports.includes("page-attributes")?"page-attributes":!1,support_10:c.payload[0].supports.includes("post-formats")?"post-formats":!1},2:c.payload[0].labels,3:c.payload[0].settings})}).catch(c=>{_(!0),console.error(c)})):Y(t("Register new Post Type"))},[]);const v=d?t("Edit Custom Post Type"):t("Create new Custom Post Type"),i=[{label:t("Registered Custom Post Types"),link:"/"},{label:d?t("Edit Custom Post Type"):t("Create new Custom Post Type")}],S=[{label:t("Basic"),description:t("Minimum configuration")},{label:t("Labels"),description:t("Additional labels")},{label:t("Settings"),description:t("Other settings")}],I=(c,$)=>{e[$]=c,a(e),ve(),Object.keys(e).length===3&&f(he(e)).then(P=>{const E=P.payload;E.success?(ye("Custom post type successfully saved."),C("/"),me()):B.error(E.error)}).catch(P=>{B.error(P)})};return g&&x?s.jsx(_e,{}):p?s.jsx(ke,{}):s.jsx(V.Fragment,{children:s.jsx(ge,{steps:[s.jsx(X,{edit:g,title:v,headings:S,crumbs:i,stepActive:l,setStepActive:n,handleSubmit:I,formValues:e,setFormValues:a}),s.jsx(Z,{edit:g,title:v,headings:S,crumbs:i,stepActive:l,setStepActive:n,handleSubmit:I,formValues:e,setFormValues:a}),s.jsx(te,{edit:g,title:v,headings:S,crumbs:i,stepActive:l,setStepActive:n,handleSubmit:I,formValues:e,setFormValues:a,isWPGraphQLActive:w,loading:m})],activeStep:l})})};export{Be as default};
