# problem statement: json => table

# import needed modules
import pandas as pd

# command
print("Helper")
print("[1] user database")
print("[2] listing database")
print("[3] seller database")
print("[4] exit")

run = True
while run:
	command = int(input("command: "))
	if command == 1:
		df = pd.read_json("users.json").transpose()
		print(df)
	elif command == 2:
		df = pd.read_json("listing.json")
		print(df)
	elif command == 3:
		df = pd.read_json("sellers.json").transpose()
		print(df)
	else:
		run = False

print("Table executed successfully!")
