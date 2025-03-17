import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { auth } from './firebaseConfig';

export default function Profile() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    role: "Associative Professor",
    department: "SOE",
    employeeId: "EMP101234",
    email: "",
    phone: "+91 7485748506",
    location: "A wing 4th Floor",
    joinDate: "Aug 15, 2024"
  });

  const [editedData, setEditedData] = useState({...profileData});

  useEffect(() => {
    // Get current user's name and email from Firebase Auth
    const user = auth.currentUser;
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, []);

  const handleSave = () => {
    setProfileData(editedData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    router.replace('/login');
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.headerBar}>
          {/* Back Button */}
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />  
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.header}>
          <Image
            source={require('../assets/images/profile-placeholder.png')}
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Ionicons name="checkmark-circle" size={24} color="#7A288A" />
          </View>
          <Text style={styles.name}>{profileData.name}</Text>
          <Text style={styles.role}>{profileData.role}</Text>
          <Text style={styles.department}>{profileData.department}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setIsEditing(true)}>
            <Ionicons name="create-outline" size={24} color="#7A288A" />
            <Text style={styles.actionText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleSettings}>
            <Ionicons name="settings-outline" size={24} color="#7A288A" />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle-outline" size={24} color="#7A288A" />
            <Text style={styles.actionText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <TouchableOpacity style={styles.detailItem}>
            <Ionicons name="card-outline" size={24} color="#7A288A" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Employee ID</Text>
              <Text style={styles.detailValue}>{profileData.employeeId}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.detailItem}>
            <Ionicons name="mail-outline" size={24} color="#7A288A" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Email</Text>
              <Text style={styles.detailValue}>{profileData.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.detailItem}>
            <Ionicons name="call-outline" size={24} color="#7A288A" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{profileData.phone}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.detailItem}>
            <Ionicons name="location-outline" size={24} color="#7A288A" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{profileData.location}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.detailItem}>
            <Ionicons name="people-outline" size={24} color="#7A288A" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Department</Text>
              <Text style={styles.detailValue}>{profileData.department}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.detailItem}>
            <Ionicons name="briefcase-outline" size={24} color="#7A288A" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Position</Text>
              <Text style={styles.detailValue}>{profileData.role}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={24} color="#7A288A" />
            <View style={styles.detailText}>
              <Text style={styles.detailLabel}>Join Date</Text>
              <Text style={styles.detailValue}>{profileData.joinDate}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.name}
                  onChangeText={(text) => setEditedData({...editedData, name: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Role</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.role}
                  onChangeText={(text) => setEditedData({...editedData, role: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Department</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.department}
                  onChangeText={(text) => setEditedData({...editedData, department: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.email}
                  onChangeText={(text) => setEditedData({...editedData, email: text})}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.phone}
                  onChangeText={(text) => setEditedData({...editedData, phone: text})}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={editedData.location}
                  onChangeText={(text) => setEditedData({...editedData, location: text})}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
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
  scrollView: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 45,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  placeholder: {
    width: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    top: 85,
    right: '38%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
    marginTop: 10,
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  department: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#666',
    marginTop: 4,
    fontSize: 12,
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailText: {
    flex: 1,
    marginLeft: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#111',
    marginTop: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '90%',
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
  modalScroll: {
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 6,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#7A288A',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7A288A',
    marginHorizontal: 16,
    marginVertical: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
