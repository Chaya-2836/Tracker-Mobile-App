import { StyleSheet } from "react-native";

const tableStyles = StyleSheet.create({
  container: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#f2f2f2",
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  colAppName: {
    width: 100,
    fontSize: 13,
    paddingVertical: 4,
    paddingHorizontal: 8,
    textAlign: "left",
  },
  colSmall: {
    width: 100,
    fontSize: 13,
    paddingVertical: 6,
    paddingHorizontal: 8,
    textAlign: "center",
  },
});


export default tableStyles;