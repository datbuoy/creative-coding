from brownie import HelloWorld, accounts

def main():
	HelloWorld.deploy('Matt', {'from': accounts[0]})