#!/usr/bin/python3

import pytest
from brownie import Contract
from brownie_tokens import MintableForkToken

@pytest.fixture(scope='module')
def alice(accounts):
	return accounts[0]

@pytest.fixture(scope='module')
def bob(accounts):
	return accounts[1]

def load_contract(addr):
	try:
		cont = Contract(addr)
	except:
		cont = Contract.from_explorer(addr)
	return cont

@pytest.fixture(scope='module')
def registry():
	provider = load_contract('0x0000000022D53366457F9d5E68Ec105046FC4383')
	registry = provider.get_registry()
	return load_contract(registry)

@pytest.fixture(scope='module')
def tripool(registry):
	return load_contract(registry.pool_list(0))

@pytest.fixture(scope='module')
def tripool_lp_token(registry, tripool):
	return load_contract(
		registry.get_lp_token(tripool)
	)

@pytest.fixture(scope='module')
def tripool_funded(registry, alice, tripool):
	dai_addr = registry.get_coins(tripool)[0]
	dai = MintableForkToken(dai_addr)
	amount = 1e21
	dai.approve(tripool, amount, {'from': alice})
	dai._mint_for_testing(alice, amount)
	amounts = [amount, 0, 0]
	tripool.add_liquidity(amounts, 0, {'from': alice})
	return tripool