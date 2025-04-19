import Project from "../models/Project.model.js";
import User from "../models/User.model.js";
import Offer from "../models/Offer.model.js";

// client create an offer for the freelancer
export const createOffer = async (req, res) => {
    const { projectId, freelancerId } = req.body;
    const clientId = req.user._id;

    // Make sure the project status is 'Waiting'
    const project = await Project.findById(projectId);
    if (!project || project.status !== 'Waiting') {
        return res.status(400).json({ message: 'Invalid project or status' });
    }

    const offer = await Offer.create({
        projectId,
        freelancerId,
        clientId,
    });

    res.status(201).json(offer);
};

// get All offers for a freelancer
export const getFreelancerOffers = async (req, res) => {
    const freelancerId = req.user._id;

    const offers = await Offer.find({ freelancerId }) // no status filter
    .populate('projectId')
    .populate({
        path: 'clientId',
        select: 'username img'
    });

    res.json(offers);
};

// Accept offer
export const acceptOffer = async (req, res) => {
    const { offerId } = req.params;

    const offer = await Offer.findById(offerId);
    if (!offer || offer.status !== 'Pending') {
        return res.status(404).json({ message: 'Offer not found or already processed' });
    }

    offer.status = 'Accepted';
    await offer.save();

    const project = await Project.findById(offer.projectId);
    project.status = 'In Progress';
    project.freelancerId = offer.freelancerId;
    await project.save();

    res.json({ message: 'Offer accepted', project });
};

// reject offer
export const rejectOffer = async (req, res) => {
    const { offerId } = req.params;

    const offer = await Offer.findById(offerId);
    if (!offer || offer.status !== 'Pending') {
        return res.status(404).json({ message: 'Offer not found or already processed' });
    }

    offer.status = 'Rejected';
    await offer.save();

    res.json({ message: 'Offer rejected' });
};