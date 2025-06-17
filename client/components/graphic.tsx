import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

type EventData = {
  date: string;   // תאריך בפורמט "YYYY-MM-DD"
  count: number;  // מספר האירועים לאותו יום
};

export default function EventsLineChart() {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  } | null>(null);

  useEffect(() => {
    axios.get<EventData[]>('http://localhost:3000/api/events-by-date') 
      .then(res => {
        const labels = res.data.map(item => item.date);
        const values = res.data.map(item => item.count);

        setChartData({
          labels,
          datasets: [{ data: values }],
        });
      })
      .catch(err => console.error('Error fetching event data:', err));
  }, []);

  if (!chartData) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events by Date</Text>
      <LineChart
        data={chartData}
        width={screenWidth - 32}
        height={250}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#f0f0f0',
          backgroundGradientTo: '#e0e0e0',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 8 },
          propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#2196F3",
          }
        }}
        bezier
        style={{ borderRadius: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 32,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
