from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

@api_view(['GET'])
def livechat_index(request):
    data = {"message": "Hello, world from livechat app !"}
    return Response(data, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def room(request, livechat):
#     data = {"livechat": livechat}
#     return Response(data, status=status.HTTP_200_OK)
