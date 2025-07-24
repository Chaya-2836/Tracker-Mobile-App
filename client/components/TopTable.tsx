import { View, Text, useWindowDimensions } from "react-native";
import styles from "../styles/topStyles";
import { formatNumber, safeName } from "../api/utils"

type TopCardProps = {
  title: string;
  data: Array<{ name: string;[key: string]: number | string }>;
  topN: number;
  sortBy: string;
};

export default function TopCard({ title, data, topN, sortBy }: TopCardProps) {
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 768;
  const topData = data
    .filter(item => item && Object.keys(item).length > 0)
    .sort((a, b) => Number(b[sortBy]) - Number(a[sortBy]))
    .slice(0, topN);


  let columns: Array<typeof topData> = [];

  if (isLargeScreen) {
    // Split into 3 columns on large screens
    columns = [[], [], []];
    topData.forEach((item, i) => {
      columns[i % 3].push(item);
    });
  } else {
    // Small screen = single column
    columns = [topData];
  }

  return (
    <View >
      <Text style={[styles.title, { paddingLeft: isLargeScreen ? 30 : 0 }]}>{title}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {columns.map((column, colIndex) => {
          if (column.length === 0) return null;
          return (
            <View
              key={colIndex}
              style={{ flex: 1, paddingHorizontal: isLargeScreen ? 34 : 0 }}
            >
              {column.map((item, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.name}>{safeName(item.name)}</Text>
                  <Text style={styles.value}>{formatNumber(item[sortBy])}</Text>
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </View>
  );
}
