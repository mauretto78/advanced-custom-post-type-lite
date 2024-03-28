import React from 'react';
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import useTranslation from "../../../hooks/useTranslation";
import {taxonomyLabels} from "../../../constants/taxonomyLabels";

const Labels = ({data}) => {

    if(data.length > 0){
        return (
            <div className="with-border b-rounded">
                {taxonomyLabels.map((label) => (
                    <CardRow
                        index={label.id}
                        label={useTranslation(label.label)}
                        value={data[0].labels[label.id]}
                    />
                ))}
            </div>
        );
    }
};

Labels.propTypes = {
    data: PropTypes.object.isRequired,
};

export default Labels;