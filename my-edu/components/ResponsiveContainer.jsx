import { View, StyleSheet, Platform } from 'react-native';
import React from 'react';
import Layout from '../constants/Layout';

export default function ResponsiveContainer({ children, style }) {
  if (!Layout.isWeb) {
    return <View style={[styles.container, style]}>{children}</View>;
  }

  return (
    <View style={[styles.webWrapper, style]}>
      <View style={styles.webContent}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  webWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#1a1f2e',
  },
  webContent: {
    flex: 1,
    width: '100%',
    maxWidth: Layout.maxContentWidth,
    paddingHorizontal: Layout.padding.medium,
  },
}); 