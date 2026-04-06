const calculateWaitTime = require('../utils/calculateWait');

describe('Wait Time Algorithm Constraints (Unit Test)', () => {
  it('Should return 0 wait time if the patient is suffering an emergency', () => {
    const isEmergency = true;
    const currentQueueLength = 10;
    
    // Act
    const waitTime = calculateWaitTime(isEmergency, currentQueueLength);
    
    // Assert
    expect(waitTime).toBe(0);
  });

  it('Should accurately estimate time based on standard queue length (15 min standard mapping)', () => {
    const isEmergency = false;
    const currentQueueLength = 4;
    
    // Act
    const waitTime = calculateWaitTime(isEmergency, currentQueueLength);
    
    // Assert (4 patients * 15 minutes each = 60 minutes)
    expect(waitTime).toBe(60);
  });
});
