import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
  overlayContainer: {
    position: 'relative',
    zIndex: 10,
    backgroundColor: '#fff',
    paddingTop: 6, 
  },
  scrollWrapper: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 4,
  },
  dropdownWrapper: {
    marginRight: 12,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 6,
    width: 140,
  },
  dropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  floatingDropdown: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcdde1',
    padding: 10,
    marginTop: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    maxHeight: 240,
    zIndex: 99,
  },
  dropdownScroll: {
    maxHeight: 160,
  },
  searchInput: {
    backgroundColor: '#f1f2f6',
    height:30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    marginTop:2,
    marginBottom: 8,
    paddingLeft:6,
    fontSize: 13,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  optionItemSelected: {
    backgroundColor: '#d6eaff',
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
  },
  optionTextSelected: {
    fontWeight: 'bold',
    color: '#1b4f72',
  },
  optionIcon: {
    marginLeft: 8,
  },
  actionBtn: {
    justifyContent: 'center',
    marginLeft: 12,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: 6,
    backgroundColor: '#ecf0f1',
    alignSelf: 'center',
  },
  btnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2c3e50',
  },
  filterLabel: {
  fontSize: 14,
  fontWeight: '500',
  color: '#2c3e50',
  marginTop: 8,
  marginBottom: 4,
},
});

export default styles;
