const assert = require('assert');
const moment = require('moment');
const expireReducer = require('../index');

describe('redux-persist-expire', function () {
  it('does not change state when no configuration given', function (done) {
    const state = { username: 'redux', id: 1 };
    const reducerKey = 'someReducer';

    const transform = expireReducer(reducerKey);

    const inboundOutputState = transform.in(state, reducerKey);
    assert.equal(inboundOutputState, state, 'Input state should not be affected');

    const outboundOutputState = transform.out(state, reducerKey);
    assert.equal(outboundOutputState, state, 'Output state should not be affected');

    done();
  });

  it('can set the persisted date on the default key if autoExpire', function (done) {
    const state = { username: 'redux', id: 1 };
    const reducerKey = 'someReducer';

    const transform = expireReducer(reducerKey, { autoExpire: true });
    const inboundDate = moment().valueOf();
    const inboundOutputState = transform.in(state, reducerKey);
    const persistedDate = inboundOutputState.__persisted_at;

    // Check if it has the same keys and the __persisted_at key
    // Check if the __persisted_at has the correct current value
    assert.deepEqual(Object.keys(inboundOutputState), ['username', 'id', '__persisted_at']);
    assert.equal(inboundOutputState.username, 'redux');
    assert.equal(inboundOutputState.id, 1);
    assert.equal(true, persistedDate <= (inboundDate + 10));
    done();
  });

  it('can set the persisted date on the given key if autoExpire', function (done) {
    const state = { username: 'redux', id: 1 };
    const reducerKey = 'someReducer';

    const transform = expireReducer(reducerKey, { autoExpire: true, persistedAtKey: 'updatedAt' });
    const inboundDate = moment().valueOf();
    const inboundOutputState = transform.in(state, reducerKey);
    const persistedDate = inboundOutputState.updatedAt.valueOf();

    // Check if it has the same keys and the updatedAt key
    // Check if the updatedAt has the correct current value
    assert.deepEqual(Object.keys(inboundOutputState), ['username', 'id', 'updatedAt']);
    assert.equal(inboundOutputState.username, 'redux');
    assert.equal(inboundOutputState.id, 1);
    assert.equal(true, persistedDate <= (inboundDate + 10));

    done();
  });

  it('autoExpire – does not override the persisted date if date already present', function (done) {
    const reducerKey = 'someReducer';

    const transform = expireReducer(reducerKey, { autoExpire: true, persistedAtKey: 'updatedAt' });
    const inboundDate = moment().valueOf();
    const inboundOutputState = transform.in({ username: 'redux3', id: 13 }, reducerKey);
    const persistedDate = inboundOutputState.updatedAt.valueOf();

    // Check if it has the same keys and the updatedAt key
    // Check if the updatedAt has the correct current value
    assert.deepEqual(Object.keys(inboundOutputState), ['username', 'id', 'updatedAt']);
    assert.equal(inboundOutputState.username, 'redux3');
    assert.equal(inboundOutputState.id, 13);
    assert.equal(true, persistedDate <= (inboundDate + 10));

    // Update the state and date value should still be same
    const inboundOutputState2 = transform.in({ username: 'redux35', id: 133 }, reducerKey);
    const persistedDate2 = inboundOutputState2.updatedAt.valueOf();

    assert.deepEqual(Object.keys(inboundOutputState2), ['username', 'id', 'updatedAt']);
    assert.equal(inboundOutputState2.username, 'redux35');
    assert.equal(inboundOutputState2.id, 133);
    assert.equal(persistedDate2, persistedDate);

    done();
  });

  it('can expire the state after expireSeconds have passed', function (done) {
    // Use the old date so that it gets reset
    const state = { username: 'redux', id: 1, updatedAt: moment().subtract(1, 'seconds') };
    const reducerKey = 'someReducer';

    const transform = expireReducer(reducerKey, { persistedAtKey: 'updatedAt', expireSeconds: 5 });

    const inboundOutputState = transform.in(state, reducerKey);
    assert.deepEqual(inboundOutputState, state, '`in/persisting` does not affect the state');

    const outboundOutputState1 = transform.out(state, reducerKey);
    assert.deepEqual(outboundOutputState1, state, '`out` does not reset the state before time has passed');

    state.updatedAt = moment().subtract(10, 'seconds');

    const outboundOutputState2 = transform.out(state, reducerKey);
    assert.deepEqual(outboundOutputState2, {}, '`out` resets the state after time has passed');

    done();
  });

  it('can expire the state to given state after expireSeconds have passed', function (done) {
    // Use the old date so that it gets reset
    const state = {
      username: 'redux',
      id: 1,
      updatedAt: moment().subtract(1, 'seconds')
    };

    const reducerKey = 'someReducer';
    const transform = expireReducer(reducerKey, {
      persistedAtKey: 'updatedAt',
      expireSeconds: 50,
      expiredState: {
        username: 'initial'
      }
    });

    const inboundOutputState = transform.in(state, reducerKey);
    assert.deepEqual(inboundOutputState, state, '`in/persisting` does not affect the state');

    const outboundOutputState1 = transform.out(state, reducerKey);
    assert.deepEqual(outboundOutputState1, state, '`out` does not reset the state before time has passed');

    state.updatedAt = moment().subtract(1, 'minute');

    const outboundOutputState2 = transform.out(state, reducerKey);
    assert.deepEqual(outboundOutputState2, { username: 'initial' }, '`out` resets the state after time has passed');

    done();
  });
});
