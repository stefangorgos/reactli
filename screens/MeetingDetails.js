import { ScrollView, StyleSheet, View, Text, Image, Alert } from "react-native";
import { Colors } from "../constants/colors";
import { useEffect, useState } from "react";
import OutlinedButton from "../components/UI/OutlinedButton";
import { fetchMeetingDetails, deleteMeeting, fetchContactDetails } from "../util/db";
import Button from "../components/UI/Button";
import MapView, { Marker } from 'react-native-maps';

function MeetingDetails({ route, navigation }) {
    const [fetchedMeeting, setFetchedMeeting] = useState();

    const selectedMeetingId = route.params.meetingId;
    const [invitedContacts, setInvitedContacts] = useState([]);

    function showOnMapHandler() {
        navigation.navigate("Map", {
            initialLat: fetchedMeeting.location.lat,
            initialLng: fetchedMeeting.location.lng,
        });
    }

    useEffect(() => {
        async function loadMeetingData() {
            const meeting = await fetchMeetingDetails(selectedMeetingId);
            setInvitedContacts(meeting.invited.split(',').map(id => id.trim()));
            setFetchedMeeting(meeting);
            navigation.setOptions({
                title: meeting.subject,
            });
        }

        loadMeetingData();
    }, [selectedMeetingId]);

    const deleteMeetingHandler = () => {
        Alert.alert(
            "Delete Meeting",
            "Are you sure you want to delete this meeting?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await deleteMeeting(selectedMeetingId);
                            navigation.goBack();
                        } catch (error) {
                            console.error("Error deleting meeting:", error);
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };

    if (!fetchedMeeting) {
        return (
            <View style={styles.fallback}>
                <Text>Loading meeting data...</Text>
            </View>
        );
    }

    return (
        <ScrollView>
            <MapView
                style={{ flex: 1, height: 300 }}
                initialRegion={{
                    latitude: fetchedMeeting.location.lat,
                    longitude: fetchedMeeting.location.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
                <Marker
                    coordinate={{
                        latitude: fetchedMeeting.location.lat,
                        longitude: fetchedMeeting.location.lng,
                    }}
                    title="Meeting Location"
                />
            </MapView>
            <Text style={styles.title}>{fetchedMeeting.subject}</Text>
            <Text style={styles.title}>{fetchedMeeting.date}</Text>
            <Text style={styles.title}>{invitedContacts.join('x ')}</Text>
            <OutlinedButton icon="map" onPress={showOnMapHandler}>
                View on Map
            </OutlinedButton>
            <Button onPress={deleteMeetingHandler}>Delete Meeting</Button>
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

export default MeetingDetails;