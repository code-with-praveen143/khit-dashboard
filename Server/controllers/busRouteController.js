const BusRoute = require('../models/BusRoute');
const logger = require('../utils/logger');

// Add a new bus route
// Add a new bus route
const addBusRoute = async (req, res) => {
  try {
    const {
      route,
      fee,
      noOfSeats,
      filledSeats = 0,
      isAvailable = true,
      subRoutes = [],
    } = req.body;

    // Create a new bus route with the provided attributes
    const busRoute = new BusRoute({
      route,
      fee,
      noOfSeats,
      filledSeats,
      isAvailable,
      subRoutes,
    });

    // Save the bus route to the database
    await busRoute.save();

    logger.info(`Bus route added: ${route}`);
    res.status(201).json({ message: 'Bus route added successfully', busRoute });
  } catch (error) {
    logger.error(`Error adding bus route: ${error.message}`);
    res.status(500).json({ message: 'Error adding bus route' });
  }
};


// Get all bus routes
const getBusRoutes = async (req, res) => {
  try {
    const busRoutes = await BusRoute.find();
    res.status(200).json(busRoutes);
  } catch (error) {
    logger.error(`Error fetching bus routes: ${error.message}`);
    res.status(500).json({ message: 'Error fetching bus routes' });
  }
};

// Update a bus route
// Update a bus route
const updateBusRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { route, fee, noOfSeats, filledSeats, isAvailable, subRoutes } = req.body;

    const updatedFields = { route, fee, noOfSeats, filledSeats, isAvailable, subRoutes };

    const busRoute = await BusRoute.findByIdAndUpdate(id, updatedFields, { new: true });
    if (!busRoute) {
      return res.status(404).json({ message: 'Bus route not found' });
    }

    logger.info(`Bus route updated: ${busRoute.route}`);
    res.status(200).json({ message: 'Bus route updated successfully', busRoute });
  } catch (error) {
    logger.error(`Error updating bus route: ${error.message}`);
    res.status(500).json({ message: 'Error updating bus route' });
  }
};

// Delete a bus route
const deleteBusRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const busRoute = await BusRoute.findByIdAndDelete(id);
    if (!busRoute) {
      return res.status(404).json({ message: 'Bus route not found' });
    }

    logger.info(`Bus route deleted: ${busRoute.route}`);
    res.status(200).json({ message: 'Bus route deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting bus route: ${error.message}`);
    res.status(500).json({ message: 'Error deleting bus route' });
  }
};


module.exports = { addBusRoute, getBusRoutes, updateBusRoute, deleteBusRoute };
