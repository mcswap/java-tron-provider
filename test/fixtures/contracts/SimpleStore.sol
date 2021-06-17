pragma solidity ^0.5.16;
contract SimpleStore {
  constructor(uint _immutableValue, uint _value) public {
    immutableValue = _immutableValue;
    value = _value;
  }

  function set(uint _value) public {
    value = _value;
  }

  function get() public view returns (uint) {
    return value;
  }

  uint immutableValue;
  uint value;
}

