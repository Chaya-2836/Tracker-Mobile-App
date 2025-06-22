import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
headerContainer: {
  paddingHorizontal: 16,
  paddingTop: 20,
  paddingBottom: 16, // was 5 → now 16 to add space below the button
  alignItems: 'center',
  position: 'relative',
},

  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
header: {
  fontSize: 26,
  fontWeight: '700',
  textAlign: 'center',
  color: '#2c3e50',
  marginBottom: 4,
},
filterButton: {
  position: 'absolute',
  top: 30, // was 24 → now 30 for more space below the title
  left: 16,
  backgroundColor: '#fff',
  paddingVertical: 5,
  paddingHorizontal: 10,
  borderRadius: 4,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
},


filterButtonText: {
  color: '#555',
  fontSize: 13,
  fontWeight: '500',
},

  tabBarOverride: {
    indicatorStyle: { backgroundColor: '#2c62b4' },
    style: { backgroundColor: '#ecf0f1' },
    labelStyle: { color: '#2c3e50', fontWeight: '600' },
    activeColor: '#2c62b4',
    inactiveColor: '#7f8c8d',
  },
});

export default styles;
