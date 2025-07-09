import { View, Text, useWindowDimensions } from "react-native";
import styles from "@/app/styles/topStyles";
import { formatNumber, safeName } from "../Api/utils";

type TopCardProps = {
  title: string;
  data: Array<{ name: string; [key: string]: number | string }>;
  topN: number;
  sortBy: string;
};

export default function TopCard({ title, data, topN, sortBy }: TopCardProps) {
  const { width } = useWindowDimensions();

  const isLargeScreen = width >= 768; // 768px ומעלה = מסך רחב (כמו מחשב/טאבלט)

  const topData = [...data]
    .sort((a, b) => Number(b[sortBy]) - Number(a[sortBy]))
    .slice(0, topN);

  let columns: Array<typeof topData> = [];

  if (isLargeScreen) {
    // מחלק ל־3 עמודות במסכים גדולים
    columns = [[], [], []];
    topData.forEach((item, i) => {
      columns[i % 3].push(item);
    });
  } else {
    // מסך קטן = עמודה אחת
    columns = [topData];
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {columns.map((column, colIndex) => (
          <View
            key={colIndex}
            style={{ flex: 1, paddingHorizontal: isLargeScreen ? 8 : 0 }}
          >
            {column.map((item, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.name}>{safeName(item.name)}</Text>
                <Text style={styles.value}>{formatNumber(item[sortBy])}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
