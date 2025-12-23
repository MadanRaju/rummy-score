import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  TextInput,
  Card,
  Chip,
  IconButton,
  Divider,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationParams, Player, GameConfig } from '../types/index';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { startNewGame } from '../store/slices/gameSlice';
import { updatePlayerLastUsed, addSavedPlayer } from '../store/slices/playerSlice';
import { COLORS, spacing, MAX_PLAYERS, MIN_PLAYERS } from '../constants/defaultConfigs';
import { useToast } from '../utils/toast';

type NewGameScreenProps = {
  navigation: NativeStackNavigationProp<NavigationParams, 'NewGame'>;
};

const NewGameScreen: React.FC<NewGameScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const savedPlayers = useAppSelector((state) => state.player.savedPlayers);
  const configs = useAppSelector((state) => state.config.configs);
  const selectedConfigId = useAppSelector((state) => state.config.selectedConfigId);

  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedConfig, setSelectedConfig] = useState<GameConfig>(
    configs.find((c) => c.id === selectedConfigId) || configs[0]
  );

  const handleAddNewPlayer = () => {
    if (!newPlayerName.trim()) {
      showToast('Please enter a player name', 'error');
      return;
    }

    if (selectedPlayers.length >= MAX_PLAYERS) {
      showToast(`Maximum ${MAX_PLAYERS} players allowed`, 'error');
      return;
    }

    // Check if player already exists
    const existingPlayer = savedPlayers.find(
      (p) => p.name.toLowerCase() === newPlayerName.trim().toLowerCase()
    );

    if (existingPlayer) {
      // Player exists, just add to selected
      if (!selectedPlayers.includes(existingPlayer.id)) {
        setSelectedPlayers([...selectedPlayers, existingPlayer.id]);
      }
    } else {
      // Create new player and add to selected
      const newPlayerId = `player_${Date.now()}`;
      const newPlayer = {
        id: newPlayerId,
        name: newPlayerName.trim(),
        gamesPlayed: 0,
        lastUsed: Date.now(),
      };
      dispatch(addSavedPlayer(newPlayer));
      setSelectedPlayers([...selectedPlayers, newPlayerId]);
    }

    setNewPlayerName('');
  };

  const handleToggleSavedPlayer = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
    } else {
      if (selectedPlayers.length >= MAX_PLAYERS) {
        showToast(`Maximum ${MAX_PLAYERS} players allowed`, 'error');
        return;
      }
      setSelectedPlayers([...selectedPlayers, playerId]);
    }
  };

  const handleStartGame = () => {
    if (selectedPlayers.length < MIN_PLAYERS) {
      showToast(`Minimum ${MIN_PLAYERS} players required`, 'error');
      return;
    }

    // Create player objects
    const players: Player[] = selectedPlayers.map((playerId, index) => {
      const savedPlayer = savedPlayers.find((p) => p.id === playerId);
      
      if (savedPlayer) {
        dispatch(updatePlayerLastUsed(playerId));
        return {
          id: playerId,
          name: savedPlayer.name,
          totalScore: 0,
          isActive: true,
          isEliminated: false,
          gamesPlayed: 0,
          reEntryCount: 0,
        };
      }

      // Handle new player (not in saved players)
      return {
        id: playerId,
        name: `Player ${index + 1}`,
        totalScore: 0,
        isActive: true,
        isEliminated: false,
        gamesPlayed: 0,
        reEntryCount: 0,
      };
    });

    dispatch(startNewGame({ players, config: selectedConfig }));
    navigation.navigate('ActiveGame');
  };

  const handleRemovePlayer = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId));
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
        <Text style={styles.title}>New Game Setup</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Config Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Game Rules</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.configScroll}
            >
              {configs.map((config) => (
                <Chip
                  key={config.id}
                  selected={selectedConfig.id === config.id}
                  onPress={() => setSelectedConfig(config)}
                  style={[
                    styles.configChip,
                    selectedConfig.id === config.id && styles.selectedChip,
                  ]}
                  textStyle={styles.chipText}
                >
                  {config.name}
                </Chip>
              ))}
            </ScrollView>

            <View style={styles.configDetails}>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>First Drop:</Text>
                <Text style={styles.configValue}>{selectedConfig.firstDropPenalty} pts</Text>
              </View>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Middle Drop:</Text>
                <Text style={styles.configValue}>{selectedConfig.middleDropPenalty} pts</Text>
              </View>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Full Count:</Text>
                <Text style={styles.configValue}>{selectedConfig.fullCountPenalty} pts</Text>
              </View>
              <View style={styles.configRow}>
                <Text style={styles.configLabel}>Max Score:</Text>
                <Text style={styles.configValue}>{selectedConfig.maxScore} pts</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Player Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>
              Select Players ({selectedPlayers.length}/{MAX_PLAYERS})
            </Text>

            {/* Add New Player */}
            <View style={styles.addPlayerContainer}>
              <TextInput
                mode="outlined"
                label="Add New Player"
                value={newPlayerName}
                onChangeText={setNewPlayerName}
                style={styles.input}
                onSubmitEditing={handleAddNewPlayer}
                returnKeyType="done"
              />
              <IconButton
                icon="plus"
                mode="contained"
                iconColor={COLORS.text}
                containerColor={COLORS.primary}
                size={24}
                onPress={handleAddNewPlayer}
              />
            </View>

            <Divider style={styles.divider} />

            {/* Saved Players */}
            {savedPlayers.length > 0 && (
              <>
                <Text style={styles.subsectionTitle}>Saved Players</Text>
                <View style={styles.savedPlayersContainer}>
                  {[...savedPlayers]
                    .sort((a, b) => b.lastUsed - a.lastUsed)
                    .map((player) => (
                      <Chip
                        key={player.id}
                        selected={selectedPlayers.includes(player.id)}
                        onPress={() => handleToggleSavedPlayer(player.id)}
                        style={[
                          styles.playerChip,
                          selectedPlayers.includes(player.id) && styles.selectedChip,
                        ]}
                        textStyle={styles.chipText}
                      >
                        {player.name}
                      </Chip>
                    ))}
                </View>
              </>
            )}

            {/* Selected Players List */}
            {selectedPlayers.length > 0 && (
              <>
                <Divider style={styles.divider} />
                <Text style={styles.subsectionTitle}>Selected Players</Text>
                {selectedPlayers.map((playerId) => {
                  const player = savedPlayers.find((p) => p.id === playerId);
                  return (
                    <View key={playerId} style={styles.selectedPlayerRow}>
                      <Text style={styles.selectedPlayerName}>
                        {player?.name || 'New Player'}
                      </Text>
                      <IconButton
                        icon="close"
                        size={20}
                        iconColor={COLORS.danger}
                        onPress={() => handleRemovePlayer(playerId)}
                      />
                    </View>
                  );
                })}
              </>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Start Game Button */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleStartGame}
          style={styles.startButton}
          labelStyle={styles.startButtonLabel}
          disabled={selectedPlayers.length < MIN_PLAYERS}
        >
          Start Game
        </Button>
      </View>
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
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  configScroll: {
    marginBottom: spacing.md,
  },
  configChip: {
    marginRight: spacing.sm,
  },
  selectedChip: {
    backgroundColor: COLORS.primary,
  },
  chipText: {
    fontSize: 14,
  },
  configDetails: {
    backgroundColor: COLORS.card,
    padding: spacing.md,
    borderRadius: 12,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  configLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  configValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  addPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
  },
  divider: {
    marginVertical: spacing.md,
  },
  savedPlayersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  playerChip: {
    marginBottom: spacing.xs,
  },
  selectedPlayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.card,
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  selectedPlayerName: {
    fontSize: 16,
    color: COLORS.text,
  },
  footer: {
    padding: spacing.md,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  startButton: {
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  startButtonLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
});

export default NewGameScreen;

