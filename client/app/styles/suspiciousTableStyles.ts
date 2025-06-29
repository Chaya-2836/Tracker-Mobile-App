import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9fbfd", // רקע רך
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c62b4", 
    // color: "#e74c3c", 
    textAlign: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    paddingVertical: 8,
    backgroundColor: "#eaf1fb",
    borderBottomWidth: 1,
    borderColor: "#dae4f0",
  },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#f0f4f8",
  },
  cell: {
    flex: 1,
    fontSize: 13,
    color: "#34495e", 
    textAlign: "center", 
  },
});
export default styles;