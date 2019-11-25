from django.urls import path
from django.conf.urls import url
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path('api/all/community', views.allCommunities),
    url(r'^api/community/(?P<name>[\w]+)$', views.communityDetails),
    path('api/create/community', views.createCommunity),
    # path('api/delete/community', views.createCommunity),

    path('api/<username>/communities', views.usersCommunities),


    # path('api/post/', views.makePost),
    # path('api/post/all', views.PostListCreate.as_view()),
    # url(r'^api/post/(?P<pk>[\w]+)$', views.postDetails)
]
