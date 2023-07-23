import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketsRepository from "@/repositories/tickets-repository";
import { fullRoomError, notFoundError } from '@/errors';
import roomRepository from "@/repositories/room-repository";

const getBookings = async (userId: number) => {
    const bookings = await bookingRepository.getBookings(userId);

    if (bookings.length === 0 || !bookings) {
        throw notFoundError();
    }

    const booking = {
        id: bookings[0].id,
        Room: bookings[0].Room
    };
    return booking;
};

const postBooking = async (userId: number, roomId: number) => {
    const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
    if (!enrollment) {
        throw notFoundError();
    }

    const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
        throw fullRoomError();
    }

    const room = await roomRepository.findRoomById(roomId);
    const bookingsByRoomId = await bookingRepository.getBookingsByRoomId(roomId);
    if (!room) {
        throw notFoundError();
    }
    if (room.capacity <= bookingsByRoomId) {
        throw fullRoomError();
    }

    const booking = await bookingRepository.postBooking(userId, roomId);
    return booking.id;
};

const putBooking = async (userId: number, bookingId: number, roomId: number) => {
    const foundBookings = await bookingRepository.getBookings(userId);
    const foundBooking = foundBookings[0]
    if (!foundBooking) {
        throw fullRoomError();
    }

    const room = await roomRepository.findRoomById(roomId);
    if (!room) {
        throw notFoundError();
    }

    const bookingsByRoomId = await bookingRepository.getBookingsByRoomId(roomId);
    if (room.capacity <= bookingsByRoomId) {
        throw fullRoomError();
    }

    const checkBookingById = await bookingRepository.getBookingById(bookingId);
    if (!checkBookingById) {
        throw notFoundError();
    }

    const deletedFoundBooking = await bookingRepository.putBooking(foundBooking.id, room.id);
    if (!deletedFoundBooking || foundBooking.id !== deletedFoundBooking.id) {
        throw new Error('Something bad happened...');
    }

    return { bookingId: deletedFoundBooking.id };
}

const bookingService = {
    getBookings,
    postBooking,
    putBooking,
};

export default bookingService;