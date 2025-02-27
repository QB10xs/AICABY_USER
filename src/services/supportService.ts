import { supabase } from '@/lib/supabase';
import { Ticket, TicketMessage, TicketAttachment, TicketFormData, MessageFormData } from '@/types/support';

export const supportService = {
  // Fetch user's tickets
  async getTickets(): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single ticket with messages and attachments
  async getTicket(ticketId: string): Promise<{
    ticket: Ticket;
    messages: TicketMessage[];
    attachments: TicketAttachment[];
  }> {
    const { data: ticket, error: ticketError } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single();

    if (ticketError) throw ticketError;

    const { data: messages, error: messagesError } = await supabase
      .from('ticket_messages')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (messagesError) throw messagesError;

    const { data: attachments, error: attachmentsError } = await supabase
      .from('ticket_attachments')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (attachmentsError) throw attachmentsError;

    return {
      ticket,
      messages: messages || [],
      attachments: attachments || [],
    };
  },

  // Create a new ticket
  async createTicket(data: TicketFormData): Promise<Ticket> {
    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert([{
        ...data,
        status: 'open',
      }])
      .select()
      .single();

    if (error) throw error;
    return ticket;
  },

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: Ticket['status']): Promise<void> {
    const { error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId);

    if (error) throw error;
  },

  // Add message to ticket
  async addMessage(ticketId: string, data: MessageFormData): Promise<{
    message: TicketMessage;
    attachments: TicketAttachment[];
  }> {
    // First create the message
    const { data: message, error: messageError } = await supabase
      .from('ticket_messages')
      .insert([{
        ticket_id: ticketId,
        content: data.content,
      }])
      .select()
      .single();

    if (messageError) throw messageError;

    const attachments: TicketAttachment[] = [];

    // Upload attachments if any
    if (data.attachments?.length) {
      for (const file of data.attachments) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${ticketId}/${message.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('ticket-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Create attachment record
        const { data: attachment, error: attachmentError } = await supabase
          .from('ticket_attachments')
          .insert([{
            ticket_id: ticketId,
            message_id: message.id,
            file_name: file.name,
            file_type: file.type,
            file_size: file.size,
            storage_path: filePath,
          }])
          .select()
          .single();

        if (attachmentError) throw attachmentError;
        attachments.push(attachment);
      }
    }

    return { message, attachments };
  },

  // Get attachment URL
  async getAttachmentUrl(storagePath: string): Promise<string> {
    const { data } = await supabase.storage
      .from('ticket-attachments')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (!data?.signedUrl) throw new Error('Could not generate signed URL');
    return data.signedUrl;
  },
}; 