import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  panelContainer: {
    backgroundColor: "#f9fbfd", // רקע רך שמתאים לאפליקציה
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c62b4", // כחול של האפליקציה
    //  color: "#e74c3c", 
    textAlign: "center",
    marginBottom: 10,
  },
  linkStyle: {
    fontSize: 14,
    textAlign: "center",
    color: "#2c62b4",
    textDecorationLine: "underline",
  },
});
export default styles;