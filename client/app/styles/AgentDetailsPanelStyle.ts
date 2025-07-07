import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 6,
  },
  containerEmpty: {
    padding: 16,
    alignItems: 'center',
  },
  placeholder: {
    fontStyle: 'italic',
    color: '#888',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
   logo: {
    width: 32,
    height: 32,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  value: {
    fontWeight: '600',
  },
});