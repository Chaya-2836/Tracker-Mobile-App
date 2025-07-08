import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 20,
    padding: 10,
  },
  legendContainer: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  // checkmark: {
  //   color: 'white',
  //   fontSize: 10,
  //   fontWeight: 'bold',
  //   lineHeight: 14,
  // },
  // legendText: {
  //   fontFamily: 'monospace',
  //   fontSize: 13,
  //   color: '#333',
  // },
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
  // legendItemsWrapper: {
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  //   justifyContent: 'center',
  //   gap: 12,
  //   marginTop: 16,
  //   width: '100%',
  //   paddingHorizontal: 8,
  // },
  // legendItem: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginBottom: 8,
  //   paddingHorizontal: 6,
  //   paddingVertical: 2,
  //   maxWidth: '45%',
  //   minWidth: 120,
  //   justifyContent: 'flex-start',
  // },
  // colorBox: {
  //   width: 14,
  //   height: 14,
  //   borderRadius: 7,
  //   borderWidth: 1.5,
  //   marginRight: 6,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  legendItemsWrapper: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  rowGap: 8,
  columnGap: 12,
  marginTop: 16,
  width: '100%',
  paddingHorizontal: 8,
},

legendItem: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 4,
  paddingVertical: 2,
  minWidth: 100,
},

colorBox: {
  width: 16,
  height: 16,
  borderRadius: 8,
  borderWidth: 1.5,
  marginRight: 6,
  justifyContent: 'center',
  alignItems: 'center',
},

checkmark: {
  fontSize: 11,
  color: '#000',
  fontWeight: 'bold',
},

legendText: {
  fontSize: 13,
  color: '#333',
},

});
