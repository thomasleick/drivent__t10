import { prisma } from '@/config';
import { Ticket } from '@prisma/client';

const getTicketTypes = async () => {
  try {
    const ticketTypes = await prisma.ticketType.findMany();
    return ticketTypes;
  } catch (error) {
    throw new Error('Erro ao obter os tipos de ticket: ' + error.message);
  }
};

const getTicketsByUserId = async (userId: number) => {
  try {
    const userTickets = await prisma.ticket.findMany({
      where: {
        Enrollment: {
          userId: userId,
        },
      },
      include: {
        TicketType: true,
      },
    });
    return userTickets;
  } catch (error) {
    throw new Error('Erro ao obter tickets: ' + error.message);
  }
};
const createTicket = async (ticketData: Omit<Ticket, 'id'>) => {
  try {
    const newTicket = await prisma.ticket.create({
      data: ticketData,
    });
    return newTicket;
  } catch (error) {
    throw new Error('Erro ao criar ticket: ' + error.message);
  }
};

const ticketRepository = {
  getTicketTypes,
  getTicketsByUserId,
  createTicket,
};

export default ticketRepository;