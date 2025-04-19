import { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, Card, CardContent, Avatar, Stack, Button
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PendingOffers = () => {
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/offers/my-offers', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                });
                setOffers(res.data);
            } catch (error) {
                console.error("Failed to fetch offers:", error);
            }
        };

        fetchOffers();
    }, []);

    const handleDecision = async (offerId, action) => {
        try {
          const token = localStorage.getItem('token');
          await axios.put(`http://localhost:5000/api/offers/${offerId}/${action}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          });
      
          toast.success(`Offer ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
          setOffers((prev) =>
            prev.map((offer) =>
              offer._id === offerId
                ? { ...offer, status: action === 'accept' ? 'Accepted' : 'Rejected' }
                : offer
            )
          );
        } catch (err) {
          toast.error("Something went wrong");
          console.error(err);
        }
      };
      

    return (
        <Box sx={{ p: 3 }}>
            <ToastContainer />
            <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
                📩 Pending Offers
            </Typography>

            <Stack spacing={3}>
                {offers.map((offer) => {
                    const client = offer.clientId;
                    const project = offer.projectId;
                    const imageUrl = client?.img ? `http://localhost:5000${client.img}` : null;

                    return (
                        <Card
                            key={offer._id}
                            sx={{
                                p: 2,
                                borderRadius: 3,
                                boxShadow: 3,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                    src={imageUrl}
                                    alt={client?.username}
                                    sx={{ width: 60, height: 60, mr: 2 }}
                                >
                                    {!imageUrl && client?.username?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{client?.username}</Typography>
                                    <Typography color="text.secondary">
                                        Project: {project?.projectName}
                                    </Typography>
                                </Box>
                            </Box>

                            <Stack direction="row" spacing={2} alignItems="center">
                                {offer.status === 'Accepted' ? (
                                    <Typography color="green">✅ Offer Accepted</Typography>
                                ) : offer.status === 'Rejected' ? (
                                    <Typography color="error">❌ Offer Rejected</Typography>
                                ) : (
                                    <>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => handleDecision(offer._id, 'accept')}
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDecision(offer._id, 'reject')}
                                        >
                                            Reject
                                        </Button>
                                    </>
                                )}

                            </Stack>
                        </Card>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default PendingOffers;
