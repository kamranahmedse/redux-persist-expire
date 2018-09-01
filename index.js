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

  // If given data has the persisted time and configuration
  // requires the refresher on updates to store, reset the persisted time
  if (inboundState[config.persistedAtKey] && config.refreshOnUpdate) {
    inboundState = {
      ...inboundState,
      [config.persistedAtKey]: moment()
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

  // If state has the persisted date, then check for the possible expiry
  if (outboundState[config.persistedAtKey]) {
    const startTime = moment(outboundState[config.persistedAtKey]);
    const endTime = moment();

    const duration = moment.duration(endTime.diff(startTime));
    const seconds = duration.asSeconds();

    // If the state is older than the set expiry time,
    // reset it to initial state
    if (seconds > config.expireSeconds) {
      return {
        ...config.expiredState
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
    persistedAtKey: '__persisted_at',
    // Seconds after which store will be expired
    expireSeconds: null,
    // State to be used for resetting e.g. provide initial reducer state
    expiredState: {},
    // Resets the __persisted_at time to current time on
    // any updates to the reducer
    refreshOnUpdate: false,
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
