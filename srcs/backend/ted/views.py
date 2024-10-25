from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from .models import Message
from django.template import loader

def index(request):
	context = {
		"gameTitle": "PING",
		"number": 42,
		"userList": ["Yabing", "Ludo", "David", "Thibaud"]
		}
	template = loader.get_template("ted/index.html")
	return HttpResponse(template.render(context, request))

def get_messages(request):
	messages = Message.objects.all().values('content')
	return JsonResponse(list(messages), safe=False)