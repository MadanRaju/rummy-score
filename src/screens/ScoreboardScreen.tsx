import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  IconButton,
  DataTable,
  SegmentedButtons,
  Portal,
  Modal,
  TextInput,
  Button,
  Chip,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationParams, GameRound } from '../types/index';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { updateRound } from '../store/slices/gameSlice';
import { COLORS, spacing } from '../constants/defaultConfigs';
import { useToast } from '../utils/toast';

type ScoreboardScreenProps = {
  navigation: NativeStackNavigationProp<NavigationParams, 'Scoreboard'>;
};

const ScoreboardScreen: React.FC<ScoreboardScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { showToast } = useToast();
  const gameState = useAppSelector((state) => state.game);
  const [viewMode, setViewMode] = useState<'summary' | 'detailed'>('summary');
  const [editingRound, setEditingRound] = useState<GameRound | null>(null);
  const [editScores, setEditScores] = useState<Record<string, string>>({});

  const sortedPlayers = [...gameState.players].sort((a, b) => a.totalScore - b.totalScore);

  const getRankSuffix = (rank: number) => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  const handleEditRound = (round: GameRound) => {
    setEditingRound(round);
    // Initialize edit scores with current round scores
    const scores: Record<string, string> = {};
    gameState.players.forEach((player) => {
      scores[player.id] = (round.scores[player.id] || 0).toString();
    });
    setEditScores(scores);
  };

  const handleCloseEditModal = () => {
    setEditingRound(null);
    setEditScores({});
  };

  const handleScoreChange = (playerId: string, value: string) => {
    setEditScores({ ...editScores, [playerId]: value });
  };

  const handleQuickScore = (playerId: string, score: number) => {
    setEditScores({ ...editScores, [playerId]: score.toString() });
  };

  const handleSaveRound = () => {
    if (!editingRound) return;

    // Validate all players have scores
    const playersInRound = gameState.players.filter((p) => {
      // Check if player was active at the time of this round
      // For simplicity, check all players who have scores in the original round
      return editingRound.scores.hasOwnProperty(p.id);
    });

    const missingScores = playersInRound.filter(
      (p) => !editScores[p.id] || editScores[p.id].trim() === ''
    );

    if (missingScores.length > 0) {
      showToast('Please enter scores for all players', 'error');
      return;
    }

    // Validate scores are valid numbers
    const invalidScores = playersInRound.filter((p) => {
      const score = editScores[p.id];
      const numScore = parseInt(score);
      return isNaN(numScore) || numScore < 0;
    });

    if (invalidScores.length > 0) {
      showToast('Please enter valid scores (non-negative numbers)', 'error');
      return;
    }

    // Create updated round
    const updatedScores: Record<string, number> = {};
    playersInRound.forEach((player) => {
      updatedScores[player.id] = parseInt(editScores[player.id]) || 0;
    });

    // Validate that not more than 1 player has 0 score
    const playersWithZeroScore = Object.values(updatedScores).filter((score) => score === 0).length;
    if (playersWithZeroScore > 1) {
      showToast('Only one player can have 0 score per round', 'error');
      return;
    }

    const updatedRound: GameRound = {
      ...editingRound,
      scores: updatedScores,
      timestamp: Date.now(),
    };

    dispatch(updateRound({ roundNumber: editingRound.roundNumber, round: updatedRound }));
    showToast(`Round ${editingRound.roundNumber} updated successfully`, 'success');
    handleCloseEditModal();
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
        <Text style={styles.title}>Scoreboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.segmentContainer}>
        <SegmentedButtons
          value={viewMode}
          onValueChange={(value) => setViewMode(value as 'summary' | 'detailed')}
          buttons={[
            { value: 'summary', label: 'Summary' },
            { value: 'detailed', label: 'Detailed' },
          ]}
          style={styles.segmentButtons}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {viewMode === 'summary' ? (
          <>
            {/* Leaderboard */}
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Current Standings</Text>
                {sortedPlayers.map((player, index) => {
                  const rank = index + 1;
                  const isEliminated = player.isEliminated;
                  const isActive = player.isActive;

                  return (
                    <View
                      key={player.id}
                      style={[
                        styles.leaderboardRow,
                        rank === 1 && styles.firstPlace,
                        rank === 2 && styles.secondPlace,
                        rank === 3 && styles.thirdPlace,
                      ]}
                    >
                      <View style={styles.rankContainer}>
                        <Text
                          style={[
                            styles.rank,
                            rank <= 3 && styles.topRank,
                          ]}
                        >
                          {rank}
                          <Text style={styles.rankSuffix}>{getRankSuffix(rank)}</Text>
                        </Text>
                      </View>
                      <View style={styles.playerDetails}>
                        <Text
                          style={[
                            styles.leaderboardName,
                            !isActive && styles.inactiveName,
                          ]}
                        >
                          {player.name}
                          {isEliminated && ' 🚫'}
                          {player.reEntryCount > 0 && ` (↻${player.reEntryCount})`}
                        </Text>
                        <Text style={styles.gamesPlayed}>
                          {player.gamesPlayed} rounds
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.totalScore,
                          rank === 1 && styles.winnerScore,
                        ]}
                      >
                        {player.totalScore}
                      </Text>
                    </View>
                  );
                })}
              </Card.Content>
            </Card>

            {/* Game Stats */}
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Game Statistics</Text>
                <View style={styles.statsGrid}>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{gameState.currentRound}</Text>
                    <Text style={styles.statLabel}>Rounds Played</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>
                      {gameState.players.filter((p) => p.isActive).length}
                    </Text>
                    <Text style={styles.statLabel}>Active Players</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>
                      {gameState.players.filter((p) => p.isEliminated).length}
                    </Text>
                    <Text style={styles.statLabel}>Eliminated</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statValue}>{gameState.config.maxScore}</Text>
                    <Text style={styles.statLabel}>Max Score</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          </>
        ) : (
          <>
            {/* Detailed Round-by-Round View */}
            <Card style={styles.card}>
              <Card.Content>
                <Text style={styles.sectionTitle}>Round-by-Round Scores</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <DataTable>
                    <DataTable.Header>
                      <DataTable.Title style={styles.nameColumn}>Player</DataTable.Title>
                      {gameState.rounds.map((round) => (
                        <DataTable.Title
                          key={round.roundNumber}
                          numeric
                          style={styles.roundColumn}
                        >
                          R{round.roundNumber}
                        </DataTable.Title>
                      ))}
                      <DataTable.Title numeric style={styles.totalColumn}>
                        Total
                      </DataTable.Title>
                    </DataTable.Header>

                    {sortedPlayers.map((player) => {
                      const isEliminated = player.isEliminated;
                      return (
                        <DataTable.Row key={player.id}>
                          <DataTable.Cell style={styles.nameColumn}>
                            <Text 
                              style={[
                                styles.tableName,
                                isEliminated && styles.strikethrough
                              ]} 
                              numberOfLines={1}
                            >
                              {player.name}
                              {player.reEntryCount > 0 && ` (↻${player.reEntryCount})`}
                            </Text>
                          </DataTable.Cell>
                          {gameState.rounds.map((round) => (
                            <DataTable.Cell
                              key={round.roundNumber}
                              numeric
                              style={styles.roundColumn}
                            >
                              <Text style={[
                                styles.roundScore,
                                isEliminated && styles.strikethrough
                              ]}>
                                {round.scores[player.id] || '-'}
                              </Text>
                            </DataTable.Cell>
                          ))}
                          <DataTable.Cell numeric style={styles.totalColumn}>
                            <Text style={[
                              styles.totalScoreCell,
                              isEliminated && styles.strikethrough
                            ]}>
                              {player.totalScore}
                            </Text>
                          </DataTable.Cell>
                        </DataTable.Row>
                      );
                    })}
                  </DataTable>
                </ScrollView>
              </Card.Content>
            </Card>

            {/* Round Details */}
            {gameState.rounds.length > 0 && (
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.sectionTitle}>Round History</Text>
                  {[...gameState.rounds].reverse().map((round) => (
                    <View key={round.roundNumber} style={styles.roundCard}>
                      <View style={styles.roundHeader}>
                        <View style={styles.roundHeaderLeft}>
                          <Text style={styles.roundTitle}>Round {round.roundNumber}</Text>
                          <Text style={styles.roundTimestamp}>
                            {new Date(round.timestamp).toLocaleString()}
                          </Text>
                        </View>
                        <IconButton
                          icon="pencil"
                          size={20}
                          iconColor={COLORS.primary}
                          onPress={() => handleEditRound(round)}
                        />
                      </View>
                      <View style={styles.roundScores}>
                        {Object.entries(round.scores).map(([playerId, score]) => {
                          const player = gameState.players.find((p) => p.id === playerId);
                          // Only show re-entry count for rounds AFTER the player re-entered
                          // Since re-entry happens immediately after elimination, we need to find
                          // when the player was eliminated and show re-entry count only for rounds after that
                          let showReEntry = false;
                          if (player && player.reEntryCount > 0) {
                            // Find the round where the player was eliminated
                            // We need to look through rounds to find when their score reached maxScore
                            let eliminationRound = -1;
                            let cumulativeScore = 0;
                            
                            // Go through rounds in order to find when player was eliminated
                            const sortedRounds = [...gameState.rounds].sort((a, b) => a.roundNumber - b.roundNumber);
                            for (const r of sortedRounds) {
                              cumulativeScore += r.scores[playerId] || 0;
                              if (cumulativeScore >= gameState.config.maxScore && eliminationRound === -1) {
                                eliminationRound = r.roundNumber;
                                break;
                              }
                            }
                            
                            // If we found an elimination round, show re-entry count only for rounds after it
                            // If eliminationRound is -1, player wasn't eliminated (or was added mid-game), so don't show
                            if (eliminationRound !== -1 && round.roundNumber > eliminationRound) {
                              showReEntry = true;
                            }
                          }
                          return (
                            <View key={playerId} style={styles.roundScoreRow}>
                              <Text style={[
                                styles.roundPlayerName,
                                player?.isEliminated && styles.strikethrough
                              ]}>
                                {player?.name || 'Unknown'}
                                {showReEntry && ` (↻${player!.reEntryCount})`}
                              </Text>
                              <Text style={[
                                styles.roundPlayerScore,
                                player?.isEliminated && styles.strikethrough
                              ]}>
                                {score} pts
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            )}
          </>
        )}
      </ScrollView>

      {/* Edit Round Modal */}
      <Portal>
        <Modal
          visible={editingRound !== null}
          onDismiss={handleCloseEditModal}
          contentContainerStyle={styles.editModal}
        >
          {editingRound && (
            <>
              <Text style={styles.modalTitle}>
                Edit Round {editingRound.roundNumber}
              </Text>
              <ScrollView style={styles.modalContent}>
                {gameState.players
                  .filter((p) => editingRound.scores.hasOwnProperty(p.id))
                  .map((player) => (
                    <View key={player.id} style={styles.editScoreRow}>
                      <Text style={styles.editPlayerName} numberOfLines={1}>
                        {player.name}
                      </Text>
                      <View style={styles.editInputWrapper}>
                        <TextInput
                          mode="outlined"
                          value={editScores[player.id] || ''}
                          onChangeText={(value) => handleScoreChange(player.id, value)}
                          keyboardType="numeric"
                          style={styles.editScoreInput}
                          contentStyle={styles.editScoreInputContent}
                          dense
                        />
                      </View>
                      <View style={styles.editQuickScoreButtons}>
                          <Chip
                            compact
                            onPress={() => handleQuickScore(player.id, 0)}
                            style={styles.editQuickScoreChip}
                            textStyle={styles.editChipText}
                          >
                            0
                          </Chip>
                          <Chip
                            compact
                            onPress={() =>
                              handleQuickScore(player.id, gameState.config.firstDropPenalty)
                            }
                            style={styles.editQuickScoreChip}
                            textStyle={styles.editChipText}
                          >
                            {gameState.config.firstDropPenalty}
                          </Chip>
                          <Chip
                            compact
                            onPress={() =>
                              handleQuickScore(player.id, gameState.config.middleDropPenalty)
                            }
                            style={styles.editQuickScoreChip}
                            textStyle={styles.editChipText}
                          >
                            {gameState.config.middleDropPenalty}
                          </Chip>
                          <Chip
                            compact
                            onPress={() =>
                              handleQuickScore(player.id, gameState.config.fullCountPenalty)
                            }
                            style={styles.editQuickScoreChip}
                            textStyle={styles.editChipText}
                          >
                            {gameState.config.fullCountPenalty}
                          </Chip>
                        </View>
                    </View>
                  ))}
              </ScrollView>
              <View style={styles.modalActions}>
                <Button
                  mode="outlined"
                  onPress={handleCloseEditModal}
                  style={styles.modalButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveRound}
                  style={styles.modalButton}
                >
                  Save
                </Button>
              </View>
            </>
          )}
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
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  segmentContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  segmentButtons: {
    backgroundColor: COLORS.surface,
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
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  firstPlace: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  secondPlace: {
    borderLeftWidth: 4,
    borderLeftColor: '#C0C0C0',
  },
  thirdPlace: {
    borderLeftWidth: 4,
    borderLeftColor: '#CD7F32',
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rank: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  rankSuffix: {
    fontSize: 12,
    fontWeight: '400',
  },
  topRank: {
    color: COLORS.accent,
  },
  playerDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  inactiveName: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  gamesPlayed: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: spacing.xs,
  },
  totalScore: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
  },
  winnerScore: {
    color: COLORS.success,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    minWidth: 100,
    backgroundColor: COLORS.card,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  nameColumn: {
    minWidth: 120,
  },
  roundColumn: {
    minWidth: 60,
  },
  totalColumn: {
    minWidth: 80,
  },
  tableName: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '600',
  },
  roundScore: {
    fontSize: 14,
    color: COLORS.text,
  },
  totalScoreCell: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent,
  },
  roundCard: {
    backgroundColor: COLORS.card,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  roundHeaderLeft: {
    flex: 1,
  },
  roundTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  roundTimestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  roundScores: {
    gap: spacing.xs,
  },
  roundScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  roundPlayerName: {
    fontSize: 14,
    color: COLORS.text,
  },
  strikethrough: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  roundPlayerScore: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.accent,
  },
  editModal: {
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
  editScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  editPlayerName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    width: 90,
    flexShrink: 0,
  },
  editInputWrapper: {
    width: 70,
    flexShrink: 0,
  },
  editScoreInput: {
    backgroundColor: COLORS.card,
    height: 40,
  },
  editScoreInputContent: {
    textAlign: 'center',
    fontSize: 16,
    paddingVertical: 0,
  },
  editQuickScoreButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
    flex: 1,
    alignItems: 'center',
  },
  editQuickScoreChip: {
    backgroundColor: COLORS.card,
    height: 32,
  },
  editChipText: {
    fontSize: 13,
    fontWeight: '500',
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

export default ScoreboardScreen;

