const Tenant = require('../models/Tenant');
const logger = require('../utils/logger');
const userSchema = require('../models/User');

// MongoDB Atlas connection URI template
const MONGO_CLUSTER_URI_TEMPLATE = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_CLUSTER_URL}/?retryWrites=true&w=majority`;

// Function to create a database for the tenant
const createTenantDatabase = async (subdomain) => {
  try {
    const databaseUri = MONGO_CLUSTER_URI_TEMPLATE.replace(
      `/?retryWrites=true&w=majority`,
      `/${subdomain}?retryWrites=true&w=majority`
    );

    // Connect to the new tenant database
    const connection = await mongoose.createConnection(databaseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info(`Database created for tenant: ${subdomain}`);

    // Bind the User schema to the tenant's database
    connection.model('User', userSchema);

    return databaseUri;
  } catch (error) {
    logger.error(`Error creating tenant database: ${error.message}`);
    throw error;
  }
};

// Create a new tenant
const createTenant = async (req, res) => {
  try {
    const { name, email, subdomain } = req.body;

    // Check if the tenant already exists
    const existingTenant = await Tenant.findOne({ subdomain });
    if (existingTenant) {
      return res.status(400).json({ message: `Tenant with subdomain '${subdomain}' already exists.` });
    }

    // Create the tenant's database
    const databaseUri = await createTenantDatabase(subdomain);

    // Save the tenant to the tenants collection
    const tenant = new Tenant({ name, email, subdomain, databaseUri });
    await tenant.save();

    logger.info(`Tenant created: ${name}`);
    res.status(201).json({ message: 'Tenant created successfully', tenant });
  } catch (error) {
    logger.error(`Error creating tenant: ${error.message}`);
    res.status(500).json({ message: 'Error creating tenant', details: error.message });
  }
};

// Get all tenants
const getTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.status(200).json(tenants);
  } catch (error) {
    logger.error(`Error fetching tenants: ${error.message}`);
    res.status(500).json({ message: 'Error fetching tenants' });
  }
};

// Update tenant details
const updateTenant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, subdomain } = req.body;

    const tenant = await Tenant.findByIdAndUpdate(
      id,
      { name, email, subdomain },
      { new: true, runValidators: true }
    );

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    logger.info(`Tenant updated: ${tenant.name}`);
    res.status(200).json({ message: 'Tenant updated successfully', tenant });
  } catch (error) {
    logger.error(`Error updating tenant: ${error.message}`);
    res.status(500).json({ message: 'Error updating tenant' });
  }
};

// Delete a tenant
const deleteTenant = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findByIdAndDelete(id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    logger.info(`Tenant deleted: ${tenant.name}`);
    res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting tenant: ${error.message}`);
    res.status(500).json({ message: 'Error deleting tenant' });
  }
};
console.log({ createTenant, getTenants, updateTenant, deleteTenant });

module.exports = {
  createTenant,
  getTenants,
  updateTenant,
  deleteTenant,
};
