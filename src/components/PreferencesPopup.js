import React, { useState } from 'react';
import preferencesData from '../mock_data/sample_preferences.json'

const AdminInbox = () => {
    const [preferences, setPreferences] = useState(preferencesData.preferences);

    // This function will remove the preference with a given index
    const removePreference = (indexToRemove) => {
        setPreferences(preferences.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="container mx-auto">
            {preferences.map((preference, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700 p-4 relative">
                    <button className="absolute top-0 right-0 p-2" onClick={() => removePreference(index)}>X</button>
                    <h2 className="text-2xl font-bold mb-2">{preference.name}</h2>
                    <div>
                        <strong>Courses:</strong> {preference.courses.join(', ')}
                    </div>
                    <div>
                        <strong>Start Time:</strong> {preference.startTime}
                    </div>
                    <div>
                        <strong>End Time:</strong> {preference.endTime}
                    </div>
                    <div>
                        <strong>Class Schedule:</strong> {preference.classSchedule.join(', ')}
                    </div>
                    <div>
                        <strong>Class Size:</strong> {preference.classSize}
                    </div>
                    <div>
                        <strong>Technical Requirements:</strong> {preference.technicalRequirements.join(', ')}
                    </div>
                    <div>
                        <strong>Other:</strong> {preference.other}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminInbox;
