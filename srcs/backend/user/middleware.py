from django.utils import timezone
from datetime import timedelta
from django.conf import settings

class UserActivityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        if request.user.is_authenticated:
            # Update last activity
            request.user.last_activity = timezone.now()
            request.user.is_online = True
            request.user.save()

        return response

    def process_view(self, request, view_func, view_args, view_kwargs):
        if request.user.is_authenticated:
            # Check if user has been inactive for too long
            inactive_time = getattr(settings, 'USER_INACTIVE_TIME', 300)  # 5 minutes default
            if request.user.last_activity:
                time_since_activity = timezone.now() - request.user.last_activity
                if time_since_activity > timedelta(seconds=inactive_time):
                    request.user.is_online = False
                    request.user.save()