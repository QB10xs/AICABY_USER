import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Layout from '@/components/layout/Layout';
import { supportService } from '@/services/supportService';
import { Ticket, TicketMessage, TicketAttachment, MessageFormData } from '@/types/support';
import { useAuthStore } from '@/stores/authStore';

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [attachments, setAttachments] = useState<TicketAttachment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
    }
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTicketDetails = async () => {
    try {
      setIsLoading(true);
      const data = await supportService.getTicket(id!);
      setTicket(data.ticket);
      setMessages(data.messages);
      setAttachments(data.attachments);
    } catch (err) {
      setError('Failed to load ticket details');
      console.error('Error fetching ticket details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStatusChange = async (status: Ticket['status']) => {
    if (!ticket) return;

    try {
      await supportService.updateTicketStatus(ticket.id, status);
      setTicket({ ...ticket, status });
    } catch (err) {
      console.error('Error updating ticket status:', err);
      // Show error notification
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || !ticket) return;

    try {
      setIsSending(true);
      const data: MessageFormData = {
        content: message.trim(),
        attachments: files,
      };

      const result = await supportService.addMessage(ticket.id, data);
      setMessages((prev) => [...prev, result.message]);
      setAttachments((prev) => [...prev, ...result.attachments]);
      setMessage('');
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      console.error('Error sending message:', err);
      // Show error notification
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (error || !ticket) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error || 'Ticket not found'}</p>
            <button
              onClick={() => navigate('/support')}
              className="text-primary hover:text-primary/90"
            >
              Return to Support
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Ticket Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {ticket.title}
              </h1>
              <p className="text-gray-600">{ticket.description}</p>
            </div>
            <div className="flex gap-2">
              <select
                value={ticket.status}
                onChange={(e) => handleStatusChange(e.target.value as Ticket['status'])}
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  ticket.status
                )}`}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>#{ticket.id.split('-')[0]}</span>
            <span>Created {format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
            <span>{ticket.category}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.userId === user?.id ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    message.userId === user?.id
                      ? 'bg-primary text-accent rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  {/* Show attachments for this message */}
                  {attachments
                    .filter((a) => a.messageId === message.id)
                    .map((attachment) => (
                      <div
                        key={attachment.id}
                        className="mt-2 p-2 bg-white/10 rounded text-xs flex items-center gap-2"
                      >
                        📎{' '}
                        <a
                          href="#"
                          onClick={async (e) => {
                            e.preventDefault();
                            const url = await supportService.getAttachmentUrl(
                              attachment.storagePath
                            );
                            window.open(url, '_blank');
                          }}
                          className="hover:underline"
                        >
                          {attachment.fileName}
                        </a>
                      </div>
                    ))}
                  <p
                    className={`text-xs mt-1 ${
                      message.userId === user?.id
                        ? 'text-accent/50'
                        : 'text-gray-500'
                    }`}
                  >
                    {format(new Date(message.createdAt), 'MMM d, HH:mm')}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  multiple
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isSending}
                  className="bg-primary hover:bg-primary/90 text-accent font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default TicketDetails; 