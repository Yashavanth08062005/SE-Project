import React, { useState } from 'react';
import { MapPin, Star, Users, Bed, IndianRupee, Wifi, Coffee, Car, UtensilsCrossed, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HotelCard = ({ option, searchContext }) => {
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch {
      return dateString;
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/booking', item: option, type: 'hotel' } });
      return;
    }
    navigate('/booking', { state: { item: option, type: 'hotel' } });
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi') || amenityLower.includes('internet')) {
      return <Wifi className="h-4 w-4" />;
    } else if (amenityLower.includes('breakfast') || amenityLower.includes('restaurant')) {
      return <UtensilsCrossed className="h-4 w-4" />;
    } else if (amenityLower.includes('parking')) {
      return <Car className="h-4 w-4" />;
    } else if (amenityLower.includes('coffee')) {
      return <Coffee className="h-4 w-4" />;
    }
    return null;
  };

  const details = option.details || {};
  const address = details.address || {};

  return (
    <div className="card hover:border-blue-300 border-2 border-transparent transition-all">
      {/* Main Hotel Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Left Section - Hotel Details */}
        <div className="flex-1 w-full">
          {/* Hotel Name & Rating */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xl text-gray-900">
                {details.name || 'Hotel'}
              </h3>
              {details.rating && (
                <div className="flex items-center space-x-1 bg-blue-100 px-3 py-1 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-blue-900">{details.rating}</span>
                </div>
              )}
            </div>

            {/* Location */}
            {(address.street || details.cityName) && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                <span>
                  {address.street && <span>{address.street}, </span>}
                  {details.cityName || details.cityCode}
                </span>
              </div>
            )}
          </div>

          {/* Check-in/out Dates */}
          <div className="flex items-center space-x-6 mb-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Check-in</p>
              <p className="font-semibold text-gray-900">{formatDate(searchContext?.checkInDate || option.checkIn)}</p>
            </div>
            <div className="text-gray-400">→</div>
            <div>
              <p className="text-gray-500 text-xs">Check-out</p>
              <p className="font-semibold text-gray-900">{formatDate(searchContext?.checkOutDate || option.checkOut)}</p>
            </div>
            <div className="ml-auto">
              <p className="text-gray-500 text-xs">Nights</p>
              <p className="font-semibold text-gray-900">{details.nights}</p>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-700">
            {/* Guests */}
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span>{details.adults || 1} {details.adults > 1 ? 'Guests' : 'Guest'}</span>
            </div>

            {/* Rooms */}
            <div className="flex items-center space-x-1">
              <Bed className="h-4 w-4 text-blue-500" />
              <span>{details.rooms || 1} {details.rooms > 1 ? 'Rooms' : 'Room'}</span>
            </div>

            {/* Room Type */}
            {details.bedType && (
              <div className="text-gray-600">
                <span className="text-xs">Bed: </span>
                <span className="font-medium">{details.bedType}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Price */}
        <div className="flex flex-col items-end space-y-2 min-w-[160px]">
          <div className="text-right">
            <p className="text-xs text-gray-500 mb-1">Total Price</p>
            <div className="flex items-center space-x-1">
              <IndianRupee className="h-6 w-6 text-gray-700" />
              <span className="text-3xl font-bold text-gray-900">
                {option.price?.toLocaleString('en-IN') || '0'}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ₹{option.pricePerNight?.toLocaleString('en-IN')} per night
            </p>
          </div>

          <button
            onClick={handleBookNow}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold transition-colors text-sm"
          >
            Book Now
          </button>
        </div>
      </div>

      {/* Amenities Preview (Top 4) */}
      {details.amenities && details.amenities.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-3 text-xs text-gray-600">
            {details.amenities.slice(0, 4).map((amenity, idx) => (
              <div key={idx} className="flex items-center space-x-1 bg-gray-50 px-2 py-1 rounded">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
            {details.amenities.length > 4 && (
              <span className="text-blue-600 font-medium">
                +{details.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Toggle Details Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors text-blue-700 font-medium text-sm"
      >
        {showDetails ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Hide Details
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Show Details
          </>
        )}
      </button>

      {/* Hotel Details Section - Conditional Render */}
      {showDetails && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
          {/* Room Details */}
          {details.roomDescription && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Room Details</h4>
              <p className="text-sm text-gray-600">{details.roomDescription}</p>
              <div className="mt-2 text-sm text-gray-700">
                <p><span className="font-medium">Room Type:</span> {details.roomType || 'Standard'}</p>
                {details.bedType && <p><span className="font-medium">Bed:</span> {details.bedType} ({details.beds} bed{details.beds > 1 ? 's' : ''})</p>}
              </div>
            </div>
          )}

          {/* All Amenities */}
          {details.amenities && details.amenities.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Amenities</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {details.amenities.map((amenity, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                    {getAmenityIcon(amenity)}
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Policies */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">Policies</h4>
            <div className="space-y-1 text-xs text-gray-700">
              {details.checkInTime && (
                <p><span className="font-medium">Check-in:</span> {details.checkInTime}</p>
              )}
              {details.checkOutTime && (
                <p><span className="font-medium">Check-out:</span> {details.checkOutTime}</p>
              )}
              {details.cancellationPolicy && (
                <p><span className="font-medium">Cancellation:</span> {details.cancellationPolicy}</p>
              )}
              {details.paymentPolicy && (
                <p><span className="font-medium">Payment:</span> {details.paymentPolicy}</p>
              )}
            </div>
          </div>

          {/* Contact Information */}
          {(details.phone || details.email) && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
              <div className="text-sm text-gray-600 space-y-1">
                {details.phone && <p><span className="font-medium">Phone:</span> {details.phone}</p>}
                {details.email && <p><span className="font-medium">Email:</span> {details.email}</p>}
              </div>
            </div>
          )}

          {/* Address */}
          {address.street && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Full Address</h4>
              <p className="text-sm text-gray-600">
                {address.street}<br />
                {address.city && `${address.city}, `}
                {address.state && `${address.state} `}
                {address.postalCode}<br />
                {address.country}
              </p>
            </div>
          )}

          {/* Provider Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
            <p><span className="font-medium">Hotel ID:</span> {details.hotelId}</p>
            {details.chainCode && <p><span className="font-medium">Chain:</span> {details.chainCode}</p>}
            <p><span className="font-medium">Data Provider:</span> {option.providerId}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelCard;
