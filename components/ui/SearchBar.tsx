import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
};

export function SearchBar({ placeholder, value, onChangeText }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#9CA3AF" />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    marginLeft: 8,
    fontSize: 15,
    flex: 1,
  },
});
