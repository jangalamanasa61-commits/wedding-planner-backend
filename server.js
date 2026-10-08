// server.js - Wedding Planner Backend API
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// In-Memory Database (Hackathon Prototype)
const db = {
  events: [{ id: "1", title: "My Dream Wedding", budgetTotal: 25000 }],
  guests: [
    { id: "101", eventId: "1", name: "Rahul", rsvpStatus: "ACCEPTED", plusOnes: 1 },
    { id: "102", eventId: "1", name: "Anitha", rsvpStatus: "PENDING", plusOnes: 0 }
  ],
  budgetItems: [
    { id: "201", eventId: "1", category: "Venue", estimatedCost: 10000, actualCost: 9500 },
    { id: "202", eventId: "1", category: "Catering", estimatedCost: 7000, actualCost: 7200 }
  ],
  vendors: [
    { id: "301", eventId: "1", vendorName: "Royal Catering", category: "Food", price: 7200, status: "CONFIRMED" }
  ],
  tasks: [
    { id: "401", eventId: "1", title: "Book Photography", priority: "HIGH", isCompleted: true },
    { id: "402", eventId: "1", title: "Finalize Invitation Card Design", priority: "MEDIUM", isCompleted: false }
  ]
};

// 1. GUEST ROUTES
app.get('/api/events/:eventId/guests', (req, res) => {
  const guests = db.guests.filter(g => g.eventId === req.params.eventId);
  res.json({ success: true, count: guests.length, data: guests });
});

app.post('/api/events/:eventId/guests', (req, res) => {
  const newGuest = { id: Date.now().toString(), eventId: req.params.eventId, ...req.body };
  db.guests.push(newGuest);
  res.status(201).json({ success: true, data: newGuest });
});

// 2. BUDGET ROUTES
app.get('/api/events/:eventId/budget', (req, res) => {
  const items = db.budgetItems.filter(b => b.eventId === req.params.eventId);
  const totalActual = items.reduce((sum, item) => sum + item.actualCost, 0);
  const totalEst = items.reduce((sum, item) => sum + item.estimatedCost, 0);

  res.json({
    success: true,
    data: { totalEstimated: totalEst, totalActual, items }
  });
});

// 3. VENDOR BOOKING ROUTES
app.post('/api/events/:eventId/vendors', (req, res) => {
  const booking = { id: Date.now().toString(), eventId: req.params.eventId, ...req.body };
  db.vendors.push(booking);
  res.status(201).json({ success: true, data: booking });
});

// 4. TASK CHECKLIST ROUTES
app.get('/api/events/:eventId/tasks', (req, res) => {
  const tasks = db.tasks.filter(t => t.eventId === req.params.eventId);
  res.json({ success: true, data: tasks });
});

app.patch('/api/tasks/:taskId/toggle', (req, res) => {
  const task = db.tasks.find(t => t.id === req.params.taskId);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });

  task.isCompleted = !task.isCompleted;
  res.json({ success: true, data: task });
});

// SERVER PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Wedding Planner API running on port ${PORT}`));
