import{j as r}from"./fields-PF-HBT_1.js";import"./vendor-Bd2ZL6QG.js";import{P as e}from"./index-CFlPza-g.js";import{g}from"./index.esm-VK9FF9DZ.js";const p=({id:s,defaultValue:t=0,description:a,validate:c,register:i,errors:l,onChangeCapture:n})=>{const o=g(l,s);return r.jsxs("div",{className:"toggle-group",children:[r.jsxs("label",{"data-cy":`toggle-${s}`,className:"toggle",children:[r.jsx("input",{id:s,name:s,type:"checkbox","data-cy":`toggle-checkbox-${s}`,defaultChecked:t,onChangeCapture:n,...i(s,c)}),r.jsx("span",{className:"slider round"})]}),a&&r.jsx("span",{className:"form-description",children:a}),o&&r.jsx("div",{className:"invalid-feedback",children:o.message})]})};p.propTypes={id:e.string.isRequired,defaultValue:e.bool,description:e.string,onChangeCapture:e.func,validate:e.func,register:e.func.isRequired,errors:e.array.isRequired};export{p as T};
