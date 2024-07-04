import React from 'react';
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import useTranslation from "../../../hooks/useTranslation";

const Basic = ({data}) => {

    if(data.length > 0){
        return (
            <div className="with-border b-rounded">
                <CardRow
                    label={useTranslation("Slug")}
                    value={data[0].slug}
                />
                <CardRow
                    label={useTranslation("Singular")}
                    value={data[0].singular}
                />
                <CardRow
                    label={useTranslation("Plural")}
                    value={data[0].plural}
                />
            </div>
        );
    }
};

Basic.propTypes = {
    data: PropTypes.object.isRequired,
};

export default Basic;