// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library StorageSlot {
  struct AddressSlot {
    address value;
  }

  struct BooleanSlot {
    bool value;
  }

  function getAddressSlot(bytes32 slot) internal pure returns (AddressSlot storage r) {
    assembly {
      r.slot := slot
    }
  }

  function getBooleanSlot(bytes32 slot) internal pure returns (BooleanSlot storage r) {
    assembly {
      r.slot := slot
    }
  }
}

interface IBeacon {
  function implementation() external view returns (address);
}

contract Proxy {
  address private _owner;

  bool private _initialized;

  bool private _initializing;

  bool private _configured;

  bool private _configuring;

  bytes32 private constant _ROLLBACK_SLOT = 0x4910fdfa16fed3260ed0e7147f7cc6da11a60208b5b9406d12a635614ffd9143;

  bytes32 internal constant _IMPLEMENTATION_SLOT = 0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

  bytes32 internal constant _ADMIN_SLOT = 0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103;

  bytes32 internal constant _BEACON_SLOT = 0xa3f0ad74e5423aebfd80d3ef4346578335a9a72aeaee59ff6cb3582b35133d50;

  event Upgraded(address indexed implementation);

  event BeaconUpgraded(address indexed beacon);

  event AdminChanged(address previousAdmin, address newAdmin);

  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  modifier onlyOwner() {
    require(_owner == msg.sender, "Ownable: caller is not the owner");
    _;
  }

  modifier initializer() {
    require(_initializing || !_initialized, "Contract instance has already been initialized");

    bool isTopLevelCall = !_initializing;
    if (isTopLevelCall) {
      _initializing = true;
      _initialized = true;
    }

    _;

    if (isTopLevelCall) {
      _initializing = false;
    }
  }

  modifier configurer() {
    require(_configuring || !_configured, "Contract instance has already been initialized");

    bool isTopLevelCall = !_configuring;
    if (isTopLevelCall) {
      _configuring = true;
      _configured = true;
    }

    _;

    if (isTopLevelCall) {
      _configuring = false;
    }
  }

  constructor(address owner_) {
    require(owner_ != address(0), "Ownable: new owner is the zero address");
    _owner = owner_;
    emit OwnershipTransferred(address(0), _owner);
  }

  function initialize(address owner_) public virtual onlyOwner initializer {
    transferOwnership(owner_);
  }

  function configure(address addr,bytes memory data) public virtual onlyOwner configurer {
    assert(_IMPLEMENTATION_SLOT == bytes32(uint256(keccak256("eip1967.proxy.implementation")) - 1));
    assert(_BEACON_SLOT == bytes32(uint256(keccak256('eip1967.proxy.beacon')) - 1));
    assert(_ADMIN_SLOT == bytes32(uint256(keccak256('eip1967.proxy.admin')) - 1));
    assert(_ROLLBACK_SLOT == bytes32(uint256(keccak256('eip1967.proxy.rollback')) - 1));

    _setAdmin(msg.sender);
    _upgradeToAndCall(addr,data,false);
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

  function _getImplementation() private view returns (address) {
    return StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value;
  }

  function _setImplementation(address _implementation) private {
    require(_implementation.code.length > 0, "implementation is not contract");
    StorageSlot.getAddressSlot(_IMPLEMENTATION_SLOT).value = _implementation;
  }

  function _upgradeTo(address newImplementation) internal {
    _setImplementation(newImplementation);
    emit Upgraded(newImplementation);
  }

  function _upgradeToAndCall(address newImplementation, bytes memory data, bool forceCall) internal {
    _upgradeTo(newImplementation);
    if (data.length > 0 || forceCall) {
      _functionDelegateCall(newImplementation, data);
    }
  }

  function _upgradeToAndCallSecure(address newImplementation,bytes memory data,bool forceCall) internal {
    address oldImplementation = _getImplementation();

    _setImplementation(newImplementation);

    if (data.length > 0 || forceCall) {
      _functionDelegateCall(newImplementation, data);
    }

    // Perform rollback test if not already in progress
    StorageSlot.BooleanSlot storage rollbackTesting = StorageSlot.getBooleanSlot(_ROLLBACK_SLOT);
    if (!rollbackTesting.value) {
      // Trigger rollback using upgradeTo from the new implementation
      rollbackTesting.value = true;
      _functionDelegateCall(newImplementation,abi.encodeWithSignature("upgradeTo(address)", oldImplementation));
      rollbackTesting.value = false;
      // Check rollback was effective
      require(oldImplementation == _getImplementation(), "ERC1967Upgrade: upgrade breaks further upgrades");
      // Finally reset to the new implementation and log the upgrade
      _upgradeTo(newImplementation);
    }
  }

  function _functionDelegateCall(address target, bytes memory data) internal returns (bytes memory) {
    return _functionDelegateCall(target, data, "Address: low-level delegate call failed");
  }

  function _functionDelegateCall(address target, bytes memory data, string memory errorMessage) internal returns (bytes memory) {
    (bool success, bytes memory returndata) = target.delegatecall(data);
    return _verifyCallResultFromTarget(target, success, returndata, errorMessage);
  }

  function _verifyCallResultFromTarget(address target,bool success,bytes memory returndata,string memory errorMessage) internal view returns (bytes memory) {
    if (success) {
      if (returndata.length == 0) {
        // only check isContract if the call was successful and the return data is empty
        // otherwise we already know that it was a contract
        require(target.code.length > 0, "Address: call to non-contract");
      }
      return returndata;
    } else {
      _revert(returndata, errorMessage);
    }
  }

  function _revert(bytes memory returndata, string memory errorMessage) private pure {
    // Look for revert reason and bubble it up if present
    if (returndata.length > 0) {
      // The easiest way to bubble the revert reason is using memory via assembly
      /// @solidity memory-safe-assembly
      assembly {
        let returndata_size := mload(returndata)
        revert(add(32, returndata), returndata_size)
      }
    } else {
      revert(errorMessage);
    }
  }

  function _getBeacon() internal view returns (address) {
    return StorageSlot.getAddressSlot(_BEACON_SLOT).value;
  }

  function _setBeacon(address newBeacon) private {
    require(newBeacon.code.length > 0, "ERC1967: new beacon is not a contract");
    require(
      IBeacon(newBeacon).implementation().code.length > 0,
      "ERC1967: beacon implementation is not a contract"
    );
    StorageSlot.getAddressSlot(_BEACON_SLOT).value = newBeacon;
  }

  function _upgradeBeaconTo(address newBeacon) internal {
    _setBeacon(newBeacon);
    emit BeaconUpgraded(newBeacon);
  }

  function _getAdmin() internal view returns (address) {
    return StorageSlot.getAddressSlot(_ADMIN_SLOT).value;
  }

  function _setAdmin(address newAdmin) private {
    require(newAdmin != address(0), "ERC1967: new admin is the zero address");
    StorageSlot.getAddressSlot(_ADMIN_SLOT).value = newAdmin;
  }

  function _changeAdmin(address newAdmin) internal {
    _setAdmin(newAdmin);
    emit AdminChanged(_getAdmin(), newAdmin);
  }

  function _delegate(address _implementation) internal virtual {
    assembly {
      calldatacopy(0, 0, calldatasize())
      let result := delegatecall(gas(), _implementation, 0, calldatasize(), 0, 0)
      returndatacopy(0, 0, returndatasize())

      switch result
      case 0 {
        revert(0, returndatasize())
      }
      default {
        return(0, returndatasize())
      }
    }
  }

  function _fallback() private {
    _delegate(_getImplementation());
  }

  fallback() external payable {
    _fallback();
  }

  receive() external payable {
    _fallback();
  }
}
