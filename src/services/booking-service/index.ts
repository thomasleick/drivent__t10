import bookingRepository from "@/repositories/booking-repository";

const getBookings = async (userId: number) => {
    const bookings = await bookingRepository.getBookings(userId);

    if (bookings.length === 0) return 0;

    const booking = {
        id: bookings[0].id,
        Room: bookings[0].Room
    };
    return booking;
}

const bookingService = {
    getBookings
};

export default bookingService;