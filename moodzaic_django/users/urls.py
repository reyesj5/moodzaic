from django.urls import path, include
from . import views
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

router = DefaultRouter(trailing_slash=False)
router.register(r'users', views.UserViewSet)
router.register(r'profiles', views.ProfileViewSet)
#router.register(r'observations/create/(?P<username>[\w]+)', views.ObservationViewSet, base_name='Observation')

urlpatterns = [
    path('api/', include(router.urls)),
    url(r'^api/observations/create/(?P<username>[\w]+)', views.setObservation)
    # path('api/all/users/', views.UserViewSet.list ),
    # url(r'^api/users/(?P<username>[\w]+)$', views.UserViewSet.retrieve),
    # path('api/create/users/', views.UserViewSet.create),

    
    # path('api/all/profiles/', views.allProfiles ),
    # url(r'^api/profiles/(?P<username>[\w]+)$', views.profileDetails),

    # url(r'^api/profiles/(?P<username>[\w]+)/observations$', views.allUserObservations),
    # path('api/create/observations', views.userDetails)
]
