const Trip = require('../models/Trip');
const Route = require('../models/Route');
const Booking = require('../models/Booking');
const Member = require('../models/Member'); // Assuming you have a Member model for passengers


exports.getAvailableTrips = async (req, res) => {
  try {
    const { date, routeId } = req.query;

    const trips = await Trip.find({ tripDate: date, routeId })
      .populate('vehicleId')
      .populate('routeId');

    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trips', error: err });
  }
};
exports.getSeatingMap = async (req, res) => {
  try {
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId).populate('vehicleId');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(trip.seatingMap);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching seating map', error: err });
  }
};
exports.createBooking = async (req, res) => {
  try {
    const { tripId, seatNumber, pickupLocation, dropOffLocation, fare, memberId, guest } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Check seat availability
    const seat = trip.seatingMap.find(s => s.seatNumber === seatNumber);
    if (!seat || seat.status === 'booked') {
      return res.status(400).json({ message: 'Seat not available' });
    }

    // Update seat to booked
    seat.status = 'booked';
    if (memberId) seat.bookedBy = memberId;
    await trip.save();

    // Create booking
    const bookingData = {
      tripId,
      seatNumber,
      pickupLocation,
      dropOffLocation,
      fare,
      paymentStatus: 'pending',
      paymentMethod: 'mpesa',
      bookedAt: new Date()
    };

    if (guest) {
      bookingData.passengerId = null;
      bookingData.guestInfo = {
        name: guest.name,
        phone: guest.phone,
        nationalId: guest.nationalId
      };
    } else {
      bookingData.passengerId = memberId;
    }

    const booking = await Booking.create(bookingData);
    res.status(201).json({ message: 'Booking created', booking });

  } catch (err) {
    res.status(500).json({ message: 'Error creating booking', error: err });
  }
};
const Transaction = require('../models/Transaction');

exports.confirmPayment = async (req, res) => {
  try {
    const { bookingId, method, mpesaRef } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.paymentStatus = 'paid';
    booking.paymentMethod = method;
    await booking.save();

    // Log transaction
    await Transaction.create({
      memberId: booking.passengerId || null,
      type: 'fare',
      amount: booking.fare,
      mpesaRef,
      timestamp: new Date()
    });

    res.json({ message: 'Payment confirmed', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error confirming payment', error: err });
  }
};
exports.getMemberBookings = async (req, res) => {
  try {
    const { memberId } = req.params;
    const bookings = await Booking.find({ passengerId: memberId }).populate('tripId');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings', error: err });
  }
};

