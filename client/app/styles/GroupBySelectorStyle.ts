import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
   container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    overflow: 'hidden',
    width: 120, 
    height: 34,
  },
  wrapper: {
    padding: 10,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
    color: '#444',
  },
  selector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionItem: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeOption: {
    borderColor: '#2c62b4',
    backgroundColor: '#dbe9ff',
  },
  optionText: {
    fontSize: 13,
    color: '#666',
  },
  activeText: {
    color: '#000',
    fontWeight: 'bold',
  },
  option: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  active: {
    borderColor: '#2c62b4',
    backgroundColor: '#dbe9ff',
  },
   picker: {
    height: 34,
    width: '100%',
    color: '#4a4a4a',
    fontSize: 13,
    paddingHorizontal: Platform.OS === 'android' ? 0 : 6,
  },
});
