from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

@api_view(['GET'])
def tournament_index(request):
	data = {"message": "Hello, world from tournament app !"}
	return Response(data, status=status.HTTP_200_OK)