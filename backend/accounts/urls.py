from django.urls import path

from . import views

urlpatterns = [
    path("register/", views.register_view),
    path("login/", views.login_view),
    path("logout/", views.logout_view),
    path("me/", views.current_user_view),
    path("users/", views.users_list_view),
    path("users/<int:user_id>/admin/", views.user_admin_flag_view),
    path("users/<int:user_id>/", views.user_delete_view),
]
