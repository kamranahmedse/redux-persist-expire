import { createTransform } from 'redux-persist';
import moment from 'moment';

/**
 * Transforms state on its way to being serialized and persisted
 * @param inboundState
 * @param config
 * @return {*}
 */
const transformPersistence = (inboundState, config) => {
  inboundState = inboundState || {};

  // If given data does not have persistence configuration before
  if (!inboundState[config.createdAtKey]) {
    inboundState = {
      ...inboundState,
      [config.createdAtKey]: moment()
    };
  }

  return inboundState;
};

/**
 * Transform state being rehydrated
 * @param outboundState
 * @param config
 * @return {*}
 */
const transformRehydrate = (outboundState, config) => {
  outboundState = outboundState || {};

  // If state has the created date, then check for the possible expiry
  if (outboundState[config.createdAtKey]) {
    const startTime = moment(outboundState[config.createdAtKey]);
    const endTime = moment();

    const duration = moment.duration(endTime.diff(startTime));
    const seconds = duration.asSeconds();

    // If the state is older than the set expiry time,
    // reset it to initial state
    if (seconds > config.seconds) {
      return {
        ...config.state
      };
    }
  }

  return outboundState;
};

/**
 * Creates transform object with the given expiry configuration
 * @param reducerKey
 * @param config
 * @return {Transform<{}, any>}
 */
function expireReducer(reducerKey, config = {}) {
  config = {
    // Key to be used for the time relative to which store is to be expired
    createdAtKey: '__persisted_at',
    // Seconds after which store will be expired
    seconds: null,
    // State to be used for resetting e.g. provide initial reducer state
    state: {},
    ...config
  };

  return createTransform(
    // transform state on its way to being serialized and persisted.
    (inboundState) => transformPersistence(inboundState, config),
    // transform state being rehydrated
    (outboundState) => transformRehydrate(outboundState, config),
    // define which reducers this transform gets called for.
    {
      whitelist: [reducerKey]
    }
  );
}

export default expireReducer;
