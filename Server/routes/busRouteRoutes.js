const express = require("express");
const { addBusRoute, getBusRoutes, updateBusRoute, deleteBusRoute } = require("../controllers/busRouteController");
const router = express.Router();
const resolveTenantConnection = require('../middleware/resolveTenantConnection');

/**
 * @swagger
 * tags:
 *   name: BusRoutes
 *   description: APIs to manage Encryption
 */

/**
 * @swagger
 * /busRoutes:
 *   post:
 *     summary: Add a new bus route
 *     tags: [BusRoutes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - route
 *               - fee
 *               - noOfSeats
 *             properties:
 *               route:
 *                 type: string
 *                 description: Name of the bus route.
 *               fee:
 *                 type: number
 *                 description: Fee for the bus route.
 *               noOfSeats:
 *                 type: number
 *                 description: Total number of seats.
 *               filledSeats:
 *                 type: number
 *                 description: Number of seats already filled.
 *               isAvailable:
 *                 type: boolean
 *                 description: Whether the bus is available for booking.
 *               subRoutes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stationName:
 *                       type: string
 *                       description: Name of the sub-route station.
 *                     stationFee:
 *                       type: number
 *                       description: Fee for the sub-route.
 *     responses:
 *       201:
 *         description: Bus route added successfully.
 *       500:
 *         description: Error adding bus route.
 */
router.post("/", addBusRoute);

/**
 * @swagger
 * /busRoutes:
 *   get:
 *     summary: Get all bus routes
 *     tags: [BusRoutes]
 *     responses:
 *       200:
 *         description: List of all bus routes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID of the bus route.
 *                   route:
 *                     type: string
 *                   fee:
 *                     type: number
 *                   noOfSeats:
 *                     type: number
 *                   filledSeats:
 *                     type: number
 *                   isAvailable:
 *                     type: boolean
 *                   subRoutes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         stationName:
 *                           type: string
 *                         stationFee:
 *                           type: number
 *       500:
 *         description: Error fetching bus routes.
 */
router.get("/", getBusRoutes);

/**
 * @swagger
 * /busRoutes/{id}:
 *   put:
 *     summary: Update a bus route
 *     tags: [BusRoutes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the bus route to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               route:
 *                 type: string
 *               fee:
 *                 type: number
 *               noOfSeats:
 *                 type: number
 *               filledSeats:
 *                 type: number
 *               isAvailable:
 *                 type: boolean
 *               subRoutes:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     stationName:
 *                       type: string
 *                     stationFee:
 *                       type: number
 *     responses:
 *       200:
 *         description: Bus route updated successfully.
 *       404:
 *         description: Bus route not found.
 *       500:
 *         description: Error updating bus route.
 */
router.put("/:id", updateBusRoute);

/**
 * @swagger
 * /busRoutes/{id}:
 *   delete:
 *     summary: Delete a bus route
 *     tags: [BusRoutes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the bus route to delete.
 *     responses:
 *       200:
 *         description: Bus route deleted successfully.
 *       404:
 *         description: Bus route not found.
 *       500:
 *         description: Error deleting bus route.
 */
router.delete("/:id", deleteBusRoute);

module.exports = router;
