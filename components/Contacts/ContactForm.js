import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TextInput,
    Alert,
} from "react-native";
import { Colors } from "../../constants/colors";
import Button from "../UI/Button";
import ImagePicker from "../Contacts/ImagePicker";
import { useState } from "react";
import { Contact } from "../../models/contact";

function ContactForm({ onCreateContact }) {
    const [enteredName, setEnteredName] = useState("");
    const [enteredSurname, setEnteredSurname] = useState("");
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPhone, setEnteredPhone] = useState("");
    const [selectedImage, setSelectedImage] = useState();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{9,}$/;

    function changeNameHandler(name) {
        setEnteredName(name);
    }

    function changeSurnameHandler(surname) {
        setEnteredSurname(surname);
    }

    function changeEmailHandler(email) {
        setEnteredEmail(email);
    }

    function changePhoneHandler(phone) {
        setEnteredPhone(phone);
    }

    function saveContactHandler() {
        if (!enteredName || !enteredSurname || !selectedImage || !emailRegex.test(enteredEmail) || !enteredEmail || !phoneRegex.test(enteredPhone) || !enteredPhone) {
            Alert.alert(
                "Missing or invalid information",
                "Make sure the fields are not empty.",
                [{ text: "OK" }],
            )
            return;
        }
        const contactData = new Contact(enteredName, enteredSurname, enteredEmail, enteredPhone, selectedImage);
        onCreateContact(contactData);
    }

    function takeImageHandler(imageUri) {
        setSelectedImage(imageUri);
    }

    return (
        <ScrollView style={styles.form}>
            <View>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={changeNameHandler}
                />
                <Text style={styles.label}>Surname</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={changeSurnameHandler}
                />
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={changeEmailHandler}
                />
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={changePhoneHandler}
                />
                
            </View>
            <ImagePicker onTakeImage={takeImageHandler} />
            <Button onPress={saveContactHandler}>Add Contact</Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    form: { flex: 1, padding: 24 },
    label: { fontWeight: "bold", marginVertical: 4, color: Colors.primary700 },
    input: {
        marginVertical: 8,
        paddingHorizontal: 4,
        paddingVertical: 8,
        fontSize: 16,
        borderBottomColor: Colors.primary700,
        borderBottomWidth: 2,
        backgroundColor: Colors.primary100,
    },
});

export default ContactForm;
