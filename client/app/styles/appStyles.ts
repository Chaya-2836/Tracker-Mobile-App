import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingTop: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#2c3e50',
  },
  toggleButton: {
  paddingVertical: 10,
  paddingHorizontal: 20,
  marginHorizontal: 5,
  backgroundColor: '#ecf0f1',
  borderRadius: 8,
},
activeButton: {
  backgroundColor: '#2c62b4',
},
buttonText: {
  color: '#34495e',
  fontWeight: '600',
},
activeButtonText: {
  color: '#fff',
},
buttonGroup: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginVertical: 10,
  paddingHorizontal: 20,
},


});

export default styles;