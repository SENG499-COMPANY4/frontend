import React from 'react';
import preferencesData from '../mock_data/sample_preferences.json'

const AdminInbox = () => {
    const { preferences } = preferencesData;

    return (
        <div className="container mx-auto">
            {preferences.map((preference, index) => (
                <div key={index} className="p-4 m-4 border border-gray-300 rounded">
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
