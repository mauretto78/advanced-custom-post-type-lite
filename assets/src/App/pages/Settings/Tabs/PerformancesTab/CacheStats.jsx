import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {wpAjaxRequest} from "../../../../utils/ajax";
import useTranslation from "../../../../hooks/useTranslation";
import ManageCacheModal from "../../Modal/ManageCacheModal";

const CacheStats = ({refreshKey = 0}) => {

    const [stats, setStats] = useState(null);

    useEffect(() => {
        wpAjaxRequest("cacheStatsAction", {})
            .then(res => {
                setStats(res);
            })
            .catch(err => console.error(err))
        ;
    }, [refreshKey]);

    if(!stats){
        return (
            <div>
                {useTranslation("Loading...")}
            </div>
        );
    }

    return (
        <table>
            <tbody>
                <tr align="left">
                    <th className="p-4 pl-0">
                        {useTranslation("INFO")}
                    </th>
                    <td>
                        {stats?.info ?? "--"}
                    </td>
                </tr>
                <tr align="left">
                    <th className="p-4 pl-0">
                        {useTranslation("SIZE")}
                    </th>
                    <td>
                        {stats?.size ?? "--"}
                    </td>
                </tr>
                <tr align="left">
                    <th className="p-4 pl-0">
                        {useTranslation("ITEMS")}
                    </th>
                    <td>
                        <div className="i-flex-center s-4">
                            <span>{stats?.itemsCount ?? 0}</span>
                            {stats?.items?.length > 0 && <ManageCacheModal items={stats?.items} />}
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

CacheStats.propTypes = {
    refreshKey: PropTypes.number,
};

export default CacheStats;