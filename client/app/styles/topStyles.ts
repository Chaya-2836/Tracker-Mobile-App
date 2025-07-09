import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({

  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    width: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    textAlign: 'center',
  },
  rowWrap: {
    flexDirection: 'row',
    gap: 20,
    paddingRight: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
    width: "90%",
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#34495e',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
  },
  name: {
    fontSize: 14,
    color: '#333',
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2980b9',
  },
});
export default styles;
