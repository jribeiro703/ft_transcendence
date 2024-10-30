from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# from django_otp.decorators import otp_required

from .serializers import UserCreateSerializer, CookieTokenRefreshSerializer
from .models import User

@api_view(['GET'])
def user_index(request):
	data = {"message": "Hello, world from user app !"}
	return Response(data, status=status.HTTP_200_OK)

class CreateUserView(CreateAPIView):
	model = get_user_model()
	permission_classes = [AllowAny]
	serializer_class = UserCreateSerializer

class ActivateAccountView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = get_object_or_404(User, pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({"message": "Account activated successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Activation link is invalid"}, status=status.HTTP_400_BAD_REQUEST)
        
# @otp_required
class CookieTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24
            response.set_cookie('refresh_token', response.data['refresh'], max_age=cookie_max_age, httponly=True)
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)

class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24
            response.set_cookie('refresh_token', response.data['refresh'], max_age=cookie_max_age, httponly=True)
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
				
# class UserViewSet(viewsets.ModelViewSet):
# 	queryset = User.objects.all()
# 	serializer_class = UserSerializer
# 	authentication_classes = [JWTAuthentication]
    
# 	def get_permissions(self):
# 		if self.action == 'create':
# 			permission_classes = [AllowAny]
# 		elif self.action in ['update', 'destroy', 'retrieve']:
# 			permission_classes = [IsAuthenticated, IsOwner | IsAdminUser]
# 		else:
# 			permission_classes = [IsAdminUser]
# 		return [permission() for permission in permission_classes]

# @api_view(['POST'])
# def login(request):
