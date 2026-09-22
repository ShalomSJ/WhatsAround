import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCompassDirection, getDistanceKm } from '../../utils/geo';
import { AreaOverview, fetchAreaOverview, fetchNearbyLandmarks, Landmark } from '../../utils/overpass';

export default function ExploreScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [areaOverview, setAreaOverview] = useState<AreaOverview | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [category, setCategory] = useState<'all' | 'natural' | 'tourism' | 'historic'>('all');
  const [activeRadius, setActiveRadius] = useState<number>(25000);
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  const loadData = useCallback(async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        setRefreshing(false);
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(currentLocation);

      const userSpeed = currentLocation.coords.speed || 0;
      const dynamicRadius = userSpeed > 2.5 ? 10000 : 25000;
      setActiveRadius(dynamicRadius);

      const [realLandmarks, details] = await Promise.all([
        fetchNearbyLandmarks(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          dynamicRadius,
          category
        ),
        fetchAreaOverview(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        ),
      ]);

      setLandmarks(realLandmarks);
      setAreaOverview(details);
    } catch (error) {
      setErrorMsg('Error fetching location data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [category]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const formattedLandmarks = landmarks
    .map((landmark) => {
      if (!location) {
        return { ...landmark, distanceKm: 0, distance: '-- km', direction: '--' };
      }

      const distKm = getDistanceKm(
        location.coords.latitude,
        location.coords.longitude,
        landmark.latitude,
        landmark.longitude
      );

      const direction = getCompassDirection(
        location.coords.latitude,
        location.coords.longitude,
        landmark.latitude,
        landmark.longitude
      );

      const formattedDistance =
        distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm.toFixed(1)} km`;

      return {
        ...landmark,
        distanceKm: distKm,
        distance: formattedDistance,
        direction: direction,
      };
    })
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>WhatsAround</Text>
          <View style={styles.headerSubRow}>
            <Text style={styles.subtitle}>
              Radius: {activeRadius / 1000} km | (
              {location?.coords.speed && location.coords.speed > 2.5 ? 'Moving' : 'Stationary'})
            </Text>
            <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterRow}>
            {(['all', 'natural', 'tourism', 'historic'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterChip,
                  category === cat && styles.activeFilterChip,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    category === cat && styles.activeFilterChipText,
                  ]}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.statusBanner}>
          <View style={styles.gpsContainer}>
            {loading ? (
              <ActivityIndicator size="small" color="#0F4E77" />
            ) : errorMsg ? (
              <Text style={styles.gpsError}>{errorMsg}</Text>
            ) : location ? (
              <Text style={styles.gpsText}>
                📍 {areaOverview?.areaName || 'Location'}: {location.coords.latitude.toFixed(3)}, {location.coords.longitude.toFixed(3)}
              </Text>
            ) : (
              <Text style={styles.gpsError}>Unable to fetch location</Text>
            )}
          </View>

          {areaOverview && (
            <TouchableOpacity
              style={styles.guideButton}
              onPress={() => setShowGuideModal(true)}
            >
              <Text style={styles.guideButtonText}>📖 Area Guide & SOS</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={formattedLandmarks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            !loading ? (
              <Text style={styles.emptyText}>
                No landmarks found within {activeRadius / 1000} km. Try changing the category filter.
              </Text>
            ) : null
          }
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={() => <View style={{ height: 20 }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedLandmark(item)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <View style={styles.typeBadge}>
                  <Text style={styles.cardType}>{item.type}</Text>
                </View>
              </View>
              <View style={styles.cardDetails}>
                <View style={styles.metaBadge}>
                  <Text style={styles.metaText}>📍 {item.distance}</Text>
                </View>
                <Text style={styles.directionText}>🧭 Look {item.direction}</Text>
              </View>
            </TouchableOpacity>
          )}
        />

        <Modal
          visible={!!selectedLandmark}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setSelectedLandmark(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedLandmark?.name}</Text>
              <Text style={styles.modalSubtitle}>Type: {selectedLandmark?.type}</Text>

              {selectedLandmark?.tags && (
                <View style={styles.tagsBox}>
                  {Object.entries(selectedLandmark.tags).map(([key, val]) => (
                    <Text key={key} style={styles.tagText}>
                      • <Text style={{ fontWeight: 'bold' }}>{key}:</Text> {val}
                    </Text>
                  ))}
                </View>
              )}

              <Pressable
                style={styles.closeButton}
                onPress={() => setSelectedLandmark(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <Modal
          visible={showGuideModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowGuideModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '80%' }]}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>🏞️ {areaOverview?.areaName}</Text>
                <Text style={styles.modalSubtitle}>
                  {areaOverview?.countyOrRegion}, {areaOverview?.country}
                </Text>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeader}>📜 Historical Background</Text>
                  <Text style={styles.sectionBody}>
                    {areaOverview?.historicalSignificance || 'No historical background available for this area.'}
                  </Text>
                </View>

                <View style={styles.infoSection}>
                  <Text style={styles.sectionHeader}>⭐ What&apos;s Famous Here</Text>
                  <Text style={styles.sectionBody}>
                    {areaOverview?.famousFor || 'Local scenery, culture, and nature.'}
                  </Text>
                </View>

                <View style={styles.emergencyBox}>
                  <Text style={styles.emergencyTitle}>🚨 Emergency Contacts (In case lost)</Text>
                  <Text style={styles.emergencyText}>• National Emergency Services: 112 / 999</Text>
                  <Text style={styles.emergencyText}>• Police Assistance: 999</Text>
                  <Text style={styles.emergencyText}>• Medical Ambulance: 912</Text>
                  <Text style={styles.emergencySub}>
                    Tip: Save your current coordinates ({location?.coords.latitude.toFixed(4)}, {location?.coords.longitude.toFixed(4)}) to share with emergency responders if needed.
                  </Text>
                </View>
              </ScrollView>

              <Pressable
                style={styles.closeButton}
                onPress={() => setShowGuideModal(false)}
              >
                <Text style={styles.closeButtonText}>Close Guide</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF5EE',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E7BD8B',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#372516',
  },
  headerSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#0F4E77',
    fontWeight: '500',
  },
  refreshButton: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E7BD8B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  refreshButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F4E77',
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#E7BD8B',
  },
  activeFilterChip: {
    backgroundColor: '#0F4E77',
    borderColor: '#0F4E77',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#372516',
  },
  activeFilterChipText: {
    color: '#FFFFFF',
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  gpsContainer: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#FAF5EE',
    borderRadius: 6,
  },
  gpsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#372516',
  },
  guideButton: {
    backgroundColor: '#0F4E77',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  guideButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  gpsError: {
    fontSize: 12,
    color: '#D9534F',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E7BD8B',
    shadowColor: '#372516',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#372516',
    flex: 1,
    paddingRight: 8,
  },
  typeBadge: {
    backgroundColor: '#89A377',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardType: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FAF5EE',
    paddingTop: 12,
  },
  metaBadge: {
    backgroundColor: '#FBD271',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#372516',
  },
  directionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F4E77',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E7BD8B',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#372516',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#0F4E77',
    marginVertical: 4,
    fontWeight: '600',
  },
  tagsBox: {
    marginVertical: 12,
    backgroundColor: '#FAF5EE',
    padding: 10,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 13,
    color: '#372516',
    marginBottom: 4,
  },
  infoSection: {
    marginTop: 12,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#372516',
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  emergencyBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F5C6CB',
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#D9534F',
    marginBottom: 6,
  },
  emergencyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#372516',
    marginBottom: 2,
  },
  emergencySub: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    fontStyle: 'italic',
  },
  closeButton: {
    marginTop: 14,
    backgroundColor: '#372516',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});