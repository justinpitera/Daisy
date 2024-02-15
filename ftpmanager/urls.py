from django.urls import path, re_path
from . import views

urlpatterns = [
    path('ftpmanager/list_files/', views.list_ftp_files, name='list_ftp_files'),
    path('ftpmanager/list_files/<path:path>/', views.list_ftp_files, name='list_ftp_files'),  # For navigating directories
    path('upload-to-ftp/', views.upload_to_ftp, name='upload_to_ftp'),
     path('delete_file/<path:file_name>/', views.delete_file, name='delete_file'),
    path('delete-directory/<str:dir_name>/', views.delete_directory, name='delete_directory'),
    re_path(r'^download/(?P<path>.*)$', views.download_file, name='download_file'),  # For downloading files
    re_path(r'^list-files/(?P<path>.*)$', views.list_ftp_files, name='list_ftp_files'),
    re_path(r'^upload-file/(?P<path>.*)$', views.upload_file, name='upload_file'),
    path('move/', views.move_file_or_folder, name='move_file_or_folder'),

    #testing
    path('delete-directory/<path:current_path>/<str:dir_name>/', views.delete_directory, name='delete_directory'),
    path('rename-file/<path:current_path>/', views.rename_file, name='rename_file'),


    path('create-directory/<path:current_path>/', views.create_directory, name='create_directory'),
]