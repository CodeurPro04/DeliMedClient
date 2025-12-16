import { Pressable, Text } from 'react-native';
import { COLORS } from '@/constants/Colors';

export function Button({
  title,
  onPress,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor:
          variant === 'primary' ? COLORS.primary : COLORS.secondary,
        padding: 14,
        borderRadius: 10,
        marginVertical: 8,
      }}
    >
      <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
        {title}
      </Text>
    </Pressable>
  );
}
