import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { fetchContacts } from "../util/db";
import ContactsList from "../components/Contacts/ContactsList";

function AllContacts({ route }) {
    const isFocused = useIsFocused();
    const [loadedContacts, setLoadedContacts] = useState([]);

    useEffect(() => {
        async function loadContacts() {
            const contacts = await fetchContacts();
            setLoadedContacts(contacts);
        }
        if (isFocused) {
            loadContacts();
        }
    }, [route, isFocused]);

    return <ContactsList contacts={loadedContacts} />;
}

export default AllContacts;
