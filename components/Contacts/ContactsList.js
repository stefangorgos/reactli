import { FlatList, StyleSheet, View, Text } from "react-native";
import { Colors } from "../../constants/colors";
import ContactItem from "../Contacts/ContactItem";
import { useNavigation } from '@react-navigation/native';

function ContactsList({ contacts }) {
    const navigation = useNavigation();

    function selectContactHandler(id) {
        navigation.navigate("ContactDetails", { contactId: id });
    }

    if (!contacts || contacts.length === 0) {
        return (
            <View style={styles.fallbackContainer}>
                <Text style={styles.fallbackText}>
                    No contacts found.
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            style={styles.list}
            data={contacts}
            keyExtractor={(item, index) => item.id + index}
            renderItem={({ item }) => (
                <ContactItem contact={item} onSelect={selectContactHandler} />
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

export default ContactsList;
