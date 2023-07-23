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

const bookingRepository = {
    getBookings,
};

export default bookingRepository;