const natural = require('natural');

const classifier = new natural.BayesClassifier();

// Cardiology Training Data
classifier.addDocument('chest pain heart attack palpitations tachycardia racing heart', 'Cardiology');
classifier.addDocument('high blood pressure hypertension breathlessness squeezing chest', 'Cardiology');

// Neurology Training Data
classifier.addDocument('migraine severe headache blurred vision dizziness stroke seizure', 'Neurology');
classifier.addDocument('numbness fainting concussions face drooping paralysis', 'Neurology');

// Orthopedics Training Data
classifier.addDocument('broken bone fracture dislocated shoulder spine pain torn ligament', 'Orthopedics');
classifier.addDocument('joint crack severe ankle sprain unable to walk', 'Orthopedics');

// Dermatology Training Data
classifier.addDocument('severe skin rash burns peeling skin severe allergic reaction hives', 'Dermatology');

// Pediatrics Training Data
classifier.addDocument('child baby newborn infant high fever crying baby not feeding', 'Pediatrics');
classifier.addDocument('child seizure child breathing difficulty blue lips baby', 'Pediatrics');

// General Medicine Training Data
classifier.addDocument('flu severe fever cough weakness chills vomiting poisoning', 'General Medicine');
classifier.addDocument('unconscious stomach pain diarrhea bleeding general weakness', 'General Medicine');

// Train the classifier in-memory
classifier.train();

/**
 * Predicts the required active specialist department given a string of symptoms.
 * @param {string} text - The input symptoms/disease description
 * @returns {string} The predicted department string
 */
function predictDepartment(text) {
  if (!text || typeof text !== 'string') return 'General Medicine';
  
  const predicted = classifier.classify(text);
  return predicted;
}

module.exports = {
  predictDepartment,
  classifier // Export for raw probability metrics if needed
};
