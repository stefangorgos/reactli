import { createMeeting } from "../util/db";
import MeetingForm from "../components/Contacts/MeetingForm";

function AddMeeting({ navigation }) {
    async function createMeetingHandler(contact) {
        await createMeeting(contact);

        navigation.goBack();
    }

    return <MeetingForm onCreateMeeting={createMeetingHandler} />;
}

export default AddMeeting;
