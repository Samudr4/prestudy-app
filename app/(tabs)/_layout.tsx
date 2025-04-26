import { Tabs } from "expo-router";
import { AntDesign, FontAwesome, Feather } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF3B30",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          backgroundColor: 'white'
        }
      }}
    >
      <Tabs.Screen
        name="index" // this will map to (tabs)/index.tsx
        options={{
          title: "Explore",
          tabBarIcon: ({ color }) => <AntDesign name="search1" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="all_courses" // this will map to (tabs)/all_courses.tsx 
        options={{
          title: "All Courses",
          tabBarIcon: ({ color }) => <AntDesign name="appstore1" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="my_courses" // this will map to (tabs)/my_courses.tsx
        options={{
          title: "My Courses",
          tabBarIcon: ({ color }) => <AntDesign name="check" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile" // this will map to (tabs)/profile.tsx
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <AntDesign name="user" size={24} color={color} />
        }}
      />
    </Tabs>
  );
} 