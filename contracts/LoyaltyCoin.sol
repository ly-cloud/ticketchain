// pragma solidity ^0.5.0;
//
// contract LoyaltyCoin {
//     // for loyalty system
//
//     TicketChain ticketChain;
//     address _owner;
//
//     constructor() public {
//         _owner = msg.sender;
//     }
//
//     mapping (address => bool) customers;
//     mapping (address => uint256) balances;
//     mapping (uint256 => bool) transactions;
//
//     event Redeem (uint transactionId, uint loyalty);
//
//     modifier onlyOwner() {
//         require(_owner == msg.sender);
//         _;
//     }
//
//     modifier onlyTicketChain() {
//         require(ticketChain == msg.sender);
//         _;
//     }
//
//     modifier onlyCustomer() {
//         require(customers[msg.sender]);
//         _;
//     }
//
//     function setTicketChain(TicketChain ticketChainAddr) public onlyOwner { // callable by owner
//         ticketChain = ticketChainAddr;
//     }
//
//     function issuePoint(address customer, uint loyalty) public onlyTicketChain { // callable by ticketChain
//
//         //existing customer
//         if (customers[customer]) {
//             balances[customer] = pointBalance(customer) + loyalty;
//         }
//
//         //new customer
//         else {
//             customers[customer] = true;
//             balances[customer] = loyalty;
//         }
//     }
//
//     function redeemPoint(address customer, uint loyalty, uint transactionId) public onlyTicketChain { // callable by ticketChain
//
//         require(pointBalance(customer) >= loyalty, "Insufficient loyalty point balance");
//         require(transactions[transactionId] != true);
//
//         balances[customer] = pointBalance(customer) - point;
//
//         transactions[transactionId] = true;
//         emit Redeem (transactionId, loyalty);
//     }
//
//     function pointBalance(address customer) public view onlyTicketChain returns(uint256) { // callable by ticketChain; return balance of a customer
//         return balances[customer];
//     }
//
//     function myBalance() public view onlyCustomer returns(uint256) { // callable by customer; return balance of that customer
//         return balances[msg.sender];
//     }
//
// }
