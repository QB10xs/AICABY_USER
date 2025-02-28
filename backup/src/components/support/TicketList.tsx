import React from 'react';
import { format } from 'date-fns';
import { Ticket } from '@/types/support';
import {
  ExclamationCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick: (ticketId: string) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, onTicketClick }) => {
  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return <ExclamationCircleIcon className="w-5 h-5 text-blue-500" />;
      case 'in_progress':
        return <ArrowPathIcon className="w-5 h-5 text-yellow-500 animate-spin" />;
      case 'resolved':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'closed':
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'in_progress':
        return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'resolved':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'closed':
        return 'bg-gray-50 text-gray-700 border-gray-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'high':
        return 'bg-orange-50 text-orange-700 border-orange-100';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'low':
        return 'bg-gray-50 text-gray-700 border-gray-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="divide-y divide-gray-100">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          onClick={() => onTicketClick(ticket.id)}
          className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`mt-1 ${getStatusColor(ticket.status)} p-2 rounded-full`}>
                {getStatusIcon(ticket.status)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {ticket.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {ticket.description}
                </p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-500">
                    #{ticket.id.split('-')[0]}
                  </span>
                  <span className="text-gray-500">
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy HH:mm')}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-full text-xs">
                    {ticket.category}
                  </span>
                </div>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
              {ticket.status.replace('_', ' ')}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketList; 