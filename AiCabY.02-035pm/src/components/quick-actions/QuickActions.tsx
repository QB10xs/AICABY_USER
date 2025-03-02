import React, { useState } from 'react';
import { MapPin, Camera, Map, CreditCard, Settings2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import MapView from '../map/MapView';
import PaymentSelector from '../payment/PaymentSelector';

interface QuickActionsProps {
  onSendMessage: (message: string) => void;
  onPhotoUpload: (photo: File) => void;
  driverLocation?: {
    latitude: number;
    longitude: number;
  };
  userLocation?: {
    latitude: number;
    longitude: number;
  };
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onSendMessage, 
  onPhotoUpload,
  driverLocation,
  userLocation
}) => {
  const [locationLoading, setLocationLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [mapLoading] = useState(false);
  const [paymentLoading] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // Location Handler
  const handleLocation = async () => {
    setLocationLoading(true);
    try {
      console.log('Location button clicked');
      // Check if geolocation is available
      if (!navigator.geolocation) {
        toast.error(
          <div className="flex flex-col gap-2">
            <div className="font-medium">Location services not supported</div>
            <div className="text-sm opacity-80">Please use a modern browser with location support</div>
          </div>
        );
        return;
      }

      // Check for permissions
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      console.log('Location permission status:', permission.state);
      
      if (permission.state === 'denied') {
        // Show error toast with instructions
        toast((t) => (
          <div className="flex items-start gap-3">
            <Settings2 className="w-5 h-5 text-[#F7C948] mt-0.5" />
            <div className="flex flex-col gap-1">
              <div className="font-medium">Location Access Required</div>
              <div className="text-sm opacity-80">Please enable location access in your settings to use this feature</div>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    // Open browser settings
                    if (navigator.userAgent.includes('Chrome')) {
                      window.open('chrome://settings/content/location');
                    } else if (navigator.userAgent.includes('Firefox')) {
                      window.open('about:preferences#privacy');
                    } else if (navigator.userAgent.includes('Safari')) {
                      window.open('x-apple.systempreferences:com.apple.preference.security?Privacy_LocationServices');
                    }
                    toast.dismiss(t.id);
                  }}
                  className="px-3 py-1.5 bg-[#F7C948] text-black text-sm font-medium rounded-lg hover:bg-[#F7C948]/90 transition-colors"
                >
                  Open Settings
                </button>
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="px-3 py-1.5 bg-white/10 text-white text-sm font-medium rounded-lg hover:bg-white/20 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ), {
          duration: 8000,
          position: 'bottom-center'
        });
        return;
      }

      // Get current position
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            console.log('Got location:', position.coords);
            // Get address from coordinates using reverse geocoding
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`
            );
            const data = await response.json();
            console.log('Geocoding response:', data);
            const address = data.features[0].place_name;
            
            // Send confirmation message
            onSendMessage(`Setting pickup location to: ${address}`);
            toast.success('Pickup location set successfully');
          } catch (error) {
            console.error('Geocoding error:', error);
            toast.error('Unable to get address from coordinates');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          switch(error.code) {
            case error.PERMISSION_DENIED:
              toast.error('Location access denied. Please enable location services.');
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error('Unable to detect your location');
              break;
            case error.TIMEOUT:
              toast.error('Location request timed out');
              break;
            default:
              toast.error('Unable to get current location');
          }
        }
      );
    } catch (error) {
      console.error('Location handler error:', error);
      toast.error('Error accessing location services');
    } finally {
      setLocationLoading(false);
    }
  };

  // Photo Handler
  const handlePhoto = async () => {
    setPhotoLoading(true);
    try {
      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment'; // Use back camera on mobile devices

      // Handle file selection
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // Show preview in chat
          const reader = new FileReader();
          reader.onload = () => {
            // Create image preview message
            const img = document.createElement('img');
            img.src = reader.result as string;
            img.className = 'max-w-xs rounded-lg shadow-lg';
            
            // Send photo to driver
            onPhotoUpload(file);
            onSendMessage("Here's a photo of my location:");
            
            // You might want to implement a proper image preview in the chat
            // For now, we'll just show a success message
            toast.success('Photo sent to driver');
          };
          reader.readAsDataURL(file);
        }
      };

      input.click();
    } catch (error) {
      toast.error('Unable to access camera');
    } finally {
      setPhotoLoading(false);
    }
  };

  // Map Handler
  const handleMap = () => {
    if (!driverLocation || !userLocation) {
      toast.error('Driver location not available yet');
      return;
    }
    setIsMapOpen(true);
  };

  // Payment Handler
  const handlePayment = () => {
    setIsPaymentOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLocation}
            disabled={locationLoading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[rgba(42,42,42,0.9)] backdrop-blur-lg rounded-lg hover:bg-[rgba(247,201,72,0.1)] transition-colors border border-[#F7C948]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <MapPin className="w-5 h-5 text-[#F7C948] mt-0.5" />
            <span className="text-sm text-[#F7C948] group-hover:text-[#F7C948]">
              Location
            </span>
          </button>
          <button
            onClick={handlePhoto}
            disabled={photoLoading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[rgba(42,42,42,0.9)] backdrop-blur-lg rounded-lg hover:bg-[rgba(247,201,72,0.1)] transition-colors border border-[#F7C948]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Camera className="w-5 h-5 text-[#F7C948] mt-0.5" />
            <span className="text-sm text-[#F7C948] group-hover:text-[#F7C948]">
              Photo
            </span>
          </button>
          <button
            onClick={handleMap}
            disabled={mapLoading || !driverLocation}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[rgba(42,42,42,0.9)] backdrop-blur-lg rounded-lg hover:bg-[rgba(247,201,72,0.1)] transition-colors border border-[#F7C948]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Map className="w-5 h-5 text-[#F7C948] mt-0.5" />
            <span className="text-sm text-[#F7C948] group-hover:text-[#F7C948]">
              Map
            </span>
          </button>
          <button
            onClick={handlePayment}
            disabled={paymentLoading}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-[rgba(42,42,42,0.9)] backdrop-blur-lg rounded-lg hover:bg-[rgba(247,201,72,0.1)] transition-colors border border-[#F7C948]/20 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <CreditCard className="w-5 h-5 text-[#F7C948] mt-0.5" />
            <span className="text-sm text-[#F7C948] group-hover:text-[#F7C948]">
              Payment
            </span>
          </button>
        </div>
      </div>

      {/* Map Modal */}
      {isMapOpen && (
        <MapView
          driverLocation={driverLocation}
          userLocation={userLocation}
          onClose={() => setIsMapOpen(false)}
        />
      )}

      {/* Payment Selector */}
      <PaymentSelector
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSelect={(method) => {
          onSendMessage(`Payment method set to: ${method.toLowerCase()}`);
          toast.success('Payment method updated');
        }}
      />
    </div>
  );
};

export default QuickActions; 