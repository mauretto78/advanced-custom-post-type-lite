import React from 'react';
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import useTranslation from "../../../hooks/useTranslation";
import {postLabels} from "../../../constants/postLabels";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";
import {refreshPage} from "../../../utils/misc";
import Card from "../../../components/Card";
import {setCookieMessage} from "../../../utils/cookies";

const Labels = ({postType, data}) => {

    const handleRegenerate = () => {
        wpAjaxRequest("regeneratePostLabelsAction", {postType: postType})
            .then(res => {
                if(res.success) {
                    setCookieMessage("Labels successfully regenerated");
                    refreshPage(50);
                }

                if(res.error){
                    toast.error(error);
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
                        <a
                            style={{fontWeight: "normal"}}
                            href="#"
                            onClick={e => {
                                e.preventDefault();
                                handleRegenerate();
                            }}
                        >
                            {useTranslation("Regenerate")}
                        </a>
                    </span>
                    <span className="value" />
                </div>
                {postLabels.map((label) => (
                    <CardRow
                        index={label.id}
                        label={useTranslation(label.label)}
                        value={data[0].labels[label.id]}
                    />
                ))}
            </Card>
        );
    }
};

Labels.propTypes = {
    postType: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
};

export default Labels;