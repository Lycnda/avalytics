from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.summarySession, name='summarySession'),
    url(r'singleusersession', views.index, name='index'),
    url(r'pages', views.pages, name='pages'),
]