const assert = require('chai').assert;

function test(){
  return 'hello1';
}

describe('App', function(){
  it('app should return hello', function(){
    assert.equal(test(), 'hello');
  });
});
