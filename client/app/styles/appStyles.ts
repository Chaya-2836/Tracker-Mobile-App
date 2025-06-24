import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
interface AppStyles {
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


  tabBarIndicator: {
    backgroundColor: '#2c62b4',
  },

  tabBarStyle: {
    backgroundColor: '#ecf0f1',
  },

  tabBarLabel: {
    color: '#2c3e50',
    fontWeight: '600',
  },
});

export default styles;
