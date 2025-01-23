import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../hooks/useTranslation";
import Card from "../../../components/Card";
import CardRow from "../../../components/Card/CardRow";
import {useFormContext} from "react-hook-form";
import Toggle from "../../../components/Forms/Toggle";
import Button from "../../../components/Button";
import {styleVariants} from "../../../constants/styles";
import {wpAjaxRequest} from "../../../utils/ajax";
import {toast} from "react-hot-toast";

const PerformancesTab = ({enable_cache}) => {

    const { register, formState: {errors} } = useFormContext();

    const handleFlushCache = () => {
        wpAjaxRequest("flushCacheAction", {})
            .then(res => {
                if(res.success === true){
                    toast.success(useTranslation("Cache was successfully flushed"));
                } else {
                    toast.error(res.error);
                }
            })
            .catch(err => console.error(err))
        ;
    };

    return (
        <Card>
            <CardRow
                label={useTranslation("Enable ACPT cache")}
                value={
                    <Toggle
                        id="enable_cache"
                        description={useTranslation("Enable the ACPT cache. The cache stores the MySQL results in simple textual files to avoid useless DB calls.")}
                        register={register}
                        errors={errors}
                        defaultValue={enable_cache}
                    />
                }
            />
            {enable_cache ? (
                <CardRow
                    label={useTranslation("Flush the ACPT cache")}
                    value={
                        <Button
                            style={styleVariants.SECONDARY}
                            onClick={e => {
                                e.preventDefault();
                                handleFlushCache();
                            }}
                        >
                            {useTranslation("Flush cache")}
                        </Button>
                    }
                />
            ) : null}
        </Card>
    );
};

PerformancesTab.propTypes = {
    enable_cache: PropTypes.bool
};

export default PerformancesTab;