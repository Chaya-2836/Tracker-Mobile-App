import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  filterBarContainer: {
    paddingVertical: 10,
    zIndex: 1,
  },
scrollWrapper: {
  paddingHorizontal: 10,
  alignItems: 'center',
  flexDirection: 'row',
},
dropdownContainer: {
  marginRight: 8,
  minWidth: 1,
},
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  dropdownPanel: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  searchInput: {
    backgroundColor: '#f1f2f6',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#2c3e50',
  },
  clearButton: {
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginLeft: 12,
    height: 36,
    alignSelf: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2c3e50',
  },
  filterByTextContainer: {
  justifyContent: 'center',
  marginRight: 12,
  marginLeft: 6,
},
filterByText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#2c3e50',
},

});

export default styles;
