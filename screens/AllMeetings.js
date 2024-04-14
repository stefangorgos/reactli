import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { fetchMeetings } from "../util/db";
import MeetingsList from "../components/Contacts/MeetingsList";

function AllMeetings({ route }) {
    const isFocused = useIsFocused();
    const [loadedMeetings, setLoadedMeetings] = useState([]);

    useEffect(() => {
        async function loadMeetings() {
            const meetings = await fetchMeetings();
            setLoadedMeetings(meetings);
        }
        if (isFocused) {
            loadMeetings();
        }
    }, [route, isFocused]);

    return <MeetingsList meetings={loadedMeetings} />;
}

export default AllMeetings;
