import React, {memo} from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import {Link} from "react-router-dom";
import '../../../scss/woocommerce.scss';
import {woocommerceIconsMap} from "../../../constants/woocommerce_icons";
import Boolean from "../../../components/Boolean";
import WooCommerceProductDataVisibility from "../../../components/WooCommerceProductDataVisibility";
import DeleteWooCommerceProductDataModal from "../Modal/DeleteWooCommerceProductDataModal";
import {useFormContext} from "react-hook-form";
import {wpAjaxRequest} from "../../../utils/ajax";
import {setCookieMessage} from "../../../utils/cookies";
import {scrollToTop} from "../../../utils/scroll";
import {refreshPage} from "../../../utils/misc";
import {toast} from "react-hot-toast";

const ProductDataListElement = memo(({record, page, perPage}) => {

    // manage form state
    const { register } = useFormContext();
    const formId = `elements.${record.id}`;

    const handleDuplicate = () => {
        wpAjaxRequest('duplicateAction', {belongsTo: "woo_product_data", find: record.id})
            .then(res => {
                if(res.success === true){
                    setCookieMessage("WooCommerce product data successfully duplicated.");
                    scrollToTop();
                    refreshPage();
                } else {
                    toast.error(res.error);
                }
            }).catch(err => {
            console.error(err);
            toast.error(useTranslation("Unknown error, please retry later"));
        })
        ;
    };

    return (
        <React.Fragment>
            <tr>
                <td style={{
                    width: "24px"
                }}>
                    <label className="checkbox" htmlFor={formId}>
                        <input
                            type="checkbox"
                            id={formId}
                            name={formId}
                            defaultChecked={false}
                            {...register(formId)}
                        />
                        <span/>
                    </label>
                </td>
                <td>
                    <span
                        className={`wcicon-${typeof record.icon === 'object' ? record.icon.icon : woocommerceIconsMap[record.icon]}`}
                        style={{
                            color: "#777",
                            fontSize: "18px"
                        }}
                    />
                </td>
                <td>
                    {record.name}
                </td>
                <td>
                    <Boolean status={record.showInUI}/>
                </td>
                <td>
                    <WooCommerceProductDataVisibility visibility={record.visibility} />
                </td>
                <td>
                    {record.fields.length > 0
                        ?
                        <Link
                            to={`/product-data/product/fields/${record.id}`}
                        >
                            {useTranslation("Manage")}
                        </Link>
                        :
                        <Link
                            to={`/product-data/product/fields/${record.id}`}
                        >
                            {useTranslation("Create")}
                        </Link>
                    }
                </td>
                <td>
                    <div className="i-flex-center s-8">
                        <Link to={`/product-data/product/view/${record.id}`}>
                            {useTranslation("View")}
                        </Link>
                        <Link to={`/product-data/product/edit/${record.id}`}>
                            {useTranslation("Edit")}
                        </Link>
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handleDuplicate();
                            }}
                        >
                            {useTranslation("Duplicate")}
                        </a>
                        <DeleteWooCommerceProductDataModal
                            id={record.id}
                            page={page}
                            perPage={perPage}
                        />
                    </div>
                </td>
            </tr>
        </React.Fragment>
    );
});

ProductDataListElement.propTypes = {
    page: PropTypes.number,
    perPage: PropTypes.number,
    record: PropTypes.object.isRequired
};

export default ProductDataListElement;