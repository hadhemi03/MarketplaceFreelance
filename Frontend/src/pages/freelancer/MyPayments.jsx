import { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import DataTable from 'pages/dashboard/DataTable';
import { CircularProgress, Box, Typography } from '@mui/material';

const FreelancerPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem("token");
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            const userId = currentUser?.userId;

            const res = await axios.get(`http://localhost:5000/api/payments/${userId}/payment-freelancer`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(res.data);
            setPayments(Array.isArray(res.data) ? res.data : []);

        } catch (err) {
            console.error("Error fetching freelancer payments:", err);
            setError("Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const columns = [
        { id: 'projectName', label: 'Project' },
        {
            id: 'clientName',
            label: 'Received From',
            format: (value, row) => (
                <Typography>{row.clientName}</Typography> // Display client's name here
            ),
        },
        {
            id: 'amount',
            label: 'Amount',
            align: 'right',
            format: (value) => (
                <NumericFormat value={value} displayType="text" thousandSeparator suffix=" DT" />
            ),
        },
        {
            id: 'paymentDate',
            label: 'Received At',
            format: (value) => new Date(value).toLocaleDateString(),
        },
    ];

    // Transform your payments data to match the columns
    const rows = payments.map(payment => ({
        id: payment._id,
        projectName: payment.projectId?.projectName || 'N/A',
        clientName: payment.clientId?.username || 'Unknown',
        amount: payment.amount,
        paymentDate: payment.createdAt,
    }));

    if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                My Earnings
            </Typography>

            {rows.length > 0 ? (
                <DataTable columns={columns} rows={rows} />
            ) : (
                <Typography>No earnings found.</Typography>
            )}
        </Box>
    );
};

export default FreelancerPayments;
