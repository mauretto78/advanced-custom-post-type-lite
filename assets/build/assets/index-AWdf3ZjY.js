import{u as t,j as r}from"./fields-lEbqKXfy.js";import{a as h,R as C}from"./vendor-Bd2ZL6QG.js";import{L as j,n as l}from"./Layout-Dr3--xmY.js";import{C as R,a as i}from"./CardRow-DMRs4ZKG.js";import{m as g,k as v,B as d,s as u,A,w as p}from"./index-Bq-K6t3F.js";const S=()=>{const[a,k]=h.useState(null),[f,c]=h.useState([]),x=()=>{p("runRepairAction",{}).then(e=>{e.success?(l.success(t("The repair was carried out successfully.")),n()):l.error(e.error)}).catch(e=>{console.error(e),l.error(t("Something went wrong, please retry."))})},n=()=>{k(null),c([]),p("healthCheckAction",{}).then(e=>{k(e),e.db!=="ok"&&c(s=>[...s,"db"]),e.version!=="ok"&&c(s=>[...s,"version"]),e.cache!=="ok"&&c(s=>[...s,"cache"])}).catch(e=>{console.error(e),l.error(t("Something went wrong, please retry."))})};h.useEffect(()=>{g(t("Health check")),v("#/health-check"),n()},[]);let m=[r.jsx(d,{style:u.SECONDARY,onClick:e=>{e.preventDefault(),n()},children:t("Run health check")})];f.length>0&&m.push(r.jsx(d,{style:u.PRIMARY,onClick:e=>{e.preventDefault(),x()},children:t("Launch the repair")}));const o=e=>r.jsx("div",{className:`color-${e==="ok"?"success":"danger"}`,children:e});return r.jsx(j,{title:t("Health check"),actions:m,crumbs:[{label:t("ACPT Tools"),link:"/tools"},{label:t("Health check")}],children:a?r.jsx(C.Fragment,{children:r.jsxs(R,{title:t("Health check"),children:[r.jsx(i,{label:t("Plugin version"),value:o(a.version)}),r.jsx(i,{label:t("DB status"),value:o(a.db)}),r.jsx(i,{label:t("Cache"),value:o(a.cache)})]})}):r.jsx(A,{style:u.WARNING,children:"Health check running..."})})};export{S as default};
