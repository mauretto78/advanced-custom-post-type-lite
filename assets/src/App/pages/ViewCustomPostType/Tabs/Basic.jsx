import React from 'react';
import PropTypes from 'prop-types';
import CardRow from "../../../components/Card/CardRow";
import useTranslation from "../../../hooks/useTranslation";
import ElementIcon from "../../../components/ElementIcon";
import Badge from "../../../components/Badge";
import Card from "../../../components/Card";
import {customPostTypeProps} from "../../../props/cptTaxonomyProps.js";

const Basic = ({data}) => {

    if(data.length > 0){
        return (
            <Card>
                <CardRow
                    label={useTranslation("Name")}
                    value={data[0].name}
                />
                <CardRow
                    label={useTranslation("Singular")}
                    value={data[0].singular}
                />
                <CardRow
                    label={useTranslation("Plural")}
                    value={data[0].plural}
                />
                <CardRow
                    label={useTranslation("Icon")}
                    value={<ElementIcon value={data[0].icon}/>}
                />
                <CardRow
                    label={useTranslation("Supports")}
                    value={
                        <div className="i-flex-center s-8">
                            {data[0].supports.map((s)=>(
                                <Badge key={s}>{s}</Badge>
                            ))}
                        </div>
                    }
                />
            </Card>
        );
    }

    return null;
};

Basic.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape(customPostTypeProps)).isRequired,
};

export default Basic;