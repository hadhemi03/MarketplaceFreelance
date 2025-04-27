import { useEffect, useState } from 'react';
import axios from 'axios';
import { NumericFormat } from 'react-number-format';
import DataTable from 'pages/dashboard/DataTable';
import { CircularProgress, Box, Typography, TextField, Button, Stack } from '@mui/material';

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        startDate: '',
        endDate: ''
    });

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");

            const params = {};
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;

            const res = await axios.get(`http://localhost:5000/api/payments/all-payments`, {
                withCredentials: true,
                headers: { Authorization: `Bearer ${token}` },
                params,
            });

            setPayments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error fetching admin payments:", err);
            setError("Failed to fetch payments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        fetchPayments();
    };

    const handleResetFilters = () => {
        setFilters({ startDate: '', endDate: '' });
        fetchPayments();
    };

    const columns = [
        { id: 'projectName', label: 'Project' },
        {
            id: 'clientName',
            label: 'Paid By',
            format: (value, row) => (
                <Typography>{row.clientName}</Typography>
            ),
        },
        {
            id: 'freelancerName',
            label: 'Paid To',
            format: (value, row) => (
                <Typography>{row.freelancerName}</Typography>
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

    const rows = payments.map(payment => ({
        id: payment._id,
        projectName: payment.project?.projectName || 'N/A',
        clientName: payment.client?.username || 'Unknown',
        freelancerName: payment.freelancer?.username || 'Unknown',
        amount: payment.amount,
        paymentDate: payment.createdAt,
    }));

    if (loading) return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box sx={{ padding: '20px' }}>
            <Typography variant="h5" sx={{ marginBottom: '20px' }}>
                All Payments
            </Typography>

            <Box component="form" onSubmit={handleFilterSubmit} sx={{ marginBottom: '20px' }}>
                <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                    <TextField
                        label="Start Date"
                        name="startDate"
                        type="date"
                        value={filters.startDate}
                        onChange={handleInputChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="End Date"
                        name="endDate"
                        type="date"
                        value={filters.endDate}
                        onChange={handleInputChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button variant="contained" type="submit">Filter</Button>
                    <Button variant="outlined" onClick={handleResetFilters}>Reset</Button>
                </Stack>
            </Box>

            {rows.length > 0 ? (
                <DataTable columns={columns} rows={rows} />
            ) : (
                <Typography>No payments found.</Typography>
            )}
        </Box>
    );
};

export default AdminPayments;
