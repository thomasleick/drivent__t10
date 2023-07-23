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

const bookingRepository = {
    getBookings,
    getBookingsByRoomId,
    postBooking,
};

export default bookingRepository;