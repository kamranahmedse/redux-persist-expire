# redux-persist-expire

[![npm](https://img.shields.io/npm/v/@kamranahmedse/redux-persist-expire.svg?style=flat-square)](https://www.npmjs.com/package/redux-persist-expire)
[![](https://img.shields.io/travis/kamranahmedse/redux-persist-expire/master.svg?style=flat-square)](http://travis-ci.org/kamranahmedse/redux-persist-expire)
[![](https://img.shields.io/codecov/c/github/kamranahmedse/redux-persist-expire.svg?style=flat-square)](http://travis-ci.org/kamranahmedse/redux-persist-expire)
[![](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](http://github.com/kamranahmedse/redux-persist-expire)

> Create expiring storage for your Redux stores

## Installation

```javascript
yarn add redux-persist-expire
```

## Usage

Create a transform using `expireReducer(reducerKey, config)` method where `reducerKey` is the key used by the reducer and configuration options are listed below 

```javascript
const expireReducer = require('redux-persist-expire');


const persistedReducers = persistReducer({
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
