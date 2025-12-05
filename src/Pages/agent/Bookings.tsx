const AgentBookings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
      <div className="mt-6 bg-white rounded-lg shadow">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">All Bookings</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Booking ID</th>
                <th className="text-left py-2">Client</th>
                <th className="text-left py-2">Destination</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  No bookings found
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentBookings;
