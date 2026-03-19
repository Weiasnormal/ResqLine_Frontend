import React, { useMemo, useState, useRef } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
// Import react-native-maps
import MapView, { Marker } from 'react-native-maps';

import { useReport } from '../../_hooks/useApi';
import { Category, Status } from '../../_api/reports';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type TimelineItem = {
    label: string;
    time: string;
    reached: boolean;
    current: boolean;
};

const categoryLabelMap: Record<number, string> = {
    [Category.TrafficAccident]: 'Traffic Accident',
    [Category.FireIncident]: 'Fire',
    [Category.Flooding]: 'Flooding',
    [Category.StructuralDamage]: 'Structural Damage',
    [Category.MedicalEmergency]: 'Medical Emergency',
    [Category.Other]: 'Other',
};

const formatStatusLabel = (status: Status): string => {
    switch (status) {
        case Status.Submitted: return 'Submitted';
        case Status.Under_Review: return 'Under Review';
        case Status.In_Progress: return 'Dispatched';
        case Status.Resolved: return 'Resolved';
        case Status.Rejected: return 'Rejected';
        default: return 'Submitted';
    }
};

const getStatusRank = (status: Status): number => {
    switch (status) {
        case Status.Submitted: return 0;
        case Status.Under_Review: return 1;
        case Status.In_Progress: return 2;
        case Status.Resolved: return 3;
        case Status.Rejected: return 2;
        default: return 0;
    }
};

const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

const formatReportedAt = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

const ViewDetailsScreen: React.FC = () => {
    const params = useLocalSearchParams<{ id?: string; reportId?: string }>();
    const reportId = (params.reportId || params.id || '') as string;

    const [detailsVisible, setDetailsVisible] = useState(false);
    
    // Animation specific values
    const scrollY = useRef(new Animated.Value(0)).current;

    const { data: report, isLoading, error } = useReport(reportId);

    const title = report?.description || (report ? categoryLabelMap[report.category] : 'Report Details') || 'Report Details';
    const statusLabel = report ? formatStatusLabel(report.status) : 'Submitted';
    const categoryLabel = report ? categoryLabelMap[report.category] || 'Other' : 'Other';
    const locationLabel = report?.location?.reverseGeoCode || 'Location unavailable';
    const createdAt = report?.createdAt || new Date().toISOString();
    
    // Extract map coordinates safely
    const hasCoordinates = typeof report?.location?.latitude === 'number' && typeof report?.location?.longitude === 'number';
    const latitude = report?.location?.latitude || 14.0716; // Fallback to San Pablo City
    const longitude = report?.location?.longitude || 121.3233;

    const timeline = useMemo<TimelineItem[]>(() => {
        const createdDate = new Date(createdAt);
        const reviewDate = new Date(createdDate.getTime() + 3 * 60 * 1000);
        const dispatchedDate = new Date(createdDate.getTime() + 8 * 60 * 1000);
        const resolvedDate = new Date(createdDate.getTime() + 30 * 60 * 1000);

        const rank = report ? getStatusRank(report.status) : 0;

        return [
            { label: 'Submitted', time: formatTime(createdDate), reached: true, current: rank === 0 },
            { label: 'Under Review', time: rank >= 1 ? formatTime(reviewDate) : '--:--', reached: rank >= 1, current: rank === 1 },
            { label: 'Dispatched', time: rank >= 2 ? formatTime(dispatchedDate) : '--:--', reached: rank >= 2, current: rank === 2 },
            { label: 'Resolved', time: rank >= 3 ? formatTime(resolvedDate) : '--:--', reached: rank >= 3, current: rank === 3 },
        ];
    }, [createdAt, report]);

    // Animate map pushing up off screen when scrolled past 90%
    const mapTranslateY = scrollY.interpolate({
        inputRange: [0, SCREEN_HEIGHT * 0.2, SCREEN_HEIGHT],
        outputRange: [0, 0, -SCREEN_HEIGHT * 0.8],
        extrapolate: 'clamp',
    });

    // Fade out FAB as sheet moves from 70% to 90%
    const fabOpacity = scrollY.interpolate({
        inputRange: [0, SCREEN_HEIGHT * 0.1],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const handleCloseSheet = () => {
        setDetailsVisible(false);
        scrollY.setValue(0);
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F57C00" />
                <Text style={styles.loadingText}>Loading report details...</Text>
            </SafeAreaView>
        );
    }

    if (error || !report) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Ionicons name="alert-circle-outline" size={56} color="#FF5252" />
                <Text style={styles.errorTitle}>Unable to load report details</Text>
                <TouchableOpacity style={styles.primaryButton} onPress={() => router.back()}>
                    <Text style={styles.primaryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F2F4F6" />

            {/* Map Group Animated Together */}
            <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: mapTranslateY }] }]}>
                {hasCoordinates ? (
                    <MapView 
                        style={styles.mapPreview}
                        initialRegion={{
                            latitude: latitude,
                            longitude: longitude,
                            latitudeDelta: 0.01, // Keep it zoomed in close
                            longitudeDelta: 0.01,
                        }}
                        // Disable interactions since it's meant to be a preview banner initially
                        zoomEnabled={true}
                        scrollEnabled={true}
                        pitchEnabled={false}
                        rotateEnabled={false}
                    >
                        <Marker 
                            coordinate={{ latitude, longitude }}
                            title={categoryLabel}
                            description="Reported Location"
                        />
                    </MapView>
                ) : (
                    <View style={[styles.mapPreview, styles.mapPlaceholder]}>
                        <Ionicons name="map-outline" size={48} color="#9AA0A6" />
                        <Text style={styles.mapPlaceholderText}>Location unavailable</Text>
                    </View>
                )}
            </Animated.View>

            <SafeAreaView style={styles.headerSafeArea} pointerEvents="box-none">
                <View style={styles.headerRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.7}>
                        <Ionicons name="chevron-back" size={24} color="#191716" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>View Details</Text>
                    <View style={styles.backButton} />
                </View>
            </SafeAreaView>

            {/* Base Screen UI (Hidden when Details Modal is active to prevent blocking interactions) */}
            {!detailsVisible && (
                <>
                    <TouchableOpacity style={styles.expandFab} onPress={() => setDetailsVisible(true)} activeOpacity={0.8}>
                        <Ionicons name="expand-outline" size={20} color="#fff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.summaryCard} activeOpacity={0.9} onPress={() => setDetailsVisible(true)}>
                        <Text style={styles.summaryTitle} numberOfLines={2}>{title}</Text>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusBadgeText}>{statusLabel}</Text>
                        </View>
                    </TouchableOpacity>
                </>
            )}

            {/* Simulated Animated Bottom Sheet "Modal" */}
            {detailsVisible && (
                <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]} pointerEvents="box-none">
                    {/* Background overlay that allows tapping the map behind it */}
                    <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]} pointerEvents="none" />

                    <Animated.ScrollView
                        style={StyleSheet.absoluteFill}
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        scrollEventThrottle={16}
                        snapToOffsets={[0, SCREEN_HEIGHT * 0.2]} // Snaps at 70% and 90% marks
                        decelerationRate="fast"
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: true }
                        )}
                    >
                        {/* Transparent Spacer allows interacting with the map behind it */}
                        <TouchableOpacity
                            style={{ height: SCREEN_HEIGHT * 0.3 }}
                            activeOpacity={1}
                            onPress={handleCloseSheet}
                        />

                        {/* Expand/Collapse Button hovering above the Modal Content */}
                        <Animated.View style={{
                            position: 'absolute',
                            top: SCREEN_HEIGHT * 0.3 - 44 - 16, // Hovering just above the white card
                            right: 24,
                            opacity: fabOpacity,
                            zIndex: 10,
                        }}>
                            <TouchableOpacity
                                style={[styles.expandFab, { position: 'relative', bottom: 0, right: 0 }]}
                                onPress={handleCloseSheet}
                                activeOpacity={0.8}
                            >
                                <Ionicons name="expand-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        </Animated.View>

                        {/* Modal Content */}
                        <SafeAreaView style={[styles.modalContent, { minHeight: SCREEN_HEIGHT * 0.9, maxHeight: undefined }]}>
                            <View style={styles.modalScrollContent}>
                                <Text style={styles.detailsTitle}>{title}</Text>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusBadgeText}>{statusLabel}</Text>
                                </View>

                                <View style={styles.metaRow}>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="flame-outline" size={14} color="#FF8C42" />
                                        <Text style={styles.metaText}>{categoryLabel}</Text>
                                    </View>
                                     <View style={{ width: 70 }} />
                                    <View style={styles.metaItem}>
                                        <Ionicons name="location-outline" size={14} color="#666" />
                                        <Text style={styles.metaText} numberOfLines={1}>{locationLabel}</Text>
                                    </View>
                                </View>

                                <FlatList
                                    data={report.images || []}
                                    horizontal
                                    keyExtractor={(_, index) => `${report.id}-img-${index}`}
                                    style={styles.imagesList}
                                    contentContainerStyle={styles.imagesContent}
                                    showsHorizontalScrollIndicator={false}
                                    ListEmptyComponent={
                                        <View style={styles.emptyImageBox}>
                                            <Ionicons name="image-outline" size={24} color="#9AA0A6" />
                                            <Text style={styles.emptyImageText}>No images attached</Text>
                                        </View>
                                    }
                                    renderItem={({ item }) => (
                                        <Image
                                            source={{ uri: `data:image/jpeg;base64,${item}` }}
                                            style={styles.reportImage}
                                            resizeMode="cover"
                                        />
                                    )}
                                />

                                <Text style={styles.sectionTitle}>Description</Text>
                                <Text style={styles.descriptionText}>{report.description || 'No description provided.'}</Text>

                                <View style={styles.sectionDivider} />

                                <Text style={styles.sectionTitle}>Status Timeline</Text>
                                <View style={styles.timelineWrap}>
                                    {timeline.map((item, index) => (
                                        <View key={item.label} style={styles.timelineRow}>
                                            <View style={styles.timelineIndicatorColumn}>
                                                <View
                                                    style={[
                                                        styles.timelineDot,
                                                        item.current ? styles.timelineDotCurrent : item.reached ? styles.timelineDotReached : styles.timelineDotPending,
                                                    ]}
                                                />
                                                {index < timeline.length - 1 ? <View style={styles.timelineLine} /> : null}
                                            </View>
                                            <View style={[styles.timelineItemCard, !item.reached && styles.timelineItemCardPending]}>
                                                <Text style={[styles.timelineLabel, !item.reached && styles.timelineLabelPending]}>{item.label}</Text>
                                                <Text style={[styles.timelineTime, !item.reached && styles.timelineTimePending]}>{item.time}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>

                                <View style={styles.sectionDivider} />

                                <Text style={styles.sectionTitle}>Report Information</Text>
                                <View style={styles.infoRow}>
                                    <Ionicons name="calendar-outline" size={16} color="#555" />
                                    <Text style={styles.infoText}>Reported: {formatReportedAt(createdAt)}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <Ionicons name="pricetag-outline" size={16} color="#555" />
                                    <Text style={styles.infoText}>Report ID: {report.id}</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={() => router.replace({ pathname: '/(tabs)', params: { tab: 'report' } })}
                                >
                                    <Text style={styles.primaryButtonText}>Report Again</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.secondaryButton}
                                    onPress={() => router.replace({ pathname: '/(tabs)', params: { tab: 'hotline' } })}
                                >
                                    <Text style={styles.secondaryButtonText}>Contact Hotline</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </Animated.ScrollView>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4F6',
    },
    headerSafeArea: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(242, 244, 246, 0.9)', 
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    backButton: {
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        color: '#191716',
        fontFamily: 'OpenSans_700Bold',
    },
    mapPreview: {
        flex: 1,
        width: '100%',
    },
    mapPlaceholder: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E8EC',
    },
    mapPlaceholderText: {
        marginTop: 12,
        color: '#5F6368',
        fontSize: 14,
        fontFamily: 'OpenSans_600SemiBold',
    },
    summaryCard: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 24,
        elevation: 8,
    },
    summaryTitle: {
        fontSize: 18,
        color: '#1A1A1A',
        lineHeight: 28,
        fontFamily: 'OpenSans_700Bold',
        marginBottom: 12,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#FFF6CC',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    statusBadgeText: {
        fontSize: 15,
        color: '#993000',
        fontFamily: 'OpenSans_600SemiBold',
    },
    expandFab: {
        position: 'absolute',
        right: 24,
        bottom: 140,
        width: 34,
        height: 34,
        borderRadius: 22,
        backgroundColor: '#191716',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderColor: '#E1E1E1',
        borderWidth: 1,
        maxHeight: '70%',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    modalScrollContent: {
        paddingHorizontal: 18,
        paddingTop: 20,
        paddingBottom: 28,
    },
    detailsTitle: {
        fontSize: 18,
        lineHeight: 26,
        color: '#242424',
        fontFamily: 'OpenSans_700Bold',
        marginBottom: 8,
        marginTop: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 14,
        marginRight: 90,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: -75,
        flex: 1,
    },
    metaText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#333',
        fontFamily: 'OpenSans_400Regular',
    },
    imagesList: {
        marginBottom: 18,
    },
    imagesContent: {
        paddingVertical: 8,
    },
    reportImage: {
        width: 148,
        height: 112,
        borderRadius: 12,
        marginRight: 12,
    },
    emptyImageBox: {
        width: 220,
        height: 112,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D8D8D8',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    emptyImageText: {
        marginTop: 8,
        color: '#7A7A7A',
        fontSize: 13,
    },
    sectionTitle: {
        fontSize: 16,
        color: '#222',
        fontFamily: 'OpenSans_700Bold',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        fontFamily: 'OpenSans_400Regular',
    },
    sectionDivider: {
        height: 1,
        backgroundColor: '#E1E1E1',
        marginVertical: 18,
    },
    timelineWrap: {
        marginBottom: 6,
    },
    timelineRow: {
        flexDirection: 'row',
        alignItems: 'stretch',
    },
    timelineIndicatorColumn: {
        width: 24,
        alignItems: 'center',
    },
    timelineDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        marginTop: 16,
    },
    timelineDotReached: {
        backgroundColor: '#D8DADE',
    },
    timelineDotCurrent: {
        backgroundColor: '#F57C00',
    },
    timelineDotPending: {
        backgroundColor: '#ECEEF2',
    },
    timelineLine: {
        flex: 1,
        width: 2,
        backgroundColor: '#E2E3E6',
        marginTop: 6,
        marginBottom: -6,
    },
    timelineItemCard: {
        flex: 1,
        marginLeft: 10,
        marginBottom: 10,
        borderRadius: 12,
        backgroundColor: '#E9EBEE',
        paddingHorizontal: 14,
        paddingVertical: 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timelineItemCardPending: {
        backgroundColor: '#ECEEF2',
    },
    timelineLabel: {
        fontSize: 16,
        color: '#222',
        fontFamily: 'OpenSans_700Bold',
    },
    timelineLabelPending: {
        color: '#A8ADB5',
    },
    timelineTime: {
        fontSize: 14,
        color: '#222',
        fontFamily: 'OpenSans_400Regular',
    },
    timelineTimePending: {
        color: '#A8ADB5',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    infoText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#2F3133',
        fontFamily: 'OpenSans_400Regular',
    },
    primaryButton: {
        marginTop: 16,
        borderRadius: 15,
        backgroundColor: '#F57C00',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'OpenSans_700Bold',
    },
    secondaryButton: {
        marginTop: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#F57C00',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    secondaryButtonText: {
        color: '#F57C00',
        fontSize: 18,
        fontFamily: 'OpenSans_700Bold',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F2F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    loadingText: {
        marginTop: 10,
        color: '#555',
        fontSize: 14,
        fontFamily: 'OpenSans_400Regular',
    },
    errorTitle: {
        marginTop: 8,
        marginBottom: 14,
        color: '#333',
        fontSize: 16,
        fontFamily: 'OpenSans_700Bold',
    }
});

export default ViewDetailsScreen;