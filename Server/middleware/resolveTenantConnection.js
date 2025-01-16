const mongoose = require('mongoose');
const Tenant = require('../models/Tenant');
const userSchema = require('../models/User');
const studentFeeSchema = require('../models/StudentFee');
const tenantConnections = {}; // Store active tenant connections

const resolveTenantConnection = async (req, res, next) => {
    try {
        const subdomain = "collegeabc"; // Replace with dynamic logic

        if (!subdomain) {
            return res.status(400).json({ message: 'Subdomain is required to resolve tenant.' });
        }

        const tenant = await Tenant.findOne({ subdomain });
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found.' });
        }
            
        if (!tenantConnections[tenant.databaseUri]) {
            const connection = await mongoose.createConnection(tenant.databaseUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 30000, // Increased timeout

            });

            tenantConnections[tenant.databaseUri] = {
                connection,
                userModel: connection.model('User', userSchema),
                studentFeeModel: connection.model('StudentFee', studentFeeSchema),
            };
        }

        req.tenantDbUser = tenantConnections[tenant.databaseUri].userModel;
        req.tenantDbStudentFee = tenantConnections[tenant.databaseUri].studentFeeModel;
        next();
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Error resolving tenant connection.' });
    }
};

module.exports = resolveTenantConnection;
