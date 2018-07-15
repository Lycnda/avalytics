from random import randrange
import datetime 
import random
import csv


def random_date(start,l):
   current = start
   while l >= 0:
    current = current + datetime.timedelta(minutes=randrange(60))
    yield current
    l-=1


def random_mins(quantity):
	values = []
	for i in range(0,quantity):
		# rand_val = random.uniform(1, 10)
		# g = float("{0:.2f}".format(rand_val))
		rand_val = random.randint(1, 10)
		values.append(rand_val)

	return values


def createStartnEndDates(rand_mins,quantity):
	startDate = datetime.datetime(2018, 7, 01,00,00)
	start_datetimes = []
	end_datetimes = []
	
	for x in reversed(list(random_date(startDate,quantity))):
	    #the_datetime =  x.strftime("%d/%m/%y %H:%M")
	    start_datetimes.append(x)

	if len(rand_mins) == len(start_datetimes):
		# print "the lengths are equal"
		counter = 0
		for y in start_datetimes:
			b =  y + datetime.timedelta(0,(rand_mins[counter]*60))
			counter = counter + 1
			end_datetimes.append(b)

	return start_datetimes, end_datetimes



def makeClickPaths(quantity):
	pages = ["Language Selection","Travel Type Selection","Airline Selection","Boarding Pass","Service Selection","Baggage Information and Restrictions",
			 "Information Entry", "Directional Assistance"]


	#create the same amount of paths as there are dates
	click_paths = []
	for i in range(0,quantity):
		#generate a random length (path_length) between 0 and 7
		path_length = random.randint(1,8)
		path = []
		
		for v in range(0,path_length):
			path_vals = random.randint(0,7)
			path.append(pages[path_vals])
		
		click_paths.append(path)


	return click_paths


def makeRowForData(startdates, enddates, click_paths):
	data_for_file = []
	first_row = ["User ID", "Start Date", "Start Time", "End Date", "End Time", "Click Path", "First Page", "Last Page"]
	data_for_file.append(first_row)

	user_ids_start = 1
	loop_counter = 0
	for val in startdates:
		last_page_index = len(click_paths[loop_counter]) - 1
		new_row = [user_ids_start, startdates[loop_counter].date(), startdates[loop_counter].time(), enddates[loop_counter].date(), enddates[loop_counter].time(),
				   click_paths[loop_counter], click_paths[loop_counter][0], click_paths[loop_counter][last_page_index]]
		user_ids_start += 1 
		loop_counter += 1
		data_for_file.append(new_row)

	return data_for_file


def writeDatatoCSV(data):

	with open('session_data.csv', 'wb') as csvfile:
	    spamwriter = csv.writer(csvfile)

	    for dt in data: 
	    	spamwriter.writerow(dt)

	print "Done writing data to a csv"

quantity = 150
rand_mins = random_mins(quantity+1)
startd, endd = createStartnEndDates(rand_mins,quantity)
click_paths = makeClickPaths(quantity+1)

data = makeRowForData(startd, endd, click_paths)
writeDatatoCSV(data)
