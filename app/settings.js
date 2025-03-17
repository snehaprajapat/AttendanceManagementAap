import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const settingsOptions = [
  {
    section: 'CONNECTIONS',
    items: [
      { id: 'wifi', title: 'Wi-Fi', icon: 'wifi-outline', status: 'Connected' },
      { id: 'bluetooth', title: 'Bluetooth', icon: 'bluetooth-outline', status: 'On' },
      { id: 'mobile', title: 'Mobile Data', icon: 'cellular-outline', status: '5G' },
      { id: 'airplane', title: 'Airplane Mode', icon: 'airplane-outline', status: 'Off' },
    ]
  },
  {
    section: 'PERSONALIZATION',
    items: [
      { id: 'display', title: 'Display & Brightness', icon: 'sunny-outline' },
      { id: 'sound', title: 'Sound & Haptics', icon: 'volume-high-outline' },
      { id: 'notifications', title: 'Notifications', icon: 'notifications-outline' },
      { id: 'privacy', title: 'Privacy & Security', icon: 'shield-checkmark-outline' },
    ]
  },
  {
    section: 'SYSTEM',
    items: [
      { id: 'language', title: 'Language & Region', icon: 'globe-outline' },
      { id: 'time', title: 'Date & Time', icon: 'time-outline' },
      { id: 'update', title: 'Software Update', icon: 'refresh-outline' },
      { id: 'storage', title: 'Storage', icon: 'save-outline' },
      { id: 'about', title: 'About Device', icon: 'information-circle-outline' },
    ]
  },
  {
    section: 'APPS & DATA',
    items: [
      { id: 'management', title: 'App Management', icon: 'apps-outline' },
      { id: 'backup', title: 'Backup & Restore', icon: 'cloud-upload-outline' },
      { id: 'default', title: 'Default Apps', icon: 'star-outline' },
    ]
  }
];

export default function Settings() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Profile Section */}
        <TouchableOpacity style={styles.profileSection}>
          <Image
            source={require('../assets/images/profile-placeholder.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Gourav Bairagi</Text>
            <Text style={styles.profileEmail}>gourav.bairagi@avantika.edu.in</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        {/* Settings Options */}
        {settingsOptions.map((section, index) => (
          <View key={section.section} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.section}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.settingItem,
                    itemIndex === section.items.length - 1 && styles.lastItem
                  ]}
                >
                  <View style={styles.settingIcon}>
                    <Ionicons name={item.icon} size={22} color="#7A288A" />
                  </View>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingTitle}>{item.title}</Text>
                    {item.status && (
                      <Text style={styles.settingStatus}>{item.status}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.version}>Version 2.1.0</Text>
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
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 8,
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
  searchButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginLeft: 16,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingInfo: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    fontSize: 16,
    color: '#111',
  },
  settingStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  version: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginVertical: 24,
  },
});
