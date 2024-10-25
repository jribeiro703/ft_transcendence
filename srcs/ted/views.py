from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

def index(request):
	context = {
		"gameTitle": "PING",
		"number": 42,
		"userList": ["Yabing", "Ludo", "David", "Thibaud"]
		}
	template = loader.get_template("ted/index.html")
	return HttpResponse(template.render(context, request))