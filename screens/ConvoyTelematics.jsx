/**
 * ConvoyTelematics.jsx — PurvaSetu
 * -----------------------------------------------------------------------
 * Mobile recreation of the NER Sentinel AI "Convoy Telematics" web page,
 * rebuilt feature-for-feature as a React Native screen.
 *
 * Reused from the reference (feature parity, see chat for full mapping):
 *  - Fleet summary stats (total / by commodity / delayed)
 *  - Live map placeholder (swap in your map lib — see MapPlaceholder below)
 *  - Commodity filter chips + search
 *  - Vehicle registry as tappable, expandable cards (was a desktop grid)
 *  - Active disruption / hazard alerts feed
 *  - Pull-to-refresh in place of the 30s auto-poll + manual refresh button
 *
 * Not ported (desktop-only / out of scope for a driver-facing mobile view):
 *  - The manual "GPS ping ingestion" test form (a dev/testing tool for
 *    simulating Traccar/AIS-140 pings — has no place in a field UI)
 *
 * Requires: react, react-native. Icons use lucide-react-native (the RN
 * counterpart of the lucide-react icons used in the reference). If your
 * project already uses a different icon set, swap the import block below
 * only — nothing else in this file depends on which icon library is used.
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  RefreshControl,
  Linking,
  StatusBar,
} from 'react-native';
import {
  ChevronLeft,
  RefreshCw,
  Search,
  X,
  Radio,
  Truck,
  Package,
  User,
  Phone,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Navigation2,
} from 'lucide-react-native';

import {
  colors,
  radii,
  spacing,
  typography,
  shadow,
  STATUS_META,
  SEVERITY_META,
} from '../theme/Theme';
import {
  convoyVehicles as MOCK_VEHICLES,
  disruptionAlerts as MOCK_ALERTS,
  COMMODITY_TYPES,
} from '../data/mockdata';

const FILTERS = [
  { key: 'ALL', label: 'All Fleets' },
  { key: 'POL_TANKER', label: `${COMMODITY_TYPES.POL_TANKER.emoji} POL Tankers` },
  { key: 'MEDICAL_AID', label: `${COMMODITY_TYPES.MEDICAL_AID.emoji} Medical Aid` },
  { key: 'FOOD_GRAINS', label: `${COMMODITY_TYPES.FOOD_GRAINS.emoji} Food Grains` },
  { key: 'GENERAL_SUPPLY', label: `${COMMODITY_TYPES.GENERAL_SUPPLY.emoji} Heavy Gear` },
];

export default function ConvoyTelematics({ navigation }) {
  const [vehicles] = useState(MOCK_VEHICLES);
  const [alerts] = useState(MOCK_ALERTS);
  const [commodityFilter, setCommodityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [alertsOpen, setAlertsOpen] = useState(true);

  // ---- Derived stats (mirrors the reference's fleet metric ribbon) ----
  const stats = useMemo(() => {
    const total = vehicles.length;
    const byType = (type) => vehicles.filter((v) => v.commodity_type === type).length;
    const delayed = vehicles.filter(
      (v) => v.status === 'DELAYED_LANDSLIDE' || v.status === 'REROUTING'
    ).length;
    const avgSpeed =
      total === 0
        ? 0
        : Math.round(vehicles.reduce((sum, v) => sum + v.speed_kmh, 0) / total);
    return {
      total,
      pol: byType('POL_TANKER'),
      medical: byType('MEDICAL_AID'),
      food: byType('FOOD_GRAINS'),
      delayed,
      avgSpeed,
    };
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return vehicles.filter((v) => {
      const matchesCommodity = commodityFilter === 'ALL' || v.commodity_type === commodityFilter;
      const matchesSearch =
        !q ||
        v.name.toLowerCase().includes(q) ||
        v.vehicle_reg_no.toLowerCase().includes(q) ||
        v.driver_name.toLowerCase().includes(q) ||
        v.destination.toLowerCase().includes(q);
      return matchesCommodity && matchesSearch;
    });
  }, [vehicles, commodityFilter, searchQuery]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: replace with real API calls, e.g.:
    // await Promise.all([api.getConvoys(), api.getDisruptions()])
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const toggleExpand = (id) => setExpandedId((cur) => (cur === id ? null : id));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bgPrimary} />

      {/* ---------- Header ---------- */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack?.()}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Convoy Telematics</Text>
          <View style={styles.liveRow}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveText}>AIS-140 live pings</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={onRefresh}
          style={styles.iconButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <RefreshCw size={19} color={colors.accentForest} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accentForest}
            colors={[colors.accentForest]}
          />
        }
      >
        {/* ---------- Summary stat cards ---------- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsRow}
        >
          <StatCard label="Tracked Fleets" value={`${stats.total}`} accent={colors.accentForest} />
          <StatCard
            label="POL Tankers"
            value={`${stats.pol}`}
            accent={colors.accentMustard}
            emoji="⛽"
          />
          <StatCard
            label="Medical Aid"
            value={`${stats.medical}`}
            accent={colors.accentTerracotta}
            emoji="💊"
          />
          <StatCard
            label="Food Grains"
            value={`${stats.food}`}
            accent={colors.accentForest}
            emoji="🌾"
          />
          <StatCard
            label="Rerouting/Delayed"
            value={`${stats.delayed}`}
            accent={colors.statusDanger}
            valueColor={colors.statusDanger}
          />
          <StatCard label="Avg Speed" value={`${stats.avgSpeed} km/h`} accent={colors.accentForest} />
        </ScrollView>

        {/* ---------- Map placeholder ---------- */}
        <View style={[styles.card, shadow]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Radio size={16} color={colors.accentForest} />
              <Text style={styles.cardHeaderTitle}>Live Fleet Radar</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{filteredVehicles.length} pins</Text>
            </View>
          </View>
          <MapPlaceholder count={filteredVehicles.length} />
        </View>

        {/* ---------- Alerts ---------- */}
        {alerts.length > 0 && (
          <View style={[styles.card, shadow]}>
            <TouchableOpacity
              style={styles.cardHeaderRow}
              onPress={() => setAlertsOpen((o) => !o)}
              activeOpacity={0.7}
            >
              <View style={styles.cardHeaderLeft}>
                <ShieldAlert size={16} color={colors.statusDanger} />
                <Text style={styles.cardHeaderTitle}>Active Disruptions</Text>
                <View style={[styles.badge, { backgroundColor: colors.statusDanger }]}>
                  <Text style={[styles.badgeText, { color: colors.white }]}>{alerts.length}</Text>
                </View>
              </View>
              {alertsOpen ? (
                <ChevronUp size={18} color={colors.textSecondary} />
              ) : (
                <ChevronDown size={18} color={colors.textSecondary} />
              )}
            </TouchableOpacity>

            {alertsOpen && (
              <View style={{ gap: spacing.sm, marginTop: spacing.sm }}>
                {alerts.map((a) => (
                  <AlertRow key={a.id} alert={a} />
                ))}
              </View>
            )}
          </View>
        )}

        {/* ---------- Filters + Search ---------- */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTERS.map((f) => {
            const active = commodityFilter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                onPress={() => setCommodityFilter(f.key)}
                style={[styles.filterChip, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.searchWrap}>
          <Search size={16} color={colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reg no, driver, destination..."
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={8}>
              <X size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ---------- Vehicle list ---------- */}
        <Text style={styles.sectionLabel}>
          {filteredVehicles.length} {filteredVehicles.length === 1 ? 'Vehicle' : 'Vehicles'}
        </Text>

        <View style={{ gap: spacing.md }}>
          {filteredVehicles.map((v) => (
            <VehicleCard
              key={v.convoy_id}
              vehicle={v}
              expanded={expandedId === v.convoy_id}
              onPress={() => toggleExpand(v.convoy_id)}
            />
          ))}

          {filteredVehicles.length === 0 && (
            <View style={styles.emptyState}>
              <Truck size={28} color={colors.textMuted} />
              <Text style={styles.emptyStateText}>No vehicles match your filters.</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-components                                                      */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, accent, valueColor, emoji }) {
  return (
    <View style={[styles.statCard, { borderLeftColor: accent }]}>
      <Text style={[styles.statLabel, { color: accent }]} numberOfLines={1}>
        {emoji ? `${emoji} ` : ''}
        {label}
      </Text>
      <Text style={[styles.statValue, valueColor && { color: valueColor }]}>{value}</Text>
    </View>
  );
}

function AlertRow({ alert }) {
  const meta = SEVERITY_META[alert.severity] || SEVERITY_META.LOW;
  return (
    <View style={[styles.alertRow, { borderLeftColor: meta.color }]}>
      <View style={styles.alertRowTop}>
        <Text style={styles.alertType}>{alert.type}</Text>
        <View style={[styles.severityPill, { backgroundColor: meta.color }]}>
          <Text style={styles.severityPillText}>{meta.label}</Text>
        </View>
      </View>
      <Text style={styles.alertDescription}>{alert.description}</Text>
      <View style={styles.alertMetaRow}>
        <Text style={styles.alertMeta}>{alert.vehicle}</Text>
        <Text style={styles.alertMeta}>{alert.location}</Text>
        <Text style={styles.alertMeta}>{alert.time}</Text>
      </View>
    </View>
  );
}

function VehicleCard({ vehicle, expanded, onPress }) {
  const status = STATUS_META[vehicle.status] || STATUS_META.IN_TRANSIT;
  const commodity = COMMODITY_TYPES[vehicle.commodity_type];
  const isDelayed = vehicle.status === 'DELAYED_LANDSLIDE';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.vehicleCard,
        isDelayed && styles.vehicleCardAlert,
        { borderColor: isDelayed ? colors.statusDanger : colors.borderNeutral },
      ]}
    >
      <View style={styles.vehicleTopRow}>
        <Text style={styles.vehicleReg}>
          {commodity?.emoji} {vehicle.vehicle_reg_no}
        </Text>
        <View style={[styles.statusPill, { backgroundColor: status.color }]}>
          <Text style={styles.statusPillText}>{status.label}</Text>
        </View>
      </View>

      <Text style={styles.vehicleName} numberOfLines={1}>
        {vehicle.name}
      </Text>

      <View style={styles.vehicleInfoRow}>
        <Navigation2 size={13} color={colors.textSecondary} />
        <Text style={styles.vehicleInfoText} numberOfLines={1}>
          {vehicle.origin} → {vehicle.destination} · {vehicle.speed_kmh} km/h
        </Text>
      </View>

      <View style={styles.vehicleInfoRow}>
        <Package size={13} color={colors.textSecondary} />
        <Text style={styles.vehicleInfoText} numberOfLines={1}>
          {vehicle.current_location_name}
        </Text>
      </View>

      {vehicle.hazard_flag && (
        <View style={styles.hazardBanner}>
          <AlertTriangle size={13} color={colors.statusDanger} />
          <Text style={styles.hazardText}>{vehicle.hazard_flag}</Text>
        </View>
      )}

      <View style={styles.vehicleFooterRow}>
        <Text style={styles.lastUpdated}>Updated {vehicle.last_updated}</Text>
        {expanded ? (
          <ChevronUp size={16} color={colors.textMuted} />
        ) : (
          <ChevronDown size={16} color={colors.textMuted} />
        )}
      </View>

      {expanded && (
        <View style={styles.expandedSection}>
          <View style={styles.driverRow}>
            <View style={styles.driverInfo}>
              <User size={13} color={colors.textSecondary} />
              <Text style={styles.driverText}>{vehicle.driver_name}</Text>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => Linking.openURL(`tel:${vehicle.driver_contact}`)}
            >
              <Phone size={13} color={colors.white} />
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.detailLine}>
            <Text style={styles.detailLabel}>Payload: </Text>
            {vehicle.payload_description}
          </Text>
          <Text style={styles.detailLine}>
            <Text style={styles.detailLabel}>Cargo weight: </Text>
            {vehicle.cargo_weight_tonnes} T · Priority: {vehicle.priority_level}
          </Text>
          <Text style={styles.detailLine}>
            <Text style={styles.detailLabel}>Escort: </Text>
            {vehicle.escort_unit}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/**
 * Clean placeholder for the map. The web reference uses react-leaflet.
 * If PurvaSetu already has a map component (react-native-maps or similar),
 * replace this whole component with that one — everything above passes
 * it `count` only, so swapping it out needs no other changes.
 */
function MapPlaceholder({ count }) {
  return (
    <View style={styles.mapPlaceholder}>
      <Radio size={26} color={colors.accentForest} />
      <Text style={styles.mapPlaceholderTitle}>Map view</Text>
      <Text style={styles.mapPlaceholderSubtitle}>
        {count} vehicle{count === 1 ? '' : 's'} currently tracked · connect your map component here
      </Text>
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Styles                                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.bgPrimary,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    ...typography.h1,
    color: colors.accentTerracotta,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentForest,
  },
  liveText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
    gap: spacing.lg,
  },

  // Stats
  statsRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.bgCard,
    borderLeftWidth: 4,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minWidth: 128,
  },
  statLabel: {
    ...typography.label,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 4,
  },

  // Generic card
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  cardHeaderTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  badge: {
    backgroundColor: colors.bgSecondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentForest,
  },

  // Map placeholder
  mapPlaceholder: {
    marginTop: spacing.md,
    height: 140,
    borderRadius: radii.md,
    backgroundColor: colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingHorizontal: spacing.lg,
  },
  mapPlaceholderTitle: {
    ...typography.h2,
    fontSize: 14,
    color: colors.textPrimary,
  },
  mapPlaceholderSubtitle: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },

  // Alerts
  alertRow: {
    borderLeftWidth: 3,
    backgroundColor: colors.bgPrimary,
    borderRadius: radii.sm,
    padding: spacing.sm,
    gap: 4,
  },
  alertRowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  alertType: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  severityPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  severityPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    textTransform: 'uppercase',
  },
  alertDescription: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  alertMetaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 2,
  },
  alertMeta: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
  },

  // Filters
  filterRow: {
    gap: spacing.sm,
    paddingRight: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.borderNeutral,
    backgroundColor: colors.bgCard,
  },
  filterChipActive: {
    backgroundColor: colors.accentForest,
    borderColor: colors.accentForest,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  filterChipTextActive: {
    color: colors.white,
  },

  // Search
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 42,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    padding: 0,
  },

  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },

  // Vehicle card
  vehicleCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    padding: spacing.md,
    gap: 6,
  },
  vehicleCardAlert: {
    backgroundColor: '#F7EFEC',
  },
  vehicleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  vehicleReg: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.accentForest,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.white,
    textTransform: 'uppercase',
  },
  vehicleName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  vehicleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vehicleInfoText: {
    fontSize: 12.5,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  hazardBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderRadius: radii.sm,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 2,
  },
  hazardText: {
    fontSize: 11.5,
    color: '#991B1B',
    fontWeight: '700',
    flexShrink: 1,
  },
  vehicleFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  lastUpdated: {
    fontSize: 11,
    color: colors.textMuted,
  },
  expandedSection: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 6,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.accentForest,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.sm,
  },
  callButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
  },
  detailLine: {
    fontSize: 12.5,
    color: colors.textSecondary,
  },
  detailLabel: {
    fontWeight: '700',
    color: colors.textPrimary,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 13,
    color: colors.textMuted,
  },
});