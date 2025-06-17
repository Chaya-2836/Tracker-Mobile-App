import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#34495e',
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2980b9',
    textAlign: 'center',
  },
});

export default styles;