import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  IconButton,
  Button,
  Portal,
  Modal,
  TextInput,
  Divider,
  Dialog,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationParams, GameConfig } from '../types/index';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addConfig, updateConfig, deleteConfig, selectConfig } from '../store/slices/configSlice';
import { COLORS, spacing } from '../constants/defaultConfigs';
import { useToast } from '../utils/toast';

type ConfigPresetsScreenProps = {
  navigation: NativeStackNavigationProp<NavigationParams, 'ConfigPresets'>;
};

const ConfigPresetsScreen: React.FC<ConfigPresetsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const configs = useAppSelector((state) => state.config.configs);
  const selectedConfigId = useAppSelector((state) => state.config.selectedConfigId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [configToDelete, setConfigToDelete] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingConfig, setEditingConfig] = useState<GameConfig | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    firstDropPenalty: '',
    middleDropPenalty: '',
    fullCountPenalty: '',
    maxScore: '',
  });

  const handleOpenModal = (config?: GameConfig) => {
    if (config) {
      setEditingConfig(config);
      setFormData({
        name: config.name,
        firstDropPenalty: config.firstDropPenalty.toString(),
        middleDropPenalty: config.middleDropPenalty.toString(),
        fullCountPenalty: config.fullCountPenalty.toString(),
        maxScore: config.maxScore.toString(),
      });
    } else {
      setEditingConfig(null);
      setFormData({
        name: '',
        firstDropPenalty: '20',
        middleDropPenalty: '40',
        fullCountPenalty: '80',
        maxScore: '250',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingConfig(null);
  };

  const handleSaveConfig = () => {
    if (!formData.name.trim()) {
      showToast('Please enter a config name', 'error');
      return;
    }

    const newConfig: GameConfig = {
      id: editingConfig?.id || `config_${Date.now()}`,
      name: formData.name,
      firstDropPenalty: parseInt(formData.firstDropPenalty) || 20,
      middleDropPenalty: parseInt(formData.middleDropPenalty) || 40,
      fullCountPenalty: parseInt(formData.fullCountPenalty) || 80,
      maxScore: parseInt(formData.maxScore) || 250,
      isDefault: false,
    };

    if (editingConfig) {
      dispatch(updateConfig(newConfig));
      showToast('Config updated successfully', 'success');
    } else {
      dispatch(addConfig(newConfig));
      showToast('Config created successfully', 'success');
    }

    handleCloseModal();
  };

  const handleDeleteConfig = (configId: string) => {
    const config = configs.find((c) => c.id === configId);
    if (config?.isDefault) {
      showToast('Cannot delete default configs', 'error');
      return;
    }

    setConfigToDelete(configId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteConfig = () => {
    if (configToDelete) {
      dispatch(deleteConfig(configToDelete));
      showToast('Config deleted successfully', 'success');
    }
    setShowDeleteDialog(false);
    setConfigToDelete(null);
  };

  const handleSelectConfig = (configId: string) => {
    dispatch(selectConfig(configId));
    showToast('Default config updated', 'success');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={COLORS.text}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Game Presets</Text>
        <IconButton
          icon="plus"
          iconColor={COLORS.text}
          size={24}
          onPress={() => handleOpenModal()}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {configs.map((config) => (
          <Card
            key={config.id}
            style={[
              styles.configCard,
              selectedConfigId === config.id && styles.selectedCard,
            ]}
          >
            <Card.Content>
              <View style={styles.configHeader}>
                <View style={styles.configTitleContainer}>
                  <Text style={styles.configName}>{config.name}</Text>
                  {config.isDefault && (
                    <Text style={styles.defaultBadge}>Default</Text>
                  )}
                  {selectedConfigId === config.id && (
                    <Text style={styles.selectedBadge}>Selected</Text>
                  )}
                </View>
                <View style={styles.configActions}>
                  {!config.isDefault && (
                    <>
                      <IconButton
                        icon="pencil"
                        size={20}
                        iconColor={COLORS.primary}
                        onPress={() => handleOpenModal(config)}
                      />
                      <IconButton
                        icon="delete"
                        size={20}
                        iconColor={COLORS.danger}
                        onPress={() => handleDeleteConfig(config.id)}
                      />
                    </>
                  )}
                </View>
              </View>

              <Divider style={styles.divider} />

              <View style={styles.configDetails}>
                <View style={styles.configRow}>
                  <Text style={styles.configLabel}>First Drop</Text>
                  <Text style={styles.configValue}>{config.firstDropPenalty} pts</Text>
                </View>
                <View style={styles.configRow}>
                  <Text style={styles.configLabel}>Middle Drop</Text>
                  <Text style={styles.configValue}>{config.middleDropPenalty} pts</Text>
                </View>
                <View style={styles.configRow}>
                  <Text style={styles.configLabel}>Full Count</Text>
                  <Text style={styles.configValue}>{config.fullCountPenalty} pts</Text>
                </View>
                <View style={styles.configRow}>
                  <Text style={styles.configLabel}>Max Score</Text>
                  <Text style={styles.configValue}>{config.maxScore} pts</Text>
                </View>
              </View>

              {selectedConfigId !== config.id && (
                <Button
                  mode="outlined"
                  onPress={() => handleSelectConfig(config.id)}
                  style={styles.selectButton}
                >
                  Set as Default
                </Button>
              )}
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      {/* Add/Edit Config Modal */}
      <Portal>
        <Modal
          visible={showModal}
          onDismiss={handleCloseModal}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>
            {editingConfig ? 'Edit Config' : 'New Config'}
          </Text>

          <TextInput
            mode="outlined"
            label="Config Name"
            value={formData.name}
            onChangeText={(value) => setFormData({ ...formData, name: value })}
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="First Drop Penalty"
            value={formData.firstDropPenalty}
            onChangeText={(value) =>
              setFormData({ ...formData, firstDropPenalty: value })
            }
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Middle Drop Penalty"
            value={formData.middleDropPenalty}
            onChangeText={(value) =>
              setFormData({ ...formData, middleDropPenalty: value })
            }
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Full Count Penalty"
            value={formData.fullCountPenalty}
            onChangeText={(value) =>
              setFormData({ ...formData, fullCountPenalty: value })
            }
            keyboardType="numeric"
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Max Score (Elimination)"
            value={formData.maxScore}
            onChangeText={(value) => setFormData({ ...formData, maxScore: value })}
            keyboardType="numeric"
            style={styles.input}
          />

          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={handleCloseModal} style={styles.modalButton}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleSaveConfig} style={styles.modalButton}>
              Save
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => {
            setShowDeleteDialog(false);
            setConfigToDelete(null);
          }}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Delete Config</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              Are you sure you want to delete this config? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="text"
              onPress={() => {
                setShowDeleteDialog(false);
                setConfigToDelete(null);
              }}
              textColor={COLORS.textSecondary}
              style={styles.dialogButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={confirmDeleteConfig}
              buttonColor={COLORS.danger}
              textColor={COLORS.text}
              style={styles.dialogButton}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  configCard: {
    backgroundColor: COLORS.surface,
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  configHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  configName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  defaultBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.warning,
    backgroundColor: COLORS.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  selectedBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
    backgroundColor: COLORS.card,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  configActions: {
    flexDirection: 'row',
  },
  divider: {
    marginVertical: spacing.md,
  },
  configDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  configValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectButton: {
    marginTop: spacing.sm,
  },
  modal: {
    backgroundColor: COLORS.surface,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  modalButton: {
    minWidth: 100,
  },
  dialog: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    paddingBottom: spacing.xs,
  },
  dialogMessage: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  dialogActions: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  dialogButton: {
    minWidth: 80,
  },
});

export default ConfigPresetsScreen;

