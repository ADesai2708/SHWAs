const calculateWaitTime = (isEmergency, currentQueueLength) => {
  if (isEmergency) return 0;
  // simple algorithm: 15 mins per patient in front
  return currentQueueLength * 15;
};

module.exports = calculateWaitTime;