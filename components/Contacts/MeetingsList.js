import { FlatList, StyleSheet, View, Text } from "react-native";
import { Colors } from "../../constants/colors";
import MeetingItem from "../Contacts/MeetingItem";
import { useNavigation } from '@react-navigation/native';

function MeetingsList({ meetings }) {
    const navigation = useNavigation();

    function selectMeetingHandler(id) {
        navigation.navigate("MeetingDetails", { meetingId: id });
    }

    if (!meetings || meetings.length === 0) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>
                    No meetings found.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.list}
            data={meetings}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item }) => (
                <MeetingItem meeting={item} onSelect={selectMeetingHandler} />
            )}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        margin: 10,
    },
    fallbackContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    fallbackText: {
        fontSize: 18,
        textAlign: "center",
        color: Colors.primary200,
    },
});

export default MeetingsList;
