import { View, StyleSheet, Image, Text, Alert } from "react-native";
import { Colors } from "../../constants/colors";
import OutlinedButton from "../UI/OutlinedButton";
import {
    PermissionStatus,
    launchCameraAsync,
    useCameraPermissions,
} from "expo-image-picker";
import { useState } from "react";

function ImagePicker({ onTakeImage }) {
    const [pickedImage, setPickedImage] = useState();
    const [cameraPermissionInformation, requestPermission] =
        useCameraPermissions();

    async function verifyPermissions() {
        if (
            cameraPermissionInformation.status === PermissionStatus.UNDETERMINED
        ) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (
            cameraPermissionInformation.status === PermissionStatus.DENIED
        ) {
            const permissionResponse = await requestPermission();
            return permissionResponse.granted;
        }

        if (cameraPermissionInformation.status === PermissionStatus.DENIED) {
            Alert.alert(
                "Insufficient permissions",
                "You need to grant camera permissions to use this app.",
                [{ text: "Okay" }]
            );
            return false;
        }

        return true;
    }

    async function takeImageHandler() {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return;
        }

        const image = await launchCameraAsync({
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.5,
        });

        if (image.canceled) {
            return;
        }

        const imageUrl = image.assets[0].uri;
        setPickedImage(imageUrl);
        onTakeImage(imageUrl);
    }

    let imagePreview = <Text>No image picked yet.</Text>;

    if (pickedImage) {
        imagePreview = (
            <Image source={{ uri: pickedImage }} style={styles.image} />
        );
    }

    return (
        <View>
            <View style={styles.imagePreview}>{imagePreview}</View>
            <OutlinedButton onPress={takeImageHandler} icon="camera">
                Take Image
            </OutlinedButton>
        </View>
    );
}

const styles = StyleSheet.create({
    imagePreview: {
        width: "100%",
        height: 200,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        backgroundColor: Colors.primary100,
        borderRadius: 4,
    },
    image: {
        width: "100%",
        height: "100%",
    },
});

export default ImagePicker;
