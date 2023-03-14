// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Factory {
  address private _owner;

  event Deployed(address addr, uint salt);

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  modifier onlyOwner() {
    require(_owner == msg.sender, "Factory: caller is not the owner");
    _;
  }

  constructor(address owner_) {
    require(owner_ != address(0), "Factory: new owner is the zero address");
    _owner = owner_;
    emit OwnershipTransferred(address(0), _owner);
  }

  function getAddress(bytes memory bytecode,uint256 salt) public view returns (address) {
    bytes32 hash = keccak256(
      abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode))
    );

    return address(uint160(uint(hash)));
  }

  function deploy(bytes memory bytecode, uint256 salt) public payable onlyOwner {
    address addr;

    assembly {
      addr := create2(callvalue(),add(bytecode, 0x20),mload(bytecode),salt)

      if iszero(extcodesize(addr)) {
        revert(0, 0)
      }
    }

    emit Deployed(addr, salt);
  }

  function delegateCall(address target,bytes memory data) public onlyOwner returns (bytes memory) {
    (bool success, bytes memory returndata) = target.call(data);
    if (success) {
        if (returndata.length == 0) {
            require(target.code.length > 0, "Factory: call to non-contract");
        }
        return returndata;
    } else {
      if (returndata.length > 0) {
        assembly {
          let returndata_size := mload(returndata)
          revert(add(32, returndata), returndata_size)
        }
      } else {
        revert("Factory: degate call failed");
      }
    }
  }

  function transferOwnership(address newOwner) public virtual onlyOwner {
    require(newOwner != address(0), "Ownable: new owner is the zero address");
    _transferOwnership(newOwner);
  }

  function _transferOwnership(address newOwner) internal virtual {
    address oldOwner = _owner;
    _owner = newOwner;
    emit OwnershipTransferred(oldOwner, newOwner);
  }
}
