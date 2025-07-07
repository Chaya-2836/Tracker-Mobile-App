import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    gap: 20,
    padding: 10,
    alignItems: 'flex-start',
  },
  legendContainer: {
    marginLeft: 12,
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  colorBox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    marginRight: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
  legendText: {
    fontFamily: 'monospace',
    fontSize: 13,
  },
  tooltipBox: {
    position: 'absolute',
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 99,
  },
  tooltipColor: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  tooltipText: {
    fontSize: 13,
    marginRight: 4,
  },
  tooltipPercent: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#3a0b85',
  },
});
