import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  pickerWrapper: {
    borderWidth: 1.5,
    borderColor: '#2c62b4',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
    width: 140,
    height: 36,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  picker: {
    height: 34,
    width: '100%',
    color: '#2c62b4',
    backgroundColor: 'rgb(236,240,241)', // ✅ צבע רקע חדש
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: Platform.OS === 'android' ? 0 : 6,
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
});
