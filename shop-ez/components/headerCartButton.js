import React from 'react';
import { Pressable, Text } from 'react-native';


export default function HeaderCartButton({ onPress, count }) {
return (
<Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}>
<Text style={{ fontSize: 16 }}>{`Cart (${count})`}</Text>
</Pressable>
);
}