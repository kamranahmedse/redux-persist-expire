# redux-persist-expire

[![npm](https://badge.fury.io/js/redux-persist-expire.svg)](https://www.npmjs.com/package/redux-persist-expire)
[![](https://img.shields.io/travis/kamranahmedse/redux-persist-expire/master.svg?style=flat-square)](http://travis-ci.org/kamranahmedse/redux-persist-expire)
[![](https://img.shields.io/codecov/c/github/kamranahmedse/redux-persist-expire.svg?style=flat-square)](http://travis-ci.org/kamranahmedse/redux-persist-expire)

> Create expiring storage for your Redux stores

## Installation

```javascript
yarn add redux-persist-expire
```

## Usage

Create a transform using `expireReducer(reducerKey, config)` where `reducerKey` is the reducer to which expiry is to be applied and configuration can be used to configure expire behavior.

```diff
const { persistReducer, persistStore } = require('redux-persist');
+ const expireReducer = require('redux-persist-expire');

const persistedReducers = persistReducer({
    transforms: [
+      expireReducer('preference', {
+        // (Optional) Key to be used for the time relative to which store is to be expired
+ .      persistedAtKey: '__persisted_at',
+        // (Required) Seconds after which store will be expired
+        expireSeconds: null,
+        // (Optional) State to be used for resetting e.g. provide initial reducer state
+ .      expiredState: {},
+        // (Optional) Use it if you don't want to manually set the time and want the store to
+        // be automatically expired if the record is not updated in the `expireSeconds` time
+        autoExpire: false
+      })
    ]
  },
  rootReducer,
);

export const store = createStore(persistedReducers);
export const persist = persistStore(store);
```

## Sample Configurations
Here is the configuration for the common usecases

> Expire if item in store has not been updated for the past `n` seconds

```javascript
// Set `preference` key to empty object if it has not been updated for the past hour
expireReducer('preference', {
    expireSeconds: 3600
})
```

