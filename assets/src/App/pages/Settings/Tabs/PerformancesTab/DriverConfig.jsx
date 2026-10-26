import React from 'react';
import PropTypes from 'prop-types';
import useTranslation from "../../../../hooks/useTranslation";
import CardRow from "../../../../components/Card/CardRow";
import {useFormContext} from "react-hook-form";
import Input from "../../../../components/Forms/Input";
import DriverTest from "./DriverTest";

const DriverConfig = ({driver, config}) => {

    // form context
    const { register, formState: {errors} } = useFormContext();

    // files
    if(driver === "files"){
        return (
            <CardRow
                label={useTranslation("Cache folder settings")}
                value={
                    <React.Fragment>
                        <Input
                            id="cache_config.folder"
                            description={useTranslation("Set the cache folder")}
                            register={register}
                            errors={errors}
                            isRequired={true}
                            defaultValue={config?.folder ?? "cache"}
                            validate={{
                                required: "This field is mandatory"
                            }}
                        />
                        <DriverTest
                            driver={driver}
                            config={config}
                        />
                    </React.Fragment>
                }
            />
        );
    }

    // redis
    if(driver === "redis"){
        return (
            <React.Fragment>
                <CardRow
                    label={useTranslation("Redis settings")}
                    value={
                        <div>
                            <div className="container">
                                <div className="col-4">
                                    <Input
                                        id="cache_config.redis_host"
                                        description={useTranslation("Set the Redis host")}
                                        register={register}
                                        errors={errors}
                                        isRequired={true}
                                        defaultValue={config?.redis_host ?? "127.0.0.1"}
                                        validate={{
                                            required: "This field is mandatory"
                                        }}
                                    />
                                </div>
                                <div className="col-4">
                                    <Input
                                        id="cache_config.redis_port"
                                        description={useTranslation("Set the Redis port")}
                                        register={register}
                                        errors={errors}
                                        isRequired={true}
                                        defaultValue={config?.redis_port ?? 6379}
                                        validate={{
                                            required: "This field is mandatory"
                                        }}
                                    />
                                </div>
                                <div className="col-4">
                                    <Input
                                        type="number"
                                        id="cache_config.redis_database"
                                        description={useTranslation("Set the Redis database")}
                                        register={register}
                                        errors={errors}
                                        isRequired={true}
                                        defaultValue={config?.redis_database ?? 0}
                                        validate={{
                                            required: "This field is mandatory"
                                        }}
                                    />
                                </div>
                            </div>
                            <DriverTest
                                driver={driver}
                                config={config}
                            />
                        </div>
                    }
                />
            </React.Fragment>
        );
    }

    // memcached
    if(driver === "memcached"){
        return (
            <React.Fragment>
                <CardRow
                    label={useTranslation("Memcached settings")}
                    value={
                        <div>
                            <div className="container">
                                <div className="col-6">
                                    <Input
                                        id="cache_config.memcached_host"
                                        description={useTranslation("Set the Memcached host")}
                                        register={register}
                                        errors={errors}
                                        isRequired={true}
                                        defaultValue={config?.memcached_host ?? "127.0.0.1"}
                                        validate={{
                                            required: "This field is mandatory"
                                        }}
                                    />
                                </div>
                                <div className="col-6">
                                    <Input
                                        id="cache_config.memcached_port"
                                        description={useTranslation("Set the Memcached port")}
                                        register={register}
                                        errors={errors}
                                        isRequired={true}
                                        defaultValue={config?.memcached_port ?? 11211}
                                        validate={{
                                            required: "This field is mandatory"
                                        }}
                                    />
                                </div>
                            </div>
                            <DriverTest
                                driver={driver}
                                config={config}
                            />
                        </div>
                    }
                />
            </React.Fragment>
        );
    }

    return null;
};

DriverConfig.propTypes = {
    driver: PropTypes.string,
    config: PropTypes.object,
};

export default DriverConfig;