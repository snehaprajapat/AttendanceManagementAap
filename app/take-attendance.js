import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from './firebaseConfig';
import { collection, getDocs, query, where, doc, getDoc, setDoc } from 'firebase/firestore';
import Toast from 'react-native-root-toast';

export default function TakeAttendance() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState('B.Tech');
  const [selectedYear, setSelectedYear] = useState('I');
  const [yearOptions, setYearOptions] = useState(['I', 'II', 'III', 'IV']);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [students, setStudents] = useState([]);
  const [presentStudents, setPresentStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [existingAttendance, setExistingAttendance] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const programs = ['B.Tech', 'BCA', 'BBA', 'B.Des'];

  // Get years based on selected program
  const getYearsForProgram = (program) => {
    if (program === 'B.Tech' || program === 'B.Des') {
      return ['I', 'II', 'III', 'IV'];
    }
    return ['I', 'II', 'III'];
  };

  // Update year options when program changes
  useEffect(() => {
    const years = getYearsForProgram(selectedProgram);
    setYearOptions(years);
    if (!years.includes(selectedYear)) {
      setSelectedYear('I');
    }
  }, [selectedProgram]);

  // Check for existing attendance when date, program, or year changes
  useEffect(() => {
    const checkExistingAttendance = async () => {
      try {
        const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
        const attendanceRef = doc(db, 'programs', selectedProgram, 'years', selectedYear, 'students', formattedDate);
        const attendanceDoc = await getDoc(attendanceRef);
        
        if (attendanceDoc.exists()) {
          setExistingAttendance(attendanceDoc.data());
          // If updating, pre-fill the attendance
          if (isUpdating) {
            const attendance = attendanceDoc.data();
            const presentIds = Object.entries(attendance)
              .filter(([_, status]) => status === 'Present')
              .map(([id]) => id);
            setPresentStudents(presentIds);
          }
        } else {
          setExistingAttendance(null);
          if (!isUpdating) {
            setPresentStudents([]);
          }
        }
      } catch (error) {
        console.error('Error checking existing attendance:', error);
        showToast('Failed to check existing attendance', true);
      }
    };

    checkExistingAttendance();
  }, [selectedDate, selectedProgram, selectedYear]);

  // Fetch students from Firestore when program or year changes
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      try {
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef, 
          where('program', '==', selectedProgram),
          where('year', '==', selectedYear)
        );
        const snapshot = await getDocs(q);
        
        const fetchedStudents = snapshot.docs.map(doc => ({
          ...doc.data(),
          docId: doc.id,
          present: false,
          avatar: require('../assets/images/student.png')
        }));
        
        // Sort by name
        fetchedStudents.sort((a, b) => a.name.localeCompare(b.name));
        setStudents(fetchedStudents);

      } catch (error) {
        console.error('Error fetching students:', error);
        showToast('Failed to load students', true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [selectedProgram, selectedYear]);

  const showToast = (message, isError = false) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: isError ? '#FF3B30' : '#7A288A',
      paddingTop: 40,
    });
  };

  const toggleAttendance = (id) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, present: !student.present } : student
    ));
    if (presentStudents.includes(id)) {
      setPresentStudents(presentStudents.filter(studentId => studentId !== id));
    } else {
      setPresentStudents([...presentStudents, id]);
    }
  };

  const markAllPresent = () => {
    setStudents(students.map(student => ({ ...student, present: true })));
    setPresentStudents(students.map(student => student.id));
  };

  const handleMarkAttendance = async () => {
    try {
      const formattedDate = moment(selectedDate).format('YYYY-MM-DD');
      
      // Create attendance record for the programs collection
      const attendanceData = {};
      students.forEach(student => {
        attendanceData[student.id] = presentStudents.includes(student.id) ? 'Present' : 'Absent';
      });

      // Save to Firestore in the programs collection
      const attendanceRef = doc(db, 'programs', selectedProgram, 'years', selectedYear, 'students', formattedDate);
      await setDoc(attendanceRef, attendanceData, { merge: true });

      showToast(isUpdating ? 'Attendance updated successfully!' : 'Attendance marked successfully!');
      
      // Reset and navigate back
      setPresentStudents([]);
      setIsUpdating(false);
      router.push('/teacher-dashboard');
      
    } catch (error) {
      console.error('Error marking attendance:', error);
      showToast('Failed to mark attendance', true);
    }
  };

  const startUpdatingAttendance = () => {
    setIsUpdating(true);
    if (existingAttendance) {
      const presentIds = Object.entries(existingAttendance)
        .filter(([_, status]) => status === 'Present')
        .map(([id]) => id);
      setPresentStudents(presentIds);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Take Attendance</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.selectionRow}>
          <View style={[styles.section, styles.halfWidth]}>
            <Text style={styles.sectionLabel}>Select Program</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedProgram}
                onValueChange={setSelectedProgram}
                style={styles.picker}
              >
                {programs.map(program => (
                  <Picker.Item key={program} label={program} value={program} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={[styles.section, styles.halfWidth]}>
            <Text style={styles.sectionLabel}>Select Date</Text>
            <TouchableOpacity 
              style={[styles.pickerContainer, styles.dateButton]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {moment(selectedDate).format('YYYY-MM-DD')}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#7A288A" />
            </TouchableOpacity>
          </View>
        </View>

        {existingAttendance && !isUpdating && (
          <View style={styles.existingAttendanceMessage}>
            <Text style={styles.warningText}>Attendance already marked for this date</Text>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={startUpdatingAttendance}
            >
              <Text style={styles.updateButtonText}>Update Attendance</Text>
            </TouchableOpacity>
          </View>
        )}

        {(!existingAttendance || isUpdating) && (
          <>
            <View style={styles.yearSection}>
              <Text style={styles.sectionLabel}>Select Year</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={setSelectedYear}
                  style={styles.picker}
                >
                  {yearOptions.map(year => (
                    <Picker.Item key={year} label={year} value={year} />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.studentList}>
              <View style={styles.studentListHeader}>
                <Text style={styles.studentListTitle}>Students</Text>
                <TouchableOpacity onPress={markAllPresent} style={styles.markAllButton}>
                  <Text style={styles.markAllButtonText}>Mark All Present</Text>
                </TouchableOpacity>
              </View>

              {students.map(student => (
                <TouchableOpacity
                  key={student.id}
                  style={[
                    styles.studentCard,
                    presentStudents.includes(student.id) && styles.presentCard
                  ]}
                  onPress={() => toggleAttendance(student.id)}
                >
                  <Image source={student.avatar} style={styles.studentAvatar} />
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentId}>{student.id}</Text>
                  </View>
                  <View style={styles.attendanceStatus}>
                    <Text style={[
                      styles.statusText,
                      presentStudents.includes(student.id) ? styles.presentText : styles.absentText
                    ]}>
                      {presentStudents.includes(student.id) ? 'Present' : 'Absent'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleMarkAttendance}
            >
              <Text style={styles.submitButtonText}>
                {isUpdating ? 'Update Attendance' : 'Mark Attendance'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showDatePicker}
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Date</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                }
              }}
              style={styles.datePicker}
            />
          </View>
        </View>
      </Modal>
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
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  halfWidth: {
    width: '48%',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
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
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  datePicker: {
    width: '100%',
  },
  studentList: {
    marginTop: 16,
  },
  studentListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  studentListTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  markAllButton: {
    backgroundColor: '#7A288A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markAllButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  presentCard: {
    backgroundColor: '#F0FFF4',
    borderColor: '#68D391',
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },
  studentId: {
    fontSize: 14,
    color: '#666',
  },
  attendanceStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  presentText: {
    color: '#68D391',
  },
  absentText: {
    color: '#FC8181',
  },
  submitButton: {
    backgroundColor: '#7A288A',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  existingAttendanceMessage: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    alignItems: 'center',
  },
  warningText: {
    color: '#E53E3E',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: '#7A288A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
