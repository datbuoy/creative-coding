from brownie import Contract, accounts, interface
from brownie_tokens import MintableForkToken

def main():
	dai_address = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
	usdc_address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
	provider = Contract.from_explorer('0x0000000022D53366457F9d5E68Ec105046FC4383')
	registry_address = provider.get_registry()
	amount = 100_000 * 10 ** 18
	curve_main_registry = Contract(registry_address)
	gauge_info = curve_main_registry.get_gauges('0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7')
	gauge_address = gauge_info[0][0]

	gauge_contract = interface.LiquidityGauge(gauge_address)
	lp_token = MintableForkToken(gauge_contract.lp_token())

	lp_token.approve(gauge_address, amount, {'from': accounts[0]})

	gauge_contract.deposit(
		lp_token.balanceOf(accounts[0]),
		{'from': accounts[0]}
	)

	# TODO: check the ** method and see if there's a more gas-efficient computation
	amount = 100_000 * 10 ** 18
	dai = MintableForkToken(dai_address)
	dai._mint_for_testing(accounts[0], amount)

	pool_address = curve_main_registry.find_pool_for_coins(dai_address, usdc_address)
	pool = Contract(pool_address)

	dai.approve(pool_address, amount, {'from': accounts[0]})
	pool.add_liquidity([amount, 0, 0], 0, {'from': accounts[0]})


