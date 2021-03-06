pragma solidity ^0.4.17;

// ================= Ownable Contract start =============================
/*
 * Ownable
 *
 * Base contract with an owner.
 * Provides onlyOwner modifier, which prevents function from running if it is called by anyone other than the owner.
 */
contract Ownable {
  address public owner;

  function Ownable() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function transferOwnership(address newOwner) public onlyOwner {
    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }
}
// ================= Ownable Contract end ===============================

// ================= Safemath Contract start ============================
/* taking ideas from FirstBlood token */
contract SafeMath {

  function safeAdd(uint256 x, uint256 y) internal pure returns(uint256) {
    uint256 z = x + y;
    assert((z >= x) && (z >= y));
    return z;
  }

  function safeSubtract(uint256 x, uint256 y) internal pure returns(uint256) {
    assert(x >= y);
    uint256 z = x - y;
    return z;
  }

  function safeMult(uint256 x, uint256 y) internal pure returns(uint256) {
    uint256 z = x * y;
    assert((x == 0)||(z/x == y));
    return z;
  }
}
// ================= Safemath Contract end ==============================

// ================= ERC20 Token Contract start =========================
/*
 * ERC20 interface
 * see https://github.com/ethereum/EIPs/issues/20
 */
contract ERC20 {
  uint public totalSupply;
  function balanceOf(address who) public constant returns (uint);
  function allowance(address owner, address spender) public constant returns (uint);

  function transfer(address to, uint value) public returns (bool ok);
  function transferFrom(address from, address to, uint value) public returns (bool ok);
  function approve(address spender, uint value) public returns (bool ok);
  event Transfer(address indexed from, address indexed to, uint value);
  event Approval(address indexed owner, address indexed spender, uint value);
}
// ================= ERC20 Token Contract end ===========================

// ================= Standard Token Contract start ======================
contract StandardToken is ERC20, SafeMath {

  /**
  * @dev Fix for the ERC20 short address attack.
   */
  modifier onlyPayloadSize(uint size) {
    require(msg.data.length >= size + 4) ;
    _;
  }

  mapping(address => uint) balances;
  mapping (address => mapping (address => uint)) allowed;

  function transfer(address _to, uint _value) onlyPayloadSize(2 * 32)  public returns (bool success){
    balances[msg.sender] = safeSubtract(balances[msg.sender], _value);
    balances[_to] = safeAdd(balances[_to], _value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint _value) onlyPayloadSize(3 * 32) public returns (bool success) {
    var _allowance = allowed[_from][msg.sender];

    balances[_to] = safeAdd(balances[_to], _value);
    balances[_from] = safeSubtract(balances[_from], _value);
    allowed[_from][msg.sender] = safeSubtract(_allowance, _value);
    Transfer(_from, _to, _value);
    return true;
  }

  function balanceOf(address _owner) public constant returns (uint balance) {
    return balances[_owner];
  }

  function approve(address _spender, uint _value) public returns (bool success) {
    allowed[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  function allowance(address _owner, address _spender) public constant returns (uint remaining) {
    return allowed[_owner][_spender];
  }
}
// ================= Standard Token Contract end ========================

// ================= Pausable Token Contract start ======================
/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract Pausable is Ownable {
  event Pause();
  event Unpause();

  bool public paused = false;


  /**
  * @dev modifier to allow actions only when the contract IS paused
  */
  modifier whenNotPaused() {
    require (!paused);
    _;
  }

  /**
  * @dev modifier to allow actions only when the contract IS NOT paused
  */
  modifier whenPaused {
    require (paused) ;
    _;
  }

  /**
  * @dev called by the owner to pause, triggers stopped state
  */
  function pause() onlyOwner whenNotPaused public returns (bool) {
    paused = true;
    Pause();
    return true;
  }

  /**
  * @dev called by the owner to unpause, returns to normal state
  */
  function unpause() onlyOwner whenPaused public returns (bool) {
    paused = false;
    Unpause();
    return true;
  }
}
// ================= Pausable Token Contract end ========================

// ================= IcoToken  start =======================
contract IcoToken is SafeMath, StandardToken, Pausable {
  string public name;
  string public symbol;
  uint256 public decimals;
  string public version;
  address public icoContract;

  function IcoToken(
    string _name,
    string _symbol,
    uint256 _decimals,
    string _version
  ) public
  {
    name = _name;
    symbol = _symbol;
    decimals = _decimals;
    version = _version;
  }

  function transfer(address _to, uint _value) whenNotPaused public returns (bool success) {
    return super.transfer(_to,_value);
  }

  function approve(address _spender, uint _value) whenNotPaused public returns (bool success) {
    return super.approve(_spender,_value);
  }

  function balanceOf(address _owner) public constant returns (uint balance) {
    return super.balanceOf(_owner);
  }

  function setIcoContract(address _icoContract) public onlyOwner {
    if (_icoContract != address(0)) {
      icoContract = _icoContract;
    }
  }

  function sell(address _recipient, uint256 _value) whenNotPaused public returns (bool success) {
      assert(_value > 0);
      require(msg.sender == icoContract);

      balances[_recipient] += _value;
      totalSupply += _value;

      Transfer(0x0, owner, _value);
      Transfer(owner, _recipient, _value);
      return true;
  }

}

// ================= Ico Token Contract end =======================

// ================= Actual Sale Contract Start ====================
contract IcoContract is SafeMath, Pausable {
  IcoToken public ico;

  uint256 public tokenCreationCap;
  uint256 public totalSupply;

  address public ethFundDeposit;
  address public icoAddress;

  uint256 public fundingStartTime;
  uint256 public fundingEndTime;
  uint256 public minContribution;

  bool public isFinalized;
  uint256 public tokenExchangeRate;

  event LogCreateICO(address from, address to, uint256 val, uint flow);

  // Important Note: should make this function internal when launch prod
  function CreateICO(address to, uint256 val, uint flow) public returns (bool success) {
    LogCreateICO(0x0, to, val, flow);
    return ico.sell(to, val);
  }

  function IcoContract(
    address _ethFundDeposit,
    address _icoAddress,
    uint256 _tokenCreationCap,
    uint256 _tokenExchangeRate,
    uint256 _fundingStartTime,
    uint256 _fundingEndTime,
    uint256 _minContribution
  ) 
  public
  {
    ethFundDeposit = _ethFundDeposit;
    icoAddress = _icoAddress;
    tokenCreationCap = _tokenCreationCap;
    tokenExchangeRate = _tokenExchangeRate;
    fundingStartTime = _fundingStartTime;
    minContribution = _minContribution;
    fundingEndTime = _fundingEndTime;
    ico = IcoToken(icoAddress);
    isFinalized = false;
  }

  function () public payable {    
    createTokens(msg.sender, msg.value);
  }


  function returnTest(uint _number) pure public returns (uint) {
    return _number;
  }

  function depositETH() public payable returns (uint) {
    return msg.value;
  }

  // Important Note: should make this function internal when launch prod
  /// @dev Accepts ether and creates new ICO tokens.
  function createTokens(address _beneficiary, uint256 _value) public payable whenNotPaused {
    require (tokenCreationCap > totalSupply);
    require (now >= fundingStartTime);
    require (now <= fundingEndTime);
    require (_value >= minContribution);
    require (!isFinalized);

    uint256 tokens = safeMult(_value, tokenExchangeRate);
    uint256 checkedSupply = safeAdd(totalSupply, tokens);

    if (tokenCreationCap < checkedSupply) {        
      uint256 tokensToAllocate = safeSubtract(tokenCreationCap, totalSupply);
      uint256 tokensToRefund = safeSubtract(tokens, tokensToAllocate);
      totalSupply = tokenCreationCap;
      uint256 etherToRefund = tokensToRefund / tokenExchangeRate;

      require(CreateICO(_beneficiary, tokensToAllocate, 1));
      msg.sender.transfer(etherToRefund);
      ethFundDeposit.transfer(this.balance);
      return;
    }

    totalSupply = checkedSupply;

    require(CreateICO(_beneficiary, tokens, 2)); 
    ethFundDeposit.transfer(this.balance);
  }

  /// @dev Ends the funding period and sends the ETH home
  function finalize() external onlyOwner {
    require (!isFinalized);
    // move to operational
    isFinalized = true;
    ethFundDeposit.transfer(this.balance);
  }



  struct User {
    uint userId;
    string name;
    uint tokenBalance;
    bool isWithdraw;
  }

  mapping(address => User) IcoUsers;

  event AddToken(address userAddress, uint amount);
  event WithDraw(uint sourceUserId, address addressBeneficiary);

  function getTokenBalance(address userAddress) view public returns (uint) {
    return ico.balanceOf(userAddress);
  }

  function addTokenToUser(address userAddress, uint amount) public {
    AddToken(userAddress, amount);
    ico.sell(userAddress, amount);
  }

  // function withdrawToken(uint sourceUserId, address destinationAddress) public returns (bool) {
  //   uint tokensToAllocate = IcoUsers[sourceUserId].tokenBalance;
  //   require(CreateICO(destinationAddress, tokensToAllocate, 0));
  //   // set to 0 after withdraw
  //   IcoUsers[sourceUserId].tokenBalance = 0;
  //   WithDraw(sourceUserId,  destinationAddress);
  //   return true;
  // }
}