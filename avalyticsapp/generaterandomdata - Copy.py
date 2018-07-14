from random import randrange
import datetime 
import random
import csv


def writeDatatoCSV(data):

	with open('clicks.csv', 'wb') as csvfile:
	    spamwriter = csv.writer(csvfile)

	    for dt in data: 
	    	spamwriter.writerow(dt)

	print "Done writing data to a csv"

quantity = 150
clicks = []
for i in range(0,150):
	rand_val = random.randint(0, 80)
	clicks.append([rand_val])

writeDatatoCSV(clicks)

