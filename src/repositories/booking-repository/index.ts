import { prisma } from '@/config';

const getBookings = async (userId: number) => {
    try {
        const bookings = await prisma.booking.findMany({
            where: {
                userId: userId,
            },
            include: {
                User: true,
                Room: true,
            },
        });

        return bookings;
    } catch (error) {
        console.error('Error fetching bookings:', error);
        throw new Error('Failed to fetch bookings');
    }
};

const getBookingsByRoomId = async (roomId: number) => {
    return prisma.booking.count({
        where: { roomId },
    });
}

const postBooking = async (userId: number, roomId: number) => {
    return prisma.booking.create({
        data: {
            userId,
            roomId,
            updatedAt: new Date(),
        },
    });
}
const putBooking = async (bookingId: number, roomId: number) => {
    return prisma.booking.update({
        where: { id: bookingId },
        data: { roomId: roomId },
    });
}

const getBookingById = async (bookingId: number) => {
    return prisma.booking.findUnique({
        where: { id: bookingId },
    });
}
const bookingRepository = {
    getBookings,
    getBookingsByRoomId,
    postBooking,
    getBookingById,
    putBooking,
};

export default bookingRepository;