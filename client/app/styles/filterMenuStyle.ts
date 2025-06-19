import { StyleSheet, Dimensions, Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1000,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 250,
    backgroundColor: '#fff',
    padding: 16,
    borderLeftWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 5,
    elevation: 8,
    zIndex: 999,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#34495e',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontWeight: '500',
    color: '#2c3e50',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#2c62b4',
    borderRadius: 6,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  applyBtn: {
    backgroundColor: '#2c62b4',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  clearBtn: {
    backgroundColor: '#95a5a6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default styles;
