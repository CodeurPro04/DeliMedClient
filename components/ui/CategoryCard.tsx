import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CategoryCardProps {
  name: string;
  color: string;
  icon: string;
  onPress: () => void;
}

export default function CategoryCard({ name, color, icon, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: color }]} 
      onPress={onPress}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    height: 100,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    marginRight: 12,
  },
  icon: {
    fontSize: 28,
  },
  name: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});