import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '@/stores/bookingStore';
import { format } from 'date-fns';
import Layout from '@/components/layout/Layout';
import Notification from '@/components/shared/Notification';
import { CAR_CATEGORIES, CarCategory } from '@/types/booking';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const BookingConfirmation: React.FC = () => {
  const navigate = useNavigate();
  const { currentBooking, addToHistory, clearCurrentBooking } = useBookingStore();
  const [isConfirming, setIsConfirming] = React.useState(false);
  const [showNotification, setShowNotification] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<CarCategory>('Standard');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Redirect if no booking data
  React.useEffect(() => {
    if (!currentBooking) {
      navigate('/book');
    }
  }, [currentBooking, navigate]);

  // Initialize map and fetch route
  React.useEffect(() => {
    if (!currentBooking || !mapContainer.current) return;

    const initializeMap = async () => {
      if (!mapContainer.current) return;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [currentBooking.pickupLocation.coordinates.lng, currentBooking.pickupLocation.coordinates.lat],
        zoom: 12,
        accessToken: import.meta.env.VITE_MAPBOX_ACCESS_TOKEN,
      });

      // Wait for map to load
      map.current.on('load', () => {
        if (!map.current) return;

        // Add markers
        new mapboxgl.Marker({ color: '#22c55e' })
          .setLngLat([currentBooking.pickupLocation.coordinates.lng, currentBooking.pickupLocation.coordinates.lat])
          .addTo(map.current);

        new mapboxgl.Marker({ color: '#ef4444' })
          .setLngLat([currentBooking.dropoffLocation.coordinates.lng, currentBooking.dropoffLocation.coordinates.lat])
          .addTo(map.current);

        // Add route if available
        if (currentBooking.route) {
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: currentBooking.route.geometry
            }
          });

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 4
            }
          });
        }
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [currentBooking]);

  if (!currentBooking) {
    return null;
  }

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      // Add booking to history with selected category
      addToHistory({
        ...currentBooking,
        status: 'confirmed',
        carCategory: selectedCategory,
        updatedAt: new Date(),
      });
      
      setShowNotification(true);
      
      setTimeout(() => {
        clearCurrentBooking();
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error confirming booking:', error);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleModify = () => {
    navigate('/book');
  };

  const formatDateTime = (date: string, time: string) => {
    const dateTime = new Date(`${date}T${time}`);
    return format(dateTime, 'EEEE, MMMM d, yyyy \'at\' h:mm a');
  };

  const calculatePrice = (distanceInMeters: number, category: CarCategory) => {
    const distanceInKm = distanceInMeters / 1000;
    const { basePrice, pricePerKm } = CAR_CATEGORIES[category];
    const price = basePrice + (distanceInKm * pricePerKm);
    return price;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const estimatedPrice = calculatePrice(
    currentBooking.route?.distance || 15000, // Default to 15km if no route
    selectedCategory
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Confirm Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Map Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div ref={mapContainer} className="w-full h-[400px]" />
            </div>

            {/* Booking Details Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 space-y-6">
                {/* Car Categories */}
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-500">Select Vehicle Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.values(CAR_CATEGORIES).map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`
                          p-4 rounded-lg border-2 text-left transition-colors
                          ${selectedCategory === category.id
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-primary/50'
                          }
                        `}
                      >
                        <div className="font-semibold text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                        <div className="text-sm text-gray-500 mt-1">Up to {category.capacity} passengers</div>
                        <div className="text-primary font-semibold mt-2">
                          {formatPrice(calculatePrice(currentBooking.route?.distance || 15000, category.id))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Locations */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Pickup Location</label>
                    <p className="mt-1 text-lg text-gray-900">{currentBooking.pickupLocation.address}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Drop-off Location</label>
                    <p className="mt-1 text-lg text-gray-900">{currentBooking.dropoffLocation.address}</p>
                  </div>
                </div>

                {/* Date & Time */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Pickup Time</label>
                  <p className="mt-1 text-lg text-gray-900">
                    {formatDateTime(currentBooking.date, currentBooking.time)}
                  </p>
                </div>

                {/* Passengers */}
                <div>
                  <label className="text-sm font-medium text-gray-500">Passengers</label>
                  <p className="mt-1 text-lg text-gray-900">{currentBooking.passengers} passenger(s)</p>
                </div>

                {/* Notes */}
                {currentBooking.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Additional Notes</label>
                    <p className="mt-1 text-lg text-gray-900">{currentBooking.notes}</p>
                  </div>
                )}

                {/* Price Summary */}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Price</span>
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(estimatedPrice)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Includes €1.50 service fee. No additional charges.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 flex gap-4">
                <button
                  onClick={handleModify}
                  className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  Modify Booking
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className={`
                    flex-1 px-4 py-3 text-white rounded-lg
                    ${isConfirming 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90'}
                  `}
                >
                  {isConfirming ? 'Confirming...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {showNotification && (
          <Notification
            type="success"
            message="Booking confirmed successfully! Redirecting to dashboard..."
            duration={2000}
          />
        )}
      </div>
    </Layout>
  );
};

export default BookingConfirmation; 