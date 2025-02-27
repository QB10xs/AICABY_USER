import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supportService } from '@/services/supportService';
import { Ticket, TicketPriority } from '@/types/support';

const ticketSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  priority: z.enum(['low', 'medium', 'high', 'urgent'] as const),
});

type TicketFormData = z.infer<typeof ticketSchema>;

interface NewTicketFormProps {
  onSuccess: (ticket: Ticket) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'General Inquiry',
  'Technical Issue',
  'Billing',
  'Feature Request',
  'Bug Report',
  'Account',
  'Other',
];

const PRIORITIES: { value: TicketPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const NewTicketForm: React.FC<NewTicketFormProps> = ({ onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      priority: 'medium',
    },
  });

  const onSubmit = async (data: TicketFormData) => {
    try {
      const ticket = await supportService.createTicket(data);
      onSuccess(ticket);
    } catch (error) {
      console.error('Error creating ticket:', error);
      // You might want to show an error notification here
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Create New Ticket</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          {...register('title')}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.title
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
          }`}
          placeholder="Brief summary of your issue"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          {...register('category')}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.category
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
          }`}
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          {...register('priority')}
          className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          {PRIORITIES.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.description
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
          }`}
          placeholder="Detailed description of your issue"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary hover:bg-primary/90 text-accent font-semibold rounded-lg transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
};

export default NewTicketForm; 