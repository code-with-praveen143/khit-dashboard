const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
  route: { type: String, required: true }, // Bus route name (e.g., "Route A")
  fee: { type: Number, required: true }, // Fee for the route
  noOfSeats: { type: Number, required: true }, // Total number of seats in the bus
  filledSeats: { type: Number, default: 0 }, // Number of seats currently filled
  isAvailable: { type: Boolean, default: true }, // Whether the bus is available for booking
  subRoutes: [
    {
      stationName: { type: String, required: true }, // Name of the sub-route station
      stationFee: { type: Number, required: true }, // Fee for the sub-route
      arrivalTime: { type: String }, // Optional: Estimated arrival time at this station
    },
  ], // Array of sub-routes the bus covers
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BusRoute', busRouteSchema);
