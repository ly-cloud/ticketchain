const EventTicket = artifacts.require("EventTicket");
const TicketChain = artifacts.require("TicketChain");

contract("TicketChain", accounts => {
  let chain;
  let event;
  let commission = 20;
  let newCommission = 10;
  let originalPrice = 400;
  let belowPrice = 200;
  let abovePrice = 800;
  let startSeatNum = 0;
  let quantity = 2;
  let newSeatNum = 10;
  let currDateTime = Math.floor(new Date().getTime()/1000);
  let day = 86400;
  const chainOwner = accounts[0];
  const organiser = accounts[1];
  const buyerA = accounts[2];
  const buyerB = accounts[3];
  const buyerC = accounts[4];

  it("Owner deploy TicketChain and set commission", () => 
    TicketChain.deployed({ from: chainOwner })
    .then((_inst) => {
      chain = _inst;
      chain.setCommission(commission)
    }).then(() => {
      return chain.getCommission.call();
    }).then(rsl => {
      assert.equal(rsl.valueOf(), commission);
    })
  );

  it("Event organiser creates and updates event name, event venue, event date time, open sale time, closing sale time", () => 
    EventTicket.deployed(chain.address, "abc", 1234567890, "123", 1234567890, 1234567890, { from: organiser })
    .then((_inst) => {
      event = _inst;

       //Event Name
      event.updateEventName('Test Event');
    }).then(() => {
      return event.getEvent();
    }).then((rsl) => {
      assert.equal(rsl[1].valueOf(), 'Test Event');

      //Event Venue
      event.updateVenue('Test Venue');
    }).then(() => {
      return event.getEvent();
    }).then((rsl) => {
      assert.equal(rsl[3].valueOf(), 'Test Venue');

      //Event Date Time
      event.updateEventDateTime(currDateTime + day);
    }).then(() => {
      return event.getEvent();
    }).then((rsl) => {
      assert.equal(rsl[2].valueOf(), currDateTime + day);

      //Open Sale Time
      event.updateOpenSaleTime(currDateTime);
    }).then(() => {
      return event.getEvent();
    }).then((rsl) => {
      assert.equal(rsl[4].valueOf(), currDateTime);

      //Closing Sale Time
      event.updateClosingSaleTime(currDateTime + day/4);
    }).then(() => {
      return event.getEvent();
    }).then((rsl) => {
      assert.equal(rsl[5].valueOf(), currDateTime + day/4);
    })
  );    

  it("Event organiser mass mint 5 tickets", () => 
    event.massMint(0, startSeatNum, 5, { from: organiser })
    .then(() => {
      assert.fail("Unable to mass mint as EventTicket not initialise")
    }).catch(() => {
      console.log("Assert.fail tested: Unable to mass mint as EventTicket not initialise");
    })
  );

  it("Event organiser initialise event", () => 
    event.initialise()
    .then(() => {
      return event.getEventIdSet();
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), true);
    })
  );

  it("Event organiser mass mint 2 tickets", () => 
    event.massMint(originalPrice, startSeatNum, quantity)
    .then(() => {
      return event.getTotalTickets();
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), quantity);
    })
  );

  it("Event organiser mint 1 ticket", () => 
    event.mint(originalPrice, newSeatNum)
    .then(() => {
      return event.getTotalTickets();
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), quantity + 1);
    })
  );

  it("Event organiser mass list 3 tickets", () => 
    event.massList()
    .then(() => {
      return event.getIsListed();
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), true);
      return chain.getPrice(1, 1);
     }).then((rsl1) => {
      assert.equal(rsl1.valueOf(), originalPrice);
      return chain.getPrice(1, 2);
    }).then((rsl2) => {
      assert.equal(rsl2.valueOf(), originalPrice);
      return chain.getPrice(1, 3);
    }).then((rsl3) => {
      assert.equal(rsl3.valueOf(), originalPrice);
    })
  );

  it("Event organiser updates event name, event venue, event date time, open sale time, closing sale time", () => 
    //Event Name
    event.updateEventName.call('qwerty')
    .then(() => {
      assert.fail("Unable to update")
    }).catch((err) => {
      console.log("Assert.fail tested: Unable to update Event Name as tickets are listed");

      //Event Venue
      return event.updateVenue.call('ghjkl');
    }).then(() => {
      assert.fail("Unable to update")
    }).catch((err1) => {
      console.log("Assert.fail tested: Unable to update Event Venue as tickets are listed");

      //Event Date Time
      return event.updateEventDateTime.call(0);
    }).then(() => {
      assert.fail("Unable to update")
    }).catch((err2) => {
      console.log("Assert.fail tested: Unable to update Event Date Time as tickets are listed");

      //Open Sale Time
      return event.updateOpenSaleTime.call(0);
    }).then(() => {
      assert.fail("Unable to update")
    }).catch((err3) => {
      console.log("Assert.fail tested: Unable to update Open Sale Time as tickets are listed");
      
      //Closing Sale Time
      return event.updateClosingSaleTime.call(0);
    }).then(() => {
      assert.fail("Unable to update")
    }).catch((err4) => {
      console.log("Assert.fail tested: Unable to update Closing Sale Time as tickets are listed");
    })
  );

  it("Buyer A buys 2 tickets", () => 
    chain.buy(1, 1, {from: buyerA, value: 2000})
    .then(() => {
      return event.getCurrOwner(1);
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), buyerA, "Buyer A was not able to purchase ticket with id = 1"); 

      chain.buy(1, 2, { from: buyerA, value: 2000});
    }).then(() => {
      return event.getCurrOwner(2);
    }).then(rsl => {
      assert.equal(rsl.valueOf(), buyerA, "Buyer A was not able to purchase ticket with id = 2");
    })
  );

  it("Buyer A list ticket above original price", () => 
    event.transfer(1, {from: buyerA})
    .then(() => {
      return chain.list(1, 1, abovePrice, 0, {from: buyerA});
    }).then(() => {
      assert.fail("Unable to list ticket")
    }).catch((err) => {
      console.log("Assert.fail tested: Unable to list ticket above original price");
    })
  );

  it("Buyer A list ticket below original price", () => 
    chain.list(1, 1, belowPrice, 0, {from: buyerA})
    .then(() => {
      return chain.getPrice.call(1, 1);
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), belowPrice, "Buyer A was not able to list ticket at below original price");
    })
  );

  it("Buyer B buys 1 ticket", () => 
    chain.buy(1, 1, {from: buyerB, value: 1000})
    .then(() => {
      return event.getCurrOwner(1);
    }).then(rsl => {
      assert.equal(rsl.valueOf(), buyerB, "Buyer B was not able to purchase ticket");
    })
  );

  it("Owner changes value of commission", () => 
    chain.setCommission(newCommission)
    .then(() => {
      return chain.getCommission();
    }).then(rsl => {
        assert.equal(rsl.valueOf(), newCommission);
    })
  );

  it("Buyer C buys 1 ticket", () => 
    chain.buy(1, 3, {from: buyerC, value: 2000})
    .then(() => {
      return event.getCurrOwner(3);
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), buyerC, "Buyer C was not able to purchase ticket"); 
    })
  );  

  it("Buyer C list ticket at original price", () => 
    event.transfer(3, {from: buyerC})
    .then(() => {
      chain.list(1, 3, originalPrice, 0, {from: buyerC});
    }).then(() => {
      return chain.getPrice.call(1, 3);
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), originalPrice, "Buyer C was not able to list ticket at original price");
    })
  );

  it("Buyer C update price of ticket to below original price", () => 
    chain.updatePrice(1, 3, belowPrice, {from: buyerC})
    .then(() => {
      return chain.getPrice.call(1, 3);
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), belowPrice, "Buyer C was not able to list ticket at below original price");
    })
  );

  it("Buyer C unlist ticket", () =>
    chain.unlist(1, 3, {from: buyerC})
    .then(() => {
      return event.getCurrOwner(3);
    }).then(rsl => {
      assert.equal(rsl.valueOf(), buyerC, "Buyer C was not able to unlist ticket");
    })
  );

  it("Buyer A, Buyer B and Buyer C enter the concert and tickets burnt", () => 
    //Buyer B
    event.burn(1)
    .then(() => {
      return event.getCurrOwner(1);
    }).then((rsl) => {
      assert.equal(rsl.valueOf(), 0);
      //Buyer A
      event.burn(2);
    }).then(() => {
      return event.getCurrOwner(2);
    }).then((rsl1) => {
       assert.equal(rsl1.valueOf(), 0);
       //Buyer C
       event.burn(3);
    }).then(() => {
      return event.getCurrOwner(3);
    }).then((rsl2) => {
      assert.equal(rsl2.valueOf(), 0);
    })
  );

});