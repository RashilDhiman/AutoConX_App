import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../app/navigationTypes';
import { ErrorView } from '../../../components/ErrorView';
import { Screen } from '../../../components/Screen';
import { colors } from '../../../theme/colors';
import { radius, spacing } from '../../../theme/spacing';
import { isLegalPage, LEGAL_DOCUMENTS } from '../content';

type Props = NativeStackScreenProps<RootStackParamList, 'Legal'>;

export function LegalScreen({ route, navigation }: Props) {
  const page = route.params?.page;

  if (!page || !isLegalPage(page)) {
    return (
      <Screen>
        <ErrorView
          title="Page unavailable"
          message="Open this page again from the menu."
          onRetry={() => navigation.navigate('Main')}
        />
      </Screen>
    );
  }

  const document = LEGAL_DOCUMENTS[page];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        {document.sections.map(section => (
          <View key={section.heading} style={styles.card}>
            <Text style={styles.heading}>{section.heading}</Text>
            <Text style={styles.body}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  heading: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    color: colors.muted,
    fontSize: 16,
    lineHeight: 23,
  },
});
