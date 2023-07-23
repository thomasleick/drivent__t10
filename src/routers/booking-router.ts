import { Router } from 'express';
import { authenticateToken, validateBody, validateParams } from '@/middlewares';
import { bookingBodySchema, bookingParamsSchema } from '@/schemas';
import { getBookings, postBooking, putBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
    .all('/*', authenticateToken)
    .get('/', getBookings)
    .post('/', validateBody(bookingBodySchema), postBooking)
    .put('/:bookingId', validateBody(bookingBodySchema), validateParams(bookingParamsSchema), putBooking)

export { bookingRouter };
