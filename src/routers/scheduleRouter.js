const express = require("express");
const Schedules = require("../models/schedule.js");
const {sendWelcomeEmail,sendCancelEmail} = require('../emails/email');
const cron = require('node-cron');

const router = new express.Router();

router.post("/schedule", async (req, res) => {
  const schedule = new Schedules(req.body);
  try {
    await schedule.save();
    cron.schedule('* * * 2 2', () => {
        sendWelcomeEmail(req.body.email, req.body.name)
      }).start()
    res.status(201).send(schedule);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/schedules", async (req, res) => {
  try {
    const schedules = await Schedules.find({});
    res.send(schedules);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/schedule/:id", async (req, res) => {
  const schedule = await Schedules.findById(req.params.id);
  if (!schedule) {
    res.status(400).send();
  }
  try {
    res.send(schedule);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/schedule/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedupdates = ["name", "email", "description"];
  const isUpdatesvalid = updates.every((update) =>
    allowedupdates.includes(update)
  );

  if (!isUpdatesvalid) {
    res.status("400").send({ error: "update is invalid" });
  }
  try {
    const schedule = await Schedules.findById(req.params.id);
    if (!schedule) {
      res.status(400).send();
    }
    updates.forEach((update) => (schedule[update] = req.body[update]));
    cron.schedule('* * * 2 2', () => {
        sendWelcomeEmail(req.body.email, req.body.name)
      }).start()
    await schedule.save();
    res.status("202").send(schedule);
  } catch (e) {
    res.status("400").send(e);
  }
});

router.delete("/schedule/:id", async (req, res) => {
    try {
        const schedule = await Schedules.findByIdAndDelete(req.params.id);
      if (!schedule) {
        return res.status("404").send();
      }
      cron.schedule('* * * 2 2', () => {
        sendCancelEmail(req.body.email, req.body.name)
      }).start()
      res.send(schedule);
    } catch (e) {
      res.status("500").send();
    }
  });

module.exports = router;
