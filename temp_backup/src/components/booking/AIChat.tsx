import React, { useState, useRef, useEffect } from 'react';
import { useAIStore } from '@/stores/aiStore';
import { useBookingStore } from '@/stores/bookingStore';
import { useAuthStore } from '@/stores/authStore';
import { generateAIResponse } from '@/services/aiService';
import Message from '@/components/chat/Message';
import TypingIndicator from '@/components/chat/TypingIndicator';
import BookingConfirmation from './BookingConfirmation';
import { generateUUID } from '@/utils/uuid';

const AIChat: React.FC = () => {
  const {
    messages,
    isProcessing,
    error,
    addMessage,
    setProcessing,
    setError,
  } = useAIStore();

  const { user } = useAuthStore();
  const { currentBooking, bookingHistory, setCurrentBooking, addToHistory, clearCurrentBooking } = useBookingStore();
  
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    setInput(textarea.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    
    addMessage('user', userMessage);
    setProcessing(true);
    setError(null);

    try {
      // Get AI response
      const response = await generateAIResponse(userMessage, {
        previousBookings: bookingHistory.map(booking => ({
          ...booking,
          pickupLocation: {
            ...booking.pickupLocation,
            name: booking.pickupLocation.address
          },
          dropoffLocation: {
            ...booking.dropoffLocation,
            name: booking.dropoffLocation.address
          }
        })).slice(0, 5)
      });

      addMessage('assistant', response.content);

      if (response.booking) {
        const { pickupLocation, dropoffLocation, date, time, passengers } = response.booking;
        
        if (pickupLocation && dropoffLocation && user && date && time) {
          const newBooking = {
            id: generateUUID(),
            userId: user.id,
            pickupLocation: {
              ...pickupLocation,
              coordinates: {
                lat: pickupLocation.coordinates.lat,
                lng: pickupLocation.coordinates.lng
              }
            },
            dropoffLocation: {
              ...dropoffLocation,
              coordinates: {
                lat: dropoffLocation.coordinates.lat,
                lng: dropoffLocation.coordinates.lng
              }
            },
            route: null,
            date,
            time,
            passengers: passengers || 1,
            notes: '',
            status: 'pending' as const,
            price: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          setCurrentBooking(newBooking);
          setShowConfirmation(true);
        }
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Failed to process your request');
    } finally {
      setProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleConfirmBooking = async () => {
    if (!currentBooking) return;
    
    setIsConfirming(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addMessage('assistant', `Great! Your booking has been confirmed. Here's your booking details:
      
- Pickup: ${currentBooking.pickupLocation.address}
- Destination: ${currentBooking.dropoffLocation.address}
- Date: ${currentBooking.date}
- Time: ${currentBooking.time}
- Passengers: ${currentBooking.passengers}
- Estimated Price: €${currentBooking.price}

Your driver will contact you shortly before pickup. Thank you for choosing AI CABY!`);
      
      const confirmedBooking = {
        ...currentBooking,
        status: 'confirmed' as const,
        updatedAt: new Date(),
      };
      addToHistory(confirmedBooking);
      
      setShowConfirmation(false);
      clearCurrentBooking();
      
    } catch (error) {
      setError('Failed to confirm booking. Please try again.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancelBooking = () => {
    setShowConfirmation(false);
    clearCurrentBooking();
    addMessage('assistant', 'Booking cancelled. Is there anything else I can help you with?');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden">
      {showConfirmation && currentBooking ? (
        <div className="flex-1 overflow-y-auto p-4">
          <BookingConfirmation
            booking={currentBooking}
            onConfirm={handleConfirmBooking}
            onCancel={handleCancelBooking}
            isProcessing={isConfirming}
          />
        </div>
      ) : (
        <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p className="text-lg font-medium mb-2">Welcome to AI CABY!</p>
                <p className="text-sm">
                  I can help you book a ride in any language. Just tell me where and when you'd like to go!
                </p>
                <p className="text-sm mt-4 text-gray-400">
                  For example, try saying:<br />
                  "I need a taxi from Amsterdam Central Station to Schiphol Airport tomorrow at 10 AM"
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                  />
                ))}
                {isProcessing && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 text-sm border-t border-red-100">
              {error}
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t bg-white p-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1 min-h-[44px]">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleTextareaInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="w-full resize-none px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[44px] max-h-[120px]"
                  disabled={isProcessing}
                  rows={1}
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing || !input.trim()}
                className={`
                  px-6 py-3 rounded-lg text-white font-medium flex-shrink-0
                  ${isProcessing || !input.trim()
                    ? 'bg-primary/50 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90'
                  }
                `}
              >
                {isProcessing ? 'Processing...' : 'Send'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default AIChat; 