const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

const Devices = require('./models/devices.model.js');
const Events = require('./models/events.model.js');

const app = express();

app.use(bodyParser.json());

const publicDirectoryPath = path.join(__dirname, 'public');

app.use(express.static(publicDirectoryPath));

// define a root route
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, 'index.html'));
});

app.get('/event-june7.html', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, 'event-june7.html'));
});

app.get('/event-june8.html', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, 'event-june8.html'));
});

app.get('/event-june9.html', (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, 'event-june9.html'));
});


const publicVapidKey = "BOd2EQ8LTe3KAgMX9lWwTlHTRzv1Iantw50Mw6pUnsNr3pcxl8iglUs-YlQEQLo4UbJk9oyXs_BxgyAe0TCqKME";
const privateVapidKey = "4AoSsRHFaHv0Fupd2NRtrungJF2jkqgccTu-WEc781w";

webpush.setVapidDetails("mailto:test@test.com", publicVapidKey, privateVapidKey);

app.post('/subscribe', (req, res) => {
    const subscription = req.body;

    Devices.getDeviceById(subscription.keys.auth, function(err, device) {
        if (err) {
            return res.status(500).send(err);
        }

        if (device) {
            // Device already exists
            return res.status(200).json({ message: "Device already exists", data: device });
        }

        // Device does not exist, create a new one
        const newDevice = new Devices({ device: subscription });

        Devices.create(newDevice, function(err, device) {
            if (err) {
                return res.status(500).send(err);
            }

            const payload = JSON.stringify({ title: "Thank you!", body: "You will get ATA notifications soon..!", icon:"https://americanteluguassociation.org/images/logo.png"});

            webpush.sendNotification(subscription, payload).catch(console.error);

            res.status(201).json({ message: "Device added successfully!", data: device });
        });
    });
});

app.post('/sendpush', (req, res) => {

    Devices.findAll((err, devices) => {
        if (err) {
            return res.status(500).send(err);
        }
        const processedDevices = [];
        devices.forEach(device => {
            console.log('Device Info:', device);
            const title=req.query.title;
            const body=req.query.body;
            const subscription = JSON.parse(device.device);
            console.log(subscription);
            const payload = JSON.stringify({ title: title, body: body });
            webpush.sendNotification(subscription, payload).catch(console.log);
            processedDevices.push(device);
        });

        res.status(200).json(processedDevices);
    });

})

app.post('/events', (req, res) => {
    const { event, title, startDate, endDate, status } = req.body; // Destructure the properties from req.body

    // Create a new event object
    const newEvent = {
        event: event,
        title: title,
        startDate: startDate,
        endDate: endDate,
        status: status || 1, // Use status from req.body or default to 1
    };
    Events.create(newEvent, (err, eventId) => {
        if (err) {
            res.status(500).send({ error: 'Failed to create event' });
        } else {
            res.status(201).send({ id: eventId, ...req.body });
        }
    });
});

// Get All Events
app.get('/events', (req, res) => {

    const eventDate=req.query.eventDate;
    Events.getEvent(eventDate, function(err, events) {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).send(events);
    })
});

const PORT = 5050;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
})