import * as SQLite from "expo-sqlite";
import { Contact } from "../models/contact";
import { Meeting } from "../models/meeting";

const db = SQLite.openDatabase("meetingstest13-db4");

export function init() {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DROP TABLE IF EXISTS meetings", // Drop meetings table
                [],
                () => {
                    tx.executeSql(
                        "DROP TABLE IF EXISTS contacts", // Drop contacts table
                        [],
                        () => {
                            tx.executeSql(
                                `CREATE TABLE contacts (
                                    id INTEGER PRIMARY KEY NOT NULL, 
                                    name TEXT NOT NULL, 
                                    surname TEXT NOT NULL,
                                    email TEXT NOT NULL,
                                    phone TEXT NOT NULL,
                                    imageUri TEXT NOT NULL
                                );`,
                                [],
                                () => {
                                    console.log("Contacts table created successfully.");
                                    // Create the meetings table
                                    tx.executeSql(
                                        `CREATE TABLE IF NOT EXISTS meetings (
                                            id INTEGER PRIMARY KEY NOT NULL,
                                            subject TEXT NOT NULL,
                                            date TEXT NOT NULL,
                                            address TEXT NOT NULL,
                                            lat REAL NOT NULL,
                                            lng REAL NOT NULL,
                                            invited TEXT NOT NULL
                                        );`,
                                        [],
                                        () => {
                                            console.log("Meetings table created successfully.");
                                            resolve();
                                        },
                                        (_, error) => {
                                            console.error("Error creating meetings table:", error);
                                            reject(error);
                                        }
                                    );
                                },
                                (_, error) => {
                                    console.error("Error creating contacts table:", error);
                                    reject(error);
                                }
                            );
                        },
                        (_, error) => {
                            console.error("Error dropping contacts table:", error);
                            reject(error);
                        }
                    );
                },
                (_, error) => {
                    console.error("Error dropping meetings table:", error);
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function createContact(contact) {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO contacts (name, surname, email, phone, imageUri) VALUES (?, ?, ?, ?, ?)",
                [
                    contact.name,
                    contact.surname,
                    contact.email,
                    contact.phone,
                    contact.imageUri,
                ],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function deleteContact(contactId) {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM contacts WHERE id = ?",
                [contactId],
                (_, result) => {
                    // Check if any rows were affected
                    if (result.rowsAffected > 0) {
                        resolve("Contact deleted successfully");
                    } else {
                        reject(new Error("No contact found with the specified ID"));
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function fetchContacts() {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM contacts",
                [],
                (_, result) => {
                    const contacts = [];
                    for (const dp of result.rows._array) {
                        contacts.push(
                            new Contact(
                                dp.name,
                                dp.surname,
                                dp.email,
                                dp.phone,
                                dp.imageUri,
                                dp.id
                            )
                        );
                    }
                    resolve(contacts);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function fetchContactDetails(id) {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM contacts WHERE id = ?",
                [id],
                (_, result) => {
                    const dbContact = result.rows._array[0];
                    const contact = new Contact(
                        dbContact.name,
                        dbContact.surname,
                        dbContact.email,
                        dbContact.phone,
                        dbContact.imageUri,
                        dbContact.id
                    );
                    resolve(contact);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function createMeeting(meeting) {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "INSERT INTO meetings (subject, date, address, lat, lng, invited) VALUES (?, ?, ?, ?, ?, ?)",
                [
                    meeting.subject,
                    meeting.date,
                    meeting.address,
                    meeting.location.lat,
                    meeting.location.lng,
                    meeting.invited
                ],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function deleteMeeting(meetingId) {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "DELETE FROM meetings WHERE id = ?",
                [meetingId],
                (_, result) => {
                    // Check if any rows were affected
                    if (result.rowsAffected > 0) {
                        resolve("Meeting deleted successfully");
                    } else {
                        reject(new Error("No meeting found with the specified ID"));
                    }
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function fetchMeetings() {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM meetings",
                [],
                (_, result) => {
                    const meetings = [];
                    for (const dp of result.rows._array) {
                        meetings.push(
                            new Meeting(
                                dp.subject,
                                dp.date,
                                {
                                    address: dp.address,
                                    lat: dp.lat,
                                    lng: dp.lng,
                                },
                                dp.invited,
                                dp.id
                            )
                        );
                    }
                    resolve(meetings);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function fetchMeetingDetails(id) {
    const promise = new Promise((resolve, reject) => {
        db.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM meetings WHERE id = ?",
                [id],
                (_, result) => {
                    const dbMeeting = result.rows._array[0];
                    const meeting = new Meeting(
                        dbMeeting.subject,
                        dbMeeting.date,
                        {
                            address: dbMeeting.address,
                            lat: dbMeeting.lat,
                            lng: dbMeeting.lng,
                        },
                        dbMeeting.invited,
                        dbMeeting.id
                    );
                    resolve(meeting);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}