from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
	path('', TemplateView.as_view(template_name="index_test.html")),	# Home page
    path('admin/', admin.site.urls),
	path('user/', include('user.urls')),
	path('game/', include('game.urls')),
	path('tournament/', include('tournament.urls')),
	path('prometheus/', include('django_prometheus.urls')),
]

if settings.DEBUG:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])
	urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)