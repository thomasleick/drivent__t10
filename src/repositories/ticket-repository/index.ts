import { prisma } from '@/config';

const getTicketTypes = async () => {
  try {
    const ticketTypes = await prisma.ticketType.findMany();
    return ticketTypes;
  } catch (error) {
    throw new Error('Erro ao obter os tipos de ticket: ' + error.message);
  }
};

const ticketRepository = {
  getTicketTypes,
};

export default ticketRepository;
