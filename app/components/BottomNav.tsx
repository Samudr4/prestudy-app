import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BottomNavigation } from 'react-native-paper';
import { useRouter, usePathname } from 'expo-router';
import { FontAwesome, Feather } from '@expo/vector-icons';

type Route = {
  key: string;
  title: string;
  path: string;
};

const routes: Route[] = [
  { key: 'explore', title: 'Explore', path: '/home' },
  { key: 'all_courses', title: 'All Courses', path: '/all_courses' },
  { key: 'my_courses', title: 'My Courses', path: '/my_courses' },
  { key: 'profile', title: 'Profile', path: '/profile' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Determine active index based on current path
  const getActiveIndex = (): number => {
    // Default to explore tab
    if (pathname === '/home') return 0;
    
    for (let i = 0; i < routes.length; i++) {
      if (pathname.includes(routes[i].key) || pathname === routes[i].path) {
        return i;
      }
    }
    return 0; // Default to explore tab
  };

  const handleTabChange = (index: number) => {
    router.push(routes[index].path);
  };

  return (
    <BottomNavigation
      navigationState={{ 
        index: getActiveIndex(),
        routes: routes
      }}
      onIndexChange={handleTabChange}
      renderScene={() => <View />} // We don't use this as we're using it for navigation only
      barStyle={styles.bottomBar}
      renderIcon={({ route, focused }) => {
        const color = focused ? '#2196F3' : '#757575';
        switch (route.key) {
          case 'explore':
            return <FontAwesome name="search" size={24} color={color} />;
          case 'all_courses':
            return <FontAwesome name="th-large" size={24} color={color} />;
          case 'my_courses':
            return <Feather name="book" size={24} color={color} />;
          case 'profile':
            return <Feather name="user" size={24} color={color} />;
          default:
            return null;
        }
      }}
      renderLabel={({ route, focused }) => (
        <Text style={[styles.bottomBarLabel, { color: focused ? '#2196F3' : '#757575' }]}>
          {route.title}
        </Text>
      )}
    />
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  bottomBarLabel: { 
    fontSize: 12, 
    marginTop: 2 
  },
}); 