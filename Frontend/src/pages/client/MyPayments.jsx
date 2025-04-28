import { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import DataTable from 'pages/dashboard/DataTable';
import { CircularProgress, Box, Typography } from '@mui/material';

const MyPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPayments = async () => {
        try {
            const token = localStorage.getItem("token");
            const currentUser = JSON.parse(localStorage.getItem("currentUser")); // 👈 parse the user object
            const userId = currentUser?.userId; // 👈 get the userId safely

            const res = await axios.get(`http://localhost:5000/api/payments/${userId}/payment-client`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log(res.data.payments);

            setPayments(Array.isArray(res.data.payments) ? res.data.payments : []); // ✅ access .payments
        } catch (err) {
            console.error("Error fetching payments:", err);
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
            id: 'freelancerName',
            label: 'Paid To',
            format: (value, row) => (
              <Typography>{row.freelancerName}</Typography> // Display freelancer's name here
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
            label: 'Paid At',
            format: (value) => new Date(value).toLocaleDateString(),
        },
    ];

    // Transform your payments data to match the columns
    const rows = payments.map(payment => ({
        id: payment._id,
        projectName: payment.projectId?.projectName || 'N/A',
        freelancerName: payment.freelancerId?.username || 'Unknown',
        amount: payment.amount,
        paymentDate: payment.createdAt,
    }));

    if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                My Transactions
            </Typography>

            {rows.length > 0 ? (
                <DataTable columns={columns} rows={rows} />
            ) : (
                <Typography>No transactions found.</Typography>
            )}
        </Box>
    );
};

export default MyPayments;
