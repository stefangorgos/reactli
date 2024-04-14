import { StyleSheet, View, Image, Text, Alert } from "react-native";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";
import {
    useIsFocused,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import { useEffect, useState } from "react";
import { PermissionStatus, getCurrentPositionAsync, useForegroundPermissions } from "expo-location";
import { getAddress, getMapPreview } from "../../util/location";

function LocationPicker({ onLocationPick }) {
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();

    const [pickedLocation, setPickedLocation] = useState();

    useEffect(() => {
        if (isFocused && route.params) {
            const mappedLocation = route.params.pickedLocation;
            setPickedLocation(mappedLocation);
        }
    }, [isFocused, route.params]);

    useEffect(() => {
        async function handleLocation() {
            if (pickedLocation && pickedLocation.lat && pickedLocation.lng) {
                let address;
                try {
                    address = await getAddress(
                        pickedLocation.lat,
                        pickedLocation.lng
                    );
                    onLocationPick({ ...pickedLocation, address });
                } catch (error) {
                    console.log("Could not find address:", error);
                }
            }
        }
    
        handleLocation();
    }, [pickedLocation, onLocationPick]);

    const [locationPermissionInformation, requestPermission] =
        useForegroundPermissions();

    async function verifyPermissions() {
        if (
            locationPermissionInformation.status ===
            PermissionStatus.UNDETERMINED
        ) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (
            locationPermissionInformation.status ===
            PermissionStatus.DENIED
        ) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (locationPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                "Insufficient permissions",
                "You need to grant location permissions to use this app.",
                [{ text: "Okay" }]
            );
            return false;
        }

        return true;
    }

    async function getLocationHandler() {
        const hasPermission = await verifyPermissions();

        if (!hasPermission) {
            return;
        }

        const location = await getCurrentPositionAsync();
        setPickedLocation({
            lat: location.coords.latitude,
            lng: location.coords.longitude,
        });
    }

    function pickOnMapHandler() {
        navigation.navigate("Map");
    }
    let locationPreview = <Text>No location picked yet.</Text>;

    if (pickedLocation) {
        locationPreview = (
            <Image
                source={{
                    uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
                }}
                style={styles.image}
            />
        );
    }

    return (
        <View>
            <View style={styles.mapPreview}>{locationPreview}</View>
            <View style={styles.actions}>
                <OutlinedButton icon="location" onPress={getLocationHandler}>
                    Locate User
                </OutlinedButton>
                <OutlinedButton icon="map" onPress={pickOnMapHandler}>
                    Pick on map
                </OutlinedButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mapPreview: {
        width: "100%",
        height: 200,
        marginVertical: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary100,
        borderRadius: 4,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});

export default LocationPicker;
