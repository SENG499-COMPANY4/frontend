import React, { useState } from 'react';

const PreferencesPopup = ({ onClose, preferences, selectedPreferenceIndex, allPreferences, setAllPreferences }) => {
  const [preferenceState, setPreferenceState] = useState(preferences);

  // This function will remove the preference with a given index
  const removePreference = (indexToRemove) => {
    const updatedPreferences = preferenceState.filter((_, index) => index !== indexToRemove);
    setPreferenceState(updatedPreferences);
      onClose();
      setAllPreferences(false);
      onClose();
  };

  return (
    <div className="container mx-auto">
      {allPreferences ? (
        preferenceState.map((preference, index) => (
          <div
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700 p-4 relative"
            key={index}>
            {index === 0 && (
                <button
                    className="absolute top-0 right-0 p-2"
                    onClick={() => removePreference(index)}>X
                </button>
              )}
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
              <strong>Technical Requirements:</strong>{' '}
              {preference.technicalRequirements.join(', ')}
            </div>
            <div>
              <strong>Other:</strong> {preference.other}
            </div>
          </div>
        ))
      ) : (
        <div
          className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700 p-4 relative"
          key={selectedPreferenceIndex}
        >
          <button
            className="absolute top-0 right-0 p-2"
            onClick={() => removePreference(selectedPreferenceIndex)}
          >
            X
          </button>
          <h2 className="text-2xl font-bold mb-2">{preferenceState[selectedPreferenceIndex].name}</h2>
          <div>
            <strong>Courses:</strong> {preferenceState[selectedPreferenceIndex].courses.join(', ')}
          </div>
          <div>
            <strong>Start Time:</strong> {preferenceState[selectedPreferenceIndex].startTime}
          </div>
          <div>
            <strong>End Time:</strong> {preferenceState[selectedPreferenceIndex].endTime}
          </div>
          <div>
            <strong>Class Schedule:</strong>{' '}
            {preferenceState[selectedPreferenceIndex].classSchedule.join(', ')}
          </div>
          <div>
            <strong>Class Size:</strong> {preferenceState[selectedPreferenceIndex].classSize}
          </div>
          <div>
            <strong>Technical Requirements:</strong>{' '}
            {preferenceState[selectedPreferenceIndex].technicalRequirements.join(', ')}
          </div>
          <div>
            <strong>Other:</strong> {preferenceState[selectedPreferenceIndex].other}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreferencesPopup;
