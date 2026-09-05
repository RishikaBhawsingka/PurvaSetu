import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  LayoutDashboard,
  Truck,
  Navigation,
  AlertTriangle,
  AlertOctagon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ChevronRight,
  CloudRain,
  CornerDownRight
} from 'lucide-react-native';

/* ============================================================================
   PurvaSetu — Mobile App Dashboard (React Native)
   ----------------------------------------------------------------------------
   Native screen, not a web component. Requires:
     npm install lucide-react-native react-native-svg react-native-safe-area-context

   Colors below are the exact values used in the existing web app
   (frontend/src/index.css, KPICard.jsx, RiskBadge.jsx, Sidebar.jsx) — no new
   palette introduced. CSS custom properties don't exist in React Native, so
   they're hardcoded constants here instead of var() lookups.

   Typography: the web app uses the Apple system-font stack
   (-apple-system, "SF Pro Display"...). React Native has no equivalent
   multi-fallback string, so fontFamily is left unset — iOS falls back to San
   Francisco and Android to Roboto automatically, which is the standard native
   way of getting a "system font" look on each platform.

   Screen accepts optional `activeTab` + `onNavigate(id)` props so it can be
   wired into whatever navigation you use (React Navigation, Expo Router,
   etc). Tab ids ('dashboard', 'convoy-telematics', 'route-intelligence',
   'simulation', 'field-report') match the ids already used in the web app's
   Sidebar.jsx / app.jsx for consistency across platforms.
============================================================================ */

const COLORS = {
  bgPrimary: '#EDE8DC',
  bgCard: '#F3F0E7',
  border: 'rgba(32, 35, 31, 0.12)',
  forest: '#30483B', // primary brand / success / "low" risk
  terracotta: '#A9573F', // accent / critical / "high" severity
  mustard: '#B8944A', // accent / warning / "medium" severity
  textPrimary: '#20231F',
  textSecondary: '#4A5048',
  textMuted: 'rgba(32, 35, 31, 0.6)',
  cream: '#EDE8DC'
};

const RADIUS = { sm: 8, md: 12, lg: 16, full: 9999 };

const stats = [
  { id: 'routes', label: 'Active Routes', value: '12', Icon: Navigation, tint: COLORS.forest },
  { id: 'convoys', label: 'Convoys', value: '08', Icon: Truck, tint: COLORS.forest },
  { id: 'alerts', label: 'Active Alerts', value: '03', Icon: AlertTriangle, tint: COLORS.mustard },
  { id: 'incidents', label: 'Incidents', value: '05', Icon: AlertOctagon, tint: COLORS.terracotta }
];

const routes = [
  { id: 1, origin: 'Guwahati', destination: 'Shillong', status: 'On Route', eta: '2h 40m', distance: '98 km', risk: 'Low' },
  { id: 2, origin: 'Guwahati', destination: 'Imphal', status: 'On Route', eta: '8h 15m', distance: '470 km', risk: 'Moderate' },
  { id: 3, origin: 'Siliguri', destination: 'Gangtok', status: 'Delayed', eta: '4h 05m', distance: '114 km', risk: 'High' },
  { id: 4, origin: 'Guwahati', destination: 'Aizawl', status: 'On Route', eta: '11h 20m', distance: '585 km', risk: 'Low' }
];

const alerts = [
  {
    id: 1,
    title: 'Road Blockage',
    location: 'Shillong Bypass',
    severity: 'High',
    time: '12 mins ago',
    description: 'Debris from a landslide is obstructing both carriageways.',
    Icon: AlertOctagon
  },
  {
    id: 2,
    title: 'Weather Warning',
    location: 'Churachandpur',
    severity: 'Medium',
    time: '38 mins ago',
    description: 'Heavy rainfall may reduce visibility along the highway.',
    Icon: CloudRain
  },
  {
    id: 3,
    title: 'Traffic Congestion',
    location: 'Guwahati',
    severity: 'Low',
    time: '1 hr ago',
    description: 'Slow-moving traffic near the city bypass junction.',
    Icon: AlertTriangle
  },
  {
    id: 4,
    title: 'Route Deviation',
    location: 'Aizawl Highway',
    severity: 'Medium',
    time: '2 hrs ago',
    description: 'Convoy rerouted around a weight-restricted bridge section.',
    Icon: CornerDownRight
  }
];

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'convoy-telematics', label: 'Convoy', Icon: Truck },
  { id: 'route-intelligence', label: 'Route', Icon: Navigation },
  { id: 'simulation', label: 'Hazard', Icon: AlertTriangle },
  { id: 'field-report', label: 'Incident', Icon: AlertOctagon }
];

function getSeverityColors(level) {
  switch ((level || '').toLowerCase()) {
    case 'critical':
    case 'high':
      return { bg: COLORS.terracotta, text: COLORS.cream, dot: COLORS.cream };
    case 'moderate':
    case 'medium':
      return { bg: COLORS.mustard, text: COLORS.textPrimary, dot: COLORS.textPrimary };
    case 'low':
    default:
      return { bg: COLORS.forest, text: COLORS.cream, dot: COLORS.cream };
  }
}

function getStatusColor(status) {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'delayed' || normalized === 'rerouted') return COLORS.mustard;
  if (normalized === 'stopped' || normalized === 'blocked') return COLORS.terracotta;
  return COLORS.forest;
}

function withAlpha(hex, alphaHex) {
  return `${hex}${alphaHex}`;
}

export default function PurvaSetuMobileDashboard({ activeTab: activeTabProp, onNavigate }) {
  const insets = useSafeAreaInsets();
  const [internalTab, setInternalTab] = useState('dashboard');
  const activeTab = activeTabProp ?? internalTab;

  const handleNavigate = (id) => {
    setInternalTab(id);
    if (onNavigate) onNavigate(id);
  };

  return (
    <View style={styles.screen}>
      {/* Top Branding */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconWrap}>
            <ShieldCheck size={18} color={COLORS.cream} />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text style={styles.brandTitle}>PurvaSetu</Text>
            <Text style={styles.brandSubtitle}>Smart Route Intelligence</Text>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeGreeting}>Welcome Back 👋</Text>
          <Text style={styles.welcomeSubtext}>Your Northeast route intelligence dashboard</Text>
        </View>

        {/* Quick Overview */}
        <View>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Quick Overview</Text>
          </View>
          <View style={styles.statsGrid}>
            {stats.map((stat) => {
              const { Icon } = stat;
              return (
                <View key={stat.id} style={styles.statCard}>
                  <View style={[styles.statIconWrap, { backgroundColor: withAlpha(stat.tint, '1F') }]}>
                    <Icon size={18} color={stat.tint} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Active Routes */}
        <View>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Active Routes</Text>
            <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={14} color={COLORS.forest} />
            </TouchableOpacity>
          </View>
          <View style={styles.routeList}>
            {routes.map((route) => {
              const risk = getSeverityColors(route.risk);
              const statusColor = getStatusColor(route.status);
              return (
                <View key={route.id} style={styles.routeCard}>
                  <View style={styles.routeTopRow}>
                    <View style={styles.routeNameRow}>
                      <Text style={styles.routePoint} numberOfLines={1}>
                        {route.origin}
                      </Text>
                      <ArrowRight size={14} color={COLORS.textMuted} />
                      <Text style={styles.routePoint} numberOfLines={1}>
                        {route.destination}
                      </Text>
                    </View>
                    <View style={[styles.riskBadge, { backgroundColor: risk.bg }]}>
                      <View style={[styles.riskDot, { backgroundColor: risk.dot }]} />
                      <Text style={[styles.riskBadgeText, { color: risk.text }]}>{route.risk}</Text>
                    </View>
                  </View>

                  <View style={styles.routeStatusRow}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>{route.status}</Text>
                  </View>

                  <View style={styles.routeMetaRow}>
                    <View style={styles.routeMetaItem}>
                      <Clock size={13} color={COLORS.textMuted} />
                      <Text style={styles.routeMetaText}>ETA {route.eta}</Text>
                    </View>
                    <View style={styles.routeMetaDivider} />
                    <View style={styles.routeMetaItem}>
                      <MapPin size={13} color={COLORS.textMuted} />
                      <Text style={styles.routeMetaText}>{route.distance}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* System Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusCardLeft}>
            <View style={styles.statusIconWrap}>
              <CheckCircle2 size={18} color={COLORS.forest} />
            </View>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.statusTitle}>All systems operational</Text>
              <Text style={styles.statusSubtitle}>Last updated: 2 mins ago</Text>
            </View>
          </View>
          <View style={styles.statusPulseDot} />
        </View>

        {/* Recent Alerts */}
        <View style={{ paddingBottom: 4 }}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Alerts</Text>
            <TouchableOpacity style={styles.viewAllBtn} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View All</Text>
              <ChevronRight size={14} color={COLORS.forest} />
            </TouchableOpacity>
          </View>
          <View style={styles.alertList}>
            {alerts.map((alert) => {
              const { Icon } = alert;
              const sev = getSeverityColors(alert.severity);
              return (
                <View key={alert.id} style={styles.alertCard}>
                  <View style={[styles.alertIconWrap, { backgroundColor: withAlpha(sev.bg, '1F') }]}>
                    <Icon size={16} color={sev.bg} />
                  </View>
                  <View style={styles.alertBody}>
                    <View style={styles.alertTopRow}>
                      <Text style={styles.alertTitle}>{alert.title}</Text>
                      <View style={[styles.severityPill, { backgroundColor: sev.bg }]}>
                        <Text style={[styles.severityPillText, { color: sev.text }]}>{alert.severity}</Text>
                      </View>
                    </View>
                    <View style={styles.alertMetaRow}>
                      <MapPin size={12} color={COLORS.textMuted} />
                      <Text style={styles.alertMetaText}>{alert.location}</Text>
                      <Text style={styles.alertMetaDot}>•</Text>
                      <Clock size={12} color={COLORS.textMuted} />
                      <Text style={styles.alertMetaText}>{alert.time}</Text>
                    </View>
                    <Text style={styles.alertDescription}>{alert.description}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { paddingBottom: 8 + insets.bottom }]}>
        {navItems.map((item) => {
          const { Icon } = item;
          const isActive = activeTab === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.navItem}
              activeOpacity={0.7}
              onPress={() => handleNavigate(item.id)}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
            >
              {isActive && <View style={styles.navActiveIndicator} />}
              <Icon size={20} color={isActive ? COLORS.forest : COLORS.textMuted} strokeWidth={isActive ? 2.4 : 2} />
              <Text style={[styles.navLabel, { color: isActive ? COLORS.forest : COLORS.textMuted, fontWeight: isActive ? '700' : '500' }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const cardShadow = Platform.select({
  ios: {
    shadowColor: COLORS.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12
  },
  android: { elevation: 2 },
  default: {}
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary
  },
  header: {
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.bgPrimary
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  brandIconWrap: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.forest,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.forest,
    letterSpacing: -0.3
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 0.3,
    marginTop: 1
  },
  scroll: {
    flex: 1
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 16,
    gap: 20
  },
  welcomeCard: {
    backgroundColor: COLORS.forest,
    borderRadius: RADIUS.lg,
    padding: 20,
    gap: 4,
    ...cardShadow
  },
  welcomeGreeting: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.cream
  },
  welcomeSubtext: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(237, 232, 220, 0.82)'
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.forest
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12
  },
  statCard: {
    width: '48.5%',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 14,
    gap: 8
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center'
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.4
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary
  },
  routeList: {
    gap: 10
  },
  routeCard: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 15,
    gap: 9
  },
  routeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8
  },
  routeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1
  },
  routePoint: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.full
  },
  riskBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  riskDot: {
    width: 5,
    height: 5,
    borderRadius: 3
  },
  routeStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700'
  },
  routeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border
  },
  routeMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  routeMetaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500'
  },
  routeMetaDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.border
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 10
  },
  statusCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    flexShrink: 1
  },
  statusIconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: withAlpha(COLORS.forest, '1F'),
    alignItems: 'center',
    justifyContent: 'center'
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary
  },
  statusSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2
  },
  statusPulseDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: COLORS.forest
  },
  alertList: {
    gap: 10
  },
  alertCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 14
  },
  alertIconWrap: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertBody: {
    flex: 1,
    gap: 4
  },
  alertTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flexShrink: 1
  },
  severityPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full
  },
  severityPillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2
  },
  alertMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4
  },
  alertMetaText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500'
  },
  alertMetaDot: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginHorizontal: 1
  },
  alertDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginTop: 2
  },
  bottomNav: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: COLORS.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingHorizontal: 6
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 4,
    minHeight: 48
  },
  navLabel: {
    fontSize: 10.5,
    letterSpacing: 0.1
  },
  navActiveIndicator: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.forest
  }
});