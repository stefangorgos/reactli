import { createContact } from "../util/db";
import ContactForm from "../components/Contacts/ContactForm";

function AddContact({ navigation }) {
    async function createContactHandler(contact) {
        await createContact(contact);

        navigation.goBack();
    }

    return <ContactForm onCreateContact={createContactHandler} />;
}

export default AddContact;
