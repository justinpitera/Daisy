from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('dashboard.urls')),
    path('accounts/', include('accounts.urls')),
    path('lights/', include('lights.urls')),
    path('ftp/', include('ftpmanager.urls')),
]
