import React from 'react';
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";

const BasicElement = () => {

    // manage global state
    const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
    const data = {
        slug: fetched[0].slug,
        singular: fetched[0].singular,
        plural: fetched[0].plural,
    };

    // manage local state
    const {taxonomy} = useParams();

    return (
        <div>
            <table className="acpt-table acpt-table-secondary">
                <tr>
                    <th style={{width: '180px'}}>Slug</th>
                    <td>{data.slug}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Singular</th>
                    <td>{data.singular}</td>
                </tr>
                <tr>
                    <th style={{width: '180px'}}>Plural</th>
                    <td>{data.plural}</td>
                </tr>
            </table>
        </div>
    );
};

export default BasicElement;



// import React from 'react';
// import {Link, useParams} from "react-router-dom";
// import {useSelector} from "react-redux";
// import {Icon} from "@iconify/react";
//
// const BasicElement = () => {
//
//     // manage global state
//     const {fetched} = useSelector(state => state.fetchTaxonomiesReducer);
//     const data = {
//         slug: fetched[0].slug,
//         singular: fetched[0].singular,
//         plural: fetched[0].plural,
//     };
//
//     // manage local state
//     const {taxonomy} = useParams();
//
//     return (
//         <div>
//             <table className="acpt-table acpt-table-secondary mb-3">
//                 <tr>
//                     <th style={{width: '180px'}}>Slug</th>
//                     <td>{data.slug}</td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Singular</th>
//                     <td>{data.singular}</td>
//                 </tr>
//                 <tr>
//                     <th style={{width: '180px'}}>Plural</th>
//                     <td>{data.plural}</td>
//                 </tr>
//             </table>
//             <Link
//                 className="acpt-btn acpt-btn-primary"
//                 to={`/edit_taxonomy/${taxonomy}/1`}>
//                 <Icon icon="bx:bx-edit" width="18px" />
//                 Edit
//             </Link>
//         </div>
//     );
// };
//
// export default BasicElement;