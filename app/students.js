import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Pressable, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { db } from './firebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, setDoc } from 'firebase/firestore';

export default function Students() {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState('B.Tech');
  const [showProgramDropdown, setShowProgramDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState('I');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    id: '',
    image: null
  });
  const [students, setStudents] = useState([]);

  const programs = ['B.Tech', 'BCA', 'BBA', 'B.Des'];

  // Fetch students from Firestore
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsRef = collection(db, 'students');
        const q = query(studentsRef);
        const snapshot = await getDocs(q);
        
        const fetchedStudents = [];
        snapshot.forEach(doc => {
          const data = doc.data();
          fetchedStudents.push({
            ...data,
            docId: doc.id, // Store Firestore document ID
            image: require('../assets/images/student.png')
          });
        });
        
        setStudents(fetchedStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        Alert.alert('Error', 'Failed to load students');
      }
    };

    fetchStudents();
  }, []);

  // Get years based on selected program
  const getYearsForProgram = (program) => {
    if (program === 'B.Tech' || program === 'B.Des') {
      return ['I', 'II', 'III', 'IV'];
    }
    return ['I', 'II', 'III'];
  };

  const years = getYearsForProgram(selectedProgram);

  const handleDeleteStudent = (studentId, studentName) => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${studentName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              // Find the student to get the Firestore document ID
              const studentToDelete = students.find(s => s.id === studentId);
              if (!studentToDelete) {
                throw new Error('Student not found');
              }

              // Delete from Firestore using the document ID
              await deleteDoc(doc(db, 'students', studentToDelete.docId));
              
              // Update local state
              setStudents(currentStudents => 
                currentStudents.filter(student => student.id !== studentId)
              );
              
              Alert.alert(
                'Success', 
                `${studentName} has been deleted successfully`,
                [{ text: 'OK', style: 'default' }]
              );
            } catch (error) {
              console.error('Error deleting student:', error);
              Alert.alert(
                'Error',
                'Failed to delete student. Please try again.',
                [{ text: 'OK', style: 'destructive' }]
              );
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const handleAddStudent = async () => {
    if (!newStudent.name || !newStudent.id) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Convert ID to string and ensure proper format
    const formattedId = String(newStudent.id).toUpperCase().trim();

    const studentExists = students.some(student => student.id === formattedId);
    if (studentExists) {
      Alert.alert('Error', 'A student with this ID already exists');
      return;
    }

    try {
      const newStudentData = {
        name: newStudent.name,
        id: formattedId,
        program: selectedProgram,
        year: selectedYear,
        createdAt: new Date().toISOString()
      };

      // Add to Firestore and get the document reference
      const docRef = await addDoc(collection(db, 'students'), newStudentData);

      setStudents([...students, {
        ...newStudentData,
        docId: docRef.id, // Store Firestore document ID
        image: require('../assets/images/student.png')
      }]);
      
      setNewStudent({ name: '', id: '', image: null });
      setShowAddModal(false);
      Alert.alert('Success', 'Student added successfully');
    } catch (error) {
      console.error('Error adding student:', error);
      Alert.alert('Error', 'Failed to add student');
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setNewStudent({ ...newStudent, image: require('../assets/images/student1.jpg') });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Students</Text>
      </View>

      {/* Program Selection */}
      <View style={styles.selectionContainer}>
        <Text style={styles.sectionLabel}>Select Program</Text>
        <TouchableOpacity
          style={[
            styles.dropdownButton,
            showProgramDropdown && styles.dropdownButtonActive
          ]}
          onPress={() => setShowProgramDropdown(!showProgramDropdown)}
          activeOpacity={0.7}
        >
          <Text style={styles.dropdownButtonText}>{selectedProgram}</Text>
          <Ionicons 
            name={showProgramDropdown ? "chevron-up" : "chevron-down"} 
            size={24} 
            color="#7A288A" 
          />
        </TouchableOpacity>
        
        {showProgramDropdown && (
          <View style={styles.dropdownOverlay}>
            <View style={styles.dropdownList}>
              {programs.map((program) => (
                <TouchableOpacity
                  key={program}
                  style={[
                    styles.dropdownItem,
                    selectedProgram === program && styles.dropdownItemActive
                  ]}
                  onPress={() => {
                    setSelectedProgram(program);
                    setShowProgramDropdown(false);
                    setSelectedYear(getYearsForProgram(program)[0]);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedProgram === program && styles.dropdownItemTextActive
                  ]}>{program}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Year Selection */}
      <View style={styles.yearContainer}>
        {years.map((year) => (
          <TouchableOpacity
            key={year}
            style={[
              styles.yearButton,
              selectedYear === year && styles.yearButtonActive
            ]}
            onPress={() => setSelectedYear(year)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.yearButtonText,
              selectedYear === year && styles.yearButtonTextActive
            ]}>Year {year}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Student List */}
      <ScrollView style={styles.studentList}>
        {students
          .filter(student => 
            student.program === selectedProgram &&
            student.year === selectedYear
          )
          .map((student) => (
            <View key={student.id} style={styles.studentCard}>
              <View style={styles.studentInfo}>
                <Image 
                  source={student.image}
                  style={styles.studentAvatar}
                />
                <View style={styles.studentDetails}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentProgram}>
                    {student.program} • Year {student.year}
                  </Text>
                  <Text style={styles.studentId}>ID: {student.id}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteStudent(student.id, student.name)}
                activeOpacity={0.7}
              >
                <View style={styles.deleteIconContainer}>
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
          ))}
      </ScrollView>

      {/* Add Student Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
        <Text style={styles.addButtonText}>Add New Student</Text>
      </TouchableOpacity>

      {/* Add Student Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Student</Text>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#7A288A" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.imagePickerButton} 
              onPress={pickImage}
            >
              {newStudent.image ? (
                <Image 
                  source={require('../assets/images/student1.jpg')} 
                  style={styles.pickedImage} 
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="camera" size={24} color="#7A288A" />
                  <Text style={styles.imagePlaceholderText}>Add Photo (Optional)</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Student Name<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={newStudent.name}
                onChangeText={(text) => setNewStudent({...newStudent, name: text})}
                placeholder="Enter student name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enrollment ID<Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={newStudent.id}
                onChangeText={(text) => setNewStudent({ ...newStudent, id: text.toUpperCase().trim() })}
                placeholder="Enter enrollment ID"
                placeholderTextColor="#999"
                autoCapitalize="characters"
                maxLength={10}
              />
            </View>

            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleAddStudent}
            >
              <Text style={styles.modalButtonText}>Add Student</Text>
            </TouchableOpacity>
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  selectionContainer: {
    padding: 16,
    zIndex: 1000,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  dropdownButtonActive: {
    borderColor: '#7A288A',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#111',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 999,
  },
  dropdownList: {
    position: 'absolute',
    top: 76,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemActive: {
    backgroundColor: '#7A288A',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#111',
  },
  dropdownItemTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  yearContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  yearButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    alignItems: 'center',
  },
  yearButtonActive: {
    backgroundColor: '#7A288A',
  },
  yearButtonText: {
    fontSize: 14,
    color: '#666',
  },
  yearButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  studentList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  studentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  studentDetails: {
    gap: 2,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },
  studentProgram: {
    fontSize: 14,
    color: '#666',
  },
  studentId: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7A288A',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    height: 52,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#111',
  },
  modalButton: {
    backgroundColor: '#7A288A',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  imagePickerButton: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderStyle: 'dashed',
    marginBottom: 24,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: '#666',
  },
  pickedImage: {
    width: '100%',
    height: '100%',
  },
  required: {
    color: '#FF3B30',
    marginLeft: 4,
  },
});
