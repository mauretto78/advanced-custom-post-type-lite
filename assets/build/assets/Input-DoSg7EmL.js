import{j as a}from"./fields-lEbqKXfy.js";import{R}from"./vendor-Bd2ZL6QG.js";import{P as e}from"./index-Bq-K6t3F.js";import{g as v}from"./index.esm-VK9FF9DZ.js";const I=({innerRef:i,type:u="text",size:m="default",placeholder:p,id:r,defaultValue:c,description:t,step:n,min:o,max:l,readOnly:d,onClick:f,onChangeCapture:g,validate:x,register:y,errors:b,autoFocus:h=!1,disabled:j=!1})=>{const s=v(b,r);return a.jsxs(R.Fragment,{children:[a.jsx("input",{ref:i,id:r,"data-cy":`input-${r}`,name:r,type:u,autoFocus:h,disabled:j,min:o||null,max:l||null,step:n||"any",defaultValue:c,placeholder:p,onChangeCapture:g,onClick:f,readOnly:d,"aria-invalid":s?"true":"false",className:`form-control ${m} ${s?"has-errors":""}`,...y(r,x)}),s&&a.jsx("div",{"data-cy":`input-error-${r}`,className:"invalid-feedback",children:a.jsx("span",{dangerouslySetInnerHTML:{__html:s.message}})}),t&&a.jsx("div",{className:"form-description",dangerouslySetInnerHTML:{__html:t}})]})};I.propTypes={id:e.string.isRequired,size:e.oneOf(["default","sm"]),innerRef:e.func,placeholder:e.string,defaultValue:e.string,description:e.string,readOnly:e.bool,min:e.number,max:e.number,step:e.number,onChangeCapture:e.func,validate:e.func,register:e.func.isRequired,errors:e.array.isRequired,autoFocus:e.bool,disabled:e.bool,type:e.oneOf(["text","color","email","number","phone","tel","url","date","datetime-local","time"])};export{I};
