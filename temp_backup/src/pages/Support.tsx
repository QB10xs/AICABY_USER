import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Ticket } from '@/types/support';
import TicketList from '@/components/support/TicketList';
import NewTicketForm from '@/components/support/NewTicketForm';
import Layout from '@/components/layout/Layout';

const Support: React.FC = () => {
  const navigate = useNavigate();
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([
    // Demo tickets
    {
      id: '1',
      userId: 'user1',
      title: 'App Navigation Issue',
      description: 'Having trouble accessing the ride history section of the app.',
      status: 'open',
      priority: 'medium',
      category: 'Technical Support',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      userId: 'user1',
      title: 'Payment Not Processed',
      description: 'My last ride payment is showing as pending for over 2 hours.',
      status: 'in_progress',
      priority: 'high',
      category: 'Payment',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    },
    {
      id: '3',
      userId: 'user1',
      title: 'Driver Feedback',
      description: 'Would like to leave additional feedback for my driver from yesterday.',
      status: 'resolved',
      priority: 'low',
      category: 'Feedback',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '4',
      userId: 'user1',
      title: 'Urgent: Lost Item',
      description: 'Left my laptop in the taxi, need immediate assistance.',
      status: 'open',
      priority: 'urgent',
      category: 'Lost Items',
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    }
  ]);

  const handleTicketClick = (ticketId: string) => {
    navigate(`/support/ticket/${ticketId}`);
  };

  const handleNewTicket = () => {
    setShowNewTicketForm(true);
  };

  const handleTicketCreated = (ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev]);
    setShowNewTicketForm(false);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Center</h1>
          <p className="mt-2 text-gray-600">
            Need help? Create a ticket and our support team will assist you.
          </p>
        </div>
        <button
          onClick={handleNewTicket}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-accent rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          <PlusIcon className="w-5 h-5" />
          <span>New Ticket</span>
        </button>
      </div>

      {/* Ticket Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Open', count: tickets.filter(t => t.status === 'open').length, color: 'bg-blue-50 text-blue-700' },
          { label: 'In Progress', count: tickets.filter(t => t.status === 'in_progress').length, color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length, color: 'bg-green-50 text-green-700' },
          { label: 'Total', count: tickets.length, color: 'bg-gray-50 text-gray-700' }
        ].map((stat) => (
          <div key={stat.label} className={`${stat.color} rounded-lg p-4`}>
            <div className="text-sm font-medium">{stat.label}</div>
            <div className="text-2xl font-bold mt-1">{stat.count}</div>
          </div>
        ))}
      </div>

      {showNewTicketForm ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <NewTicketForm
            onSuccess={handleTicketCreated}
            onCancel={() => setShowNewTicketForm(false)}
          />
        </div>
      ) : (
        <>
          {/* Filter Options */}
          <div className="flex items-center space-x-4 mb-6">
            <select className="rounded-lg border-gray-300 text-sm focus:ring-primary focus:border-primary">
              <option value="all">All Tickets</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
            <select className="rounded-lg border-gray-300 text-sm focus:ring-primary focus:border-primary">
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          {/* Tickets List */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <TicketList tickets={tickets} onTicketClick={handleTicketClick} />
          </div>
        </>
      )}
    </div>
    </Layout>
  );
};

export default Support; 