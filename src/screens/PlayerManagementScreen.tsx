import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  IconButton,
  TextInput,
  Button,
  Divider,
  List,
  Portal,
  Dialog,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationParams, SavedPlayer } from '../types/index';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  addSavedPlayer,
  updateSavedPlayer,
  deleteSavedPlayer,
} from '../store/slices/playerSlice';
import { COLORS, spacing } from '../constants/defaultConfigs';
import { useToast } from '../utils/toast';

type PlayerManagementScreenProps = {
  navigation: NativeStackNavigationProp<NavigationParams, 'PlayerManagement'>;
};

const PlayerManagementScreen: React.FC<PlayerManagementScreenProps> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const savedPlayers = useAppSelector((state) => state.player.savedPlayers);

  const [newPlayerName, setNewPlayerName] = useState('');
  const [editingPlayer, setEditingPlayer] = useState<SavedPlayer | null>(null);
  const [editName, setEditName] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<SavedPlayer | null>(null);

  const handleAddPlayer = () => {
    if (!newPlayerName.trim()) {
      showToast('Please enter a player name', 'error');
      return;
    }

    // Check for duplicate
    if (savedPlayers.some((p) => p.name.toLowerCase() === newPlayerName.toLowerCase())) {
      showToast('Player name already exists', 'error');
      return;
    }

    const newPlayer: SavedPlayer = {
      id: `player_${Date.now()}`,
      name: newPlayerName.trim(),
      gamesPlayed: 0,
      lastUsed: Date.now(),
    };

    dispatch(addSavedPlayer(newPlayer));
    setNewPlayerName('');
    showToast('Player added successfully', 'success');
  };

  const handleEditPlayer = (player: SavedPlayer) => {
    setEditingPlayer(player);
    setEditName(player.name);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      showToast('Please enter a player name', 'error');
      return;
    }

    if (editingPlayer) {
      const updatedPlayer: SavedPlayer = {
        ...editingPlayer,
        name: editName.trim(),
      };
      dispatch(updateSavedPlayer(updatedPlayer));
      setEditingPlayer(null);
      setEditName('');
      showToast('Player updated successfully', 'success');
    }
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setEditName('');
  };

  const handleDeletePlayer = (playerId: string) => {
    const player = savedPlayers.find((p) => p.id === playerId);
    setPlayerToDelete(player || null);
    setShowDeleteDialog(true);
  };

  const confirmDeletePlayer = () => {
    if (playerToDelete) {
      dispatch(deleteSavedPlayer(playerToDelete.id));
      showToast('Player deleted successfully', 'success');
    }
    setShowDeleteDialog(false);
    setPlayerToDelete(null);
  };

  const sortedPlayers = [...savedPlayers].sort((a, b) => {
    // Sort by last used, most recent first
    return b.lastUsed - a.lastUsed;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          iconColor={COLORS.text}
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Player Management</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add New Player */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Add New Player</Text>
            <View style={styles.addPlayerContainer}>
              <TextInput
                mode="outlined"
                label="Player Name"
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                style={styles.input}
                onSubmitEditing={handleAddPlayer}
                returnKeyType="done"
              />
              <IconButton
                icon="plus"
                mode="contained"
                iconColor={COLORS.text}
                containerColor={COLORS.primary}
                size={24}
                onPress={handleAddPlayer}
              />
            </View>
          </Card.Content>
        </Card>

        {/* Saved Players List */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Saved Players ({savedPlayers.length})
            </Text>

            {sortedPlayers.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No saved players yet</Text>
                <Text style={styles.emptySubtext}>
                  Add players to quickly start games
                </Text>
              </View>
            ) : (
              <>
                {sortedPlayers.map((player) => (
                  <View key={player.id}>
                    {editingPlayer?.id === player.id ? (
                      <View style={styles.editContainer}>
                        <TextInput
                          mode="outlined"
                          value={editName}
                          onChangeText={setEditName}
                          style={styles.editInput}
                          autoFocus
                        />
                        <View style={styles.editActions}>
                          <IconButton
                            icon="check"
                            iconColor={COLORS.success}
                            size={20}
                            onPress={handleSaveEdit}
                          />
                          <IconButton
                            icon="close"
                            iconColor={COLORS.danger}
                            size={20}
                            onPress={handleCancelEdit}
                          />
                        </View>
                      </View>
                    ) : (
                      <List.Item
                        title={player.name}
                        description={`${player.gamesPlayed} games played • Last used ${getRelativeTime(player.lastUsed)}`}
                        left={(props) => (
                          <List.Icon {...props} icon="account" color={COLORS.primary} />
                        )}
                        right={(props) => (
                          <View style={styles.playerActions}>
                            <IconButton
                              icon="pencil"
                              iconColor={COLORS.primary}
                              size={20}
                              onPress={() => handleEditPlayer(player)}
                            />
                            <IconButton
                              icon="delete"
                              iconColor={COLORS.danger}
                              size={20}
                              onPress={() => handleDeletePlayer(player.id)}
                            />
                          </View>
                        )}
                        style={styles.playerItem}
                        titleStyle={styles.playerName}
                        descriptionStyle={styles.playerDescription}
                      />
                    )}
                    <Divider />
                  </View>
                ))}
              </>
            )}
          </Card.Content>
        </Card>

        {/* Stats */}
        {savedPlayers.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Statistics</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>{savedPlayers.length}</Text>
                  <Text style={styles.statLabel}>Total Players</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {savedPlayers.reduce((sum, p) => sum + p.gamesPlayed, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total Games</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {getMostActive()?.name.substring(0, 8) || '-'}
                  </Text>
                  <Text style={styles.statLabel}>Most Active</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => {
            setShowDeleteDialog(false);
            setPlayerToDelete(null);
          }}
          style={styles.dialog}
        >
          <Dialog.Title style={styles.dialogTitle}>Delete Player</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>
              Are you sure you want to delete {playerToDelete?.name}? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="text"
              onPress={() => {
                setShowDeleteDialog(false);
                setPlayerToDelete(null);
              }}
              style={styles.dialogButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              buttonColor={COLORS.danger}
              textColor={COLORS.text}
              onPress={confirmDeletePlayer}
              style={styles.dialogButton}
            >
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );

  function getMostActive(): SavedPlayer | null {
    if (savedPlayers.length === 0) return null;
    return savedPlayers.reduce((prev, current) =>
      prev.gamesPlayed > current.gamesPlayed ? prev : current
    );
  }
};

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

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
  card: {
    backgroundColor: COLORS.surface,
    marginBottom: spacing.md,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: spacing.md,
  },
  addPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
  },
  playerItem: {
    paddingVertical: spacing.xs,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  playerDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  playerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  editInput: {
    flex: 1,
  },
  editActions: {
    flexDirection: 'row',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
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

export default PlayerManagementScreen;

