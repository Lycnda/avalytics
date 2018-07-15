# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
from django.template import RequestContext, loader
from django.shortcuts import render_to_response

import csv

# Create your views here.

from django.http import HttpResponse


def openCSV(file_name):
	session_data = []
	with open(file_name, 'rb') as csvfile:
		spamreader = csv.reader(csvfile)
		for row in spamreader:
			session_data.append(row)

	return session_data

def index(request):
	session_data = openCSV('session_data_for_use.csv')

	return render_to_response("index.html", {"session_data":session_data}, RequestContext(request))


def pages(request):

	return render_to_response("pages.html", {}, RequestContext(request))


def summarySession(request):
	onejuly = openCSV("onejuly.csv")
	twojuly = openCSV("twojuly.csv")
	threejuly = openCSV("threejuly.csv")
	fourjuly = openCSV("fourjuly.csv")

	summary_stats = openCSV("summary_stats_df.csv")

	return render_to_response("summarySession.html", {"onejuly":onejuly, "threejuly":threejuly, "twojuly":twojuly, "fourjuly":fourjuly, "summary_stats":summary_stats}, RequestContext(request))


def barTest(request):
	return render_to_response("bar.html", {}, RequestContext(request))