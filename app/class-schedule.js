import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Calendar } from 'react-native-calendars';

export default function ClassSchedule() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  // Format date for display
  const formatDate = (date) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return {
      full: `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`,
      day: days[date.getDay()]
    };
  };

  const onDayPress = (day) => {
    setSelectedDate(new Date(day.timestamp));
    setShowCalendar(false);
  };

  const formattedDate = formatDate(selectedDate);

  // Example schedule data
  const scheduleData = {
    morningSession: [
      {
        time: '10:00 - 12:30',
        subject: 'Mobile Application',
        room: 'Room Vishveshwarya',
        teacher: 'Prof. Gourav Bairagi'
      }
    ],
    afternoonSession: [
      {
        time: '10:00 - 12:30',
        subject: 'Mobile Application',
        room: 'Room Vishveshwarya',
        teacher: 'Prof. Gourav Bairagi'
      }
    ]
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily Schedule</Text>
      </View>

      {/* Date Selector */}
      <TouchableOpacity 
        style={styles.dateSelector}
        onPress={() => setShowCalendar(true)}
      >
        <View style={styles.dateInfo}>
          <Text style={styles.selectedDay}>{formattedDate.day}</Text>
          <Text style={styles.selectedDate}>{formattedDate.full}</Text>
        </View>
        <Ionicons name="calendar-outline" size={24} color="#7A288A" />
      </TouchableOpacity>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity 
                onPress={() => setShowCalendar(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <Calendar
              style={styles.calendar}
              theme={{
                calendarBackground: '#fff',
                textSectionTitleColor: '#666',
                selectedDayBackgroundColor: '#7A288A',
                selectedDayTextColor: '#fff',
                todayTextColor: '#7A288A',
                dayTextColor: '#111',
                textDisabledColor: '#d9e1e8',
                dotColor: '#7A288A',
                monthTextColor: '#111',
                textMonthFontSize: 16,
                textMonthFontWeight: '600',
                arrowColor: '#7A288A'
              }}
              onDayPress={onDayPress}
              markedDates={{
                [selectedDate.toISOString().split('T')[0]]: {
                  selected: true,
                  selectedColor: '#7A288A'
                }
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Schedule Content */}
      <ScrollView style={styles.scheduleContainer}>
        {/* Morning Session */}
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionTitle}>Morning Session</Text>
          {scheduleData.morningSession.map((item, index) => (
            <View key={index} style={styles.classCard}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusOngoing]} />
                <Text style={styles.statusText}>Ongoing</Text>
              </View>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.subjectText}>{item.subject}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.roomText}>{item.room}</Text>
                </View>
                <View style={styles.teacherContainer}>
                  <Ionicons name="person-outline" size={16} color="#666" />
                  <Text style={styles.teacherText}>{item.teacher}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Lunch Break */}
        <View style={styles.lunchBreak}>
          <View style={styles.lunchContent}>
            <Ionicons name="restaurant-outline" size={20} color="#666" />
            <Text style={styles.lunchText}>Lunch Break</Text>
          </View>
          <Text style={styles.lunchTime}>12:30 - 02:00</Text>
        </View>

        {/* Afternoon Session */}
        <View style={styles.sessionContainer}>
          <Text style={styles.sessionTitle}>Afternoon Session</Text>
          {scheduleData.afternoonSession.map((item, index) => (
            <View key={index} style={styles.classCard}>
              <View style={styles.statusIndicator}>
                <View style={[styles.statusDot, styles.statusUpcoming]} />
                <Text style={styles.statusText}>Upcoming</Text>
              </View>
              <View style={styles.timeContainer}>
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={styles.classInfo}>
                <Text style={styles.subjectText}>{item.subject}</Text>
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.roomText}>{item.room}</Text>
                </View>
                <View style={styles.teacherContainer}>
                  <Ionicons name="person-outline" size={16} color="#666" />
                  <Text style={styles.teacherText}>{item.teacher}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => router.push('/teacher-dashboard')}
        >
          <Ionicons name="home-outline" size={24} color="#666" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, styles.navItemActive]}
        >
          <Ionicons name="calendar" size={24} color="#7A288A" />
          <Text style={[styles.navText, styles.navTextActive]}>Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/profile')}
        >
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.navText}>Profile</Text>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',

  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    paddingLeft: 15,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dateInfo: {
    flex: 1,
  },
  selectedDay: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  calendar: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scheduleContainer: {
    flex: 1,
    padding: 16,
  },
  sessionContainer: {
    marginBottom: 24,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusOngoing: {
    backgroundColor: '#2563eb',
  },
  statusUpcoming: {
    backgroundColor: '#666',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  classInfo: {
    marginLeft: 28,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
  },
  subjectText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  roomText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  teacherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  lunchBreak: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lunchContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lunchText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  lunchTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
    minWidth: 64,
  },
  navItemActive: {
    position: 'relative',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    color: '#8B1874',
    fontWeight: '500',
  },
});
