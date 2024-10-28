from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# @api_view(['GET'])
# def user_index(request):
# 	data = {"message": "Hello, world from user app !"}
# 	return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
def user_index(request):
	data = {"message": "Hello, world from user app !"}
	template = loader.get_template("/ted/templates/ted.index.html")
	return HttpResponse(template.render(context, request))