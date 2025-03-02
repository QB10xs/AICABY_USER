import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  user_id: string;
}

interface Message {
  id: string;
  ticket_id: string;
  content: string;
  created_at: string;
  user_id: string;
  is_admin: boolean;
}

const TicketDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTicketDetails();
      fetchMessages();
    }
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data.user_id !== user?.id) {
        toast.error('You do not have permission to view this ticket');
        navigate('/support');
        return;
      }
      setTicket(data);
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket details');
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('ticket_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('support_messages').insert([
        {
          ticket_id: id,
          content: newMessage.trim(),
          user_id: user?.id,
          is_admin: false,
        },
      ]);

      if (error) throw error;

      setNewMessage('');
      fetchMessages();
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading ticket details...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/support')}
        className="flex items-center text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Support
      </button>

      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">{ticket.title}</h1>
            <p className="text-sm text-gray-400 mt-1">
              Created on {new Date(ticket.created_at).toLocaleDateString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              ticket.status === 'open'
                ? 'bg-blue-500'
                : ticket.status === 'in_progress'
                ? 'bg-yellow-500'
                : 'bg-green-500'
            }`}
          >
            {ticket.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-gray-300 mb-6">{ticket.description}</p>
      </div>

      <div className="space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.user_id === user?.id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.user_id === user?.id
                  ? 'bg-blue-600'
                  : message.is_admin
                  ? 'bg-purple-600'
                  : 'bg-gray-700'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(message.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="mt-8">
        <Textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={3}
          className="mb-4"
        />
        <Button type="submit" disabled={isLoading || !newMessage.trim()}>
          {isLoading ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
};

export default TicketDetails; 