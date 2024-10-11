import React, { useState } from 'react';

const activities = [
  "Walking or Light Outdoor Activity",
  "Running or Outdoor Exercise",
  "Cycling",
  "Office Work or Indoor Activities",
  "Attending an Outdoor Event",
  "Shopping or Errands",
  "Hiking"
];

const UserInfoForm = ({ onSubmit, initialValues }) => {
  const [activity, setActivity] = useState(initialValues.activity || '');
  const [outdoorsTime, setOutdoorsTime] = useState(initialValues.outdoorsTime || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ activity, outdoorsTime });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-6 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Activity Information</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="activity">
          Activity
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          required
        >
          <option value="">Select activity</option>
          {activities.map((act, index) => (
            <option key={index} value={act}>{act}</option>
          ))}
        </select>
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="outdoorsTime">
          Time Outdoors (hours)
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="outdoorsTime"
          type="number"
          placeholder="Enter time outdoors in hours"
          value={outdoorsTime}
          onChange={(e) => setOutdoorsTime(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Get Recommendation
        </button>
      </div>
    </form>
  );
};

export default UserInfoForm;