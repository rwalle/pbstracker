from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router =  DefaultRouter()
router.register(r'api', views.PBSJobViewSet)
app_name = 'pbstracker'

urlpatterns = [
    path('', views.index, name='index'),
    path('', include(router.urls)),
    path('<str:jobid>/', views.index, name='job'),
    ]
