import { AuthenticatedRequest } from '@/middlewares';
import { Response } from 'express';
import httpStatus from 'http-status';
import bookingService from '@/services/booking-service';

export const getBookings = async (req: AuthenticatedRequest, res: Response) => {
    const { userId } = req;

    try {
        const bookings = await bookingService.getBookings(userId);

        if (!bookings) {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.status(httpStatus.OK).send(bookings);

    } catch (error) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }

}