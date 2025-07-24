const Parcel = require('../models/Parcel');
const ParcelTracking = require('../models/ParcelTracking');
const Member = require('../models/Member');

exports.updateParcelStatus = async (req, res) => {
  try {
    const { parcelId } = req.params;
    const { newStatus, location, comment } = req.body;

    const parcel = await Parcel.findById(parcelId);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

    const allowedStatuses = ['booked', 'inTransit', 'delivered'];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    // 1. Update parcel status
    parcel.status = newStatus;
    await parcel.save();

    // 2. Track the update
    const trackingEntry = await ParcelTracking.create({
      parcelId,
      statusUpdate: newStatus,
      location,
      time: new Date(),
      comment: comment || ''
    });

    res.status(200).json({
      message: 'Parcel status updated & tracked',
      parcel,
      tracking: trackingEntry
    });

  } catch (err) {
    console.error('ParcelController > updateParcelStatus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getParcelTracking = async (req, res) => {
  try {
    const { parcelId } = req.params;

    const trackingEntries = await ParcelTracking.find({ parcelId });
    res.status(200).json(trackingEntries);
  } catch (err) {
    console.error('ParcelController > getParcelTracking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getParcelById = async (req, res) => {
  try {
    const { id } = req.params;
    const parcel = await Parcel.findById(id).populate('senderId receiverId');
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    res.status(200).json(parcel);
  } catch (err) {
    console.error('ParcelController > getParcelById error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAllParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find().populate('senderId receiverId');
    res.status(200).json(parcels);
  } catch (err) {
    console.error('ParcelController > getAllParcels error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.createParcel = async (req, res) => {
  try {
    const { senderId, receiverId, description, weight, dimensions } = req.body;

    // Validate sender and receiver
    const sender = await Member.findById(senderId);
    const receiver = await Member.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or Receiver not found' });
    }

    const newParcel = await Parcel.create({
      senderId,
      receiverId,
      description,
      weight,
      dimensions,
      status: 'booked'
    });

    res.status(201).json(newParcel);
  } catch (err) {
    console.error('ParcelController > createParcel error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateParcel = async (req, res) => {
  try {
    const { id } = req.params;
    const { senderId, receiverId, description, weight, dimensions } = req.body;

    const parcel = await Parcel.findById(id);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });

    // Update parcel details
    parcel.senderId = senderId;
    parcel.receiverId = receiverId;
    parcel.description = description;
    parcel.weight = weight;
    parcel.dimensions = dimensions;

    await parcel.save();
    res.status(200).json(parcel);
  } catch (err) {
    console.error('ParcelController > updateParcel error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.deleteParcel = async (req, res) => {
  try {
    const { id } = req.params;
    const parcel = await Parcel.findByIdAndDelete(id);
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    res.status(200).json({ message: 'Parcel deleted successfully' });
  } catch (err) {
    console.error('ParcelController > deleteParcel error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getParcelsByMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const parcels = await Parcel.find({ senderId: memberId }).populate('receiverId');
    res.status(200).json(parcels);
  } catch (err) {
    console.error('ParcelController > getParcelsByMember error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getParcelsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const parcels = await Parcel.find({ status }).populate('senderId receiverId');
    res.status(200).json(parcels);
  } catch (err) {
    console.error('ParcelController > getParcelsByStatus error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getParcelByTrackingCode = async (req, res) => {
  try {
    const { trackingCode } = req.params;
    const parcel = await Parcel.findOne({ trackingCode }).populate('senderId receiverId');
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    res.status(200).json(parcel);
  } catch (err) {
    console.error('ParcelController > getParcelByTrackingCode error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getParcelByDeliveryCode = async (req, res) => {
  try {
    const { deliveryCode } = req.params;
    const parcel = await Parcel.findOne({ deliveryCode }).populate('senderId receiverId');
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    res.status(200).json(parcel);
  } catch (err) {
    console.error('ParcelController > getParcelByDeliveryCode error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getParcelsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const parcels = await Parcel.find({
      bookedDate: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).populate('senderId receiverId');
    res.status(200).json(parcels);
  } catch (err) {
    console.error('ParcelController > getParcelsByDateRange error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}