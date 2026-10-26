import React, {useState} from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../../hooks/useTranslation";
import Card from "../../../../components/Card";
import CardRow from "../../../../components/Card/CardRow";
import {useFormContext} from "react-hook-form";
import Toggle from "../../../../components/Forms/Toggle";
import Button from "../../../../components/Button";
import {styleVariants} from "../../../../constants/styles";
import {wpAjaxRequest} from "../../../../utils/ajax";
import {toast} from "react-hot-toast";
import Select from "../../../../components/Forms/Select";
import {cacheDriverList} from "../../../../constants/cache";
import DriverConfig from "./DriverConfig";
import CacheStats from "./CacheStats";
import Input from "../../../../components/Forms/Input";

const PerformancesTab = ({enable_cache, enable_meta_cache, cache_driver, cache_config, cache_folder}) => {

    // local state
    const [cache, setCache] = useState(enable_cache);
    const [driver, setDriver] = useState(cache_driver);
    const [flushing, setFlushing] = useState(false);
    const [statsRefreshKey, setStatsRefreshKey] = useState(0);

    // form context
    const { register, formState: {errors} } = useFormContext();

    const flushSuccessLabel = useTranslation("Cache was successfully flushed");
    const flushErrorLabel = useTranslation("Could not flush the cache");
    const flushCacheLabel = useTranslation("Flush cache");
    const flushingLabel = useTranslation("Flushing…");

    const handleFlushCache = () => {
        setFlushing(true);
        wpAjaxRequest("flushCacheAction", {})
            .then(res => {
                if(res.success === true){
                    toast.success(res.message ?? flushSuccessLabel);
                    setStatsRefreshKey(k => k + 1);
                } else {
                    toast.error(res.error ?? flushErrorLabel);
                }
            })
            .catch(err => {
                console.error(err);
                toast.error(flushErrorLabel);
            })
            .finally(() => setFlushing(false))
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
                        onChangeCapture={(e) => {
                            setCache(!cache)
                        }}
                    />
                }
            />
            {cache ? (
                <React.Fragment>
                    <CardRow
                        label={useTranslation("Enable cache for meta data")}
                        value={
                            <Toggle
                                id="enable_meta_cache"
                                description={useTranslation("Enable cache for meta data")}
                                register={register}
                                errors={errors}
                                defaultValue={enable_meta_cache}
                            />
                        }
                    />
                    <CardRow
                        label={useTranslation("Cache driver")}
                        value={
                            <Select
                                id="cache_driver"
                                label={useTranslation("Cache driver")}
                                placeholder={useTranslation("Set the desired cache driver to improve ACPT performances")}
                                description={useTranslation("Set the desired cache driver to improve ACPT performances")}
                                register={register}
                                defaultValue={cache_driver}
                                values={cacheDriverList}
                                isRequired={false}
                                errors={errors}
                                onChangeCapture={(e) => {
                                    setDriver(e.target.value)
                                }}
                            />
                        }
                    />
                    <DriverConfig
                        config={cache_config}
                        driver={driver}
                    />
                    {driver === "files" && (
                        <CardRow
                            label={useTranslation("Cache folder (absolute path)")}
                            value={
                                <Input
                                    id="cache_folder"
                                    description={useTranslation("Optional: specify an absolute server path for the cache directory (e.g. /var/cache/acpt). Leave empty to use the default plugin directory.")}
                                    register={register}
                                    errors={errors}
                                    isRequired={false}
                                    defaultValue={cache_folder ?? ""}
                                />
                            }
                        />
                    )}
                    <CardRow
                        label={useTranslation("Cache stats")}
                        value={<CacheStats refreshKey={statsRefreshKey}/>}
                    />
                    <CardRow
                        label={useTranslation("Flush the ACPT cache")}
                        value={
                            <Button
                                style={styleVariants.SECONDARY}
                                disabled={flushing}
                                testId="flush-cache"
                                onClick={e => {
                                    e.preventDefault();
                                    handleFlushCache();
                                }}
                            >
                                {flushing ? flushingLabel : flushCacheLabel}
                            </Button>
                        }
                    />
                </React.Fragment>
            ) : null}
        </Card>
    );
};

PerformancesTab.propTypes = {
    enable_cache: PropTypes.bool,
    enable_meta_cache: PropTypes.bool,
    cache_driver: PropTypes.string,
    cache_config: PropTypes.object,
    cache_folder: PropTypes.string,
};

export default PerformancesTab;