const CLAIM_STATUS = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Paid'
};

const EVENT_TYPES = [
  'FLIGHT_DELAY',
  'WEATHER',
  'EARTHQUAKE',
  'CROP_FAILURE',
  'HURRICANE'
];

module.exports = {
  CLAIM_STATUS,
  EVENT_TYPES
};