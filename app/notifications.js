import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function Notifications() {
  const router = useRouter();
  const [notifications] = useState([
    {
      id: '1',
      title: 'Mobile Application Class',
      description: 'Class starts in 15 minutes - Room ',
      icon: 'book-outline',
      iconBg: '#4285F4',
      time: '2m ago'
    },
    {
      id: '2',
      title: 'Team Meeting',
      description: 'Weekly project sync ',
      icon: 'people-outline',
      iconBg: '#8B1874',
      time: '15m ago'
    },
    {
      id: '3',
      title: 'Mobile Application Assignment',
      description: 'Assignment submission deadline reminder',
      icon: 'leaf-outline',
      iconBg: '#22c55e',
      time: '1h ago'
    },
    {
      id: '4',
      title: 'Confrence-meeting',
      description: 'Session scheduled for tomorrow 3 PM',
      icon: 'people-circle-outline',
      iconBg: '#ff9500',
      time: '2h ago'
    },
    {
      id: '5',
      title: 'Course selection meeting',
      description: 'New Course preparation reminder',
      icon: 'flask-outline',
      iconBg: '#FF3B30',
      time: '3h ago'
    },
    {
      id: '6',
      title: 'Faculty Meeting',
      description: 'Curriculum discussion at 4 PM',
      icon: 'calendar-outline',
      iconBg: '#666666',
      time: '4h ago'
    }
  ]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.push('/teacher-dashboard')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.7}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#7A288A" />
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.notificationsList}
        showsVerticalScrollIndicator={false}
      >
        {notifications.map((notification) => (
          <TouchableOpacity 
            key={notification.id}
            style={styles.notificationItem}
            activeOpacity={0.7}
          >
            <View style={[styles.iconContainer, { backgroundColor: notification.iconBg }]}>
              <Ionicons name={notification.icon} size={20} color="#fff" />
            </View>
            <View style={styles.notificationContent}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
              <Text style={styles.notificationDescription}>
                {notification.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Bottom Indicator */}
        <View style={styles.bottomIndicator}>
          <View style={styles.indicator} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  notificationsList: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    flex: 1,
    gap: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomIndicator: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  indicator: {
    width: 40,
    height: 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
});
