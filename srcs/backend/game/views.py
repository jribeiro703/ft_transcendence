from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import CreateAPIView
from .serializers import GameCreateSerializer
from .models import Game
from user.permissions import IsOwner

@api_view(['GET'])
def game_index(request):
	data = {"message": "Hello, world from game app !"}
	return Response(data, status=status.HTTP_200_OK)

class GameCreateView(CreateAPIView):
	queryset = Game.objects.all()
	serializer_class = GameCreateSerializer
	authentication_classes = [JWTAuthentication]
	permission_classes = [IsAuthenticated, IsOwner]
