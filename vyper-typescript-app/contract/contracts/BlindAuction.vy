# @version ^0.3.1

struct Bid:
	blindedBid: bytes32
	deposit: uint256
MAX_BIDS: constant(int128) = 128
event AuctionEnded:
	highestBidder: address
	highestBid: uint256
beneficiary: public(address)
biddingEnd: public(uint256)
revealEnd: public(uint256)
ended: public(bool)
highestBid: public(uint256)
highestBidder: public(address)
bids: HashMap[address, Bid[128]]
bidCounts: HashMap[address, int128]
pendingReturns: HashMap[address, uint256]

@external
def __init(_beneficiary: address, _biddingTime: uint256, _revealTime: uint256):
	self.beneficiary = _beneficiary
	self.biddingEnd = block.timestamp + _biddingTime
	self.revealEnd = self.biddingEnd + _revealTime

@external
@payable
def bid(_blindedBid: bytes32):
	assert block.timestamp < self.biddingEnd
	numBids: int128 = self.bidCounts[msg.sender]
	assert numBids < MAX_BIDS
	self.bids[msg.sender][numBids] = Bid({
		blindedBid: _blindedBid,
		deposit: msg.value
	})
	self.bidCounts[msg.sender] += 1

@internal
def placeBid(bidder: address, _value: uint256) -> bool: 
	if (_value <= self.highestBid):
		return False
	
	if ( self.highestBidder != ZERO_ADDRESS):
		self.pendingReturns[self.highestBidder] += self.highestBid
	
	self.highestBid = _value
	self.highestBidder = bidder

	return True

@external
def reveal(_numBids: int128, _values: uint256[128], _fakes: bool[128], _secrets: bytes32[128]):
	assert block.timestamp > self.biddingEnd
	assert block.timestamp < self.revealEnd
	assert _numBids == self.bidCounts[msg.sender]

	refund: uint256 = 0
	for i in range(MAX_BIDS):
		# test this line to make sure it doesn't break on the last bid
		if (i >= _numBids):
			break

		# Get a bid to check - check against encoded values
		bidToCheck: Bid = (self.bids[msg.sender])[i]
		value: uint256 = _values[i]
		fake: bool = _fakes[i]
		secret: bytes32 = _secrets[i]
		blindedBid: bytes32 = keccak256(concat(
			convert(value, bytes32),
			convert(fake, bytes32),
			secret
		))
		
		# Bid not revealed. do not refund
		if (blindedBid != bidToCheck.blindedBid):
			assert 1 == 0
			continue

		# Bid revealed - refund deposit
		refund += bidToCheck.deposit
		if (not fake and bidToCheck.deposit >= value):
			if (self.placeBid(msg.sender, value)):
				refund -= value
		
		zeroBytes32: bytes32 = EMPTY_BYTES32
		bidToCheck.blindedBid = zeroBytes32

	if (refund != 0):
		send(msg.sender, refund)


@external
def withdraw():
	pendingAmount: uint256 = self.pendingReturns[msg.sender]
	if (pendingAmount > 0):
		self.pendingReturns[msg.sender] = 0
		send(msg.sender, pendingAmount)

@external
def auctionEnd():
	assert block.timestamp > self.revealEnd
	assert not self.ended

	log AuctionEnded(self.highestBidder, self.highestBid)
	self.ended = True

	send(self.beneficiary, self.highestBid)