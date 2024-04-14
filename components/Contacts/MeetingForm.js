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
import { useCallback, useState, useEffect } from "react";
import LocationPicker from "../Contacts/LocationPicker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Meeting } from "../../models/meeting"; 
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { fetchContacts } from "../../util/db";
import { useFocusEffect } from '@react-navigation/native';

function MeetingForm({ onCreateMeeting }) {
    const [enteredSubject, setEnteredSubject] = useState("");
    const [enteredDate, setEnteredDate] = useState(new Date());
    const [pickedLocation, setPickedLocation] = useState();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState([]);
    const [contactData, setContactData] = useState([]);

    const fetchAndUpdateContacts = useCallback(() => {
        fetchContacts()
            .then(contacts => {
                const formattedContacts = contacts.map(contact => ({
                    key: contact.id.toString(),
                    value: contact.name + ' ' + contact.surname,
                }));
                setContactData(formattedContacts);
            })
            .catch(error => console.error('Error fetching contacts:', error));
    }, []);

    useEffect(() => {
        fetchAndUpdateContacts();
    }, [fetchAndUpdateContacts]);

    useFocusEffect(
        useCallback(() => {
            fetchAndUpdateContacts(); // Refresh contacts when screen comes into focus
        }, [fetchAndUpdateContacts])
    );

    function changeSubjectHandler(name) {
        setEnteredSubject(name);
    }

    function changeDateHandler(event, selectedDate) {
        const currentDate = selectedDate || enteredDate;
        setEnteredDate(currentDate);
        setShowDatePicker(false);
    }
    

    const pickedLocationHandler = useCallback((location) => {
        setPickedLocation(location);
    }, []);

    function saveMeetingHandler() {
        if (!enteredSubject || !enteredDate || !pickedLocation || selectedEmp.length === 0) {
            Alert.alert(
                "Missing Information",
                "Make sure the fields are not empty.",
                [{ text: "OK" }],
            )
            return;
        }
        // Get the ISO string
        const isoString = enteredDate.toISOString();
        // Extract only the date part (YYYY-MM-DD)
        const formattedDate = isoString.substring(0, 10);
        const meetingData = new Meeting(enteredSubject, formattedDate, pickedLocation, selectedEmp);
        onCreateMeeting(meetingData);
    }
    
    
    
    return (
        <ScrollView style={styles.form}>
            <View>
                <Text style={styles.label}>Subject</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={changeSubjectHandler}
                />    
                <Text style={styles.label}>Date</Text>
                <Button title="dateOpen" onPress={() => setShowDatePicker(true)}>Choose the meeting's date</Button>
                <Text style={styles.selectedDate}>{enteredDate.toDateString()}</Text>
                {showDatePicker && (
                <DateTimePicker
                    mode="date"
                    display="spinner"
                    value={new Date (enteredDate)}
                    onChange={changeDateHandler}
                />
                )}   
                <Text style={styles.label}>Location</Text>
               
                <LocationPicker onLocationPick={pickedLocationHandler} />
                
                <Text style={styles.label}>Invited Employees</Text>

                <MultipleSelectList 
                    setSelected={(val) => setSelectedEmp(val)} 
                    data={contactData} 
                    save="key"
                    label="Invited Employees"
                />
            
            </View>
            <Button onPress={saveMeetingHandler}>Add Meeting</Button>
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

export default MeetingForm;
