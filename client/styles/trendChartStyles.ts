import { StyleSheet, Platform } from 'react-native';

type ChartConfig = {
  backgroundColor: string;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  decimalPlaces?: number;
  color: (opacity?: number) => string;
  labelColor?: (opacity?: number) => string;
  style?: object;
  propsForDots?: object;
  propsForLabels?: object;
};

const Chartstyles = StyleSheet.create({
  title:{
        fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#34495e',
    textAlign: 'center'
  },
  chartContainer: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignSelf: 'center',
    overflow: 'hidden',
    width: '95%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  chart: {
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  leftArrow: {
    position: 'absolute',
    top: 100,
    left: 5,
    zIndex: 10,
    padding: 0,
    borderRadius: 0,
    elevation: 0,
  },

  rightArrow: {
    position: 'absolute',
    top: 100,
    right: 5,
    zIndex: 10,
    padding: 0,
    borderRadius: 0,
    elevation: 0,
  },
  arrowIcon: {
  fontSize: 28,
  color: '#666', 
  textAlign: 'center',
},


  arrowText: {
    fontSize: 22,
    color: '#666',
    textAlign: 'center',
  }
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
    r: '3',
    strokeWidth: '1',
    stroke: '#2c62b4',
  },
  propsForLabels: {
    fontSize: 10,
  },
};

export default Chartstyles;