import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HotlineModal from './HotlineModal';

const HotlineBody: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sample department data - structured for easy replacement with real data
  const departmentData = {
    hospitals: [
      {
        name: 'City General Hospital',
        address: '123 Main Street, Downtown, City 12345',
        contacts: ['(555) 123-4567', '(555) 123-4568']
      },
      {
        name: 'Regional Medical Center',
        address: '456 Health Ave, Medical District, City 12346',
        contacts: ['(555) 234-5678', '(555) 234-5679']
      },
      {
        name: 'Emergency Care Hospital',
        address: '789 Care Blvd, Emergency Zone, City 12347',
        contacts: ['(555) 345-6789']
      },
      {
        name: 'Community Health Center',
        address: '321 Community Dr, Residential Area, City 12348',
        contacts: ['(555) 456-7890', '(555) 456-7891', '(555) 456-7892']
      },
    ],
    fire: [
      {
        name: 'Fire Station 1 - Central',
        address: '100 Fire Station Rd, Central District, City 12345',
        contacts: ['911', '(555) 987-6543']
      },
      {
        name: 'Fire Station 2 - North',
        address: '200 North Ave, North District, City 12349',
        contacts: ['911', '(555) 876-5432']
      },
      {
        name: 'Fire Station 3 - South',
        address: '300 South Blvd, South District, City 12350',
        contacts: ['911', '(555) 765-4321']
      },
    ],
    police: [
      {
        name: 'Central Police Station',
        address: '150 Police Plaza, Government District, City 12345',
        contacts: ['911', '(555) 654-3210']
      },
      {
        name: 'East Precinct',
        address: '250 East Main St, East Side, City 12351',
        contacts: ['911', '(555) 543-2109']
      },
      {
        name: 'West Precinct',
        address: '350 West Ave, West Side, City 12352',
        contacts: ['911', '(555) 432-1098']
      },
    ],
    power: [
      {
        name: 'City Power Authority',
        address: '400 Power Plant Rd, Industrial Zone, City 12353',
        contacts: ['(555) 321-0987', '(555) 321-0988']
      },
      {
        name: 'Emergency Power Services',
        address: '500 Emergency Ln, Service District, City 12354',
        contacts: ['(555) 210-9876']
      },
      {
        name: 'Regional Grid Control',
        address: '600 Grid Control Ave, Tech Park, City 12355',
        contacts: ['(555) 109-8765', '(555) 109-8766']
      },
    ],
    disaster: [
      {
        name: 'Emergency Management Office',
        address: '700 Emergency Management Dr, Government Complex, City 12356',
        contacts: ['(555) 098-7654', '(555) 098-7655']
      },
      {
        name: 'Disaster Response Unit',
        address: '800 Response Unit Blvd, Emergency Services, City 12357',
        contacts: ['(555) 987-6543']
      },
      {
        name: 'Crisis Management Center',
        address: '900 Crisis Center St, Command District, City 12358',
        contacts: ['(555) 876-5432', '(555) 876-5433']
      },
    ],
  };

  // Dynamic categories with counts based on actual data
  const hotlineCategories = [
    {
      id: 'hospitals',
      title: 'Hospitals',
      subtitle: `See all ${departmentData.hospitals.length} departments`,
      icon: 'medical',
      iconColor: '#FF6B6B',
      backgroundColor: '#FFE5E5',
    },
    {
      id: 'fire',
      title: 'Fire Departments',
      subtitle: `See all ${departmentData.fire.length} departments`,
      icon: 'flame',
      iconColor: '#FF8C42',
      backgroundColor: '#FFF2E5',
    },
    {
      id: 'police',
      title: 'Police Stations',
      subtitle: `See all ${departmentData.police.length} departments`,
      icon: 'shield-checkmark',
      iconColor: '#4ECDC4',
      backgroundColor: '#E5F9F6',
    },
    {
      id: 'power',
      title: 'Power',
      subtitle: `See all ${departmentData.power.length} departments`,
      icon: 'flash',
      iconColor: '#FFD93D',
      backgroundColor: '#FFF9E5',
    },
    {
      id: 'disaster',
      title: 'Disaster Response',
      subtitle: `See all ${departmentData.disaster.length} departments`,
      icon: 'car',
      iconColor: '#6BCF7F',
      backgroundColor: '#E8F5E8',
    },
  ];

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedCategory('');
  };

  const getSelectedCategoryTitle = () => {
    const category = hotlineCategories.find(cat => cat.id === selectedCategory);
    return category ? category.title : '';
  };

  const getSelectedDepartments = () => {
    return departmentData[selectedCategory as keyof typeof departmentData] || [];
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Emergency Hotlines Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Hotlines</Text>
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>
            Connect instantly with emergency responders.
          </Text>
        </View>

        {/* Hotline Categories */}
        <View style={styles.categoriesContainer}>
          {hotlineCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category.id)}
              activeOpacity={0.7}
            >
              <View style={styles.categoryContent}>
                <View style={[styles.iconContainer, { backgroundColor: category.backgroundColor }]}>
                  <Ionicons 
                    name={category.icon as any} 
                    size={24} 
                    color={category.iconColor} 
                  />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <HotlineModal
        visible={modalVisible}
        onClose={handleCloseModal}
        categoryTitle={getSelectedCategoryTitle()}
        departments={getSelectedDepartments()}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  infoButton: {
    padding: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  categoriesContainer: {
    flex: 1,
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default HotlineBody;