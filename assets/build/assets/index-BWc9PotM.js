import{u as a,j as o}from"./fields-B4O9Q4Yk.js";import"./vendor-BwziPlmK.js";import{P as t,s as i}from"./index-DD5Vwil-.js";import{B as l}from"./Layout-Ov5zB63g.js";const p=({element:r})=>{let s,e;return r.id==="user_meta"?(s=i.DANGER,e=a("User")):r.children?(s=r.children.length>0||r.parentId===null?i.SECONDARY:i.WARNING,e=a(r.children.length>0||r.parentId===null?"Parent":"Child")):r.isNative?(s=i.SECONDARY,e=a("Native")):r.isWooCommerce?(s=i.INFO,e="WooCommerce"):(s=i.WARNING,e=a("Custom")),o.jsx(l,{style:s,children:e})};p.propTypes={element:t.object.isRequired};export{p as E};
