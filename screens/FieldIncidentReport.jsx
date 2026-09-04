import React, { useState } from "react";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Platform,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// ============================================================
// DESIGN TOKENS — PurvaSetu brand
// ============================================================
const COLORS = {
  green: "#30483B",
  greenDark: "#233A2E",
  cream: "#EDE8DC",
  card: "#F6F1E7",
  terracotta: "#A9573F",
  gold: "#C2B47C",
  amber: "#B9793B",
  mutedGreen: "#6E8B74",
  text: "#20231F",
  textSecondary: "#6A6D65",
  border: "#E1DACB",
  white: "#FFFFFF",
};

const CARD_SHADOW = {
  shadowColor: "#20231F",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 3,
};

// ============================================================
// MOCK DATA — swap for API calls later
// ============================================================
const HIGHWAY_OPTIONS = [
  { id: "26", label: "#26 • NH-13: Dirang (Arunachal Pradesh) → Sela Pass (Arunachal Pradesh)" },
  { id: "27", label: "#27 • NH-27: Nagaon (Assam) → Haflong, Jatinga (Assam)" },
  { id: "08", label: "#08 • NH-2: Imphal (Manipur) → Kohima (Nagaland)" },
  { id: "44", label: "#44 • NH-6: Silchar (Assam) → Aizawl (Mizoram)" },
];

const DISRUPTION_TYPES = [
  "Landslide Risk Warning",
  "Heavy Rainfall",
  "Road Blockage",
  "Flooding",
  "Accident",
  "Poor Road Condition",
  "Other",
];

const SEVERITY_LEVELS = [
  { value: "LOW", label: "LOW — Minor Disruption" },
  { value: "MEDIUM", label: "MEDIUM — Caution Advised" },
  { value: "HIGH", label: "HIGH — Significant Risk" },
  { value: "CRITICAL_BLOCKED", label: "CRITICAL_BLOCKED — Road Severed (Full Closure)" },
];

const SEVERITY_META = {
  LOW: { label: "LOW", bg: COLORS.mutedGreen, text: COLORS.white },
  MEDIUM: { label: "MEDIUM", bg: COLORS.gold, text: COLORS.text },
  HIGH: { label: "HIGH", bg: COLORS.amber, text: COLORS.white },
  CRITICAL_BLOCKED: { label: "CRITICAL_BLOCKED", bg: COLORS.terracotta, text: COLORS.white },
};

const INITIAL_INCIDENTS = [
  {
    id: "inc-1",
    corridor: "NH-13 (Dirang → Sela Pass)",
    severity: "CRITICAL_BLOCKED",
    description:
      "Massive mudslide blocking NH-13 at Sela Pass elevation 4,100m. Clearance underway.",
    reporter: "Field Officer (field_officer)",
    time: "8 hrs ago",
  },
  {
    id: "inc-2",
    corridor: "NH-27 (Nagaon → Haflong (Jatinga))",
    severity: "HIGH",
    description:
      "Heavy rain causing waterlogging & debris flow on Dima Hasao hill highway.",
    reporter: "Field Officer (field_officer)",
    time: "8 hrs ago",
  },
];

// ============================================================
// Reusable bottom-sheet select field
// ============================================================
function SelectField({ label, icon, placeholder, value, options, onSelect, renderLabel }) {
  const [open, setOpen] = useState(false);

  const getItemValue = (item) => (typeof item === "string" ? item : item.value || item.id);
  const getItemLabel = (item) => (typeof item === "string" ? item : item.label);

  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <TouchableOpacity
        style={styles.selectControl}
        activeOpacity={0.7}
        onPress={() => setOpen(true)}
      >
        <View style={styles.selectIconWrap}>
          <Ionicons name={icon} size={16} color={COLORS.green} />
        </View>
        <Text
          style={[styles.selectText, !value && styles.selectPlaceholder]}
          numberOfLines={1}
        >
          {value ? renderLabel(value) : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{label}</Text>

              <FlatList
                data={options}
                keyExtractor={(item) => getItemValue(item)}
                showsVerticalScrollIndicator={false}
                style={styles.modalList}
                renderItem={({ item }) => {
                  const itemValue = getItemValue(item);
                  const itemLabel = getItemLabel(item);
                  const selected = itemValue === value;
                  return (
                    <TouchableOpacity
                      style={[styles.modalOption, selected && styles.modalOptionSelected]}
                      activeOpacity={0.7}
                      onPress={() => {
                        onSelect(itemValue);
                        setOpen(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selected && styles.modalOptionTextSelected,
                        ]}
                        numberOfLines={2}
                      >
                        {itemLabel}
                      </Text>
                      {selected && (
                        <Ionicons name="checkmark" size={18} color={COLORS.green} />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

// ============================================================
// Severity badge
// ============================================================
function SeverityBadge({ severity }) {
  const meta = SEVERITY_META[severity] || SEVERITY_META.LOW;
  return (
    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
      <View style={[styles.badgeDot, { backgroundColor: meta.text }]} />
      <Text style={[styles.badgeText, { color: meta.text }]} numberOfLines={1}>
        {meta.label}
      </Text>
    </View>
  );
}

// ============================================================
// Incident card
// ============================================================
function IncidentCard({ incident }) {
  return (
    <View style={styles.incidentCard}>
      <View style={styles.incidentHeaderRow}>
        <View style={styles.incidentTitleRow}>
          <Ionicons name="location-outline" size={16} color={COLORS.green} />
          <Text style={styles.incidentTitle} numberOfLines={2}>
            {incident.corridor}
          </Text>
        </View>
      </View>

      <SeverityBadge severity={incident.severity} />

      <Text style={styles.incidentDescription}>{incident.description}</Text>

      <View style={styles.incidentFooterRow}>
        <View style={styles.incidentFooterItem}>
          <Ionicons name="person-circle-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.incidentFooterText} numberOfLines={1}>
            Reported by: {incident.reporter}
          </Text>
        </View>
        <View style={styles.incidentFooterItem}>
          <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.incidentFooterText}>{incident.time}</Text>
        </View>
      </View>
    </View>
  );
}

// ============================================================
// Main screen
// ============================================================
export default function FieldIncidentReport() {
  const [highway, setHighway] = useState(null);
  const [disruptionType, setDisruptionType] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [description, setDescription] = useState("");
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showIncidents, setShowIncidents] = useState(true);

  const highwayLabel = (id) => {
    const found = HIGHWAY_OPTIONS.find((h) => h.id === id);
    return found ? found.label : "";
  };

  const severityLabel = (value) => {
    const found = SEVERITY_LEVELS.find((s) => s.value === value);
    return found ? found.label : "";
  };

  const handleSubmit = () => {
    if (!highway || !disruptionType || !severity || !description.trim()) {
      Alert.alert("Missing Information", "Please complete all required fields.");
      return;
    }

    const corridorName = highwayLabel(highway).replace(/^#\d+\s*•\s*/, "");

    const newIncident = {
      id: `inc-${Date.now()}`,
      corridor: corridorName,
      severity,
      description: description.trim(),
      reporter: "Field Officer (field_officer)",
      time: "Just now",
    };

    setIncidents((prev) => [newIncident, ...prev]);

    Alert.alert("Report Submitted", "Field incident has been successfully reported.");

    setHighway(null);
    setDisruptionType(null);
    setSeverity(null);
    setDescription("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <Text style={styles.brandName}>PurvaSetu</Text>

              <TouchableOpacity
                style={styles.profileButton}
                activeOpacity={0.7}
                onPress={() => setMenuOpen((prev) => !prev)}
              >
                <Ionicons name="person-circle-outline" size={26} color={COLORS.green} />
              </TouchableOpacity>
            </View>

            <Text style={styles.screenTitle}>Field Incident Report</Text>
            <Text style={styles.screenSubtitle}>
              Report road hazards and incidents encountered during your journey.
            </Text>
          </View>

          <Modal
            visible={menuOpen}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuOpen(false)}
          >
            <TouchableOpacity
              style={styles.profileMenuOverlay}
              activeOpacity={1}
              onPress={() => setMenuOpen(false)}
            >
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.profileMenu}>
                  <Text style={styles.profileMenuName}>Sneha Kesharwani</Text>
                  <View style={styles.profileMenuDivider} />
                  <TouchableOpacity
                    style={styles.profileMenuItem}
                    activeOpacity={0.7}
                    onPress={() => setMenuOpen(false)}
                  >
                    <Ionicons name="log-out-outline" size={16} color={COLORS.terracotta} />
                    <Text style={styles.profileMenuLogoutText}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </TouchableOpacity>
          </Modal>

          {/* Submit form card */}
          <View style={[styles.card, CARD_SHADOW]}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderIconWrap}>
                <Ionicons name="add" size={18} color={COLORS.green} />
              </View>
              <Text style={styles.cardHeaderText}>Submit Field Report</Text>
            </View>

            <SelectField
              label="Affected Highway Corridor / Segment"
              icon="map-outline"
              placeholder="Select a highway segment"
              value={highway}
              options={HIGHWAY_OPTIONS}
              onSelect={setHighway}
              renderLabel={highwayLabel}
            />

            <SelectField
              label="Disruption Type"
              icon="warning-outline"
              placeholder="Select disruption type"
              value={disruptionType}
              options={DISRUPTION_TYPES}
              onSelect={setDisruptionType}
              renderLabel={(v) => v}
            />

            <SelectField
              label="Severity Level"
              icon="alert-circle-outline"
              placeholder="Select severity level"
              value={severity}
              options={SEVERITY_LEVELS}
              onSelect={setSeverity}
              renderLabel={severityLabel}
            />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Hazard Description / Field Notes</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Describe road conditions, mud accumulation, structural damage..."
                placeholderTextColor={COLORS.textSecondary}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.reporterStrip}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.green} />
              <Text style={styles.reporterText}>
                <Text style={styles.reporterTextBold}>Submitting as: </Text>
                Field Officer{"\n"}
                <Text style={styles.reporterTextItalic}>Auto-tagged via AIS-140/GPS</Text>
              </Text>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              activeOpacity={0.85}
              onPress={handleSubmit}
            >
              <Ionicons name="paper-plane-outline" size={18} color={COLORS.cream} />
              <Text style={styles.submitButtonText}>Submit Field Report to HQ</Text>
            </TouchableOpacity>
          </View>

          {/* Active reports section */}
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="alert-circle" size={18} color={COLORS.terracotta} />
              <Text style={styles.sectionTitle}>Active Field Reports & Feed</Text>
            </View>
            <TouchableOpacity
              style={styles.countBadge}
              activeOpacity={0.75}
              onPress={() => setShowIncidents((prev) => !prev)}
            >
              <Text style={styles.countBadgeText}>{incidents.length} Active Incidents</Text>
            </TouchableOpacity>
          </View>

          {showIncidents && (
            <View style={styles.incidentsList}>
              {incidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 110,
  },

  // Header
  header: {
    marginBottom: 18,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  brandName: {
    fontSize: 15,
    fontWeight: "800",
    color: COLORS.green,
    letterSpacing: 0.4,
  },
  profileButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileMenuOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "flex-end",
    paddingTop: 62,
    paddingRight: 18,
  },
  profileMenu: {
    minWidth: 190,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    ...CARD_SHADOW,
  },
  profileMenuName: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    paddingVertical: 10,
  },
  profileMenuDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  profileMenuLogoutText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.terracotta,
    marginLeft: 8,
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.terracotta,
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },

  // Card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  cardHeaderIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: COLORS.cream,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardHeaderText: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },

  // Fields
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  selectControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 50,
  },
  selectIconWrap: {
    marginRight: 8,
  },
  selectText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginRight: 8,
  },
  selectPlaceholder: {
    color: COLORS.textSecondary,
  },
  textArea: {
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    minHeight: 120,
    fontSize: 14,
    color: COLORS.text,
  },

  // Reporter strip
  reporterStrip: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: COLORS.cream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 18,
  },
  reporterText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.text,
  },
  reporterTextBold: {
    fontWeight: "700",
  },
  reporterTextItalic: {
    fontStyle: "italic",
    color: COLORS.textSecondary,
  },

  // Submit button
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.green,
    borderRadius: 14,
    height: 54,
  },
  submitButtonText: {
    color: COLORS.cream,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 10,
  },

  // Section header
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginLeft: 8,
    flexShrink: 1,
  },
  countBadge: {
    backgroundColor: COLORS.green,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  countBadgeText: {
    color: COLORS.cream,
    fontSize: 12,
    fontWeight: "700",
  },

  // Incident cards
  incidentsList: {
    marginBottom: 8,
  },
  incidentCard: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 14,
    ...CARD_SHADOW,
  },
  incidentHeaderRow: {
    marginBottom: 10,
  },
  incidentTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  incidentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginLeft: 6,
    flexShrink: 1,
  },
  incidentDescription: {
    fontSize: 13.5,
    lineHeight: 20,
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 12,
  },
  incidentFooterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  incidentFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
    marginTop: 4,
  },
  incidentFooterText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 5,
  },

  // Badge
  badge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  // Modal / bottom sheet
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(32, 35, 31, 0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 28,
    maxHeight: "65%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.border,
    alignSelf: "center",
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
  },
  modalList: {
    marginTop: 4,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalOptionSelected: {
    backgroundColor: "rgba(48, 72, 59, 0.06)",
  },
  modalOptionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginRight: 10,
  },
  modalOptionTextSelected: {
    fontWeight: "700",
    color: COLORS.green,
  },
});