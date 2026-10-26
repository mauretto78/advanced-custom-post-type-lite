import React from 'react';
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import useTranslation from "../../../hooks/useTranslation";
import {taxonomyLabels} from "../../../constants/taxonomyLabels";
import {wpAjaxRequest} from "../../../utils/ajax";
import {refreshPage} from "../../../utils/misc";
import {toast} from "react-hot-toast";
import {setCookieMessage} from "../../../utils/cookies";
import Card from "../../../components/Card";
import {taxonomyProps} from "../../../props/cptTaxonomyProps.js";

const Labels = ({taxonomy, data}) => {

    const handleRegenerate = () => {
        wpAjaxRequest("regenerateTaxonomyLabelsAction", {taxonomy: taxonomy})
            .then(res => {
                if(res.success) {
                    setCookieMessage("Labels successfully regenerated");
                    refreshPage(50);
                }

                if(res.error){
                    toast.error(res.error);
                }
            })
            .catch(err => {
                console.error(err.message);
            })
        ;
    };

    if(data.length > 0){
        return (
            <Card>
                <div className="acpt-card-row">
                    <span className="label">
                        <button
                            type="button"
                            className="btn-reset"
                            style={{fontWeight: "normal"}}
                            onClick={e => {
                                e.preventDefault();
                                handleRegenerate();
                            }}
                        >
                            {useTranslation("Regenerate")}
                        </button>
                    </span>
                    <span className="value" />
                </div>
                {taxonomyLabels.map((label) => (
                    <CardRow
                        key={label.id}
                        label={useTranslation(label.label)}
                        value={data[0].labels[label.id]}
                    />
                ))}
            </Card>
        );
    }

    return null;
};

Labels.propTypes = {
    taxonomy: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.shape(taxonomyProps)).isRequired,
};

export default Labels;