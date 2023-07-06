import ticketRepository from '@/repositories/ticket-repository';
import enrollmentService from '@/services/enrollments-service'
import { Ticket, TicketStatus } from '@prisma/client';

const ticketsService = {
  async getTicketTypes() {
    const types = await ticketRepository.getTicketTypes();
    return types;
  },
  async getTicketsByUserId(id: number) {
    const userTickets = await ticketRepository.getTicketsByUserId(id);
    if (userTickets.length === 0) {
      throw new Error('Nenhum ticket encontrado para o usuário.');
    }
    return userTickets;
  },
  async createTicket(ticketTypeId: number, userId: number) {
    const userEnrollment = await enrollmentService.getOneWithAddressByUserId(userId);
    if (userEnrollment) {
      // Enrollment encontrado para o usuário
      const enrollmentId = userEnrollment.id;

      const newTicket: Omit<Ticket, 'id'> = {
        ticketTypeId: ticketTypeId,
        enrollmentId: enrollmentId,
        status: TicketStatus.RESERVED,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Criar um novo ticket associado ao enrollment
      const createdTicket = await ticketRepository.createTicket(newTicket);

      // Obter as informações do tipo de ticket
      const ticketTypes = await ticketRepository.getTicketTypes();
      const ticketType = ticketTypes.find((type) => type.id === ticketTypeId);

      if (!ticketType) {
        throw new Error('Tipo de ticket não encontrado.');
      }
      const ticketWithTypeInfo = {
        id: createdTicket.id,
        status: createdTicket.status,
        ticketTypeId: createdTicket.ticketTypeId,
        enrollmentId: createdTicket.enrollmentId,
        TicketType: ticketType,
        createdAt: createdTicket.createdAt,
        updatedAt: createdTicket.updatedAt,
      };

      // Retornar o ticket criado
      return ticketWithTypeInfo;
    } else {
      // Enrollment não encontrado para o usuário
      throw new Error('Nenhum enrollment encontrado para o usuário.');
    }
  },
};

export default ticketsService;