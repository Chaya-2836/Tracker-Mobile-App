import { StyleSheet, Dimensions, Platform } from 'react-native';

// Define ChartConfig locally
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

const { width: screenWidth } = Dimensions.get('window');

// Consistent horizontal padding (5% on each side)
const horizontalPadding = screenWidth * 0.05;

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#fff',
    marginHorizontal: horizontalPadding,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    overflow: 'hidden', // makes sure chart doesn't overflow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#34495e',
    textAlign: 'center',
  },
  chart: {
    marginTop: 10,
    borderRadius: 8,
    alignSelf: 'center',
  },
});

export const chartConfig: ChartConfig = {
  backgroundColor: '#fff',
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(44, 98, 180, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(80, 80, 80, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#2c62b4',
  },
};

export default styles;

