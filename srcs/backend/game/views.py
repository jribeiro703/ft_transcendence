from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

@api_view(['GET'])
def game_index(request):
	data = {"message": "Hello, world from game app !"}
	return Response(data, status=status.HTTP_200_OK)