import { View, Text, ScrollView, useWindowDimensions } from "react-native";
import styles from "../../styles/suspiciousTableStyles";

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
    const { width: screenWidth } = useWindowDimensions();
    const isSmallScreen = screenWidth < 400 ;
    const fontSize = screenWidth < 400 ? 11 : screenWidth < 420 ? 13 : 14;

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={[styles.mediaSourceCol, { fontSize,fontWeight: 'bold' }]}>
                    {isSmallScreen ? "Src" : "Media Source"}
                </Text>
                <Text style={[styles.appIdCol, { fontSize ,fontWeight: 'bold'}]}>
                    {isSmallScreen ? "App" : "App ID"}
                </Text>
                <Text style={[styles.clicksCol, { fontSize,fontWeight: 'bold' }]}>
                    {isSmallScreen ? "Clk" : "Clicks"}
                </Text>
                <Text style={[styles.impressionsCol, { fontSize,fontWeight: 'bold' }]}>
                    {isSmallScreen ? "Imp" : "Impressions"}
                </Text>
                <Text style={[styles.conversionsCol, { fontSize,fontWeight: 'bold' }]}>
                    {isSmallScreen ? "Conv" : "Conversions"}
                </Text>
                <Text style={[styles.cvrCol, { fontSize }]}>
                    CVR
                </Text>
            </View>

            <ScrollView style={{ maxHeight: 200, width: "100%" }} nestedScrollEnabled>
                {data.map((item, index) => (
                    <View key={index} style={styles.dataRow}>
                        <Text style={[styles.mediaSourceCol, { fontSize }]}>{item.media_source}</Text>
                        <Text style={[styles.appIdCol, { fontSize }]}>{item.app_id}</Text>
                        <Text style={[styles.clicksCol, { fontSize }]}>{item.clicks}</Text>
                        <Text style={[styles.impressionsCol, { fontSize }]}>{item.impressions}</Text>
                        <Text style={[styles.conversionsCol, { fontSize }]}>{item.conversions}</Text>
                        <Text
                            style={[
                                styles.cvrCol,
                                { fontSize, color: item.CVR < 0.01 ? "#e74c3c" : "#27ae60" }
                            ]}
                        >
                            {(item.CVR * 100).toFixed(2)}%
                        </Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}