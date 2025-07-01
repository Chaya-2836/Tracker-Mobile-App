import { StyleSheet } from "react-native";

const baseCell = {
  textAlign: "center" as const,
  paddingHorizontal: 6,
  color: "#34495e",
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    // backgroundColor: "#ffffff",
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    width: "100%"  
  },

  headerRow: {
    flexDirection: "row",
    backgroundColor: "#e9f1f9",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#d0dfea",
  },

  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },

  mediaSourceCol: {
    ...baseCell,
    flex: 2,
  },

  appIdCol: {
    ...baseCell,
    flex: 1,
  },

  clicksCol: {
    ...baseCell,
    flex: 1,
  },

  impressionsCol: {
    ...baseCell,
    flex: 1,
  },

  conversionsCol: {
    ...baseCell,
    flex: 1,
  },

  cvrCol: {
    ...baseCell,
    flex: 1,
    fontWeight: "bold",
  },
});

export default styles;