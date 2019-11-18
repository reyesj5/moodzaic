from django.urls import path
from django.conf.urls import url
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('api/community/all', views.CommunityListCreate.as_view()),
    url(r'^api/community/(?P<name>[\w]+)$', views.communityDetails),
    path('api/community/create', views.createCommunity),
    path('api/community/delete', views.createCommunity),
]
