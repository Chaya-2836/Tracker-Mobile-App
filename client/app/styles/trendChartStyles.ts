import { StyleSheet, Dimensions, Platform } from 'react-native';

type ChartConfig = {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces?: number;
  color: (opacity?: number) => string;
  labelColor?: (opacity?: number) => string;
  style?: object;
  propsForDots?: object;
};

const Chartstyles = StyleSheet.create({

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#34495e',
    textAlign: 'center',
  },
  chart: {
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
});

export const chartConfig: ChartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(44, 98, 180, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(50, 50, 50, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#2c62b4',
  },
};

export default Chartstyles;
