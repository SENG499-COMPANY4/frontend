import preferences from '../mock_data/sample_preferences.json'
function Popup({ preferences, onClose, firstName}) {
    return (
      <div class="fixed inset-0">
        <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50">
          <div class="bg-white w-[400px] rounded-lg shadow-lg p-4">
            <div class="flex justify-end">
              <button class="text-gray-500 hover:text-gray-700 focus:outline-none" onClick={onClose}>
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <h3 class="text-lg font-semibold mb-2">Preferences - Christina Bersh</h3>
            <p>This is the content of the pop-up.</p>
  
            {/* Display the form submission results */}
            <h4 class="text-md font-semibold mt-4">Form Submission Results:</h4>

            <pre class="text-sm mt-2">{JSON.stringify(preferences, null, 2)}</pre>
            
          </div>
        </div>
      </div>
    );
  }
  
  export default Popup;