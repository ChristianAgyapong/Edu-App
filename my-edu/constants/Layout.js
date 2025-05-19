import { Dimensions, Platform } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  isWeb: Platform.OS === 'web',
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
  padding: {
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xl: 16,
  },
  header: {
    height: Platform.select({
      ios: 44,
      android: 56,
      web: 64,
    }),
    paddingTop: Platform.select({
      ios: 20,
      android: 0,
      web: 16,
    }),
  },
  bottomTabHeight: Platform.select({
    ios: 49,
    android: 56,
    web: 64,
  }),
  maxContentWidth: Platform.select({
    web: 1200,
    default: '100%',
  }),
  deviceScale: width / 375, // Base scale for responsive design
}; 