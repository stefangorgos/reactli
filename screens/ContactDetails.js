import { ScrollView, StyleSheet, View, Text, Image, Alert } from "react-native";
import { Colors } from "../constants/colors";
import { useEffect, useState } from "react";
import OutlinedButton from "../components/UI/OutlinedButton";
import { fetchContactDetails, deleteContact } from "../util/db";
import Button from "../components/UI/Button";

function ContactDetails({ route, navigation }) {
    const [fetchedContact, setFetchedContact] = useState();

    const selectedContactId = route.params.contactId;

    useEffect(() => {
        async function loadContactData() {
            const contact = await fetchContactDetails(selectedContactId);
            setFetchedContact(contact);
            navigation.setOptions({
                title: contact.title,
            });
        }

        loadContactData();
    }, [selectedContactId]);

    const deleteContactHandler = () => {
        Alert.alert(
            "Delete Contact",
            "Are you sure you want to delete this contact?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteContact(selectedContactId);
                            // Navigate back to the previous screen
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error deleting contact:", error);
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    if (!fetchedContact) {
        return (
            <View style={styles.fallback}>
                <Text>Loading contact data...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <Image
                style={styles.image}
                source={{ uri: fetchedContact.imageUri }}
            />
            <Text style={styles.title}>{fetchedContact.name}</Text>
            <Text style={styles.title}>{fetchedContact.surname}</Text>
            <Text style={styles.title}>{fetchedContact.email}</Text>
            <Text style={styles.title}>{fetchedContact.phone}</Text>
            <Button onPress={deleteContactHandler}>Delete Contact</Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    fallback: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        height: "35%",
        minHeight: 300,
        width: "100%",
    },
    locationContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    addressContainer: {
        padding: 20,
    },
    address: {
        color: Colors.primary500,
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default ContactDetails;
