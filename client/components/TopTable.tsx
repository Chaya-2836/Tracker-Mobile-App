import React, { useState } from "react";
import { View, Text, TouchableOpacity, useWindowDimensions } from "react-native";
import styles from "../styles/topStyles";
import { formatNumber, safeName } from "../api/utils";
import { fetchAppsByAgency, fetchAppsByMediaSource } from "../api/trafficAnalyticsAPI";
import tableStyles from "../styles/tableStyles";
import buttonStyles from "../styles/buttonStyles";
type TopTableProps = {
  title: string;
  data: Array<{ name: string;[key: string]: number | string }>;
  topN: number;
  sortBy: string;
  scene: "media" | "agencies" | "apps";
};

export default function TopTable({ title, data, topN, sortBy, scene }: TopTableProps) {
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 768;
  const topData = data
    .filter(item => item && Object.keys(item).length > 0)
    .sort((a, b) => Number(b[sortBy]) - Number(a[sortBy]))
    .slice(0, topN);

  let columns: Array<typeof topData> = [];

  if (isLargeScreen) {
    columns = [[], [], []];
    topData.forEach((item, i) => {
      columns[i % 3].push(item);
    });
  } else {
    columns = [topData];
  }

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [appsAnalytics, setAppsAnalytics] = useState<Record<string, any[]>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const onViewAppsAnalytics = async (item: any) => {

    if (expandedId === item.name) {
      setExpandedId(null);
      return;
    }

    if (!appsAnalytics[item.name]) {
      setLoadingId(item.name);
      try {
        let result = [];
        if (scene === "media") {
          result = await fetchAppsByMediaSource(item.media_source);
          console.log('Fetched apps by media source:', result);
        } else if (scene === "agencies") {
          result = await fetchAppsByAgency(item.name);
          console.log('Fetched apps by agency:', result);
        }
        setAppsAnalytics(prev => ({ ...prev, [item.name]: result }));
      } catch (err) {
        console.error("Failed to load app analytics", err);
      } finally {
        setLoadingId(null);
      }
    }

    setExpandedId(item.name);
  };

  return (
    <View>
      <Text
        style={[
          styles.title,
          { paddingLeft: isLargeScreen ? 30 : 0 }
        ]}
      >
        {title}
      </Text>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {columns.map((column, colIndex) => (
          <View
            key={colIndex}
            style={{ flex: 1, paddingHorizontal: isLargeScreen ? 34 : 0 }}
          >
            {column.map((item, i) => (
              <View key={i}>
                <View style={styles.row}>
                  <Text style={styles.name}>{safeName(item.name)}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={styles.value}>{formatNumber(item[sortBy])}</Text>

                    {scene !== "apps" && (
                      <TouchableOpacity
                        onPress={() => onViewAppsAnalytics(item)}
                        style={buttonStyles.button}
                      >
                        <Text style={buttonStyles.icon}>
                          {expandedId === item.name ? "▼" : "▶"}
                        </Text>
                        <Text style={buttonStyles.label}>App Analytics</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {expandedId === item.name && (
                  <View style={tableStyles.container}>
                    {/* Header Row */}
                    <View style={tableStyles.row}>
                      <Text style={[tableStyles.header, tableStyles.colAppName]}>App Name</Text>
                      <Text style={[tableStyles.header, tableStyles.colSmall]}>Clicks</Text>
                      <Text style={[tableStyles.header, tableStyles.colSmall]}>Impressions</Text>
                      <Text style={[tableStyles.header, tableStyles.colSmall]}>Conversions</Text>
                    </View>

                    {/* Data Rows */}
                    {appsAnalytics[item.name]?.map((app, idx) => (
                      <View key={idx} style={tableStyles.row}>
                        <Text style={tableStyles.colAppName}>{app.app_id}</Text>
                        <Text style={tableStyles.colSmall}>{formatNumber(app.clicks)}</Text>
                        <Text style={tableStyles.colSmall}>{formatNumber(app.impressions)}</Text>
                        <Text style={tableStyles.colSmall}>{formatNumber(app.conversions)}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
