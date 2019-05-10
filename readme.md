# redux-persist-expire

[![npm](https://badge.fury.io/js/redux-persist-expire.svg)](https://www.npmjs.com/package/redux-persist-expire)
[![](https://img.shields.io/travis/kamranahmedse/redux-persist-expire/master.svg?style=flat-square)](http://travis-ci.org/kamranahmedse/redux-persist-expire)
[![](https://img.shields.io/codecov/c/github/kamranahmedse/redux-persist-expire.svg?style=flat-square)](http://travis-ci.org/kamranahmedse/redux-persist-expire)

> Expiring transformer for [redux-persist](https://github.com/rt2zz/redux-persist) – Create expiring storage for your Redux stores

## Installation

```javascript
yarn add redux-persist-expire
```

## Usage

Create a transform using `expireReducer(reducerKey, config)` where `reducerKey` is the reducer to which expiry is to be applied and configuration can be used to configure expire behavior.

```javascript
const { persistReducer, persistStore } = require('redux-persist');

// Import the transformer creator
const expireReducer = require('redux-persist-expire');

// Create persisted reducers using redux-persist
const persistedReducers = persistReducer({
    transforms: [
       // Create a transformer by passing the reducer key and configuration. Values
       // shown below are the available configurations with default values
       expireReducer('preference', {
         // (Optional) Key to be used for the time relative to which store is to be expired
         persistedAtKey: '__persisted_at',
         // (Required) Seconds after which store will be expired
         expireSeconds: null,
         // (Optional) State to be used for resetting e.g. provide initial reducer state
         expiredState: {},
         // (Optional) Use it if you don't want to manually set the time in the reducer i.e. at `persistedAtKey` 
         // and want the store to  be automatically expired if the record is not updated in the `expireSeconds` time
         autoExpire: false
       })
       // You can add more `expireReducer` calls here for different reducers
       // that you may want to expire
    ]
  },
  rootReducer,
);

export const store = createStore(persistedReducers);
export const persist = persistStore(store);
```

## Examples

Here is the configuration for the common usecases

> Expire the item in store if it has not been updated for the past `n` seconds

```javascript
// Reset `preference` key to empty object if it has not been updated for the past hour
expireReducer('preference', {
    expireSeconds: 3600
})
```

> Reset an item to empty array after it has not been updated for the past 30 minutes

```javascript
// Reset `preference` key to given defaults if it has not been updated for the past hour
expireReducer('preference', {
    expireSeconds: 1800,
    expiredState: {
      viewType: 'list',
      token: ''
    }
})
```

> Expire the item in store after 30 minutes of loading it

```javascript
// Reset `users` key to empty array if it had been loaded 30 minutes ago
expireReducer('users', {
    persistedAtKey: 'loadedAt',
    expireSeconds: 1800,
    expiredState: []        // Reset to empty array after expiry
})

// Note that in this case, you have to manually set the `loadedAt` in
// this case e.g. your reducer might look like this
...
case USERS_LOADED:
    return {
      loadedAt: moment(),  // or use (new Date()).toJSON()
      users: payload
    };
...
```

Feel free to open an issue if you need help with some specific usecase.

## Contributions

* Report issues with problems and suggestions
* Open pull request with improvements
* Spread the word
* Reach out with any feedback [![Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/kamranahmedse.svg?style=social&label=Follow%20%40kamranahmedse)](https://twitter.com/kamranahmedse)

## License

MIT &copy; [Kamran Ahmed](https://twitter.com/kamranahmedse)

