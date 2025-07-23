 import  {Dimensions, Image,
  TouchableOpacity,View
} from 'react-native';
 import { Ionicons } from '@expo/vector-icons';
export default function Header() {
    const screenWidth = Dimensions.get('window').width;
const isLargeScreen = screenWidth >= 768;
  return (
    <View>
    <View
      style={{
        height: isLargeScreen ? 120 : 90,
        flexDirection: 'row',
        alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#ddd',
        }}
      >
        <Image
          source={require('../../assets/images/engagement_tracker_logo_transparent.png')}
          style={{
            width: isLargeScreen ? 400 : 250,
            height: '80%',
          }}
          resizeMode="contain"
        />
        <TouchableOpacity
          style={{ padding: isLargeScreen ? 20 : 10 }}
        >
          <Ionicons
            name="log-out-outline"
            size={isLargeScreen ? 30 : 24}
            color="#2c62b4"
          />
        </TouchableOpacity>
      </View></View> )}