from django.urls import path
from . import views
from django.conf.urls import url

urlpatterns = [
    path('api/users/', views.user_list ),
    url(r'^api/users/(?P<username>[\w]+)$', views.user_detail),
    #url(r'^api/users/(?P<username>[\w]+)/observations$', views.user_observations_list),
    path('api/profiles/', views.profile_list ),
    url(r'^api/profiles/(?P<username>[\w]+)$', views.profile_detail),
]
