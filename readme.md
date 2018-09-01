# redux-persist-expire
> Create expiring storage for your Redux stores

## Install

```javascript
yarn add redux-persist-expire
```

## Usage

Create a transform using `expireReducer(reducerKey, config)` method where `reducerKey` is the key used by the reducer and configuration options are listed below 

```javascript
const persistedReducers = persistReducer(
  {
    transforms: [
      expireReducer('preference', {
        persistedAtKey: 'createdAt',
        expireSeconds: 20,
      })
    ]
  },
  rootReducer,
);
```
Configuration options

```javascript
const config = {
  // Key to be used for the time relative to which store is to be expired
  persistedAtKey: '__persisted_at',
  // Seconds after which store will be expired
  expireSeconds: null,
  // State to be used for resetting e.g. provide initial reducer state
  expiredState: {},
  // Use it if you don't want to manually set the time and want the store to
  // be automatically expired if the record is not updated in the `expireSeconds` time
  autoExpire: false
};
```
