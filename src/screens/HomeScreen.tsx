import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationParams } from '../types/index';
import { useAppSelector } from '../store/hooks';
import { COLORS, spacing } from '../constants/defaultConfigs';

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<NavigationParams, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const gameState = useAppSelector((state) => state.game);
  const hasActiveGame = gameState.isActive;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>♠️ Rummy Score</Text>
          <Text style={styles.subtitle}>
            Keep track of your game scores with ease
          </Text>
        </View>

        {/* Main Actions */}
        <View style={styles.actionsContainer}>
          {hasActiveGame && (
            <Card style={styles.activeGameCard}>
              <Card.Content style={styles.activeGameCardContent}>
                <View style={styles.activeGameInfo}>
                  <Text style={styles.activeGameTitle}>Game in Progress</Text>
                  <Text style={styles.activeGameSubtitle}>
                    Round {gameState.currentRound} • {gameState.players.filter(p => p.isActive).length} Players
                  </Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => navigation.navigate('ActiveGame')}
                  style={styles.resumeButton}
                  labelStyle={styles.resumeButtonLabel}
                  contentStyle={styles.resumeButtonContent}
                >
                  Resume Game
                </Button>
              </Card.Content>
            </Card>
          )}

          <Button
            mode="contained"
            onPress={() => navigation.navigate('NewGame')}
            style={styles.button}
            icon="plus-circle"
            labelStyle={styles.buttonLabel}
          >
            New Game
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('ConfigPresets')}
            style={styles.button}
            icon="cog"
            labelStyle={styles.buttonLabel}
          >
            Game Presets
          </Button>

          <Button
            mode="outlined"
            onPress={() => navigation.navigate('PlayerManagement')}
            style={styles.button}
            icon="account-group"
            labelStyle={styles.buttonLabel}
          >
            Manage Players
          </Button>
        </View>

        {/* Stats Card */}
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <Text style={styles.statsTitle}>Quick Stats</Text>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {useAppSelector((state) => state.player.savedPlayers.length)}
                  </Text>
                  <Text style={styles.statLabel}>Saved Players</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {useAppSelector((state) => state.config.configs.length)}
                  </Text>
                  <Text style={styles.statLabel}>Presets</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  actionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  button: {
    paddingVertical: spacing.sm,
    borderRadius: 12,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeGameCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  activeGameCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  activeGameInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  activeGameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: spacing.xs,
  },
  activeGameSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resumeButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  resumeButtonContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  resumeButtonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    marginTop: 'auto',
  },
  statsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },
});

export default HomeScreen;

