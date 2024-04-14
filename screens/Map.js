import { useCallback, useLayoutEffect, useState } from "react";
import { StyleSheet, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import IconButton from "../components/UI/IconButton";

function Map({ navigation, route }) {
    const initialLocation = route.params && {
        lat: route.params.initialLat,
        lng: route.params.initialLng,
    };

    const [selectedLocation, setSelectedLocation] = useState(initialLocation);

    useLayoutEffect(() => {
        if (initialLocation) return;
        navigation.setOptions({
            headerRight: ({ tintColor }) => (
                <IconButton
                    icon="save"
                    size={24}
                    color={tintColor}
                    onPress={savedPickedLocationHandler}
                />
            ),
        });
    }, [
        initialLocation,
        navigation,
        selectedLocation,
        savedPickedLocationHandler,
    ]);

    const region = {
        latitude: initialLocation?.lat ?? 47.02624,
        longitude: initialLocation?.lng ?? 28.84161,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    function selectLocationHandler(event) {
        if (initialLocation) return;
        const lat = event.nativeEvent.coordinate.latitude;
        const lng = event.nativeEvent.coordinate.longitude;
        setSelectedLocation({ lat, lng });
    }

    const savedPickedLocationHandler = useCallback(() => {
        if (!selectedLocation) {
            Alert.alert(
                "No location picked",
                "Please pick a location on the map",
                [{ text: "Okay" }]
            );
            return;
        }

        navigation.navigate("AddMeeting", {
            pickedLocation: selectedLocation,
        });
    }, [selectedLocation, navigation]);

    return (
        <MapView
            style={styles.map}
            initialRegion={region}
            onPress={selectLocationHandler}
        >
            {selectedLocation && (
                <Marker
                    coordinate={{
                        longitude: selectedLocation.lng,
                        latitude: selectedLocation.lat,
                    }}
                />
            )}
        </MapView>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1,
    },
});

export default Map;
