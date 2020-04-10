/* eslint-disable jsx-a11y/anchor-is-valid */
/**
 *
 * TransactionModal
 *
 */

import React from 'react';
import Web3 from 'web3';
import {
  Modal,
  Card,
  Flex,
  Image,
  Heading,
  Link,
  Box,
  Icon,
  Text,
  Loader,
  Tooltip,
} from 'rimble-ui';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import MetaMaskIcon from './MetaMaskIcon.svg';
// import styled from 'styled-components';

function TransactionModal(props) {
  const {
    fromAddress,
    toAddress,
    ticket,
    // transactionFee,
    modalIsOpen,
    onChangeModalIsOpen,
  } = props;
  return (
    <div>
      {ticket && (
        <Modal isOpen={modalIsOpen}>
          <Card borderRadius={1} p={0} overflow="scroll">
            <Flex
              justifyContent="space-between"
              alignItems="center"
              borderBottom={1}
              borderColor="near-white"
              p={[3, 4]}
              pb={3}
            >
              <Image
                src={MetaMaskIcon}
                aria-label="MetaMask extension icon"
                size="24px"
              />
              <Heading textAlign="center" as="h1" fontSize={[2, 3]} px={[3, 0]}>
                Confirm your transfer in Metamask
              </Heading>
              <Link onClick={() => onChangeModalIsOpen(false)}>
                <Icon name="Close" color="moon-gray" aria-label="Close" />
              </Link>
            </Flex>
            <Box p={[3, 4]}>
              <Flex justifyContent="space-between" flexDirection="column">
                <Text textAlign="center">
                  Double check the details here – your transfer can&apos;t be
                  reversed.
                </Text>
                <Flex
                  alignItems="stretch"
                  flexDirection="column"
                  borderRadius={2}
                  borderColor="moon-gray"
                  borderWidth={1}
                  borderStyle="solid"
                  overflow="hidden"
                  my={[3, 4]}
                >
                  <Box bg="primary" px={3} py={2}>
                    <Text color="white">ETH transfer</Text>
                  </Box>

                  <Flex
                    p={3}
                    borderBottom="1px solid gray"
                    borderColor="moon-gray"
                    alignItems="center"
                    flexDirection={['column', 'row']}
                  >
                    <Box
                      position="relative"
                      height="2em"
                      width="2em"
                      mr={[0, 3]}
                      mb={[3, 0]}
                    >
                      <Box position="absolute" top="0" left="0">
                        <Loader size="2em" />
                      </Box>
                    </Box>
                    <Box>
                      <Text
                        textAlign={['center', 'left']}
                        fontWeight="600"
                        fontSize={1}
                        lineHeight="1.25em"
                      >
                        Waiting for confirmation...
                      </Text>
                      <Text
                        textAlign={['center', 'left']}
                        fontWeight="400"
                        fontSize={1}
                        lineHeight="1.25em"
                      >
                        Check for Metamask popup in your browser
                      </Text>
                    </Box>
                  </Flex>

                  <Flex
                    justifyContent="space-between"
                    bg="near-white"
                    p={[2, 3]}
                    borderBottom="1px solid gray"
                    borderColor="moon-gray"
                    flexDirection={['column', 'row']}
                  >
                    <Text
                      textAlign={['center', 'left']}
                      color="near-black"
                      fontWeight="bold"
                    >
                      From (you)
                    </Text>
                    <Link
                      href={`https://rinkeby.etherscan.io/address/${fromAddress}`}
                      target="_blank"
                    >
                      <Tooltip message={fromAddress}>
                        <Flex
                          justifyContent={['center', 'auto']}
                          alignItems="center"
                          flexDirection="row-reverse"
                        >
                          <Text fontWeight="bold">{`${fromAddress.substring(
                            0,
                            6,
                          )}...${fromAddress.substring(
                            fromAddress.length - 4,
                          )}`}</Text>
                          <Flex
                            mr={2}
                            p={1}
                            borderRadius="50%"
                            bg="primary-extra-light"
                            height="2em"
                            width="2em"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon
                              color="primary"
                              name="RemoveRedEye"
                              size="1em"
                            />
                          </Flex>
                        </Flex>
                      </Tooltip>
                    </Link>
                  </Flex>

                  <Flex
                    justifyContent="space-between"
                    bg="light-gray"
                    p={[2, 3]}
                    borderBottom="1px solid gray"
                    borderColor="moon-gray"
                    flexDirection={['column', 'row']}
                  >
                    <Text
                      textAlign={['center', 'left']}
                      color="near-black"
                      fontWeight="bold"
                    >
                      To (TicketChain)
                    </Text>
                    <Link
                      href={`https://rinkeby.etherscan.io/address/${toAddress}`}
                      target="_blank"
                    >
                      <Tooltip message={toAddress}>
                        <Flex
                          justifyContent={['center', 'auto']}
                          alignItems="center"
                          flexDirection="row-reverse"
                        >
                          <Text fontWeight="bold">{`${toAddress.substring(
                            0,
                            6,
                          )}...${toAddress.substring(
                            toAddress.length - 4,
                          )}`}</Text>
                          <Flex
                            mr={2}
                            p={1}
                            borderRadius="50%"
                            bg="primary-extra-light"
                            height="2em"
                            width="2em"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Icon
                              color="primary"
                              name="RemoveRedEye"
                              size="1em"
                            />
                          </Flex>
                        </Flex>
                      </Tooltip>
                    </Link>
                  </Flex>

                  <Flex
                    justifyContent="space-between"
                    bg="near-white"
                    py={[2, 3]}
                    px={3}
                    alignItems="center"
                    borderBottom="1px solid gray"
                    borderColor="moon-gray"
                    flexDirection={['column', 'row']}
                  >
                    <Text
                      textAlign={['center', 'left']}
                      color="near-black"
                      fontWeight="bold"
                    >
                      Amount
                    </Text>
                    <Flex
                      alignItems={['center', 'flex-end']}
                      flexDirection={['row', 'column']}
                    >
                      <Text
                        mr={[2, 0]}
                        color="near-black"
                        fontWeight="bold"
                        lineHeight="1em"
                      >
                        {Web3.utils.fromWei(ticket.price, 'ether')} ETH
                      </Text>
                      {/* <Text color="mid-gray" fontSize={1}>
                        $1450 USD TODO: Convert to Fiat currency 
                      </Text> */}
                    </Flex>
                  </Flex>

                  {/* <Flex
                    justifyContent="space-between"
                    bg="light-gray"
                    py={[2, 3]}
                    px={3}
                    alignItems="center"
                    borderBottom="1px solid gray"
                    borderColor="moon-gray"
                    flexDirection={['column', 'row']}
                  >
                    <Flex alignItems="center">
                      <Text
                        textAlign={['center', 'left']}
                        color="near-black"
                        fontWeight="bold"
                      >
                        Estimated Transaction fee
                      </Text>
                      <Tooltip
                        message="Pays the Ethereum network to process your transaction, even if the transaction fails."
                        position="top"
                      >
                        <Icon
                          ml={1}
                          name="InfoOutline"
                          size="14px"
                          color="primary"
                        />
                      </Tooltip>
                    </Flex>

                    <Flex
                      alignItems={['center', 'flex-end']}
                      flexDirection={['row', 'column']}
                    >
                      <Text
                        mr={[2, 0]}
                        color="near-black"
                        fontWeight="bold"
                        lineHeight="1em"
                      >
                        {transactionFee} ETH
                      </Text>
                      <Text color="mid-gray" fontSize={1}>
                        $0.00112 TODO: Convert to Fiat currency
                      </Text>
                    </Flex>
                  </Flex> */}
                </Flex>
                <Button
                  color="secondary"
                  variant="contained"
                  onClick={() => onChangeModalIsOpen(false)}
                >
                  Cancel purchase
                </Button>
              </Flex>
            </Box>
          </Card>
        </Modal>
      )}
    </div>
  );
}

TransactionModal.propTypes = {
  fromAddress: PropTypes.string,
  toAddress: PropTypes.string,
  ticket: PropTypes.object,
  // transactionFee: PropTypes.string,
  modalIsOpen: PropTypes.bool,
  onChangeModalIsOpen: PropTypes.func,
};

export default TransactionModal;
