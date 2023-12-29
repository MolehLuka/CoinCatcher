import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';

export default function Button({title, onPress, icon, color}: {title: string, onPress: () => void, icon: keyof typeof Entypo['glyphMap'], color: string}) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Entypo name={icon} size={24} color={color ? color : '#f1f1f1'} />
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#f1f1f1',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    }
})