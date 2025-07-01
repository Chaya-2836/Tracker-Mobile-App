import { fetchSuspiciousTrafficCases } from "@/app/Api/trafficAnalyticsAPI";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import styles from "../../app/styles/suspiciousTrafficPanelStyles";

import SuspiciousTable from "./SuspiciousTable";

export default function SuspiciousTrafficPanel() {
    const [suspiciousCases, setSuspiciousCases] = useState([]);
    const [hasSuspicious, setHasSuspicious] = useState(false);
    const [showTable, setShowTable] = useState(false);

    useEffect(() => {
        const loadSuspiciousData = async () => {
            try {
                const result = await fetchSuspiciousTrafficCases();
                setSuspiciousCases(result);
                setHasSuspicious(result.length > 0);
            } catch (err) {
                console.error("Error fetching suspicious traffic cases:", err);
            }
        };

        loadSuspiciousData();
    }, []);

    if (!hasSuspicious) return null;

    return (
        <View style={styles.panelContainer}>
            <Text style={styles.alertTitle}>Suspicious Cases Detected in Traffic Analysis</Text>

            <TouchableOpacity onPress={() => setShowTable(prev => !prev)}>
                <Text style={styles.linkStyle}>
                    {showTable ? "Hide suspicious table" : "Show suspicious table"}
                </Text>
            </TouchableOpacity>

            {showTable && (
                
                    <SuspiciousTable data={suspiciousCases} />
            
            )}
        </View>
    );
}