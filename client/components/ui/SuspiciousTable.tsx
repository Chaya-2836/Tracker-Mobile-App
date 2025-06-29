import { View, Text, StyleSheet } from "react-native";
import styles from "../../app/styles/suspiciousTableStyles"
type SuspiciousItem = {
  media_source: string;
  app_id: string;
  clicks: number;
  impressions: number;
  conversions: number;
  CVR: number;
};

type Props = {
  data: SuspiciousItem[];
};

export default function SuspiciousTable({ data }: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.headerRow}>
        <Text style={styles.cell}>Media Source</Text>
        <Text style={styles.cell}>App ID</Text>
        <Text style={styles.cell}>Clicks</Text>
        <Text style={styles.cell}>Impressions</Text>
        <Text style={styles.cell}>Conversions</Text>
        <Text style={styles.cell}>CVR</Text>
      </View>

      {data.map((item, index) => (
        <View key={index} style={styles.dataRow}>
          <Text style={styles.cell}>{item.media_source}</Text>
          <Text style={styles.cell}>{item.app_id}</Text>
          <Text style={styles.cell}>{item.clicks}</Text>
          <Text style={styles.cell}>{item.impressions}</Text>
          <Text style={styles.cell}>{item.conversions}</Text>
          <Text
            style={[
              styles.cell,
              { color: item.CVR < 0.01 ? "red" : "green" }
            ]}
          >
            {(item.CVR * 100).toFixed(2)}%
          </Text>
        </View>
      ))}
    </View>
  );
}