const AgentDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Bookings</h3>
          <p className="text-3xl font-bold mt-2 text-blue-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Clients</h3>
          <p className="text-3xl font-bold mt-2 text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-3xl font-bold mt-2 text-purple-600">$0</p>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
