import { useEffect } from "react";
import { Colors } from "./constants/colors";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import AllContacts from "./screens/AllContacts";
import AllMeetings from "./screens/AllMeetings";
import AddContact from "./screens/AddContact";
import AddMeeting from "./screens/AddMeeting";
import ContactDetails from "./screens/ContactDetails";
import MeetingDetails from "./screens/MeetingDetails";
import IconButton from "./components/UI/IconButton";
import Map from "./screens/Map";
import { init } from "./util/db";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
    useEffect(() => {
        init()
            .then(async () => {
                await SplashScreen.hideAsync();
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <StatusBar style="dark" />
            <NavigationContainer>
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: "#1aacf0",
                        tabBarInactiveTintColor: "#221c30",
                        tabBarStyle: [
                          {
                            display: "flex"
                          },
                          null
                        ]
                    }}
                >
                    <Tab.Screen
                        name="AllContacts"
                        options={{
                            headerShown: false,
                            title: "Contacts",
                            tabBarIcon: ({ color }) => (
                                <IconButton
                                    color={color}
                                    icon="list"
                                    size={24}
                                />
                            ),
                        }}
                    >
                        {() => (
                            <Stack.Navigator>
                                <Stack.Screen
                                    name="AllContactsList"
                                    component={AllContacts}
                                    options={({ navigation }) => ({
                                        title: "Your Contacts",
                                        headerRight: ({ tintColor }) => (
                                            <IconButton
                                                color={tintColor}
                                                icon="add"
                                                size={24}
                                                onPress={() =>
                                                    navigation.navigate("AddContact")
                                                }
                                            />
                                        ),
                                    })}
                                />
                                <Stack.Screen
                                    name="ContactDetails"
                                    component={ContactDetails}
                                    options={{ title: "Loading Contact..." }}
                                />
                                <Stack.Screen
                                    name="AddContact"
                                    component={AddContact}
                                    options={{ title: "Add Contact" }}
                                />
                            </Stack.Navigator>
                        )}
                    </Tab.Screen>
                    <Tab.Screen
                        name="AllMeetings"
                        options={{
                            headerShown: false,
                            title: "Meetings",
                            tabBarIcon: ({ color }) => (
                                <IconButton
                                    color={color}
                                    icon="list"
                                    size={24}
                                />
                            ),
                        }}
                    >
                        {() => (
                            <Stack.Navigator>
                                <Stack.Screen
                                    name="AllMeetingsList"
                                    component={AllMeetings}
                                    options={({ navigation }) => ({
                                        title: "Your Meetings",
                                        headerRight: ({ tintColor }) => (
                                            <IconButton
                                                color={tintColor}
                                                icon="add"
                                                size={24}
                                                onPress={() =>
                                                    navigation.navigate("AddMeeting")
                                                }
                                            />
                                        ),
                                    })}
                                />
                                <Stack.Screen
                                    name="MeetingDetails"
                                    component={MeetingDetails}
                                    options={{ title: "Loading Meeting..." }}
                                />
                                <Stack.Screen
                                    name="AddMeeting"
                                    component={AddMeeting}
                                    options={{ title: "Add Meeting" }}
                                />
                                <Stack.Screen name="Map" component={Map} />
                            </Stack.Navigator>
                        )}
                    </Tab.Screen>
                </Tab.Navigator>
            </NavigationContainer>
        </>
    );
}