import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  panelContainer: {
    backgroundColor: '#fff3cd',
    padding: 3,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
    alignSelf: 'center',
  },

  alertRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconInline: {
    margin: 0,
    padding: 0,
  },

  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },

  linkWrapper: {
    alignItems: 'center',
  },

  linkStyle: {
    fontSize: 14,
    color: "#2c62b4",
    textDecorationLine: "underline",
    textAlign: "center",
  },

  tableContainer: {
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingBottom: 8,
    elevation: 2,
    width: '100%',
    alignSelf: 'center',
  },
});

export default styles;