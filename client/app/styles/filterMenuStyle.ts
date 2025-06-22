import { StyleSheet, Dimensions, Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
floatingToggleButton: {
  position: 'absolute',
  bottom: 30,
  right: 20,
  zIndex: 1000,
  backgroundColor: '#fff',
  padding: 10,
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
  right: 0,
  bottom: 0,
  width: 260,
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
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#34495e',
  },

  inputGroup: {
    marginBottom: 20,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#f4f6f8',
    borderRadius: 6,
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },

  optionItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 6,
    backgroundColor: '#f0f4f7',
  },

  optionItemSelected: {
    backgroundColor: '#2c62b4',
  },

  optionText: {
    color: '#34495e',
    fontSize: 14,
  },

  optionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },

  clearBtn: {
    marginTop: 24,
    backgroundColor: '#95a5a6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
  },

  btnText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default styles;
