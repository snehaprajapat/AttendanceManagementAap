import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';

export default function TeacherDashboard() {
  const router = useRouter();
  const [teacher, setTeacher] = useState({
    name: '',
    department: 'SOE Department',
    avatar: require('../assets/images/profile-placeholder.png')
  });

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Get the first name only
      const firstName = user.displayName?.split(' ')[0] || 'Teacher';
      setTeacher(prev => ({
        ...prev,
        name: firstName
      }));
    }
  }, []);

  // Example stats
  const stats = {
    totalStudents: 32,
    classesToday: 2,
    attendance: '95%'
  };

  // Example classes for today
  const todaysClasses = [
    { 
      id: 1, 
      subject: 'Mobile Application',
      grade: 'Program - BTech',
      time: '10:00 AM - 12:30 AM',
      status: 'ongoing'
    },
    { 
      id: 2, 
      subject: 'Lunch Break',
      time: '1:00 AM - 2:00 PM',
      status: 'upcoming'
    },
    { 
      id: 3, 
      subject: 'Mobile Application',
      grade: 'Program - BTech',
      time: '02:00 PM - 03:30 PM',
      status: 'upcoming'
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            {teacher.avatar ? (
              <Image source={teacher.avatar} style={styles.avatar} />
            ) : (
              <View style={styles.avatar}>
                <Ionicons name="person" size={24} color="#666" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Hello, {teacher.name}</Text>
            <Text style={styles.department}>{teacher.department}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="notifications-outline" size={24} color="#111" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>6</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="people-outline" size={24} color="#666" />
          <Text style={styles.statNumber}>{stats.totalStudents}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="calendar-outline" size={24} color="#666" />
          <Text style={styles.statNumber}>{stats.classesToday}</Text>
          <Text style={styles.statLabel}>Classes Today</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="bar-chart-outline" size={24} color="#666" />
          <Text style={styles.statNumber}>{stats.attendance}</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: '#8B1874' }]}
          onPress={() => router.push('/take-attendance')}
        >
          <Ionicons name="clipboard-outline" size={24} color="#fff" />
          <Text style={styles.actionTitle}>Take Attendance</Text>
          <Text style={styles.actionSubtitle}>Mark today's attendance</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: '#22c55e' }]}
          onPress={() => router.push('/view-reports')}
        >
          <Ionicons name="bar-chart-outline" size={24} color="#fff" />
          <Text style={styles.actionTitle}>View Reports</Text>
          <Text style={styles.actionSubtitle}>Check performance data</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: '#7A288A' }]}
          onPress={() => router.push('/class-schedule')}
        >
          <Ionicons name="calendar-outline" size={24} color="#fff" />
          <Text style={styles.actionTitle}>Class Schedule</Text>
          <Text style={styles.actionSubtitle}>Today's timeline</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionCard, { backgroundColor: '#f97316' }]}
          onPress={() => router.push('/students')}
        >
          <Ionicons name="list-outline" size={24} color="#fff" />
          <Text style={styles.actionTitle}>Student List</Text>
          <Text style={styles.actionSubtitle}>View all students</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Classes */}
      <View style={styles.classesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Classes</Text>
          <TouchableOpacity>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.classesList}>
          {todaysClasses.map((classItem) => (
            <View key={classItem.id} style={styles.classCard}>
              <View style={styles.classInfo}>
                <Text style={styles.classTime}>{classItem.time}</Text>
                <Text style={styles.className}>{classItem.subject}</Text>
                <Text style={styles.classGrade}>{classItem.grade}</Text>
              </View>
              <View style={[
                styles.statusDot,
                { backgroundColor: classItem.status === 'ongoing' ? '#22c55e' : '#e5e5e5' }
              ]} />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="home" size={24} color="#7A288A" />
          <Text style={[styles.navText, styles.navTextActive]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/class-schedule')}
        >
          <Ionicons name="calendar-outline" size={24} color="#666" />
          <Text style={styles.navText}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/settings')}
        >
          <Ionicons name="settings-outline" size={24} color="#666" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingTop: 65,
    paddingBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  department: {
    fontSize: 14,
    color: '#666',
  },
  notificationButton: {
    position: 'relative',
    padding: 4,
    right: 40, 
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 24,
    gap: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  actionCard: {
    width: '47%',
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  classesSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  classesList: {
    flex: 1,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  classInfo: {
    flex: 1,
  },
  classTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  classGrade: {
    fontSize: 14,
    color: '#666',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  navItemActive: {
    color: '#8B1874',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    color: '#8B1874',
  },
});
