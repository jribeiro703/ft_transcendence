from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView

from .models import Game

@api_view(['GET'])
def game_index(request):
	data = {"message": "Hello, world from game app !"}
	return Response(data, status=status.HTTP_200_OK)

class RegisterGameView(CreateAPIView):
	queryset = Game.objects.all()