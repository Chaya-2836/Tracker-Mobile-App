import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import GroupBySelector from './GroupBySelector';
import DonutChartWithLegend from './DonutChartWithLegend';
import { getAgentStatsByGroup, AgentItem } from '../../Api/getAgentStatsByGroup'

export default function DonutWithSelector() {
    const [groupBy, setGroupBy] = useState('media_source');
    const [data, setData] = useState<AgentItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAgentStatsByGroup(groupBy)
            .then(setData)
            .finally(() => setLoading(false));
    }, [groupBy]);

    return (
        <View style={styles.wrapper}>
            <GroupBySelector value={groupBy} onChange={setGroupBy} />
            {loading ? (
                <ActivityIndicator size="large" color="#2c62b4" style={{ marginTop: 20 }} />
            ) : data.length === 0 ? (
                <Text style={styles.noData}>No data to display</Text>
            ) : (
                <DonutChartWithLegend data={data} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 16,
        paddingHorizontal: 16,
    },
    noData: {
        marginTop: 20,
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
});