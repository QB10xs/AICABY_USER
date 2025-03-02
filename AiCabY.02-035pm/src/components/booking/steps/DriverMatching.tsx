import React from 'react';
import { motion } from 'framer-motion';
import { Star, Car } from 'lucide-react';

export interface DriverMatch {
  id: string;
  name: string;
  rating: number;
  vehicle: {
    make: string;
    model: string;
    color: string;
    plate: string;
    image: string;
  };
  eta: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface DriverMatchingProps {
  isSearching: boolean;
  driver?: DriverMatch;
  onViewOnMap?: () => void;
}

const DriverMatching: React.FC<DriverMatchingProps> = ({
  isSearching,
  driver,
  onViewOnMap
}) => {
  return (
    <div className="relative min-h-[400px] rounded-xl bg-[rgba(42,42,42,0.7)] border border-[#F7C948]/20 backdrop-blur-lg p-6 flex items-center justify-center">
      {isSearching ? (
        <div className="text-center">
          {/* Radar Animation */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <motion.div
              className="absolute inset-0 border-2 border-[#F7C948] rounded-full"
              animate={{
                scale: [1, 2],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute inset-0 border-2 border-[#F7C948] rounded-full"
              animate={{
                scale: [1, 2],
                opacity: [0.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: 1
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Car className="w-12 h-12 text-[#F7C948]" />
            </div>
          </div>
          
          <h3 className="text-xl font-medium text-white mb-2">
            Finding your driver
          </h3>
          <p className="text-zinc-400">
            Searching for nearby drivers...
          </p>
        </div>
      ) : driver ? (
        <div className="w-full space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-medium text-[#F7C948]">
              Driver Found!
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewOnMap}
              className="px-4 py-2 bg-[#F7C948]/10 hover:bg-[#F7C948]/20 rounded-lg text-[#F7C948] text-sm transition-colors"
            >
              View on Map
            </motion.button>
          </div>

          {/* Driver Card */}
          <div className="rounded-lg bg-white/5 p-4 space-y-4">
            {/* Driver Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#F7C948]/20 flex items-center justify-center">
                <Car className="w-8 h-8 text-[#F7C948]" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-white">
                  {driver.name}
                </h4>
                <div className="flex items-center gap-1 text-[#F7C948]">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{driver.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-zinc-400">Vehicle</span>
                <p className="text-white">
                  {driver.vehicle.make} {driver.vehicle.model}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-zinc-400">Color</span>
                <p className="text-white">{driver.vehicle.color}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-zinc-400">Plate Number</span>
                <p className="text-white">{driver.vehicle.plate}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-zinc-400">ETA</span>
                <p className="text-white">{driver.eta} mins</p>
              </div>
            </div>

            {/* Vehicle Image */}
            <div className="relative h-48 rounded-lg overflow-hidden">
              <img
                src={driver.vehicle.image}
                alt={`${driver.vehicle.make} ${driver.vehicle.model}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DriverMatching;
