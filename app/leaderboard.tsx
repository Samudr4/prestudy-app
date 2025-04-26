import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from './config';

interface LeaderboardUser {
  id: string;
  name: string;
  profileImage?: string;
  score: number;
  rank: number;
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardUser | null>(null);
  const [timeframe, setTimeframe] = useState('week'); // 'day', 'week', 'month', 'all'
  
  useEffect(() => {
    fetchLeaderboardData();
  }, [timeframe]);
  
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // In a real app, you'd fetch from the API with the timeframe parameter
      // const response = await fetch(`${config.LEADERBOARD_API}?timeframe=${timeframe}`);
      // const data = await response.json();
      // if (!data.success) throw new Error('Failed to fetch leaderboard data');
      
      // Mock data for now
      setTimeout(() => {
        const mockUsers: LeaderboardUser[] = [
          { id: '1', name: 'Olivia Johnson', score: 9850, rank: 1, profileImage: 'https://randomuser.me/api/portraits/women/32.jpg' },
          { id: '2', name: 'Liam Williams', score: 9720, rank: 2, profileImage: 'https://randomuser.me/api/portraits/men/15.jpg' },
          { id: '3', name: 'Emma Brown', score: 9650, rank: 3, profileImage: 'https://randomuser.me/api/portraits/women/65.jpg' },
          { id: '4', name: 'Noah Jones', score: 9500, rank: 4, profileImage: 'https://randomuser.me/api/portraits/men/22.jpg' },
          { id: '5', name: 'Sophia Miller', score: 9370, rank: 5, profileImage: 'https://randomuser.me/api/portraits/women/17.jpg' },
          { id: '6', name: 'Jackson Davis', score: 9220, rank: 6, profileImage: 'https://randomuser.me/api/portraits/men/42.jpg' },
          { id: '7', name: 'Ava Wilson', score: 9100, rank: 7, profileImage: 'https://randomuser.me/api/portraits/women/45.jpg' },
          { id: '8', name: 'Lucas Garcia', score: 8950, rank: 8, profileImage: 'https://randomuser.me/api/portraits/men/57.jpg' },
          { id: '9', name: 'Mia Rodriguez', score: 8820, rank: 9, profileImage: 'https://randomuser.me/api/portraits/women/28.jpg' },
          { id: '10', name: 'Ethan Martinez', score: 8700, rank: 10, profileImage: 'https://randomuser.me/api/portraits/men/33.jpg' },
        ];
        
        // Get current user data from AsyncStorage
        getUserInfo().then(userData => {
          if (userData) {
            // In a real app, you'd fetch the user's rank from the API
            // For now, simulate a rank for the current user
            const userRankData = { 
              id: userData._id || 'current-user', 
              name: `${userData.firstName} ${userData.lastName}`,
              score: 8540, 
              rank: 14 
            };
            setUserRank(userRankData);
          }
          
          setLeaderboardData(mockUsers);
          setLoading(false);
        });
      }, 1000);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      setLoading(false);
    }
  };
  
  const getUserInfo = async () => {
    try {
      const userDataStr = await AsyncStorage.getItem('userData');
      return userDataStr ? JSON.parse(userDataStr) : null;
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  };
  
  const renderTimeframeButton = (label: string, value: string) => (
    <TouchableOpacity
      style={[
        styles.timeframeButton,
        timeframe === value && styles.activeTimeframeButton
      ]}
      onPress={() => setTimeframe(value)}
    >
      <Text
        style={[
          styles.timeframeButtonText,
          timeframe === value && styles.activeTimeframeButtonText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardUser, index: number }) => {
    const isTopThree = index < 3;
    let medalColor = '';
    
    if (index === 0) medalColor = '#FFD700'; // Gold
    if (index === 1) medalColor = '#C0C0C0'; // Silver
    if (index === 2) medalColor = '#CD7F32'; // Bronze
    
    return (
      <View style={styles.leaderboardItem}>
        <View style={styles.rankContainer}>
          {isTopThree ? (
            <FontAwesome5 name="medal" size={20} color={medalColor} />
          ) : (
            <Text style={styles.rankText}>{item.rank}</Text>
          )}
        </View>
        
        <Image
          source={{ uri: item.profileImage || 'https://via.placeholder.com/40' }}
          style={styles.profileImage}
        />
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{item.score.toLocaleString()}</Text>
          <Text style={styles.scoreLabel}>points</Text>
        </View>
      </View>
    );
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.timeframeContainer}>
        {renderTimeframeButton('Day', 'day')}
        {renderTimeframeButton('Week', 'week')}
        {renderTimeframeButton('Month', 'month')}
        {renderTimeframeButton('All Time', 'all')}
      </View>
      
      <FlatList
        data={leaderboardData}
        renderItem={renderLeaderboardItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {userRank && (
        <View style={styles.userRankContainer}>
          <View style={styles.userRankDivider} />
          <View style={styles.leaderboardItem}>
            <View style={styles.rankContainer}>
              <Text style={styles.rankText}>{userRank.rank}</Text>
            </View>
            
            <View style={[styles.profileImage, styles.userProfilePlaceholder]}>
              <Text style={styles.userInitials}>
                {`${userRank.name.charAt(0)}`}
              </Text>
            </View>
            
            <View style={styles.userInfo}>
              <Text style={[styles.userName, styles.currentUserName]}>
                {userRank.name} <Text style={styles.youLabel}>(You)</Text>
              </Text>
            </View>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{userRank.score.toLocaleString()}</Text>
              <Text style={styles.scoreLabel}>points</Text>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  timeframeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'white',
    marginBottom: 8,
  },
  timeframeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTimeframeButton: {
    backgroundColor: '#4169E1',
  },
  timeframeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTimeframeButtonText: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userProfilePlaceholder: {
    backgroundColor: '#4169E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInitials: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  currentUserName: {
    color: '#4169E1',
  },
  youLabel: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#666',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#666',
  },
  userRankContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  userRankDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
}); 