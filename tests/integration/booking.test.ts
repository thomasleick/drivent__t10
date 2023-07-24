import httpStatus from 'http-status';
import supertest from 'supertest';
import {
    createEnrollmentWithAddress,
    createHotel,
    createRoomWithHotelId,
    createRoomWithHotelIdAndCapacity,
    createTicket,
    createTicketTypeRemote,
    createTicketTypeWithHotel,
    createUser,
    createBooking
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';
import bookingService from '@/services/booking-service';
import { notFoundError, fullRoomError } from '@/errors';

beforeAll(async () => {
    await init();
});
beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('POST /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.post('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should respond with status 403 if ticket is remote', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();

        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const body = { roomId: room.id };
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with NotFoundError', async () => {
        const user = await createUser();
        try {
            await bookingService.postBooking(user.id, 1);
            expect(true).toBe(false);
        } catch (error) {
            expect(error).toEqual(notFoundError());
        }
    });

    it('should respond with status 200 and roomId', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();

        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const body = { roomId: room.id };

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
            bookingId: expect.any(Number),
        });
    });

    it('should respond FullRoomError', async () => {
        const user = await createUser();
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeRemote();
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);

        try {
            const response = await bookingService.postBooking(user.id, room.id);
            expect(response).toEqual({
                bookingId: expect.any(Number),
            });
        } catch (error) {
            expect(error).toEqual(fullRoomError());
        }
    });
});

describe('GET /booking', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.get('/booking');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });
    it('should return 404 when user no have maded reserves', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 200 when user as maded reserve', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking(user.id, room.id);
        const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toMatchObject({
            id: booking.id,
            Room: {
                id: room.id,
                name: room.name,
                capacity: room.capacity,
                hotelId: room.hotelId,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            },
        });
    });
});

describe('PUT /booking/:bookingId', () => {
    it('should respond with status 401 if no token is given', async () => {
        const response = await server.put('/booking/1');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it('should return NotFoundError', async () => {
        try {
            const response = await bookingService.postBooking(1, 2);
            expect(response).toEqual(1);
        } catch (error) {
            expect(error).toEqual(notFoundError());
        }
    });

    it('should return 403 when user no have maded reserve before', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const hotel = await createHotel();
        const roomTwo = await createRoomWithHotelId(hotel.id);
        const response = await server
            .put(`/booking/${1}`)
            .send({ roomId: roomTwo.id })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should return 403 when user no have maded reserve before', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const hotel = await createHotel();
        const roomTwo = await createRoomWithHotelIdAndCapacity(hotel.id, 1);
        const response = await server
            .put(`/booking/${1}`)
            .send({ roomId: roomTwo.id })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should return 403 when new room no have vacancy', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const roomTwo = await createRoomWithHotelIdAndCapacity(hotel.id, 0);
        const booking = await createBooking(user.id, room.id);
        const response = await server
            .put(`/booking/${booking.id}`)
            .send({ roomId: roomTwo.id })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should return 404 when new room dont exists', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        await createRoomWithHotelIdAndCapacity(hotel.id, 1);
        const booking = await createBooking(user.id, room.id);
        const response = await server
            .put(`/booking/${booking.id}`)
            .send({ roomId: 9 })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should return 200 and bookingId', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketTypeWithHotel();
        await createTicket(enrollment.id, ticketType.id, 'PAID');
        const hotel = await createHotel();
        const room = await createRoomWithHotelId(hotel.id);
        const roomTwo = await createRoomWithHotelId(hotel.id);
        const booking = await createBooking(user.id, room.id);
        const response = await server
            .put(`/booking/${booking.id}`)
            .send({ roomId: roomTwo.id })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
            bookingId: expect.any(Number),
        });
    });
});