import { View, TextInput } from 'react-native';

export function SearchBar({
  placeholder,
}: {
  placeholder: string;
}) {
  return (
    <View
      style={{
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <TextInput placeholder={placeholder} />
    </View>
  );
}
