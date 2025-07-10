import { StyleSheet, ViewStyle, TextStyle, Platform } from 'react-native';

interface AppStyles {
  containerpage: ViewStyle;
  container: ViewStyle;
  headerRow: ViewStyle;
  header: TextStyle;
  tabBarIndicator: ViewStyle;
  tabBarStyle: ViewStyle;
  tabBarLabel: TextStyle;
}

const styles = StyleSheet.create<AppStyles>({
headerContainer: {
  paddingHorizontal: 16,
  paddingTop: 20,
  paddingBottom: 16, 
  alignItems: 'center',
  position: 'relative',
},  
container: {
   alignSelf: "center",
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    width:"95%",
        overflow: 'hidden',
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

  containerpage: {
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


  tabBarIndicator: {
    backgroundColor: '#2c62b4',
  },

  tabBarStyle: {
    backgroundColor: '#ecf0f1',
    marginBottom: 10,
  },

  tabBarLabel: {
    color: '#2c3e50',
    fontWeight: '600',
  },
});

export default styles;
