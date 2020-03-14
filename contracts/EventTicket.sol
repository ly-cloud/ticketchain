pragma solidity ^0.5.0;

contract EventTicket {
    // a template contract for event organisers to deploy
    // for each unique event

    TicketChain ticketChain;
    address _owner;

	constructor() public {
	  _owner = msg.sender;
	}

    struct Ticket {
      uint eventId;
      uint ticketId;
      uint originalPrice;
      string eventName;
      uint eventDateTime;
	  string venue;
	  uint seatNumber;
	  uint openSaleTime;
  	  uint closingSaleTime;
  	  address currentOwner;
  	  address prevOwner;
    }

    ticket[] tickets;

    mapping (address => bool) organisers;
    uint nextEventId;
    mapping (uint => address) eventBy;
    uint nextTicketId;

    modifier onlyOwner() {
      require(_owner == msg.sender);
      _;
    }

	modifier onlyTicketChain() {
	  require(ticketChain == msg.sender);
	  _;
	}

	modifier onlyOrganiser() {
	  require(organisers[msg.sender]);
	  _;
	}

	function setTicketChain(TicketChain ticketChainAddr) public onlyOwner { // callable by owner
      ticketChain = ticketChainAddr;
    }

    // new event
    function mint(uint256 price, string eventName, uint256 eventDateTime, string venue, uint256 seatNumber, uint256 openSaleTime, uint256 closingSaleTime, uint256 quantity) onlyOrganiser {
	  for(uint i = 0; i < quantity; i++){
		Ticket memory newTicket = Ticekt(nextEventId, nextTicketId, price, eventName, eventDateTime, venue, seatNumber, openSaleTime, closingSaleTime, msg.sender, address(0));
		tickets[nextTicketId] = newTicket;
		nextTicketId++;
	  }
	  eventBy[eventId] = msg.sender;

	  return nextEventId++;
    }

    // existing event
    function mint(uint256 eventId, uint256 price, string eventName, uint256 eventDateTime, string venue, uint256 seatNumber, uint256 openSaleTime, uint256 closingSaleTime, uint256 quantity) onlyOrganiser {
	  for(uint i = 0; i < quantity; i++){
		Ticket memory newTicket = Ticekt(eventId, nextTicketId, price, eventName, eventDateTime, venue, seatNumber, openSaleTime, closingSaleTime, msg.sender, address(0));
		tickets[nextTicketId] = newTicket;
		nextTicketId++;
	  }

	  return eventId;
    }

    // transfer to ticketChain
    function transfer(uint256 ticketId) public {
      tickets[ticketId].prevOwner = tickets[ticketId].owner;
      tickets[ticketId].owner = ticketChain;
    }

    // transfer from ticketChain
    function transferTo(uint256 ticketId, address newOwner) onlyTicketChain public {
      tickets[ticketId].prevOwner = tickets[ticketId].owner;
      tickets[ticketId].owner = newOwner;
    }

    function balanceOf(uint256 eventId) public view returns(uint256) {
      uint256 counter = 0;
      for (uint i = 0; i< tickets.length; i++) {
        if(tickets[i].currentOwner == msg.sender && tickets[i].eventId == eventId) {
          counter ++;
        }
      }
      return counter;
    }

    function ownerOf(uint256 ticketId) public view returns(address) {
      return tickets[ticketId].currentOwner;
    }

    function refund(uint256 eventId) public onlyOrganiser payable {
      require(eventBy[eventId] == msg.sender);
      for (uint i = 0; i< tickets.length; i++) {
        if(tickets[i].currentOwner != msg.sender && tickets[i].eventId == eventId) {
          address payable recipient = address(uint160(tickets[i].currentOwner));
          recipient.transfer(tickets[i].originalPrice);
        }
      }
    }

    function burn(uint256 ticketId) public onlyOrganiser {
      delete tickets[ticketId];
    }

    function getPrevOwner(uint256 ticketId) public view returns(address) {
      return tickets[ticketId].prevOwner;
    }

    function getOriginalPrice(uint256 ticketId) public view returns(uint256) {
      return tickets[ticketId].originalPrice;
    }

    function getOpenSaleTime(uint256 ticketId) public view returns(uint256) {
      return tickets[ticketId].openSaleTime;
    }

    function getClosingSaleTime(uint256 ticketId) public view returns(uint256) {
      return tickets[ticketId].closingSaleTime;
    }

}
