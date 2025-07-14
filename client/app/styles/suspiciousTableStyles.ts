import { StyleSheet } from "react-native";

const baseCell = {
  textAlign: "center" as const,
  paddingHorizontal: 6,
  color: "#34495e",
};

const styles = StyleSheet.create({
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
    minWidth: 60,
  },

  appIdCol: {
    ...baseCell,
    flex: 1,
    minWidth: 50,
  },

  clicksCol: {
    ...baseCell,
    flex: 1,
    minWidth: 50,
  },

  impressionsCol: {
    ...baseCell,
    flex: 1,
    minWidth: 50,
  },

  conversionsCol: {
    ...baseCell,
    flex: 1,
    minWidth: 50,
  },

  cvrCol: {
    ...baseCell,
    flex: 1,
    fontWeight: "bold",
    minWidth: 50,
  },
});

export default styles;