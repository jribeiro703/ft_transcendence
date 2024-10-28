from rest_framework import status
from rest_framework import permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView

from .serializers import UserCreateSerializer

@api_view(['GET'])
def user_index(request):
	data = {"message": "Hello, world from user app !"}
	return Response(data, status=status.HTTP_200_OK)

class CreateUserView(CreateAPIView):
	model = get_user_model()
	permission_classes = [permissions.AllowAny]
	serializer_class = UserCreateSerializer