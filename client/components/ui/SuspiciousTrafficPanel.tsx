import { fetchSuspiciousTrafficCases } from "../../api/trafficAnalyticsAPI";
import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import styles from "../../styles/suspiciousTrafficPanelStyles";
import SuspiciousTable from "./SuspiciousTable";
import { IconButton } from "react-native-paper";

export default function SuspiciousTrafficPanel() {
  const { width: screenWidth } = useWindowDimensions();
  const fontSize = screenWidth < 400 ? 12 : 16;
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
    <>
      <View style={styles.panelContainer}>
        <View style={styles.alertRow}>
          <IconButton
            icon="alert"
            size={20}
            iconColor="#d35400"
            style={styles.iconInline}
          />
          <Text style={[styles.alertTitle, { fontSize }]}>
            Suspicious Cases Detected
          </Text>
          <TouchableOpacity onPress={() => setShowTable((prev) => !prev)}>
            <Text style={[styles.linkStyle, { fontSize }]}>
              {showTable ? "Hide table" : "Show table"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showTable && (
        <View style={styles.tableContainer}>
          <SuspiciousTable data={suspiciousCases} />
        </View>
      )}
    </>
  );
}