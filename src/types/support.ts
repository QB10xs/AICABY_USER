export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  assignedTo?: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  content: string;
  isSystemMessage: boolean;
  createdAt: Date;
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  messageId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storagePath: string;
  createdAt: Date;
  userId: string;
}

export interface TicketFormData {
  title: string;
  description: string;
  category: string;
  priority: TicketPriority;
}

export interface MessageFormData {
  content: string;
  attachments?: File[];
} 