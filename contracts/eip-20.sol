// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EIP20 {
  struct airdrop {
    address airdropAddress;
    uint256 airdropAmount;
  }

  address private _owner;

  string private _name;

  string private _symbol;

  uint256 private _totalSupply;

  bool private _initialized;

  bool private _initializing;

  bool private _configured;

  bool private _configuring;

  mapping(address => uint256) private _balances;

  mapping(address => mapping(address => uint256)) private _allowances;

  event Transfer(address indexed from,address indexed to,uint256 value);

  event Approval(address indexed owner,address indexed spender,uint256 value);

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

  function configure(string memory name_,string memory symbol_,airdrop[] memory airdrop_) public virtual onlyOwner configurer {
    _name = name_;
    _symbol = symbol_;

    for (uint i = 0; i < airdrop_.length; i++) {
      _mint(airdrop_[i].airdropAddress,airdrop_[i].airdropAmount);
    }
  }

  function name() public view virtual returns (string memory) {
    return _name;
  }

  function symbol() public view virtual returns (string memory) {
    return _symbol;
  }

  function decimals() public view virtual returns (uint8) {
    return 18;
  }

  function totalSupply() public view virtual returns (uint256) {
    return _totalSupply;
  }

  function balanceOf(address account) public view virtual returns (uint256) {
    return _balances[account];
  }

  function transfer(address to, uint256 amount) public virtual returns (bool) {
    address owner = msg.sender;
    _transfer(owner, to, amount);
    return true;
  }

  function allowance(address owner, address spender) public view virtual returns (uint256) {
    return _allowances[owner][spender];
  }

  function approve(address spender, uint256 amount) public virtual returns (bool) {
    address owner = msg.sender;
    _approve(owner, spender, amount);
    return true;
  }

  function transferFrom(address from,address to,uint256 amount) public virtual returns (bool) {
    address spender = msg.sender;
    _spendAllowance(from, spender, amount);
    _transfer(from, to, amount);
    return true;
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

  function _mint(address account, uint256 amount) internal virtual {
    require(account != address(0), "ERC20: mint to the zero address");

    _totalSupply += amount;
    unchecked {
      // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
      _balances[account] += amount;
    }

    emit Transfer(address(0), account, amount);
  }

  function _burn(address account, uint256 amount) internal virtual {
    require(account != address(0), "ERC20: burn from the zero address");

    uint256 accountBalance = _balances[account];
    require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
    unchecked {
      _balances[account] = accountBalance - amount;
      // Overflow not possible: amount <= accountBalance <= totalSupply.
      _totalSupply -= amount;
    }

    emit Transfer(account, address(0), amount);
  }

  function _transfer(address from,address to,uint256 amount) internal virtual {
    require(from != address(0), "ERC20: transfer from the zero address");
    require(to != address(0), "ERC20: transfer to the zero address");

    uint256 fromBalance = _balances[from];
    require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
    unchecked {
      _balances[from] = fromBalance - amount;
      // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
      // decrementing then incrementing.
      _balances[to] += amount;
    }

    emit Transfer(from, to, amount);
  }

  function _approve(address owner,address spender,uint256 amount) internal virtual {
    require(owner != address(0), "ERC20: approve from the zero address");
    require(spender != address(0), "ERC20: approve to the zero address");

    _allowances[owner][spender] = amount;
    emit Approval(owner, spender, amount);
  }

  function _spendAllowance(address owner,address spender,uint256 amount) internal virtual {
    uint256 currentAllowance = allowance(owner, spender);
    if (currentAllowance != type(uint256).max) {
      require(currentAllowance >= amount, "ERC20: insufficient allowance");
      unchecked {
        _approve(owner, spender, currentAllowance - amount);
      }
    }
  }
}
