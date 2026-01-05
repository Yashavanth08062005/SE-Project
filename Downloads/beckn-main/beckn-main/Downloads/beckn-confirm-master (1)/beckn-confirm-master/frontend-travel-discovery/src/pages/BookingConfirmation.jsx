import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Plane, User, MapPin, Phone, Mail, Calendar, Download, Train, Bus, Hotel } from 'lucide-react';

const BookingConfirmation = () => {
    const location = useLocation();
    const navigate = useNavigate();



    const { booking, flight, passenger, type } = location.state || {}; // flight contains the item/option details
    // Fallback type if passed explicitly, or try to guess from details
    const bookingType = type || (flight?.travelMode) || (flight?.details?.trainName ? 'train' : flight?.details?.hotelName ? 'hotel' : 'flight');

    if (!booking || !flight || !passenger) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">No booking information found</p>
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const bookingId = `BK${Date.now().toString().slice(-8)}`;

    const renderModeIcon = () => {
        if (bookingType === 'train') return <Train className="h-6 w-6 mr-2 text-green-600" />;
        if (bookingType === 'bus') return <Bus className="h-6 w-6 mr-2 text-orange-600" />;
        if (bookingType === 'hotel') return <Hotel className="h-6 w-6 mr-2 text-purple-600" />;
        return <Plane className="h-6 w-6 mr-2 text-blue-600" />;
    };

    const formatDuration = (val) => {
        const dur = val || 'N/A';
        const mins = parseInt(dur);
        if (!isNaN(mins)) {
            const h = Math.floor(mins / 60);
            const m = mins % 60;
            return `${h}h ${m.toString().padStart(2, '0')}m`;
        }
        return dur;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="bg-white rounded-xl shadow-md p-8 mb-6 text-center">
                    <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Booking Confirmed!
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Your {bookingType === 'train' ? 'train' : bookingType === 'bus' ? 'bus' : bookingType === 'hotel' ? 'hotel' : 'flight'} has been successfully booked
                    </p>
                    <div className="inline-block bg-blue-50 px-6 py-3 rounded-lg">
                        <p className="text-sm text-gray-600">Booking Reference</p>
                        <p className="text-2xl font-bold text-blue-600">{bookingId}</p>
                    </div>
                </div>

                {/* Flight Details */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        {renderModeIcon()}
                        {bookingType === 'train' ? 'Train Details' : bookingType === 'bus' ? 'Bus Details' : bookingType === 'hotel' ? 'Hotel Details' : 'Flight Details'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">
                                {bookingType === 'train' ? 'Train Name' : bookingType === 'bus' ? 'Operator' : bookingType === 'hotel' ? 'Hotel Name' : 'Airline'}
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {flight.details?.trainName || flight.details?.operator || flight.details?.hotelName || flight.details?.name || flight.details?.airline || flight.descriptor?.name || 'Carrier'}
                            </p>
                            <p className="text-sm text-gray-600">
                                {bookingType === 'train' ? `Train ${flight.details?.trainNumber || ''}` : bookingType === 'bus' ? `Bus ${flight.details?.busNumber || ''}` : bookingType === 'hotel' ? '' : `Flight ${flight.details?.flightNumber || flight.descriptor?.code || 'N/A'}`}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">{bookingType === 'hotel' ? 'Location' : 'Route'}</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {bookingType === 'hotel'
                                    ? (
                                        typeof flight.details?.address === 'string' ? flight.details.address :
                                            flight.details?.address?.street || flight.details?.address?.city ||
                                            flight.details?.city || flight.details?.location_id || 'Hotel Location'
                                    )
                                    : (
                                        <>
                                            {location.state?.searchContext?.origin || flight.details?.departureStation || flight.details?.departureLocation || flight.details?.departureCity || flight.origin || 'DEP'}
                                            {' → '}
                                            {location.state?.searchContext?.destination || flight.details?.arrivalStation || flight.details?.arrivalLocation || flight.details?.arrivalCity || flight.destination || 'ARR'}
                                        </>
                                    )
                                }
                            </p>
                            <p className="text-xs text-gray-500">
                                {bookingType !== 'hotel' && flight.details?.originCity && flight.details?.destinationCity && !location.state?.searchContext &&
                                    `${flight.details.originCity} to ${flight.details.destinationCity}`
                                }
                            </p>
                        </div>

                        {bookingType !== 'hotel' && (
                            <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formatDuration(flight.details?.duration)}
                                </p>
                            </div>
                        )}

                        <div>
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="text-lg font-semibold text-green-600">
                                ₹{typeof flight.price === 'object' ? flight.price.value : flight.price || '0'}
                            </p>
                        </div>

                        {(flight.details?.departureTime || flight.details?.checkIn) && (
                            <div>
                                <p className="text-sm text-gray-500">{bookingType === 'hotel' ? 'Check-in' : 'Departure'}</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {(() => {
                                        const dateStr = flight.details?.checkIn || flight.details?.departureTime;
                                        const date = new Date(dateStr);
                                        return !isNaN(date.getTime())
                                            ? date.toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : String(dateStr); // Fallback
                                    })()}
                                </p>
                            </div>
                        )}

                        {(flight.details?.arrivalTime || flight.details?.checkOut) && (
                            <div>
                                <p className="text-sm text-gray-500">{bookingType === 'hotel' ? 'Check-out' : 'Arrival'}</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {(() => {
                                        const dateStr = flight.details?.checkOut || flight.details?.arrivalTime;
                                        const date = new Date(dateStr);
                                        return !isNaN(date.getTime())
                                            ? date.toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })
                                            : String(dateStr);
                                    })()}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <p className="text-sm text-gray-500 mb-2">Flight Information</p>
                        <div className="flex flex-wrap gap-2">
                            {flight.details?.cabinClass && (
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    Class: {flight.details.cabinClass}
                                </span>
                            )}
                            {flight.details?.baggage && (
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    Baggage: {flight.details.baggage}
                                </span>
                            )}
                            {flight.details?.aircraft && (
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    Aircraft: {flight.details.aircraft}
                                </span>
                            )}
                            {flight.details?.stops !== undefined && (
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    {flight.details.stops === 0 ? 'Non-stop' : `${flight.details.stops} stop(s)`}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Passenger Details */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <User className="h-6 w-6 mr-2 text-blue-600" />
                        Passenger Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {passenger.passenger_name}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {new Date(passenger.date_of_birth).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Nationality</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {passenger.nationality}
                            </p>
                        </div>

                        {passenger.passport_number && (
                            <div>
                                <p className="text-sm text-gray-500">Passport Number</p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {passenger.passport_number}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contact & Address */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                        <MapPin className="h-6 w-6 mr-2 text-blue-600" />
                        Contact & Address
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-sm text-gray-500 flex items-center mb-1">
                                <Mail className="h-4 w-4 mr-1" />
                                Email
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {passenger.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500 flex items-center mb-1">
                                <Phone className="h-4 w-4 mr-1" />
                                Phone
                            </p>
                            <p className="text-lg font-semibold text-gray-900">
                                {passenger.phone}
                            </p>
                        </div>

                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-500 mb-1">Address</p>
                            <p className="text-lg font-semibold text-gray-900">
                                {passenger.address}, {passenger.city}, {passenger.state} - {passenger.pincode}, {passenger.country}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Important Information */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                        Important Information
                    </h3>
                    <ul className="space-y-2 text-sm text-yellow-800">
                        {bookingType === 'train' ? (
                            <>
                                <li>• Please arrive at the station at least 30 minutes before departure</li>
                                <li>• Carry a valid government-issued photo ID (Aadhar/PAN/Voter ID)</li>
                                <li>• Verify your PNR status before travel</li>
                                <li>• E-ticket printed or on mobile is valid for travel</li>
                            </>
                        ) : bookingType === 'bus' ? (
                            <>
                                <li>• Please arrive at the boarding point 15 minutes before departure</li>
                                <li>• Carry a valid photo ID for verification</li>
                                <li>• Luggage policy varies by operator</li>
                            </>
                        ) : bookingType === 'hotel' ? (
                            <>
                                <li>• Standard Check-in time is 12:00 PM and Check-out time is 11:00 AM</li>
                                <li>• Please carry a valid government-issued photo ID for all guests</li>
                                <li>• Early check-in or late check-out is subject to availability</li>
                                <li>• Married couples may need to present proof of marriage</li>
                            </>
                        ) : (
                            <>
                                <li>• Please arrive at the airport at least 2 hours before departure</li>
                                <li>• Carry a valid government-issued photo ID</li>
                                <li>• Check baggage allowance before packing</li>
                                <li>• You can check-in online 24 hours before departure</li>
                            </>
                        )}
                        <li>• Booking confirmation has been sent to your email</li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => window.print()}
                        className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 font-semibold transition-colors flex items-center justify-center"
                    >
                        <Download className="h-5 w-5 mr-2" />
                        Download Ticket
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingConfirmation;
