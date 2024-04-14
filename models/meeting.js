export class Meeting {
    constructor(subject, date, location, invited, id) {
        this.id = id;
        this.subject = subject;
        this.date = date;
        this.address = location.address;
        this.location = { lat: location.lat, lng: location.lng };
        this.invited = invited;
    }
}
