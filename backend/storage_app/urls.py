from django.urls import path

from . import views

urlpatterns = [
    path("files/", views.files_list_view),
    path("files/upload/", views.upload_file_view),
    path("files/<int:file_id>/", views.delete_file_view),
    path("files/<int:file_id>/update/", views.update_file_view),
    path("files/<int:file_id>/download/", views.download_file_view),
    path("public/<str:token>/", views.public_file_info_view),
    path("public/<str:token>/download/", views.public_download_view),
]
