import{j as a,u as t,s as B}from"./fields-lEbqKXfy.js";import{a as y,u as O,d as Y,R as G}from"./vendor-Bd2ZL6QG.js";import{P as l,B as S,b as V,s as R,u as H,m as L,f as z,k as Q,L as Z,az as J,r as K}from"./index-Bq-K6t3F.js";import{P as X}from"./index-C4649-ab.js";import{L as E,a as ee,s as te,n as D}from"./Layout-Dr3--xmY.js";import{S as k,a as se}from"./StepsHeader-Dix0Jv4i.js";import{u as re,a as $,F as P}from"./index.esm-VK9FF9DZ.js";import{C as A,a as o}from"./CardRow-DMRs4ZKG.js";import{I as w}from"./Input-DoSg7EmL.js";import{c as ae,d as ie}from"./validation-Cveo9Y2u.js";import{t as le}from"./taxonomyLabels-cg9ZBNcD.js";import{T as b}from"./Toggle-Cpoga8j-.js";import{C as oe}from"./Checkbox-BYgLjYCh.js";const I=({stepActive:f,setStepActive:v,setFormValues:p=null,steps:d})=>{const{getValues:m}=re();let c=[];for(const[s,u]of Object.entries(d))c.push(a.jsx("li",{className:`acpt-accordion-tab ${parseInt(s)===parseInt(f)?"active":""}`,onClick:()=>{p&&p(h=>(h[parseInt(f)+1]=m(),h)),v(s)},children:a.jsx("span",{children:u.label})},s));return a.jsx("div",{className:"acpt-tabs mb-12",children:a.jsx("ul",{role:"tablist",className:"tablist mb-12",children:c&&c.map(s=>s)})})};I.propTypes={setFormValues:l.func,setStepActive:l.func.isRequired,stepActive:l.number.isRequired,steps:l.arrayOf(l.shape({label:l.string.isRequired,description:l.string.isRequired})).isRequired};const F=({title:f,crumbs:v,headings:p,stepActive:d,setStepActive:m,handleSubmit:c,formValues:s,edit:u=!1,setFormValues:h=null})=>{const{data:_}=V(n=>n.fetchTaxonomies),r=$({mode:"onChange"});y.useEffect(()=>{_.length>0&&(r.setValue("slug",_[0].slug),r.setValue("singular_label",_[0].singular),r.setValue("plural_label",_[0].plural))},[_]),y.useEffect(()=>{s&&s[1]&&(r.setValue("slug",s[1].slug),r.setValue("singular_label",s[1].singular_label),r.setValue("plural_label",s[1].plural_label))},[s]);const e=n=>{r.setValue("slug",B(n,32))},i=n=>{c(n,1),u||m(1)},x=[a.jsx(S,{testId:"next-step",style:u?R.PRIMARY:R.SECONDARY,children:t(u?"Save":"Next Step")})];return a.jsx(P,{...r,children:a.jsx("form",{onSubmit:r.handleSubmit(i),children:a.jsxs(E,{crumbs:v,title:f,actions:x,children:[u&&a.jsx(I,{setFormValues:h,stepActive:d,setStepActive:m,steps:p}),a.jsxs(A,{style:"with-shadow",children:[!u&&a.jsx(k,{stepActive:d,headings:p}),a.jsx(o,{label:t("Slug"),value:a.jsx(w,{id:"slug",placeholder:t("Slug"),readOnly:_.length>0,description:t("The post name/slug. Used for various queries for taxonomy content."),onChangeCapture:n=>e(n.currentTarget.value),register:r.register,errors:r.formState.errors,isRequired:!0,validate:{validate:u?ae:ie,required:t("This field is mandatory")}})}),a.jsx(o,{label:t("Singular label"),value:a.jsx(w,{id:"singular_label",placeholder:t("(e.g. Movie)"),description:t("Used when a singular label is needed"),register:r.register,errors:r.formState.errors,isRequired:!0,validate:{required:t("This field is mandatory")}})}),a.jsx(o,{label:t("Plural label"),value:a.jsx(w,{id:"plural_label",placeholder:t("(e.g. Movies)"),description:t("Used for the taxonomy admin menu item"),register:r.register,errors:r.formState.errors,isRequired:!0,validate:{required:t("This field is mandatory")}})})]})]})})})};F.propTypes={headings:l.arrayOf(l.shape({label:l.string.isRequired,description:l.string.isRequired})).isRequired,title:l.string.isRequired,crumbs:l.arrayOf(S).isRequired,stepActive:l.number.isRequired,setStepActive:l.func.isRequired,handleSubmit:l.func.isRequired,formValues:l.object.isRequired,setFormValues:l.func,edit:l.bool};const W=({title:f,crumbs:v,headings:p,stepActive:d,setStepActive:m,handleSubmit:c,formValues:s,edit:u,setFormValues:h=null})=>{const{data:_}=V(n=>n.fetchTaxonomies);let r={};_.length>0&&(r=_[0].labels);const e=$({mode:"onChange"});y.useEffect(()=>{u&&_.length>0&&(e.setValue("name",r.name),e.setValue("singular_name",r.singular_name),e.setValue("search_items",r.search_items),e.setValue("popular_items",r.popular_items),e.setValue("all_items",r.all_items),e.setValue("parent_item",r.parent_item),e.setValue("parent_item_colon",r.parent_item_colon),e.setValue("edit_item",r.edit_item),e.setValue("view_item",r.view_item),e.setValue("update_item",r.update_item),e.setValue("add_new_item",r.add_new_item),e.setValue("new_item_name",r.new_item_name),e.setValue("separate_items_with_commas",r.separate_items_with_commas),e.setValue("add_or_remove_items",r.add_or_remove_items),e.setValue("choose_from_most_used",r.choose_from_most_used),e.setValue("not_found",r.not_found),e.setValue("no_terms",r.no_terms),e.setValue("filter_by_item",r.filter_by_item),e.setValue("items_list_navigation",r.items_list_navigation),e.setValue("items_list",r.items_list),e.setValue("most_used",r.most_used),e.setValue("back_to_items",r.back_to_items))},[]),y.useEffect(()=>{u?s&&s[2]&&(e.setValue("name",s[2].name),e.setValue("singular_name",s[2].singular_name),e.setValue("search_items",s[2].search_items),e.setValue("popular_items",s[2].popular_items),e.setValue("all_items",s[2].all_items),e.setValue("parent_item",s[2].parent_item),e.setValue("parent_item_colon",s[2].parent_item_colon),e.setValue("edit_item",s[2].edit_item),e.setValue("view_item",s[2].view_item),e.setValue("update_item",s[2].update_item),e.setValue("add_new_item",s[2].add_new_item),e.setValue("new_item_name",s[2].new_item_name),e.setValue("separate_items_with_commas",s[2].separate_items_with_commas),e.setValue("add_or_remove_items",s[2].add_or_remove_items),e.setValue("choose_from_most_used",s[2].choose_from_most_used),e.setValue("not_found",s[2].not_found),e.setValue("no_terms",s[2].no_terms),e.setValue("filter_by_item",s[2].filter_by_item),e.setValue("items_list_navigation",s[2].items_list_navigation),e.setValue("items_list",s[2].items_list),e.setValue("most_used",s[2].most_used),e.setValue("back_to_items",s[2].back_to_items)):s&&s[1]&&(e.setValue("name",s[1].plural_label),e.setValue("singular_name",s[1].singular_label),e.setValue("search_items",`${t("Search {{r}}",{r:s[1].plural_label})}`),e.setValue("popular_items",`${t("Popular {{r}}",{r:s[1].plural_label})}`),e.setValue("all_items",`${t("All {{r}}",{r:s[1].plural_label})}`),e.setValue("parent_item",`${t("Parent {{r}}",{r:s[1].singular_label})}`),e.setValue("parent_item_colon",t("Parent item")),e.setValue("edit_item",`${t("Edit")}`),e.setValue("view_item",`${t("View")}`),e.setValue("update_item",`${t("Update {{r}}",{r:s[1].singular_label})}`),e.setValue("add_new_item",`${t("Add new {{r}}",{r:s[1].singular_label})}`),e.setValue("new_item_name",`${t("New {{r}}",{r:s[1].singular_label})}`),e.setValue("separate_items_with_commas",`${t("Separate {{r}} with commas",{r:s[1].plural_label})}`),e.setValue("add_or_remove_items",`${t("Add or remove {{r}}",{r:s[1].plural_label})}`),e.setValue("choose_from_most_used",`${t("Choose from most used {{r}}",{r:s[1].singular_label})}`),e.setValue("not_found",t("No {{r}} found",{r:s[1].singular_label})),e.setValue("no_terms",`${t("No {{r}}",{r:s[1].plural_label})}`),e.setValue("filter_by_item",`${t("Filter by {{r}}",{r:s[1].singular_label})}`),e.setValue("items_list_navigation",t("Navigation list {{r}}",{r:s[1].plural_label})),e.setValue("items_list",t("List {{r}}",{r:s[1].plural_label})),e.setValue("most_used",`${t("Most used {{r}}",{r:s[1].plural_label})}`),e.setValue("back_to_items",`${t("Back to {{r}}",{r:s[1].plural_label})}`))},[s]);const i=n=>{c(n,2),u||m(2)};let x=[];return u||x.push(a.jsx(S,{testId:"prev-step",type:"button",onClick:()=>m(0),style:R.SECONDARY,children:t("Previous Step")})),x.push(a.jsx(S,{testId:"next-step",style:u?R.PRIMARY:R.SECONDARY,children:t(u?"Save":"Next Step")})),a.jsx(P,{...e,children:a.jsx("form",{onSubmit:e.handleSubmit(i),children:a.jsxs(E,{crumbs:v,title:f,actions:x,children:[u&&a.jsx(I,{setFormValues:h,stepActive:d,setStepActive:m,steps:p}),a.jsxs(A,{style:"with-shadow",children:[!u&&a.jsx(k,{stepActive:d,headings:p}),le.map(n=>a.jsx(o,{label:n.label,value:a.jsx(w,{id:n.id,register:e.register,description:n.description,errors:e.formState.errors,isRequired:!0,validate:{required:t("This field is mandatory")}})}))]})]})})})};W.propTypes={headings:l.arrayOf(l.shape({label:l.string.isRequired,description:l.string.isRequired})).isRequired,title:l.string.isRequired,crumbs:l.arrayOf(S).isRequired,stepActive:l.number.isRequired,setStepActive:l.func.isRequired,handleSubmit:l.func.isRequired,formValues:l.object.isRequired,setFormValues:l.func,edit:l.bool.isRequired};const M=({title:f,crumbs:v,headings:p,stepActive:d,setStepActive:m,handleSubmit:c,formValues:s,loading:u=!1,edit:h=!1,setFormValues:_=null})=>{const{data:r}=V(q=>q.fetchTaxonomies);let e={};r.length>0&&(e=r[0].settings);const i=$({mode:"all",defaultValues:{public:r.length>0?e.public:null,publicly_queryable:r.length>0?e.publicly_queryable:null,hierarchical:r.length>0?e.hierarchical:null,show_ui:r.length>0?e.show_ui:null,show_in_menu:r.length>0?e.show_in_menu:null,show_in_nav_menus:r.length>0?e.show_in_nav_menus:null,show_in_rest:r.length>0?e.show_in_rest:null,rest_base:r.length>0?e.rest_base:null,rest_controller_class:r.length>0?e.rest_controller_class:null,show_tagcloud:r.length>0?e.show_tagcloud:null,show_in_quick_edit:r.length>0?e.show_in_quick_edit:null,show_admin_column:r.length>0?e.show_admin_column:null,capabilities:r.length>0?e.capabilities:null,rewrite:r.length>0?e.rewrite:null,custom_rewrite:r.length>0?e.custom_rewrite:null,query_var:r.length>0?e.query_var:null,custom_query_var:r.length>0?e.custom_query_var:null,default_term:r.length>0?e.default_term:null,sort:r.length>0?e.sort:null}});y.useEffect(()=>{h&&s&&s[3]&&(i.setValue("public",s[3].public),i.setValue("publicly_queryable",s[3].publicly_queryable),i.setValue("hierarchical",s[3].hierarchical),i.setValue("show_ui",s[3].show_ui),i.setValue("show_in_menu",s[3].show_in_menu),i.setValue("show_in_nav_menus",s[3].show_in_nav_menus),i.setValue("show_in_rest",s[3].show_in_rest),i.setValue("rest_base",s[3].rest_base),i.setValue("rest_controller_class",s[3].rest_controller_class),i.setValue("show_tagcloud",s[3].show_tagcloud),i.setValue("show_in_quick_edit",s[3].show_in_quick_edit),i.setValue("show_admin_column",s[3].show_admin_column),i.setValue("capabilities",s[3].capabilities),i.setValue("rewrite",s[3].rewrite),i.setValue("custom_rewrite",s[3].custom_rewrite),i.setValue("query_var",s[3].query_var),i.setValue("custom_query_var",s[3].custom_query_var),i.setValue("default_term",s[3].default_term),i.setValue("sort",s[3].sort))},[s]);const x=i.watch("rewrite"),n=i.watch("query_var"),T=q=>{c(q,3)};let j=[];return h||j.push(a.jsx(S,{testId:"prev-step",type:"button",onClick:()=>m(1),style:R.SECONDARY,children:t("Previous Step")})),j.push(a.jsx(S,{testId:"next-step",style:R.PRIMARY,children:t("Save")})),a.jsx(P,{...i,children:a.jsx("form",{onSubmit:i.handleSubmit(T),children:a.jsxs(E,{crumbs:v,title:f,actions:j,children:[h&&a.jsx(I,{setFormValues:_,stepActive:d,setStepActive:m,steps:p}),a.jsxs(A,{style:"with-shadow",children:[!h&&a.jsx(k,{setStepActive:m,stepActive:d,headings:p}),a.jsx(o,{label:t("Is Public"),value:a.jsx(b,{id:"public",description:t("Whether a taxonomy is intended for use publicly either via the admin interface or by front-end users."),defaultValue:r.length>0?e.public:!0,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Publicly queryable"),value:a.jsx(b,{id:"publicly_queryable",description:t("Whether the taxonomy is publicly queryable. If not set, the default is inherited from $public."),defaultValue:r.length>0?e.publicly_queryable:!0,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Hierarchical"),value:a.jsx(b,{id:"hierarchical",description:t("Whether the taxonomy is hierarchical. Default false."),defaultValue:r.length>0?e.hierarchical:!1,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Show in UI"),value:a.jsx(b,{id:"show_ui",description:t("Whether to generate and allow a UI for managing terms in this taxonomy in the admin. If not set, the default is inherited from $public (default true)."),defaultValue:r.length>0?e.show_ui:!0,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Show in menu"),value:a.jsx(b,{id:"show_in_menu",description:t("Whether to show the taxonomy in the admin menu. If true, the taxonomy is shown as a submenu of the object type menu. If false, no menu is shown. $show_ui must be true. If not set, default is inherited from $show_ui (default true)."),defaultValue:r.length>0?e.show_in_menu:!0,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Show in nav menus"),value:a.jsx(b,{id:"show_in_nav_menus",description:t("Makes this taxonomy available for selection in navigation menus. If not set, the default is inherited from $public (default true)."),defaultValue:r.length>0?e.show_in_nav_menus:!0,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Show in REST API"),value:a.jsx(b,{id:"show_in_rest",description:t("Whether to include the taxonomy in the REST API. Set this to true for the taxonomy to be available in the block editor. SET TRUE TO ENABLE VISUALIZATION ON GUTEMBERG EDITOR."),defaultValue:r.length>0?e.show_in_rest:!0,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("REST API base slug"),value:a.jsx(w,{id:"rest_base",placeholder:t("REST API base slug"),description:t("To change the base url of REST API route. Default is $taxonomy."),validate:{maxLength:{value:255,message:"max length is 255"}},register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("REST controller class"),value:a.jsx(w,{id:"rest_controller_class",placeholder:t("REST controller class"),description:t("REST API Controller class name. Default is 'WP_REST_Terms_Controller'."),validate:{maxLength:{value:255,message:"max length is 255"}},register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Show Tagcloud"),value:a.jsx(b,{id:"show_tagcloud",description:t("Whether to list the taxonomy in the Tag Cloud Widget controls. If not set, the default is inherited from $show_ui (default true)."),defaultValue:r.length>0?e.show_tagcloud:!0,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Show in quick edit"),value:a.jsx(b,{id:"show_in_quick_edit",description:t("Whether to show the taxonomy in the quick/bulk edit panel. It not set, the default is inherited from $show_ui (default true)."),defaultValue:r.length>0?e.show_in_quick_edit:!0,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Show admin column"),value:a.jsx(b,{id:"show_admin_column",description:t("Whether to display a column for the taxonomy on its post type listing screens. Default false."),defaultValue:r.length>0?e.show_admin_column:!1,register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Capabilities"),value:a.jsx(oe,{id:"capabilities",defaultValue:"post",description:t("Array of capabilities for this taxonomy."),register:i.register,errors:i.formState.errors,values:{manage_terms:{value:"manage_terms",checked:r.length>0&&e.capabilities?e.capabilities.includes("manage_terms"):!0},edit_terms:{value:"edit_terms",checked:r.length>0&&e.capabilities?e.capabilities.includes("edit_terms"):!0},delete_terms:{value:"delete_terms",checked:r.length>0&&e.capabilities?e.capabilities.includes("delete_terms"):!0},assign_terms:{value:"assign_terms",checked:r.length>0&&e.capabilities?e.capabilities.includes("assign_terms"):!0}},validate:{maxLength:{value:255,message:t("max length is 255")}}})}),a.jsx(o,{label:t("Rewrite"),value:a.jsx(b,{id:"rewrite",description:t("Triggers the handling of rewrites for this taxonomy. Default true, using $taxonomy as slug. To prevent rewrite, set to false. To specify rewrite rules, an array can be passed with any of these keys:"),defaultValue:r.length>0?e.rewrite:!1,register:i.register,errors:i.formState.errors})}),x&&a.jsx(o,{label:t("Custom rewrite rules"),value:a.jsx(w,{id:"custom_rewrite",placeholder:t("Custom rewrite rules"),description:t("Taxonomy slug to use instead of default."),validate:{maxLength:{value:255,message:"max length is 255"}},register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Query var"),value:a.jsx(b,{id:"query_var",description:t("Sets the query var key for this taxonomy. Default $taxonomy key. If false, a taxonomy cannot be loaded at ?{query_var}={term_slug}. If a string, the query ?{query_var}={term_slug} will be valid."),defaultValue:r.length>0?e.query_var:!1,register:i.register,errors:i.formState.errors})}),n&&a.jsx(o,{label:t("Custom query var"),value:a.jsx(w,{id:"custom_query_var",placeholder:t("Custom query var"),description:t("Custom query var slug to use instead of default."),validate:{maxLength:{value:255,message:"max length is 255"}},register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Default term"),value:a.jsx(w,{id:"default_term",placeholder:t("Default term to be used for the taxonomy."),description:t("Allowed keys: 'name', name of default term.|'slug', Slug for default term.|'description', Description for default term"),validate:{maxLength:{value:255,message:"max length is 255"}},register:i.register,errors:i.formState.errors})}),a.jsx(o,{label:t("Sort"),value:a.jsx(b,{id:"sort",description:t("Whether terms in this taxonomy should be sorted in the order they are provided to wp_set_object_terms(). Default null which equates to false."),defaultValue:r.length>0?e.sort:!1,register:i.register,errors:i.formState.errors})})]})]})})})};M.propTypes={headings:l.arrayOf(l.shape({label:l.string.isRequired,description:l.string.isRequired})).isRequired,title:l.string.isRequired,crumbs:l.arrayOf(S).isRequired,stepActive:l.number.isRequired,setStepActive:l.func.isRequired,handleSubmit:l.func.isRequired,formValues:l.object.isRequired,setFormValues:l.func,loading:l.bool,edit:l.bool};const we=({})=>{const f=H(),{loading:v}=V(g=>g.saveTaxonomy),{loading:p}=V(g=>g.fetchTaxonomies),{taxonomy:d}=O(),{step:m}=O(),[c,s]=y.useState(!1),[u,h]=y.useState(!1),[_,r]=y.useState(m?parseInt(m):0),[e,i]=y.useState({}),x=Y();(d==="category"||d==="product_tag")&&x("/"),y.useEffect(()=>{d?(L(t("Edit Taxonomy")),f(z({taxonomy:d})).then(g=>{g.payload.length!==1?h(!0):i({1:{slug:g.payload[0].slug,plural_label:g.payload[0].plural,singular_label:g.payload[0].singular},2:g.payload[0].labels,3:g.payload[0].settings})}).catch(g=>{h(!0),console.error(g)}),s(!0)):(L(t("Create new Taxonomy")),Q("#/register_taxonomy"))},[]);const n=d?t("Edit Taxonomy"):t("Create new Taxonomy"),T=[{label:t("Registered Taxonomies"),link:"/taxonomies"},{label:d?t("Edit Taxonomy"):t("Create new Taxonomy")}],j=[{label:t("Basic"),description:t("Minimum configuration")},{label:t("Labels"),description:t("Additional labels")},{label:t("Settings"),description:t("Other settings")}],q=(g,U)=>{e[U]=g,i(e),ee(),Object.keys(e).length===3&&f(J(e)).then(C=>{const N=C.payload;N.success?(te("Taxonomy successfully saved."),x("/taxonomies"),K()):D.error(N.error)}).catch(C=>{D.error(C)})};return c&&p?a.jsx(Z,{}):u?a.jsx(X,{}):a.jsx(G.Fragment,{children:a.jsx(se,{steps:[a.jsx(F,{edit:c,title:n,headings:j,crumbs:T,stepActive:_,setStepActive:r,handleSubmit:q,formValues:e,setFormValues:i}),a.jsx(W,{edit:c,title:n,headings:j,crumbs:T,stepActive:_,setStepActive:r,handleSubmit:q,formValues:e,setFormValues:i}),a.jsx(M,{title:n,headings:j,crumbs:T,stepActive:_,setStepActive:r,handleSubmit:q,formValues:e,setFormValues:i,loading:v,edit:c})],activeStep:_})})};export{we as default};
