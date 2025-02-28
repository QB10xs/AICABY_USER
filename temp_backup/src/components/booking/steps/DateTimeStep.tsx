import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, isBefore, startOfDay, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';
import type { Booking } from '@/types/booking';

interface DateTimeStepProps {
  bookingData: Partial<Booking>;
  onUpdate: (data: Partial<Booking>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DateTimeStep: React.FC<DateTimeStepProps> = ({
  bookingData,
  onUpdate,
  onNext,
  onBack
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    bookingData.date ? new Date(bookingData.date) : new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    bookingData.time || format(new Date(), 'HH:mm')
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [timeViewType, setTimeViewType] = useState<'morning' | 'afternoon' | 'evening'>('morning');

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth });

  // Time slots by period
  const timeSlots = {
    morning: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'],
    afternoon: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    evening: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setError(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setError(null);
  };

  const handleNext = () => {
    const selectedDateTime = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      parseInt(selectedTime.split(':')[0]),
      parseInt(selectedTime.split(':')[1])
    );

    if (isBefore(selectedDateTime, new Date())) {
      setError('Please select a future date and time');
      return;
    }

    onUpdate({
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime
    });
    onNext();
  };

  const isDateSelectable = (date: Date) => {
    return !isBefore(startOfDay(date), startOfDay(new Date()));
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">When do you want to ride?</h2>
        <p className="text-gray-400">Choose your preferred date and time</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h3 className="text-lg font-medium text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center text-sm text-gray-400 py-2">
                {day}
              </div>
            ))}

            {/* Date cells */}
            {Array.from({ length: firstDayOfMonth.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2" />
            ))}

            {daysInMonth.map((date) => {
              const isSelected = isSameDay(date, selectedDate);
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const selectable = isDateSelectable(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => selectable && handleDateSelect(date)}
                  disabled={!selectable}
                  className={`
                    p-2 rounded-lg text-center transition-colors relative
                    ${!isCurrentMonth && 'opacity-30'}
                    ${!selectable && 'cursor-not-allowed opacity-30'}
                    ${isSelected
                      ? 'bg-taxi-yellow text-night-black'
                      : selectable
                      ? 'hover:bg-white/5'
                      : ''
                    }
                  `}
                >
                  <span className={`
                    text-sm ${isToday(date) && !isSelected ? 'text-taxi-yellow font-bold' : ''}
                  `}>
                    {format(date, 'd')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection Section */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Select Time</h3>
            <div className="flex space-x-2">
              {(['morning', 'afternoon', 'evening'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeViewType(period)}
                  className={`
                    px-3 py-1 rounded-full text-sm transition-colors
                    ${timeViewType === period
                      ? 'bg-taxi-yellow text-night-black'
                      : 'text-gray-400 hover:bg-white/5'
                    }
                  `}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {timeSlots[timeViewType].map((time) => {
              const isTimeSelectable = !isBefore(
                new Date(
                  selectedDate.getFullYear(),
                  selectedDate.getMonth(),
                  selectedDate.getDate(),
                  parseInt(time.split(':')[0]),
                  0
                ),
                new Date()
              );

              return (
                <button
                  key={time}
                  onClick={() => isTimeSelectable && handleTimeSelect(time)}
                  disabled={!isTimeSelectable}
                  className={`
                    p-3 rounded-lg text-center transition-colors
                    ${time === selectedTime
                      ? 'bg-taxi-yellow text-night-black'
                      : isTimeSelectable
                      ? 'hover:bg-white/5'
                      : 'opacity-30 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="text-base font-medium">{time}</div>
                </button>
              );
            })}
          </div>

          {/* Selected Date/Time Summary */}
          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-taxi-yellow">
                <CalendarIcon className="w-5 h-5" />
                <span>{format(selectedDate, 'EEEE, MMMM d')}</span>
              </div>
              <div className="flex items-center space-x-2 text-taxi-yellow">
                <Clock className="w-5 h-5" />
                <span>{selectedTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-error text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-taxi-yellow text-night-black rounded-lg hover:bg-taxi-yellow/90 transition-colors"
        >
          Continue to Service
        </button>
      </div>
    </div>
  );
};

export default DateTimeStep; 