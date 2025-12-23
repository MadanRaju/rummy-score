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
  Card,
  IconButton,
  Portal,
  Modal,
  TextInput,
  Divider,
  Chip,
  Dialog,
  Menu,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationParams, GameRound, RoundAction, Player, SavedPlayer } from '../types/index';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { addRound, endGame, removePlayer, reEntryPlayer, addPlayerMidGame } from '../store/slices/gameSlice';
import { addSavedPlayer } from '../store/slices/playerSlice';
import { COLORS, spacing, MAX_PLAYERS } from '../constants/defaultConfigs';
import { useToast } from '../utils/toast';

type ActiveGameScreenProps = {
  navigation: NativeStackNavigationProp<NavigationParams, 'ActiveGame'>;
};

const ActiveGameScreen: React.FC<ActiveGameScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const gameState = useAppSelector((state) => state.game);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [showScoreEntry, setShowScoreEntry] = useState(false);
  const [showPlayerMenu, setShowPlayerMenu] = useState<string | null>(null);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [dialogState, setDialogState] = useState<{
    visible: boolean;
    type: 'endGame' | 'removePlayer' | 'reEntry' | null;
    playerId?: string;
    playerName?: string;
  }>({
    visible: false,
    type: null,
  });

  const activePlayers = gameState.players.filter((p) => p.isActive && !p.isEliminated);
  const eliminatedPlayers = gameState.players.filter((p) => p.isEliminated);
  const savedPlayers = useAppSelector((state) => state.player.savedPlayers);

  const handleScoreChange = (playerId: string, value: string) => {
    setScores({ ...scores, [playerId]: value });
  };

  const handleQuickScore = (playerId: string, scoreType: 'FIRST_DROP' | 'MIDDLE_DROP' | 'FULL_COUNT') => {
    let score = 0;
    switch (scoreType) {
      case 'FIRST_DROP':
        score = gameState.config.firstDropPenalty;
        break;
      case 'MIDDLE_DROP':
        score = gameState.config.middleDropPenalty;
        break;
      case 'FULL_COUNT':
        score = gameState.config.fullCountPenalty;
        break;
    }
    setScores({ ...scores, [playerId]: score.toString() });
  };

  const handleSubmitRound = () => {
    // Validate all players have scores
    const missingScores = activePlayers.filter(
      (p) => !scores[p.id] || scores[p.id].trim() === ''
    );

    if (missingScores.length > 0) {
      showToast('Please enter scores for all active players', 'error');
      return;
    }

    // Create round object
    const roundScores: Record<string, number> = {};
    const actions: RoundAction[] = [];

    activePlayers.forEach((player) => {
      const score = parseInt(scores[player.id]) || 0;
      roundScores[player.id] = score;
      actions.push({
        playerId: player.id,
        actionType: 'NORMAL',
        score,
        timestamp: Date.now(),
      });
    });

    // Validate that not more than 1 player has 0 score
    const playersWithZeroScore = Object.values(roundScores).filter((score) => score === 0).length;
    if (playersWithZeroScore > 1) {
      showToast('Only one player can have 0 score per round', 'error');
      return;
    }

    const newRound: GameRound = {
      roundNumber: gameState.currentRound + 1,
      scores: roundScores,
      timestamp: Date.now(),
      actions,
    };

    dispatch(addRound(newRound));
    setScores({});
    setShowScoreEntry(false);

    showToast('Round scores submitted!', 'success');
  };

  const handleEndGame = () => {
    setDialogState({
      visible: true,
      type: 'endGame',
    });
  };

  const handleRemovePlayer = (playerId: string) => {
    const player = gameState.players.find((p) => p.id === playerId);
    setDialogState({
      visible: true,
      type: 'removePlayer',
      playerId,
      playerName: player?.name,
    });
  };

  // Check if any active player is in compulsory state (not eligible to drop)
  // A player is in compulsory if their score >= (maxScore - firstDropPenalty)
  // For example, in standard rules (maxScore=250, firstDropPenalty=20):
  // A player with score >= 230 cannot drop and must play compulsarily
  const hasPlayerInCompulsory = () => {
    const activePlayers = gameState.players.filter((p) => p.isActive && !p.isEliminated);
    const compulsoryThreshold = gameState.config.maxScore - gameState.config.firstDropPenalty;
    
    return activePlayers.some((player) => {
      // Player is in compulsory if their score is at or above the threshold
      return player.totalScore >= compulsoryThreshold;
    });
  };

  const handleReEntry = (playerId: string) => {
    // Check if any active player is in compulsory state (not eligible to drop)
    if (hasPlayerInCompulsory()) {
      const compulsoryThreshold = gameState.config.maxScore - gameState.config.firstDropPenalty;
      showToast(`Re-entry not allowed. A player with score >= ${compulsoryThreshold} is in compulsory (cannot drop)`, 'error');
      return;
    }

    const player = gameState.players.find((p) => p.id === playerId);
    
    // Check if re-entry is allowed (only immediately after elimination)
    // Re-entry is only allowed if the player was eliminated in the current round
    // If any rounds have been played since elimination, re-entry is not allowed
    if (player?.eliminatedAt !== undefined) {
      // Check if any rounds have been played since elimination
      const roundsAfterElimination = gameState.rounds.filter(
        (round) => round.roundNumber > player.eliminatedAt!
      );
      
      if (roundsAfterElimination.length > 0) {
        showToast('Re-entry not allowed. Another round has been played since elimination', 'error');
        return;
      }
    }

    setDialogState({
      visible: true,
      type: 'reEntry',
      playerId,
      playerName: player?.name,
    });
  };

  const handleAddPlayer = () => {
    // Check if any active player is in compulsory state
    if (hasPlayerInCompulsory()) {
      const compulsoryThreshold = gameState.config.maxScore - gameState.config.firstDropPenalty;
      showToast(`Cannot add player. A player with score >= ${compulsoryThreshold} is in compulsory (cannot drop)`, 'error');
      return;
    }

    // Check if max players reached
    if (gameState.players.filter((p) => p.isActive).length >= MAX_PLAYERS) {
      showToast(`Maximum ${MAX_PLAYERS} players allowed`, 'error');
      return;
    }

    setNewPlayerName('');
    setShowAddPlayerModal(true);
  };

  const handleAddNewPlayer = () => {
    if (!newPlayerName.trim()) {
      showToast('Please enter a player name', 'error');
      return;
    }

    // Check if any active player is in compulsory state
    if (hasPlayerInCompulsory()) {
      const compulsoryThreshold = gameState.config.maxScore - gameState.config.firstDropPenalty;
      showToast(`Cannot add player. A player with score >= ${compulsoryThreshold} is in compulsory (cannot drop)`, 'error');
      return;
    }

    // Check if max players reached
    if (gameState.players.filter((p) => p.isActive).length >= MAX_PLAYERS) {
      showToast(`Maximum ${MAX_PLAYERS} players allowed`, 'error');
      return;
    }

    // Check if player name already exists in game
    const nameExists = gameState.players.some(
      (p) => p.name.toLowerCase() === newPlayerName.trim().toLowerCase() && p.isActive
    );
    if (nameExists) {
      showToast('A player with this name is already in the game', 'error');
      return;
    }

    // Find the highest score among active players
    const activePlayers = gameState.players.filter((p) => p.isActive && !p.isEliminated);
    const highestScore = activePlayers.length > 0
      ? Math.max(...activePlayers.map((p) => p.totalScore))
      : 0;

    // Create new player ID
    const newPlayerId = `player_${Date.now()}`;

    // Save to saved players
    const savedPlayer: SavedPlayer = {
      id: newPlayerId,
      name: newPlayerName.trim(),
      gamesPlayed: 0,
      lastUsed: Date.now(),
    };
    dispatch(addSavedPlayer(savedPlayer));

    // Create new player with highest score
    const newPlayer: Player = {
      id: newPlayerId,
      name: newPlayerName.trim(),
      totalScore: highestScore,
      isActive: true,
      isEliminated: false,
      gamesPlayed: 0,
      reEntryCount: 0,
    };

    dispatch(addPlayerMidGame(newPlayer));
    setNewPlayerName('');
    setShowAddPlayerModal(false);
    showToast(`${newPlayerName.trim()} added to game with score ${highestScore}`, 'success');
  };

  const handleSelectPlayerToAdd = (savedPlayer: SavedPlayer) => {
    // Check if player is already in the game
    const alreadyInGame = gameState.players.some((p) => p.id === savedPlayer.id && p.isActive);
    if (alreadyInGame) {
      showToast('Player is already in the game', 'error');
      return;
    }

    // Find the highest score among active players
    const activePlayers = gameState.players.filter((p) => p.isActive && !p.isEliminated);
    const highestScore = activePlayers.length > 0
      ? Math.max(...activePlayers.map((p) => p.totalScore))
      : 0;

    // Create new player with highest score
    const newPlayer: Player = {
      id: savedPlayer.id,
      name: savedPlayer.name,
      totalScore: highestScore,
      isActive: true,
      isEliminated: false,
      gamesPlayed: 0,
      reEntryCount: 0,
    };

    dispatch(addPlayerMidGame(newPlayer));
    setShowAddPlayerModal(false);
    showToast(`${savedPlayer.name} added to game with score ${highestScore}`, 'success');
  };

  const handleDialogConfirm = () => {
    const { type, playerId } = dialogState;
    
    switch (type) {
      case 'endGame':
        dispatch(endGame());
        navigation.navigate('Home');
        break;
      case 'removePlayer':
        if (playerId) {
          dispatch(removePlayer(playerId));
          setShowPlayerMenu(null);
          showToast('Player removed from game', 'info');
        }
        break;
      case 'reEntry':
        if (playerId) {
          dispatch(reEntryPlayer(playerId));
          showToast('Player re-entered the game', 'success');
        }
        break;
    }
    
    setDialogState({ visible: false, type: null });
  };

  const handleDialogCancel = () => {
    setDialogState({ visible: false, type: null });
  };

  const getDialogContent = () => {
    switch (dialogState.type) {
      case 'endGame':
        return {
          title: 'End Game',
          message: 'Are you sure you want to end this game? All progress will be saved.',
          confirmText: 'End Game',
          confirmColor: COLORS.danger,
        };
      case 'removePlayer':
        return {
          title: 'Remove Player',
          message: `Are you sure you want to remove ${dialogState.playerName} from the game?`,
          confirmText: 'Remove',
          confirmColor: COLORS.danger,
        };
      case 'reEntry':
        return {
          title: 'Player Re-entry',
          message: `Allow ${dialogState.playerName} to re-enter the game?`,
          confirmText: 'Allow',
          confirmColor: COLORS.primary,
        };
      default:
        return null;
    }
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
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Round {gameState.currentRound + 1}</Text>
          <Text style={styles.subtitle}>{gameState.config.name}</Text>
        </View>
        <Menu
          visible={showOptionsMenu}
          onDismiss={() => setShowOptionsMenu(false)}
          anchor={
            <IconButton
              icon="menu"
              iconColor={COLORS.text}
              size={24}
              onPress={() => setShowOptionsMenu(true)}
            />
          }
          contentStyle={styles.menuContent}
        >
          <Menu.Item
            onPress={() => {
              setShowOptionsMenu(false);
              navigation.navigate('Scoreboard');
            }}
            title="View Scoreboard"
            leadingIcon="chart-bar"
          />
          <Menu.Item
            onPress={() => {
              setShowOptionsMenu(false);
              handleAddPlayer();
            }}
            title="Add Player"
            leadingIcon="account-plus"
          />
          <Menu.Item
            onPress={() => {
              setShowOptionsMenu(false);
              handleEndGame();
            }}
            title="End Game"
            leadingIcon="stop-circle"
            titleStyle={styles.menuItemDanger}
          />
        </Menu>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Players Scoreboard */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Active Players</Text>
            {activePlayers.map((player) => (
              <TouchableOpacity
                key={player.id}
                style={styles.playerRow}
                onPress={() => setShowPlayerMenu(showPlayerMenu === player.id ? null : player.id)}
              >
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>
                    {player.name}
                    {player.reEntryCount > 0 && ` (↻${player.reEntryCount})`}
                  </Text>
                  <Text style={styles.playerScore}>{player.totalScore} pts</Text>
                </View>
                <View style={styles.playerProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.min((player.totalScore / gameState.config.maxScore) * 100, 100)}%`,
                        backgroundColor:
                          player.totalScore / gameState.config.maxScore > 0.8
                            ? COLORS.danger
                            : player.totalScore / gameState.config.maxScore > 0.5
                            ? COLORS.warning
                            : COLORS.success,
                      },
                    ]}
                  />
                </View>

                {showPlayerMenu === player.id && (
                  <View style={styles.playerMenu}>
                    <Button
                      mode="text"
                      textColor={COLORS.danger}
                      onPress={() => handleRemovePlayer(player.id)}
                    >
                      Remove Player
                    </Button>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </Card.Content>
        </Card>

        {/* Eliminated Players */}
        {eliminatedPlayers.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Eliminated Players</Text>
              {eliminatedPlayers.map((player) => (
                <View key={player.id} style={styles.eliminatedPlayerRow}>
                  <View style={styles.playerInfo}>
                    <Text style={styles.eliminatedPlayerName}>{player.name}</Text>
                    <Text style={styles.eliminatedPlayerScore}>{player.totalScore} pts</Text>
                  </View>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => handleReEntry(player.id)}
                  >
                    Re-entry
                  </Button>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <Button
                mode="contained"
                onPress={() => setShowScoreEntry(true)}
                style={styles.quickActionButton}
                icon="pencil"
              >
                Enter Scores
              </Button>
              <Button
                mode="outlined"
                onPress={() => navigation.navigate('Scoreboard')}
                style={styles.quickActionButton}
                icon="chart-bar"
              >
                View Details
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="text"
          textColor={COLORS.danger}
          onPress={handleEndGame}
          style={styles.endGameButton}
        >
          End Game
        </Button>
      </ScrollView>

      {/* Score Entry Modal */}
      <Portal>
        <Modal
          visible={showScoreEntry}
          onDismiss={() => setShowScoreEntry(false)}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.modalTitle}>Enter Round Scores</Text>
          <ScrollView style={styles.modalContent}>
            {activePlayers.map((player) => (
              <View key={player.id} style={styles.scoreEntryRow}>
                <Text style={styles.scoreEntryName} numberOfLines={1}>
                  {player.name}
                </Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    mode="outlined"
                    value={scores[player.id] || ''}
                    onChangeText={(value) => handleScoreChange(player.id, value)}
                    keyboardType="numeric"
                    style={styles.scoreInput}
                    contentStyle={styles.scoreInputContent}
                    dense
                  />
                </View>
                <Chip
                  compact
                  onPress={() => setScores({ ...scores, [player.id]: '0' })}
                  style={styles.quickScoreChip}
                  textStyle={styles.chipText}
                >
                  0
                </Chip>
                <Chip
                  compact
                  onPress={() => handleQuickScore(player.id, 'FIRST_DROP')}
                  style={styles.quickScoreChip}
                  textStyle={styles.chipText}
                >
                  {gameState.config.firstDropPenalty}
                </Chip>
                <Chip
                  compact
                  onPress={() => handleQuickScore(player.id, 'MIDDLE_DROP')}
                  style={styles.quickScoreChip}
                  textStyle={styles.chipText}
                >
                  {gameState.config.middleDropPenalty}
                </Chip>
                <Chip
                  compact
                  onPress={() => handleQuickScore(player.id, 'FULL_COUNT')}
                  style={styles.quickScoreChip}
                  textStyle={styles.chipText}
                >
                  {gameState.config.fullCountPenalty}
                </Chip>
              </View>
            ))}
          </ScrollView>
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowScoreEntry(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmitRound}
              style={styles.modalButton}
            >
              Submit
            </Button>
          </View>
        </Modal>
      </Portal>

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={dialogState.visible}
          onDismiss={handleDialogCancel}
          style={styles.dialog}
        >
          {getDialogContent() && (
            <>
              <Dialog.Title style={styles.dialogTitle}>
                {getDialogContent()?.title}
              </Dialog.Title>
              <Dialog.Content>
                <Text style={styles.dialogMessage}>
                  {getDialogContent()?.message}
                </Text>
              </Dialog.Content>
              <Dialog.Actions style={styles.dialogActions}>
                <Button
                  mode="text"
                  onPress={handleDialogCancel}
                  textColor={COLORS.textSecondary}
                  style={styles.dialogButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleDialogConfirm}
                  buttonColor={getDialogContent()?.confirmColor}
                  textColor={COLORS.text}
                  style={styles.dialogButton}
                >
                  {getDialogContent()?.confirmText}
                </Button>
              </Dialog.Actions>
            </>
          )}
        </Dialog>
      </Portal>

      {/* Add Player Modal */}
      <Portal>
        <Modal
          visible={showAddPlayerModal}
          onDismiss={() => setShowAddPlayerModal(false)}
          contentContainerStyle={styles.addPlayerModal}
        >
          <Text style={styles.modalTitle}>Add Player to Game</Text>
          <Text style={styles.modalSubtitle}>
            Select a player to add. They will start with the current highest score ({Math.max(...gameState.players.filter((p) => p.isActive && !p.isEliminated).map((p) => p.totalScore), 0)}).
          </Text>
          
          {/* Add New Player Input */}
          <View style={styles.addNewPlayerContainer}>
            <TextInput
              mode="outlined"
              label="Add New Player"
              value={newPlayerName}
              onChangeText={setNewPlayerName}
              style={styles.addNewPlayerInput}
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

          <Divider style={styles.addPlayerDivider} />

          {/* Saved Players List */}
          <Text style={styles.savedPlayersTitle}>Saved Players</Text>
          <ScrollView style={styles.addPlayerList} showsVerticalScrollIndicator={false}>
            {savedPlayers
              .filter((sp) => !gameState.players.some((p) => p.id === sp.id && p.isActive))
              .map((savedPlayer) => (
                <TouchableOpacity
                  key={savedPlayer.id}
                  style={styles.addPlayerItem}
                  onPress={() => handleSelectPlayerToAdd(savedPlayer)}
                >
                  <Text style={styles.addPlayerName}>{savedPlayer.name}</Text>
                  <Text style={styles.addPlayerStats}>
                    {savedPlayer.gamesPlayed} games
                  </Text>
                </TouchableOpacity>
              ))}
            {savedPlayers.filter((sp) => !gameState.players.some((p) => p.id === sp.id && p.isActive)).length === 0 ? (
              <View style={styles.emptyPlayersContainer}>
                <Text style={styles.emptyPlayersText}>No saved players available</Text>
                <Text style={styles.emptyPlayersSubtext}>
                  All saved players are already in the game
                </Text>
              </View>
            ) : null}
          </ScrollView>
          <View style={styles.modalActions}>
            <Button
              mode="outlined"
              onPress={() => setShowAddPlayerModal(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
          </View>
        </Modal>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
  playerRow: {
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: COLORS.card,
    borderRadius: 12,
  },
  playerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  playerScore: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent,
  },
  playerProgress: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  playerMenu: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  eliminatedPlayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: spacing.sm,
    opacity: 0.6,
  },
  eliminatedPlayerName: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  eliminatedPlayerScore: {
    fontSize: 14,
    color: COLORS.danger,
  },
  quickActionsGrid: {
    gap: spacing.sm,
  },
  quickActionButton: {
    borderRadius: 12,
  },
  endGameButton: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  modal: {
    backgroundColor: COLORS.surface,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: spacing.md,
  },
  modalContent: {
    maxHeight: 400,
  },
  scoreEntryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  scoreEntryName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    width: 75,
    flexShrink: 0,
  },
  inputWrapper: {
    width: 65,
    flexShrink: 0,
  },
  scoreInput: {
    backgroundColor: COLORS.card,
    height: 40,
  },
  scoreInputContent: {
    textAlign: 'center',
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  quickScoreChip: {
    backgroundColor: COLORS.card,
    height: 36,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
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
  menuContent: {
    backgroundColor: COLORS.surface,
  },
  menuItemDanger: {
    color: COLORS.danger,
  },
  addPlayerModal: {
    backgroundColor: COLORS.surface,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    maxHeight: '70%',
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  addPlayerList: {
    maxHeight: 300,
  },
  addPlayerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  addPlayerName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  addPlayerStats: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  emptyPlayersContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyPlayersText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: spacing.xs,
  },
  emptyPlayersSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  addNewPlayerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  addNewPlayerInput: {
    flex: 1,
  },
  addPlayerDivider: {
    marginVertical: spacing.md,
  },
  savedPlayersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: spacing.sm,
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
});

export default ActiveGameScreen;

