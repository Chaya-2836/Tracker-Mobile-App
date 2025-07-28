import { StyleSheet } from 'react-native';
const buttonStyles = StyleSheet.create({
button: {
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#fff",
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 6,
  marginLeft: 8,
  borderWidth: 1,
  borderColor: "#ccc",
},

  icon: {
    fontSize: 13,
    marginRight: 6,
    color: "#2c62b4",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2c62b4",
  },
});
export default buttonStyles;