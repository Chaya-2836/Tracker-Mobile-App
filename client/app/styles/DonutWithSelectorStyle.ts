import { StyleSheet, Platform } from 'react-native';

export default StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    alignSelf: 'center',
    overflow: 'hidden',
    width: '95%',

    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#34495e',
    textAlign: 'center',
  },
  wrapper: {
    margin: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
  },
  noData: {
    marginTop: 20,
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});