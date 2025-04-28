import Payment from '../models/Payment.model.js';
import Project from '../models/Project.model.js';
import User from '../models/User.model.js';

export const getAnalytics = async (req, res) => {
    try {
        // Total Clients
        const totalClients = await User.countDocuments({ role: 'client' });

        // Total Freelancers
        const totalFreelancers = await User.countDocuments({ role: 'freelancer' });

        // Total Projects
        const totalProjects = await Project.countDocuments();

        // Total Payments (Sum of all payments)
        const totalPayments = await Payment.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        // Format Total Payments
        const totalPaymentsAmount = totalPayments[0] ? totalPayments[0].total : 0;

        // Get Projects by Status
        const projectsByStatus = await Project.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
        ]);

        const statusObj = {
            Waiting: 0,
            'In Progress': 0,
            Completed: 0,
        };

        projectsByStatus.forEach((status) => {
            if (status._id === 'Waiting') statusObj.Waiting = status.count;
            if (status._id === 'In Progress') statusObj['In Progress'] = status.count;
            if (status._id === 'Completed') statusObj.Completed = status.count;
        });

        // Get Monthly Payments Growth (aggregate payments per month)
        const monthlyPayments = await Payment.aggregate([
            { $project: { month: { $month: '$createdAt' }, amount: 1 } },
            { $group: { _id: '$month', total: { $sum: '$amount' } } },
            { $sort: { _id: 1 } }, // Sort by month
        ]);

        // Format Monthly Payments Growth (For chart representation)
        const monthlyGrowth = monthlyPayments.map(item => item.total);

        // Return response with all data
        res.json({
            totalClients,
            totalFreelancers,
            totalProjects,
            totalPayments: totalPaymentsAmount,
            projectsByStatus: statusObj,
            monthlyGrowth,
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ message: 'Server error, unable to fetch analytics' });
    }
};

// Get Monthly Payments Data
export const getMonthlyPayments = async (req, res) => {
    try {
        const monthlyPayments = await Payment.aggregate([
            { $project: { month: { $month: '$createdAt' }, amount: 1 } },
            { $group: { _id: '$month', total: { $sum: '$amount' } } },
            { $sort: { _id: 1 } },
        ]);

        const monthlyGrowth = monthlyPayments.map(item => item.total);

        res.json({ monthlyGrowth });
    } catch (error) {
        console.error('Error fetching monthly payments:', error);
        res.status(500).json({ message: 'Server error, unable to fetch monthly payments' });
    }
};