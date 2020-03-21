pragma solidity ^0.5.0;

import './EventTicket.sol';
import './LoyaltyCoin.sol';

contract TicketChain {
    address OWNER;
    LoyaltyCoin loyaltyCoin;
    uint commission;
    uint rate;
    uint redeemRate;
    uint eventIdCounter;

    mapping(uint => EventTicket) events;

    constructor(LoyaltyCoin lcAddress) public {
        loyaltyCoin = lcAddress;
        OWNER = msg.sender;
    }

    struct Listing {
    	address seller;
        uint price;
    }

    mapping(uint => mapping(uint => Listing)) private ticketsListing;


    modifier onlyOwner() {
        require(msg.sender == OWNER);
        _;
    }
    
    function newEvent() public returns(uint) {
        EventTicket etContract = EventTicket(msg.sender);
        require(etContract.isEventTicket());
        eventIdCounter++;
        events[eventIdCounter] = etContract;
        return eventIdCounter;
    }
    
    function list(uint256 eventId, uint256 ticketId, uint256 price) public {
        EventTicket eventTicket = events[eventId];
        require(price <= eventTicket.getOriginalPrice(ticketId));
        require(msg.sender <= eventTicket.getCurrOwner(ticketId));

        Listing memory newListing = Listing(msg.sender, price);
        ticketsListing[eventId][ticketId] = newListing;
    }
    
    function massList(uint256 eventId, uint256[] memory ticketIds, uint256 price) public {
        EventTicket eventTicket = events[eventId];
        require(price <= eventTicket.getOriginalPrice(ticketIds[0]));
        require(msg.sender <= eventTicket.getCurrOwner(ticketIds[0]));
        require(!eventTicket.getIsListed());
        
        for (uint i=0; i < ticketIds.length; i++) {
            uint ticketId = ticketIds[i];
            Listing memory newListing = Listing(msg.sender, price);
            ticketsListing[eventId][ticketId] = newListing;
        }
    }
    
    function updatePrice(uint256 eventId, uint256 ticketId, uint256 newPrice) public {
        EventTicket eventTicket = events[eventId];
        require(msg.sender <= eventTicket.getPrevOwner(ticketId));

        ticketsListing[eventId][ticketId].price = newPrice;
    }
    
    function unlist(uint256 eventId, uint256 ticketId) public {
        EventTicket eventTicket = events[eventId];
        require(msg.sender <= eventTicket.getPrevOwner(ticketId));
        
        eventTicket.transferTo(ticketId, msg.sender);
        delete ticketsListing[eventId][ticketId];
    }
    
    function buy(uint256 eventId, uint256 ticketId, uint256 loyalty) public payable {
        EventTicket eventTicket = events[eventId];
        require(ticketsListing[eventId][ticketId].price < msg.value); 
        require(block.timestamp >= eventTicket.getOpenSaleTime(ticketId) && block.timestamp < eventTicket.getClosingSaleTime(ticketId));
        
        //without loyalty coin
        address payable recipient = address(uint160(eventTicket.getPrevOwner(ticketId)));
        recipient.transfer(msg.value - commission);
        eventTicket.transferTo(ticketId, msg.sender);
        
        //loyaltyCoin.issuePoint(msg.sender, rate);
    }
    
    function getRedeemRate() public view returns(uint256) {
        return redeemRate;
    }

    function setRedeemRate(uint256 conversion) public onlyOwner {
        redeemRate = conversion;
    }

    function getRate() public view returns(uint256) {
        return rate;
    }

    function setRate(uint256 amount) public onlyOwner {
        rate = amount;
    }

    function getCommission() public view returns(uint256) {
        return commission;
    }

    function setCommission(uint256 value) public onlyOwner {
        commission = value;
    }

    function withdraw() public {
        if(msg.sender == OWNER)
        msg.sender.transfer(address(this).balance);
    }
    
}