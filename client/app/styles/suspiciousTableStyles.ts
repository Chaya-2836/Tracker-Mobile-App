import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop:7,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    width: 340,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#34495e",
    textAlign: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#eef4fb",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#dbe7f2",
  },
  dataRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  cell: {
    flex: 1,
    fontSize: 13,
    color: "#2c3e50",
    paddingHorizontal: 6,
    textAlign: "center",
  },
  cvrCell: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "left",
  },
});
export default styles;