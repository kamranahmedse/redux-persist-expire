declare module "redux-persist-expire" {
  /**
   * Creates transform object with the given expiry configuration
   * @param reducerKey
   * @param config @default {}
   * @return {Transform<{}, any>}
   */
  export default function expireReducer(
    reducerKey: string,
    config: ExpireReducerConfig
  );

  export interface ExpireReducerConfig {
    /** Key to be used for the time relative to which store is to be expired */
    persistedAtKey?: string;
    /** Seconds after which store will be expired */
    expireSeconds?: number | null;
    /** State to be used for resetting e.g. provide initial reducer state */
    expiredState?: any;
    /**
     * Use it if you don't want to manually set the time and want the store to
     * be automatically expired if the record is not updated in the `expireSeconds` time
     */
    autoExpire?: boolean;
  }
}
