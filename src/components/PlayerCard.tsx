import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Player } from '../types/index';
import { COLORS, spacing } from '../constants/defaultConfigs';

interface PlayerCardProps {
  player: Player;
  maxScore: number;
  onPress?: () => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  maxScore,
  onPress,
}) => {
  const scorePercentage = (player.totalScore / maxScore) * 100;
  const getProgressColor = () => {
    if (scorePercentage >= 80) return COLORS.danger;
    if (scorePercentage >= 50) return COLORS.warning;
    return COLORS.success;
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.name}>{player.name}</Text>
          <Text style={styles.score}>{player.totalScore}</Text>
        </View>
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${Math.min(scorePercentage, 100)}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <View style={styles.footer}>
          <Text style={styles.gamesPlayed}>{player.gamesPlayed} rounds</Text>
          {player.isEliminated && (
            <Text style={styles.eliminated}>Eliminated</Text>
          )}
          {player.reEntryCount > 0 && (
            <Text style={styles.reentry}>↻ {player.reEntryCount}</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    marginBottom: spacing.sm,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  score: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.accent,
  },
  progressContainer: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gamesPlayed: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  eliminated: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
  },
  reentry: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.warning,
  },
});

