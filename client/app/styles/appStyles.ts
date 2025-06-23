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
  // SafeAreaView container
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    paddingTop: 20,
  },

  // Header row (wrapper for the main title)
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  // Title text
  header: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 4,
  },

  // TabBar styles (broken out by key)
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
