import bookingRepository from "@/repositories/booking-repository";

const getBookings = async (userId: number) => {
    return await bookingRepository.getBookings(userId)
}

const bookingService = {
    getBookings
};

export default bookingService;