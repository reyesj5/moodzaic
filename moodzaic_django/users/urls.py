from django.urls import path
from . import views
from django.conf.urls import url

urlpatterns = [
    path('api/all/users/', views.allUsers ),
    url(r'^api/users/(?P<username>[\w]+)$', views.userDetails),
    url(r'^api/users/(?P<username>[\w]+)/observations$', views.allUserObservations),
    path('api/all/profiles/', views.profile_list ),
    url(r'^api/profiles/(?P<username>[\w]+)$', views.profile_detail),
]
