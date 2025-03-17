import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, TouchableWithoutFeedback, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ViewReports() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState('B.Tech');
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState('1st');
  
  const programs = ['B.Tech', 'B.Des', 'BBA', 'BCA'];
  
  // Get years based on selected program
  const getYearsForProgram = (program) => {
    if (program === 'B.Tech' || program === 'B.Des') {
      return ['1st', '2nd', '3rd', '4th'];
    }
    return ['1st', '2nd', '3rd'];
  };

  const years = getYearsForProgram(selectedProgram);

  // Update years when program changes
  useEffect(() => {
    const availableYears = getYearsForProgram(selectedProgram);
    if (!availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    }
  }, [selectedProgram]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>View Reports</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        {/* Program Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Program</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowProgramDropdown(!showProgramDropdown)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>{selectedProgram}</Text>
            <Ionicons 
              name={showProgramDropdown ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
          {showProgramDropdown && (
            <View style={styles.dropdownList}>
              {programs.map((program) => (
                <TouchableOpacity
                  key={program}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedProgram(program);
                    setShowProgramDropdown(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedProgram === program && styles.dropdownItemTextActive
                  ]}>
                    {program}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Date Picker */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.label}>Select Date</Text>
          <TouchableOpacity 
            style={styles.dropdown}
            onPress={() => setShowDatePicker(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dropdownText}>
              {selectedDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#7A288A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Year Selection */}
      <View style={styles.yearSection}>
        {years.map((year, index) => (
          <TouchableOpacity
            key={year}
            style={[
              styles.yearButton,
              selectedYear === year && styles.yearButtonActive,
              index > 0 && styles.yearButtonMargin
            ]}
            onPress={() => setSelectedYear(year)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.yearButtonText,
              selectedYear === year && styles.yearButtonTextActive
            ]}>
              {year}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Date Picker Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowDatePicker(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Date</Text>
                <TouchableOpacity 
                  onPress={() => setShowDatePicker(false)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={24} color="#7A288A" />
                </TouchableOpacity>
              </View>
              
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="calendar"
                onChange={(event, date) => {
                  if (date) {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                  }
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </Pressable>
      </Modal>

      {/* Existing Report Content */}
      <ScrollView style={styles.content}>
        {/* Overview Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.cardGrid}>
            <View style={styles.card}>
              <Text style={styles.cardValue}>85%</Text>
              <Text style={styles.cardLabel}>Present</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardValue}>15%</Text>
              <Text style={styles.cardLabel}>Absent</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardValue}>45</Text>
              <Text style={styles.cardLabel}>Total Students</Text>
            </View>
          </View>
        </View>

        {/* Class Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Class Status</Text>
          <View style={styles.classCards}>
            <TouchableOpacity style={styles.classCard}>
              <View style={styles.classInfo}>
                <Text style={styles.className}>Data Structures</Text>
                <Text style={styles.classTime}>Nov - Dec 2024 </Text>
                <View style={[styles.statusBadge, styles.statusCompleted]}>
                  <Text style={[styles.statusText, styles.statusTextCompleted]}>Completed</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.classCard}>
              <View style={styles.classInfo}>
                <Text style={styles.className}>Mobile Application</Text>
                <Text style={styles.classTime}>Feb - March 2025</Text>
                <View style={[styles.statusBadge, styles.statusOngoing]}>
                  <Text style={[styles.statusText, styles.statusTextOngoing]}>Ongoing</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.classCard}>
              <View style={styles.classInfo}>
                <Text style={styles.className}>Computer Networks</Text>
                <Text style={styles.classTime}>June - July 2025</Text>
                <View style={[styles.statusBadge, styles.statusUpcoming]}>
                  <Text style={[styles.statusText, styles.statusTextUpcoming]}>Upcoming</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
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
          onPress={() => router.push('/class-schedule')}
        >
          <Ionicons name="calendar-outline" size={24} color="#7A288A" />
          <Text style={[styles.navText, styles.navTextActive]}>Classes</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 12,
  },
  dropdownContainer: {
    flex: 1,
    position: 'relative',
    zIndex: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#111',
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 3,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111',
  },
  dropdownItemTextActive: {
    color: '#7A288A',
    fontWeight: '500',
  },
  yearSection: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 8,
    zIndex: 1,
  },
  yearButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
  },
  yearButtonActive: {
    backgroundColor: '#7A288A',
  },
  yearButtonMargin: {
    marginLeft: 12,
  },
  yearButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  yearButtonTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
  },
  classCards: {
    gap: 12,
  },
  classCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  classTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
  },
  statusOngoing: {
    backgroundColor: '#dbeafe',
  },
  statusUpcoming: {
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusTextCompleted: {
    color: '#22c55e',
  },
  statusTextOngoing: {
    color: '#2563eb',
  },
  statusTextUpcoming: {
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
});
