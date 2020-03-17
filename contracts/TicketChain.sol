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

    struct TicketInfo {
        uint eventId;
        uint ticketId;
        uint price;
    }

    TicketInfo[] ticketInfos;

    mapping(uint => bool) private transactions;

    modifier onlyOwner() {
        require(msg.sender == OWNER);
        _;
    }

    modifier onlySeller(uint ticketId) {
        require(eventTicket.ownerOf(ticketId) == msg.sender);
        _;
    }

    modifier onlyPrevOwner(uint ticketId) {
        require(eventTicket.getPrevOwner(ticketId) == msg.sender);
        _;
    }

    function newEvent() public returns(uint) {
        EventTicket etContract = EventTicket(msg.sender);
        require(etContract.isEventTicket());
        eventIdCounter++;
        events[eventIdCounter] = etContract;
        return eventIdCounter;
    }

    function listTicket(uint256 eventId, uint256 ticketId, uint256 price) public onlySeller(ticketId) {
        require(price <= eventTicket.getOriginalPrice(ticketId));

        TicketInfo memory newTicketInfo = TicketInfo(eventId, ticketId, price);
        ticketInfos[ticketId] = newTicketInfo;
    }

    function changePrice(uint256 ticketId, uint256 newPrice) puclic onlyPrevOwner(ticketId) {
        require(eventTicket.ownerOf(ticketId) == _owner);
        require(newPrice <= eventTicket.getOriginalPrice(ticketId));

        ticketInfos[ticketId].price = newPrice;
    }

    function unlistTicket(uint256 ticketId) puclic onlyPrevOwner(ticketId) {
        require(eventTicket.ownerOf(ticketId) == _owner);

        eventTicket.transferTo(ticketId, msg.sender);
        ticketInfos[ticketId] = 0;
    }

    function buyTicket(uint256 ticketId, uint256 loyalty) public payable {
        require(ticketInfos[ticketId] != 0); //is listed
        require(block.timestamp >= eventTicket.getOpenSaleTime(ticketId) && block.timestamp < eventTicket.getClosingSaleTime(ticketId));

        if(loyalty = 0){
            require(msg.value >= (ticketInfos[ticketId].price + comission)); //offerred price meets minimum ask

            address payable recipient = address(uint160(eventTicket.ownerOf(ticketId)));
            recipient.transfer(msg.value - comission);    //transfer (price-comission) to real owner

            emit Transaction(nextTransactionId, ticektId);
            nextTransactionId++;

        } else {
            uint256 remaining = ticketInfos[ticketId].price + comission - loyalty/redeemRate;
            require(msg.value >= remaining);

            address payable recipient = address(uint160(eventTicket.ownerOf(ticketId)));
            recipient.transfer(remaining);    //transfer remaining amount

            //TODO from ticketChain to receipent
            //recipient.transfer(ticketInfos[ticketId].price - remaining {from: _owner});
        }

        eventTicket.transferTo(ticketId, msg.sender);
        loyaltyCoin.issuePoint(msg.sender, rate);
    }

    function getTicketInfo(uint256 ticketId) public view returns(ticketInfo) {
        return ticketInfos[ticketId];
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
        if(msg.sender == _owner)
        msg.sender.transfer(address(this).balance);
    }
}
