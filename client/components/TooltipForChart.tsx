import { View, Text } from 'react-native';

export default function TooltipForChart({
  x,
  y,
  value,
  label,
}: {
  x: number;
  y: number;
  value: number;
  label: string;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        top: y - 55,
        left: x - 60,
        backgroundColor: '#fefefe',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      }}
    >
      <Text
        style={{
          fontSize: 12,
          fontWeight: 'bold',
          color: '#1b4f72',
          textAlign: 'center',
          marginBottom: 2,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: '#333',
          textAlign: 'center',
        }}
      >
        Volume: {value}
      </Text>
    </View>
  );
}