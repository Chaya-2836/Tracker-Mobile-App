import { View, Text } from "react-native";
import styles from "@/app/styles/topStyles";
import { formatNumber, safeName } from "../app/Api/utils";

type TopCardProps = {
  title: string;
  data: Array<{ name: string; [key: string]: number | string }>;
  topN: number;
  sortBy: string;
};

export default function TopCard({ title, data, topN, sortBy }: TopCardProps) {
  const topData = [...data]
    .sort((a, b) => Number(b[sortBy]) - Number(a[sortBy]))
    .slice(0, topN);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {topData.map((item, i) => (
        <View key={i} style={styles.row}>
<Text style={styles.name}>{safeName(item.name)}</Text>
<Text style={styles.value}>{formatNumber(item[sortBy])}</Text>

        </View>
      ))}
    </View>
  );
}
