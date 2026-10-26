import React from 'react';
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import useTranslation from "../../../hooks/useTranslation";
import Card from "../../../components/Card";
import {taxonomyProps} from "../../../props/cptTaxonomyProps.js";

const Basic = ({data}) => {

    if(data.length > 0){
        return (
            <Card>
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
            </Card>
        );
    }

    return null;
};

Basic.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape(taxonomyProps)).isRequired,
};

export default Basic;