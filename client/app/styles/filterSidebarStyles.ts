import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const SIDEBAR_WIDTH = Math.min(screenWidth * 0.85, 320); // max 320px wide

const styles = StyleSheet.create({
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH, // ✅ use fixed responsive width
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    zIndex: 100,
    elevation: 10,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
  },
  clearButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginVertical: 10,
    marginLeft: 16,
  },
  clearButtonText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '500',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ecf0f1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  optionsContainer: {
    marginTop: 8,
    paddingLeft: 8,
  },
  searchInput: {
    backgroundColor: '#f1f2f6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#dfe6e9',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#2c3e50',
  },
  applyButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#2c62b4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default styles;
