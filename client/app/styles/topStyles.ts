import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 15,
  },
  input: {
    width: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
     padding: 5,
    textAlign: 'center',
  },

  // card: {
  //   backgroundColor: '#fff',
  //   padding: 16,
  //   borderRadius: 12,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.05,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 8,
  //   elevation: 2,
  //   margin: 10,
  //   width: '95%',
  //   alignSelf: 'center',
  // },
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
